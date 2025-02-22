import { InventoryTable } from "../components/InventoryTable"
import { Button } from "@/components/ui/button"
import { PlusCircle } from "lucide-react"

export default function InventoryPage() {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">إدارة المخزون</h1>
        <Button>
          <PlusCircle className="ml-2 h-4 w-4" /> إضافة مخزون
        </Button>
      </div>
      <InventoryTable />
    </div>
  )
}

