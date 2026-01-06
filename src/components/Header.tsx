"use client";

import Link from "next/link";
import { useUser } from "@/context/UserContext";
import { useEffect, useState } from "react";
import { useRouter } from 'next/navigation';
import { IoPersonCircleOutline } from "react-icons/io5";
import Image from "next/image";

export default function Header() {
  const { currentUser, setCurrentUser } = useUser();
  const [mounted, setMounted] = useState(false);
  const router = useRouter();
  useEffect(() => setMounted(true), []);

  // fetch username from API if not already present
  useEffect(() => {
    if (currentUser) return;
    (async () => {
      try {
        const res = await fetch('/api/auth/me');
        if (!res.ok) return;
        const data = await res.json();
        if (data && data.user) {
          setCurrentUser({ ...data.user, isloggedin: true });
        } else if (data && data.userName) {
          setCurrentUser({ ...data, isloggedin: true });
        }
      } catch {
        // ignore
      }
    })();
  }, [currentUser, setCurrentUser]);

  const handleLogout = async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' });
    } catch {
      // ignore
    }
    setCurrentUser(null);
    try {
      if (router && router.push) router.push('/');
      else window.location.href = '/';
    } catch (e) {
      window.location.href = '/';
    }
  };

  if (!mounted) return null;

  return (
    <header className="w-full h-20 bg-[#75DB55]">
      <div className="flex justify-between mx-[30px] h-full items-center text-sm">
        <div className="flex gap-[50px]">
          <Image src="/MoneyJugLogo.png" alt="Money Jug Logo" height={63} width={123}/>
          <nav className="flex gap-[30px] items-center text-[#7E4228] font-montserrat font-semibold">
            <Link href="/">Home</Link>
            <Link href="/prototype">Prototype</Link>
            <Link href="/about">About us</Link>
          </nav>
        </div>
        <div className="flex items-center justify-center text-[#7E4228] font-montserrat font-semibold">
          {currentUser ? (
            <div className="flex items-center gap-4">
              <Link href="/profile" className="flex items-center gap-2">
                {currentUser.userName} <IoPersonCircleOutline className="h-10 w-10" />
              </Link>
              <button onClick={handleLogout} className="text-sm underline">Logout</button>
            </div>
          ) : (
            <Link href="/register">Log in/Sign up</Link>
          )}
        </div>
      </div>
    </header>
  );
}