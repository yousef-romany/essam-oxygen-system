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
import { EditEmployeeModal } from "./EditEmployeeModal";
import { useQuery } from "@tanstack/react-query";
import {
  fetchEmployeesList,
  handleDeleteEmployees,
} from "@/constant/Employee.info";
import { LoadingSpinner } from "@/components/LoadingSpinner";
import { ErrorDisplay } from "@/components/ErrorDisplay";
import db from "@/lib/db";

type Employee = {
  id: string;
  name: string;
  positionEm: string;
  departmentEm: string;
  phoneNumber: string;
  hireDate: string;
};

export function EmployeesTable() {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [globalFilter, setGlobalFilter] = useState("");
  const [editingEmployee, setEditingEmployee] = useState<Employee | null>(null);

  const columns: ColumnDef<Employee>[] = [
    {
      accessorKey: "name",
      header: "الاسم",
    },
    {
      accessorKey: "positionEm",
      header: "الوظيفة",
    },
    {
      accessorKey: "departmentEm",
      header: "القسم",
    },
    {
      accessorKey: "phoneNumber",
      header: "رقم الهاتف",
    },
    {
      accessorKey: "hireDate",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            تاريخ التعيين
            <ArrowUpDown className="mr-2 h-4 w-4" />
          </Button>
        );
      },
    },
    {
      accessorKey: "final_balance",
      header: "الرصيد النهائي للموظف ",
    },
    {
      id: "actions",
      cell: ({ row }) => {
        const employee = row.original;
        return (
          <DropdownMenu dir="rtl">
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0">
                <span className="sr-only">فتح القائمة</span>
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="center">
              <DropdownMenuLabel>الإجراءات</DropdownMenuLabel>
              <DropdownMenuItem onClick={() => setEditingEmployee(employee)}>
                تعديل
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={() => handleDeleteEmployee(Number(employee.id))}
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
    { data: Employee[] },
    Error
  >({
    queryKey: ["fetchEmployeesList"],
    queryFn: fetchEmployeesList,
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

  const handleDeleteEmployee = async (employeeId: number) =>
    handleDeleteEmployees(employeeId);

  const handleUpdateEmployee = async (updatedEmployee: Employee) => {
    const { id, name, positionEm, departmentEm, phoneNumber, hireDate } =
      updatedEmployee;

    const userId = localStorage.getItem("id");

    // Set created_at to the current timestamp. Adjust formatting if needed.
    const createdAt = new Date().toISOString();

    try {
      const query = `
      UPDATE employees
      SET name = ?, positionEm = ?, departmentEm = ?, phoneNumber = ?, hireDate = ?, userId = ?, created_at = ?
      WHERE id = ?;
    `;

      const values = [
        name,
        positionEm,
        departmentEm,
        phoneNumber,
        hireDate,
        userId,
        createdAt,
        id,
      ];

      // Execute the update query
      (await db).execute(query, values);

      setEditingEmployee(null);
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
    return <ErrorDisplay message={"Error"} />;
  }
  return (
    <div>
      <div className="flex items-center py-4">
        <Input
          placeholder="البحث في الموظفين..."
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
      {editingEmployee && (
        <EditEmployeeModal
          isOpen={!!editingEmployee}
          onClose={() => setEditingEmployee(null)}
          employee={editingEmployee as Employee}
          onUpdateEmployee={handleUpdateEmployee}
        />
      )}
    </div>
  );
}
