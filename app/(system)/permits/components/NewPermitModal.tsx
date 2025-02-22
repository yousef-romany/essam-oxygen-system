"use client"

import type React from "react"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

type Permit = {
  id: string
  type: "صرف" | "توريد" | "خدمة"
  customerName: string
  amount: number
  date: string
  description: string
}

type NewPermitModalProps = {
  isOpen: boolean
  onClose: () => void
}

export function NewPermitModal({ isOpen, onClose }: NewPermitModalProps) {
  const [newPermit, setNewPermit] = useState<Partial<Permit>>({
    type: "صرف",
    customerName: "",
    amount: 0,
    date: "",
    description: "",
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Here you would typically send the data to your backend
    console.log("إضافة إذن جديد:", newPermit)
    onClose()
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>إضافة إذن جديد</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="type">نوع الإذن</Label>
            <Select
              value={newPermit.type}
              onValueChange={(value) => setNewPermit({ ...newPermit, type: value as "صرف" | "توريد" | "خدمة" })}
            >
              <SelectTrigger>
                <SelectValue placeholder="اختر نوع الإذن" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="صرف">صرف</SelectItem>
                <SelectItem value="توريد">توريد</SelectItem>
                <SelectItem value="خدمة">خدمة</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label htmlFor="customerName">اسم العميل</Label>
            <Input
              id="customerName"
              value={newPermit.customerName}
              onChange={(e) => setNewPermit({ ...newPermit, customerName: e.target.value })}
              required
            />
          </div>
          <div>
            <Label htmlFor="amount">المبلغ</Label>
            <Input
              id="amount"
              type="number"
              value={newPermit.amount}
              onChange={(e) => setNewPermit({ ...newPermit, amount: Number(e.target.value) })}
              required
            />
          </div>
          <div>
            <Label htmlFor="date">التاريخ</Label>
            <Input
              id="date"
              type="date"
              value={newPermit.date}
              onChange={(e) => setNewPermit({ ...newPermit, date: e.target.value })}
              required
            />
          </div>
          <div>
            <Label htmlFor="description">الوصف</Label>
            <Input
              id="description"
              value={newPermit.description}
              onChange={(e) => setNewPermit({ ...newPermit, description: e.target.value })}
              required
            />
          </div>
          <Button type="submit">إضافة الإذن</Button>
        </form>
      </DialogContent>
    </Dialog>
  )
}

