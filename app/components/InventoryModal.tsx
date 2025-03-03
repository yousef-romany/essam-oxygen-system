"use client";

import { useEffect, useState } from "react";
import { Modal } from "./Modal";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import db from "@/lib/db";
import { toast } from "@/hooks/use-toast";

interface InventoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialData: {
    id: string;
    name: string;
    full_quantity: number;
    empty_quantity: number;
  };
}

export function InventoryModal({
  isOpen,
  onClose,
  initialData,
}: InventoryModalProps) {
  const [formData, setFormData] = useState({
    id: "",
    name: "",
    full_quantity: 0,
    empty_quantity: 0,
  });

  useEffect(() => {
    setFormData(initialData);
  }, [initialData]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const { id, name, full_quantity, empty_quantity } = formData;

    const userId = localStorage.getItem("id");

    // Set created_at to the current timestamp. Adjust formatting if needed.
    const createdAt = new Date().toISOString();

    try {
      const query = `
      UPDATE inventory
      SET name = ?, empty_quantity = ?, full_quantity = ?, userId = ?, created_at = ?
      WHERE id = ?;
    `;

      const values = [
        name,
        empty_quantity,
        full_quantity,
        userId,
        createdAt,
        id,
      ];

      // Execute the update query
      (await db).execute(query, values);

      setFormData({
        id: "",
        name: "",
        full_quantity: 0,
        empty_quantity: 0,
      });
      toast({
        variant: "default",
        title: "تم تعديل",
      })
      onClose();
    } catch (error) {
      console.error("Error inserting Category:", error);
      // Optionally, display an error to the user
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={initialData ? "تعديل المخزون" : "إضافة مخزون"}
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="id" className="block text-sm font-medium">
            رقم العنصر
          </label>
          <Input
            id="id"
            value={formData?.id}
            onChange={(e) => setFormData({ ...formData, id: e.target.value })}
            required
            disabled
          />
        </div>
        <div>
          <label htmlFor="name" className="block text-sm font-medium">
            أسم الصنف
          </label>
          <Input
            id="name"
            value={formData?.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            required
            disabled
          />
        </div>
        <div>
          <label htmlFor="full_quantity" className="block text-sm font-medium">
            الأسطوانات الممتلئة
          </label>
          <Input
            id="full_quantity"
            type="number"
            value={formData?.full_quantity}
            onChange={(e) =>
              setFormData({
                ...formData,
                full_quantity: Number.parseInt(e.target.value),
              })
            }
            required
          />
        </div>
        <div>
          <label htmlFor="empty_quantity" className="block text-sm font-medium">
            الأسطوانات الفارغة
          </label>
          <Input
            id="empty_quantity"
            type="number"
            value={formData?.empty_quantity}
            onChange={(e) =>
              setFormData({
                ...formData,
                empty_quantity: Number.parseInt(e.target.value),
              })
            }
            required
          />
        </div>
        <Button type="submit">حفظ</Button>
      </form>
    </Modal>
  );
}
