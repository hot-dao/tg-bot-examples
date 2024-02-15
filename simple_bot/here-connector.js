import uuid4 from "uuid4";
import express from "express";
import { utils } from "near-api-js";
import { link } from "telegraf/format";
import bodyParser from "body-parser";
import cors from "cors";

const promises = {};
const app = express();
app.use(bodyParser());
app.use(cors());

app.post("/connect", (req, res) => {
  if (req.body.success) promises[req.body.id]?.resolve(req.body);
  else promises[req.body.id]?.reject(req.body);
  delete promises[req.body.id];
  res.sendStatus(200);
});

app.listen(3000, () => console.log(`Example app listening on port ${3000}`));

export const connectHereWallet = (ctx, request) => {
  const id = uuid4();
  const data = utils.serialize.base_encode(
    JSON.stringify({
      ...request,
      // Setup yourn own ngrok for localhost debug
      callbackUrl: "https://829b-5-161-109-83.ngrok-free.app/connect",
      id,
    })
  );

  const WEB_APP_URL = `https://t.me/herewalletbot/beta?startapp=${data}`;
  ctx.reply(link("Login via HERE Wallet", WEB_APP_URL));

  return new Promise((resolve, reject) => {
    promises[id] = { resolve, reject };
  });
};
