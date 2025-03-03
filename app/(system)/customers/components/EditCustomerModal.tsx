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

type Customer = {
  id: string;
  name: string;
  phoneNumber: string;
};

type EditCustomerModalProps = {
  isOpen: boolean;
  onClose: () => void;
  Customer: Customer;
  onUpdateCustomer: (Customer: Customer) => void;
};

export function EditCustomerModal({
  isOpen,
  onClose,
  Customer,
  onUpdateCustomer,
}: EditCustomerModalProps) {
  const [editedCustomer, setEditedCustomer] = useState<Customer>(Customer);

  useEffect(() => {
    setEditedCustomer(Customer);
  }, [Customer]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdateCustomer(editedCustomer);
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
              value={editedCustomer.name}
              onChange={(e) =>
                setEditedCustomer({ ...editedCustomer, name: e.target.value })
              }
              required
            />
          </div>
          <div>
            <Label htmlFor="phoneNumber">رقم الهاتف</Label>
            <Input
              id="phoneNumber"
              value={editedCustomer.phoneNumber}
              onChange={(e) =>
                setEditedCustomer({
                  ...editedCustomer,
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
