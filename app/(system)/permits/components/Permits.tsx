"use client"

import { useState } from "react"
import { PermitsTable } from "./PermitsTable"
import { NewPermitModal } from "./NewPermitModal"
import { Button } from "@/components/ui/button"
import { PlusIcon } from "lucide-react"

export function Permits() {
  const [isNewPermitModalOpen, setIsNewPermitModalOpen] = useState(false)

  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <Button onClick={() => setIsNewPermitModalOpen(true)}>
          <PlusIcon className="ml-2 h-4 w-4" /> إضافة إذن جديد
        </Button>
      </div>
      <PermitsTable />
      <NewPermitModal isOpen={isNewPermitModalOpen} onClose={() => setIsNewPermitModalOpen(false)} />
    </div>
  )
}

