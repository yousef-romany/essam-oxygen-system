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

interface Supplier {
  id: string
  name: string
  sentEmpty: number
  receivedFull: number
  pending: number
}

const suppliersData: Supplier[] = [
  { id: "SUP001", name: "شركة الغاز المحدودة", sentEmpty: 200, receivedFull: 180, pending: 20 },
  { id: "SUP002", name: "إمدادات الأسطوانات", sentEmpty: 150, receivedFull: 140, pending: 10 },
  { id: "SUP003", name: "حلول تقنية الغاز", sentEmpty: 300, receivedFull: 290, pending: 10 },
  { id: "SUP004", name: "شركة أنظمة الوقود", sentEmpty: 250, receivedFull: 230, pending: 20 },
  { id: "SUP005", name: "موردو الغاز الصديق للبيئة", sentEmpty: 180, receivedFull: 170, pending: 10 },
]

export function SuppliersTable() {
  const [sorting, setSorting] = useState([])
  const [filtering, setFiltering] = useState("")

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
      cell: () => (
        <div>
          <Button variant="outline" size="sm" className="mr-2">
            تعديل
          </Button>
          <Button variant="outline" size="sm">
            حذف
          </Button>
        </div>
      ),
    },
  ]

  const table = useReactTable({
    data: suppliersData,
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

