import React from "react";
import ReactDOM from 'react-dom/client';
import { Provider } from "react-redux";
import {BrowserRouter} from 'react-router-dom';

import Store from "./redux/Store.js";

import App from "./App.js";

if(process.env.REACT_APP_SERVER_URL){
    ReactDOM.hydrateRoot(document.getElementById('root'),
    <Provider store = { Store }> 
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </Provider>  
    )
  }else{
    ReactDOM.createRoot(document.getElementById('root')).render(
      <Provider store = { Store }> 
          <BrowserRouter>
            <App />
          </BrowserRouter>
        </Provider>
    );
  }
  