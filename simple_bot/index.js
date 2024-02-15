import { Telegraf } from "telegraf";
import { parseNearAmount } from "@near-js/utils";
import { connectHereWallet } from "./here-connector.js";

const bot = new Telegraf("6605741030:AAEvinhKXjm0Iuz31Mu4zwhPYTIOHE1zKto");

bot.command("start", async (ctx) => {
  ctx.replyWithMarkdownV2(
    "Welcome, send `/login` command to authorization and \n`/transfer ADDRESS NEAR_AMOUNT` to send NEAR"
  );
});

bot.command("login", (ctx) => {
  // Validate sign message after receive
  connectHereWallet(ctx, {
    nonce: Array.from(crypto.getRandomValues(new Uint8Array(32))),
    recipient: "HOTExampleConnectBot",
    message: "Authorization",
    type: "sign",
  })
    .then((result) => ctx.reply(`Hello ${result.account_id}`))
    .catch(() => ctx.reply(`Authorization failed`));
});

bot.command("transfer", (ctx) => {
  connectHereWallet(ctx, {
    type: "call",
    transactions: [
      {
        actions: [{ params: { deposit: parseNearAmount(ctx.args[1]) }, type: "Transfer" }],
        receiverId: ctx.args[0],
      },
    ],
  })
    .then((result) => ctx.reply(`Success transfer ${result.payload}`))
    .catch(() => ctx.reply(`Transfer failed`));
});

bot.launch();

// Enable graceful stop
process.once("SIGINT", () => bot.stop("SIGINT"));
process.once("SIGTERM", () => bot.stop("SIGTERM"));
