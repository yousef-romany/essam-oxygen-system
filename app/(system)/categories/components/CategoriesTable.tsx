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
import { EditCategoryModal } from "./EditCategoryModal";
import { useQuery } from "@tanstack/react-query";
import {
  fetchInventoryList,
  handleDeleteInventory,
} from "@/constant/Category.info";
import db from "@/lib/db";
import { LoadingSpinner } from "@/components/LoadingSpinner";
import { ErrorDisplay } from "@/components/ErrorDisplay";
import { toast } from "@/hooks/use-toast";

type Category = {
  id: number;
  name: string;
  full_quantity: number;
  empty_quantity: number;
  price: number;
};

export function CategoriesTable() {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [globalFilter, setGlobalFilter] = useState("");
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);

  const columns: ColumnDef<Category>[] = [
    {
      accessorKey: "name",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            اسم الفئة
            <ArrowUpDown className="mr-2 h-4 w-4" />
          </Button>
        );
      },
    },
    {
      accessorKey: "price",
      header: "سعر",
    },
    {
      accessorKey: "empty_quantity",
      header: "الرصيد  (فارغ)",
    },
    {
      accessorKey: "full_quantity",
      header: "الرصيد  (ممتلئ)",
    },
    {
      id: "actions",
      cell: ({ row }) => {
        const category = row.original;
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
              <DropdownMenuItem onClick={() => setEditingCategory(category)}>
                تعديل
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={() => handleDeleteCategory(category.id)}
              >
                حذف
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        );
      },
    },
  ];

  const { isLoading, isError, data, error } = useQuery<
    { data: Category[] },
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

  const handleDeleteCategory = async (categoryId: number) =>
    handleDeleteInventory(categoryId);

  const handleUpdateCategory = async (updatedCategory: Category) => {
    const { id, name, full_quantity, empty_quantity, price } = updatedCategory;

    const userId = localStorage.getItem("id");

    // Set created_at to the current timestamp. Adjust formatting if needed.
    const createdAt = new Date().toISOString();

    try {
      const query = `
      UPDATE inventory
      SET name = ?, empty_quantity = ?, full_quantity = ?, price = ?, userId = ?, created_at = ?
      WHERE id = ?;
    `;

      const values = [
        name,
        empty_quantity,
        full_quantity,
        price,
        userId,
        createdAt,
        id,
      ];

      // Execute the update query
      (await db).execute(query, values);

      setEditingCategory(null);
      toast({
        variant: "default",
        title: "تم تعديل",
      });
    } catch (error) {
      console.error("Error inserting Category:", error);
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
      <div className="flex items-center py-4">
        <Input
          placeholder="البحث في الفئات..."
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
      {editingCategory && (
        <EditCategoryModal
          isOpen={!!editingCategory}
          onClose={() => setEditingCategory(null)}
          category={editingCategory}
          onUpdateCategory={handleUpdateCategory}
        />
      )}
    </div>
  );
}
