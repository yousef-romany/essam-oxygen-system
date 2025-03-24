/* eslint-disable @next/next/no-img-element */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { memo, useEffect, useRef, useState } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useQuery } from "@tanstack/react-query";
import { fetchInvokeDetailsOneBridgePoint } from "@/constant/bridgePoint";
import { LoadingSpinner } from "@/components/LoadingSpinner";

const ShowInvokesBridgePoint = ({
  idInvoke,
  taxs,
}: {
  idInvoke: number;
  taxs: number;
}) => {
  const [clientFetchStatus, setClientFetchStatus] = useState(false);
  const tableRef: any = useRef<any>(null);

  useEffect(() => {
    setClientFetchStatus(true);
  }, [idInvoke]);

  const { data, isLoading, error }: any = useQuery({
    queryKey: ["fetchInvokeDetailsOneBridgePoint"],
    queryFn: () => fetchInvokeDetailsOneBridgePoint(Number(idInvoke)),
    refetchInterval: 2000,
    enabled: clientFetchStatus,
  });

  // Loading state
  if (isLoading) {
    return <LoadingSpinner />;
  }

  // Error state
  if (error) {
    return (
      <div className="text-red-500 text-center">
        Error: {error.message || "An error occurred"}
      </div>
    );
  }

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="outline" className="w-full">
          تفاصيل
        </Button>
      </SheetTrigger>
      <SheetContent side={"bottom"} className="bg-card max-h-screen" dir="rtl">
        <SheetHeader>
          <SheetTitle className="flex gap-4 items-center justify-center">
            تفاصيل الفتوره{" "}
          </SheetTitle>
        </SheetHeader>
        <div className="container mx-auto p-4 rtl" dir="rtl">
          <div
            ref={tableRef}
            className="w-full mx-auto rtl flex flex-col gap-1"
            dir="rtl"
          >
            <Card
              className="w-full max-w-4xl mx-auto print:shadow-none print:border-none"
              dir="rtl"
            >
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="text-2xl">
                      فاتورة رقم {idInvoke}#
                    </CardTitle>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="text-center">أسم الصنف</TableHead>
                      <TableHead className="text-center">الكمية</TableHead>
                      <TableHead className="text-center">سعر شراء للوحده الواحده</TableHead>
                      <TableHead className="text-center">سعر بيع للوحده الواحده</TableHead>
                      <TableHead className="text-center">الإجمالي</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {data?.map((item: any) => (
                      <TableRow key={item.id}>
                        <TableCell className="text-center">
                          {item.name}
                        </TableCell>
                        <TableCell className="text-center">
                          {item.amount}
                        </TableCell>
                        <TableCell className="text-center">
                          {item.priceBuy}
                        </TableCell>
                        <TableCell className="text-center">
                          {item.priceSale}
                        </TableCell>
                        <TableCell className="text-center">
                          {Number(item.priceSale * item.amount) -
                            (Number(item.priceBuy * item.amount) + Number(taxs))}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>

              </CardContent>
            </Card>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
};
export default memo(ShowInvokesBridgePoint);
