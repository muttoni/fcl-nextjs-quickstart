import "../flow/config";
import { useState, useEffect } from "react";
import * as fcl from "@onflow/fcl";
import { Transaction } from "./Transaction";

function App() {
  const [user, setUser] = useState({ loggedIn: null })
  const [profile, setProfile] = useState(false)
  const [transactionInProgress, setTransactionInProgress] = useState(false)
  const [transactionStatus, setTransactionStatus] = useState(null)
  const [txId, setTxId] = useState(null)

  useEffect(() => fcl.currentUser.subscribe(setUser), [])

  function initTransactionState() {
    setTransactionInProgress(true)
    setTransactionStatus(-1)
  }

  const logOut = async () => {
    const logout = await fcl.unauthenticate()
    setUser(null)
    setProfile(null)
  }

  const sendQuery = async () => {
    const profile = await fcl.query({
      cadence: `
        import Profile from 0xProfile

        pub fun main(address: Address): Profile.ReadOnly? {
          return Profile.read(address)
        }
      `,
      args: (arg, t) => [arg(user.addr, t.Address)]
    })

    setProfile(profile ?? {})
  }

  const initAccount = async () => {
    initTransactionState()

    const transactionId = await fcl.mutate({
      cadence: `
        import Profile from 0xProfile

        transaction {
          prepare(account: AuthAccount) {
            // Only initialize the account if it hasn't already been initialized
            if (!Profile.check(account.address)) {
              // This creates and stores the profile in the user's account
              account.save(<- Profile.new(), to: Profile.privatePath)

              // This creates the public capability that lets applications read the profile's info
              account.link<&Profile.Base{Profile.Public}>(Profile.publicPath, target: Profile.privatePath)
            }
          }
        }
      `,
      payer: fcl.authz,
      proposer: fcl.authz,
      authorizations: [fcl.authz],
      limit: 50
    })
    setTxId(transactionId);
    fcl.tx(transactionId).subscribe(res => setTransactionStatus(res.status))
  }

  // NEW
  const executeTransaction = async () => {
    initTransactionState()

    const transactionId = await fcl.mutate({
      cadence: `
        import Profile from 0xProfile

        transaction(name: String, color: String, info: String) {
          prepare(account: AuthAccount) {
            account
              .borrow<&Profile.Base{Profile.Owner}>(from: Profile.privatePath)!
              .setName(name)

            account
              .borrow<&Profile.Base{Profile.Owner}>(from: Profile.privatePath)!
              .setInfo(info)

            account
              .borrow<&Profile.Base{Profile.Owner}>(from: Profile.privatePath)!
              .setColor(color)
          }
        }
      `,
      args: (arg, t) => [
        arg(profile.name, t.String),
        arg(profile.color, t.String),
        arg(profile.info, t.String),
      ],
      payer: fcl.authz,
      proposer: fcl.authz,
      authorizations: [fcl.authz],
      limit: 50
    })
    setTxId(transactionId);
    fcl.tx(transactionId).subscribe(res => setTransactionStatus(res.status))
  }

  const AuthedState = () => {
    return (
      <div>
        <div>Logged in as: {user?.addr ?? "No Address"}</div>
        <button onClick={logOut}>Log Out</button>

        <h2>Controls</h2>
        <button onClick={initAccount}>Create Profile</button>
        <button onClick={sendQuery}>Load Profile</button>
      </div>
    )
  }

  const UnauthenticatedState = () => {
    return (
      <div>
        <button onClick={fcl.logIn}>Log In</button>
        <button onClick={fcl.signUp}>Sign Up</button>
      </div>
    )
  }

  const ProfileComponent = () => {
    return (
      <div>
        <article className="card">

          <label htmlFor="address">
            Address
            <input type="text" id="address" name="address" defaultValue={profile.address} placeholder="Address" disabled />
          </label>
          <div className="grid">

            <label htmlFor="name">
              Name
              <input type="text" id="name" name="name" placeholder="Name" defaultValue={profile.name} onChange={(e) => setProfile({ ...profile, name: e.target.value })} autoFocus />
            </label>

            <label htmlFor="color">
              Favorite Color
              <input type="color" id="color" name="color" defaultValue={profile.color} onChange={(e) => setProfile({ ...profile, color: e.target.value })} autoFocus/>
            </label>

          </div>

          <label htmlFor="info">Bio</label>
          <textarea type="info" id="info" name="info" placeholder="Your personal info" defaultValue={profile.info} onChange={(e) => setProfile({ ...profile, info: e.target.value })} autoFocus></textarea>

          <button onClick={executeTransaction}>Update Profile</button>

        </article>
      </div>
    )
  }

  const WelcomeText = (props) => {
    return (<div>
      <h1>
        Welcome to <a href="https://docs.onflow.org">Web3</a>
      </h1>

      <p>
        { props.loggedIn 
          ? "Create a profile (or load it if you already created it)"
          : "Get started by logging in or signing up."
        }

      </p>

    </div>)
  }

  return (
    <div>
      {transactionInProgress 
        ? <Transaction transactionStatus={transactionStatus} txId={txId} />
        : <span></span>
      }
      <div className="grid">
        <div>
          {profile
            ? <ProfileComponent />
            : <WelcomeText loggedIn={user?.loggedIn} />
          }
        </div>
        <div>
          {user?.loggedIn
            ? <AuthedState />
            : <UnauthenticatedState />
          }
        </div>
      </div>
    </div>
  )
}

export default App;
