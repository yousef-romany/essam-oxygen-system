"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { PlusIcon } from 'lucide-react'
import { SafeMoneyTable } from "./SafeMoneyTable"
import { NewSafeMoneyModal } from "./NewSafeMoneyModal"

export function SafeMoney() {
  const [isNewSafeMoneyModalOpen, setIsNewSafeMoneyModalOpen] = useState(false)

  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <Button onClick={() => setIsNewSafeMoneyModalOpen(true)}>
          <PlusIcon className="ml-2 h-4 w-4" /> إضافة معاملة جديدة
        </Button>
      </div>
      <SafeMoneyTable />
      <NewSafeMoneyModal isOpen={isNewSafeMoneyModalOpen} onClose={() => setIsNewSafeMoneyModalOpen(false)} />
    </div>
  )
}
