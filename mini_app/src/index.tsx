import React from "react";
import { createRoot } from "react-dom/client";
import { HotWalletProvider } from "./HotWalletProvider";
import { App } from "./App";

const Root = () => {
  return (
    <HotWalletProvider>
      <App />
    </HotWalletProvider>
  );
};

const root = createRoot(document.getElementById("root")!);
root.render(<Root />);
