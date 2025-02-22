"use client"

import type React from "react"

import { useState, useEffect } from "react"
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

type EditPermitModalProps = {
  isOpen: boolean
  onClose: () => void
  permit: Permit
  onUpdatePermit: (permit: Permit) => void
}

export function EditPermitModal({ isOpen, onClose, permit, onUpdatePermit }: EditPermitModalProps) {
  const [editedPermit, setEditedPermit] = useState<Permit>(permit)

  useEffect(() => {
    setEditedPermit(permit)
  }, [permit])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onUpdatePermit(editedPermit)
    onClose()
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>تعديل الإذن</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="type">نوع الإذن</Label>
            <Select
              value={editedPermit.type}
              onValueChange={(value) => setEditedPermit({ ...editedPermit, type: value as "صرف" | "توريد" | "خدمة" })}
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
              value={editedPermit.customerName}
              onChange={(e) => setEditedPermit({ ...editedPermit, customerName: e.target.value })}
              required
            />
          </div>
          <div>
            <Label htmlFor="amount">المبلغ</Label>
            <Input
              id="amount"
              type="number"
              value={editedPermit.amount}
              onChange={(e) => setEditedPermit({ ...editedPermit, amount: Number(e.target.value) })}
              required
            />
          </div>
          <div>
            <Label htmlFor="date">التاريخ</Label>
            <Input
              id="date"
              type="date"
              value={editedPermit.date}
              onChange={(e) => setEditedPermit({ ...editedPermit, date: e.target.value })}
              required
            />
          </div>
          <div>
            <Label htmlFor="description">الوصف</Label>
            <Input
              id="description"
              value={editedPermit.description}
              onChange={(e) => setEditedPermit({ ...editedPermit, description: e.target.value })}
              required
            />
          </div>
          <Button type="submit">تحديث الإذن</Button>
        </form>
      </DialogContent>
    </Dialog>
  )
}

