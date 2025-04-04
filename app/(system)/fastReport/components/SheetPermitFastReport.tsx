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

const SheetPermitFastReport = ({ data }: { data: any }) => {
  const total = useMemo(() => {
    return data?.reduce((sum: number, item: any) => {
      if (item.transaction_type == "expense") {
        return  sum - Number(item.amount);
      } else return Number(item.amount) + sum;
    }, 0);
  }, [data]);
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
        className="bg-card h-full overflow-y-scroll"
        side={"bottom"}
        dir="rtl"
      >
        <SheetHeader>
          <SheetTitle>تقارير إدارة العمليات والخدمات</SheetTitle>
        </SheetHeader>
        <div
          ref={posInvokeRef}
          className="print:p-2 print:max-h-fit max-h-[600px] print:!overflow-auto overflow-y-scroll h-fit"
        >
          <Table>
            <TableCaption>تقرير إدارة العمليات والخدمات</TableCaption>
            <TableHeader>
              <TableRow>
                <TableHead className="text-center">رقم المعاملة</TableHead>
                <TableHead className="text-center">نوع</TableHead>
                <TableHead className="text-center">اسم المورد/العميل</TableHead>
                <TableHead className="text-center">أجمالى</TableHead>
                <TableHead className="text-center">تعليق</TableHead>
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
                      {invoice.transaction_type == "expense" && "مصروفات"}
                      {invoice.transaction_type == "supply" && "أيداع"}
                      {invoice.transaction_type == "service" && "خدمات"}
                    </TableCell>
                    <TableCell className="text-center">
                      {invoice.entity_name}
                    </TableCell>
                    <TableCell className="text-center">
                      {invoice.amount}
                    </TableCell>
                    <TableCell className="text-center">
                      {invoice.reference}
                    </TableCell>
                    <TableCell className="text-center">
                      {formatDateForInput(invoice.transaction_date)}
                    </TableCell>
                  </TableRow>
                ))}
            </TableBody>
            <TableFooter>
              <TableRow>
                <TableCell colSpan={3} className="text-right">
                  أجمالى
                </TableCell>
                <TableCell className="text-center">{ total?.toFixed(2)}</TableCell>
                <TableCell className="text-center"></TableCell>
                <TableCell className="text-center"></TableCell>
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
export default memo(SheetPermitFastReport);
