"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { PlusIcon } from "lucide-react"
import { EmployeesTable } from "./EmployeesTable"
import { NewEmployeeModal } from "./NewEmployeeModal"

export function Employees() {
  const [isNewEmployeeModalOpen, setIsNewEmployeeModalOpen] = useState(false)

  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <Button onClick={() => setIsNewEmployeeModalOpen(true)}>
          <PlusIcon className="ml-2 h-4 w-4" /> إضافة موظف جديد
        </Button>
      </div>
      <EmployeesTable />
      <NewEmployeeModal isOpen={isNewEmployeeModalOpen} onClose={() => setIsNewEmployeeModalOpen(false)} />
    </div>
  )
}

