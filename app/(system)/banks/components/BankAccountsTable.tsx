/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  type ColumnDef,
  flexRender,
  getCoreRowModel,
  useReactTable,
  getSortedRowModel,
  type SortingState,
  type ColumnFiltersState,
  getFilteredRowModel,
} from "@tanstack/react-table";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ArrowUpDown, MoreHorizontal } from "lucide-react";
import { BankAccountModal } from "./BankAccountModal";
import { EditBankAccountModal } from "./EditBankAccountModal";
import { useQuery } from "@tanstack/react-query";
import { LoadingSpinner } from "@/components/LoadingSpinner";
import { ErrorDisplay } from "@/components/ErrorDisplay";
import { fetchBanksList, handleDeleteBanks } from "@/constant/Banks.info";
import db from "@/lib/db";

type BankAccount = {
  id: number;
  accountNumber: string;
  bankName: string;
  balance: number;
  transactions: Transaction[];
  finalBalance: any
};

type Transaction = {
  id: string;
  documentNumber: string;
  amount: number;
  date: string;
  description: string;
};

export function BankAccountsTable() {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [globalFilter, setGlobalFilter] = useState("");
  const [selectedAccount, setSelectedAccount] = useState<BankAccount | null>(
    null
  );
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditAccountModalOpen, setIsEditAccountModalOpen] = useState(false);

  const columns: ColumnDef<BankAccount>[] = [
    {
      accessorKey: "accountNumber",
      header: "رقم الحساب",
    },
    {
      accessorKey: "bankName",
      header: "اسم البنك",
    },
    {
      accessorKey: "finalBalance",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            الرصيد
            <ArrowUpDown className="mr-2 h-4 w-4" />
          </Button>
        );
      },
      cell: ({ row }) => {
        const amount = Number.parseFloat(row.getValue("finalBalance"));
        const formatted = new Intl.NumberFormat("ar-EG", {
          style: "currency",
          currency: "EGP",
        }).format(amount);
        return (
          <div>
            {formatted}
          </div>
        );
      },
    },
    {
      id: "actions",
      cell: ({ row }) => {
        const account = row.original;
        return (
          <DropdownMenu dir="rtl">
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0">
                <span className="sr-only">فتح القائمة</span>
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>الإجراءات</DropdownMenuLabel>
              <DropdownMenuItem onClick={() => handleViewTransactions(account)}>
                عرض المعاملات
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => handleEditAccount(account)}>
                تعديل
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleDeleteAccount(account.id)}>
                حذف
              </DropdownMenuItem>
            </DropdownMenuContent>
            {selectedAccount && (
              <BankAccountModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                account={selectedAccount as any}
                refetch={() => refetch()}
                setIsModalOpen={setIsModalOpen}
              />
            )}

            {selectedAccount && (
              <EditBankAccountModal
                isOpen={isEditAccountModalOpen}
                onClose={() => setIsEditAccountModalOpen(false)}
                account={selectedAccount}
                onUpdateAccount={handleUpdateAccount}
              />
            )}
          </DropdownMenu>
        );
      },
    },
  ];

  const { isLoading, isError, data, error, refetch } = useQuery<
    { data: BankAccount[] },
    Error
  >({
    queryKey: ["fetchBanksList"],
    queryFn: async () => await fetchBanksList(),
    refetchInterval: 2000,
  });

  const table = useReactTable({
    data: data?.data as [] | any,
    columns,
    getCoreRowModel: getCoreRowModel(),
    onSortingChange: setSorting,
    getSortedRowModel: getSortedRowModel(),
    onColumnFiltersChange: setColumnFilters,
    getFilteredRowModel: getFilteredRowModel(),
    state: {
      sorting,
      columnFilters,
      globalFilter,
    },
    onGlobalFilterChange: setGlobalFilter,
  });

  const handleViewTransactions = (account: BankAccount) => {
    setSelectedAccount(account);
    setIsModalOpen(true);
  };

  const handleEditAccount = (account: BankAccount) => {
    setSelectedAccount(account);
    setIsEditAccountModalOpen(true);
  };

  const handleDeleteAccount = async (accountId: number) =>
    handleDeleteBanks(accountId);

  const handleUpdateAccount = async (updatedAccount: BankAccount) => {
    const { id, accountNumber, bankName, balance } = updatedAccount;

    const userId = localStorage.getItem("id");

    // Set created_at to the current timestamp. Adjust formatting if needed.

    try {
      const query = `
      UPDATE banks
      SET bank_name = ?, account_number = ?, balance = ?, userId = ?
      WHERE id = ?;
    `;

      const values = [bankName, accountNumber, balance, userId, id];

      // Execute the update query
      (await db).execute(query, values);

      setIsModalOpen(false);
      setIsEditAccountModalOpen(false);
    } catch (error) {
      console.error("Error inserting employee:", error);
      // Optionally, display an error to the user
    }
  };

  if (isLoading) {
    return <LoadingSpinner />;
  }
  if (isError) {
    return <ErrorDisplay message={error.message} />;
  }
  if (error) {
    console.log(error);
    return <ErrorDisplay message={"Error"} />;
  }

  return (
    <div>
      <div className="flex items-center justify-between py-4">
        <Input
          placeholder="البحث في الحسابات البنكية..."
          value={globalFilter}
          onChange={(event) => setGlobalFilter(event.target.value)}
          className="max-w-sm"
        />
      </div>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead key={header.id} className="text-center">
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                    </TableHead>
                  );
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id} className="text-center">
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  لا توجد نتائج.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
