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

type Customer = {
  id: string;
  name: string;
  phoneNumber: string;
};

type NewCustomerModalProps = {
  isOpen: boolean;
  onClose: () => void;
};

export function NewCustomerModal({ isOpen, onClose }: NewCustomerModalProps) {
  const [newEmployee, setNewEmployee] = useState<Partial<Customer>>({
    name: "",
    phoneNumber: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Extract and map your state values to match your table column names
    const {
      name,
      phoneNumber,
      // Optionally, userId might come from another source (e.g., the logged-in user)
    } = newEmployee;

    // Example userId - ensure this value is valid in your context
    const userId = localStorage.getItem("id");

    try {
      // Use prepared statement placeholders for security
      const query = `
        INSERT INTO customers 
          (name, phoneNumber, userId, created_at)
        VALUES 
          (?, ?, ?, ?);
      `;

      // Map the values in the correct order
      const values = [name, phoneNumber, userId, Date.now()];

      // Execute the query (assuming db.execute returns a promise)
      await (await db).execute(query, values);
      toast({
        variant: "default",
        title: "تم 🔐",
        description: "تم الاضافه",
      });
      setNewEmployee({
        name: "",
        phoneNumber: "",
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
          <Button type="submit">إضافة الموظف</Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
