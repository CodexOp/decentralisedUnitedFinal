import React, { useState,useEffect } from 'react'
import sandclock from '../../images/sandclock.png';
import search from '../../images/search.png'
import './HomePage.css';
import "@rainbow-me/rainbowkit/dist/index.css";
import { getDefaultWallets, RainbowKitProvider } from "@rainbow-me/rainbowkit";
import CloseIcon from '@mui/icons-material/Close';
import { alchemyProvider } from "wagmi/providers/alchemy";
import { publicProvider } from "wagmi/providers/public";
import { darkTheme } from "@rainbow-me/rainbowkit";
import { chain, configureChains, createClient, WagmiConfig } from "wagmi";
import tokenAbi from '../../tokenAbi.json'
import stakingAbi from '../../stakeAbi.json'
import value from '../../value.json'
import tokens from '../../tokens.json'

import {useSigner, useProvider} from 'wagmi'
import { ethers } from 'ethers';
import Card from './Card';

function HomePage() {
  const { data: signer, isError, isLoading } = useSigner()
  const provider = useProvider();
  const [Active, setActive] = useState(true);
  const [loading, setIsLoading] = useState(false)

  const [myaddress, setMyaddress] = useState()
  // const [poolId, setPoolId] = useState(1)



  const [poolInfo, setPoolInfo] = useState()
  const [userInfo, setUserInfo] = useState()
  const [walletAddressInfo, setWalletAddressInfo] = useState()
  const [locktime, setLockTime] = useState(1)

  const [emergencyfee, setEmergencyfee] = useState()
  const [poolsize, setPoolSize] = useState()
  const [maxpool, setMaxPool] = useState()
  const [reward, setReward] = useState()

  const [buttonactive1, setButtonactive1] = useState("activebutton")
  const [buttonactive2, setButtonactive2] = useState("")
  const [buttonactive3, setButtonactive3] = useState("")
  const [buttonactive4, setButtonactive4] = useState("")
  const [maxtoken, setMaxToken] = useState()
  const [maxContribution, setMaxContribution] = useState()
  const [claimableTokens, setClaimableTokens] = useState(0)
  const [poolLength, setpoolLength] = useState(null)
  const [poolDetails, setPoolDetails] = useState([])
  // let poolDetails = []

  const staking = new ethers.Contract(
    value.stakingAddress,
    stakingAbi,
    provider,
  )



  function refreshData (signer) {
    if(signer){
      signer.getAddress().then((res)=>{setMyaddress(res)})
      // getUserInfo()
      // getUserLockTime()
      // // getPoolInfo()
      // getTokenBalance()
      // getWhiteListAddresses()
      // checkApproved()
      // getClaimableTokens()
      // getPoolLength()
      getPoolArray()
    }
  }

  async function getPoolArray(){
    let _poolDetails = [];
    for (let i = 0; i < await getPoolLength(); i++) {
      _poolDetails.push(getPoolInfo(i));
    }
    _poolDetails = (await Promise.allSettled(_poolDetails));
    console.log("poolDetails array", _poolDetails);
    setPoolDetails(_poolDetails);
    console.log("All Pool Details:",poolDetails);
  }
  
  async function getPoolInfo(poolId){
    try{
      let _poolInfo = await staking.poolInfo(poolId);
      console.log("poolInfo:",_poolInfo);
      const poolData = {};
      poolData.rewardTokenAddress = await _poolInfo.rewardTokenAddress;
      poolData.tokenAddress = await _poolInfo.tokenAddress;
      const token = new ethers.Contract(poolData.tokenAddress, tokenAbi, provider);
      const rewardToken = new ethers.Contract(poolData.rewardTokenAddress, tokenAbi, provider);
      const decimals = (await token.decimals()).toString();
      const rewardDecimals = (await rewardToken.decimals()).toString();

      const currentpoolsize = await _poolInfo.currentPoolSize.toString()
      const maxcontribution = await _poolInfo.maxContribution.toString()
      const maxpool = await _poolInfo.maxPoolSize.toString()
      poolData.maxContribution = Math.floor(ethers.utils.formatUnits(maxcontribution, decimals))
      poolData.currentPoolSize = Math.floor(ethers.utils.formatUnits(currentpoolsize, decimals));
      poolData.maxPoolSize = ethers.utils.formatUnits(maxpool, decimals);
      
      poolData.emergencywithdrawfee = await _poolInfo.emergencyFees.toString()
      poolData.rewardNum = await _poolInfo.rewardNum.toString()
      poolData.rewardDen = await _poolInfo.rewardDen.toString()
      poolData.lockDays = await _poolInfo.lockDays.toString();
      poolData.poolType = await _poolInfo.poolType;
      poolData.poolActive = await _poolInfo.poolActive;
      console.log("poolData:",poolData);
      return poolData;
    }catch(err){
      console.log(err);
      return {}
    }
  }
  


  useEffect(() => {
    if(poolDetails.length > 0){
      setIsLoading(true)
    }  

    console.log('rendererrererer')

  }, [poolDetails])
        




  async function getPoolLength() {
    const length = await staking.poolLength()
    return (Number(length))
  }

  // console.log("length is",getPoolLength());

  useEffect( ()=>{
    refreshData(signer);

  },[provider, signer]);




  return (
    <div className='HomePage'>
      <div className='home__top'>
        <div className='home__topSub'>
          <div className='home__topLeft'>
            <div className='home__topTitle'>Provide Liquidity, Earn FTR</div>
            <div className='home__topAmount'>$105,786,890.44</div>
            <div className='home__topDesc'>Total Value Locked(TVL)</div>
            <div className='home__topSearch'>
              <div className='home__topSearchBox'>
                <div className='home__topSearchIcon'>
                  <img src={search} alt='sandclock'/>
                </div>
                <div className='home__topSearchInput'>
                  <input
                    className='home__topInput'
                    type='text'
                    placeholder='Search by token symbol'/>
                </div>
              </div>
              <div className='home__topSearchButton'>
                Search
              </div>
            </div>
          </div>
          <div className='home__topRight'>
            <div className='home__topImg'>
              <img src={sandclock} alt='sandclock'/>
            </div>
          </div>
        </div>
      </div>
      <div className='home__bottom'>
        <div className='home__bottomSub'>
          <div className='home__bottomTop'>
            <div className='home__bottomMenu'>
            <div className={'home__bottomOption '+(Active ? 'home--active' : '')} onClick={()=>setActive(!Active)}>Active</div>
              <div className={'home__bottomOption '+(!Active ? 'home--active' : '')} onClick={()=>setActive(!Active)}>Ended</div>
            </div>
          </div>
          {loading ? 
          <div className='home__bottomGrid'>
            {Active ?
            poolDetails.filter(pool => pool.value.poolActive).map((pool, index) => <Card key={index} index={index} Active = {Active} poolData = {pool.value} />)
            //   <>
                
            // <Card Active={Active} setIsOpen={setIsOpen} reward={reward} claimableTokens = {claimableTokens} locktime ={locktime} unlockTime={unlockTime} poolsize={poolsize} myTokenBalance={myTokenBalance}/>
            // <Card Active={ Active} setIsOpen={setIsOpen} reward={reward} claimableTokens = {claimableTokens} locktime ={locktime} unlockTime={unlockTime} poolsize={poolsize} myTokenBalance={myTokenBalance}/>
            // <Card Active={ Active} setIsOpen={setIsOpen} reward={reward} claimableTokens = {claimableTokens} locktime ={locktime} unlockTime={unlockTime} poolsize={poolsize} myTokenBalance={myTokenBalance}/>
            // <Card Active={ Active} approve={approve}  setIsOpen={setIsOpen} reward={reward} claimableTokens = {claimableTokens} locktime ={locktime} unlockTime={unlockTime} poolsize={poolsize} myTokenBalance={myTokenBalance}/>
            //   </>
              :
              poolDetails.filter(pool => !pool.value.poolActive).map((pool, index)=> <Card key={index} index={index} poolData = {pool.value} />)
              // <>
              //   <Card Active={Active} />
              //   <Card Active={Active} />
              //   <Card Active={ Active}/>
              // </>
            }


          </div> 
          : 
          <div className='loaderOuter' >
          <div className="loader"></div>
          </div>
        }
          

        </div>
      </div>    
    </div>
  )
}

export default HomePage