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
import { EditPermitModal } from "./EditPermitModal";
import { Label } from "@/components/ui/label";
import { LoadingSpinner } from "@/components/LoadingSpinner";
import { ErrorDisplay } from "@/components/ErrorDisplay";
import { fetchPermitsList, handleDeletePermits } from "@/constant/Permits.info";
import { useQuery } from "@tanstack/react-query";
import { toast } from "@/hooks/use-toast";
import db from "@/lib/db";

type Permit = {
  id: number;
  transaction_type: "expense" | "service" | "supply";
  transaction_date: string;
  reference: string;
  related_entity_id: number;
  entity_id: number;
  entity_type: string;
  userId: number;
  amount: number;
  supplier_or_client_or_employee_name: string;
  description: string;
};

export function PermitsTable() {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [globalFilter, setGlobalFilter] = useState("");
  const [editingPermit, setEditingPermit] = useState<Permit | null>(null);
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");
  const [permits, setPermits] = useState<Permit[]>([]);
  const columns: ColumnDef<Permit>[] = [
    {
      accessorKey: "transaction_type",
      header: "نوع الإذن",
      cell: ({ row }) => {
        return (
          <div>
            {row.getValue("transaction_type") == "supply"
              ? "توريد"
              : row.getValue("transaction_type") == "expense"
              ? "مصروفات"
              : "خدمات"}
          </div>
        );
      },
    },
    {
      accessorKey: "supplier_or_client_or_employee_name",
      header: "اسم العميل / المورد / الموظف",
      cell: ({ row }) => {
        return (
          <div>
            {row.original.entity_type == "else"
              ? "مجهول"
              : row.getValue("supplier_or_client_or_employee_name")}
          </div>
        );
      },
    },
    {
      accessorKey: "amount",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            المبلغ
            <ArrowUpDown className="mr-2 h-4 w-4" />
          </Button>
        );
      },
      cell: ({ row }) => {
        const amount = Number.parseFloat(row.getValue("amount"));
        const formatted = new Intl.NumberFormat("ar-EG", {
          style: "currency",
          currency: "EGP",
        }).format(amount);
        return <div>{formatted}</div>;
      },
    },
    {
      accessorKey: "transaction_date",
      header: "التاريخ",
    },
    {
      accessorKey: "reference",
      header: "الوصف",
    },
    {
      id: "actions",
      cell: ({ row }) => {
        const permit = row.original;
        return (
          <DropdownMenu dir={"rtl"}>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0">
                <span className="sr-only">فتح القائمة</span>
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>الإجراءات</DropdownMenuLabel>
              <DropdownMenuItem onClick={() => setEditingPermit(permit)}>
                تعديل
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={() => handleDeletePermit(Number(permit.id))}
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
    { data: Permit[] },
    Error
  >({
    queryKey: ["fetchPermitsList"],
    queryFn: async () => await fetchPermitsList(),
    refetchInterval: 2000,
  });
  useEffect(() => {
    setPermits(data as unknown as Permit[]);
    console.log("data : ", data)
  }, [data]);
  const table = useReactTable({
    data: permits || data,
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

  const handleDeletePermit = (permitId: number) => {
    handleDeletePermits(permitId);
  };

  const handleUpdatePermit = async (updatedPermit: Permit) => {
    const {
      id,
      transaction_type,
      transaction_date,
      reference,
      related_entity_id,
      entity_id,
      entity_type,
      amount,
    } = updatedPermit;

    console.log(updatedPermit);

    const userId = localStorage.getItem("id");

    // Set created_at to the current timestamp. Adjust formatting if needed.

    try {
      await (
        await db
      )
        .execute(
          `UPDATE related_entities SET entity_type = ?, entity_id = ? WHERE id = ?;`,
          [entity_type, entity_id, related_entity_id]
        )
        .then(async () => {
          const query = `
      UPDATE financial_transactions SET transaction_type = ?, amount = ?, transaction_date = ?, reference = ?, related_entity_id = ?, entity_type = ?, userId = ? WHERE id = ?;
    `;

          const values = [
            transaction_type,
            amount,
            transaction_date,
            reference,
            related_entity_id,
            entity_type,
            userId,
            id,
          ];

          // Execute the update query
          (await db).execute(query, values);

          toast({
            variant: "default",
            title: "تم أضافه",
          });

          setEditingPermit(null);
        })
        .catch((error: any) => {
          console.log(error);
        });
    } catch (error) {
      console.error("Error inserting Category:", error);
      // Optionally, display an error to the user
    }
  };

  const filterPermits = () => {
    let filteredData = [...permits];

    if (dateFrom && dateTo) {
      filteredData = filteredData.filter((permit) => {
        const permitDate = new Date(permit.transaction_date);
        return (
          permitDate >= new Date(dateFrom) && permitDate <= new Date(dateTo)
        );
      });
    }

    setPermits(filteredData);
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
      <div className="flex items-center py-4 space-x-4">
        <div className="flex items-center space-x-2">
          <Label htmlFor="dateFrom">من:</Label>
          <Input
            id="dateFrom"
            type="date"
            value={dateFrom}
            onChange={(e) => setDateFrom(e.target.value)}
          />
        </div>
        <div className="flex items-center space-x-2">
          <Label htmlFor="dateTo">إلى:</Label>
          <Input
            id="dateTo"
            type="date"
            value={dateTo}
            onChange={(e) => setDateTo(e.target.value)}
          />
        </div>
        <Button onClick={filterPermits}>تطبيق الفلتر</Button>
        <Input
          placeholder="البحث في الأذونات..."
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
      {editingPermit && (
        <EditPermitModal
          isOpen={!!editingPermit}
          onClose={() => setEditingPermit(null)}
          permit={editingPermit}
          onUpdatePermit={handleUpdatePermit}
        />
      )}
    </div>
  );
}
