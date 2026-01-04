"use client";

import React, { useState } from "react";
import { IoWalletOutline } from "react-icons/io5";
import Modal from "./Modal";
import { useUser } from "@/context/UserContext";

export default function Transaction(){

    const { walletBalance, deposit, withdraw, currentUser } = useUser();

    const [isDepositOpen, setIsDepositOpen] = useState(false);
    const [isWithdrawOpen, setIsWithdrawOpen] = useState(false);
    const [depositAmount, setDepositAmount] = useState<string>("");
    const [withdrawAmount, setWithdrawAmount] = useState<string>("");
    const [depositError, setDepositError] = useState<string | null>(null);
    const [withdrawError, setWithdrawError] = useState<string | null>(null);

    const handleDepositSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setDepositError(null);
        const amt = parseFloat(depositAmount);
        if (isNaN(amt) || amt <= 0) {
            setDepositError("Please enter a valid amount greater than 0.");
            return;
        }
        const ok = await deposit(amt);
        if (!ok) setDepositError("Deposit failed");
        setDepositAmount("");
        setIsDepositOpen(false);
    };

    const handleWithdrawSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setWithdrawError(null);
        const amt = parseFloat(withdrawAmount);
        if (isNaN(amt) || amt <= 0) {
            setWithdrawError("Please enter a valid amount greater than 0.");
            return;
        }
        if (amt > walletBalance) {
            setWithdrawError("Insufficient funds in wallet.");
            return;
        }
        const ok = await withdraw(amt);
        if (!ok) {
            setWithdrawError("Insufficient funds in wallet.");
            return;
        }
        setWithdrawAmount("");
        setIsWithdrawOpen(false);
    };

    return(
        <div className="w-[500px] flex flex-col gap-3 items-center font-montserrat py-5 bg-[#1F2A44]">
            <div className="flex items-center gap-1">
                <h1 className="text-3xl text-white">Wallet</h1>
                <IoWalletOutline className="h-[40px] w-[40px] text-white"/>
            </div>
            <h1 className="truncate w-[200px] text-white text-4xl text-center">{walletBalance.toFixed(2)}</h1>

            <div className="flex gap-3">
                <button onClick={() => {
                        if (!currentUser) { alert('Please log in to deposit'); return; }
                        setIsDepositOpen(true);
                    }}
                    disabled={!currentUser}
                    className={`bg-[#89DB55] ${currentUser ? 'hover:bg-[#67c246]' : 'opacity-50 cursor-not-allowed'} text-xl rounded-md py-1 font-semibold text-[#5a410e] w-[120px]`}>
                    Deposit
                </button>
                <button onClick={() => {
                        if (!currentUser) { alert('Please log in to withdraw'); return; }
                        setIsWithdrawOpen(true);
                    }}
                    disabled={!currentUser}
                    className={`bg-[#89DB55] ${currentUser ? 'hover:bg-[#67c246]' : 'opacity-50 cursor-not-allowed'} text-xl rounded-md py-1 font-semibold text-[#5a410e] w-[120px]`}>
                    Withdraw
                </button>
            </div>

            <Modal
                isOpen={isDepositOpen}
                onClose={() => setIsDepositOpen(false)}
                title="Deposit"
            >
                <form onSubmit={handleDepositSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Amount</label>
                        <input
                            type="number"
                            min="0"
                            step="0.01"
                            value={depositAmount}
                            onChange={(e) => setDepositAmount(e.target.value)}
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-2"
                            placeholder="0.00"
                        />
                    </div>
                    {depositError && <p className="text-sm text-red-600">{depositError}</p>}
                    <div>
                        <button type="submit" className="w-full bg-green-600 text-white py-2 rounded-md">Confirm Deposit</button>
                    </div>
                </form>
            </Modal>

            <Modal
                isOpen={isWithdrawOpen}
                onClose={() => setIsWithdrawOpen(false)}
                title="Withdraw"
            >
                <form onSubmit={handleWithdrawSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Amount</label>
                        <input
                            type="number"
                            min="0"
                            step="0.01"
                            value={withdrawAmount}
                            onChange={(e) => setWithdrawAmount(e.target.value)}
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-2"
                            placeholder="0.00"
                        />
                    </div>
                    {withdrawError && <p className="text-sm text-red-600">{withdrawError}</p>}
                    <div>
                        <button type="submit" className="w-full bg-red-600 text-white py-2 rounded-md">Confirm Withdraw</button>
                    </div>
                </form>
            </Modal>
        </div>
    );
}