import { TransactionsTable } from "../../components/TransactionsTable"
import TransActionsSheet from "./components/TransActionsSheet"

export default function TransactionsPage() {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">المعاملات</h1>
        <TransActionsSheet />
      </div>
      <TransactionsTable />
    </div>
  )
}

