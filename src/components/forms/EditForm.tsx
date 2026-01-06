"use client";

import React, { useEffect, useState } from "react";
import { SavingsJug } from "@/types/SavingsJug";

interface CreateFormProps {
    selectedJug: SavingsJug;
    onSave: (updatedJug: SavingsJug) => Promise<void> | void;
    onClose: () => void;
}

// Define payload type
interface SavingsJugPayload {
    name: string;
    goalAmount: number;
}

export default function CreateForm({ selectedJug, onSave, onClose }: CreateFormProps) {
    const [nameInput, setNameInput] = useState<string>(selectedJug?.name ?? "");
    const [goalInput, setGoalInput] = useState<number | "">(selectedJug?.goalAmount ?? "");

    useEffect(() => {
        setNameInput(selectedJug?.name ?? "");
        setGoalInput(selectedJug?.goalAmount ?? "");
    }, [selectedJug]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!selectedJug) return;

        const payload: SavingsJugPayload = {
            name: nameInput || selectedJug.name,
            goalAmount: goalInput === "" ? 0 : Number(goalInput),
        };

        try {
            if (selectedJug.id) {
                const res = await fetch(`/api/savings/${selectedJug.id}`, {
                    method: "PUT",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(payload),
                });

                if (res.ok) {
                    const data: Partial<SavingsJug> = await res.json();
                    await onSave({ ...selectedJug, ...data, set: true });
                } else {
                    console.error("Update failed", await res.text().catch(() => ""));
                    await onSave({ ...selectedJug, ...payload, set: true });
                }
            } else {
                await onSave({ ...selectedJug, ...payload, set: true });
            }
        } catch (error) {
            console.error(error);
            await onSave({ ...selectedJug, ...payload, set: true });
        }

        onClose();
    };

    return (
        <form onSubmit={handleSubmit} className="flex flex-col gap-4 mt-4 text-sm sm:text-lg">
            <div className="flex gap-3 items-center">
                <label htmlFor="name" className="w-[120px] text-black">Jug name:</label>
                <input
                    id="name"
                    type="text"
                    placeholder="ex: Clothes"
                    value={nameInput}
                    onChange={(e) => setNameInput(e.target.value)}
                    className="w-[250px] h-9 border-2 px-3 rounded-lg bg-gray-200"
                    required
                />
            </div>

            <div className="flex gap-3 items-center">
                <label htmlFor="amount" className="w-[120px] text-black">Goal amount:</label>
                <input
                    id="amount"
                    type="number"
                    placeholder="ex: 12000"
                    min={0}
                    value={goalInput === "" ? "" : String(goalInput)}
                    onChange={(e) => {
                        if (e.target.value === "") return setGoalInput("");
                        const num = Number(e.target.value);
                        if (Number.isNaN(num)) return;
                        setGoalInput(num < 0 ? 0 : num);
                    }}
                    className="w-[250px] h-9 border-2 px-3 rounded-lg bg-gray-200"
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