"use client";

import React, { createContext, useContext, useState, ReactNode, useEffect } from "react";
import { UserInfo } from "@/types/UserInfo";

type UserContextType = {
  users: UserInfo[];
  setUsers: React.Dispatch<React.SetStateAction<UserInfo[]>>;
  currentUser: UserInfo | null;
  setCurrentUser: React.Dispatch<React.SetStateAction<UserInfo | null>>;
  walletBalance: number;
  refreshWallet: () => Promise<void>;
  deposit: (amount: number) => Promise<boolean>;
  withdraw: (amount: number) => Promise<boolean>;
};

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider = ({ children }: { children: ReactNode }) => {
  const [users, setUsers] = useState<UserInfo[]>([]);
  const [currentUser, setCurrentUser] = useState<UserInfo | null>(null);
  const [walletBalance, setWalletBalance] = useState<number>(0);

  const deposit = async (amount: number) => {
    if (typeof amount !== "number" || isNaN(amount) || amount <= 0) return false;
    if (!currentUser || !currentUser.walletId) {
      // fallback to local update
      setWalletBalance((b) => +(b + amount).toFixed(2));
      return true;
    }
    try {
      const res = await fetch(`/api/wallets/${currentUser.walletId}/deposit`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ amount }),
      });
      if (!res.ok) {
        console.error("Deposit failed", await res.text());
        return false;
      }
      const data = await res.json();
      if (data && data.balance != null) {
        setWalletBalance(Number(data.balance));
      } else if (data && data.wallet && data.wallet.balance != null) {
        setWalletBalance(Number(data.wallet.balance));
      }
      return true;
    } catch (e) {
      console.error(e);
      return false;
    }
  };

  const withdraw = async (amount: number) => {
    if (typeof amount !== "number" || isNaN(amount) || amount <= 0) return false;
    if (!currentUser || !currentUser.walletId) {
      if (amount > walletBalance) return false;
      setWalletBalance((b) => +(b - amount).toFixed(2));
      return true;
    }
    try {
      const res = await fetch(`/api/wallets/${currentUser.walletId}/withdraw`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ amount }),
      });
      if (!res.ok) {
        console.error("Withdraw failed", await res.text());
        return false;
      }
      const data = await res.json();
      if (data && data.balance != null) {
        setWalletBalance(Number(data.balance));
      } else if (data && data.wallet && data.wallet.balance != null) {
        setWalletBalance(Number(data.wallet.balance));
      }
      return true;
    } catch (e) {
      console.error(e);
      return false;
    }
  };

  const refreshWallet = async () => {
    if (!currentUser || !currentUser.walletId) { setWalletBalance(0); return; }
    try {
      const res = await fetch(`/api/wallets/${currentUser.walletId}`);
      if (!res.ok) return;
      const data = await res.json().catch(() => null);
      if (data && data.balance != null) setWalletBalance(Number(data.balance));
      else if (data && data.wallet && data.wallet.balance != null) setWalletBalance(Number(data.wallet.balance));
    } catch (e) { console.error(e); }
  };

  // sync wallet balance when current user changes
  useEffect(() => {
    (async () => {
      if (!currentUser || !currentUser.walletId) {
        setWalletBalance(0);
        return;
      }
      try {
        const res = await fetch(`/api/wallets/${currentUser.walletId}`);
        if (!res.ok) return;
        const data = await res.json().catch(() => null);
        if (data && data.balance != null) setWalletBalance(Number(data.balance));
        else if (data && data.wallet && data.wallet.balance != null) setWalletBalance(Number(data.wallet.balance));
      } catch (e) { console.error(e); }
    })();
  }, [currentUser]);

  return (
    <UserContext.Provider value={{ users, setUsers, currentUser, setCurrentUser, walletBalance, refreshWallet, deposit, withdraw }}>
      {children}
    </UserContext.Provider>
  );
};

// when currentUser changes, sync wallet balance
// (cannot use hooks outside component, so add effect inside provider)


// Custom hook
export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) throw new Error("useUser must be used within UserProvider");
  return context;
};