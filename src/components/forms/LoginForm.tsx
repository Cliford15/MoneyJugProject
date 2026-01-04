"use client";

import React, { useState } from "react";
import { useUser } from "@/context/UserContext";
import { useRouter } from "next/navigation";

export default function Login() {
  const { users, setUsers, setCurrentUser } = useUser();
  const [loginData, setLoginData] = useState({ username: "", password: "" });
  const router = useRouter();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) =>
    setLoginData({ ...loginData, [e.target.id]: e.target.value });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username: loginData.username, password: loginData.password }),
        credentials: 'include'
      });

      if (res.status === 401) {
        alert('Invalid username or password');
        return;
      }

      if (!res.ok) {
        const txt = await res.text().catch(() => '');
        console.error('Login error', res.status, txt);
        alert('Login failed');
        return;
      }

      const user = await res.json();
      if (!user) {
        alert('Login failed');
        return;
      }

      const updatedUser = { ...user, isloggedin: true };
      setCurrentUser(updatedUser);
      setUsers(prev => prev.filter(u => u.userName !== updatedUser.userName).concat(updatedUser));
      alert(`Logged in as ${updatedUser.userName}`);
      setLoginData({ username: "", password: "" });
      router.push("/");
    } catch (err) {
      console.error(err);
      alert('Login request failed');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-3">
      <label htmlFor="username">Username:</label>
      <input
        id="username"
        type="text"
        placeholder="Username"
        className="w-full h-8 border-2 px-3 text-[#7E4228] rounded-lg bg-gray-200"
        required
        value={loginData.username}
        onChange={handleChange}
      />
      <label htmlFor="password">Password:</label>
      <input
        id="password"
        type="password"
        placeholder="Password"
        className="w-full h-8 border-2 px-3 text-[#7E4228] rounded-lg bg-gray-200"
        required
        value={loginData.password}
        onChange={handleChange}
      />
      <button
        type="submit"
        className="w-full h-12 bg-[#75DB55] text-white font-montserrat hover:bg-[#67c246] rounded-md my-[10px]"
      >
        Log In
      </button>
    </form>
  );
}
