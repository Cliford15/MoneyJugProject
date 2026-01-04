// src/types/SavingsJug.ts

export interface SavingsJug {
    id: number | null;
    name: string;
    currentAmount: number;
    goalAmount: number;
    isBroken: boolean;
    isFinished: boolean;
    walletId: number | null;
    designId: number | null;
    designPath?: string;
    slot: number;
    set: boolean;
}
