"use client";

import React, { useState } from "react";
import { useUser } from "@/context/UserContext";
import { createUser } from "@/services/UserService";

export default function Signup() {
  const { users, setUsers} = useUser();
  const [formData, setFormData] = useState({
    id: null,
    userName: '',
    firstName: '',
    middleName: '',
    lastName: '',
    email: '',
    walletId: null,
    password: '',
    isloggedin: false,
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) =>
    setFormData({ ...formData, [e.target.id]: e.target.value });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const payload = {
        userName: formData.userName,
        firstName: formData.firstName,
        middleName: formData.middleName,
        lastName: formData.lastName,
        email: formData.email,
        password: formData.password,
      };
      const res = await createUser(payload);
      const created = res?.data ?? payload;
      setUsers([...users, created]);
      alert("User signed up successfully!");
      setFormData({id: null, userName: "", firstName: "", middleName: "", lastName: "", email: "", walletId: null, password: "", isloggedin: false});
    } catch (err: any) {
      console.error(err);
      alert("Failed to sign up user. See console for details.");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-1">
      <label htmlFor="firstName">First Name:</label>
      <input
        id="firstName"
        type="text"
        className="w-full h-8 border-2 px-3 text-[#7E4228] rounded-lg bg-gray-200"
        value={formData.firstName}
        onChange={handleChange}
        required
      />
      <label htmlFor="middleName">Middle Name:</label>
      <input
        id="middleName"
        type="text"
        className="w-full h-8 border-2 px-3 text-[#7E4228] rounded-lg bg-gray-200"
        value={formData.middleName}
        onChange={handleChange}
        required
      />
      <label htmlFor="lastName">Last Name:</label>
      <input
        id="lastName"
        type="text"
        className="w-full h-8 border-2 px-3 text-[#7E4228] rounded-lg bg-gray-200"
        value={formData.lastName}
        onChange={handleChange}
        required
      />
      <label htmlFor="email">Email:</label>
      <input
        id="email"
        type="email"
        className="w-full h-8 border-2 px-3 text-[#7E4228] rounded-lg bg-gray-200"
        value={formData.email}
        onChange={handleChange}
        required
      />
      <label htmlFor="userName">Username:</label>
      <input
        id="userName"
        type="text"
        className="w-full h-8 border-2 px-3 text-[#7E4228] rounded-lg bg-gray-200"
        value={formData.userName}
        onChange={handleChange}
        required
      />
      <label htmlFor="password">Password:</label>
      <input
        id="password"
        type="password"
        className="w-full h-8 border-2 px-3 text-[#7E4228] rounded-lg bg-gray-200"
        value={formData.password}
        onChange={handleChange}
        required
      />
      <button
        type="submit"
        className="w-full h-12 bg-[#7E4228] text-white font-montserrat hover:bg-[#5b301f] rounded-md mt-3"
      >
        Sign Up
      </button>
    </form>
  );
}
