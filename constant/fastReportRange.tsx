import db from "@/lib/db";

export const fetchMonthDataTransactionsRange = async (from: any, to: any) => {
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

        WHERE DATE(t.created_at) BETWEEN '${from}' AND '${to}'

        GROUP BY t.id
        ORDER BY t.created_at DESC;
            `;
    try {
      const rows = await (await db).select(query);
      console.log("Transactions Data:", rows);
      console.log(query)
  
      return rows
    } catch (error) {
      console.log(error);
    }
  }

export const fetchMonthDataPermitsRange = async (from: any, to: any) => {
    const query = `
          SELECT 
    ft.id AS transaction_id,
    ft.transaction_type,
    ft.amount,
    ft.transaction_date,
    ft.reference,
    re.entity_type,
    CASE 
        WHEN re.entity_type = 'customer' THEN c.name
        WHEN re.entity_type = 'supplier' THEN s.name
        WHEN re.entity_type = 'employee' THEN e.name
        ELSE 'Unknown'
    END AS entity_name,
    u.username AS processed_by
FROM financial_transactions ft
LEFT JOIN related_entities re ON ft.related_entity_id = re.id
LEFT JOIN customers c ON (re.entity_type = 'customer' AND re.entity_id = c.id)
LEFT JOIN suppliers s ON (re.entity_type = 'supplier' AND re.entity_id = s.id)
LEFT JOIN employees e ON (re.entity_type = 'employee' AND re.entity_id = e.id)
LEFT JOIN users u ON ft.userId = u.id
WHERE DATE(ft.transaction_date) BETWEEN '${from}' AND '${to}'
ORDER BY ft.transaction_date DESC;
;
          `;
    try {
      const rows = await (await db).select(query);
      console.log("Transactions Data:", rows);
      console.log(query)
  
      return rows
    } catch (error) {
      console.log(error);
    }
  }

export const fetchMonthDataBanksRange = async (from: any, to: any) => {
    const query = `
       SELECT 
    bt.id AS transaction_id,
    bt.documentNumber,
    b.bank_name,
    b.account_number,
    bt.amount,
    bt.transaction_type,
    bt.transaction_date,
    bt.reference,
    re.entity_type,
    CASE 
        WHEN re.entity_type = 'customer' THEN c.name
        WHEN re.entity_type = 'supplier' THEN s.name
        ELSE 'Unknown'
    END AS entity_name
FROM bank_transactions bt
JOIN banks b ON bt.bank_id = b.id
LEFT JOIN related_entities re ON bt.related_entity_id = re.id
LEFT JOIN customers c ON re.entity_id = c.id AND re.entity_type = 'customer'
LEFT JOIN suppliers s ON re.entity_id = s.id AND re.entity_type = 'supplier'
WHERE DATE(bt.transaction_date) BETWEEN '${from}' AND '${to}'
ORDER BY bt.transaction_date DESC;
   `;
    try {
      const rows = await (await db).select(query);
      console.log("Transactions Data:", rows);
      console.log(query)
  
      return rows
    } catch (error) {
      console.log(error);
    }
  }

export const fetchMonthDataBridgePointRange = async (from: any, to: any) => {
    const query = `
       SELECT 
    i.id AS invoke_id,
    i.invokeNumber,
    i.total,
    i.taxs,
    i.carNumber,
    i.driverName,
    i.date,
    i.statusSource,
    i.statusClient,
    CASE 
        WHEN c.id IS NOT NULL THEN 'customer'
        WHEN s.id IS NOT NULL THEN 'supplier'
        ELSE 'unknown'
    END AS entity_type,
    COALESCE(c.name, s.name, 'غير معروف') AS entity_name
FROM invokesbridgepoint i
LEFT JOIN customers c ON i.clientId = c.id
LEFT JOIN suppliers s ON i.clientId = s.id
WHERE FROM_UNIXTIME(i.date) BETWEEN '${from}' AND '${to}'
ORDER BY i.date DESC;
   `;
    try {
      const rows = await (await db).select(query);
      console.log("Transactions Data:", rows);
      console.log(query)
  
      return rows
    } catch (error) {
      console.log(error);
    }
  }



