"use client";

import type React from "react";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import db from "@/lib/db";
import { toast } from "@/hooks/use-toast";

type Employee = {
  id: string;
  name: string;
  position: string;
  department: string;
  phoneNumber: string;
  hireDate: string;
};

type NewEmployeeModalProps = {
  isOpen: boolean;
  onClose: () => void;
};

export function NewEmployeeModal({ isOpen, onClose }: NewEmployeeModalProps) {
  const [newEmployee, setNewEmployee] = useState<Partial<Employee>>({
    name: "",
    position: "",
    department: "",
    phoneNumber: "",
    hireDate: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Extract and map your state values to match your table column names
    const {
      name,
      position,
      department,
      phoneNumber,
      hireDate,
      // Optionally, userId might come from another source (e.g., the logged-in user)
    } = newEmployee;

    // Example userId - ensure this value is valid in your context
    const userId = localStorage.getItem("id");

    try {
      // Use prepared statement placeholders for security
      const query = `
        INSERT INTO employees 
          (name, positionEm, departmentEm, phoneNumber, hireDate, userId, created_at)
        VALUES 
          (?, ?, ?, ?, ?, ?, ?);
      `;

      // Map the values in the correct order
      const values = [
        name,
        position,
        department,
        phoneNumber,
        hireDate,
        userId,
        Date.now(),
      ];

      // Execute the query (assuming db.execute returns a promise)
      await (await db).execute(query, values);
      toast({
        variant: "default",
        title: "تم 🔐",
        description: "تم الاضافه",
      });
      setNewEmployee({
        name: "",
        position: "",
        department: "",
        phoneNumber: "",
        hireDate: "",
      });
      // Close the form/modal after successful insertion
      onClose();
    } catch (error) {
      console.error("Error inserting employee:", error);
      toast({
        variant: "destructive",
        title: "خطئ فى قواعد البيانات",
        description: error as string,
      });
      // You might want to display an error message to the user here.
    }
  };

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
              onChange={(e) =>
                setNewEmployee({ ...newEmployee, name: e.target.value })
              }
              required
            />
          </div>
          <div>
            <Label htmlFor="position">الوظيفة</Label>
            <Input
              id="position"
              value={newEmployee.position}
              onChange={(e) =>
                setNewEmployee({ ...newEmployee, position: e.target.value })
              }
              required
            />
          </div>
          <div>
            <Label htmlFor="department">القسم</Label>
            <Input
              id="department"
              value={newEmployee.department}
              onChange={(e) =>
                setNewEmployee({ ...newEmployee, department: e.target.value })
              }
              required
            />
          </div>
          <div>
            <Label htmlFor="phoneNumber">رقم الهاتف</Label>
            <Input
              id="phoneNumber"
              value={newEmployee.phoneNumber}
              onChange={(e) =>
                setNewEmployee({ ...newEmployee, phoneNumber: e.target.value })
              }
              required
            />
          </div>
          <div>
            <Label htmlFor="hireDate">تاريخ التعيين</Label>
            <Input
              id="hireDate"
              type="date"
              value={newEmployee.hireDate}
              onChange={(e) =>
                setNewEmployee({ ...newEmployee, hireDate: e.target.value })
              }
              required
            />
          </div>
          <Button type="submit">إضافة الموظف</Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
