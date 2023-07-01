import { Web3ReactProvider } from '@web3-react/core';
import React from 'react';
import ReactDOM from 'react-dom';

import { App } from './pages/App';
import './index.css';
import { getProvider } from './utils/provider';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { PasteSignature } from './components/PasteSignature';
import { NetworkOverview } from './components/NetworkOverview';
import { AddHost } from './pages/AddHost';
import { AddSubscriber } from './pages/AddSubscriber';
import { ContractInteraction } from './pages/ContractInteraction';
ReactDOM.render(
  <React.StrictMode>
    <Web3ReactProvider getLibrary={getProvider}>
      <BrowserRouter>
        <Routes>
          <Route path="/app" element={<App />} />
          <Route path="/pastesig" element={<PasteSignature />} />
          <Route path="/networkstats" element={<NetworkOverview />} />
          <Route path="/addhost" element={<AddHost />} />
          <Route path="/addsubscriber" element={<AddSubscriber />} />
          <Route path="/contract" element={<ContractInteraction />} />

        </Routes>
      </BrowserRouter>
    </Web3ReactProvider>
  </React.StrictMode>,
  document.getElementById('root')
);
