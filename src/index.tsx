import { Web3ReactProvider } from '@web3-react/core';
import React from 'react';
import ReactDOM from 'react-dom';

import { App } from './pages/App';
import './index.css';
import { getProvider } from './utils/provider';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { PasteSignature } from './components/PasteSignature';

ReactDOM.render(
  <React.StrictMode>
    <Web3ReactProvider getLibrary={getProvider}>
      <BrowserRouter>
      <Routes>
        <Route path="/app" element={<App/>}/>
        <Route path="/pastesig" element={<PasteSignature/>}/>
      </Routes>
      </BrowserRouter>
    </Web3ReactProvider>
  </React.StrictMode>,
  document.getElementById('root')
);
