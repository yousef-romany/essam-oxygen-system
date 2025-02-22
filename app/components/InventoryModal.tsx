"use client"

import { useState } from "react"
import { Modal } from "./Modal"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"

interface InventoryModalProps {
  isOpen: boolean
  onClose: () => void
  initialData?: { id: string; fullCylinders: number; emptyCylinders: number }
}

export function InventoryModal({ isOpen, onClose, initialData }: InventoryModalProps) {
  const [formData, setFormData] = useState(initialData || { id: "", fullCylinders: 0, emptyCylinders: 0 })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Here you would typically send the data to your backend
    console.log("إرسال بيانات المخزون:", formData)
    onClose()
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={initialData ? "تعديل المخزون" : "إضافة مخزون"}>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="id" className="block text-sm font-medium text-gray-700">
            رقم العنصر
          </label>
          <Input
            id="id"
            value={formData.id}
            onChange={(e) => setFormData({ ...formData, id: e.target.value })}
            required
          />
        </div>
        <div>
          <label htmlFor="fullCylinders" className="block text-sm font-medium text-gray-700">
            الأسطوانات الممتلئة
          </label>
          <Input
            id="fullCylinders"
            type="number"
            value={formData.fullCylinders}
            onChange={(e) => setFormData({ ...formData, fullCylinders: Number.parseInt(e.target.value) })}
            required
          />
        </div>
        <div>
          <label htmlFor="emptyCylinders" className="block text-sm font-medium text-gray-700">
            الأسطوانات الفارغة
          </label>
          <Input
            id="emptyCylinders"
            type="number"
            value={formData.emptyCylinders}
            onChange={(e) => setFormData({ ...formData, emptyCylinders: Number.parseInt(e.target.value) })}
            required
          />
        </div>
        <Button type="submit">حفظ</Button>
      </form>
    </Modal>
  )
}

