import { CustomersTable } from "../../components/CustomersTable"
import { Button } from "@/components/ui/button"
import { PlusCircle } from "lucide-react"

export default function CustomersPage() {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">العملاء</h1>
        <Button>
          <PlusCircle className="ml-2 h-4 w-4" /> إضافة عميل
        </Button>
      </div>
      <CustomersTable />
    </div>
  )
}

