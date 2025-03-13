/* eslint-disable @typescript-eslint/no-explicit-any */
import { toast } from "@/hooks/use-toast";
import db from "@/lib/db";

export const fetchTransactionsList = async () => {
  try {
    const rawData = await (
      await db
    ).select(`
      SELECT 
          t.id AS transaction_id,
          t.transaction_type,
          t.customer_id,
          c.name AS customer_name,
          t.supplier_id,
          s.name AS supplier_name,
          t.employee_id,
          t.paymentEmployee,
          e.name AS employee_name,
          CAST(t.total_amount AS DOUBLE) AS total_amount,
          CAST(t.remaining_amount AS DOUBLE) AS remaining_amount,
          t.payment_status,
          t.entity_type,
          t.created_at,
          t.userId,
          ti.id AS transaction_item_id,
          ti.inventory_id,
          i.name AS inventory_name,
          ti.quantity,
          CAST(ti.price AS DOUBLE) AS price,
          ti.status,
          p.id AS payment_id,
          CAST(p.amount AS DOUBLE) AS paid_amount,
          p.payment_method,
          p.paid_at
      FROM transactions t
      LEFT JOIN transaction_items ti ON t.id = ti.transaction_id
      LEFT JOIN inventory i ON ti.inventory_id = i.id
      LEFT JOIN payments p ON t.id = p.transaction_id
      LEFT JOIN customers c ON t.customer_id = c.id
      LEFT JOIN suppliers s ON t.supplier_id = s.id
      LEFT JOIN employees e ON t.employee_id = e.id
      ORDER BY t.created_at DESC;
    `);

    // إعادة هيكلة البيانات
    const transactionsMap = new Map();

    rawData.forEach((row: any) => {
      if (!transactionsMap.has(row.transaction_id)) {
        transactionsMap.set(row.transaction_id, {
          id: row.transaction_id,
          transaction_type: row.transaction_type,
          customer: row.customer_id
            ? { id: row.customer_id, name: row.customer_name }
            : null,
          supplier: row.supplier_id
            ? { id: row.supplier_id, name: row.supplier_name }
            : null,
          employee: row.employee_id
            ? { id: row.employee_id, name: row.employee_name }
            : null,
          total_amount: row.total_amount,
          remaining_amount: row.remaining_amount,
          payment_status: row.payment_status,
          entity_type: row.entity_type,
          created_at: row.created_at,
          userId: row.userId,
          paymentEmployee: row.paymentEmployee,
          items: [],
          payments: [],
        });
      }

      const transaction = transactionsMap.get(row.transaction_id);

      // ✅ تأكد من عدم تكرار نفس العنصر
      if (
        row.transaction_item_id &&
        !transaction.items.some(
          (item: any) => item.id === row.transaction_item_id
        )
      ) {
        transaction.items.push({
          id: row.transaction_item_id,
          idDb: row.inventory_id,
          title: row.inventory_name,
          amount: row.quantity,
          price: row.price,
          type: row.status,
        });
      }

      // ✅ تأكد من عدم تكرار نفس الدفعة
      if (
        row.payment_id &&
        !transaction.payments.some(
          (payment: any) => payment.id === row.payment_id
        )
      ) {
        transaction.payments.push({
          id: row.payment_id,
          amount: row.paid_amount,
          payment_method: row.payment_method,
          paid_at: row.paid_at,
        });
      }
    });

    return Array.from(transactionsMap.values());
  } catch (error) {
    console.error("⚠️ خطأ أثناء جلب المعاملات:", error);
    return [];
  }
};

export const handleDeleteTransaction = async (
  transactionId: number,
  type: string
) => {
  try {
    if (!transactionId) throw new Error("⚠️ معرف المعاملة غير صالح.");

    (await db).execute("START TRANSACTION");

    // ✅ 1. استرجاع جميع المنتجات المرتبطة بالمعاملة
    (await db)
      .select(
        `SELECT inventory_id, quantity, status FROM transaction_items WHERE transaction_id = ?`,
        [transactionId]
      )
      .then(async (rows: any[]) => {
        console.log("rows : ", rows, transactionId);
        // ✅ التحقق من أن `rows` ليست فارغة
        if (!Array.isArray(rows) || rows.length === 0) {
          throw new Error("⚠️ لم يتم العثور على عناصر لهذه المعاملة.");
        }

        console.log("🛒 العناصر المرتبطة بالمعاملة:", rows);

        // ✅ 2. تحديث المخزون قبل حذف العناصر
        for (const item of rows) {
          console.log(`🔄 تحديث المخزون للمنتج ${item.inventory_id}`);

          if (type == "إرجاع") {
            (await db).execute(
              `UPDATE inventory 
             SET full_quantity = full_quantity - IF(? = 'ممتلئ', ?, 0),
                 empty_quantity = empty_quantity - IF(? = 'فارغ', ?, 0)
             WHERE id = ?;`,
              [
                item.status,
                item.quantity,
                item.status,
                item.quantity,
                item.inventory_id,
              ]
            );
          } else {
            (await db).execute(
              `UPDATE inventory 
             SET full_quantity = full_quantity + IF(? = 'ممتلئ', ?, 0),
                 empty_quantity = empty_quantity + IF(? = 'فارغ', ?, 0)
             WHERE id = ?;`,
              [
                item.status,
                item.quantity,
                item.status,
                item.quantity,
                item.inventory_id,
              ]
            );
          }
        }

        // ✅ 5. حذف المعاملة نفسها
        console.log("🗑️ حذف المعاملة...");
        (await db).execute(`DELETE FROM transactions WHERE id = ?`, [
          transactionId,
        ]);

        // ✅ 6. تأكيد الحذف
        (await db).execute("COMMIT");

        console.log("✅ تم حذف المعاملة بنجاح");
        toast({
          variant: "default",
          title: "تم الحذف",
          description: "تم حذف المعاملة وجميع البيانات المرتبطة بها.",
        });

        return true;
      })
      .catch((error: any) =>
        toast({
          variant: "destructive",
          title: "مشكلة",
          description: `${error}` as string,
        })
      );
  } catch (error) {
    console.error("⚠️ خطأ أثناء حذف المعاملة:", error);

    (await db).execute("ROLLBACK");

    toast({
      variant: "destructive",
      title: "مشكلة",
      description: `${error}` as string,
    });

    return false;
  }
};
