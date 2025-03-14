import db from "@/lib/db";

export const fetchMoneyReport = async () => {
    const query = `
            SELECT SUM(testTable.total) as totalMoney FROM (
                    SELECT COALESCE(SUM(p.amount), 0) AS total
                        FROM payments p
                        JOIN transactions t ON p.transaction_id = t.id
                        WHERE t.transaction_type = 'بيع' AND p.payment_method = 'نقدي'
                UNION ALL
                    SELECT COALESCE(SUM(amount), 0) AS total
                        FROM financial_transactions
                        WHERE transaction_type IN ('service', 'supply')

                UNION ALL
                    SELECT COALESCE(SUM(total), 0) AS total
                        FROM invokesbridgepoint

                UNION ALL

                    SELECT -COALESCE(SUM(p.amount), 0) AS total_sales_payments
                        FROM payments p
                        JOIN transactions t ON p.transaction_id = t.id
                        WHERE t.transaction_type = 'شراء' AND p.payment_method = 'نقدي'


                UNION ALL

                    SELECT -COALESCE(SUM(amount), 0) AS total
                        FROM financial_transactions
                        WHERE transaction_type IN ('expense')
            ) AS testTable;
    `;
    try {
        
        const rows = await (await db).select(query);
        return rows
    } catch (error) {
        console.log(error)
    }
}