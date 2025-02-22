"use client"

import type React from "react"

import { useState, useEffect } from "react"
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

type EditEmployeeModalProps = {
  isOpen: boolean
  onClose: () => void
  employee: Employee
  onUpdateEmployee: (employee: Employee) => void
}

export function EditEmployeeModal({ isOpen, onClose, employee, onUpdateEmployee }: EditEmployeeModalProps) {
  const [editedEmployee, setEditedEmployee] = useState<Employee>(employee)

  useEffect(() => {
    setEditedEmployee(employee)
  }, [employee])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onUpdateEmployee(editedEmployee)
    onClose()
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>تعديل بيانات الموظف</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="name">الاسم</Label>
            <Input
              id="name"
              value={editedEmployee.name}
              onChange={(e) => setEditedEmployee({ ...editedEmployee, name: e.target.value })}
              required
            />
          </div>
          <div>
            <Label htmlFor="position">الوظيفة</Label>
            <Input
              id="position"
              value={editedEmployee.position}
              onChange={(e) => setEditedEmployee({ ...editedEmployee, position: e.target.value })}
              required
            />
          </div>
          <div>
            <Label htmlFor="department">القسم</Label>
            <Input
              id="department"
              value={editedEmployee.department}
              onChange={(e) => setEditedEmployee({ ...editedEmployee, department: e.target.value })}
              required
            />
          </div>
          <div>
            <Label htmlFor="phoneNumber">رقم الهاتف</Label>
            <Input
              id="phoneNumber"
              value={editedEmployee.phoneNumber}
              onChange={(e) => setEditedEmployee({ ...editedEmployee, phoneNumber: e.target.value })}
              required
            />
          </div>
          <div>
            <Label htmlFor="email">البريد الإلكتروني</Label>
            <Input
              id="email"
              type="email"
              value={editedEmployee.email}
              onChange={(e) => setEditedEmployee({ ...editedEmployee, email: e.target.value })}
              required
            />
          </div>
          <div>
            <Label htmlFor="hireDate">تاريخ التعيين</Label>
            <Input
              id="hireDate"
              type="date"
              value={editedEmployee.hireDate}
              onChange={(e) => setEditedEmployee({ ...editedEmployee, hireDate: e.target.value })}
              required
            />
          </div>
          <Button type="submit">تحديث بيانات الموظف</Button>
        </form>
      </DialogContent>
    </Dialog>
  )
}

