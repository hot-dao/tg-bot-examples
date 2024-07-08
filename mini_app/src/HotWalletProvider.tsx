import React, { useCallback, useContext, useEffect, useState } from "react";
import { HereWallet } from "@here-wallet/core";

interface HotUser {
  accounts: {
    near: string;
    solana: string;
    evm: string;
    ton: string;
  };
}

export const HotContext = React.createContext<{
  login: () => void;
  logout: () => void;
  here: HereWallet | null;
  user: HotUser | null;
}>({
  login: () => {},
  logout: () => {},
  here: null,
  user: null,
});

export const useHotWallet = () => {
  return useContext(HotContext);
};

export const HotWalletProvider = ({ children }: any) => {
  const [here, setHere] = useState<HereWallet | null>(null);
  const [user, setUser] = useState<HotUser | null>(null);

  useEffect(() => {
    const init = async () => {
      const here = await HereWallet.connect({
        walletId: "herewalletbot/beta",
        botId: "hothackexamplBot/app", // YOUR BOT LINK
      });

      setHere(here);

      const isSigned = await here.isSignedIn();
      if (isSigned) {
        const near = await here.getAccountId();
        setUser({ accounts: { near, solana: "", evm: "", ton: "" } });
      }
    };

    init();
  }, []);

  const login = useCallback(() => {
    here?.authenticate();
  }, [here]);

  const logout = useCallback(() => {
    here?.signOut();
    setUser(null);
  }, [here]);

  return <HotContext.Provider value={{ login, logout, here, user }}>{children}</HotContext.Provider>;
};
