"use client"

import { useState } from "react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  type ColumnDef,
  flexRender,
  getCoreRowModel,
  useReactTable,
  getSortedRowModel,
  type SortingState,
  type ColumnFiltersState,
  getFilteredRowModel,
} from "@tanstack/react-table"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { ArrowUpDown, MoreHorizontal } from "lucide-react"
import { EditPermitModal } from "./EditPermitModal"
import { Label } from "@/components/ui/label"

type Permit = {
  id: string
  type: "صرف" | "توريد" | "خدمة"
  customerName: string
  amount: number
  date: string
  description: string
}

const data: Permit[] = [
  {
    id: "1",
    type: "صرف",
    customerName: "شركة أ",
    amount: 1000,
    date: "2023-07-01",
    description: "صرف بضاعة",
  },
  {
    id: "2",
    type: "توريد",
    customerName: "مؤسسة ب",
    amount: 1500,
    date: "2023-07-02",
    description: "توريد مواد خام",
  },
  {
    id: "3",
    type: "خدمة",
    customerName: "شركة ج",
    amount: 500,
    date: "2023-07-03",
    description: "خدمة صيانة",
  },
]

export function PermitsTable() {
  const [sorting, setSorting] = useState<SortingState>([])
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([])
  const [globalFilter, setGlobalFilter] = useState("")
  const [permits, setPermits] = useState<Permit[]>(data)
  const [editingPermit, setEditingPermit] = useState<Permit | null>(null)
  const [dateFrom, setDateFrom] = useState("")
  const [dateTo, setDateTo] = useState("")

  const columns: ColumnDef<Permit>[] = [
    {
      accessorKey: "type",
      header: "نوع الإذن",
    },
    {
      accessorKey: "customerName",
      header: "اسم العميل",
    },
    {
      accessorKey: "amount",
      header: ({ column }) => {
        return (
          <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
            المبلغ
            <ArrowUpDown className="mr-2 h-4 w-4" />
          </Button>
        )
      },
      cell: ({ row }) => {
        const amount = Number.parseFloat(row.getValue("amount"))
        const formatted = new Intl.NumberFormat("ar-EG", {
          style: "currency",
          currency: "EGP",
        }).format(amount)
        return <div>{formatted}</div>
      },
    },
    {
      accessorKey: "date",
      header: "التاريخ",
    },
    {
      accessorKey: "description",
      header: "الوصف",
    },
    {
      id: "actions",
      cell: ({ row }) => {
        const permit = row.original
        return (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0">
                <span className="sr-only">فتح القائمة</span>
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>الإجراءات</DropdownMenuLabel>
              <DropdownMenuItem onClick={() => setEditingPermit(permit)}>تعديل</DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => handleDeletePermit(permit.id)}>حذف</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        )
      },
    },
  ]

  const table = useReactTable({
    data: permits,
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
  })

  const handleDeletePermit = (permitId: string) => {
    setPermits(permits.filter((permit) => permit.id !== permitId))
  }

  const handleUpdatePermit = (updatedPermit: Permit) => {
    setPermits(permits.map((permit) => (permit.id === updatedPermit.id ? updatedPermit : permit)))
    setEditingPermit(null)
  }

  const filterPermits = () => {
    let filteredData = [...data]

    if (dateFrom && dateTo) {
      filteredData = filteredData.filter((permit) => {
        const permitDate = new Date(permit.date)
        return permitDate >= new Date(dateFrom) && permitDate <= new Date(dateTo)
      })
    }

    setPermits(filteredData)
  }

  return (
    <div>
      <div className="flex items-center py-4 space-x-4">
        <div className="flex items-center space-x-2">
          <Label htmlFor="dateFrom">من:</Label>
          <Input id="dateFrom" type="date" value={dateFrom} onChange={(e) => setDateFrom(e.target.value)} />
        </div>
        <div className="flex items-center space-x-2">
          <Label htmlFor="dateTo">إلى:</Label>
          <Input id="dateTo" type="date" value={dateTo} onChange={(e) => setDateTo(e.target.value)} />
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
                      {header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}
                    </TableHead>
                  )
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow key={row.id} data-state={row.getIsSelected() && "selected"}>
                  {row.getVisibleCells().map((cell) => (
                    <TableCell className="text-center" key={cell.id}>{flexRender(cell.column.columnDef.cell, cell.getContext())}</TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={columns.length} className="h-24 text-center">
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
  )
}

