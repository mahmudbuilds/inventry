"use client";

import {
  CheckCircle2Icon,
  Loader2Icon,
  MoreVerticalIcon,
  PencilIcon,
  PlusIcon,
  SearchIcon,
  ShieldAlertIcon,
  ShieldCheckIcon,
  Trash2Icon,
  UserCheckIcon,
  UserCogIcon,
  UsersIcon,
  XCircleIcon,
} from "lucide-react";
import { useRouter } from "next/navigation";
import * as React from "react";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { apiFetch, formatApiError } from "@/lib/api-client";

export interface ManagedUser {
  id: number;
  username: string;
  email: string;
  name: string;
  role: "Admin" | "Staff" | "Member";
  is_active: boolean;
  date_joined: string;
}

export function UsersClient({
  initialUsers = [],
  currentUserId,
}: {
  initialUsers: ManagedUser[];
  currentUserId?: number;
}) {
  const router = useRouter();
  const [users, setUsers] = React.useState<ManagedUser[]>(initialUsers);
  const [search, setSearch] = React.useState("");
  const [roleFilter, setRoleFilter] = React.useState("ALL");

  // Edit Role Modal State
  const [editUser, setEditUser] = React.useState<ManagedUser | null>(null);
  const [editOpen, setEditOpen] = React.useState(false);
  const [editSubmitting, setEditSubmitting] = React.useState(false);
  const [selectedRole, setSelectedRole] = React.useState<string>("Member");

  // Delete Modal State
  const [deleteUser, setDeleteUser] = React.useState<ManagedUser | null>(null);
  const [deleteOpen, setDeleteOpen] = React.useState(false);
  const [deleteSubmitting, setDeleteSubmitting] = React.useState(false);
  const [createOpen, setCreateOpen] = React.useState(false);
  const [createSubmitting, setCreateSubmitting] = React.useState(false);
  const [newUser, setNewUser] = React.useState({
    username: "",
    email: "",
    password: "",
    role: "Member",
  });

  React.useEffect(() => {
    setUsers(initialUsers);
  }, [initialUsers]);

  // Derived Counts
  const counts = React.useMemo(() => {
    const total = users.length;
    const admins = users.filter((u) => u.role === "Admin").length;
    const staff = users.filter((u) => u.role === "Staff").length;
    const members = users.filter((u) => u.role === "Member").length;
    return { total, admins, staff, members };
  }, [users]);

  // Filtered users
  const filteredUsers = React.useMemo(() => {
    return users.filter((u) => {
      const matchSearch =
        u.username.toLowerCase().includes(search.toLowerCase()) ||
        u.email.toLowerCase().includes(search.toLowerCase()) ||
        u.name.toLowerCase().includes(search.toLowerCase());

      const matchRole = roleFilter === "ALL" || u.role === roleFilter;

      return matchSearch && matchRole;
    });
  }, [users, search, roleFilter]);

  const openEditDialog = (user: ManagedUser) => {
    setEditUser(user);
    setSelectedRole(user.role);
    setEditOpen(true);
  };

  const handleRoleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editUser) return;

    setEditSubmitting(true);
    try {
      const res = await apiFetch(`/api/auth/users/${editUser.id}/`, {
        method: "PATCH",
        body: JSON.stringify({ role: selectedRole }),
      });

      if (res.ok) {
        const updatedUser = await res.json();
        setUsers((prev) =>
          prev.map((u) =>
            u.id === editUser.id ? { ...u, role: updatedUser.role } : u,
          ),
        );
        toast.success(
          `Updated role for ${editUser.username} to ${selectedRole}`,
        );
        setEditOpen(false);
        router.refresh();
      } else {
        const err = await res.json();
        toast.error(formatApiError(err, "Failed to update role"));
      }
    } catch (err) {
      console.error(err);
      toast.error("Network error while updating role");
    } finally {
      setEditSubmitting(false);
    }
  };

  const openDeleteDialog = (user: ManagedUser) => {
    setDeleteUser(user);
    setDeleteOpen(true);
  };

  const handleDeleteUser = async () => {
    if (!deleteUser) return;
    if (deleteUser.id === currentUserId) {
      toast.error("You cannot delete your own active account");
      return;
    }

    setDeleteSubmitting(true);
    try {
      const res = await apiFetch(`/api/auth/users/${deleteUser.id}/`, {
        method: "DELETE",
      });

      if (res.ok) {
        setUsers((prev) => prev.filter((u) => u.id !== deleteUser.id));
        toast.success(`User ${deleteUser.username} deleted successfully`);
        setDeleteOpen(false);
        router.refresh();
      } else {
        const err = await res.json().catch(() => ({}));
        toast.error(formatApiError(err, "Failed to delete user"));
      }
    } catch (err) {
      console.error(err);
      toast.error("Network error while deleting user");
    } finally {
      setDeleteSubmitting(false);
    }
  };

  const handleCreateUser = async (e: React.FormEvent) => {
    e.preventDefault();
    setCreateSubmitting(true);
    try {
      const res = await apiFetch("/api/auth/users/", {
        method: "POST",
        body: JSON.stringify(newUser),
      });

      if (res.ok) {
        const createdUser = await res.json();
        setUsers((prev) => [...prev, createdUser]);
        setNewUser({ username: "", email: "", password: "", role: "Member" });
        setCreateOpen(false);
        toast.success(`User ${createdUser.username} added successfully`);
        router.refresh();
      } else {
        const err = await res.json().catch(() => ({}));
        toast.error(formatApiError(err, "Failed to add user"));
      }
    } catch (err) {
      console.error(err);
      toast.error("Network error while adding user");
    } finally {
      setCreateSubmitting(false);
    }
  };

  return (
    <div className="flex flex-col gap-6 px-4 lg:px-6">
      {/* KPI Cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-4">
        <Card className="border-border/80 shadow-xs">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardDescription className="text-xs font-medium">
              Total Accounts
            </CardDescription>
            <UsersIcon className="size-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{users.length}</div>
            <p className="text-xs text-muted-foreground mt-1">
              Registered users across organization
            </p>
          </CardContent>
        </Card>

        <Card className="border-border/80 shadow-xs">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardDescription className="text-xs font-medium">
              Superusers (Admins)
            </CardDescription>
            <ShieldAlertIcon className="size-4 text-rose-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-rose-600 dark:text-rose-400">
              {counts.admins}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              Full administrative privileges
            </p>
          </CardContent>
        </Card>

        <Card className="border-border/80 shadow-xs">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardDescription className="text-xs font-medium">
              Staff Members
            </CardDescription>
            <ShieldCheckIcon className="size-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
              {counts.staff}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              Operational inventory management
            </p>
          </CardContent>
        </Card>

        <Card className="border-border/80 shadow-xs">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardDescription className="text-xs font-medium">
              Standard Members
            </CardDescription>
            <UserCheckIcon className="size-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{counts.members}</div>
            <p className="text-xs text-muted-foreground mt-1">
              View & standard access
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Main Table Card */}
      <Card className="border-border/80 shadow-xs">
        <CardHeader className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <CardTitle className="text-lg font-semibold flex items-center gap-2">
              <UserCogIcon className="size-5 text-primary" />
              User Account Directory
            </CardTitle>
            <CardDescription>
              Manage system permissions, promote users to staff/admin, or remove
              accounts.
            </CardDescription>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <Button onClick={() => setCreateOpen(true)} className="h-9">
              <PlusIcon className="size-4" />
              Add User
            </Button>
            <div className="relative w-full sm:w-64">
              <SearchIcon className="absolute left-2.5 top-2.5 size-4 text-muted-foreground" />
              <Input
                placeholder="Search username, email..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-9 h-9"
              />
            </div>

            <Select
              value={roleFilter}
              onValueChange={(val) => {
                if (val) setRoleFilter(val);
              }}
            >
              <SelectTrigger className="w-[140px] h-9">
                <SelectValue placeholder="All Roles" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ALL">All Roles</SelectItem>
                <SelectItem value="Admin">Admins</SelectItem>
                <SelectItem value="Staff">Staff</SelectItem>
                <SelectItem value="Member">Members</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardHeader>

        <CardContent>
          <div className="rounded-md border border-border/60 overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow className="bg-muted/40">
                  <TableHead>User</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Role</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Joined Date</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredUsers.length === 0 ? (
                  <TableRow>
                    <TableCell
                      colSpan={6}
                      className="h-32 text-center text-muted-foreground"
                    >
                      No user accounts found matching your filters.
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredUsers.map((u) => {
                    const isCurrent = u.id === currentUserId;
                    return (
                      <TableRow key={u.id}>
                        <TableCell className="font-medium">
                          <div className="flex flex-col">
                            <div className="flex items-center gap-1.5">
                              <span className="font-semibold text-foreground">
                                {u.name || u.username}
                              </span>
                              {isCurrent && (
                                <Badge
                                  variant="secondary"
                                  className="text-[10px] py-0 px-1 font-normal"
                                >
                                  You
                                </Badge>
                              )}
                            </div>
                            <span className="text-xs text-muted-foreground">
                              @{u.username}
                            </span>
                          </div>
                        </TableCell>
                        <TableCell className="text-sm text-muted-foreground">
                          {u.email || "—"}
                        </TableCell>
                        <TableCell>
                          {u.role === "Admin" ? (
                            <Badge className="bg-rose-500/15 text-rose-700 dark:text-rose-400 hover:bg-rose-500/20 border-rose-200 dark:border-rose-900">
                              <ShieldAlertIcon className="size-3 mr-1" />
                              Admin
                            </Badge>
                          ) : u.role === "Staff" ? (
                            <Badge className="bg-blue-500/15 text-blue-700 dark:text-blue-400 hover:bg-blue-500/20 border-blue-200 dark:border-blue-900">
                              <ShieldCheckIcon className="size-3 mr-1" />
                              Staff
                            </Badge>
                          ) : (
                            <Badge
                              variant="outline"
                              className="text-muted-foreground"
                            >
                              <UserCheckIcon className="size-3 mr-1" />
                              Member
                            </Badge>
                          )}
                        </TableCell>
                        <TableCell>
                          {u.is_active ? (
                            <div className="flex items-center gap-1.5 text-xs text-emerald-600 dark:text-emerald-400 font-medium">
                              <CheckCircle2Icon className="size-3.5" />
                              Active
                            </div>
                          ) : (
                            <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                              <XCircleIcon className="size-3.5" />
                              Inactive
                            </div>
                          )}
                        </TableCell>
                        <TableCell className="text-xs text-muted-foreground">
                          {new Intl.DateTimeFormat("en-US", {
                            timeZone: "UTC",
                            year: "numeric",
                            month: "short",
                            day: "numeric",
                          }).format(new Date(u.date_joined))}
                        </TableCell>
                        <TableCell className="text-right">
                          <DropdownMenu>
                            <DropdownMenuTrigger
                              render={
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  className="size-8"
                                />
                              }
                            >
                              <MoreVerticalIcon className="size-4" />
                              <span className="sr-only">Open menu</span>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end" className="w-44">
                              <DropdownMenuLabel className="text-xs text-muted-foreground">
                                Actions
                              </DropdownMenuLabel>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem
                                onClick={() => openEditDialog(u)}
                                className="cursor-pointer"
                              >
                                <PencilIcon className="size-3.5 mr-2" />
                                Change Role
                              </DropdownMenuItem>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem
                                onClick={() => openDeleteDialog(u)}
                                disabled={isCurrent}
                                className="cursor-pointer text-destructive focus:text-destructive focus:bg-destructive/10"
                              >
                                <Trash2Icon className="size-3.5 mr-2" />
                                Delete Account
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    );
                  })
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      <Dialog open={createOpen} onOpenChange={setCreateOpen}>
        <DialogContent className="sm:max-w-[420px]">
          <form onSubmit={handleCreateUser}>
            <DialogHeader>
              <DialogTitle>Add User</DialogTitle>
              <DialogDescription>
                Add an account to this company. Only administrators can do this.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="new-username">Username</Label>
                <Input
                  id="new-username"
                  value={newUser.username}
                  onChange={(e) =>
                    setNewUser({ ...newUser, username: e.target.value })
                  }
                  required
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="new-email">Email</Label>
                <Input
                  id="new-email"
                  type="email"
                  value={newUser.email}
                  onChange={(e) =>
                    setNewUser({ ...newUser, email: e.target.value })
                  }
                  required
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="new-password">Temporary password</Label>
                <Input
                  id="new-password"
                  type="password"
                  value={newUser.password}
                  onChange={(e) =>
                    setNewUser({ ...newUser, password: e.target.value })
                  }
                  minLength={8}
                  required
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="new-role">Role</Label>
                <Select
                  value={newUser.role}
                  onValueChange={(role) =>
                    role && setNewUser({ ...newUser, role })
                  }
                >
                  <SelectTrigger id="new-role">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Admin">Admin</SelectItem>
                    <SelectItem value="Staff">Staff</SelectItem>
                    <SelectItem value="Member">Member</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => setCreateOpen(false)}
                disabled={createSubmitting}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={createSubmitting}>
                {createSubmitting ? (
                  <Loader2Icon className="size-4 animate-spin" />
                ) : (
                  "Add User"
                )}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Edit Role Dialog */}
      <Dialog open={editOpen} onOpenChange={setEditOpen}>
        <DialogContent className="sm:max-w-[420px]">
          <form onSubmit={handleRoleUpdate}>
            <DialogHeader>
              <DialogTitle>Change User Role</DialogTitle>
              <DialogDescription>
                Modify permissions for{" "}
                <span className="font-medium text-foreground">
                  {editUser?.username}
                </span>
                .
              </DialogDescription>
            </DialogHeader>

            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="role">Permission Role</Label>
                <Select
                  value={selectedRole}
                  onValueChange={(val) => {
                    if (val) setSelectedRole(val);
                  }}
                >
                  <SelectTrigger id="role">
                    <SelectValue placeholder="Select role" />
                  </SelectTrigger>
                  <SelectContent
                    className="max-w-[calc(100vw-2rem)]"
                    style={{ width: "min(300px, calc(100vw - 2rem))" }}
                  >
                    <SelectItem value="Admin" className="py-2.5">
                      <div className="flex flex-col text-left whitespace-normal">
                        <span className="font-semibold text-rose-600 dark:text-rose-400">
                          Admin (Superuser)
                        </span>
                        <span className="text-xs text-muted-foreground">
                          Full system control
                        </span>
                      </div>
                    </SelectItem>
                    <SelectItem value="Staff" className="py-2.5">
                      <div className="flex flex-col text-left whitespace-normal">
                        <span className="font-semibold text-blue-600 dark:text-blue-400">
                          Staff
                        </span>
                        <span className="text-xs text-muted-foreground">
                          Manage inventory, movements, suppliers & categories
                        </span>
                      </div>
                    </SelectItem>
                    <SelectItem value="Member" className="py-2.5">
                      <div className="flex flex-col text-left whitespace-normal">
                        <span className="font-semibold text-foreground">
                          Member
                        </span>
                        <span className="text-xs text-muted-foreground">
                          Standard read/write inventory access
                        </span>
                      </div>
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => setEditOpen(false)}
                disabled={editSubmitting}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={editSubmitting}>
                {editSubmitting ? (
                  <>
                    <Loader2Icon className="size-4 animate-spin mr-1" />
                    Saving...
                  </>
                ) : (
                  "Save Changes"
                )}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Delete User Confirmation Dialog */}
      <Dialog open={deleteOpen} onOpenChange={setDeleteOpen}>
        <DialogContent className="sm:max-w-[400px]">
          <DialogHeader>
            <DialogTitle className="text-destructive">
              Delete User Account
            </DialogTitle>
            <DialogDescription>
              Are you sure you want to delete the account for{" "}
              <span className="font-semibold text-foreground">
                {deleteUser?.username}
              </span>
              ? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>

          <DialogFooter className="mt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => setDeleteOpen(false)}
              disabled={deleteSubmitting}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={handleDeleteUser}
              disabled={deleteSubmitting}
            >
              {deleteSubmitting ? (
                <>
                  <Loader2Icon className="size-4 animate-spin mr-1" />
                  Deleting...
                </>
              ) : (
                "Delete Account"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
