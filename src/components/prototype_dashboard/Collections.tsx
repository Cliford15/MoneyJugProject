type ActiveCollectionProps = {
    activeCollection: string;
};

import React, { useEffect, useState } from "react";
import { useUser } from "@/context/UserContext";
import { SavingsJug } from "@/types/SavingsJug";

export default function Collection({ activeCollection }: ActiveCollectionProps) {
    const { currentUser } = useUser();
    const [items, setItems] = useState<SavingsJug[]>([]);

    useEffect(() => {
        (async () => {
            if (!currentUser || !currentUser.walletId) {
                setItems([]);
                return;
            }

            try {
                const res = await fetch(`/api/savings?walletId=${currentUser.walletId}`);
                if (!res.ok) return;

                const list = await res.json();
                const arr = Array.isArray(list)
                    ? list
                    : Array.isArray(list.result)
                    ? list.result
                    : [];

                setItems(arr.filter((s: SavingsJug) => s.isFinished));
            } catch (e) {
                console.error(e);
            }
        })();
    }, [currentUser]);

    /**
     * Create 12 empty gallery slots
     * NOTE: optional fields use `undefined`, NOT null
     */
    const slots: SavingsJug[] = Array.from({ length: 12 }, (_, i) => ({
        id: null,
        name: "",
        currentAmount: 0,
        goalAmount: 0,
        isBroken: false,
        isFinished: true,
        walletId: currentUser?.walletId ?? null,
        designId: null,
        designPath: undefined, // ✅ FIX HERE
        slot: i + 1,
        set: false,
    }));

    /**
     * Fill slots sequentially (ignore original slot)
     */
    items.slice(0, slots.length).forEach((it, index) => {
        if (!slots[index]) return;

        slots[index] = {
            ...slots[index],
            ...it,
            set: true,
        };
    });

    return (
        <div
            className={`w-full h-full flex flex-wrap items-start justify-start text-2xl text-[#6C5321] pt-4
            ${activeCollection === "collections" ? "block" : "hidden"}`}
        >
            {slots.map((jug) => (
                <div
                    key={jug.id ?? `collection-slot-${jug.slot}`}
                    className={`flex justify-center items-center ${
                        !jug.set
                            ? "h-[150px] mb-[40px] mt-[20px] bg-black/10"
                            : "h-[180px] mt-[20px]"
                    } w-[150px] mx-[15px] rounded-xl`}
                >
                    {!jug.set ? (
                        <div className="flex flex-col items-center justify-center w-full h-full text-gray-400" />
                    ) : (
                        <div className="flex flex-col items-center justify-center w-full h-full text-white">
                            <img
                                src={
                                    jug.designPath
                                        ? `/${jug.designPath}`
                                        : jug.designId
                                        ? `/${jug.designId}`
                                        : "/DefaultDesign.png"
                                }
                                alt={jug.name}
                                className="h-[150px] w-[150px]"
                            />
                            <div className="h-[30px] w-full bg-black/50 rounded-lg flex flex-col text-xs items-center justify-center text-center">
                                <p className="truncate w-[100px] text-white">{jug.name}</p>
                                <p className="truncate w-[100px] text-white">
                                    {jug.currentAmount}/{jug.goalAmount}
                                </p>
                            </div>
                        </div>
                    )}
                </div>
            ))}
        </div>
    );
}