/** Generic Profile Contract

License: MIT

I am trying to figure out a generic re-usable Profile Micro-Contract
that any application can consume and use. It should be easy to integrate
this contract with any application, and as a user moves from application
to application this profile can come with them. A core concept here is
given a Flow Address, a profiles details can be publically known. This
should mean that if an application were to use/store the Flow address of
a user, than this profile could be visible, and maintained with out storing
a copy in an applications own databases. I believe that anytime we can move
a common database table into a publically accessible contract/resource is a
win.

could be a little more than that too. As Flow Accounts can now have
multiple contracts, it could be fun to allow for these accounts to have
some basic information too. https://flow-view-source.com is a side project
of mine (qvvg) and if you are looking at an account on there, or a contract
deployed to an account I will make it so it pulls info from a properly
configured Profile Resource.

====================
## Table of Contents
====================
                                                               Line
Intro .........................................................   1
Table of Contents .............................................  27
General Profile Contract Info .................................  41
Examples ......................................................  50
  Initializing a Profile Resource .............................  59
  Interacting with Profile Resource (as Owner) ................ 112
  Reading a Profile Given a Flow Address ...................... 160
  Reading a Multiple Profiles Given Multiple Flow Addresses ... 192
  Checking if Flow Account is Initialized ..................... 225


================================
## General Profile Contract Info
================================

Currently a profile consists of a couple main pieces:
  - name – An alias the profile owner would like to be refered as.
  - avatar - An href the profile owner would like applications to use to represent them graphically.
  - color - A valid html color (not verified in any way) applications can use to accent and personalize the experience.
  - info - A short description about the account.

===========
## Examples
===========

The following examples will include both raw cadence transactions and scripts
as well as how you can call them from FCL. The FCL examples are currently assuming
the following configuration is called somewhere in your application before the
the actual calls to the chain are invoked.

==================================
## Initializing a Profile Resource
==================================

Initializing should be done using the paths that the contract exposes.
This will lead to predictability in how applications can look up the data.

-----------
### Cadence
-----------

    import Profile from 0xba1132bc08f82fe2

    transaction {
      let address: address
      prepare(currentUser: AuthAccount) {
        self.address = currentUser.address
        if !Profile.check(self.address) {
          currentUser.save(<- Profile.new(), to: Profile.privatePath)
          currentUser.link<&Profile.Base{Profile.Public}>(Profile.publicPath, target: Profile.privatePath)
        }
      }
      post {
        Profile.check(self.address): "Account was not initialized"
      }
    }

-------
### FCL
-------

    import {query} from "@onflow/fcl"

    await mutate({
      cadence: `
        import Profile from 0xba1132bc08f82fe2

        transaction {
          prepare(currentUser: AuthAccount) {
            self.address = currentUser.address
            if !Profile.check(self.address) {
              currentUser.save(<- Profile.new(), to: Profile.privatePath)
              currentUser.link<&Profile.Base{Profile.Public}>(Profile.publicPath, target: Profile.privatePath)
            }
          }
          post {
            Profile.check(self.address): "Account was not initialized"
          }
        }
      `,
      limit: 55,
    })

===============================================
## Interacting with Profile Resource (as Owner)
===============================================

As the owner of a resource you can update the following:
  - name using `.setName("MyNewName")` (as long as you arent verified)
  - avatar using `.setAvatar("https://url.to.my.avatar")`
  - color using `.setColor("tomato")`
  - info using `.setInfo("I like to make things with Flow :wave:")`

-----------
### Cadence
-----------

    import Profile from 0xba1132bc08f82fe2

    transaction(name: String) {
      prepare(currentUser: AuthAccount) {
        currentUser
          .borrow<&{Profile.Owner}>(from: Profile.privatePath)!
          .setName(name)
      }
    }

-------
### FCL
-------

    import {mutate} from "@onflow/fcl"

    await mutate({
      cadence: `
        import Profile from 0xba1132bc08f82fe2

        transaction(name: String) {
          prepare(currentUser: AuthAccount) {
            currentUser
              .borrow<&{Profile.Owner}>(from: Profile.privatePath)!
              .setName(name)
          }
        }
      `,
      args: (arg, t) => [
        arg("qvvg", t.String),
      ],
      limit: 55,
    })

=========================================
## Reading a Profile Given a Flow Address
=========================================

-----------
### Cadence
-----------

    import Profile from 0xba1132bc08f82fe2

    pub fun main(address: Address): Profile.ReadOnly? {
      return Profile.read(address)
    }

-------
### FCL
-------

    import {query} from "@onflow/fcl"

    await query({
      cadence: `
        import Profile from 0xba1132bc08f82fe2

        pub fun main(address: Address): Profile.ReadOnly? {
          return Profile.read(address)
        }
      `,
      args: (arg, t) => [
        arg("0xba1132bc08f82fe2", t.Address)
      ]
    })

============================================================
## Reading a Multiple Profiles Given Multiple Flow Addresses
============================================================

-----------
### Cadence
-----------

    import Profile from 0xba1132bc08f82fe2

    pub fun main(addresses: [Address]): {Address: Profile.ReadOnly} {
      return Profile.readMultiple(addresses)
    }

-------
### FCL
-------

    import {query} from "@onflow/fcl"

    await query({
      cadence: `
        import Profile from 0xba1132bc08f82fe2

        pub fun main(addresses: [Address]): {Address: Profile.ReadOnly} {
          return Profile.readMultiple(addresses)
        }
      `,
      args: (arg, t) => [
        arg(["0xba1132bc08f82fe2", "0xf76a4c54f0f75ce4", "0xf117a8efa34ffd58"], t.Array(t.Address)),
      ]
    })

==========================================
## Checking if Flow Account is Initialized
==========================================

-----------
### Cadence
-----------

    import Profile from 0xba1132bc08f82fe2

    pub fun main(address: Address): Bool {
      return Profile.check(address)
    }

-------
### FCL
-------

    import {query} from "@onflow/fcl"

    await query({
      cadence: `
        import Profile from 0xba1132bc08f82fe2

        pub fun main(address: Address): Bool {
          return Profile.check(address)
        }
      `,
      args: (arg, t) => [
        arg("0xba1132bc08f82fe2", t.Address)
      ]
    })

*/
pub contract Profile {
  pub let publicPath: PublicPath
  pub let privatePath: StoragePath

  pub resource interface Public {
    pub fun getName(): String
    pub fun getAvatar(): String
    pub fun getColor(): String
    pub fun getInfo(): String
    pub fun asReadOnly(): Profile.ReadOnly
  }

  pub resource interface Owner {
    pub fun getName(): String
    pub fun getAvatar(): String
    pub fun getColor(): String
    pub fun getInfo(): String

    pub fun setName(_ name: String) {
      pre {
        name.length <= 15: "Names must be under 15 characters long."
      }
    }
    pub fun setAvatar(_ src: String)
    pub fun setColor(_ color: String)
    pub fun setInfo(_ info: String) {
      pre {
        info.length <= 280: "Profile Info can at max be 280 characters long."
      }
    }
  }

  pub resource Base: Owner, Public {
    access(self) var name: String
    access(self) var avatar: String
    access(self) var color: String
    access(self) var info: String

    init() {
      self.name = "Anon"
      self.avatar = ""
      self.color = "#232323"
      self.info = ""
    }

    pub fun getName(): String { return self.name }
    pub fun getAvatar(): String { return self.avatar }
    pub fun getColor(): String {return self.color }
    pub fun getInfo(): String { return self.info }

    pub fun setName(_ name: String) { self.name = name }
    pub fun setAvatar(_ src: String) { self.avatar = src }
    pub fun setColor(_ color: String) { self.color = color }
    pub fun setInfo(_ info: String) { self.info = info }

    pub fun asReadOnly(): Profile.ReadOnly {
      return Profile.ReadOnly(
        address: self.owner?.address,
        name: self.getName(),
        avatar: self.getAvatar(),
        color: self.getColor(),
        info: self.getInfo()
      )
    }
  }

  pub struct ReadOnly {
    pub let address: Address?
    pub let name: String
    pub let avatar: String
    pub let color: String
    pub let info: String

    init(address: Address?, name: String, avatar: String, color: String, info: String) {
      self.address = address
      self.name = name
      self.avatar = avatar
      self.color = color
      self.info = info
    }
  }

  pub fun new(): @Profile.Base {
    return <- create Base()
  }

  pub fun check(_ address: Address): Bool {
    return getAccount(address)
      .getCapability<&{Profile.Public}>(Profile.publicPath)
      .check()
  }

  pub fun fetch(_ address: Address): &{Profile.Public} {
    return getAccount(address)
      .getCapability<&{Profile.Public}>(Profile.publicPath)
      .borrow()!
  }

  pub fun read(_ address: Address): Profile.ReadOnly? {
    if let profile = getAccount(address).getCapability<&{Profile.Public}>(Profile.publicPath).borrow() {
      return profile.asReadOnly()
    } else {
      return nil
    }
  }

  pub fun readMultiple(_ addresses: [Address]): {Address: Profile.ReadOnly} {
    let profiles: {Address: Profile.ReadOnly} = {}
    for address in addresses {
      let profile = Profile.read(address)
      if profile != nil {
        profiles[address] = profile!
      }
    }
    return profiles
  }


  init() {
    self.publicPath = /public/profile
    self.privatePath = /storage/profile

    self.account.save(<- self.new(), to: self.privatePath)
    self.account.link<&Base{Public}>(self.publicPath, target: self.privatePath)

    self.account
      .borrow<&Base{Owner}>(from: self.privatePath)!
      .setName("qvvg")
  }
}