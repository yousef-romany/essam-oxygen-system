"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

type Category = {
  id: number;
  name: string;
  full_quantity: number;
  empty_quantity: number;
};

type EditCategoryModalProps = {
  isOpen: boolean
  onClose: () => void
  category: Category
  onUpdateCategory: (category: Category) => void
}

export function EditCategoryModal({ isOpen, onClose, category, onUpdateCategory }: EditCategoryModalProps) {
  const [editedCategory, setEditedCategory] = useState<Category>(category)

  useEffect(() => {
    setEditedCategory(category)
  }, [category])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onUpdateCategory(editedCategory)
    onClose()
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>تعديل الفئة</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="name">اسم الفئة</Label>
            <Input
              id="name"
              value={editedCategory.name}
              onChange={(e) => setEditedCategory({ ...editedCategory, name: e.target.value })}
              required
            />
          </div>
          <div>
            <Label htmlFor="empty_quantity">الرصيد (فارغ)</Label>
            <Input
              id="empty_quantity"
              type="number"
              value={editedCategory.empty_quantity}
              onChange={(e) => setEditedCategory({ ...editedCategory, empty_quantity: Number(e.target.value) })}
              required
            />
          </div>
          <div>
            <Label htmlFor="full_quantity">الرصيد (ممتلئ)</Label>
            <Input
              id="full_quantity"
              type="number"
              value={editedCategory.full_quantity}
              onChange={(e) => setEditedCategory({ ...editedCategory, full_quantity: Number(e.target.value) })}
              required
            />
          </div>
          <Button type="submit">تحديث الفئة</Button>
        </form>
      </DialogContent>
    </Dialog>
  )
}

