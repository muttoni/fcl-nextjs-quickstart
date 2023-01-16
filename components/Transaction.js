import { useTransaction } from "../contexts/TransactionContext";
import Link from 'next/link';

function Transaction() {
  const { transactionStatus, txId, transactionInProgress } = useTransaction();

  const Approval = () => {
    return (
      <div>
        <span>
          <kbd>Initializing</kbd>
          <br />
          <small>Waiting for transaction approval.</small>
        </span>
        <progress indeterminate="true">Initializing...</progress>
      </div>
    );
  };

  const Pending = () => {
    return (
      <div>
        <span className="txId">
          <Link href={`https://testnet.flowscan.org/transaction/${txId}`}>
            {txId?.slice(0, 8)}
          </Link>
        </span>
        <span>
          <kbd>Pending</kbd>
          <br />
          <small>
            The transaction has been received by a collector but not yet
            finalized in a block.
          </small>
        </span>
        <progress indeterminate="true">Executing</progress>
      </div>
    );
  };

  const Finalized = () => {
    return (
      <div>
        <span className="txId">
          <Link href={`https://testnet.flowscan.org/transaction/${txId}`}>
            {txId?.slice(0, 8)}
          </Link>
        </span>
        <span>
          <kbd>Finalized</kbd>
          <br />
          <small>
            The consensus nodes have finalized the block that the transaction is
            included in.
          </small>
        </span>
        <progress min="0" max="100" value="80">
          Executing...
        </progress>
      </div>
    );
  };

  const Executed = () => {
    return (
      <div>
        <span className="txId">
          <Link href={`https://testnet.flowscan.org/transaction/${txId}`}>
            {txId?.slice(0, 8)}
          </Link>
        </span>
        <span>
          <kbd>Executed</kbd>
          <br />
          <small>
            {" "}
            The execution nodes have produced a result for the transaction.
          </small>
        </span>
        <progress min="0" max="100" value="80">
          Sealing...
        </progress>
      </div>
    );
  };

  const Sealed = () => {
    return (
      <div>
        <span className="txId">
          <Link href={`https://testnet.flowscan.org/transaction/${txId}`}>
            {txId?.slice(0, 8)}
          </Link>
        </span>
        <span>
          <kbd>✓ Sealed</kbd>
          <br />
          <small>
            The verification nodes have verified the transaction, and the seal
            is included in the latest block.
          </small>
        </span>
        <progress min="0" max="100" value="100">
          Sealed!
        </progress>
      </div>
    );
  };

  const Expired = () => {
    return (
      <div>
        <span className="txId">
          <Link href={`https://testnet.flowscan.org/transaction/${txId}`}>
            {txId?.slice(0, 8)}
          </Link>
        </span>
        <span>
          <kbd>Expired</kbd>
          <br />
          <small>
            The transaction was submitted past its expiration block height.
          </small>
        </span>
      </div>
    );
  };

  const Error = () => {
    return (
      <div>
        <span className="txId">
          <Link href={`https://testnet.flowscan.org/transaction/${txId}`}>
            {txId?.slice(0, 8)}
          </Link>
        </span>
        <span data-theme="invalid">Error!</span>
      </div>
    );
  };

  let response;

  if (transactionStatus < 0) {
    response = <Approval />;
  } else if (transactionStatus < 2) {
    response = <Pending />;
  } else if (transactionStatus === 2) {
    response = <Finalized />;
  } else if (transactionStatus === 3) {
    response = <Executed />;
  } else if (transactionStatus === 4) {
    response = <Sealed />;
  } else if (transactionStatus === 5) {
    response = <Expired />;
  } else {
    response = <Error />;
  }

  if (transactionInProgress) {
    return (
      <div className="card tx">
        {response}
        <small>
          <Link href="https://docs.onflow.org/access-api/">More info</Link>
        </small>
      </div>
    );
  } else {
    return <span />;
  }
}

export default Transaction;
