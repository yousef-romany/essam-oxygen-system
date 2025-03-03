import { InventoryTable } from "@/app/components/InventoryTable"

export default function InventoryPage() {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">إدارة المخزون</h1>
      </div>
      <InventoryTable />
    </div>
  )
}

