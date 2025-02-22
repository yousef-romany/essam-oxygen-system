"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

const transactions = [
  { id: 1, type: "استلام", entity: "المورد أ", quantity: 50, status: "مكتمل" },
  { id: 2, type: "بيع", entity: "العميل ب", quantity: 20, status: "معلق" },
  { id: 3, type: "إرسال", entity: "المورد ج", quantity: 30, status: "مكتمل" },
  { id: 4, type: "استلام", entity: "العميل د", quantity: 15, status: "معلق" },
  { id: 5, type: "بيع", entity: "العميل هـ", quantity: 25, status: "مكتمل" },
]

export function RecentTransactions() {
  const [filter, setFilter] = useState("all")

  const filteredTransactions = transactions.filter((transaction) => {
    if (filter === "supplier") return transaction.type === "استلام" || transaction.type === "إرسال"
    if (filter === "customer") return transaction.type === "بيع"
    return true
  })

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>المعاملات الأخيرة</CardTitle>
        <Select onValueChange={setFilter} defaultValue={filter}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="تصفية حسب" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">الكل</SelectItem>
            <SelectItem value="supplier">المورد</SelectItem>
            <SelectItem value="customer">العميل</SelectItem>
          </SelectContent>
        </Select>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="text-center">النوع</TableHead>
              <TableHead className="text-center">الكيان</TableHead>
              <TableHead className="text-center">الكمية</TableHead>
              <TableHead className="text-center">الحالة</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredTransactions.map((transaction) => (
              <TableRow key={transaction.id}>
                <TableCell className="text-center">{transaction.type}</TableCell>
                <TableCell className="text-center">{transaction.entity}</TableCell>
                <TableCell className="text-center">{transaction.quantity}</TableCell>
                <TableCell className="text-center">{transaction.status}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  )
}

