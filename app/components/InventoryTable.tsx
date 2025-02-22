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
import { InventoryModal } from "./InventoryModal"

interface InventoryItem {
  id: string
  fullCylinders: number
  emptyCylinders: number
}

const inventoryData: InventoryItem[] = [
  { id: "CYL001", fullCylinders: 100, emptyCylinders: 50 },
  { id: "CYL002", fullCylinders: 75, emptyCylinders: 25 },
  { id: "CYL003", fullCylinders: 120, emptyCylinders: 30 },
  { id: "CYL004", fullCylinders: 90, emptyCylinders: 60 },
  { id: "CYL005", fullCylinders: 150, emptyCylinders: 40 },
]

export function InventoryTable() {
  const [sorting, setSorting] = useState([])
  const [filtering, setFiltering] = useState("")
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [selectedItem, setSelectedItem] = useState<InventoryItem | null>(null)

  const columns: ColumnDef<InventoryItem>[] = [
    {
      accessorKey: "id",
      header: "رقم العنصر",
    },
    {
      accessorKey: "fullCylinders",
      header: "الأسطوانات الممتلئة",
    },
    {
      accessorKey: "emptyCylinders",
      header: "الأسطوانات الفارغة",
    },
    {
      id: "actions",
      cell: ({ row }) => (
        <Button variant="outline" size="sm" onClick={() => openModal(row.original)}>
          تحديث
        </Button>
      ),
    },
  ]

  const table = useReactTable({
    data: inventoryData,
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

  const openModal = (item?: InventoryItem) => {
    setSelectedItem(item || null)
    setIsModalOpen(true)
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
        <Button onClick={() => openModal()}>إضافة مخزون</Button>
      </div>
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
                <TableCell key={cell.id} className="text-center">{flexRender(cell.column.columnDef.cell, cell.getContext())}</TableCell>
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
  )
}

