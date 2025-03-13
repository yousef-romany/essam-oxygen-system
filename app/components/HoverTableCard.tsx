/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";
import {
  Table,
  TableBody,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { memo } from "react";

const HoverTableCard = ({ row }: any) => {
  return (
    <div>
      <HoverCard>
        <HoverCardTrigger className="border-b-2">تفاصيل</HoverCardTrigger>
        <HoverCardContent className="min-w-[260px] w-full">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="text-center">اسم صنف</TableHead>
                <TableHead className="text-center">عدد</TableHead>
                <TableHead className="text-center">سعر</TableHead>
                <TableHead className="text-right">أجمالى</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {row.original?.items.map((invoice: any, key: number) => (
                <TableRow key={key}>
                  <TableCell className="text-center">{invoice.title}</TableCell>
                  <TableCell className="text-center">
                    {invoice.amount}
                  </TableCell>
                  <TableCell className="text-center">{invoice.price}</TableCell>
                  <TableCell className="text-right">
                    {Number(invoice.amount) * Number(invoice.price)}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
            <TableFooter>
              <TableRow>
                <TableCell colSpan={3} className="!text-center">
                  Total
                </TableCell>
                <TableCell className="text-right">
                  {row.original.total_amount}
                </TableCell>
              </TableRow>
            </TableFooter>
          </Table>
        </HoverCardContent>
      </HoverCard>
    </div>
  );
};
export default memo(HoverTableCard);
