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
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { formatDateForInput } from "@/lib/formatDateForInput";
import { FileText } from "lucide-react";
import { memo, useMemo, useRef } from "react";
import { useReactToPrint } from "react-to-print";
const SheetTransactionFastReport = ({ data }: { data: any }) => {
  const total = useMemo(() => {
    if(Array.isArray(data)){
      return data.reduce((prev: number, item: any) => {
        if(item.payment_status !== "آجل") {
          return Number(item.total_amount) + Number(prev)
        } else return 0;
      }, 0) 
    } else 0;
  }, [data])
  const posInvokeRef: any = useRef<any>(null);
  const handlePrintPos = useReactToPrint({ contentRef: posInvokeRef });
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="outline" className="w-full">
          <FileText className="mr-2 h-4 w-4" />
          عرض التقارير
        </Button>
      </SheetTrigger>
      <SheetContent
        className="bg-card h-full"
        side={"bottom"}
        dir="rtl"
      >
        <SheetHeader>
          <SheetTitle>تقارير المعاملات</SheetTitle>
        </SheetHeader>
        <div ref={posInvokeRef} className="print:p-2 print:max-h-fit max-h-[600px] print:!overflow-auto overflow-y-scroll h-fit">
          <Table>
            <TableCaption>تقرير المعاملات</TableCaption>
            <TableHeader>
              <TableRow>
                <TableHead className="text-center">رقم المعاملة</TableHead>
                <TableHead className="text-center">نوع المعاملة</TableHead>
                <TableHead className="text-center">اسم المورد/العميل</TableHead>
                <TableHead className="text-center">العامل المسؤول</TableHead>
                <TableHead className="text-center">أجمالى الفاتوره</TableHead>
                <TableHead className="text-center">حالة الدفع</TableHead>
                <TableHead className="text-center">تاريخ المعاملة</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {Array.isArray(data) &&
                data.map((invoice, key: number) => (
                  <TableRow key={key}>
                    <TableCell className="font-medium text-center">
                      {invoice.transaction_id}
                    </TableCell>
                    <TableCell className="text-center">
                      {invoice.transaction_type}
                    </TableCell>
                    <TableCell className="text-center">
                      {invoice.transaction_type == "بيع"
                        ? invoice.customer_name
                        : invoice.supplier_name}
                    </TableCell>
                    <TableCell className="text-center">
                      {invoice.employee_name}
                    </TableCell>
                    <TableCell className="text-center">
                      {invoice.total_amount}
                    </TableCell>
                    <TableCell className="text-center">
                      {invoice.payment_status}
                    </TableCell>
                    <TableCell className="text-center">
                      {formatDateForInput(invoice.created_at)}
                    </TableCell>
                  </TableRow>
                ))}
            </TableBody>
            <TableFooter>
              <TableRow>
                <TableCell colSpan={6} className="text-right">أجمالى الفواتير النقديه</TableCell>
                <TableCell className="text-center">{total?.toFixed(2)}</TableCell>
              </TableRow>
            </TableFooter>
          </Table>
        </div>

        <Button onClick={() => handlePrintPos()} variant={"secondary"}>
          Print
        </Button>
      </SheetContent>
    </Sheet>
  );
};
export default memo(SheetTransactionFastReport);