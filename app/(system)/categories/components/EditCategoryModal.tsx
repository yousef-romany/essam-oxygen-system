"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"

type Category = {
  id: string
  name: string
  description: string
}

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
            <Label htmlFor="description">الوصف</Label>
            <Textarea
              id="description"
              value={editedCategory.description}
              onChange={(e) => setEditedCategory({ ...editedCategory, description: e.target.value })}
              required
            />
          </div>
          <Button type="submit">تحديث الفئة</Button>
        </form>
      </DialogContent>
    </Dialog>
  )
}

