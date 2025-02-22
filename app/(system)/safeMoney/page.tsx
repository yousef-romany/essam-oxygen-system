import { SafeMoney } from "./components/SafeMoney";

export default function SafeMoneyPage() {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold mb-5">الخزينة</h1>
      <SafeMoney />
    </div>
  );
}
