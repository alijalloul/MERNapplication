import path from 'path';
import fs from 'fs';
import express from 'express';
import React from 'react';
import * as dotenv from "dotenv";
import ReactDOMServer from 'react-dom/server';
import { StaticRouter } from 'react-router-dom/server';
import { Provider } from 'react-redux';
import { configureStore } from "@reduxjs/toolkit";

import App from "../src/App.js";
import Post from "../src/redux/Post.js";
import User from "../src/redux/User.js";

dotenv.config();
const PORT = process.env.PORT || 3000;
const app = express();

app.use(express.static('build', { index: false }));

app.get("/*", (req, res, next) => {
    const Store = configureStore({
      reducer: {
        post: Post,
        user: User
      }
  });

  const context = {};

  const html = ReactDOMServer.renderToString(
    <Provider store = { Store }>
      <StaticRouter location={req.url} context={context}>
        <App />
      </StaticRouter>
    </Provider>
  );
  
  const preloadedState = Store.getState();

  fs.readFile(path.resolve('./build/index.html'), 'utf8', (err, data) => {
    if (err) {
      console.error("read file error: ", err);
      return res.status(500).send('An error occurred');
    }

    //return res.status(200);
    return res.send(data
                    .replace('<div id="root"></div>',`<div id="root">${html}</div>`)
                    .replace('__PRELOADED_STATE__', JSON.stringify(preloadedState)));
  });
})

app.listen(PORT, "0.0.0.0", () => {
  console.log(`SSR running on port ${PORT}`);
});