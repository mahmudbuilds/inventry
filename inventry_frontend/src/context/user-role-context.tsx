"use client";

import * as React from "react";

export type UserRole = "Admin" | "Staff" | "Member";

const UserRoleContext = React.createContext<UserRole>("Member");

export function UserRoleProvider({
  role,
  children,
}: {
  role: UserRole;
  children: React.ReactNode;
}) {
  return (
    <UserRoleContext.Provider value={role}>{children}</UserRoleContext.Provider>
  );
}

export function useUserRole() {
  const role = React.useContext(UserRoleContext);
  return {
    role,
    canManageInventory: role === "Admin" || role === "Staff",
    canDeleteInventory: role === "Admin",
    canManageUsers: role === "Admin",
  };
}
