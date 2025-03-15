"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Pagination, PaginationContent, PaginationEllipsis, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from "@/components/ui/pagination";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { UserWithoutPassword } from "@/server/actions/admin/users/get-all-users";
import { updateUserRole } from "@/server/actions/admin/users/update-user-role";
import { formatDistanceToNow } from "date-fns";
import { ArrowDown, ArrowUp, ArrowUpDown, Loader2, MoreHorizontalIcon, ShieldIcon, User } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";

interface UsersTableProps {
  users: UserWithoutPassword[];
  total: number;
  currentPage: number;
  currentSearch: string;
  currentSortBy: string;
  currentSortOrder: string;
}

export function UsersTable({ users, total, currentPage, currentSearch, currentSortBy, currentSortOrder }: UsersTableProps) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState<string | null>(null);

  // Calculate pagination
  const limit = 10;
  const totalPages = Math.ceil(total / limit);

  // Handle sort change
  const handleSort = (column: string) => {
    const params = new URLSearchParams();

    // Keep current search if any
    if (currentSearch) {
      params.set("search", column);
    }

    // Set sort parameters
    params.set("sortBy", column);

    // Toggle sort order if clicking the same column
    if (currentSortBy === column) {
      params.set("sortOrder", currentSortOrder === "asc" ? "desc" : "asc");
    } else {
      params.set("sortrder", "asc");
    }

    // Reset to page 1 when sorting
    params.set("page", "1");

    // Navigate with updated params
    router.push(`/admin/users?${params.toString()}`);
  };

  // Generate pagination links
  const getPaginationItems = () => {
    const items = [];
    const basePath = window.location.pathname;

    // always show first page
    items.push(
      <PaginationItem key={"first"}>
        <PaginationLink href={`${basePath}?page=1${currentSearch ? `&search=${currentSearch}` : ""}${currentSortBy ? `&sortBy=${currentSortBy}&sortOrder=${currentSortOrder}` : ""}`} isActive={currentPage === 1}>
          1
        </PaginationLink>
      </PaginationItem>
    );

    if (currentPage > 3) {
      items.push(
        <PaginationItem key={"ellipsis-1"}>
          <PaginationEllipsis />
        </PaginationItem>
      );
    }

    for (let i = Math.max(2, currentPage - 1); i <= Math.min(totalPages - 1, currentPage + 1); i++) {
      if (i === 1 || i === totalPages) continue;

      items.push(
        <PaginationItem key={i}>
          <PaginationLink href={`${basePath}?page=${i}${currentSearch ? `&search=${currentSearch}` : ""}${currentSortBy ? `&sortBy=${currentSortBy}&sortOrder=${currentSortOrder}` : ""}`} isActive={currentPage === i}>
            {i}
          </PaginationLink>
        </PaginationItem>
      );
    }

    if (currentPage < totalPages - 2) {
      items.push(
        <PaginationItem key={"ellipsis-2"}>
          <PaginationEllipsis />
        </PaginationItem>
      );
    }

    if (totalPages > 1) {
      items.push(
        <PaginationItem key={"last"}>
          <PaginationLink href={`${basePath}?page=${totalPages ? `&sortBy=${currentSortBy}&sortOrder=${currentSortOrder}` : ""}`}></PaginationLink>
        </PaginationItem>
      );
    }

    return items;
  };

  const getShortIcon = (column: string) => {
    if (currentSortBy !== column) {
      return <ArrowUpDown className="ml-2 size-4" />;
    }

    return currentSortOrder === "asc" ? <ArrowUp className="ml-2 size-4" /> : <ArrowDown className="ml-2 size-4" />;
  };

  const getUserInitials = (name: string | null) => {
    if (!name) return "U";

    const parts = name.split(" ");
    if (parts.length === 1) return parts[0].charAt(0).toUpperCase();

    return parts[0].charAt(0).toUpperCase() + parts[parts.length - 1].charAt(0).toUpperCase();
  };

  const handleRoleToggle = async (name: string, userId: string, currentRole: string) => {
    try {
      setIsLoading(userId);

      const newRole = currentRole === "admin" ? "user" : "admin";
      const response = await updateUserRole(userId, newRole);

      if (response.success) {
        toast.success(`User role updated successfully`, {
          description: `User ${name} role has been updated to ${newRole}`,
        });

        router.refresh();
      } else {
        toast.error("Failed to update user role", {
          description: response.error || "An error occured",
        });
      }
    } catch (error) {
      console.error("Error updating user role:", error);
      toast.error("Failed to update user role", {
        description: "An error occured",
      });
    } finally {
      setIsLoading(null);
    }
  };

  return (
    <div className="space-y-4">
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[250px]">
                <button onClick={() => handleSort("name")} className="flex items-center font-medium">
                  User
                  {getShortIcon("name")}
                </button>
              </TableHead>

              <TableHead>
                <button onClick={() => handleSort("email")} className="flex items-center font-medium">
                  Email
                  {getShortIcon("email")}
                </button>
              </TableHead>

              <TableHead className="w-[120px]">
                <button onClick={() => handleSort("role")} className="flex items-center font-medium">
                  Role
                  {getShortIcon("role")}
                </button>
              </TableHead>

              <TableHead className="w-[150px]">
                <button onClick={() => handleSort("createdAt")} className="flex items-center font-medium">
                  Joined
                  {getShortIcon("createdAt")}
                </button>
              </TableHead>

              <TableHead className="w-[80px]">Actions</TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {users.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="h-24 text-center">
                  {currentSearch ? "No users found with the given search criteria" : "No users found"}
                </TableCell>
              </TableRow>
            ) : (
              users.map((user) => (
                <TableRow key={user.id}>
                  <TableCell className="font-medium">
                    <div className="flex items-center gap-3">
                      <Avatar>
                        <AvatarImage src={user.image || undefined} alt={user.name || "User"} />
                        <AvatarFallback>{getUserInitials(user.name)}</AvatarFallback>
                      </Avatar>

                      <div>
                        <div className="font-medium">{user.name || "Unknown User"}</div>
                        <div className="text-xs text-muted-foreground">ID: {user.id.substring(0, 8)}...</div>
                      </div>
                    </div>
                  </TableCell>

                  <TableCell>{user.email}</TableCell>

                  <TableCell>
                    <Badge variant={user.role === "admin" ? "destructive" : "secondary"} className="flex w-fit items-center gap-1">
                      {user.role === "admin" ? <ShieldIcon /> : <User />}
                      {user.role}
                    </Badge>
                  </TableCell>

                  <TableCell>
                    {formatDistanceToNow(new Date(user.createdAt), {
                      addSuffix: true,
                    })}
                  </TableCell>

                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant={"ghost"} size={"icon"} disabled={isLoading === user.id}>
                          {isLoading === user.id ? <Loader2 className="size-4 animate-spin" /> : <MoreHorizontalIcon />}
                        </Button>
                      </DropdownMenuTrigger>

                      <DropdownMenuContent align="end">
                        <DropdownMenuLabel>Actions</DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem className={user.role === "admin" ? "text-destructive" : "text-blue-600"} onClick={() => handleRoleToggle(user.name!, user.id, user.role)} disabled={isLoading === user.id}>
                          {user.role === "admin" ? "Demote" : "Promote"} to {user.role === "admin" ? "User" : "Admin"}
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {totalPages > 1 && (
        <Pagination>
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious href={`/admin/users?page=${Math.max(1, currentPage - 1)}${currentSearch ? `&search=${currentSearch}` : ""}${currentSortBy ? `&sortBy=${currentSortBy}&sortOrder=${currentSortOrder}` : ""}`} />
            </PaginationItem>

            {getPaginationItems()}

            <PaginationItem>
              <PaginationNext href={`/admin/users?page=${Math.min(totalPages, currentPage + 1)}${currentSearch ? `&search=${currentSearch}` : ""}${currentSortBy ? `&sortBy=${currentSortBy}&sortOrder=${currentSortOrder}` : ""}`} />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      )}

      <div className="text-xs text-muted-foreground">
        Showing {users.length} of {total} users.
        {currentSearch && ` matching "${currentSearch}"`}
      </div>
    </div>
  );
}
