"use client"

import type React from "react"

import { useState, useEffect } from "react"
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

type EditSafeMoneyModalProps = {
  isOpen: boolean
  onClose: () => void
  transaction: SafeMoneyTransaction
  onUpdateTransaction: (transaction: SafeMoneyTransaction) => void
}

export function EditSafeMoneyModal({ isOpen, onClose, transaction, onUpdateTransaction }: EditSafeMoneyModalProps) {
  const [editedTransaction, setEditedTransaction] = useState<SafeMoneyTransaction>(transaction)

  useEffect(() => {
    setEditedTransaction(transaction)
  }, [transaction])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onUpdateTransaction(editedTransaction)
    onClose()
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>تعديل المعاملة</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="date">التاريخ</Label>
            <Input
              id="date"
              type="date"
              value={editedTransaction.date}
              onChange={(e) => setEditedTransaction({ ...editedTransaction, date: e.target.value })}
              required
            />
          </div>
          <div>
            <Label htmlFor="type">النوع</Label>
            <Select
              value={editedTransaction.type}
              onValueChange={(value) => setEditedTransaction({ ...editedTransaction, type: value as "إيداع" | "سحب" })}
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
              value={editedTransaction.amount}
              onChange={(e) => setEditedTransaction({ ...editedTransaction, amount: Number(e.target.value) })}
              required
            />
          </div>
          <div>
            <Label htmlFor="description">الوصف</Label>
            <Input
              id="description"
              value={editedTransaction.description}
              onChange={(e) => setEditedTransaction({ ...editedTransaction, description: e.target.value })}
              required
            />
          </div>
          <Button type="submit">تحديث المعاملة</Button>
        </form>
      </DialogContent>
    </Dialog>
  )
}

