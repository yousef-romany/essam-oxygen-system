/* eslint-disable @typescript-eslint/no-explicit-any */
import { toast } from "@/hooks/use-toast";
import db from "@/lib/db";

export const fetchEmployeesList = async () => {
  try {
    const rows = (await db).select(`SELECT 
    e.*,

    -- إجمالي المصاريف
    COALESCE(SUM(CASE 
        WHEN ft.transaction_type = 'expense' THEN CAST(ft.amount AS DOUBLE) 
        ELSE 0 
    END), 0) AS total_expenses,

    -- إجمالي الخدمات
    COALESCE(SUM(CASE 
        WHEN ft.transaction_type = 'service' THEN CAST(ft.amount AS DOUBLE) 
        ELSE 0 
    END), 0) AS total_services,

    -- إجمالي الإمدادات
    COALESCE(SUM(CASE 
        WHEN ft.transaction_type = 'supply' THEN CAST(ft.amount AS DOUBLE) 
        ELSE 0 
    END), 0) AS total_supplies,

    -- المبالغ المعلقة (باستخدام استعلام فرعي لتجنب التكرار)
    (
        SELECT COALESCE(SUM(CAST(t.paymentEmployee AS DOUBLE)), 0)
        FROM transactions t
        WHERE t.employee_id = e.id
    ) AS pending_payments,

    -- إجمالي المستحقات = الخدمات + الإمدادات + المدفوعات المعلقة
    (
        COALESCE(SUM(CASE 
            WHEN ft.transaction_type = 'service' THEN CAST(ft.amount AS DOUBLE) 
            ELSE 0 
        END), 0) 
        +
        COALESCE(SUM(CASE 
            WHEN ft.transaction_type = 'supply' THEN CAST(ft.amount AS DOUBLE) 
            ELSE 0 
        END), 0) 
        +
        (
            SELECT COALESCE(SUM(CAST(t.paymentEmployee AS DOUBLE)), 0)
            FROM transactions t
            WHERE t.employee_id = e.id
        )
    ) AS total_due,

    -- الرصيد النهائي = المستحقات - المصاريف
    (
        (
            COALESCE(SUM(CASE 
                WHEN ft.transaction_type = 'service' THEN CAST(ft.amount AS DOUBLE) 
                ELSE 0 
            END), 0) 
            +
            COALESCE(SUM(CASE 
                WHEN ft.transaction_type = 'supply' THEN CAST(ft.amount AS DOUBLE) 
                ELSE 0 
            END), 0) 
            +
            (
                SELECT COALESCE(SUM(CAST(t.paymentEmployee AS DOUBLE)), 0)
                FROM transactions t
                WHERE t.employee_id = e.id
            )
        ) 
        - 
        COALESCE(SUM(CASE 
            WHEN ft.transaction_type = 'expense' THEN CAST(ft.amount AS DOUBLE) 
            ELSE 0 
        END), 0)
    ) AS final_balance

FROM employees e

-- ربط جدول "financial_transactions"
LEFT JOIN related_entities re 
    ON e.id = re.entity_id 
    AND re.entity_type = 'employee'

LEFT JOIN financial_transactions ft 
    ON re.id = ft.related_entity_id 
    AND ft.entity_type = 'employee'

-- تجميع البيانات لكل موظف
GROUP BY e.id 

-- ترتيب حسب الرصيد النهائي
ORDER BY final_balance DESC;
`);
    return rows;
  } catch (error) {
    console.log(error);
    return [];
  }
};

export const handleDeleteEmployees = async (id: number) => {
  (await db)
    .execute("DELETE FROM employees WHERE id = ?;", [id])
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
