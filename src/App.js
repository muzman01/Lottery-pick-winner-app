import "./App.css";
import web3 from "./web3";
import lottery from "./lottery";
import { useEffect, useState } from "react";

function App() {
  const [contractManager, setContractManager] = useState("");
  const [contractPlayers, setContractPlayers] = useState([]);
  const [contractBalance, setContractBalance] = useState("");
  const [formAmount, setFormAmount] = useState("");
  const [stateMessage, setStateMessage] = useState("");
  useEffect(() => {
    componentDidMount();
  }, []);
  const componentDidMount = async () => {
    const manager = await lottery.methods.manager().call();
    const players = await lottery.methods.getPlayers().call();
    const balance = await web3.eth.getBalance(lottery.options.address);

    setContractManager(manager);
    setContractPlayers(players);
    setContractBalance(balance);
  };
  const onSubmit = async (event) => {
    event.preventDefault();
    const accounts = await web3.eth.getAccounts();
    setStateMessage(`işlemin tamamlanması bekleniyor. ${accounts[0]}`);
    await lottery.methods.enter().send({
      from: accounts[0],
      value: web3.utils.toWei(formAmount, "ether"),
    });
    setStateMessage(`çekilişe katıldınız. Katılan hesap: ${accounts[0]}`);
  };
  const pickWinner = async (event) => {
    event.preventDefault();
    const accounts = await web3.eth.getAccounts();
    setStateMessage("Kazanan belirleniyor lütfen bekleyin...");
    await lottery.methods.pickWinner().send({
      from: accounts[0],
    });
    setStateMessage(`Kazanan`);
  };
  return (
    <>
      <h2>lottery Contract</h2>
      <p>Bu sözleşmenin manager hesabı {contractManager}</p>
      <p>
        Bu akıllı sözleşme çekilişine katışan oyuncu sayısı{" "}
        {contractPlayers?.length}
      </p>
      <p>
        Kazanacak kişi {web3.utils.fromWei(contractBalance, "ether")} ether
        alacak
      </p>
      <hr></hr>
      <form onSubmit={onSubmit}>
        <h4>Şansınıdı denemek ister misin ?</h4>
        <div>
          <label>Ether miktarını gir</label>
          <input
            onChange={(event) => setFormAmount(event.target.value)}
            value={formAmount}
          />
        </div>
        <button>Enter</button>
      </form>
      <hr></hr>
      <h4>Bir kazanan şeç</h4>
      <button onClick={pickWinner}>Kazanan!</button>
      <hr></hr>
      <h1>{stateMessage}</h1>
    </>
  );
}

export default App;
