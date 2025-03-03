"use client";
import { SuppliersTable } from "../../components/SuppliersTable";
import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";
import { useState } from "react";
import { NewSupplierModal } from "./components/NewSupplierModal";

export default function SuppliersPage() {
  const [isNewSupplierModalOpen, setIsNewSupplierModalOpen] = useState(false);
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">الموردون</h1>
        <Button onClick={() => setIsNewSupplierModalOpen(true)}>
          <PlusCircle className="ml-2 h-4 w-4" /> إضافة مورد
        </Button>
      </div>
      <SuppliersTable />
      <NewSupplierModal
        isOpen={isNewSupplierModalOpen}
        onClose={() => setIsNewSupplierModalOpen(false)}
      />
    </div>
  );
}
