"use client";

import { memo, useState } from "react";
import {
  useReactTable,
  getCoreRowModel,
  getSortedRowModel,
  getFilteredRowModel,
  flexRender,
  type ColumnDef,
} from "@tanstack/react-table";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import {
  fetchListUsers,
  handleDeleteUser,
  userDataType,
} from "@/constant/User.info";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { DotsHorizontalIcon } from "@radix-ui/react-icons";
import RolesUserPreviewHover from "./RolesUserPreviewHover";
import { LoadingSpinner } from "@/components/LoadingSpinner";
import { ErrorDisplay } from "@/components/ErrorDisplay";
import { useQuery } from "@tanstack/react-query";
import UpdateUser from "./UpdateUser";

const UsersTable = () => {
  const [globalFilter, setGlobalFilter] = useState("");

  const columns: ColumnDef<userDataType>[] = [
    {
      accessorKey: "id",
      header: "رقم المستخدم",
    },
    {
      accessorKey: "userName",
      header: "اسم المستخدم",
    },
    {
      accessorKey: "password",
      header: "كلمه المرور",
    },
    {
      accessorKey: "role",
      header: "صلحيات",
      cell: ({ row }) => (
        <div className="font-medium text-center">
          <RolesUserPreviewHover
            data={row.getValue("role")}
            date={row.original.date}
          />
        </div>
      ),
    },
    {
      id: "actions",
      cell: ({ row }) => {
        const data = row.original;
        return (
          <DropdownMenu dir="rtl">
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0">
                <span className="sr-only">Open menu</span>
                <DotsHorizontalIcon className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start">
              <DropdownMenuLabel>أحداث</DropdownMenuLabel>

              <UpdateUser
                id={data.id}
                userName={data.userName}
                password={data.password}
                role={data.role}
                date={data.date}
              />

              <DropdownMenuSeparator />
              <Button
                onClick={() => handleDeleteUser(data.id)}
                className="w-full"
                variant={"destructive"}
              >
                حذف
              </Button>
            </DropdownMenuContent>
          </DropdownMenu>
        );
      },
    },
  ];

  const { isLoading, isError, data, error } = useQuery<
    { data: userDataType[] },
    Error
  >({
    queryKey: ["fetchUsersList"],
    queryFn: fetchListUsers,
    refetchInterval: 1500,
  });
  
  const table = useReactTable({
    data: data as [] | any,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    state: {
      globalFilter,
    },
    onGlobalFilterChange: setGlobalFilter,
  });

  if (isLoading) {
    return <LoadingSpinner />;
  }
  if (isError) {
    return <ErrorDisplay message={error.message} />;
  }
  if (error) {
    return <ErrorDisplay message={"Error"} />;
  }
  return (
    <div className="space-y-4">
      <div className="flex justify-between">
        <Input
          placeholder="البحث في المعاملات"
          value={globalFilter}
          onChange={(e) => setGlobalFilter(e.target.value)}
          className="max-w-sm"
        />
      </div>
      <Table>
        <TableHeader>
          {table.getHeaderGroups().map((headerGroup) => (
            <TableRow key={headerGroup.id}>
              {headerGroup.headers.map((header) => (
                <TableHead
                  className="text-center"
                  key={header.id}
                  onClick={header.column.getToggleSortingHandler()}
                >
                  {flexRender(
                    header.column.columnDef.header,
                    header.getContext()
                  )}
                  {{
                    asc: " 🔼",
                    desc: " 🔽",
                  }[header.column.getIsSorted() as string] ?? null}
                </TableHead>
              ))}
            </TableRow>
          ))}
        </TableHeader>
        <TableBody>
          {table.getRowModel().rows.map((row) => (
            <TableRow key={row.id}>
              {row.getVisibleCells().map((cell) => (
                <TableCell className="text-center" key={cell.id}>
                  {flexRender(cell.column.columnDef.cell, cell.getContext())}
                </TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default memo(UsersTable);
