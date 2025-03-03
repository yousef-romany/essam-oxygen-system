/* eslint-disable @typescript-eslint/no-explicit-any */
import { toast } from "@/hooks/use-toast";
import db from "@/lib/db";

export const fetchInventoryList = async () => {
  const rows = (await db).select("SELECT * FROM Inventory;");
  return rows;
};

export const handleDeleteInventory = async (id: number) => {
  (await db)
    .execute("DELETE FROM Inventory WHERE id = ?;", [id])
    .then(() => {
      toast({
        variant: "default",
        title: "تم 🔐",
        description: "تم حذف",
      });
    })
    .catch((error: any) => {
      toast({
        variant: "destructive",
        title: "خطئ",
        description: `حدث خطئ فى استقبال البيانات ${error}`,
      });
    });
};
