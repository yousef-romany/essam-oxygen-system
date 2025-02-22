"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { PlusIcon } from "lucide-react"
import { CategoriesTable } from "./CategoriesTable"
import { NewCategoryModal } from "./NewCategoryModal"

export function Categories() {
  const [isNewCategoryModalOpen, setIsNewCategoryModalOpen] = useState(false)

  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <Button onClick={() => setIsNewCategoryModalOpen(true)}>
          <PlusIcon className="ml-2 h-4 w-4" /> إضافة فئة جديدة
        </Button>
      </div>
      <CategoriesTable />
      <NewCategoryModal isOpen={isNewCategoryModalOpen} onClose={() => setIsNewCategoryModalOpen(false)} />
    </div>
  )
}

