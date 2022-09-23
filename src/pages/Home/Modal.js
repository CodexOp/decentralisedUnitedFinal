import React, {useState, useEffect} from 'react'
import './Modal.css'
import { ethers } from 'ethers';
import light from '../../images/light.png'
import electro from '../../images/electro.png'
import CloseIcon from '@mui/icons-material/Close';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import tokens from '../../tokens.json'
import Countdown from "react-countdown";



// Renderer callback with condition
const renderer = ({days, hours, minutes, seconds, completed }) => {
  if (completed) {
    // Render a complete state
    return <>You can unstake tokens</>;
  } else {
    // Render a countdown
    return (
      <span>
        {days}:{hours}:{minutes}:{seconds}
      </span>
    );
  }
};

function Modal({
  setIsOpen,
  onChangeInput,
  reward,
  claimableTokens,
  locktime,
  unlockTime,
  tokenAddress,
  myTokenBalance,
  stakeTokens,
  unstakeTokens,
  emergencyWithdraw,
  index,
  tokenDetails,
  poolData,
  mystakebalance,
  errors,
  userAllInfo
  }) {
console.log(userAllInfo)
  const [Active, setActive] = useState(true);
  const [perActive,setperActive] = useState("25")
  const [showAlert,setShowAlert] = useState(false)
  const [showerror,setShowError] = useState(false)
  const [indexValue,setIndexValue] = useState(0)
  const [TotalStaked,setTotalStaked] = useState()
  const [timerTime, setTimertime] = useState()

  const [istokenapproved, settokenapproved] = useState(false)

  const [apy, setApy] = useState(0);
 
  useEffect(()=>{
    setTotalStaked(mystakebalance)

  },[userAllInfo])

  useEffect(()=>{
    setTimertime(userAllInfo.timers[indexValue])
  },[userAllInfo, timerTime, indexValue])

  const optionChange = (e) => {
    console.log(e.target.value)
    setIndexValue(e.target.value)
  }
      
  return (
    <div className='modal__background'>
      <div className='modal__card'>
              <CloseIcon className='modal__close' onClick={()=>setIsOpen(false)} />
        <div className='modal__cardSub'>
          <div className='modal__cardHeader'>
            <div className='modal__Menu'>
              <div
                className={'modal__Option ' + (Active
                ? 'modal--active'
                : '')} onClick={() => setActive(!Active)}>Stake</div>
              <div
                className={'modal__Option ' + (!Active
                ? 'modal--active'
                : '')} onClick={() => setActive(!Active)}>Unstake</div>
            </div>
          </div>
          { Active ?
            <>
            <div className='modal__desc'>
            {tokens[index].description}
          </div>

          <div className='modal__cardDesc'>
            <div className='modal__descOption'>
              <div className='modal__descTitle'>Reward Token</div>
              <div className='modal__descValue'>{tokenDetails.rewardTokenSymbol}<img src={light} alt='light'/>
              </div>
            </div>
            <div className='modal__descOption'>
              <div className='modal__descTitle'>APY</div>
              <div className='modal__descValue'>
              {tokens[index].apy}%
              </div>
            </div>
                <div className='modal__descOption'>
              <div className='modal__descTitle'>Stake</div>
              <div className='modal__descValue'>Available : {myTokenBalance}</div>
            </div>
            <div className='modal__descBar'>
              <div className='modal__selectBox'>
                <form>
                  <label htmlFor="cars" className='modal__selectLabel'>{tokenDetails.tokenSymbol}</label>
                </form>
              </div>
              <div className='modal__value'>
              <input 
              type = "number" 
              placeholder="Input amount" 
              className= 'modal__input'
              // value = {addressInput}
              onChange = {onChangeInput}
              id = "stake"
            />
              </div>
            </div>
            <div className='modal__descOption'>
              <div className='modal__descTitle'>Lock Period</div>
              <div className='modal__descValue modal--val'>{locktime.toString()} Days</div>
            </div>
            {errors ? <div className="unstake_alert">{errors}</div> : <div></div>}

          </div>
          <div
            className={'modal__cardButton ' + (Active
            ? ''
            : 'modal--ended')}
            onClick={stakeTokens}>
            {Active
              ? "Stake"
              : "Ended"}
              </div>
            </>
            :
            <>
              <div className='modal__usTopBar'>
                <div className='modal__usInfo' >
                  <div className='modal__usOption'>Token</div>
                <div className='modal__usOption'>APY</div>
                  <div className='modal__usOption'>Claimable Reward</div>
                </div>
                <div className='modal__usInfo modal__usVal'>
                <div className='modal__usOption'><img className='modal__electro' src={electro} alt='light'/>{tokenDetails.tokenSymbol}</div>
                <div className='modal__usOption'>{tokens[index].apy}%</div>
                  <div className='modal__usOption'>{userAllInfo.claimableTokens[indexValue]} {tokenDetails.rewardTokenSymbol} </div>
                </div>
              </div>
              
              <div className='modal__usDesc'>
              <select onChange={optionChange} className="stakedOption">

                {userAllInfo.amounts.map((values, index)=>{
                  return(
                    <option key={index} value={index} >Stake {index+1}</option>
                  );
                })}
                  </select>
                  <div className='modal__descOption'>
              <div className='modal__descTitle'>My Staked Token</div>
              <div className='modal__descValue'>{userAllInfo.amounts[indexValue]}</div>
                </div>
                  <div className='modal__descOption'>
              <div className='modal__descTitle'>Total Amount Staked</div>
              <div className='modal__descValue'>{TotalStaked}</div>
                </div>
    
            <div className='modal__descOption'>
              <div className='modal__descTitle'>Unstaked Fee</div>
              <div className='modal__descValue'>{parseInt(poolData.emergencywithdrawfee)/10}%</div>
                </div>
                <div className='modal__descOption'>
              <div className='modal__descTitle'>Unlock Time Remaining</div>
              <div className='modal__descValue'>{timerTime && timerTime < 0 ? <span>You can unstake now</span> : <Countdown date={parseInt(userAllInfo.unlockTimes[indexValue])*1000} renderer={renderer} /> }</div>
                </div>
                {errors ? <div className="unstake_alert">{errors}</div> : <div></div>}

              </div>

              <div className='modal__descBar'>
        
                  <div className='modal__usLabel'>{tokenDetails.rewardTokenSymbol}</div>

              <div className='modal__value'>
              {userAllInfo.claimableTokens[indexValue]}        </div>
              </div>
              
              {/* <div className='modal__percent'>
                <div className={'modal__percentOption ' +  (perActive == "25" ? 'modal--perActive' : '')} onClick={()=>setperActive("25")}>25%</div>
                <div className={'modal__percentOption ' +  (perActive == "50" ? 'modal--perActive' : '')} onClick={()=>setperActive("50")}>50%</div>
                <div className={'modal__percentOption ' +  (perActive == "75" ? 'modal--perActive' : '')} onClick={()=>setperActive("75")}>75%</div>
                <div className={'modal__percentOption ' +  (perActive == "100" ? 'modal--perActive' : '')} onClick={()=>setperActive("100")}>100%</div>
              </div> */}


              {showAlert ? <div className="unstake_alert">Emergency Withdraw Can Lead To Lose Of All The Rewards And {parseInt(poolData.emergencywithdrawfee)/10}% Of Your Capital</div> : <div></div>}
              <div className='modal__buttonBar'>
                <div className='modal__Button modal__us' onClick={()=> unstakeTokens(indexValue)}>
                  Unstake
                </div>
                <div className='modal__Button modal__ew' onClick={() => { setShowAlert(true);  emergencyWithdraw(indexValue)}}>
                  Emergency Withdraw
                </div>
              </div>
            </>
          }
        </div>
      </div>
      {/* <Card setIsOpen={setIsOpen} /> */}
    </div>
  )
}

export default Modal