/* eslint-disable @typescript-eslint/no-explicit-any */
import { toast } from "@/hooks/use-toast";
import db from "@/lib/db";

export const fetchSuppliersList = async () => {
  const query = `
SELECT 
    c.id,
    c.name,
    c.phoneNumber,
    c.created_at,
    c.userId,
    COALESCE(i.name, 'غير متوفر') AS cylinder_name,

    CASE 
        WHEN 
            CAST(
                COALESCE(SUM(CASE 
                    WHEN t.transaction_type = 'بيع' AND ti.status = 'ممتلئ' THEN CAST(ti.quantity AS FLOAT)  
                    ELSE 0 
                END), 0) 
                - 
                COALESCE(SUM(CASE 
                    WHEN t.transaction_type = 'إرجاع' AND ti.status = 'فارغ' THEN CAST(ti.quantity AS FLOAT)  
                    ELSE 0 
                END), 0) 
            AS SIGNED
        ) > 0 THEN 'فارغ'
        ELSE 'ممتلئ'
    END AS cylinder_status,

    ABS(
        CAST(
            COALESCE(SUM(CASE 
                WHEN t.transaction_type = 'بيع' AND ti.status = 'ممتلئ' THEN CAST(ti.quantity AS FLOAT)  
                ELSE 0 
            END), 0) 
            - 
            COALESCE(SUM(CASE 
                WHEN t.transaction_type = 'إرجاع' AND ti.status = 'فارغ' THEN CAST(ti.quantity AS FLOAT)  
                ELSE 0 
            END), 0) 
            AS SIGNED
        )
    ) AS cylinder_amount,

    COALESCE(SUM(DISTINCT CAST(p.amount AS FLOAT)), 0) AS total_payments,
    COALESCE(SUM(DISTINCT CASE WHEN bt.transaction_type = 'withdrawal' THEN CAST(bt.amount AS FLOAT) ELSE 0 END), 0) AS total_withdrawals,
    COALESCE(SUM(DISTINCT CASE WHEN bt.transaction_type = 'deposit' THEN CAST(bt.amount AS FLOAT) ELSE 0 END), 0) AS total_deposits,
    COALESCE(SUM(DISTINCT CASE WHEN ft.transaction_type = 'expense' THEN CAST(ft.amount AS FLOAT) ELSE 0 END), 0) AS total_expenses,

    -- حساب الرصيد النهائي الصحيح
    (
        COALESCE(SUM(DISTINCT CAST(p.amount AS FLOAT)), 0) 
        + COALESCE(SUM(DISTINCT CASE WHEN bt.transaction_type = 'deposit' THEN CAST(bt.amount AS FLOAT) ELSE 0 END), 0)
    ) - (
        COALESCE(SUM(DISTINCT CASE WHEN t.transaction_type = 'بيع' THEN CAST(ti.quantity AS FLOAT) * CAST(ti.price AS FLOAT) ELSE 0 END), 0) 
        + COALESCE(SUM(DISTINCT CASE WHEN bt.transaction_type = 'withdrawal' THEN CAST(bt.amount AS FLOAT) ELSE 0 END), 0)
        + COALESCE(SUM(DISTINCT CASE WHEN ft.transaction_type = 'expense' THEN CAST(ft.amount AS FLOAT) ELSE 0 END), 0)
    ) AS final_balance

FROM suppliers c
LEFT JOIN transactions t ON c.id = t.supplier_id
LEFT JOIN transaction_items ti ON t.id = ti.transaction_id
LEFT JOIN payments p ON t.id = p.transaction_id
LEFT JOIN bank_transactions bt ON c.id = bt.related_entity_id
LEFT JOIN financial_transactions ft ON c.id = ft.related_entity_id AND ft.entity_type = 'supplier'
LEFT JOIN inventory i ON ti.inventory_id = i.id
GROUP BY c.id  -- إزالة i.id لمنع التكرار
ORDER BY cylinder_amount DESC, final_balance DESC;

  `;

  try {
    const rows: any[] = await (await db).select(query);

    console.log("Fetched rows:", rows);

    // ✅ تجميع البيانات بحيث تكون details مصفوفة داخل كل مورد
    const suppliersMap = new Map();

    rows.forEach((row: any) => {
      const {
        id,
        name,
        phoneNumber,
        created_at,
        userId,
        cylinder_name,
        cylinder_status,
        cylinder_amount,
        total_supplies,
        total_purchases,
        final_balance,
      } = row;

      if (!suppliersMap.has(id)) {
        suppliersMap.set(id, {
          id,
          name,
          phoneNumber,
          created_at,
          userId,
          total_supplies,
          total_purchases,
          final_balance,
          details: [],
        });
      } else {
        // ✅ إضافة القيم الجديدة إلى القيم السابقة
        const existingCustomer = suppliersMap.get(id);
        existingCustomer.total_purchases += total_purchases;
        existingCustomer.final_balance += final_balance;
      }

      suppliersMap.get(id).details.push({
        name: cylinder_name,
        status: cylinder_status,
        amount: cylinder_amount,
      });
    });

    const suppliersList = Array.from(suppliersMap.values());

    console.log("Fetched Suppliers: ", suppliersList);
    return suppliersList;
  } catch (error) {
    console.error("Database Error:", error);

    toast({
      variant: "destructive",
      title: "مشكلة",
      description: (error as string) || "حدث خطأ أثناء جلب البيانات",
    });

    return [];
  }
};

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
