import React, {useState, useEffect} from 'react'
import './Modal.css'
import { ethers } from 'ethers';
import light from '../../images/light.png'
import electro from '../../images/electro.png'
import CloseIcon from '@mui/icons-material/Close';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import tokens from '../../tokens.json'



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
  }) {

  const [Active, setActive] = useState(true);
  const [perActive,setperActive] = useState("25")

  const [istokenapproved, settokenapproved] = useState(false)

  const [apy, setApy] = useState(0);
      
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
              <div className='modal__descTitle'>Claimable Rewards</div>
              <div className='modal__descValue'>
                <span className='modal__val modal--val'>
                {parseFloat(claimableTokens).toFixed(2)}
                </span>
                </div>
            </div>
            <div className='modal__descOption'>
              <div className='modal__descTitle'>Stake</div>
              <div className='modal__descValue'>Available : {myTokenBalance}</div>
            </div>
            <div className='modal__descBar'>
              <div className='modal__selectBox'>
                <form>
                  <label htmlFor="cars" className='modal__selectLabel'>{tokenDetails.rewardTokenSymbol}</label>
                  <select className='modal__selectDrop' id="cars" name="cars">
                    <option></option>
                    {/* <option value="volvo">Volvo</option>
                    <option value="saab">Saab</option>
                    <option value="fiat">Fiat</option>
                    <option value="audi">Audi</option> */}
                  </select>
                </form>
              </div>
              <div className='modal__value'>
              <input 
              type = "text" 
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
              <div className='modal__descValue modal--val'>{locktime.toString()}</div>
            </div>
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
                <div className='modal__usOption'><img className='modal__electro' src={electro} alt='light'/>FTR</div>
                <div className='modal__usOption'>{tokens[index].apy}%</div>
                  <div className='modal__usOption'>{parseFloat(claimableTokens).toFixed(2)} {tokenDetails.rewardTokenSymbol} </div>
                </div>
              </div>
              
              <div className='modal__usDesc'>
            <div className='modal__descOption'>
              <div className='modal__descTitle'>Unstaked Fee</div>
              <div className='modal__descValue'>{poolData.emergencywithdrawfee}%</div>
                </div>
                <div className='modal__descOption'>
              <div className='modal__descTitle'>Unlock Date/Time</div>
              <div className='modal__descValue'>{unlockTime}</div>
                </div>
                <div className='modal__descOption'>
              <div className='modal__descTitle'>My Staked Tokens</div>
              <div className='modal__descValue'>{mystakebalance}</div>
              </div>
              </div>

              <div className='modal__descBar'>
        
                  <div className='modal__usLabel'>{tokenDetails.rewardTokenSymbol}</div>
            
              <div className='modal__value'>
                {parseFloat(claimableTokens).toFixed(2)}        </div>
              </div>
              
              {/* <div className='modal__percent'>
                <div className={'modal__percentOption ' +  (perActive == "25" ? 'modal--perActive' : '')} onClick={()=>setperActive("25")}>25%</div>
                <div className={'modal__percentOption ' +  (perActive == "50" ? 'modal--perActive' : '')} onClick={()=>setperActive("50")}>50%</div>
                <div className={'modal__percentOption ' +  (perActive == "75" ? 'modal--perActive' : '')} onClick={()=>setperActive("75")}>75%</div>
                <div className={'modal__percentOption ' +  (perActive == "100" ? 'modal--perActive' : '')} onClick={()=>setperActive("100")}>100%</div>
              </div> */}

              <div className='modal__buttonBar'>
                <div className='modal__Button modal__us' onClick={unstakeTokens}>
                  Unstake
                </div>
                <div className='modal__Button modal__ew' onClick={emergencyWithdraw}>
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