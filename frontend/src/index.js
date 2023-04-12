import React from "react";
import { createRoot } from 'react-dom/client';
import { Provider } from "react-redux";

import Store from "./redux/Store.js";

import App from "./App.js";


const root = createRoot(document.getElementById('root'));

root.render(
    <Provider store = { Store }>
        <App />
    </Provider>
);