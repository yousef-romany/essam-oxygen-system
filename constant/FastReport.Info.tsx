/* eslint-disable @typescript-eslint/no-explicit-any */
import db from "@/lib/db";

export const rangeFetchDataConstant = async (from: any, to: any) => {
  const query = `
  SELECT 
    t.id AS transaction_id, 
    t.transaction_type, 
    CAST(t.total_amount AS DOUBLE) AS total_amount, 
    CAST(t.remaining_amount AS DOUBLE) AS remaining_amount, 
    t.payment_status, 
    t.created_at, 
    COALESCE(c.name, 'غير محدد') AS customer_name, 
    COALESCE(s.name, 'غير محدد') AS supplier_name, 
    COALESCE(e.name, 'غير محدد') AS employee_name, 
    COALESCE(SUM(CAST(p.amount AS DOUBLE)), 0) AS total_paid_amount 
FROM transactions t 
LEFT JOIN customers c ON t.customer_id = c.id 
LEFT JOIN suppliers s ON t.supplier_id = s.id 
LEFT JOIN employees e ON t.employee_id = e.id 
LEFT JOIN payments p ON t.id = p.transaction_id 
WHERE DATE(t.created_at) BETWEEN '${from}' AND '${to}'
GROUP BY t.id 
ORDER BY t.created_at DESC;`;
  try {
    const rows = (await db).select(query);
    return rows;
  } catch (error) {
    console.log(error);
  }
};

export const monthFetchDataConstant = async (month: any) => {
  const query = `
  SELECT 
    t.id AS transaction_id, 
    t.transaction_type, 
    CAST(t.total_amount AS DOUBLE) AS total_amount, 
    CAST(t.remaining_amount AS DOUBLE) AS remaining_amount, 
    t.payment_status, 
    t.created_at, 
    COALESCE(c.name, 'غير محدد') AS customer_name, 
    COALESCE(s.name, 'غير محدد') AS supplier_name, 
    COALESCE(e.name, 'غير محدد') AS employee_name, 
    COALESCE(SUM(CAST(p.amount AS DOUBLE)), 0) AS total_paid_amount 
FROM transactions t 
LEFT JOIN customers c ON t.customer_id = c.id 
LEFT JOIN suppliers s ON t.supplier_id = s.id 
LEFT JOIN employees e ON t.employee_id = e.id 
LEFT JOIN payments p ON t.id = p.transaction_id 
WHERE DATE_FORMAT(t.created_at, '%Y-%m') = '${month}'
GROUP BY t.id 
ORDER BY t.created_at DESC;`;
  try {
    const rows = (await db).select(query);
    return rows;
  } catch (error) {
    console.log(error);
  }
};
export const dayFetchDataConstant = async (day: any) => {
  const query = `
        SELECT 
 t.id AS transaction_id, 
    t.transaction_type, 
    CAST(t.total_amount AS DOUBLE) AS total_amount, 
    CAST(t.remaining_amount AS DOUBLE) AS remaining_amount, 
    t.payment_status, 
    t.created_at, 
    -- بيانات العميل إن وجدت
    COALESCE(c.name, 'غير محدد') AS customer_name, 
    -- بيانات المورد إن وجدت
    COALESCE(s.name, 'غير محدد') AS supplier_name, 
    -- بيانات الموظف المرتبط بالمعاملة
    COALESCE(e.name, 'غير محدد') AS employee_name, 
    -- مجموع المدفوعات التي تمت على هذه المعاملة
    COALESCE(SUM(CAST(p.amount AS DOUBLE)), 0) AS total_paid_amount 
FROM transactions t
LEFT JOIN customers c ON t.customer_id = c.id
LEFT JOIN suppliers s ON t.supplier_id = s.id
LEFT JOIN employees e ON t.employee_id = e.id
LEFT JOIN payments p ON t.id = p.transaction_id

WHERE DATE(t.created_at) = '${day}'  -- فلترة حسب اليوم المحدد

GROUP BY t.id
ORDER BY t.created_at DESC;

          `;

  console.log("from back-End : ", day, query);
  try {
    const rows = (await db).select(query);
    return rows;
  } catch (error) {
    console.log(error);
  }
};
