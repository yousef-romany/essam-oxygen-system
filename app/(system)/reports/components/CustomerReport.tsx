/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState, useMemo } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import SelectCustomerOrSupplierReport from "./SelectCustomerOrSupplierReport";
import { fetchReport } from "@/constant/Report.info";
import { useQuery } from "@tanstack/react-query";
import { LoadingSpinner } from "@/components/LoadingSpinner";
import { ErrorDisplay } from "@/components/ErrorDisplay";
import { fetchInventoryList } from "@/constant/Category.info";
import { cn } from "@/lib/utils";

type Transaction = {
  id: string;
  customerId: number;
  date: string;
  type: "بيع" | "إرجاع";
  categoryId: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
};

type Category = {
  id: string;
  name: string;
};

export function CustomerReport() {
  const [selectedCustomer, setSelectedCustomer] = useState<{
    customerORSupplierId: number;
    customerORSupplierType: string;
  }>({
    customerORSupplierId: 0,
    customerORSupplierType: "customer",
  });
  const [dateFrom, setDateFrom] = useState<string>("");
  const [dateTo, setDateTo] = useState<string>("");

  const { isLoading, isError, data, error } = useQuery<
    any,
    Error
  >({
    queryKey: ["fetchReporttests"],
    queryFn: async () => await fetchReport(),
    refetchInterval: 2000,
  });

  const category = useQuery<{ data: Category[] }, Error>({
    queryKey: ["fetchInventoryList"],
    queryFn: async () => await fetchInventoryList(),
    refetchInterval: 2000,
  });

  const filteredTransactions = useMemo(() => {
    if (selectedCustomer.customerORSupplierType == "customer") {
      return (
        Array.isArray(data) &&
        data?.filter((transaction: any) => {
          const matchesCustomer = Number(selectedCustomer?.customerORSupplierId)
            ? Number(transaction.customerId) ==
              Number(selectedCustomer?.customerORSupplierId)
            : true;
          const matchesDateRange =
            (!dateFrom || transaction.date >= dateFrom) &&
            (!dateTo || transaction.date <= dateTo);
          return matchesCustomer && matchesDateRange;
        })
      );
    } else {
      return (
        Array.isArray(data) &&
        data?.filter((transaction: any) => {
          const matchesCustomer = Number(selectedCustomer?.customerORSupplierId)
            ? Number(transaction.supplierId) ==
              Number(selectedCustomer?.customerORSupplierId)
            : true;
          const matchesDateRange =
            (!dateFrom || transaction.date >= dateFrom) &&
            (!dateTo || transaction.date <= dateTo);
          return matchesCustomer && matchesDateRange;
        })
      );
    }
  }, [selectedCustomer, dateFrom, dateTo, data]);

  const totalOwed = useMemo(() => {
    if (Array.isArray(filteredTransactions)) {
      return filteredTransactions?.reduce((sum: any, transaction: any) => {
        return (
          sum +
          (transaction.type === "بيع"
            ? Number(transaction.totalPrice)
            : -Number(transaction.totalPrice))
        );
      }, 0);
    }
  }, [filteredTransactions]);

  const transactionsByCategory = useMemo(() => {
    const categoryTotals: {
      [key: string]: {
        total: number;
        full: number;
        empty: number;
      };
    } = {};

    if (Array.isArray(filteredTransactions)) {
      filteredTransactions.forEach((transaction: any) => {
        const categoryId = transaction.categoryId;
        const quantity =
          transaction.type === "بيع"
            ? transaction.quantity
            : -transaction.quantity;
        const status = transaction.status; // الحالة الممتلئة أو الفارغة

        if (!categoryTotals[categoryId]) {
          categoryTotals[categoryId] = { total: 0, full: 0, empty: 0 };
        }

        categoryTotals[categoryId].total += quantity;

        if (status === "ممتلئ") {
          categoryTotals[categoryId].full += quantity;
        } else if (status === "فارغ") {
          categoryTotals[categoryId].empty += quantity;
        }
      });
    }

    return categoryTotals;
  }, [filteredTransactions]);

  console.log(data);

  if (isLoading) {
    return <LoadingSpinner />;
  }
  if (isError) {
    return <ErrorDisplay message={error.message} />;
  }
  if (error) {
    console.log(error);
    return <ErrorDisplay message={"Error"} />;
  }
  return (
    <>
      <div className="space-y-4">
        <div className="flex flex-wrap gap-4">
          <div className="flex-1">
            <Label htmlFor="customer"> العميل أو مورد</Label>

            <SelectCustomerOrSupplierReport
              selectedCustomer={selectedCustomer}
              setSelectedCustomer={setSelectedCustomer}
            />
          </div>
          <div className="flex-1">
            <Label htmlFor="dateFrom">من تاريخ</Label>
            <Input
              id="dateFrom"
              type="date"
              value={dateFrom}
              onChange={(e) => setDateFrom(e.target.value)}
            />
          </div>
          <div className="flex-1">
            <Label htmlFor="dateTo">إلى تاريخ</Label>
            <Input
              id="dateTo"
              type="date"
              value={dateTo}
              onChange={(e) => setDateTo(e.target.value)}
            />
          </div>
        </div>
        {selectedCustomer.customerORSupplierId !== 0 ? (
          <>
            <Card>
              <CardHeader>
                <CardTitle>ملخص الحساب</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-2xl font-bold">
                  إجمالي المبلغ المستحق:{" "}
                  {totalOwed?.toLocaleString("ar-EG") || 0} جنيه مصري
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>الكميات حسب الفئات</CardTitle>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="text-center">الفئة</TableHead>
                      <TableHead className="text-center">
                        إجمالي الكمية
                      </TableHead>
                      <TableHead className="text-center">فارغ</TableHead>
                      <TableHead className="text-center">ممتلئ</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {Object.entries(transactionsByCategory)?.map(
                      ([categoryId, data]: [string, any]) => (
                        <TableRow key={categoryId}>
                          <TableCell className="text-center">
                            {Array.isArray(category.data) &&
                              category?.data?.find(
                                (c: any) => c.id == categoryId
                              )?.name}
                          </TableCell>
                          <TableCell className="text-center">
                            {Math.abs(Number(data.total))}
                          </TableCell>
                          <TableCell className="text-center">
                            {Math.abs(Number(data.empty))}
                          </TableCell>
                          <TableCell className="text-center">
                            {Math.abs(Number(data.full))}
                          </TableCell>
                        </TableRow>
                      )
                    )}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>تفاصيل المعاملات</CardTitle>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="text-center">
                        رقم الفاتوره
                      </TableHead>
                      <TableHead className="text-center">التاريخ</TableHead>
                      <TableHead className="text-center">النوع</TableHead>
                      <TableHead className="text-center">الفئة</TableHead>
                      <TableHead className="text-center"> الفئه نوع</TableHead>
                      <TableHead className="text-center">الكمية</TableHead>
                      <TableHead className="text-center">
                        السعر الوحدة
                      </TableHead>
                      <TableHead className="text-center">الإجمالي</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {(() => {
                      // تجميع الفواتير بنفس رقم الفاتورة
                      const groupedTransactions: Record<string, any[]> =
                        (filteredTransactions as any)?.reduce(
                          (acc: Record<string, any[]>, transaction: any) => {
                            acc[transaction.transactionId] =
                              acc[transaction.transactionId] || [];
                            acc[transaction.transactionId].push(transaction);
                            return acc;
                          },
                          {}
                        );

                      // تحويل البيانات إلى مصفوفة قابلة للتكرار
                      return Object.entries(groupedTransactions).map(
                        ([transactionId, transactions]) =>
                          transactions.map((transaction, index) => (
                            <TableRow
                              key={`${transactionId}-${index}`}
                              className={cn(
                                index === 0 && "border-t-4 border-green-500",
                                index === transactions.length - 1 &&
                                  "border-b-4 border-green-500"
                              )}
                            >
                              <TableCell className="text-center">
                                {transactionId}
                              </TableCell>
                              <TableCell className="text-center">
                                {transaction.date}
                              </TableCell>
                              <TableCell className="text-center">
                                {transaction.type}
                              </TableCell>
                              <TableCell className="text-center">
                                {Array.isArray(category.data) &&
                                  category?.data?.find(
                                    (c: any) => c.id == transaction.categoryId
                                  )?.name}
                              </TableCell>
                              <TableCell className="text-center">
                                {transaction.status}
                              </TableCell>
                              <TableCell className="text-center">
                                {transaction.quantity}
                              </TableCell>
                              <TableCell className="text-center">
                                {transaction?.unitPrice?.toLocaleString(
                                  "ar-EG"
                                )}
                              </TableCell>
                              <TableCell className="text-center">
                                {Number(
                                  transaction?.totalPrice
                                )?.toLocaleString("ar-EG")}
                              </TableCell>
                            </TableRow>
                          ))
                      );
                    })()}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </>
        ) : (
          <h1>أختر عميل او المورد !</h1>
        )}
      </div>
    </>
  );
}
