"use client"

import type React from "react"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

type SafeMoneyTransaction = {
  id: string
  date: string
  type: "إيداع" | "سحب"
  amount: number
  description: string
  balance: number
}

type NewSafeMoneyModalProps = {
  isOpen: boolean
  onClose: () => void
}

export function NewSafeMoneyModal({ isOpen, onClose }: NewSafeMoneyModalProps) {
  const [newTransaction, setNewTransaction] = useState<Partial<SafeMoneyTransaction>>({
    date: new Date().toISOString().split("T")[0],
    type: "إيداع",
    amount: 0,
    description: "",
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Here you would typically send the data to your backend
    console.log("إضافة معاملة جديدة:", newTransaction)
    onClose()
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>إضافة معاملة جديدة</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="date">التاريخ</Label>
            <Input
              id="date"
              type="date"
              value={newTransaction.date}
              onChange={(e) => setNewTransaction({ ...newTransaction, date: e.target.value })}
              required
            />
          </div>
          <div>
            <Label htmlFor="type">النوع</Label>
            <Select
              value={newTransaction.type}
              onValueChange={(value) => setNewTransaction({ ...newTransaction, type: value as "إيداع" | "سحب" })}
            >
              <SelectTrigger>
                <SelectValue placeholder="اختر نوع المعاملة" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="إيداع">إيداع</SelectItem>
                <SelectItem value="سحب">سحب</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label htmlFor="amount">المبلغ</Label>
            <Input
              id="amount"
              type="number"
              value={newTransaction.amount}
              onChange={(e) => setNewTransaction({ ...newTransaction, amount: Number(e.target.value) })}
              required
            />
          </div>
          <div>
            <Label htmlFor="description">الوصف</Label>
            <Input
              id="description"
              value={newTransaction.description}
              onChange={(e) => setNewTransaction({ ...newTransaction, description: e.target.value })}
              required
            />
          </div>
          <Button type="submit">إضافة المعاملة</Button>
        </form>
      </DialogContent>
    </Dialog>
  )
}

