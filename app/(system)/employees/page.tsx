import { Employees } from "./components/Employees";

export default function EmployeesPage() {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold mb-5">الموظفون</h1>
      <Employees />
    </div>
  )
}
