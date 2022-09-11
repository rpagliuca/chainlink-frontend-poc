import React, { useEffect, useState } from 'react';
import { ethers } from "ethers";
import { Row, Button, Input } from 'reactstrap';

function App() {
  const [storedPrice, setStoredPrice] = useState('');
  const provider = new ethers.providers.Web3Provider(window.ethereum)
  provider.send('eth_requestAccounts', []); // <- this promps user to connect metamask
  const signer = provider.getSigner()
  const contractAddress = "0x67bb829985322A47165986238E631c8572D41883";
  const ABI = `[
    {
      "inputs": [],
      "stateMutability": "nonpayable",
      "type": "constructor"
    },
    {
      "inputs": [],
      "name": "getLatestPrice",
      "outputs": [
        {
          "internalType": "int256",
          "name": "",
          "type": "int256"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "storeLatestPrice",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "storedPrice",
      "outputs": [
        {
          "internalType": "int256",
          "name": "",
          "type": "int256"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    }
  ]`;
  const contract = new ethers.Contract(contractAddress, ABI, signer);

const getStoredPrice = async () => {
    try {
      const contractPrice = await contract.storedPrice();
      setStoredPrice(parseInt(contractPrice) / 100000000);
    } catch (error) {
      console.log("getStoredPrice Error: ", error);
    }
  }

  async function updateNewPrice() {
    try {
      const transaction = await contract.storeLatestPrice();
      await transaction.wait();
      await getStoredPrice();
    } catch (error) {
      console.log("updateNewPrice Error: ", error);
    }

  }

  getStoredPrice()
  .catch(console.error)

return (
  <div className="container">

    <Row className="top30">
      <h1>Colibri</h1>
    </Row>

    <Row className="top30">

      <div className="col">
        <h3>CPF/Passaporte</h3>
        <Input placeholder="000.000.000-00"/>
      </div>

      <div className="col">
        <h3>NDO</h3>
        <Input placeholder="ABE1234"/>
      </div>

      <div className="col">
        <h3>Data</h3>
        <Input placeholder="AAAA-MM-DD"/>
      </div>

    </Row>

    <Row className="top30">
      <div className="col">
        <h3>Stored Price</h3>
        <p>Stored ETH/USD Price: {storedPrice}</p>
      </div>
      <div className="col">
        <h3>Atualizar feed de dados</h3>
        <Button onClick={updateNewPrice}>Update</Button>
      </div>
    </Row>

  </div>
);
}

export default App;
