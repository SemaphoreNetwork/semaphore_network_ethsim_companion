import { Web3ReactProvider } from '@web3-react/core';
import React from 'react';
import ReactDOM from 'react-dom';
import { App } from './pages/_app';
import './index.css';
import { getProvider } from './utils/provider';
import { BrowserRouter, Link, Route } from 'react-router-dom';

ReactDOM.render(
  <React.StrictMode>
    <Web3ReactProvider getLibrary={getProvider}>
      
      <BrowserRouter>
        <Link to="/app">
          <App/>  

        </Link>
      </BrowserRouter>
    </Web3ReactProvider>
  </React.StrictMode>,
  document.getElementById('root')
);
