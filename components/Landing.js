import "../flow/config";
import { useAuth } from "../contexts/AuthContext";
import Profile from "./Profile";

function Landing() {
  const { currentUser, profileExists, logOut, logIn, signUp, createProfile } =
    useAuth();

  const AuthedState = () => {
    return (
      <div>
        <div>Logged in as: {currentUser?.addr ?? "No Address"}</div>
        <button onClick={logOut}>Log Out</button>

        <h2>Controls</h2>
        <button onClick={createProfile}>Create Profile</button>
      </div>
    );
  };

  const UnauthenticatedState = () => {
    return (
      <div>
        <button onClick={logIn}>Log In</button>
        <button onClick={signUp}>Sign Up</button>
      </div>
    );
  };

  const Messages = () => {
    if (!currentUser?.loggedIn) {
      return "Get started by logging in or signing up.";
    } else {
      if (profileExists) {
        return "Your Profile lives on the blockchain.";
      } else {
        return "Create a profile on the blockchain.";
      }
    }
  };

  return (
    <div>
      <div className="grid">
        <div>
          <h1>
            Welcome to <a href="https://docs.onflow.org">Web3</a>
          </h1>
          <p>
            <Messages />
          </p>
          {profileExists && <Profile />}
        </div>
        <div>
          {currentUser?.loggedIn ? <AuthedState /> : <UnauthenticatedState />}
        </div>
      </div>
    </div>
  );
}

export default Landing;
