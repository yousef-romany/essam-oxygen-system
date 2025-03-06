/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useEffect, useState } from "react";
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
import { Label } from "@/components/ui/label";
import {
  fetchTransactionsList,
  handleDeleteTransaction,
} from "@/constant/Transaction.info";
import { useQuery } from "@tanstack/react-query";
import { LoadingSpinner } from "@/components/LoadingSpinner";
import { ErrorDisplay } from "@/components/ErrorDisplay";
import { formatDateForInput } from "@/lib/formatDateForInput";
import HoverTableCard from "./HoverTableCard";
import UpdateTransAction from "./UpdateTransAction";

export function TransactionsTable() {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [globalFilter, setGlobalFilter] = useState("");
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");

  const columns: ColumnDef<any>[] = [
    {
      accessorKey: "id",
      header: "رقم المعاملة",
    },
    {
      accessorKey: "transaction_type",
      header: "نوع المعاملة",
    },
    {
      accessorKey: "name",
      header: "اسم المورد/العميل",
      cell: ({ row }: any) => {
        return (
          <div>
            {row?.original.customer_name
              ? row?.original["transaction_type"] == "بيع"
                ? `عميل : ${row?.original.customer_name}`
                : `مورد : ${row?.original.supplier_name}`
              : "مجهول"}
          </div>
        );
      },
    },
    {
      accessorKey: "quantity",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            الكمية
            <ArrowUpDown className="mr-2 h-4 w-4" />
          </Button>
        );
      },
      cell: ({ row }) => {
        return <div>{row.original?.items?.length}</div>;
      },
    },
    {
      accessorKey: "employee",
      header: "العامل المسؤول",
      cell: ({ row }: any) => {
        return <div>{row.original?.employee?.name}</div>;
      },
    },
    {
      accessorKey: "total_amount",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            المبلغ المدفوع
            <ArrowUpDown className="mr-2 h-4 w-4" />
          </Button>
        );
      },
      cell: ({ row }) => {
        const amount = Number.parseFloat(row.getValue("total_amount"));
        const formatted = new Intl.NumberFormat("ar-EG", {
          style: "currency",
          currency: "EGP",
        }).format(amount);
        return <div>{formatted}</div>;
      },
    },
    {
      accessorKey: "payment_status",
      header: "حالة الدفع",
    },
    {
      accessorKey: "items",
      header: "تفاصيل",
      cell: ({ row }: any) => {
        return <HoverTableCard row={row} />;
      },
    },
    {
      accessorKey: "created_at",
      header: "تاريخ المعاملة",
      cell: ({ row }) => {
        return <h1>{formatDateForInput(row.getValue("created_at"))}</h1>;
      },
    },
    {
      id: "actions",
      cell: ({ row }) => {
        const transaction = row.original;
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
              <UpdateTransAction transaction={transaction} />
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={() => handleDeleteTransaction(Number(transaction.id))}
              >
                حذف
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        );
      },
    },
  ];

  const { isLoading, isError, data, error } = useQuery<any[]>({
    queryKey: ["fetchTransactionsList"],
    queryFn: async () => await fetchTransactionsList(),
    refetchInterval: 1500,
  });

  const [transactions, setTransactions] = useState<any[]>([]);

  // ✅ Ensure `data` exists before setting transactions
  useEffect(() => {
    if (data) {
      setTransactions(data);
    }
  }, [data]);

  console.log(data);

  const table = useReactTable({
    data: transactions, // ✅ `transactions` instead of `transactions || []`
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

  const filterTransactions = () => {
    if (!transactions.length) return;

    let filteredData = [...transactions]; // ✅ Use `transactions` instead of `data`

    if (dateFrom && dateTo) {
      filteredData = filteredData.filter((transaction) => {
        const transactionDateStr = transaction["created_at"]?.split(" ")[0]; // ✅ إزالة الوقت

        if (!transactionDateStr) return false;

        const transactionDate = new Date(transactionDateStr); // ✅ تحويل إلى Date
        const fromDate = new Date(dateFrom);
        const toDate = new Date(dateTo);

        return transactionDate >= fromDate && transactionDate <= toDate;
      });
    }

    setTransactions(filteredData);
  };

  // ✅ Handle loading and error states properly
  if (isLoading) {
    return <LoadingSpinner />;
  }

  if (isError) {
    return <ErrorDisplay message={error?.message || "Error occurred"} />;
  }

  return (
    <div>
      <div className="flex items-center py-4">
        <div className="flex items-center space-x-2 ml-4">
          <Label htmlFor="dateFrom">من:</Label>
          <Input
            id="dateFrom"
            type="date"
            value={dateFrom}
            onChange={(e) => setDateFrom(e.target.value)}
          />
        </div>
        <div className="flex items-center space-x-2 ml-4">
          <Label htmlFor="dateTo">إلى:</Label>
          <Input
            id="dateTo"
            type="date"
            value={dateTo}
            onChange={(e) => setDateTo(e.target.value)}
          />
        </div>
        <Button onClick={filterTransactions} className="ml-4">
          تطبيق الفلتر
        </Button>
        <Input
          placeholder="البحث في المعاملات..."
          value={globalFilter}
          onChange={(event) => setGlobalFilter(event.target.value)}
          className="max-w-sm ml-4"
        />
      </div>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead className="text-center" key={header.id}>
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
                    <TableCell className="text-center" key={cell.id}>
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
