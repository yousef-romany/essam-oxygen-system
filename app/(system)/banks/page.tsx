"use client";
import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";
import { BankAccountsTable } from "./components/BankAccountsTable";
import { useState } from "react";
import { NewBankAccountModal } from "./components/NewBankAccountModal";

export default function BankAccountsPage() {
  const [isNewAccountModalOpen, setIsNewAccountModalOpen] = useState(false);
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">الحسابات البنكية</h1>
        <Button onClick={() => setIsNewAccountModalOpen(true)}>
          <PlusCircle className="mr-2 h-4 w-4" />
          إضافة حساب بنكي
        </Button>
      </div>
      <BankAccountsTable />
      <NewBankAccountModal
        isOpen={isNewAccountModalOpen}
        onClose={() => setIsNewAccountModalOpen(false)}
      />
    </div>
  );
}
