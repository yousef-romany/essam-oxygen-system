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
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import SelectCustomerOrSupplierOrEmployee from "@/components/SelectCustomerOrSupplierOrEmployee";
import { formatDateForInput } from "@/lib/formatDateForInput";

type Permit = {
  id: number;
  transaction_type: "expense" | "service" | "supply";
  transaction_date: string;
  reference: string;
  related_entity_id: number;
  entity_id: number;
  entity_type: string;
  userId: number;
  amount: number;
  supplier_or_client_or_employee_name: string;
  description: string;
};

type EditPermitModalProps = {
  isOpen: boolean;
  onClose: () => void;
  permit: Permit;
  onUpdatePermit: (permit: Permit) => void;
};

export function EditPermitModal({
  isOpen,
  onClose,
  permit,
  onUpdatePermit,
}: EditPermitModalProps) {
  const [editedPermit, setEditedPermit] = useState<Permit>(
    permit || {
      id: 0,
      transaction_type: "",
      transaction_date: "",
      reference: "",
      related_entity_id: "",
      entity_id: "",
      entity_type: "",
      userId: "",
      amount: "",
      supplier_or_client_or_employee_name: "",
      description: "",
    }
  );

  useEffect(() => {
    setEditedPermit(permit);
  }, [permit]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdatePermit(editedPermit);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>تعديل الإذن</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="transaction_type">نوع الإذن</Label>
            <Select
              dir="rtl"
              value={editedPermit.transaction_type}
              onValueChange={(value) =>
                setEditedPermit({
                  ...editedPermit,
                  transaction_type: value as "supply" | "expense" | "service",
                })
              }
              required
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
              newPermit={undefined}
              editingTransaction={editedPermit}
              setEditingTransaction={setEditedPermit}
            />
          </div>
          <div>
            <Label htmlFor="amount">المبلغ</Label>
            <Input
              id="amount"
              type="number"
              value={editedPermit.amount}
              onChange={(e) =>
                setEditedPermit({
                  ...editedPermit,
                  amount: Number(e.target.value),
                })
              }
              required
            />
          </div>
          <div>
            <Label htmlFor="transaction_date">التاريخ</Label>
            <Input
              id="transaction_date"
              type="date"
              value={formatDateForInput(editedPermit.transaction_date)}
              onChange={(e) =>
                setEditedPermit({
                  ...editedPermit,
                  transaction_date: e.target.value,
                })
              }
              required
            />
          </div>
          <div>
            <Label htmlFor="reference">الوصف</Label>
            <Input
              id="reference"
              value={editedPermit.reference}
              onChange={(e) =>
                setEditedPermit({
                  ...editedPermit,
                  reference: e.target.value,
                })
              }
              required
            />
          </div>
          <Button type="submit">تحديث الإذن</Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
