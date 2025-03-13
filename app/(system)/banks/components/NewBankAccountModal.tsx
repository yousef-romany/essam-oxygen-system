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
import { toast } from "@/hooks/use-toast";
import db from "@/lib/db";

type BankAccount = {
  id: string;
  account_number: string;
  bank_name: string;
  balance: number;
  transactions: [];
};

type NewBankAccountModalProps = {
  isOpen: boolean;
  onClose: () => void;
};

export function NewBankAccountModal({
  isOpen,
  onClose,
}: NewBankAccountModalProps) {
  const [newAccount, setNewAccount] = useState<Partial<BankAccount>>({
    account_number: "",
    bank_name: "",
    balance: 0,
  });

   

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Extract and map your state values to match your table column names
    const {
      account_number,
      bank_name,
      balance,
      // Optionally, userId might come from another source (e.g., the logged-in user)
    } = newAccount;

    // Example userId - ensure this value is valid in your context
    const userId = localStorage.getItem("id");

    try {
      // Use prepared statement placeholders for security
      const query = `
        INSERT INTO banks 
          (account_number, bank_name, balance, userId, created_at)
        VALUES 
          (?, ?, ?, ?, ?);
      `;

      // Map the values in the correct order
      const values = [account_number, bank_name, balance, userId, Date.now()];

      // Execute the query (assuming db.execute returns a promise)
      await (await db).execute(query, values);
      toast({
        variant: "default",
        title: "تم 🔐",
        description: "تم الاضافه",
      });
      setNewAccount({
        account_number: "",
        bank_name: "",
        balance: 0,
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
          <DialogTitle>إضافة حساب بنكي جديد</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="account_number">رقم الحساب</Label>
            <Input
              id="account_number"
              type="number"
              value={newAccount.account_number}
              onChange={(e) =>
                setNewAccount({ ...newAccount, account_number: e.target.value })
              }
              required
            />
          </div>
          <div>
            <Label htmlFor="bank_name">اسم البنك</Label>
            <Input
              id="bank_name"
              value={newAccount.bank_name}
              onChange={(e) =>
                setNewAccount({ ...newAccount, bank_name: e.target.value })
              }
              required
            />
          </div>
          <div>
            <Label htmlFor="balance">الرصيد الافتتاحي</Label>
            <Input
              id="balance"
              type="number"
              value={newAccount.balance}
              onChange={(e) =>
                setNewAccount({
                  ...newAccount,
                  balance: Number(e.target.value),
                })
              }
              required
            />
          </div>
          <Button type="submit"  >إضافة الحساب</Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
