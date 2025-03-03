"use client";

import { useState } from "react";
import {
  useReactTable,
  getCoreRowModel,
  getSortedRowModel,
  getFilteredRowModel,
  flexRender,
  type ColumnDef,
  ColumnFiltersState,
  SortingState,
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
import { Button } from "@/components/ui/button";
import { LoadingSpinner } from "@/components/LoadingSpinner";
import { useQuery } from "@tanstack/react-query";
import {
  fetchCustomersList,
  handleDeleteCustomers,
} from "@/constant/Customer.info";
import { ErrorDisplay } from "@/components/ErrorDisplay";
import db from "@/lib/db";
import { EditCustomerModal } from "../(system)/customers/components/EditCustomerModal";

interface Customer {
  id: string;
  name: string;
  phoneNumber: string;
  // totalBought: number;
  // pendingReturns: number;
}

export function CustomersTable() {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [globalFilter, setGlobalFilter] = useState("");
  const [editingCustomer, setEditingCustomer] = useState<Customer | null>(null);

  const columns: ColumnDef<Customer>[] = [
    {
      accessorKey: "id",
      header: "رقم العميل",
    },
    {
      accessorKey: "name",
      header: "اسم العميل",
    },
    {
      accessorKey: "totalBought",
      header: "إجمالي المشتريات",
    },
    {
      accessorKey: "pendingReturns",
      header: "المرتجعات المعلقة",
    },
    {
      id: "actions",
      cell: ({ row }) => {
        const customer = row.original;
        return (
          <div>
            <Button
              variant="outline"
              size="sm"
              className="ml-2"
              onClick={() => setEditingCustomer(customer)}
            >
              تعديل
            </Button>
            <Button variant="outline" size="sm" className="ml-2">
              تسجيل إرجاع
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleDeleteCustomer(Number(customer.id))}
            >
              حذف
            </Button>
          </div>
        );
      },
    },
  ];

  const { isLoading, isError, data, error } = useQuery<
    { data: Customer[] },
    Error
  >({
    queryKey: ["fetchCustomersList"],
    queryFn: fetchCustomersList,
    refetchInterval: 1000,
  });

  const table = useReactTable({
    data: data,
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

  const handleDeleteCustomer = async (customerId: number) =>
    handleDeleteCustomers(customerId);

  const handleUpdateCustomer = async (updatedCustomer: Customer) => {
    const { id, name, phoneNumber } = updatedCustomer;

    const userId = localStorage.getItem("id");

    // Set created_at to the current timestamp. Adjust formatting if needed.
    const createdAt = new Date().toISOString();

    try {
      const query = `
      UPDATE customers
      SET name = ?, phoneNumber = ?, userId = ?, created_at = ?
      WHERE id = ?;
    `;

      const values = [name, phoneNumber, userId, createdAt, id];

      // Execute the update query
      (await db).execute(query, values);

      setEditingCustomer(null);
    } catch (error) {
      console.error("Error inserting Customer:", error);
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
    return <ErrorDisplay message={"Error"} />;
  }
  return (
    <div>
      <div className="space-y-4">
        <Input
          placeholder="البحث عن العميل"
          value={globalFilter}
          onChange={(e) => setGlobalFilter(e.target.value)}
          className="max-w-sm"
        />
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

      {editingCustomer && (
        <EditCustomerModal
          isOpen={!!editingCustomer}
          onClose={() => setEditingCustomer(null)}
          Customer={editingCustomer as Customer}
          onUpdateCustomer={handleUpdateCustomer}
        />
      )}
    </div>
  );
}
