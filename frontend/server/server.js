import { configureStore } from "@reduxjs/toolkit";
import * as dotenv from "dotenv";
import express from "express";
import fs from "fs";
import https from "https";
import path from "path";
import React from "react";
import ReactDOMServer from "react-dom/server";
import { Provider } from "react-redux";
import { StaticRouter } from "react-router-dom/server";

import App from "../src/App.js";
import Post from "../src/redux/Post.js";
import User from "../src/redux/User.js";

dotenv.config();
const PORT = process.env.PORT || 3000;
console.log(PORT);
const app = express();

if (process.env.PORT) {
  console.log("PORT EXISTS");
  function pingWebsite() {
    https
      .get("https://recollections-client.onrender.com/", (res) => {
        console.log("Website pinged successfully");
      })
      .on("error", (err) => {
        console.error("Error while pinging website:", err);
      });
  }

  // Ping website every 14 minutes (840000 milliseconds)
  setInterval(pingWebsite, 840000);
}

app.use(express.static("build", { index: false }));

app.get("/*", (req, res, next) => {
  const Store = configureStore({
    reducer: {
      post: Post,
      user: User,
    },
  });

  const context = {};

  const html = ReactDOMServer.renderToString(
    <Provider store={Store}>
      <StaticRouter location={req.url} context={context}>
        <App />
      </StaticRouter>
    </Provider>
  );

  const preloadedState = Store.getState();

  fs.readFile(path.resolve("./build/index.html"), "utf8", (err, data) => {
    if (err) {
      console.error("read file error: ", err);
      return res.status(500).send("An error occurred");
    }

    //return res.status(200);
    return res.send(
      data
        .replace('<div id="root"></div>', `<div id="root">${html}</div>`)
        .replace("__PRELOADED_STATE__", JSON.stringify(preloadedState))
    );
  });
});

app.listen(PORT, "0.0.0.0", () => {
  console.log(`SSR running on port ${PORT}`);
});
