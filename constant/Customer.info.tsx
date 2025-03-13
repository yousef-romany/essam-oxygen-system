/* eslint-disable @typescript-eslint/no-explicit-any */
import { toast } from "@/hooks/use-toast";
import db from "@/lib/db";

export const fetchCustomersList = async () => {
  const query = `
  SELECT 
    c.id,
    c.name,
    c.phoneNumber,
    c.created_at,
    c.userId,
    COALESCE(i.name, 'غير متوفر') AS cylinder_name,

    -- تحديد حالة الأسطوانة بناءً على العمليات
    CASE 
        WHEN 
            CAST(
                COALESCE(SUM(DISTINCT CASE 
                    WHEN t.transaction_type = 'بيع' AND ti.status = 'ممتلئ' THEN ti.quantity  
                    ELSE 0 
                END), 0) 
                - 
                COALESCE(SUM(DISTINCT CASE 
                    WHEN t.transaction_type = 'إرجاع' AND ti.status = 'فارغ' THEN ti.quantity  
                    ELSE 0 
                END), 0) 
            AS SIGNED
        ) > 0 THEN 'فارغ'
        ELSE 'ممتلئ'
    END AS cylinder_status,

    ABS(
        CAST(
            COALESCE(SUM(DISTINCT CASE 
                WHEN t.transaction_type = 'بيع' AND ti.status = 'ممتلئ' THEN ti.quantity  
                ELSE 0 
            END), 0) 
            - 
            COALESCE(SUM(DISTINCT CASE 
                WHEN t.transaction_type = 'إرجاع' AND ti.status = 'فارغ' THEN ti.quantity  
                ELSE 0 
            END), 0) 
            AS SIGNED
        )
    ) AS cylinder_amount,

    -- إجمالي المدفوعات المستلمة من العميل
    COALESCE(SUM(DISTINCT CAST(p.amount AS DOUBLE)), 0) AS total_payments,

    -- إجمالي السحوبات المتعلقة بالعميل
    COALESCE(SUM(DISTINCT CASE 
        WHEN bt.transaction_type = 'withdrawal' THEN CAST(bt.amount AS DOUBLE)
        ELSE 0 
    END), 0) AS total_withdrawals,

    -- إجمالي الإيداعات المتعلقة بالعميل
    COALESCE(SUM(DISTINCT CASE 
        WHEN bt.transaction_type = 'deposit' THEN CAST(bt.amount AS DOUBLE)
        ELSE 0 
    END), 0) AS total_deposits,

    -- إجمالي المصاريف المتعلقة بالعميل
    COALESCE(SUM(DISTINCT CASE 
        WHEN ft.transaction_type = 'expense' THEN CAST(ft.amount AS DOUBLE)
        ELSE 0 
    END), 0) AS total_expenses,

    -- حساب الرصيد النهائي الصحيح
    (
        -- المبالغ المستلمة (المدفوعات + الإيداعات)
        COALESCE(SUM(DISTINCT CAST(p.amount AS DOUBLE)), 0) 
        + COALESCE(SUM(DISTINCT CASE WHEN bt.transaction_type = 'deposit' THEN CAST(bt.amount AS DOUBLE) ELSE 0 END), 0)
    ) - (
        -- التكاليف (مبيعات + سحوبات + المصاريف)
        COALESCE(SUM(DISTINCT CASE WHEN t.transaction_type = 'بيع' THEN CAST(ti.quantity * ti.price AS DOUBLE) ELSE 0 END), 0) 
        + COALESCE(SUM(DISTINCT CASE WHEN bt.transaction_type = 'withdrawal' THEN CAST(bt.amount AS DOUBLE) ELSE 0 END), 0)
        + COALESCE(SUM(DISTINCT CASE WHEN ft.transaction_type = 'expense' THEN CAST(ft.amount AS DOUBLE) ELSE 0 END), 0)
    ) AS final_balance

FROM customers c
LEFT JOIN transactions t ON c.id = t.customer_id
LEFT JOIN transaction_items ti ON t.id = ti.transaction_id
LEFT JOIN payments p ON t.id = p.transaction_id
LEFT JOIN bank_transactions bt ON c.id = bt.related_entity_id
LEFT JOIN financial_transactions ft ON c.id = ft.related_entity_id AND ft.entity_type = 'customer'
LEFT JOIN inventory i ON ti.inventory_id = i.id

-- تجميع البيانات حسب العميل فقط، مع التأكد من عدم تكرار الحسابات المالية
GROUP BY c.id 
ORDER BY cylinder_amount DESC, final_balance DESC;

  `;

  try {
    const rows: any[] = await (await db).select(query);

    // تجميع البيانات بحيث تكون details مصفوفة داخل كل عميل
    const customersMap = new Map();

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
        total_purchases,
        final_balance,
      } = row;

      if (!customersMap.has(id)) {
        customersMap.set(id, {
          id,
          name,
          phoneNumber,
          created_at,
          userId,
          total_purchases,
          final_balance,
          details: [],
        });
      } else {
        // ✅ إضافة القيم الجديدة إلى القيم السابقة
        const existingCustomer = customersMap.get(id);
        existingCustomer.total_purchases += Number(total_purchases);
        existingCustomer.final_balance += Number(final_balance);
      }

      if (cylinder_name && cylinder_name !== "غير متوفر") {
        customersMap.get(id).details.push({
          name: cylinder_name,
          status: cylinder_status,
          amount: cylinder_amount,
        });
      }
    });

    const result = Array.from(customersMap.values());

    console.log("Fetched Customers: ", result);
    return result;
  } catch (error) {
    console.log(error);
    toast({
      variant: "destructive",
      title: "مشكله",
      description: error as string,
    });
    return [];
  }
};

export const handleDeleteCustomers = async (id: number) => {
  (await db)
    .execute("DELETE FROM customers WHERE id = ?;", [id])
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
