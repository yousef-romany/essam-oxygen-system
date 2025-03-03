/* eslint-disable @typescript-eslint/no-explicit-any */
import { toast } from "@/hooks/use-toast";
import db from "@/lib/db";

export const fetchPermitsList = async () => {
  const rows = (await db).select(`
        SELECT 
            t.id, 
            t.transaction_type, 
            CAST(t.amount AS DOUBLE) AS amount,  -- ✅ تحويل DECIMAL إلى DOUBLE
            t.transaction_date, 
            t.reference, 
            t.related_entity_id, 
            re.entity_type, 
            re.entity_id,
            re.id AS relationsId, 
            COALESCE(c.name, s.name, em.name) AS supplier_or_client_or_employee_name  -- ✅ إضافة الموظفين
        FROM financial_transactions t 
        LEFT JOIN related_entities re ON t.related_entity_id = re.id
        LEFT JOIN customers c ON re.entity_type = 'customer' AND re.entity_id = c.id
        LEFT JOIN suppliers s ON re.entity_type = 'supplier' AND re.entity_id = s.id
        LEFT JOIN employees em ON re.entity_type = 'employee' AND re.entity_id = em.id  -- ✅ إضافة جدول الموظفين
        ORDER BY t.transaction_date DESC;
    `);
  return rows;
};

export const handleDeletePermits = async (id: number) => {
  (await db)
    .execute("DELETE FROM financial_transactions WHERE id = ?;", [id])
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