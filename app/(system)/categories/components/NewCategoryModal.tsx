"use client"

import type React from "react"

import { useState } from "react"
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

type NewCategoryModalProps = {
  isOpen: boolean
  onClose: () => void
}

export function NewCategoryModal({ isOpen, onClose }: NewCategoryModalProps) {
  const [newCategory, setNewCategory] = useState<Partial<Category>>({
    name: "",
    description: "",
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Here you would typically send the data to your backend
    console.log("إضافة فئة جديدة:", newCategory)
    onClose()
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>إضافة فئة جديدة</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="name">اسم الفئة</Label>
            <Input
              id="name"
              value={newCategory.name}
              onChange={(e) => setNewCategory({ ...newCategory, name: e.target.value })}
              required
            />
          </div>
          <div>
            <Label htmlFor="description">الوصف</Label>
            <Textarea
              id="description"
              value={newCategory.description}
              onChange={(e) => setNewCategory({ ...newCategory, description: e.target.value })}
              required
            />
          </div>
          <Button type="submit">إضافة الفئة</Button>
        </form>
      </DialogContent>
    </Dialog>
  )
}

