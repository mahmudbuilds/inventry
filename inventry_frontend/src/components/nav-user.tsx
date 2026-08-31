"use client";

import { EllipsisVerticalIcon, Loader2Icon, LogOutIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";
import { apiFetch } from "@/lib/api-client";

export interface UserType {
  name: string;
  role: string;
  email: string;
  avatar?: string;
  company?: {
    id: number;
    name: string;
  };
  password_change_required?: boolean;
}

export function NavUser({ user }: { user: UserType | null }) {
  const { isMobile } = useSidebar();
  const _router = useRouter();
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  if (!user) {
    return null;
  }

  async function handleLogout() {
    setIsLoggingOut(true);
    try {
      await apiFetch("/api/auth/logout/", {
        method: "POST",
      });
    } catch (err) {
      console.error("Logout error:", err);
    } finally {
      // Clear cookies from client-side as well
      document.cookie =
        "access_token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT";
      document.cookie =
        "refresh_token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT";
      setShowLogoutConfirm(false);
      setIsLoggingOut(false);
      window.location.href = "/login";
    }
  }

  function capitalize(word: string) {
    return word ? word.charAt(0).toUpperCase() + word.slice(1) : "";
  }

  return (
    <>
      <SidebarMenu>
        <SidebarMenuItem>
          <DropdownMenu>
            <DropdownMenuTrigger
              render={
                <SidebarMenuButton
                  size="lg"
                  className="aria-expanded:bg-muted"
                />
              }
            >
              <Avatar className="size-8 rounded-lg grayscale">
                {user.avatar && (
                  <AvatarImage src={user.avatar} alt={user.name} />
                )}
                <AvatarFallback className="rounded-lg">
                  {user.name.slice(0, 2).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <div className="grid flex-1 text-left text-sm leading-tight">
                <span className="truncate font-medium">{user.name}</span>
                <span className="truncate text-xs text-foreground/70">
                  {user.email} ({capitalize(user.role)})
                </span>
              </div>
              <EllipsisVerticalIcon className="ml-auto size-4" />
            </DropdownMenuTrigger>
            <DropdownMenuContent
              className="min-w-56"
              side={isMobile ? "bottom" : "right"}
              align="end"
              sideOffset={4}
            >
              <DropdownMenuGroup>
                <DropdownMenuLabel className="p-0 font-normal">
                  <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
                    <Avatar className="size-8">
                      {user.avatar && (
                        <AvatarImage src={user.avatar} alt={user.name} />
                      )}
                      <AvatarFallback className="rounded-lg">
                        {user.name.slice(0, 2).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <div className="grid flex-1 text-left text-sm leading-tight">
                      <span className="truncate font-medium">{user.name}</span>
                      <span className="truncate text-xs text-muted-foreground">
                        <span className="font-bold">Role</span>:{" "}
                        {capitalize(user.role)}
                      </span>
                      {user.company && (
                        <span className="truncate text-xs text-muted-foreground">
                          <span className="font-bold">Company</span>:{" "}
                          {user.company.name}
                        </span>
                      )}
                    </div>
                  </div>
                </DropdownMenuLabel>
              </DropdownMenuGroup>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={() => setShowLogoutConfirm(true)}
                className="cursor-pointer text-red-600 focus:text-red-600"
              >
                <LogOutIcon className="mr-2 size-4" />
                Log out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </SidebarMenuItem>
      </SidebarMenu>

      <Dialog open={showLogoutConfirm} onOpenChange={setShowLogoutConfirm}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Log out of your account?</DialogTitle>
            <DialogDescription>
              You will need to sign in again to access your dashboard and
              inventory management.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="mt-4 gap-2">
            <DialogClose
              render={
                <Button variant="outline" disabled={isLoggingOut}>
                  Cancel
                </Button>
              }
            />
            <Button
              variant="destructive"
              onClick={handleLogout}
              disabled={isLoggingOut}
            >
              {isLoggingOut ? (
                <>
                  <Loader2Icon className="mr-2 size-4 animate-spin" />
                  Logging out...
                </>
              ) : (
                <>
                  <LogOutIcon className="mr-2 size-4" />
                  Log out
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
