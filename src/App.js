import './App.css';
import Navbar from './components/Navbar_module/Navbar';
import { Route, BrowserRouter as Router, Routes } from "react-router-dom";
import Home from './pages/Home/Home';
import "@rainbow-me/rainbowkit/dist/index.css";
import { getDefaultWallets, RainbowKitProvider } from "@rainbow-me/rainbowkit";
import CloseIcon from '@mui/icons-material/Close';
import { alchemyProvider } from "wagmi/providers/alchemy";
import { publicProvider } from "wagmi/providers/public";
import { darkTheme } from "@rainbow-me/rainbowkit";
import { chain, configureChains, createClient, WagmiConfig } from "wagmi";
import Footer from './components/Footer/Footer';


function App() {


  const BSCchain = {
    id: 56,
    name: "BSC",
    network: "BSC",
    iconUrl: "https://www.logo.wine/a/logo/Binance/Binance-Icon-Logo.wine.svg",
    iconBackground: "#fff",
    nativeCurrency: {
      decimals: 18,
      name: "Binance Smart Chain",
      symbol: "BNB",
    },
    rpcUrls: {
      default: "https://bsc-dataseed.binance.org/",
    },
    blockExplorers: {
      default: { name: "BscScan", url: "https://bscscan.com" },
      etherscan: { name: "BscScan", url: "https://bscscan.com" },
    },
    testnet: false,
  };

  const polygonTest = {
    id: 80001,
    name: "maticmum",
    network: "Mumbai Testnet",
    iconUrl: "https://www.logo.wine/a/logo/Binance/Binance-Icon-Logo.wine.svg",
    iconBackground: "#fff",
    nativeCurrency: {
      decimals: 18,
      name: "polygon mumbai",
      symbol: "MATIC",
    },
    rpcUrls: {
      default: "https://rpc-mumbai.maticvigil.com",
    },
    blockExplorers: {
      default: { name: "SnowTrace", url: "https://polygonscan.com" },
      etherscan: { name: "SnowTrace", url: "https://polygonscan.com" },
    },
    testnet: true,
  };
  
  const { chains, provider } = configureChains(
    [BSCchain, chain.mainnet, chain.polygon, chain.optimism, chain.arbitrum],
    [alchemyProvider({ alchemyId: process.env.ALCHEMY_ID }), publicProvider()]
  );

  const { connectors } = getDefaultWallets({
    appName: "Decentralised United",
    chains,
  });
  const wagmiClient = createClient({
    autoConnect: true,
    connectors,
    provider,
  });
  
  return (
    <>
          <WagmiConfig client={wagmiClient}>
            <RainbowKitProvider
              chains={chains}
              theme={darkTheme({ borderRadius: "medium" })}
            >
          <Router>
            <div>
              <Routes>
                <Route exact path="/" element={<><Home /><Footer /></>} />
              </Routes>
            </div>
          </Router>
          </RainbowKitProvider>
          </WagmiConfig>
    </>
  );
}

export default App;
