"use client";
import { IoIosCloseCircle } from "react-icons/io";
import React from "react";

interface ModalProps {
    isOpen: boolean;
    onClose: () => void;
    title?: string;
    children: React.ReactNode;
}

export default function Modal({ isOpen, onClose, title, children }: ModalProps) {
    if (!isOpen) return null; // Don't render when closed

    return (
        <div className="fixed inset-0 flex items-center justify-center z-50">
            {/* Background overlay */}
            <div
                className="absolute inset-0 bg-black/50 backdrop-blur-sm"
                onClick={onClose}
            />

            {/* Modal box */}
            <div className="relative bg-white text-gray-800 rounded-xl shadow-lg w-11/12 max-w-md p-6 z-10 animate-fadeIn">
                <div className="flex justify-between items-center">
                    <h2 className="text-xl font-semibold">{title}</h2>
                    <button
                    onClick={onClose}
                    className="rounded-md"
                    >
                        <IoIosCloseCircle className="text-red-600 h-[40px] w-[40px]" />
                    </button>
                </div>
                {children}
            </div>
        </div>
    );
}