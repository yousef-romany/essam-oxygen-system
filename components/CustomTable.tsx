/* eslint-disable @typescript-eslint/no-explicit-any */
"use client"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "./ui/button";
import {
  ColumnDef,
  flexRender,
  Table as TableType,
} from "@tanstack/react-table";

interface dataTypeProps {
  table: TableType<any>;
  columns: ColumnDef<any>[];
}

const CustomTable = ({ table, columns }: dataTypeProps) => {
  if (!table) {
    return <div>Loading...</div>; // or any loading indicator
  }
  return (
    <>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            {table?.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup?.id}>
                {headerGroup?.headers.map((header) => {
                  return (
                    <TableHead key={header?.id} className="text-center">
                      {header?.isPlaceholder
                        ? null
                        : flexRender(
                            header?.column.columnDef.header,
                            header?.getContext()
                          )}
                    </TableHead>
                  );
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table?.getRowModel?.()?.rows?.length ? (
              table?.getRowModel()?.rows.map((row) => (
                <TableRow
                  key={row?.id}
                  data-state={row?.getIsSelected() && "selected"}
                >
                  {row?.getVisibleCells().map((cell) => (
                    <TableCell key={cell?.id} className="text-center">
                      {flexRender(
                        cell?.column.columnDef.cell,
                        cell?.getContext()
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  لا يوجد نتائج .
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <div className="flex items-center justify-end space-x-2 py-4">
        <div className="flex-1 text-sm text-muted-foreground">
          أجمالى الصفوف {table?.getFilteredRowModel().rows.length} .
        </div>
        <div className="gap-2 flex">
          <Button
            variant="outline"
            size="sm"
            onClick={() => table?.nextPage()}
            disabled={!table?.getCanNextPage()}
          >
            التالى
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => table?.previousPage()}
            disabled={!table?.getCanPreviousPage()}
          >
            السابق
          </Button>
        </div>
      </div>
    </>
  );
};
export default CustomTable;
