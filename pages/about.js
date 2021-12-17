import Head from 'next/head'

export default function About() {
  return (
    <div>
      <Head>
        <title>About</title>
      </Head>
      <div className="container">
        <h1>About this app</h1>
        <p>
          This is a <a href="https://docs.onflow.org/fcl">FCL-powered</a> app built on <a href="http://onflow.org">Flow</a>.
        </p>
        <p>
          This app shows how to:
        </p>
        <ul>
          <li>Authenticate a user on the Flow blockchain.</li>
          <li>Import a contract to let a user create a profile and query the blockchain for their data.</li>
          <li>Let a user modify their profile and mutate the blockchain to save changes.</li>
        </ul>

        <p>Use this app as a starting template to build your very own web3 app, powered on Flow! Flow is a fast, decentralized, and developer-friendly blockchain, designed as the foundation for a new generation of games, apps, and the digital assets that power them. It is based on a unique, multi-role architecture, and designed to scale without sharding, allowing for massive improvements in speed and throughput while preserving a developer-friendly, ACID-compliant environment.</p>
      </div>
    </div>
  )
}

