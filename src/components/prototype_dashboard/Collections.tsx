"use client";

type ActiveCollectionProps = {
  activeCollection: string;
};

import Image from "next/image";
import React, { useEffect, useState } from "react";
import { useUser } from "@/context/UserContext";
import { SavingsJug } from "@/types/SavingsJug";

const ITEMS_PER_PAGE = 12;

export default function Collection({ activeCollection }: ActiveCollectionProps) {
  const { currentUser } = useUser();
  const [items, setItems] = useState<SavingsJug[]>([]);
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    (async () => {
      if (!currentUser?.walletId) {
        setItems([]);
        return;
      }

      try {
        const res = await fetch(`/api/savings?walletId=${currentUser.walletId}`);
        if (!res.ok) return;

        const list = await res.json();
        const arr: SavingsJug[] = Array.isArray(list)
          ? list
          : Array.isArray(list.result)
          ? list.result
          : [];

        setItems(arr.filter((s) => s.isFinished));
        setCurrentPage(1); // reset page on reload
      } catch (e) {
        console.error(e);
      }
    })();
  }, [currentUser]);

  // Pagination logic
  const totalPages = Math.ceil(items.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const paginatedItems = items.slice(startIndex, startIndex + ITEMS_PER_PAGE);

  return (
    <div
      className={`w-full h-full text-2xl text-[#6C5321] pt-4
        ${activeCollection === "collections" ? "block" : "hidden"}`}
    >
      {/* Jugs */}
      <div className="flex flex-wrap items-start justify-start">
        {paginatedItems.map((jug, index) => (
          <div
            key={jug.id ?? index}
            className="flex justify-center items-center h-[180px] mt-[20px] w-[150px] mx-[15px] rounded-xl"
          >
            <div className="flex flex-col items-center justify-center w-full h-full text-white">
              <Image
                src={
                  jug.designPath
                    ? `/${jug.designPath}`
                    : jug.designId
                    ? `/${jug.designId}`
                    : "/DefaultDesign.png"
                }
                alt={jug.name}
                width={150}
                height={150}
              />
              <div className="h-[30px] w-full bg-black/50 rounded-lg flex flex-col text-xs items-center justify-center text-center">
                <p className="truncate w-[100px] text-white">{jug.name}</p>
                <p className="truncate w-[100px] text-white">
                  {jug.currentAmount}/{jug.goalAmount}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center items-center gap-4 mt-6">
          <button
            disabled={currentPage === 1}
            onClick={() => setCurrentPage((p) => p - 1)}
            className="px-4 py-2 rounded-lg bg-black/20 disabled:opacity-40"
          >
            Prev
          </button>

          <span className="text-sm">
            Page {currentPage} of {totalPages}
          </span>

          <button
            disabled={currentPage === totalPages}
            onClick={() => setCurrentPage((p) => p + 1)}
            className="px-4 py-2 rounded-lg bg-black/20 disabled:opacity-40"
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
}