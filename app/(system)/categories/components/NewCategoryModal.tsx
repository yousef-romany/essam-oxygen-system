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

type Category = {
  id: string;
  name: string;
  price: number;
  initialEmptyStock: number;
  initialFullStock: number;
};

type NewCategoryModalProps = {
  isOpen: boolean;
  onClose: () => void;
};

export function NewCategoryModal({ isOpen, onClose }: NewCategoryModalProps) {
  const [newCategory, setNewCategory] = useState<Partial<Category>>({
    name: "",
    price: 0,
    initialEmptyStock: 0,
    initialFullStock: 0,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Extract and map your state values to match your table column names
    const {
      name,
      initialEmptyStock,
      initialFullStock,
      price
      // Optionally, userId might come from another source (e.g., the logged-in user)
    } = newCategory;

    // Example userId - ensure this value is valid in your context
    const userId = localStorage.getItem("id");

    try {
      // Use prepared statement placeholders for security
      const query = `
        INSERT INTO inventory 
          (name, full_quantity, empty_quantity, price, userId, created_at)
        VALUES 
          (?, ?, ?, ?, ?, ?);
      `;

      // Map the values in the correct order
      const values = [
        name,
        initialFullStock,
        initialEmptyStock,
        price || 0,
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
      setNewCategory({
        name: "",
        initialEmptyStock: 0,
        initialFullStock: 0,
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
          <DialogTitle>إضافة فئة جديدة</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="name">اسم الفئة</Label>
            <Input
              id="name"
              value={newCategory.name}
              onChange={(e) =>
                setNewCategory({ ...newCategory, name: e.target.value })
              }
              required
            />
          </div>
          <div>
            <Label htmlFor="price">سعر</Label>
            <Input
              id="price"
              type="number"
              value={newCategory.price}
              onChange={(e) =>
                setNewCategory({
                  ...newCategory,
                  price: Number(e.target.value),
                })
              }
              required
            />
          </div>
          <div>
            <Label htmlFor="initialEmptyStock">الرصيد (فارغ)</Label>
            <Input
              id="initialEmptyStock"
              type="number"
              value={newCategory.initialEmptyStock}
              onChange={(e) =>
                setNewCategory({
                  ...newCategory,
                  initialEmptyStock: Number(e.target.value),
                })
              }
              required
            />
          </div>
          <div>
            <Label htmlFor="initialFullStock">الرصيد (ممتلئ)</Label>
            <Input
              id="initialFullStock"
              type="number"
              value={newCategory.initialFullStock}
              onChange={(e) =>
                setNewCategory({
                  ...newCategory,
                  initialFullStock: Number(e.target.value),
                })
              }
              required
            />
          </div>
          <Button type="submit">إضافة الفئة</Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
