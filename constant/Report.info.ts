/* eslint-disable @typescript-eslint/no-explicit-any */
import { toast } from "@/hooks/use-toast";
import db from "@/lib/db";

export const fetchReport = async () => {
  const query = `
        SELECT 
            ti.id,
          t.id AS transactionId,
          t.transaction_type AS type,
          t.customer_id AS customerId,
          t.supplier_id AS supplierId,
          -- t.total_amount AS totalPrice,
          ti.price * ti.quantity AS totalPrice,
          ti.status,
          t.created_at AS date,
          ti.inventory_id AS categoryId,
          ti.quantity,
          ti.price AS unitPrice
        FROM transactions t
        JOIN transaction_items ti ON t.id = ti.transaction_id;
  `;

  try {
    const rows = await (await db).select(query);

    const customersMap = new Map();

    rows.forEach((row: any) => {
      const {
        id,
        transactionId,
        customerId,
        supplierId,
        date,
        type,
        categoryId,
        quantity,
        unitPrice,
        totalPrice,
        status
      } = row;

      customersMap.set(id, {
        id,
        transactionId,
        customerId,
        supplierId,
        date,
        type,
        categoryId,
        status,
        quantity: Math.abs(Number(quantity)),
        unitPrice: Number(unitPrice),
        totalPrice: Number(totalPrice),
      });
    });

    const result = Array.from(customersMap.values());

    return result;
  } catch (error) {
    toast({
      variant: "destructive",
      title: "مشكله",
      description: error as string,
    });
    console.log(error);
    return [];
  }
};
