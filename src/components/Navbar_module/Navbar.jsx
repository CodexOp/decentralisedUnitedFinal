import React, { useState } from "react";
import logo from "../../images/logo.png";
import './Navbar.css';
import { ethers } from 'ethers';
import { GiHamburgerMenu } from "react-icons/gi";
import { NavLink } from "react-router-dom";
import { ConnectButton } from '@rainbow-me/rainbowkit';
import {useSigner, useProvider} from 'wagmi'
import tokenAbi from '../../tokenAbi.json'
import stakingAbi from '../../stakeAbi.json'
import value from '../../value.json'


// Rainbowkit setup 
// ======================>

// import '@rainbow-me/rainbowkit/styles.css'; // throws failed to compile, use below import instead
import '@rainbow-me/rainbowkit/dist/index.css';
import {
  getDefaultWallets,
  RainbowKitProvider,
} from '@rainbow-me/rainbowkit';
import {
  chain,
  configureChains,
  createClient,
  WagmiConfig,
} from 'wagmi';
import { alchemyProvider } from 'wagmi/providers/alchemy';
import { publicProvider } from 'wagmi/providers/public';
// import { ConnectButton } from '@rainbow-me/rainbowkit';

const { chains, provider } = configureChains(
    [chain.mainnet, chain.polygon, chain.optimism, chain.arbitrum],
    [
      alchemyProvider({ apiKey: process.env.ALCHEMY_ID }),
      publicProvider()
    ]
  );
  
  const { connectors } = getDefaultWallets({
    appName: 'My RainbowKit App',
    chains
  });
  
  const wagmiClient = createClient({
    autoConnect: true,
    connectors,
    provider
  })

// ======================>


const Navbar = () => {
  const [isOpen, setOpen] = useState(false);
const [active, setActive] = useState("1");


  const handleClick = (event) => {
    setActive(event.target.id);
  };

  const { data: signer, isError, isLoading } = useSigner()
  const provider = useProvider();

  const staking = new ethers.Contract(
    value.stakingAddress,
    stakingAbi,
    signer,
  )


  return (
    <nav className="main-nav">
      <div className="logo">
        <img src={logo} alt="img" />
      </div>
      <div className={isOpen ? " mobile-menu-link" : "menu-link"}>
        {/* <div className="flex">
          <img src={logo} alt="logo" className="mobilelogo"></img>
        </div> */}
        <ul className="navbarul">
          <li>
            <a
              className={active === "1" ? "actived" : ""}
              href="#"
              id={"1"}
              onClick={handleClick}
            >
              Home
            </a>
          </li>
          <li>
            <a
              className={active === "2" ? "actived" : ""}
              href="#discover"
              id={"2"}
              onClick={handleClick}
            >
              Discover
            </a>
          </li>
          <li>
            <a
              target="_blank"
              rel="noreferrer"
              href="#aboutus"
              className={active === "3" ? "actived" : ""}
              id={"3"}
              onClick={handleClick}
            >
              About Us
            </a>
          </li>
          <li>
            <NavLink
              className={active === "4" ? "actived" : ""}
              id={"4"}
              onClick={handleClick}
              to="/"
            >
              Staking
            </NavLink>
          </li>
          <li>
            <NavLink
              className={active === "5" ? "actived" : ""}
              id={"5"}
              onClick={handleClick}
              to="/"
            >
              Market
            </NavLink>
          </li>
      
        </ul>
        {/* hamburger menu code below */}
      </div>
       <div className="button">
        {/* <button className="contact-btn">connect wallet</button> */}
        <ConnectButton/>
        <div className="ham">
          <GiHamburgerMenu onClick={() => setOpen(!isOpen)} />
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
