"use client";

import { useState } from "react";
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

type Transaction = {
  id: string;
  documentNumber: string;
  amount: number;
  date: string;
  description: string;
};

type BankAccount = {
  id: string;
  accountNumber: string;
  bankName: string;
  balance: number;
  transactions: Transaction[];
};

type BankAccountModalProps = {
  isOpen: boolean;
  onClose: () => void;
  account: BankAccount;
};

export function BankAccountModal({
  isOpen,
  onClose,
  account,
}: BankAccountModalProps) {
  const [transactions, setTransactions] = useState(account.transactions);
  const [editingTransaction, setEditingTransaction] =
    useState<Transaction | null>(null);
  const [newTransaction, setNewTransaction] = useState<Partial<Transaction>>({
    documentNumber: "",
    amount: 0,
    date: "",
    description: "",
  });

  const handleEditTransaction = (transaction: Transaction) => {
    setEditingTransaction(transaction);
  };

  const handleUpdateTransaction = () => {
    if (editingTransaction) {
      setTransactions(
        transactions.map((t) =>
          t.id === editingTransaction.id ? editingTransaction : t
        )
      );
      setEditingTransaction(null);
    }
  };

  const handleDeleteTransaction = (transactionId: string) => {
    setTransactions(transactions.filter((t) => t.id !== transactionId));
  };

  const handleAddTransaction = () => {
    const transaction: Transaction = {
      id: `${Date.now()}`,
      ...(newTransaction as Transaction),
    };
    setTransactions([...transactions, transaction]);
    setNewTransaction({
      documentNumber: "",
      amount: 0,
      date: "",
      description: "",
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl">
        <DialogHeader>
          <DialogTitle>معاملات الحساب: {account.accountNumber}</DialogTitle>
        </DialogHeader>
        <div className="mt-4">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="text-center">رقم المستند</TableHead>
                <TableHead className="text-center">المبلغ</TableHead>
                <TableHead className="text-center">التاريخ</TableHead>
                <TableHead className="text-center">الوصف</TableHead>
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
                      onClick={() => handleDeleteTransaction(transaction.id)}
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
                value={editingTransaction?.date || newTransaction.date}
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
