"use client"

import { useState, useMemo } from "react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

type Transaction = {
  id: string
  customerId: string
  date: string
  type: "بيع" | "إرجاع"
  categoryId: string
  quantity: number
  unitPrice: number
  totalPrice: number
}

type Category = {
  id: string
  name: string
}

type Customer = {
  id: string
  name: string
}

// Sample data (replace with actual data from your backend)
const transactions: Transaction[] = [
  {
    id: "1",
    customerId: "1",
    date: "2023-07-01",
    type: "بيع",
    categoryId: "1",
    quantity: 5,
    unitPrice: 100,
    totalPrice: 500,
  },
  {
    id: "2",
    customerId: "1",
    date: "2023-07-05",
    type: "بيع",
    categoryId: "2",
    quantity: 3,
    unitPrice: 150,
    totalPrice: 450,
  },
  {
    id: "3",
    customerId: "1",
    date: "2023-07-10",
    type: "إرجاع",
    categoryId: "1",
    quantity: 1,
    unitPrice: 100,
    totalPrice: -100,
  },
  {
    id: "4",
    customerId: "2",
    date: "2023-07-02",
    type: "بيع",
    categoryId: "1",
    quantity: 10,
    unitPrice: 100,
    totalPrice: 1000,
  },
  {
    id: "5",
    customerId: "2",
    date: "2023-07-07",
    type: "بيع",
    categoryId: "3",
    quantity: 2,
    unitPrice: 200,
    totalPrice: 400,
  },
]

const categories: Category[] = [
  { id: "1", name: "أسطوانات الغاز" },
  { id: "2", name: "قطع غيار" },
  { id: "3", name: "خدمات" },
]

const customers: Customer[] = [
  { id: "1", name: "شركة أ" },
  { id: "2", name: "مؤسسة ب" },
]

export function CustomerReport() {
  const [selectedCustomer, setSelectedCustomer] = useState<string>("")
  const [dateFrom, setDateFrom] = useState<string>("")
  const [dateTo, setDateTo] = useState<string>("")

  const filteredTransactions = useMemo(() => {
    return transactions.filter((transaction) => {
      const matchesCustomer = selectedCustomer ? transaction.customerId === selectedCustomer : true
      const matchesDateRange = (!dateFrom || transaction.date >= dateFrom) && (!dateTo || transaction.date <= dateTo)
      return matchesCustomer && matchesDateRange
    })
  }, [selectedCustomer, dateFrom, dateTo])

  const totalOwed = useMemo(() => {
    return filteredTransactions.reduce((sum, transaction) => {
      return sum + (transaction.type === "بيع" ? transaction.totalPrice : -transaction.totalPrice)
    }, 0)
  }, [filteredTransactions])

  const transactionsByCategory = useMemo(() => {
    const categoryTotals: { [key: string]: number } = {}
    filteredTransactions.forEach((transaction) => {
      const categoryId = transaction.categoryId
      if (!categoryTotals[categoryId]) {
        categoryTotals[categoryId] = 0
      }
      categoryTotals[categoryId] += transaction.type === "بيع" ? transaction.quantity : -transaction.quantity
    })
    return categoryTotals
  }, [filteredTransactions])

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-4">
        <div className="flex-1">
          <Label htmlFor="customer">العميل</Label>
          <Select value={selectedCustomer} onValueChange={setSelectedCustomer}>
            <SelectTrigger id="customer">
              <SelectValue placeholder="اختر العميل" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">جميع العملاء</SelectItem>
              {customers.map((customer) => (
                <SelectItem key={customer.id} value={customer.id}>
                  {customer.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="flex-1">
          <Label htmlFor="dateFrom">من تاريخ</Label>
          <Input id="dateFrom" type="date" value={dateFrom} onChange={(e) => setDateFrom(e.target.value)} />
        </div>
        <div className="flex-1">
          <Label htmlFor="dateTo">إلى تاريخ</Label>
          <Input id="dateTo" type="date" value={dateTo} onChange={(e) => setDateTo(e.target.value)} />
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>ملخص الحساب</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-2xl font-bold">إجمالي المبلغ المستحق: {totalOwed.toLocaleString("ar-EG")} جنيه مصري</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>الكميات حسب الفئات</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="text-center">الفئة</TableHead>
                <TableHead className="text-center">الكمية</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {Object.entries(transactionsByCategory).map(([categoryId, quantity]) => (
                <TableRow key={categoryId}>
                  <TableCell className="text-center">{categories.find((c) => c.id === categoryId)?.name}</TableCell>
                  <TableCell className="text-center">{quantity}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>تفاصيل المعاملات</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="text-center">التاريخ</TableHead>
                <TableHead className="text-center">النوع</TableHead>
                <TableHead className="text-center">الفئة</TableHead>
                <TableHead className="text-center">الكمية</TableHead>
                <TableHead className="text-center">السعر الوحدة</TableHead>
                <TableHead className="text-center">الإجمالي</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredTransactions.map((transaction) => (
                <TableRow key={transaction.id}>
                  <TableCell className="text-center">{transaction.date}</TableCell>
                  <TableCell className="text-center">{transaction.type}</TableCell>
                  <TableCell className="text-center">{categories.find((c) => c.id === transaction.categoryId)?.name}</TableCell>
                  <TableCell className="text-center">{transaction.quantity}</TableCell>
                  <TableCell className="text-center">{transaction.unitPrice.toLocaleString("ar-EG")}</TableCell>
                  <TableCell className="text-center">{transaction.totalPrice.toLocaleString("ar-EG")}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}

