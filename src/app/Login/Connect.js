"use client"
import React, { useEffect } from "react";
import Account from "../../components/Account";
import { IconButton } from '@mui/material';
import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet';
import { useState } from "react";

const ConnectWallet = () => {
  const [account, setAccount] = useState();
  useEffect(()=>{
  const {ethereum}=window;
  },[])
  
  console.log("ethereum",ethereum);
  const connectWallet = async () => {
    if (ethereum) {
      const accounts = await ethereum.request({
        method: "eth_requestAccounts",
      });

      if (accounts.length) 
       setAccount(accounts[0]);
    }
  };
  const disconnect= async()=>{
    console.log("disconnect",window.ethereum)
    const ethers = require('ethers');
    const provider = new ethers.BrowserProvider(window.ethereum);
    const signer = await provider.getSigner();
     await signer.provider.send('wallet_requestPermissions', [
  {
    eth_accounts: {}
  }
])
  }
  return (
    <div className="container">
      {account ? (
        <Account
          icon={`https://api.dicebear.com/5.x/identicon/svg?seed=${account}`}
          address={account}
          handleLogout={disconnect}
        />
      ) : (
        <IconButton color="primary" onClick={connectWallet} size="medium">
          <AccountBalanceWalletIcon fontSize="large" />
        </IconButton>
      )}
    </div>
  );
};

export default ConnectWallet;
