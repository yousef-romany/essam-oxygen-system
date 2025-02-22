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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"

type Transaction = {
  id: string
  type: "استلام من المورد" | "إرجاع للمورد" | "بيع للعميل" | "إرجاع من العميل"
  name: string
  cylinderType: string
  quantity: number
  worker: string
  amountPaid: number
  paymentStatus: "مدفوع" | "قيد الانتظار"
  dueDate: string | null
  status: "قيد الانتظار" | "مكتمل"
  date: string
}

const data: Transaction[] = [
  {
    id: "TRX001",
    type: "استلام من المورد",
    name: "شركة الغاز المحدودة",
    cylinderType: "النوع أ",
    quantity: 50,
    worker: "أحمد محمد",
    amountPaid: 5000,
    paymentStatus: "مدفوع",
    dueDate: null,
    status: "مكتمل",
    date: "2023-07-01",
  },
  {
    id: "TRX002",
    type: "بيع للعميل",
    name: "شركة أ ب ج للصناعات",
    cylinderType: "النوع ب",
    quantity: 20,
    worker: "فاطمة علي",
    amountPaid: 0,
    paymentStatus: "قيد الانتظار",
    dueDate: "2023-07-15",
    status: "قيد الانتظار",
    date: "2023-07-02",
  },
  {
    id: "TRX003",
    type: "إرجاع للمورد",
    name: "شركة الغاز المحدودة",
    cylinderType: "النوع أ",
    quantity: 10,
    worker: "محمود حسن",
    amountPaid: 1000,
    paymentStatus: "مدفوع",
    dueDate: null,
    status: "مكتمل",
    date: "2023-07-03",
  },
]

export function TransactionsTable() {
  const [sorting, setSorting] = useState<SortingState>([])
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([])
  const [globalFilter, setGlobalFilter] = useState("")
  const [dateFrom, setDateFrom] = useState("")
  const [dateTo, setDateTo] = useState("")
  const [transactions, setTransactions] = useState<Transaction[]>(data)

  const columns: ColumnDef<Transaction>[] = [
    {
      accessorKey: "id",
      header: "رقم المعاملة",
    },
    {
      accessorKey: "type",
      header: "نوع المعاملة",
    },
    {
      accessorKey: "name",
      header: "اسم المورد/العميل",
    },
    {
      accessorKey: "cylinderType",
      header: "نوع الأسطوانة",
    },
    {
      accessorKey: "quantity",
      header: ({ column }) => {
        return (
          <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
            الكمية
            <ArrowUpDown className="mr-2 h-4 w-4" />
          </Button>
        )
      },
    },
    {
      accessorKey: "worker",
      header: "العامل المسؤول",
    },
    {
      accessorKey: "amountPaid",
      header: ({ column }) => {
        return (
          <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
            المبلغ المدفوع
            <ArrowUpDown className="mr-2 h-4 w-4" />
          </Button>
        )
      },
      cell: ({ row }) => {
        const amount = Number.parseFloat(row.getValue("amountPaid"))
        const formatted = new Intl.NumberFormat("ar-EG", {
          style: "currency",
          currency: "EGP",
        }).format(amount)
        return <div>{formatted}</div>
      },
    },
    {
      accessorKey: "paymentStatus",
      header: "حالة الدفع",
    },
    {
      accessorKey: "dueDate",
      header: "تاريخ الاستحقاق",
    },
    {
      accessorKey: "status",
      header: "الحالة",
    },
    {
      accessorKey: "date",
      header: "تاريخ المعاملة",
    },
    {
      id: "actions",
      cell: ({ row }) => {
        const transaction = row.original
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
              <DropdownMenuItem onClick={() => console.log("تعديل", transaction)}>تعديل</DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => console.log("حذف", transaction)}>حذف</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        )
      },
    },
  ]

  const table = useReactTable({
    data: transactions,
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

  const filterTransactions = () => {
    let filteredData = [...data]

    if (dateFrom && dateTo) {
      filteredData = filteredData.filter((transaction) => {
        const transactionDate = new Date(transaction.date)
        return transactionDate >= new Date(dateFrom) && transactionDate <= new Date(dateTo)
      })
    }

    setTransactions(filteredData)
  }

  return (
    <div>
      <div className="flex items-center py-4">
        <div className="flex items-center space-x-2 ml-4">
          <Label htmlFor="dateFrom">من:</Label>
          <Input id="dateFrom" type="date" value={dateFrom} onChange={(e) => setDateFrom(e.target.value)} />
        </div>
        <div className="flex items-center space-x-2 ml-4">
          <Label htmlFor="dateTo">إلى:</Label>
          <Input id="dateTo" type="date" value={dateTo} onChange={(e) => setDateTo(e.target.value)} />
        </div>
        <Button onClick={filterTransactions} className="ml-4">
          تطبيق الفلتر
        </Button>
        <Input
          placeholder="البحث في المعاملات..."
          value={globalFilter}
          onChange={(event) => setGlobalFilter(event.target.value)}
          className="max-w-sm ml-4"
        />
        <Select
          onValueChange={(value) => table.getColumn("type")?.setFilterValue(value)}
          value={(table.getColumn("type")?.getFilterValue() as string) ?? ""}
        >
          <SelectTrigger className="ml-4 w-[180px]">
            <SelectValue placeholder="تصفية حسب النوع" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">الكل</SelectItem>
            <SelectItem value="استلام من المورد">استلام من المورد</SelectItem>
            <SelectItem value="إرجاع للمورد">إرجاع للمورد</SelectItem>
            <SelectItem value="بيع للعميل">بيع للعميل</SelectItem>
            <SelectItem value="إرجاع من العميل">إرجاع من العميل</SelectItem>
          </SelectContent>
        </Select>
        <Select
          onValueChange={(value) => table.getColumn("paymentStatus")?.setFilterValue(value)}
          value={(table.getColumn("paymentStatus")?.getFilterValue() as string) ?? ""}
        >
          <SelectTrigger className="ml-4 w-[180px]">
            <SelectValue placeholder="تصفية حسب حالة الدفع" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">الكل</SelectItem>
            <SelectItem value="مدفوع">مدفوع</SelectItem>
            <SelectItem value="قيد الانتظار">قيد الانتظار</SelectItem>
          </SelectContent>
        </Select>
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
    </div>
  )
}

