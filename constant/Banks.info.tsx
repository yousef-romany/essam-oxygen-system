/* eslint-disable @typescript-eslint/no-explicit-any */
import { toast } from "@/hooks/use-toast";
import db from "@/lib/db";

export const fetchBanksList = async () => {
  try {
    const rows: any = await (
      await db
    ).select(`
        SELECT
            b.id,  
            b.bank_name, 
            b.account_number, 
            CAST(b.balance AS DOUBLE) AS balance, -- ✅ تحويل DECIMAL إلى DOUBLE
            CAST(t.amount AS DOUBLE) AS amount,  -- ✅ تحويل DECIMAL إلى DOUBLE
            t.transaction_date, 
            t.reference,
            t.documentNumber,
            t.transaction_type,
            t.id AS transactionId,
            re.entity_type,
            re.entity_id,
            re.id AS relationsId,
            COALESCE(c.name, s.name) AS supplier_or_client_name
        FROM banks b
        LEFT JOIN bank_transactions t ON b.id = t.bank_id
        LEFT JOIN related_entities re ON t.related_entity_id = re.id
        LEFT JOIN customers c ON re.entity_type = 'customer' AND re.entity_id = c.id
        LEFT JOIN suppliers s ON re.entity_type = 'supplier' AND re.entity_id = s.id
        ORDER BY b.id, t.transaction_date DESC;
    `);

    if (!rows || !Array.isArray(rows)) {
      console.error("Unexpected result from database:", rows);
      return { data: [] };
    }

    const banksMap = new Map<number, any>();

    rows.forEach((row: any) => {
      if (!row || row.id == null) return;

      if (!banksMap.has(row.id)) {
        banksMap.set(row.id, {
          id: row.id,
          accountNumber: row.account_number || "N/A",
          bankName: row.bank_name || "Unknown Bank",
          balance: row.balance ? parseFloat(row.balance) : 0,
          transactions: [],
          finalBalance: row.balance ? parseFloat(row.balance) : 0, // ✅ رصيد البنك بعد العمليات
        });
      }

      if (row.transactionId) {
        const transactionAmount = row.amount ? parseFloat(row.amount) : 0;
        const bank = banksMap.get(row.id);

        bank.transactions.push({
          id: row.transactionId,
          documentNumber: row.documentNumber,
          customerORSupplierId: row.entity_id,
          customerORSupplierName: row.supplier_or_client_name,
          customerORSupplierType: row.entity_type,
          transaction_type: row.transaction_type,
          amount: transactionAmount,
          date: row.transaction_date ? row.transaction_date.split("T")[0] : "N/A",
          description: row.reference || "No Description",
          relationsId: row.relationsId
        });

        if (row.transaction_type === "deposit") {
          bank.finalBalance += transactionAmount; // ✅ إضافة مبلغ الإيداع
        } else if (row.transaction_type === "withdrawal") {
          bank.finalBalance -= transactionAmount; // ✅ طرح مبلغ السحب
        }
      }
    });

    return { data: Array.from(banksMap.values()) };
  } catch (error) {
    console.error("Error fetching banks list:", error);
    return { data: [] };
  }
};


export const handleDeleteBanks = async (id: number) => {
  (await db)
    .execute("DELETE FROM banks WHERE id = ?;", [id])
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


export const handleDeleteBankTransaction = async (id: number) => {
  (await db)
    .execute("DELETE FROM bank_transactions WHERE id = ?;", [id])
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




export const handleAddTransactionBackEnd = async (newTransaction: any, account: any) => {
  if (
    !newTransaction.amount ||
    !newTransaction.transaction_type ||
    !account.id
  ) {
    console.log("بيانات غير مكتملة، لن يتم تنفيذ العملية.");
    return;
  }

  try {
    console.log("بدء المعاملة...");
    await (await db).execute("START TRANSACTION", []);

    const bankCheck = await (
      await db
    ).execute("SELECT id FROM banks WHERE id = ?", [account.id]);

    if (!bankCheck || bankCheck.length === 0) {
      console.log("حساب البنك غير موجود!");
      await (await db).execute("ROLLBACK", []);
      return;
    }

    if (newTransaction.customerORSupplierId !== 0) {
      console.log("إدخال الكيان المرتبط...");
      const res = await (
        await db
      ).execute(
        `INSERT INTO related_entities (entity_type, entity_id) VALUES (?, ?)`,
        [
          newTransaction.customerORSupplierType,
          newTransaction.customerORSupplierId,
        ]
      );

      console.log("تم الإدخال، المعرف:", res.lastInsertId);

      console.log("إدخال المعاملة البنكية...");
      await (
        await db
      ).execute(
        `INSERT INTO bank_transactions (bank_id, amount, reference, related_entity_id, transaction_type, documentNumber) 
        VALUES (?, ?, ?, ?, ?, ?)`,
        [
          account.id,
          newTransaction.amount,
          newTransaction.description,
          res.lastInsertId,
          newTransaction.transaction_type,
          newTransaction.documentNumber,
        ]
      );
      toast({
        variant: "default",
        title: "تم الأضافه"
      })
    }
  } catch (error) {
    await (await db).execute("ROLLBACK", []);
    console.error("خطأ أثناء إضافة المعاملة:", error);
  }
};