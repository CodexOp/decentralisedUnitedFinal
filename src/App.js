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


function App() {

  
  const { chains, provider } = configureChains(
    [ chain.rinkeby, chain.mainnet, chain.polygon, chain.optimism, chain.arbitrum],
    [alchemyProvider({ alchemyId: process.env.ALCHEMY_ID }), publicProvider()]
  );

  const { connectors } = getDefaultWallets({
    appName: "baby-cracken",
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
                <Route exact path="/" element={<Home />} />
              </Routes>
            </div>
          </Router>
          </RainbowKitProvider>
          </WagmiConfig>
    </>
  );
}

export default App;
