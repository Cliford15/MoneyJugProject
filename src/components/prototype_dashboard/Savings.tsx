"use client";

import { IoAdd } from "react-icons/io5";
import React, { useState } from "react";
import { useRouter } from 'next/navigation';
import { useUser } from "@/context/UserContext";
import Modal from "@/components/Modal";
import { SavingsJug } from "@/types/SavingsJug";
import CreateForm from "@/components/forms/CreateForm";
import EditForm from "@/components/forms/EditForm";

type ActiveCollectionProps = {
    activeCollection: string;
};

export default function Savings({ activeCollection }: ActiveCollectionProps) {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedJug, setSelectedJug] = useState<SavingsJug | null>(null);

    const { currentUser, walletBalance, refreshWallet } = useUser();
    const [jugs, setJugs] = useState<SavingsJug[]>(
        Array.from({ length: 12 }, (_, i) => ({
            id: null,
            name: "",
            currentAmount: 0,
            goalAmount: 0,
            isBroken: false,
            isFinished: false,
            walletId: currentUser?.walletId ?? null,
            designId: null,
            slot: i + 1,
            set: false,
        }))
    );

    // fetch and populate savings for this user's wallet
    const fetchSavings = async () => {
        try {
            if (!currentUser || !currentUser.walletId) {
                // clear jugs when logged out
                setJugs(
                    Array.from({ length: 12 }, (_, i) => ({
                        id: null,
                        name: "",
                        currentAmount: 0,
                        goalAmount: 0,
                        isBroken: false,
                        isFinished: false,
                        walletId: null,
                        designId: null,
                        slot: i + 1,
                        set: false,
                    }))
                );
                return;
            }

            const res = await fetch(`/api/savings?walletId=${currentUser.walletId}`);
            if (!res.ok) return;
            const list = await res.json();
            const arr = Array.isArray(list) ? list : Array.isArray(list.result) ? list.result : [];
            // only include savings that are not finished and not broken for the savings grid
            const arrFiltered = Array.isArray(arr) ? arr.filter((s: any) => !s.isFinished && !s.isBroken) : [];
            if (Array.isArray(arrFiltered)) {
                setJugs((prev) => {
                    const next = [...prev];
                    for (const s of arrFiltered) {
                        if (s && s.slot && s.slot >= 1 && s.slot <= 12) {
                            next[s.slot - 1] = { ...next[s.slot - 1], ...s, set: true };
                        }
                    }
                    return next;
                });
            }
        } catch (e) { console.error(e); }
    };

    React.useEffect(() => {
        fetchSavings();
    }, [currentUser]);

    // poll to keep savings list fresh while user is on the page
    React.useEffect(() => {
        if (!currentUser || !currentUser.walletId) return;
        const id = setInterval(() => fetchSavings(), 10000);
        return () => clearInterval(id);
    }, [currentUser]);

        const router = useRouter();
        const openModal = (jug: SavingsJug) => {
            if (!currentUser && !jug.set) {
            alert('Please log in to create a savings jug');
            router.push('/register');
            return;
            }
            setSelectedJug(jug);
            setIsModalOpen(true);
        };

    const handleSave = async (updatedJug: SavingsJug) => {
            setJugs((prev) =>
                prev.map((jug) => {
                    if (jug.slot !== updatedJug.slot) return jug;
                    // if the savings finished, remove it from the savings view (it will appear in Collections)
                    if ((updatedJug as any).isFinished) {
                        return { ...jug, id: updatedJug.id ?? null, name: "", currentAmount: 0, goalAmount: 0, isBroken: false, isFinished: false, set: false } as SavingsJug;
                    }
                    // if broken, also remove from savings view
                    if ((updatedJug as any).isBroken) {
                        return { ...jug, id: updatedJug.id ?? null, name: "", currentAmount: 0, goalAmount: 0, isBroken: false, isFinished: false, set: false } as SavingsJug;
                    }
                    return { ...jug, ...updatedJug, set: true } as SavingsJug;
                })
            );
            setIsModalOpen(false);
            // refresh from backend to ensure finished/broken items aren't repopulated into grid
            try { await fetchSavings(); } catch (e) { console.error(e); }
    };

    

    return (
        <div className={`w-full h-full flex flex-wrap items-center justify-center text-2xl text-[#6C5321]
            ${activeCollection === "savings" ? "block" : "hidden"}`}
        >
            {jugs.map((jug) => (
                <div
                    key={jug.slot}
                    className={`flex justify-center items-center ${!jug.set? "h-[150px] mb-[40px] mt-[20px] bg-black/50 shadow-md" : "h-[180px] mt-[20px]"} 
                    w-[150px] mx-[15px] rounded-xl hover:scale-105 transition-transform`}
                >
                    {jug && !jug.set ? (
                        <button
                            onClick={() => openModal(jug)}
                            className="flex flex-col items-center justify-center w-full h-full text-white"
                        >
                            <IoAdd className="h-[100px] w-[100px] text-white/50" />
                        </button>
                    ) : jug && jug.set && !jug.isFinished && !jug.isBroken ? (

                        <button
                            onClick={() => openModal(jug)}
                            className="flex flex-col items-center justify-center w-full h-full text-white"
                        >
                            <div className="flex flex-col">
                                <img src={jug && jug.designPath ? `/${jug.designPath}` : jug && jug.designId ? `/${jug.designId}` : "/FixJug1.png"} alt="Jug Design" className="h-[150px] w-[150px]"/>
                                <div className="h-[30px] w-full bg-black/50 rounded-lg flex flex-col text-xs items-center justify-center text-center">
                                    <p className="truncate w-[100px] text-white hover:overflow-visible underline">{jug.name}</p>
                                    <p className="truncate w-[100px] text-white hover:overflow-visible">{jug.currentAmount}/{jug.goalAmount}</p>
                                </div>
                            </div>
                        </button>
                    ) : null}
                </div>
            ))}

            {/* Modal that shows either the Create or Edit form */}
            <Modal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                title={selectedJug ? `Slot ${selectedJug.slot}` : "Savings Jug"}
            >
                <div>
                    {selectedJug && !selectedJug.set ? (
                        <div className="flex flex-col items-center gap-5 py-5 text-[#6C5321]">
                            <img
                                src={'/FixJug1.png'}
                                alt="Jug Design"
                                className="h-[150px] w-[150px]"
                            />

                            <CreateForm
                                selectedJug={selectedJug}
                                onSave={handleSave}
                                onClose={() => setIsModalOpen(false)}
                            />
                        </div>
                        ) : selectedJug && selectedJug.set ? (
                            <div className="flex flex-col items-center gap-5 py-5 text-[#6C5321]">
                                <img
                                    src={selectedJug && selectedJug.designPath ? `/${selectedJug.designPath}` : selectedJug && selectedJug.designId ? `/${selectedJug.designId}` : "/DefaultDesign.png"}
                                    alt="Jug Design"
                                    className="h-[150px] w-[150px]"
                                />
                                <button onClick={async () => {
                                    try {
                                        if (!currentUser) { alert('Please log in to break a savings jug'); return; }
                                        if (!selectedJug || !selectedJug.id) {
                                            // nothing persisted yet
                                            await handleSave({ ...(selectedJug as any), set: false, isBroken: true } as any);
                                            return;
                                        }
                                        if (selectedJug.walletId != null && currentUser.walletId != null && selectedJug.walletId !== currentUser.walletId) {
                                            alert('You do not own this savings jug');
                                            return;
                                        }
                                        const res = await fetch(`/api/savings/${selectedJug.id}/break`, { method: 'POST' });
                                        if (res.ok) {
                                            const data = await res.json();
                                            await handleSave({ ...selectedJug, ...data });
                                            try { await refreshWallet(); } catch (e) { /* ignore */ }
                                        } else {
                                            console.error('Break failed', await res.text());
                                        }
                                    } catch (e) { console.error(e); }
                                    setIsModalOpen(false);
                                }} className="bg-[#89DB55] hover:bg-[#67c246] text-xl rounded-md py-1 w-[100px]">
                                    Break
                                </button>

                                <div className="flex flex-col items-center gap-4">
                                    <div className="flex gap-2 items-center">
                                        <input
                                            type="number"
                                            min={0}
                                            max={selectedJug.goalAmount - selectedJug.currentAmount}
                                            step="0.01"
                                            placeholder="Amount"
                                            id="savingsDeposit"
                                        />
                                        <button onClick={async () => {
                                            try {
                                                const el = document.getElementById('savingsDeposit') as HTMLInputElement | null;
                                                const amt = el ? parseFloat(el.value) : 0;
                                                if (!currentUser) { alert('Please log in to deposit'); return; }
                                                if (!selectedJug || !selectedJug.id) {
                                                    alert('Please create the savings jug first');
                                                    return;
                                                }
                                                if (selectedJug.walletId != null && currentUser.walletId != null && selectedJug.walletId !== currentUser.walletId) {
                                                    alert('You do not own this savings jug');
                                                    return;
                                                }
                                                if (isNaN(amt) || amt <= 0) {
                                                    alert('Enter valid amount');
                                                    return;
                                                }
                                                if (typeof walletBalance === 'number' && amt > walletBalance) {
                                                    alert('Insufficient wallet balance');
                                                    return;
                                                }

                                                const remaining = selectedJug.goalAmount - selectedJug.currentAmount;

                                                if (amt > remaining) {
                                                    alert(`Deposit exceeds goal amount. You can only deposit up to ${remaining}.`);
                                                    return;
                                                }


                                                const res = await fetch(`/api/savings/${selectedJug.id}/deposit`, {
                                                    method: 'POST',
                                                    headers: { 'Content-Type': 'application/json' },
                                                    body: JSON.stringify({ amount: amt }),
                                                });
                                                if (res.ok) {
                                                    const data = await res.json();
                                                    await handleSave({ ...selectedJug, ...data });
                                                    try { await refreshWallet(); } catch (e) { /* ignore */ }
                                                } else {
                                                    console.error('Deposit to savings failed', await res.text());
                                                }
                                            } catch (e) { console.error(e); }
                                            setIsModalOpen(false);
                                            }} className="bg-[#89DB55] hover:bg-[#67c246] text-sm rounded-md py-1 px-3">
                                            Deposit
                                        </button>
                                    </div>

                                    <EditForm
                                        selectedJug={selectedJug}
                                        onSave={handleSave}
                                        onClose={() => setIsModalOpen(false)}
                                    />
                                </div>
                            </div>
                        ) : null}
                </div>
            </Modal>
        </div>
    );
}