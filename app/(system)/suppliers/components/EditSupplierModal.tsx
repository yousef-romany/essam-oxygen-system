"use client";

import type React from "react";

import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

type Supplier = {
  id: number;
  name: string;
  phoneNumber: string;
  sentEmpty: number;
  receivedFull: number;
  pending: number;
};

type EditSupplierModalProps = {
  isOpen: boolean;
  onClose: () => void;
  supplier: Supplier;
  onUpdateSupplier: (supplier: Supplier) => void;
};

export function EditSupplierModal({
  isOpen,
  onClose,
  supplier,
  onUpdateSupplier,
}: EditSupplierModalProps) {
  const [editedSupplier, setEditedSupplier] = useState<Supplier>(supplier);

  useEffect(() => {
    setEditedSupplier(supplier);
  }, [supplier]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdateSupplier(editedSupplier);
    onClose();
  };

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
              value={editedSupplier.name}
              onChange={(e) =>
                setEditedSupplier({ ...editedSupplier, name: e.target.value })
              }
              required
            />
          </div>
          <div>
            <Label htmlFor="phoneNumber">رقم الهاتف</Label>
            <Input
              id="phoneNumber"
              value={editedSupplier.phoneNumber}
              onChange={(e) =>
                setEditedSupplier({
                  ...editedSupplier,
                  phoneNumber: e.target.value,
                })
              }
              required
            />
          </div>
          <Button type="submit">تحديث بيانات الموظف</Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
