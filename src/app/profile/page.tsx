"use client";

import { IoPersonCircleOutline } from "react-icons/io5";
import { useUser } from "@/context/UserContext";
import { useRouter } from "next/navigation";

export default function Profile(){
    const { currentUser, setCurrentUser, setUsers, walletBalance } = useUser();
    const router = useRouter();

    const handleLogout = () => {
        // Update users array so isloggedin goes back to false
        setUsers(prev =>
            prev.map(u =>
                u.userName === currentUser?.userName
                    ? { ...u, isloggedin: false }
                    : u
            )
        );

        // Clear current user
        setCurrentUser(null);

        // Redirect
        router.push("/");
    };

    return (
        <div className="w-full h-screen flex justify-center bg-[#1F2A44]">
            <div className="w-[400px] flex flex-col items-center mt-10">
                <div className="flex items-center justify-center flex-col gap-3 w-[400px] shadow-md border-2 font-montserrat rounded-xl bg-white p-5">
                    <IoPersonCircleOutline className="h-32 w-32" />
                    <p className="text-black/75">@{currentUser?.userName}</p>
                    
                    <div className="flex justify-end items-center gap-2 w-10/12">
                        <label className="block text-sm font-bold font-archivoblack">Name:</label>
                        <input
                            type="text"
                            value={currentUser?.firstName + " " + currentUser?.middleName + " " + currentUser?.lastName}
                            className="mt-1 block w-[250px] rounded-md border-black border-2 shadow-sm p-2"
                            readOnly
                        />
                    </div>

                    <div className="flex justify-end items-center gap-2 w-10/12">
                        <label className="block text-sm font-bold font-archivoblack">Email:</label>
                        <input
                            type="text"
                            value={currentUser?.email}
                            className="mt-1 block w-[250px] rounded-md border-black border-2 shadow-sm p-2"
                            readOnly
                        />
                    </div>

                    <div className="flex justify-end items-center gap-2 w-10/12">
                        <label className="block text-sm font-bold font-archivoblack">Wallet Balance:</label>
                        <input
                            type="text"
                            value={walletBalance}
                            className="mt-1 block w-[250px] rounded-md border-black border-2 shadow-sm p-2"
                            readOnly
                        />
                    </div>

                    <button
                        onClick={handleLogout}
                        className="bg-red-600 text-white px-4 py-2 rounded-lg font-semibold mt-10 hover:scale-110"
                    >
                        Logout
                    </button>
                </div>
            </div>
        </div>
    );
}
