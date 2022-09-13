import React, { useState,useEffect } from 'react'
import './Card.css'
import bitlogo from '../../images/abit.png'
import bitcoin from '../../images/bitcoin.png'
import light from '../../images/light.png'
import gift from '../../images/gift.png'
import tokenAbi from '../../tokenAbi.json'
import stakingAbi from '../../stakeAbi.json'
import value from '../../value.json'
import {useSigner, useProvider} from 'wagmi'
import { ethers } from 'ethers';
import Modal from './Modal'
import Progress from 'react-progressbar';
import tokens from '../../tokens.json'

function Card({ 
  index,
  poolData
  }) {
    const { data: signer, isError, isLoading } = useSigner()
    const [mystakebalance, setMystakeBalance] = useState()
    const [isOpen, setIsOpen] = useState(false);
    const [claimableTokens, setClaimableTokens] = useState(0)
    const [unlockTime, setUnlockTime] = useState(1);
    const [myTokenBalance, setMyTokenBalance] = useState(0)
    const [walletAddressInfo, setWalletAddressInfo] = useState()
    const [istokenapproved, settokenapproved] = useState(false)
    const [tokenDetails, setTokenDetails] = useState({})
    const [amount, setAmount] = useState(Number)
    const [errors, setError] = useState()

    let staking;

    let token;


    

    function refreshData (signer) {
      if(signer){
        staking = new ethers.Contract(value.stakingAddress, stakingAbi, signer);
        token = new ethers.Contract(poolData.tokenAddress, tokenAbi, signer);

        // getPoolInfo()
        // signer.getAddress().then((res)=>{setMyaddress(res)})
        getTokenDetails ();
        getUserInfo()
        getClaimableTokens()
        getUserLockTime()
        // getUserLockTime()
        getTokenBalance()
        getWhiteListAddresses()
        // checkApproved()
        // getClaimableTokens()
        // getPoolLength()
        // getPoolArray()
      }
    }

    useEffect( ()=>{
      refreshData(signer)
    },[signer])

    async function getTokenDetails () {
      try {
        const tokenSymbol = await token.symbol()
        const rewardToken = new ethers.Contract(poolData.rewardTokenAddress, tokenAbi, signer);
        const rewardTokenSymbol = await rewardToken.symbol();
        console.log ("rewardTokenSymbol", rewardTokenSymbol); 
        setTokenDetails({tokenSymbol, rewardTokenSymbol})
      } catch (error) {
        console.log(error)
      }
    }

    async function getUserInfo (){
      try{
        let _userInfo = await staking.userInfo(index, await signer.getAddress());
        let decimals = (await token.decimals()).toString();
        console.log ("my stake token amount: ", ethers.utils.formatUnits(_userInfo.amount.toString(), decimals));
        setMystakeBalance(ethers.utils.formatUnits(_userInfo.amount.toString(), decimals));
      }catch(err){
        console.log("User error", err);
      }
    }


      async function getWhiteListAddresses (){
      try{   
        if (poolData.poolType){
          setWalletAddressInfo(true);
          return;
        }
        let userAddress = await signer.getAddress()
        let _wlInfo = await staking.whitelistedAddress( index, userAddress);
        console.log ("Whitelist Info: ", _wlInfo);
        setWalletAddressInfo(_wlInfo);
      }catch(err){
        console.log("User error", err);
      }
    }

      async function unstakeTokens () {
        try{
          let staking = new ethers.Contract(value.stakingAddress, stakingAbi, signer);
          let tx = await staking.unstakeTokens(index);
          let reciept = await tx.wait();
          console.log ("Unstake Tx Receipt: ", reciept);
          refreshData(signer)
        }catch (error) {
          console.log (error);
          try {
            alert(error.error.message)
          } catch {
            alert("Something went wrong, please try again!")
          }
        }
      }
    
      async function emergencyWithdraw () {
        try{
          const _staking = new ethers.Contract(
            value.stakingAddress,
            stakingAbi,
            signer,
          )
          
          let tx = await _staking.emergencyWithdraw(index);
          let reciept = await tx.wait();
          console.log ("Emergency Withdraw Tx Receipt: ", reciept);
          refreshData(signer)
        }catch (error) {
          console.log (error.toString());
          try {
            alert(error.error.message)
          } catch {
            alert("Something went wrong, please try again!")
          }

        }
      }

    async function getTokenBalance(){
      let userAddress = await signer.getAddress()
      const tokenbalance = await token.balanceOf(userAddress);
      const decimals = (await token.decimals()).toString();
      const tokenbalanceConverted = ethers.utils.formatUnits(tokenbalance.toString(), decimals)
      console.log("My Token Balance -",ethers.utils.formatUnits(tokenbalance.toString(), decimals));
      setMyTokenBalance(Math.floor(tokenbalanceConverted))
    }

    async function getUserLockTime (){
    try{
      let userAddress = await signer.getAddress()
      let myunlocktime = await staking.getUserLockTime(index, userAddress);
      let _wallet = await signer.getAddress();      
      let _userInfo = await staking.userInfo( index, _wallet);
      let _stakedAmount = ethers.utils.formatEther(_userInfo.amount.toString());

      if (_stakedAmount == 0) {
        setUnlockTime("Not staked yet");
        return;
      }
      let _timestamp = parseInt(myunlocktime.toString())* 1000;
      let _time = new Date(_timestamp);
      console.log ("Unlock Time: ", _time);
      if (_timestamp >0) setUnlockTime(_time.toString());
      else setUnlockTime("Not staked yet");
    }catch(err){
      console.log("User error", err);
    }
  }

    const onChangeInput = ({target}) => {
    switch (target.id) {
      case "stake":
        setAmount(target.value)
          console.log("Amount:", amount);
        break;

      // case "unstake":
      //   setWithdrawInput(target.value);
      //   break;
    
      // case "viewStruct":
      //   setstakeDetails(target.value);
      //   break;
    default:
    }
  }

  async function getClaimableTokens () {
    try {
      let userAddress = await signer.getAddress();
      let _claimableTokens = await staking.claimableRewards(index, userAddress);
      const rewardToken = new ethers.Contract(poolData.rewardTokenAddress, tokenAbi, signer);
      const decimals = (await rewardToken.decimals()).toString();
      console.log("Claimable Tokens: ", _claimableTokens.toString());
      setClaimableTokens(ethers.utils.formatUnits(_claimableTokens, decimals).toString());
    }catch (error){
      console.log("Claimable error", error);
    }
  }

  async function stakeTokens () {
    if(walletAddressInfo){
      try{
        let staking = new ethers.Contract(value.stakingAddress, stakingAbi, signer);
        const token = new ethers.Contract(poolData.tokenAddress, tokenAbi, signer);

        if(amount === undefined){
          alert("Enter Amount First")
        }
        else{
          await approve()
          let _amount = ethers.utils.parseUnits(amount, (await token.decimals()).toString());
          // console.log (_amount)
          let tx = await staking.stakeTokens(index, _amount);
          let reciept = await tx.wait();
          console.log ("Stake Tx Receipt: ", reciept);
          refreshData(signer)
        }             
      }catch (error) {
        console.log (error);
        try {
          alert(error.error.message)
        } catch {
          alert("Something went wrong, please try again!")
        }
      }
    }
    else{
      alert('Your Wallet Is Not Witelisted For Staking')
    }
  }

  async function approve() {
    if(!(await checkApproved())){
      console.log('Not Approved')
      try{
        let _amount = ethers.utils.parseEther("10000000000000000000");
        let token = new ethers.Contract(poolData.tokenAddress, tokenAbi, signer);
        let tx = await token.approve(value.stakingAddress, _amount);
        let reciept = await tx.wait();
        console.log ("Approve Tx Receipt: ", reciept);
      }catch (error) {
        console.log (error);
        // alert(error.data.message);
      }
    }
    else{
      console.log('already approved')
    }
    
  }

  const checkApproved = async() => {
    try {
      let userAddress = await signer.getAddress()
      console.log (userAddress, value.stakingAddress)
      let token = new ethers.Contract(poolData.tokenAddress, tokenAbi, signer);
      const isApproved = await token.allowance(userAddress, value.stakingAddress);
      const totaltokenapproved = isApproved.toString()
      if(totaltokenapproved.length > 2){
        return true;
      }
      else{
        return false;
      }
    }catch (err) {
      console.log (err)
      return false;
    }
  }
  console.log("mystsakebalance",mystakebalance);

  return (
    <div className='home__bottomCard'>
              <div className='home__cardHeader'>
                <div className='home__cardLogo'>
                  <img className='home__bitlogo' src={tokens[index].tokenlogo} alt='staking token' />
                  <img className='home__bitcoin' src={tokens[index].rewardTokenLogo} alt='reward token' />
                </div>
                <div className='home__cardTitle'>
                  {tokenDetails.tokenSymbol}-{tokenDetails.rewardTokenSymbol} Pool
                </div>
              </div>
              <div className='home__cardDetails'>
                <div className='home__cardPercent'>
                {tokens[index].apy}% 
                </div>
                <div className='home__cardName'>
                  APR
                </div>
              </div>
              <Progress color="#20A7DB" completed={(parseFloat(poolData.currentPoolSize)* 100)/parseFloat(poolData.maxPoolSize)} height={20} data-label={`${(parseFloat(poolData.currentPoolSize)* 100)/parseFloat(poolData.maxPoolSize)}% Pool Filled`} />
              <div className='home__cardDesc'>
                <div className='home__descOption'>
                  <div className='home__descTitle'>Reward Token</div>
                  <div className='home__descValue'>
                   <p style={{fontSize: "10px"}}>{tokenDetails.rewardTokenSymbol}</p>
                   <img src={light} alt='light' /> 
                  </div>
                </div>
                <div className='home__descOption'>
                  <div className='home__descTitle'>Max Contribution</div>
                  <div className='home__descValue'>{(poolData.maxContribution).toString()}</div>
                </div>
                <div className='home__descOption'>
                  <div className='home__descTitle'>Max Pool Size</div>
                  <div className='home__descValue'>{(poolData.maxPoolSize).toString()}</div>
                </div>
                <div className='home__descOption'>
                  <div className='home__descTitle'>Value Locked</div>
                  <div className='home__descValue'>{(poolData.currentPoolSize).toString()}</div>
                </div>
                <div className='home__descOption'>
                  <div className='home__descTitle'>My Staked Balance</div>
                  <div className='home__descValue'>{mystakebalance}</div>
                </div>
                <div className='home__descOption'>
                  <div className='home__descTitle'>Available Balance</div>
                  <div className='home__descValue'>{myTokenBalance}</div>
                </div>
                <div className='home__descOption'>
                  <div className='home__descTitle'>My Reward</div>
                  <div className='home__descValue'>{claimableTokens} {tokenDetails.rewardTokenSymbol} <img className='home__descGift' src={gift} alt='gift'/> </div>
                </div>
                <div className='home__descOption'>
                  <div className='home__descTitle'>Lock Time</div>
                  <div className='home__descValue'>{poolData.lockDays + ` Days`} <img className='home__descGift' src={gift} alt='gift'/> </div>
                </div>
              </div>
              <div className={'home__cardButton '+(poolData.poolActive ? '' : 'home--ended')} onClick={() => setIsOpen(true)}>
              { poolData.poolActive ? "Stake" : "Ended"}
              </div>
              {isOpen && <Modal 
              key={index} 
              index= {index}
              setIsOpen={setIsOpen} 
              tokenAddress={poolData.rewardTokenAddress}
              // Active={ Active } 
              onChangeInput ={onChangeInput} 
              reward={poolData.rewardNum} 
              claimableTokens = {claimableTokens} 
              locktime ={poolData.lockDays} 
              unlockTime={unlockTime}
              myTokenBalance={myTokenBalance}
              stakeTokens = {stakeTokens}
              unstakeTokens = {unstakeTokens}
              emergencyWithdraw = {emergencyWithdraw}
              tokenDetails = {tokenDetails}
              poolData = {poolData}
              mystakebalance = {mystakebalance}
              // unlockTime={unlockTime}
              />}
            </div>
  )
}

export default Card