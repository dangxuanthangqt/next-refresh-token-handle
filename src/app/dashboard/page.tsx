"use client";

import { logout } from "@/api/auth-api";
import {
  deleteAuthTokenFromInternalServer,
  getTokensFromInternalServer,
} from "@/api/internal-auth-token-api";

export default function Page() {
  const onLogout = async () => {
    try {
      const tokens = await getTokensFromInternalServer();

      if (!tokens?.refreshToken) {
        return;
      }

      await logout({ refreshToken: tokens.refreshToken });
      window.location.replace("/login-google");

      await deleteAuthTokenFromInternalServer();
    } catch {}
  };

  return (
    <div className="p-4">
      <h1>Dashboard</h1>
      <button className="bg-blue-700 text-black" onClick={onLogout}>
        Logout
      </button>
    </div>
  );
}
