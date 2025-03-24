/* eslint-disable @typescript-eslint/no-explicit-any */
import db from "@/lib/db";

export const rangeFetchDataConstant = async (from: any, to: any) => {
  const queryTransactions = `
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

  const queryPermits = `
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
WHERE DATE(t.transaction_date) BETWEEN '${from}' AND '${to}'
ORDER BY ft.transaction_date DESC;
;

          `;

  const queryBanks = `
        SELECT 
    bt.id AS transaction_id,
    bt.documentNumber,
    b.bank_name,
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

  const queryBridgePoint = `
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
WHERE DATE(i.date) BETWEEN '${from}' AND '${to}'
ORDER BY i.date DESC;


          `;
  try {
    const rows = await (await db).select(queryTransactions);
    const rowQueryPermits = await (await db).select(queryPermits);
    const rowQueryBanks = await (await db).select(queryBanks);
    const rowQueryBridgePoint = await (await db).select(queryBridgePoint);

    return [
      rows ?? [],
      rowQueryPermits ?? [],
      rowQueryBanks ?? [],
      rowQueryBridgePoint ?? [],
    ];
  } catch (error) {
    console.log(error);
  }
};

export const monthFetchDataConstant = async (month: any) => {
  const queryTransactions = `
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

        WHERE DATE_FORMAT(t.created_at, '%Y-%m') = '${month}'

        GROUP BY t.id
        ORDER BY t.created_at DESC;

          `;

  const queryPermits = `
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
  WHERE DATE_FORMAT(ft.transaction_date, '%Y-%m') = '${month}'
  ORDER BY ft.transaction_date DESC;

          `;

  const queryBanks = `
        SELECT 
    bt.id AS transaction_id,
    bt.documentNumber,
    b.bank_name,
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
WHERE DATE_FORMAT(bt.transaction_date, '%Y-%m') = '${month}'
ORDER BY bt.transaction_date DESC;

          `;

  const queryBridgePoint = `
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
WHERE DATE_FORMAT(i.date, '%Y-%m') = '${month}'
ORDER BY i.date DESC;


          `;
  try {
    const rows = await (await db).select(queryTransactions);
    const rowQueryPermits = await (await db).select(queryPermits);
    const rowQueryBanks = await (await db).select(queryBanks);
    const rowQueryBridgePoint = await (await db).select(queryBridgePoint);

    return [
      rows ?? [],
      rowQueryPermits ?? [],
      rowQueryBanks ?? [],
      rowQueryBridgePoint ?? [],
    ];
  } catch (error) {
    console.log(error);
  }
};
// export const dayFetchDataConstant = async (day: any) => {
  

//   const queryPermits = `
//         SELECT 
//     ft.id AS transaction_id,
//     ft.transaction_type,
//     ft.amount,
//     ft.transaction_date,
//     ft.reference,
//     re.entity_type,
//     CASE 
//         WHEN re.entity_type = 'customer' THEN c.name
//         WHEN re.entity_type = 'supplier' THEN s.name
//         WHEN re.entity_type = 'employee' THEN e.name
//         ELSE 'Unknown'
//     END AS entity_name,
//     u.username AS processed_by
// FROM financial_transactions ft
// LEFT JOIN related_entities re ON ft.related_entity_id = re.id
// LEFT JOIN customers c ON (re.entity_type = 'customer' AND re.entity_id = c.id)
// LEFT JOIN suppliers s ON (re.entity_type = 'supplier' AND re.entity_id = s.id)
// LEFT JOIN employees e ON (re.entity_type = 'employee' AND re.entity_id = e.id)
// LEFT JOIN users u ON ft.userId = u.id
// WHERE DATE(ft.transaction_date) = '${day}'
// ORDER BY ft.transaction_date DESC;

//           `;

//   const queryBanks = `
//         SELECT 
//     bt.id AS transaction_id,
//     bt.documentNumber,
//     b.bank_name,
//     bt.amount,
//     bt.transaction_type,
//     bt.created_at AS transaction_date,
//     bt.reference,
//     re.entity_type,
//     CASE 
//         WHEN re.entity_type = 'customer' THEN c.name
//         WHEN re.entity_type = 'supplier' THEN s.name
//         ELSE 'Unknown'
//     END AS entity_name
// FROM bank_transactions bt
// JOIN banks b ON bt.bank_id = b.id
// LEFT JOIN related_entities re ON bt.related_entity_id = re.id
// LEFT JOIN customers c ON re.entity_id = c.id AND re.entity_type = 'customer'
// LEFT JOIN suppliers s ON re.entity_id = s.id AND re.entity_type = 'supplier'
// WHERE DATE(bt.created_at) = '${day}'
// ORDER BY bt.created_at DESC;

//           `;

//   const queryBridgePoint = `
//         SELECT 
//     i.id AS invoke_id,
//     i.invokeNumber,
//     i.total,
//     i.taxs,
//     i.carNumber,
//     i.driverName,
//     i.date,
//     i.statusSource,
//     i.statusClient,
//     CASE 
//         WHEN c.id IS NOT NULL THEN 'customer'
//         WHEN s.id IS NOT NULL THEN 'supplier'
//         ELSE 'unknown'
//     END AS entity_type,
//     COALESCE(c.name, s.name, 'غير معروف') AS entity_name
// FROM invokesbridgepoint i
// LEFT JOIN customers c ON i.clientId = c.id
// LEFT JOIN suppliers s ON i.clientId = s.id
// WHERE DATE(i.date) = '${day}'
// ORDER BY i.date DESC;
//           `;

//   try {
//     // const rowsTestTest = await (await db).select(queryTransactions);
//     // console.log("Transactions Data:", rowsTestTest);
  
//     const rowQueryPermits = await (await db).select(queryPermits);
//     console.log("Permits Data:", rowQueryPermits);
  
//     const rowQueryBanks = await (await db).select(queryBanks);
//     console.log("Bank Transactions Data:", rowQueryBanks);
  
//     const rowQueryBridgePoint = await (await db).select(queryBridgePoint);
//     console.log("Bridge Point Data:", rowQueryBridgePoint);

//     // console.log(rowsTestTest);

//     return [
//       [],
//       // rowQueryPermits || [],
//       [],
//       [],
//       [],
//       // rowQueryBanks || [],
//       // rowQueryBridgePoint || [],
//     ];
//   } catch (error) {
//     console.log(error);
//   }
// };


// export const dayFetchDataTransactions = async (day: any) => {
//   const queryTransactions = `
//         SELECT 
//         t.id AS transaction_id, 
//             t.transaction_type, 
//             CAST(t.total_amount AS DOUBLE) AS total_amount, 
//             CAST(t.remaining_amount AS DOUBLE) AS remaining_amount, 
//             t.payment_status, 
//             t.created_at, 
//             -- بيانات العميل إن وجدت
//             COALESCE(c.name, 'غير محدد') AS customer_name, 
//             -- بيانات المورد إن وجدت
//             COALESCE(s.name, 'غير محدد') AS supplier_name, 
//             -- بيانات الموظف المرتبط بالمعاملة
//             COALESCE(e.name, 'غير محدد') AS employee_name, 
//             -- مجموع المدفوعات التي تمت على هذه المعاملة
//             COALESCE(SUM(CAST(p.amount AS DOUBLE)), 0) AS total_paid_amount 
//         FROM transactions t
//         LEFT JOIN customers c ON t.customer_id = c.id
//         LEFT JOIN suppliers s ON t.supplier_id = s.id
//         LEFT JOIN employees e ON t.employee_id = e.id
//         LEFT JOIN payments p ON t.id = p.transaction_id

//         WHERE DATE(t.created_at) = '${day}'  -- فلترة حسب اليوم المحدد

//         GROUP BY t.id
//         ORDER BY t.created_at DESC;
//           `;
//   try {
//     const rows = await (await db).select(queryTransactions);
//     console.log("Transactions Data:", rows);
//     console.log(queryTransactions)

//     return rows
//   } catch (error) {
//     console.log(error);
//   }
// }