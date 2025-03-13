/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import { ErrorDisplay } from "@/components/ErrorDisplay";
import { LoadingSpinner } from "@/components/LoadingSpinner";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { fetchMoneyReport } from "@/constant/SafeMoney.info";
import { useQuery } from "@tanstack/react-query";
import { BanknoteIcon } from "lucide-react";

export default function SafeMoneyPage() {
  const { isLoading, isError, data, error } = useQuery<any[]>({
    queryKey: ["fetchMoneyReport"],
    queryFn: async () => await fetchMoneyReport(),
    refetchInterval: 1500,
  });

  if (isLoading) {
    return <LoadingSpinner />;
  }

  if (isError) {
    return <ErrorDisplay message={error?.message || "Error occurred"} />;
  }
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold mb-5">الخزينة</h1>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">الرصيد الحالي</CardTitle>
          <BanknoteIcon className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            {data && data?.at(0).totalMoney.toLocaleString()} ج.م
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
