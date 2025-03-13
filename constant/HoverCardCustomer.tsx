/* eslint-disable @typescript-eslint/no-explicit-any */
import { Badge } from "@/components/ui/badge";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { cn } from "@/lib/utils";
import { memo } from "react";

const HoverCardCustomer = ({ row, typeCall }: any) => {
  return (
    <div>
      <HoverCard>
        <HoverCardTrigger
          className={cn(
            "border-b-2",
            row.original.details.filter(
              (element: any) => Number(element.amount) !== 0
            ).length > 0
              ? "!text-red-600"
              : null
          )}
        >
          {row.original.details.filter(
            (element: any) => Number(element.amount) !== 0
          ).length > 0 ? (
            <Badge variant={"destructive"}>
              {
                row.original.details?.filter(
                  (element: any) => Number(element.amount) !== 0
                ).length
              }
            </Badge>
          ) : (
            "تفاصيل"
          )}
        </HoverCardTrigger>
        <HoverCardContent className="min-w-[260px] w-full">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="text-center">اسم صنف</TableHead>
                <TableHead className="text-center">عدد</TableHead>
                <TableHead className="text-center">نوع</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {row.original?.details.length ? (
                row.original?.details
                  ?.filter((element: any) => Number(element.amount) !== 0)
                  ?.map((invoice: any, key: number) => (
                    <TableRow key={key}>
                      <TableCell className="text-center">
                        {invoice.name}
                      </TableCell>
                      <TableCell className="text-center">
                        {invoice.amount}
                        {invoice.status == "ممتلئ" && typeCall == "customer" ? "-" : null}
                      </TableCell>
                      <TableCell className={cn("text-center")}>
                        {invoice.status}
                      </TableCell>
                    </TableRow>
                  ))
              ) : (
                <TableRow>
                  <TableCell colSpan={4}>لايوجد</TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </HoverCardContent>
      </HoverCard>
    </div>
  );
};

export default memo(HoverCardCustomer);
