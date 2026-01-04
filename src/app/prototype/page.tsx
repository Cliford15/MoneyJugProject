"use client";
import React, {useState} from "react";
import Savings from "@/components/prototype_dashboard/Savings";
import Collection from "@/components/prototype_dashboard/Collections";
import Broken from "@/components/prototype_dashboard/Broken";
import Transaction from "@/components/transaction/TransactionBody";
import Navigation from "@/components/prototype_dashboard/Navigation";

export default function Prototype(){

    const [activeCollection, setActiveCollection] = useState<"savings" | "collections" | "broken">("savings");
    
    function handleActiveCollection(e: React.MouseEvent<HTMLButtonElement>) {
        const button = e.currentTarget;
        setActiveCollection(button.id as "savings" | "collections" | "broken");
    }

    return(
        <div className="w-full h-screen flex">
            <Navigation onButtonClick={handleActiveCollection} activeCollection={activeCollection}/>

            <div className="bg-[url('/Shelf.png')] bg-cover bg-center h-screen w-full">
                <Savings activeCollection={activeCollection}/>
                <Collection activeCollection={activeCollection}/>
                <Broken activeCollection={activeCollection}/>
            </div>

            <Transaction />
        </div>
    );
}