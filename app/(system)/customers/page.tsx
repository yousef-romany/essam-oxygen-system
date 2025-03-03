"use client";
import { CustomersTable } from "../../components/CustomersTable"
import { Button } from "@/components/ui/button"
import { PlusCircle } from "lucide-react"
import { useState } from "react"
import { NewCustomerModal } from "./components/NewCustomerModal"

export default function CustomersPage() {
  const [isNewCustomerModalOpen, setIsNewCustomerModalOpen] = useState(false)
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">العملاء</h1>
        <Button onClick={() => setIsNewCustomerModalOpen(true)}>
          <PlusCircle className="ml-2 h-4 w-4" /> إضافة عميل
        </Button>
      </div>
      <CustomersTable />
      <NewCustomerModal isOpen={isNewCustomerModalOpen} onClose={() => setIsNewCustomerModalOpen(false)} />
    </div>
  )
}

