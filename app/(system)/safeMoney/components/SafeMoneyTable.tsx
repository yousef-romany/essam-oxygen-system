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
import { EditSafeMoneyModal } from "./EditSafeMoneyModal"
import { Label } from "@/components/ui/label"

type SafeMoneyTransaction = {
  id: string
  date: string
  type: "إيداع" | "سحب"
  amount: number
  description: string
  balance: number
}

const data: SafeMoneyTransaction[] = [
  {
    id: "1",
    date: "2023-07-01",
    type: "إيداع",
    amount: 5000,
    description: "إيداع من المبيعات",
    balance: 5000,
  },
  {
    id: "2",
    date: "2023-07-02",
    type: "سحب",
    amount: 1000,
    description: "دفع رواتب",
    balance: 4000,
  },
  {
    id: "3",
    date: "2023-07-03",
    type: "إيداع",
    amount: 3000,
    description: "إيداع من العملاء",
    balance: 7000,
  },
]

export function SafeMoneyTable() {
  const [sorting, setSorting] = useState<SortingState>([])
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([])
  const [globalFilter, setGlobalFilter] = useState("")
  const [transactions, setTransactions] = useState<SafeMoneyTransaction[]>(data)
  const [editingTransaction, setEditingTransaction] = useState<SafeMoneyTransaction | null>(null)
  const [dateFrom, setDateFrom] = useState("")
  const [dateTo, setDateTo] = useState("")

  const columns: ColumnDef<SafeMoneyTransaction>[] = [
    {
      accessorKey: "date",
      header: "التاريخ",
    },
    {
      accessorKey: "type",
      header: "النوع",
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
      accessorKey: "description",
      header: "الوصف",
    },
    {
      accessorKey: "balance",
      header: ({ column }) => {
        return (
          <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
            الرصيد
            <ArrowUpDown className="mr-2 h-4 w-4" />
          </Button>
        )
      },
      cell: ({ row }) => {
        const balance = Number.parseFloat(row.getValue("balance"))
        const formatted = new Intl.NumberFormat("ar-EG", {
          style: "currency",
          currency: "EGP",
        }).format(balance)
        return <div>{formatted}</div>
      },
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
              <DropdownMenuItem onClick={() => setEditingTransaction(transaction)}>تعديل</DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => handleDeleteTransaction(transaction.id)}>حذف</DropdownMenuItem>
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

  const handleDeleteTransaction = (transactionId: string) => {
    setTransactions(transactions.filter((transaction) => transaction.id !== transactionId))
  }

  const handleUpdateTransaction = (updatedTransaction: SafeMoneyTransaction) => {
    setTransactions(
      transactions.map((transaction) => (transaction.id === updatedTransaction.id ? updatedTransaction : transaction)),
    )
    setEditingTransaction(null)
  }

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
      <div className="flex items-center py-4 space-x-4">
        <div className="flex items-center space-x-2">
          <Label htmlFor="dateFrom">من:</Label>
          <Input id="dateFrom" type="date" value={dateFrom} onChange={(e) => setDateFrom(e.target.value)} />
        </div>
        <div className="flex items-center space-x-2">
          <Label htmlFor="dateTo">إلى:</Label>
          <Input id="dateTo" type="date" value={dateTo} onChange={(e) => setDateTo(e.target.value)} />
        </div>
        <Button onClick={filterTransactions}>تطبيق الفلتر</Button>
        <Input
          placeholder="البحث في المعاملات..."
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
      {editingTransaction && (
        <EditSafeMoneyModal
          isOpen={!!editingTransaction}
          onClose={() => setEditingTransaction(null)}
          transaction={editingTransaction}
          onUpdateTransaction={handleUpdateTransaction}
        />
      )}
    </div>
  )
}

