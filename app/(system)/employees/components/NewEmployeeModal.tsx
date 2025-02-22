"use client"

import type React from "react"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

type Employee = {
  id: string
  name: string
  position: string
  department: string
  phoneNumber: string
  email: string
  hireDate: string
}

type NewEmployeeModalProps = {
  isOpen: boolean
  onClose: () => void
}

export function NewEmployeeModal({ isOpen, onClose }: NewEmployeeModalProps) {
  const [newEmployee, setNewEmployee] = useState<Partial<Employee>>({
    name: "",
    position: "",
    department: "",
    phoneNumber: "",
    email: "",
    hireDate: "",
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Here you would typically send the data to your backend
    console.log("إضافة موظف جديد:", newEmployee)
    onClose()
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>إضافة موظف جديد</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="name">الاسم</Label>
            <Input
              id="name"
              value={newEmployee.name}
              onChange={(e) => setNewEmployee({ ...newEmployee, name: e.target.value })}
              required
            />
          </div>
          <div>
            <Label htmlFor="position">الوظيفة</Label>
            <Input
              id="position"
              value={newEmployee.position}
              onChange={(e) => setNewEmployee({ ...newEmployee, position: e.target.value })}
              required
            />
          </div>
          <div>
            <Label htmlFor="department">القسم</Label>
            <Input
              id="department"
              value={newEmployee.department}
              onChange={(e) => setNewEmployee({ ...newEmployee, department: e.target.value })}
              required
            />
          </div>
          <div>
            <Label htmlFor="phoneNumber">رقم الهاتف</Label>
            <Input
              id="phoneNumber"
              value={newEmployee.phoneNumber}
              onChange={(e) => setNewEmployee({ ...newEmployee, phoneNumber: e.target.value })}
              required
            />
          </div>
          <div>
            <Label htmlFor="email">البريد الإلكتروني</Label>
            <Input
              id="email"
              type="email"
              value={newEmployee.email}
              onChange={(e) => setNewEmployee({ ...newEmployee, email: e.target.value })}
              required
            />
          </div>
          <div>
            <Label htmlFor="hireDate">تاريخ التعيين</Label>
            <Input
              id="hireDate"
              type="date"
              value={newEmployee.hireDate}
              onChange={(e) => setNewEmployee({ ...newEmployee, hireDate: e.target.value })}
              required
            />
          </div>
          <Button type="submit">إضافة الموظف</Button>
        </form>
      </DialogContent>
    </Dialog>
  )
}

