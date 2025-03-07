/* eslint-disable @typescript-eslint/no-explicit-any */
// import ShowInvokesBridgePoint from "@/app/(dashboardLayout)/bridgePoint/components/ShowInvokesBridgePoint";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { toast } from "@/hooks/use-toast";
import db from "@/lib/db";
import { CaretSortIcon, DotsHorizontalIcon } from "@radix-ui/react-icons";
import { ColumnDef } from "@tanstack/react-table";

/*
1- name client => clientName
2- name source => sourceName
3- date => date
4- catagory name => catagoryName
5- catagory price => catagoryPrice
6- catagory quantity => catagoryQuantity
7- catagory total => catagoryTotal
8- number invoke => invokeNumber
9- name driver => driverName
10- number car => carNumber
*/
export interface FormValuesBridagePoint {
  clientName: string;
  sourceName: string;
  date: string;
  catagoryName?: string;
  catagoryPrice?: string;
  catagoryQuantity?: string;
  catagoryTotal?: string;
  invokeNumber: string;
  driverName: string;
  carNumber: string;
  products?: any[];
  taxs: number;
}
export const fetchListBridgePoint = async () => {
  const row = (await db).select(`
SELECT invokesbridgepoint.*, IF(invokesbridgepoint.clientId = 0, "مجهول",customers.name) AS clientName, IF(invokesbridgepoint.sourceId = 0, "مجهول", suppliers.name ) AS sourceName FROM invokesbridgepoint

 LEFT JOIN customers
 ON invokesbridgepoint.clientId = customers.id


 LEFT JOIN suppliers
 ON invokesbridgepoint.sourceId = suppliers.id;
    `);
  return row;
};

export const columns: ColumnDef<FormValuesBridagePoint>[] = [
  {
    accessorKey: "id",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="text-center"
        >
          <CaretSortIcon className="ml-2 h-4 w-4" />
          ID
        </Button>
      );
    },
    cell: ({ row }) => (
      <div className="lowercase text-center">{row.getValue("id")}</div>
    ),
  },
  {
    accessorKey: "clientName",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="text-center"
        >
          أسم عميل
          <CaretSortIcon className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => (
      <div className="lowercase text-center">{row.getValue("clientName")}</div>
    ),
  },
  {
    accessorKey: "sourceName",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="text-center"
        >
          اسم مورد
          <CaretSortIcon className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => (
      <div className="lowercase text-center">{row.getValue("sourceName")}</div>
    ),
  },
  {
    accessorKey: "taxs",
    header: "تكاليف",
    cell: ({ row }) => {
      return <h1>{row.getValue("taxs")}</h1>;
    },
  },

  {
    accessorKey: "invokeNumber",
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        className="text-center"
      >
        رقم البوليصه
        <CaretSortIcon className="ml-2 h-4 w-4" />
      </Button>
    ),
    cell: ({ row }) => {
      return (
        <div className="capitalize text-center">
          {row.getValue("invokeNumber")}
        </div>
      );
    },
    
    filterFn: "equals",
  },
  {
    accessorKey: "driverName",
    header: () => <div className="capitalize text-center">اسم السائق</div>,
    cell: ({ row }) => {
      return (
        <div className="capitalize text-center">
          {row.getValue("driverName")}
        </div>
      );
    },
  },
  {
    accessorKey: "carNumber",
    header: () => <div className="capitalize text-center">رقم السياره</div>,
    cell: ({ row }) => {
      return (
        <div className="capitalize text-center">
          {row.getValue("carNumber")}
        </div>
      );
    },
  },
  {
    accessorKey: "total",
    header: () => <div className="capitalize text-center">صافى ربح</div>,
    cell: ({ row }) => {
      return (
        <div className="capitalize text-center">
          {row.getValue("total")}
        </div>
      );
    },
  },
  {
    accessorKey: "date",
    header: () => <div className="capitalize text-center">تاريخ</div>,
    cell: ({ row }) => {
      return (
        <div className="capitalize text-center">
          {String(row.getValue("date"))?.replace("T", " ")}
        </div>
      );
    },
  },
  {
    accessorKey: "products",
    header: () => <div className="capitalize text-center">تاريخ</div>,
    cell: ({ row }) => {
      return (
        <div className="capitalize text-center">
          {String(row.getValue("date"))?.replace("T", " ")}
        </div>
      );
    },
  },
  {
    id: "actions",
    enableHiding: false,
    cell: ({ row }) => {
      const data: any = row.original;
      const deleteRole = localStorage.getItem("delete");
      return (
        <DropdownMenu dir="rtl">
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Open menu</span>
              <DotsHorizontalIcon className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start">
            <DropdownMenuLabel>أحداث</DropdownMenuLabel>

            {/* <ShowInvokesBridgePoint idInvoke={data?.id} taxs={data?.taxs} /> */}

            <DropdownMenuSeparator />
            <Button
              className="w-full"
              variant={"destructive"}
              onClick={() => handleDeleteBridgePoint(data?.id)}
              disabled={deleteRole == "false" ? true : false}
            >
              حذف
            </Button>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];

const handleDeleteBridgePoint = async (id: number) => {
  (await db)
  .execute("DELETE FROM invokesbridgepoint WHERE id = ?;", [id])
  .then(() => {
    toast({
      variant: "default",
      title: "تم 🔐",
      description: "تم حذف",
    });
  })
  .catch((error: any) => {
    console.log(error);
    if (
      error.trim() ==
      "error returned from database: 1451 (23000): Cannot delete or update a parent row: a foreign key constraint fails (`monkanastasy`.`buy_sale`, CONSTRAINT `fk_child_to_parent` FOREIGN KEY (`idCatagory`) REFERENCES `catagorys` (`id`) ON UPDATE CASCADE)".trim()
    ) {
      toast({
        variant: "destructive",
        title: "خطئ",
        description: "لا يمكن حذف هذا العنصر لان هذا العنصر مستخدم فى فواتير",
      });
    } else {
      toast({
        variant: "destructive",
        title: "خطئ",
        description: error,
      });
    }
  });
}

export const fetchInvokeDetailsOneBridgePoint = async (id: number) => {
  const row = (await db).select(`
  SELECT * FROM productsbridgepoint WHERE idInvoke = ?
  `, [id]);
  return row;
} 