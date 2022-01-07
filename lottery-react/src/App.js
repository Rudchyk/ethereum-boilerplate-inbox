import "./App.css";
import web3 from "./web3";
import { useState, useEffect } from "react";
import lottery from "./lottery";

const App = () => {
  const initialManager = "";
  const [manager, setManager] = useState(initialManager);
  const [playersLength, setPlayersLength] = useState([]);
  const [balance, setBalance] = useState("");
  const [value, setValue] = useState("");
  const [message, setMessage] = useState("");
  const updateBalance = async () => {
    const balance = await web3.eth.getBalance(lottery.options.address);
    setBalance(balance);
  };
  const updatePlayersLength = async () => {
    const playersLength = await lottery.methods.getPlayersLength().call();
    setPlayersLength(playersLength);
  };
  const updateData = async () => {
    await updatePlayersLength();
    await updateBalance();
  };
  const defineManager = async () => {
    const manager = await lottery.methods.manager().call();
    await setManager(manager);
    await updateData();
  };
  const onAmountChange = async (event) => {
    await setValue(event.target.value);
    if (message) {
      await setMessage("");
    }
  };
  const onFormSubmit = async (event) => {
    event.preventDefault();

    await setMessage("Waiting on transaction success...");

    try {
      const accounts = await web3.eth.getAccounts();
      await lottery.methods.enter().send({
        from: accounts[0],
        value: web3.utils.toWei(value, "ether"),
      });
      await setMessage("You have been entered");
      await setValue("");
      await updateData();
    } catch (error) {
      await setMessage("You have not been entered!");
    }
  };
  const isManager = async () => {
    const accounts = await web3.eth.getAccounts();
    return manager === accounts[0];
  };
  const onPickWinnerClick = async () => {
    await setMessage("Waiting on picking winner...");

    try {
      const accounts = await web3.eth.getAccounts();
      const result = await lottery.methods.pickWinner().send({
        from: accounts[0],
      });
      console.log("result", result);
      await setMessage(`${result.from} has won!`);
      await updateData();
    } catch (error) {
      await setMessage("Some error with picking winner! Please, try later");
    }
  };

  useEffect(() => {
    defineManager();
  }, []);

  return (
    <div>
      <h2>Lottery Contract</h2>
      <p>This contract is managed by {manager}</p>
      <p>
        There are currently {playersLength} people entered, competing to win{" "}
        {web3.utils.fromWei(balance, "ether")} ether!
      </p>
      <hr />
      <form onSubmit={onFormSubmit}>
        <h4>Want to try your luck</h4>
        <div>
          <label>Amount of ether to enter</label>
          <input type="text" value={value} onChange={onAmountChange} />
        </div>
        <button>Enter</button>
      </form>
      <hr />
      {isManager() && (
        <div>
          <h2>Time to pick a winner?</h2>
          <button type="button" onClick={onPickWinnerClick}>
            Pick Winner
          </button>
        </div>
      )}
      <hr />
      {message && <h1>{message}</h1>}
    </div>
  );
};
export default App;
