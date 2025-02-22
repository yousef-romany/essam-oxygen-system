// "use client";
// import {
//   ColumnFiltersState,
//   SortingState,
//   Table,
//   VisibilityState,
//   getCoreRowModel,
//   getFilteredRowModel,
//   getPaginationRowModel,
//   getSortedRowModel,
//   useReactTable,
// } from "@tanstack/react-table";

// import { Button } from "@/components/ui/button";
// import {
//   DropdownMenu,
//   DropdownMenuCheckboxItem,
//   DropdownMenuContent,
//   DropdownMenuTrigger,
// } from "@/components/ui/dropdown-menu";
// import {
//   Card,
//   CardContent,
//   CardDescription,
//   CardHeader,
//   CardTitle,
// } from "@/components/ui/card";
// import { IoChevronDownCircleOutline } from "react-icons/io5";
// import { memo, useState } from "react";
// import CustomTable from "@/components/CostumTable/CustomTable";
// import { Input } from "@/components/ui/input";
// import Loading from "@/components/layout/Loading";
// import ErrorComponent from "@/components/layout/ErrorComponent";
// import { useRouter } from "next/navigation";
// import { useQuery } from "@tanstack/react-query";
// import { fetchListBridgePoint, FormValuesBridagePoint, columns } from "@/constant/bridgePoint";

// const ListProcess = () => {
//   const [sorting, setSorting] = useState<SortingState>([]);
//   const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
//   const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
//   const [rowSelection, setRowSelection] = useState({});
//   const [pagination, setPagination] = useState({
//     pageIndex: 0, //initial page index
//     pageSize: 5, //default page size
//   });

//   const route = useRouter();
//   const { isLoading, isError, data, error }: any = useQuery({
//     queryKey: ["fetchListBridgePoint"],
//     queryFn: fetchListBridgePoint,
//     refetchInterval: 2000,
//   });

//   const table: Table<FormValuesBridagePoint> = useReactTable({
//     data,
//     columns,
//     onSortingChange: setSorting,
//     onColumnFiltersChange: setColumnFilters,
//     getCoreRowModel: getCoreRowModel(),
//     getPaginationRowModel: getPaginationRowModel(),
//     getSortedRowModel: getSortedRowModel(),
//     getFilteredRowModel: getFilteredRowModel(),
//     onColumnVisibilityChange: setColumnVisibility,
//     onRowSelectionChange: setRowSelection,
//     onPaginationChange: setPagination,
//     state: {
//       sorting,
//       columnFilters,
//       columnVisibility,
//       rowSelection,
//       pagination,
//     },
//   });

//   if (isLoading) {
//     return <Loading />;
//   }
//   if (isError) {
//     return <ErrorComponent onRetry={() => route.push("/users")} />;
//   }
//   if (error) {
//     return (
//       <div className="text-red-500 text-center">
//         Error: {error.message || "An error occurred"}
//       </div>
//     );
//   }

//   return (
//         <Card className="!w-full">
//           <CardHeader>
//             <CardTitle className="text-xl">ألاصناف</CardTitle>
//             <CardDescription className="text-lg">
//               عرض وإدارة أصناف في النظام الخاص بك.
//             </CardDescription>
//             <div className="flex justify-between items-center">
//               <DropdownMenu>
//                 <DropdownMenuTrigger asChild>
//                   <Button variant="outline" className="ml-auto flex gap-2">
//                     الاعمده{" "}
//                     <IoChevronDownCircleOutline className="ml-2 h-4 w-4" />
//                   </Button>
//                 </DropdownMenuTrigger>
//                 <DropdownMenuContent align="end">
//                   {table
//                     .getAllColumns()
//                     .filter((column) => column.getCanHide())
//                     .map((column) => {
//                       return (
//                         <DropdownMenuCheckboxItem
//                           key={column.id}
//                           className="capitalize"
//                           checked={column.getIsVisible()}
//                           onCheckedChange={(value) =>
//                             column.toggleVisibility(!!value)
//                           }
//                         >
//                           {column.id == "invokeNumber"
//                             ? "رقم البوليصه "
//                             : column.id == "taxs"
//                             ? " تكاليف"
//                             : column.id == "total"
//                             ? "صافى ربح"
//                             : column.id == "sourceName"
//                             ? "أسم مورد"
//                             : column.id == "clientName"
//                             ? "أسم عميل"
//                             : column.id == "date"
//                             ? "تاريخ"
//                             : column.id == "driverName"
//                             ? "اسم سائق"
//                             : column.id == "carNumber"
//                             ? "رقم السياره"
//                             : null }
//                         </DropdownMenuCheckboxItem>
//                       );
//                     })}
//                 </DropdownMenuContent>
//               </DropdownMenu>
//             </div>
//           </CardHeader>
//           <CardContent>
//             <div className="w-full">
//               <div className="flex items-center py-4">
//                 <Input
//                   placeholder=" أبحث أسم صنف..."
//                   value={
//                     (table.getColumn("invokeNumber")?.getFilterValue() as string) ?? ""
//                   }
//                   onChange={(event) =>
//                     table.getColumn("invokeNumber")?.setFilterValue(event.target.value)
//                   }
//                   className="max-w-sm"
//                 />
//               </div>
//               <CustomTable table={table} columns={columns} />
//             </div>
//           </CardContent>
//         </Card>
//   );
// }
// export default memo(ListProcess)