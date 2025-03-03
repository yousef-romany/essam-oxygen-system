/* eslint-disable @typescript-eslint/no-explicit-any */
import { toast } from "@/hooks/use-toast";
import db from "@/lib/db";

export const fetchSuppliersList = async () => {
    const rows = (await db).select("SELECT * FROM suppliers;");
  return rows;
}


export const handleDeleteSuppliers = async (id: number) => {
  (await db)
    .execute("DELETE FROM suppliers WHERE id = ?;", [id])
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