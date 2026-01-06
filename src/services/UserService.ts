// src/services/UserService.ts
import axios from "axios";
import { UserInfo } from "@/types/UserInfo";

const REST_API_BASE_URL = "/api/users";

// For creating a new user, we omit id, walletId, and isloggedin since those are handled by backend
export type CreateUserPayload = Omit<UserInfo, "id" | "walletId" | "isloggedin">;

export const createUser = (user: CreateUserPayload) => {
  return axios.post<UserInfo>(REST_API_BASE_URL, user);
};