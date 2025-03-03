/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { Dispatch, SetStateAction, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { PlusCircle, Pencil, Trash } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import SelectCustomerOrSupplier from "@/components/SelectCustomerOrSupplier";
import db from "@/lib/db";
import { toast } from "@/hooks/use-toast";
import { formatDateForInput } from "@/lib/formatDateForInput";

type BankAccount = {
  id: number;
  accountNumber: string;
  bankName: string;
  balance: number;
  transactions: Transaction[];
};

type Transaction = {
  id: string;
  documentNumber: string;
  amount: number;
  date: string;
  description: string;
  customerORSupplierId: number;
  transaction_type: string;
  customerORSupplierType: string;
  customerORSupplierName: string;
  related_entity_id: number;
  entity_id: number;
  entity_type: string;
  relationsId: number;
};

type BankAccountModalProps = {
  isOpen: boolean;
  onClose: () => void;
  account: BankAccount;
  refetch: () => void;
  setIsModalOpen: Dispatch<SetStateAction<boolean>>;
};

export function BankAccountModal({
  isOpen,
  onClose,
  account,
  refetch,
  setIsModalOpen,
}: BankAccountModalProps) {
  const [transactions] = useState(account.transactions);
  const [editingTransaction, setEditingTransaction] =
    useState<Transaction | null>(null);
  const [newTransaction, setNewTransaction] = useState<Partial<Transaction>>({
    documentNumber: "",
    amount: 0,
    date: "",
    description: "",
    customerORSupplierId: 0,
    customerORSupplierType: "",
    transaction_type: "",
  });

  const handleEditTransaction = (transaction: Transaction) => {
    setEditingTransaction(transaction);
  };

  const handleUpdateTransaction = async () => {
    if (!editingTransaction) return;

    const {
      id,
      documentNumber,
      amount,
      description,
      transaction_type,
      relationsId,
      customerORSupplierType,
      customerORSupplierId,
      date,
    } = editingTransaction;

    // تحقق من أن البيانات المطلوبة موجودة
    if (!id || !documentNumber || !amount || !transaction_type) {
      toast({
        variant: "destructive",
        title: "خطأ",
        description: "هناك بيانات ناقصة لا يمكن تحديث المعاملة بدونها",
      });
      return;
    }

    try {
      console.log("Editing transaction:", editingTransaction);

      // جلب الاتصال بقاعدة البيانات مرة واحدة فقط
      const database = await db;

      // تحديث related_entities
      await database.execute(
        `UPDATE related_entities SET entity_type = ?, entity_id = ? WHERE id = ?;`,
        [customerORSupplierType, customerORSupplierId, relationsId]
      );

      // تحديث bank_transactions
      const query = `
        UPDATE bank_transactions
        SET documentNumber = ?, amount = ?, reference = ?, transaction_type = ?, transaction_date = ?
        WHERE id = ?;
      `;

      const values = [
        documentNumber,
        amount,
        description,
        transaction_type,
        date,
        id,
      ];

      await database.execute(query, values);

      toast({
        variant: "default",
        title: "تم تعديل المعاملة بنجاح",
      });

      setEditingTransaction(null);
      onClose();
      setIsModalOpen(false);
    } catch (error) {
      console.error("Error updating transaction:", error);

      toast({
        variant: "destructive",
        title: "خطأ أثناء التحديث",
        description: error instanceof Error ? error.message : String(error),
      });
    }
  };

  const handleDeleteTransaction = async (transactionId: number) => {
    try {
      (await db)
        .execute("DELETE FROM bank_transactions WHERE id = ?;", [transactionId])
        .then(async () => {
          toast({
            variant: "default",
            title: "تم 🔐",
            description: "تم حذف",
          });
          await close();
          setIsModalOpen(false);
        })
        .catch((error: any) => {
          toast({
            variant: "destructive",
            title: "خطئ",
            description: `حدث خطئ فى استقبال البيانات ${error}`,
          });
        });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "خطئ",
        description: `حدث خطئ فى استقبال البيانات ${error}`,
      });
    }
  };

  const handleAddTransaction = async () => {
    if (
      !newTransaction.amount ||
      !newTransaction.transaction_type ||
      !account.id
    ) {
      // alert("يجب إدخال المبلغ، نوع المعاملة، وحساب البنك!");
      return;
    }

    try {
      await (await db).execute("START TRANSACTION", []);

      // ✅ التحقق مما إذا كان `bank_id` موجودًا في جدول `banks`
      const bankCheck = await (
        await db
      ).execute("SELECT id FROM banks WHERE id = ?", [account.id]);

      if (!bankCheck || bankCheck.length === 0) {
        // alert("خطأ: حساب البنك غير موجود!");
        await (await db).execute("ROLLBACK", []);
        return;
      }

      console.log(newTransaction);
      await (
        await db
      )
        .execute(
          `INSERT INTO related_entities (entity_type, entity_id) VALUES (?, ?)`,
          [
            newTransaction.customerORSupplierType,
            newTransaction.customerORSupplierId,
          ]
        )
        .then(async (res: { lastInsertId: number; rowEffected: number }) => {
          console.log("id of test : ", res, res.lastInsertId);
          // ✅ إدراج المعاملة بعد التحقق من صحة `bank_id`
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

          await (await db).execute("COMMIT", []);

          setNewTransaction({
            documentNumber: "",
            amount: 0,
            date: "",
            description: "",
            customerORSupplierId: 0,
            customerORSupplierType: "",
            transaction_type: "",
          });

          // await alert("تمت إضافة المعاملة بنجاح!");
          close();

          refetch();

          setIsModalOpen(false);

          toast({
            variant: "default",
            title: "تم اضافه العمليه",
          });
        })
        .catch(() => {});
    } catch (error) {
      await (await db).execute("ROLLBACK", []);
      console.error("خطأ أثناء إضافة المعاملة:", error);
      // alert("حدث خطأ أثناء حفظ المعاملة!");
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl">
        <DialogHeader>
          <DialogTitle>معاملات الحساب: {account.accountNumber}</DialogTitle>
        </DialogHeader>
        <div className="mt-4 max-h-[350px] overflow-y-scroll">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="text-center">رقم المستند</TableHead>
                <TableHead className="text-center">المبلغ</TableHead>
                <TableHead className="text-center">التاريخ</TableHead>
                <TableHead className="text-center">الوصف</TableHead>
                <TableHead className="text-center">مورد / عميل</TableHead>
                <TableHead className="text-center">نوع العمليه</TableHead>
                <TableHead className="text-center">الإجراءات</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {transactions.map((transaction) => (
                <TableRow key={transaction.id}>
                  <TableCell className="text-center">
                    {transaction.documentNumber}
                  </TableCell>
                  <TableCell className="text-center">
                    {transaction.amount}
                  </TableCell>
                  <TableCell className="text-center">
                    {transaction.date}
                  </TableCell>
                  <TableCell className="text-center">
                    {transaction.description}
                  </TableCell>
                  <TableCell className="text-center">
                    {transaction.customerORSupplierType == "else"
                      ? "عمليات أخرى"
                      : transaction.customerORSupplierName}
                  </TableCell>
                  <TableCell className="text-center">
                    {transaction.transaction_type == "deposit"
                      ? "أيداع"
                      : "سحب"}
                  </TableCell>
                  <TableCell className="text-center">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleEditTransaction(transaction)}
                    >
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() =>
                        handleDeleteTransaction(Number(transaction.id))
                      }
                    >
                      <Trash className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
        <div className="mt-4">
          <h3 className="text-lg font-semibold mb-2">
            {editingTransaction ? "تعديل المعاملة" : "إضافة معاملة جديدة"}
          </h3>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="documentNumber">رقم المستند</Label>
              <Input
                id="documentNumber"
                value={
                  editingTransaction?.documentNumber ||
                  newTransaction.documentNumber
                }
                onChange={(e) =>
                  editingTransaction
                    ? setEditingTransaction({
                        ...editingTransaction,
                        documentNumber: e.target.value,
                      })
                    : setNewTransaction({
                        ...newTransaction,
                        documentNumber: e.target.value,
                      })
                }
              />
            </div>
            <div>
              <Label htmlFor="amount">المبلغ</Label>
              <Input
                id="amount"
                type="number"
                value={editingTransaction?.amount || newTransaction.amount}
                onChange={(e) =>
                  editingTransaction
                    ? setEditingTransaction({
                        ...editingTransaction,
                        amount: Number(e.target.value),
                      })
                    : setNewTransaction({
                        ...newTransaction,
                        amount: Number(e.target.value),
                      })
                }
              />
            </div>
            <div>
              <Label htmlFor="date">التاريخ</Label>
              <Input
                id="date"
                type="date"
                value={
                  formatDateForInput(editingTransaction?.date as string) ||
                  formatDateForInput(newTransaction.date as string)
                }
                onChange={(e) =>
                  editingTransaction
                    ? setEditingTransaction({
                        ...editingTransaction,
                        date: e.target.value,
                      })
                    : setNewTransaction({
                        ...newTransaction,
                        date: e.target.value,
                      })
                }
              />
            </div>
            <div>
              <Label htmlFor="description">الوصف</Label>
              <Input
                id="description"
                value={
                  editingTransaction?.description || newTransaction.description
                }
                onChange={(e) =>
                  editingTransaction
                    ? setEditingTransaction({
                        ...editingTransaction,
                        description: e.target.value,
                      })
                    : setNewTransaction({
                        ...newTransaction,
                        description: e.target.value,
                      })
                }
              />
            </div>
            <div className="">
              <Label htmlFor="customerORSupplier">مورد / عميل</Label>
              <SelectCustomerOrSupplier
                newTransaction={newTransaction}
                editingTransaction={editingTransaction}
                setNewTransaction={setNewTransaction}
                setEditingTransaction={setEditingTransaction}
              />
            </div>
            <div>
              <Label htmlFor="transaction_type">نوع العمليه</Label>
              <Select
                dir="rtl"
                value={
                  editingTransaction?.transaction_type ||
                  newTransaction?.transaction_type
                }
                onValueChange={(value) =>
                  editingTransaction
                    ? setEditingTransaction({
                        ...editingTransaction,
                        transaction_type: value,
                      })
                    : setNewTransaction((prev) => ({
                        ...prev,
                        transaction_type: value,
                      }))
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="أختر نوع العملية" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectLabel>نوع</SelectLabel>
                    <SelectItem value="deposit">إيداع</SelectItem>
                    <SelectItem value="withdrawal">سحب</SelectItem>
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="mt-4">
            {editingTransaction ? (
              <Button onClick={handleUpdateTransaction}>تحديث المعاملة</Button>
            ) : (
              <Button onClick={handleAddTransaction}>
                <PlusCircle className="mr-2 h-4 w-4" />
                إضافة معاملة
              </Button>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
