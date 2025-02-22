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
import { BankAccountModal } from "./BankAccountModal"
import { EditBankAccountModal } from "./EditBankAccountModal"

type BankAccount = {
  id: string
  accountNumber: string
  bankName: string
  balance: number
  transactions: Transaction[]
}

type Transaction = {
  id: string
  documentNumber: string
  amount: number
  date: string
  description: string
}

const data: BankAccount[] = [
  {
    id: "1",
    accountNumber: "1234567890",
    bankName: "بنك مصر",
    balance: 50000,
    transactions: [
      { id: "1", documentNumber: "DOC001", amount: 1000, date: "2023-07-01", description: "إيداع" },
      { id: "2", documentNumber: "DOC002", amount: -500, date: "2023-07-02", description: "سحب" },
    ],
  },
  {
    id: "2",
    accountNumber: "0987654321",
    bankName: "البنك الأهلي المصري",
    balance: 75000,
    transactions: [
      { id: "3", documentNumber: "DOC003", amount: 2000, date: "2023-07-03", description: "إيداع" },
      { id: "4", documentNumber: "DOC004", amount: -1000, date: "2023-07-04", description: "سحب" },
    ],
  },
]

export function BankAccountsTable() {
  const [sorting, setSorting] = useState<SortingState>([])
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([])
  const [globalFilter, setGlobalFilter] = useState("")
  const [selectedAccount, setSelectedAccount] = useState<BankAccount | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isEditAccountModalOpen, setIsEditAccountModalOpen] = useState(false)
  const [bankAccounts, setBankAccounts] = useState<BankAccount[]>(data)

  const columns: ColumnDef<BankAccount>[] = [
    {
      accessorKey: "accountNumber",
      header: "رقم الحساب",
    },
    {
      accessorKey: "bankName",
      header: "اسم البنك",
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
        const amount = Number.parseFloat(row.getValue("balance"))
        const formatted = new Intl.NumberFormat("ar-EG", {
          style: "currency",
          currency: "EGP",
        }).format(amount)
        return <div>{formatted}</div>
      },
    },
    {
      id: "actions",
      cell: ({ row }) => {
        const account = row.original
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
              <DropdownMenuItem onClick={() => handleViewTransactions(account)}>عرض المعاملات</DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => handleEditAccount(account)}>تعديل</DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleDeleteAccount(account.id)}>حذف</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        )
      },
    },
  ]

  const table = useReactTable({
    data: bankAccounts,
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

  const handleViewTransactions = (account: BankAccount) => {
    setSelectedAccount(account)
    setIsModalOpen(true)
  }

  const handleEditAccount = (account: BankAccount) => {
    setSelectedAccount(account)
    setIsEditAccountModalOpen(true)
  }

  const handleDeleteAccount = (accountId: string) => {
    setBankAccounts(bankAccounts.filter((account) => account.id !== accountId))
  }

  // const handleAddAccount = (newAccount: BankAccount) => {
  //   setBankAccounts([...bankAccounts, newAccount])
  // }

  const handleUpdateAccount = (updatedAccount: BankAccount) => {
    setBankAccounts(bankAccounts.map((account) => (account.id === updatedAccount.id ? updatedAccount : account)))
  }

  return (
    <div>
      <div className="flex items-center justify-between py-4">
        <Input
          placeholder="البحث في الحسابات البنكية..."
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
                    <TableCell key={cell.id} className="text-center">{flexRender(cell.column.columnDef.cell, cell.getContext())}</TableCell>
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
      {selectedAccount && (
        <BankAccountModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          account={selectedAccount}
          onUpdateAccount={handleUpdateAccount}
        />
      )}
      
      {selectedAccount && (
        <EditBankAccountModal
          isOpen={isEditAccountModalOpen}
          onClose={() => setIsEditAccountModalOpen(false)}
          account={selectedAccount}
          onUpdateAccount={handleUpdateAccount}
        />
      )}
    </div>
  )
}

