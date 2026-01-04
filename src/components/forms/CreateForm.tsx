"use client";
import React, { useState } from "react";
import { SavingsJug } from "@/types/SavingsJug";
import { useUser } from "@/context/UserContext";

interface CreateFormProps {
    selectedJug: SavingsJug;
    onSave: (updatedJug: SavingsJug) => void;
    onClose: () => void;
}

export default function CreateForm({ selectedJug, onSave, onClose }: CreateFormProps) {
    const [nameInput, setNameInput] = useState("");
    const [goalInput, setGoalInput] = useState<number | "">("");
    const { currentUser } = useUser();

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        (async () => {
            if (!currentUser) {
                alert('You must be logged in to create a savings jug');
                return;
            }
            const payload = {
                name: nameInput,
                goalAmount: goalInput === "" ? 0 : Number(goalInput),
                walletId: currentUser?.walletId ?? null,
                designId: selectedJug.designId ?? null,
                slot: selectedJug.slot,
            };
            try {
                const res = await fetch('/api/savings', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(payload),
                });
                if (res.ok) {
                    const data = await res.json();
                    onSave({ ...selectedJug, ...data, set: true });
                } else {
                    const txt = await res.text().catch(() => '');
                    console.error('Create savings failed', res.status, txt);
                    onSave({
                        ...selectedJug,
                        name: nameInput,
                        goalAmount: goalInput === "" ? 0 : Number(goalInput),
                        set: true,
                    });
                }
            } catch (e) {
                console.error(e);
                onSave({
                    ...selectedJug,
                    name: nameInput,
                    goalAmount: goalInput === "" ? 0 : Number(goalInput),
                    set: true,
                });
            }
            onClose();
        })();
    };

    return (
        <form onSubmit={handleSubmit} className="flex flex-col gap-4 mt-4 text-xl">
            <div className="flex gap-3">
                <label htmlFor="name" className="text-black">Jug name:</label>
                <input
                    id="name"
                    type="text"
                    placeholder="ex: Clothes"
                    onChange={(e) => setNameInput(e.target.value)}
                    className="w-[250px] h-8 border-2 px-3 rounded-lg bg-gray-200"
                    required
                />
            </div>

            <div className="flex gap-3">
                <label htmlFor="amount" className="text-black">Goal amount:</label>
                <input
                    id="amount"
                    type="number"
                    placeholder="ex: 12000"
                    min={0}
                    onChange={(e) => setGoalInput(e.target.value ? Number(e.target.value) : "")}
                    className="w-[250px] h-8 border-2 px-3 rounded-lg bg-gray-200"
                    required
                />
            </div>

            <div className="flex items-center justify-center">
                <button
                    type="submit"
                    className="bg-[#89DB55] hover:bg-[#67c246] rounded-md py-1 w-[100px]"
                >
                    Save
                </button>
            </div>
        </form>
    );
}
