import { CustomerReport } from "./components/CustomerReport";

export default function CustomerReportPage() {
  return (
    <div className="container mx-auto py-10">
      <h1 className="text-3xl font-bold mb-5">تقرير العملاء و موردين</h1>
      <CustomerReport />
    </div>
  )
}

