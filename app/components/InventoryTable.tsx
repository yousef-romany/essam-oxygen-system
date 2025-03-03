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
import { InventoryModal } from "./InventoryModal";
import { useQuery } from "@tanstack/react-query";
import { fetchInventoryList } from "@/constant/Category.info";
import { LoadingSpinner } from "@/components/LoadingSpinner";
import { ErrorDisplay } from "@/components/ErrorDisplay";

interface InventoryItem {
  id: number;
  name: string;
  full_quantity: number;
  empty_quantity: number;
}

export function InventoryTable() {
  const [sorting, setSorting] = useState([]);
  const [filtering, setFiltering] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<InventoryItem | null>(null);

  const columns: ColumnDef<InventoryItem>[] = [
    {
      accessorKey: "id",
      header: "رقم العنصر",
    },
    {
      accessorKey: "name",
      header: "أسم الصنف",
    },
    {
      accessorKey: "full_quantity",
      header: "الأسطوانات الممتلئة",
    },
    {
      accessorKey: "empty_quantity",
      header: "الأسطوانات الفارغة",
    },
    {
      id: "actions",
      cell: ({ row }) => (
        <Button
          variant="outline"
          size="sm"
          onClick={() => openModal(row.original)}
        >
          تحديث
        </Button>
      ),
    },
  ];

  const { isLoading, isError, data, error } = useQuery<
    { data: InventoryItem[] },
    Error
  >({
    queryKey: ["fetchInventoryList"],
    queryFn: fetchInventoryList,
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

  const openModal = (item?: InventoryItem) => {
    setSelectedItem(item || null);
    setIsModalOpen(true);
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
      <div className="flex justify-between">
        <Input
          placeholder="البحث في المخزون"
          value={filtering}
          onChange={(e) => setFiltering(e.target.value)}
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
                <TableCell key={cell.id} className="text-center">
                  {flexRender(cell.column.columnDef.cell, cell.getContext())}
                </TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <InventoryModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        initialData={selectedItem || undefined}
      />
    </div>
  );
}
