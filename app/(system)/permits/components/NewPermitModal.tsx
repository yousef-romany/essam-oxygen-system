/* eslint-disable @typescript-eslint/no-explicit-any */
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
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import SelectCustomerOrSupplierOrEmployee from "@/components/SelectCustomerOrSupplierOrEmployee";
import db from "@/lib/db";
import { toast } from "@/hooks/use-toast";

type Permit = {
  id: string;
  type: "supply" | "expense" | "service";
  customerORSupplierId: number;
  customerORSupplierType: string;
  amount: number;
  date: string;
  description: string;
};

type NewPermitModalProps = {
  isOpen: boolean;
  onClose: () => void;
};

export function NewPermitModal({ isOpen, onClose }: NewPermitModalProps) {
  const [newPermit, setNewPermit] = useState<Partial<Permit>>({
    type: "expense",
    customerORSupplierId: 0,
    customerORSupplierType: "else",
    amount: 0,
    date: "",
    description: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // Here you would typically send the data to your backend

    const {
      type,
      customerORSupplierId,
      customerORSupplierType,
      amount,
      date,
      description,
    } = newPermit;

    const userId = localStorage.getItem("id");

    // Set created_at to the current timestamp. Adjust formatting if needed.

    try {
      await (
        await db
      )
        .execute(
          `INSERT INTO related_entities (entity_type, entity_id) VALUES (?, ?)`,
          [customerORSupplierType, customerORSupplierId]
        )
        .then(async (res: { lastInsertId: number; rowEffected: number }) => {
          const query = `
      INSERT INTO financial_transactions (transaction_type, amount, transaction_date, reference, related_entity_id, entity_type, userId) 
      VALUES (?, ?, ?, ?, ?, ?, ?);
    `;

          const values = [
            type,
            amount,
            date,
            description,
            res.lastInsertId,
            customerORSupplierType,
            userId,
          ];

          // Execute the update query
          (await db).execute(query, values);

          setNewPermit({
            type: "expense",
            customerORSupplierId: 0,
            customerORSupplierType: "else",
            amount: 0,
            date: "",
            description: "",
          });
          toast({
            variant: "default",
            title: "تم أضافه",
          });
          onClose();
        })
        .catch((error: any) => {
          console.log(error);
        });
    } catch (error) {
      console.error("Error inserting Category:", error);
      // Optionally, display an error to the user
    }
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>إضافة إذن جديد</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="type">نوع الإذن</Label>
            <Select
              dir="rtl"
              value={newPermit.type}
              onValueChange={(value) =>
                setNewPermit({
                  ...newPermit,
                  type: value as "supply" | "expense" | "service",
                })
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="اختر نوع الإذن" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup title="نوع العمليه">
                  <SelectItem value="expense"> - صرف</SelectItem>
                  <SelectItem value="supply"> + توريد</SelectItem>
                  <SelectItem value="service"> + خدمة</SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="customerName">اسم العميل / المورد / الموظف</Label>
            <SelectCustomerOrSupplierOrEmployee
              setNewPermit={setNewPermit}
              newPermit={newPermit}
              editingTransaction={undefined}
            />
          </div>

          <div>
            <Label htmlFor="amount">المبلغ</Label>
            <Input
              id="amount"
              type="number"
              value={newPermit.amount}
              onChange={(e) =>
                setNewPermit({ ...newPermit, amount: Number(e.target.value) })
              }
              required
            />
          </div>
          <div>
            <Label htmlFor="date">التاريخ</Label>
            <Input
              id="date"
              type="date"
              value={newPermit.date}
              onChange={(e) =>
                setNewPermit({ ...newPermit, date: e.target.value })
              }
              required
            />
          </div>
          <div>
            <Label htmlFor="description">الوصف</Label>
            <Input
              id="description"
              value={newPermit.description}
              onChange={(e) =>
                setNewPermit({ ...newPermit, description: e.target.value })
              }
              required
            />
          </div>
          <Button type="submit">إضافة الإذن</Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
