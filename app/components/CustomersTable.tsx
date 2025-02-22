"use client"

import { useState } from "react"
import {
  useReactTable,
  getCoreRowModel,
  getSortedRowModel,
  getFilteredRowModel,
  flexRender,
  type ColumnDef,
} from "@tanstack/react-table"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"

interface Customer {
  id: string
  name: string
  totalBought: number
  pendingReturns: number
}

const customersData: Customer[] = [
  { id: "CUS001", name: "شركة أ ب ج للصناعات", totalBought: 100, pendingReturns: 20 },
  { id: "CUS002", name: "مؤسسة س ع ص", totalBought: 150, pendingReturns: 30 },
  { id: "CUS003", name: "شركة ١٢٣ للمشاريع", totalBought: 80, pendingReturns: 15 },
  { id: "CUS004", name: "أفضل مستخدمي الغاز", totalBought: 200, pendingReturns: 40 },
  { id: "CUS005", name: "شركة الوقود الممتاز", totalBought: 120, pendingReturns: 25 },
]

export function CustomersTable() {
  const [sorting, setSorting] = useState([])
  const [filtering, setFiltering] = useState("")

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
      cell: () => (
        <div>
          <Button variant="outline" size="sm" className="ml-2">
            تعديل
          </Button>
          <Button variant="outline" size="sm" className="ml-2">
            تسجيل إرجاع
          </Button>
          <Button variant="outline" size="sm">
            حذف
          </Button>
        </div>
      ),
    },
  ]

  const table = useReactTable({
    data: customersData,
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
  })

  return (
    <div className="space-y-4">
      <Input
        placeholder="البحث عن العميل"
        value={filtering}
        onChange={(e) => setFiltering(e.target.value)}
        className="max-w-sm"
      />
      <Table>
        <TableHeader>
          {table.getHeaderGroups().map((headerGroup) => (
            <TableRow key={headerGroup.id}>
              {headerGroup.headers.map((header) => (
                <TableHead className="text-center" key={header.id} onClick={header.column.getToggleSortingHandler()}>
                  {flexRender(header.column.columnDef.header, header.getContext())}
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
                <TableCell className="text-center" key={cell.id}>{flexRender(cell.column.columnDef.cell, cell.getContext())}</TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}

