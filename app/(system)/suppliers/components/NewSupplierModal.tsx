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

type Supplier = {
  id: string;
  name: string;
  phoneNumber: string;
};

type NewSupplierModalProps = {
  isOpen: boolean;
  onClose: () => void;
};

export function NewSupplierModal({ isOpen, onClose }: NewSupplierModalProps) {
  const [newSupplier, setNewSupplier] = useState<Partial<Supplier>>({
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
    } = newSupplier;

    // Example userId - ensure this value is valid in your context
    const userId = localStorage.getItem("id");

    try {
      // Use prepared statement placeholders for security
      const query = `
        INSERT INTO suppliers 
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
      setNewSupplier({
        name: "",
        phoneNumber: "",
      });
      // Close the form/modal after successful insertion
      onClose();
    } catch (error) {
      console.error("Error inserting Supplier:", error);
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
          <DialogTitle>إضافة مودر جديد</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="name">الاسم</Label>
            <Input
              id="name"
              value={newSupplier.name}
              onChange={(e) =>
                setNewSupplier({ ...newSupplier, name: e.target.value })
              }
              required
            />
          </div>
          <div>
            <Label htmlFor="phoneNumber">رقم الهاتف</Label>
            <Input
              id="phoneNumber"
              value={newSupplier.phoneNumber}
              onChange={(e) =>
                setNewSupplier({ ...newSupplier, phoneNumber: e.target.value })
              }
              required
            />
          </div>
          <Button type="submit">إضافة المورد</Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
