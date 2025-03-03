"use client";

import { useState } from "react";
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
import { Button } from "@/components/ui/button";
import { useQuery } from "@tanstack/react-query";
import { LoadingSpinner } from "@/components/LoadingSpinner";
import {
  fetchSuppliersList,
  handleDeleteSuppliers,
} from "@/constant/Suppliers.info";
import { ErrorDisplay } from "@/components/ErrorDisplay";
import { EditSupplierModal } from "../(system)/suppliers/components/EditSupplierModal";
import db from "@/lib/db";

interface Supplier {
  id: number;
  name: string;
  phoneNumber: string;
  sentEmpty: number;
  receivedFull: number;
  pending: number;
}

export function SuppliersTable() {
  const [sorting, setSorting] = useState([]);
  const [filtering, setFiltering] = useState("");
  const [editingSupplier, setEditingSupplier] = useState<Supplier | null>(null);
  const columns: ColumnDef<Supplier>[] = [
    {
      accessorKey: "id",
      header: "رقم المورد",
    },
    {
      accessorKey: "name",
      header: "اسم المورد",
    },
    {
      accessorKey: "phoneNumber",
      header: "رقم هاتف",
    },
    {
      accessorKey: "sentEmpty",
      header: "الأسطوانات الفارغة المرسلة",
    },
    {
      accessorKey: "receivedFull",
      header: "الأسطوانات الممتلئة المستلمة",
    },
    {
      accessorKey: "pending",
      header: "المعلق",
    },
    {
      id: "actions",
      cell: ({ row }) => {
        const supplier = row.original;
        return (
          <div>
            <Button
              variant="outline"
              size="sm"
              className="mr-2"
              onClick={() => setEditingSupplier(supplier)}
            >
              تعديل
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleDeleteSupplier(Number(supplier?.id))}
            >
              حذف
            </Button>
          </div>
        );
      },
    },
  ];

  const { isLoading, isError, data, error } = useQuery<
    { data: Supplier[] },
    Error
  >({
    queryKey: ["fetchSuppliersList"],
    queryFn: fetchSuppliersList,
    refetchInterval: 1000,
  });
  const table = useReactTable({
    data: data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    state: {
      sorting,
      globalFilter: filtering,
    },
    onSortingChange: setSorting,
    onGlobalFilterChange: setFiltering,
  });

  const handleDeleteSupplier = (supplierId: number) =>
    handleDeleteSuppliers(supplierId);
  const handleUpdateSupplier = async (updatedSupplier: Supplier) => {
    const { id, name, phoneNumber } = updatedSupplier;

    const userId = localStorage.getItem("id");

    // Set created_at to the current timestamp. Adjust formatting if needed.
    const createdAt = new Date().toISOString();

    try {
      const query = `
      UPDATE suppliers
      SET name = ?, phoneNumber = ?, userId = ?, created_at = ?
      WHERE id = ?;
    `;

      const values = [name, phoneNumber, userId, createdAt, id];

      // Execute the update query
      (await db).execute(query, values);

      setEditingSupplier(null);
    } catch (error) {
      console.error("Error inserting Supplier:", error);
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
    <div className="space-y-4">
      <Input
        placeholder="البحث عن المورد"
        value={filtering}
        onChange={(e) => setFiltering(e.target.value)}
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
      {editingSupplier && (
        <EditSupplierModal
          isOpen={!!editingSupplier}
          onClose={() => setEditingSupplier(null)}
          supplier={editingSupplier as Supplier}
          onUpdateSupplier={handleUpdateSupplier}
        />
      )}
    </div>
  );
}
