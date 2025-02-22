"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

type BankAccount = {
  id: string
  accountNumber: string
  bankName: string
  balance: number
  transactions: any[]
}

type EditBankAccountModalProps = {
  isOpen: boolean
  onClose: () => void
  account: BankAccount
  onUpdateAccount: (account: BankAccount) => void
}

export function EditBankAccountModal({ isOpen, onClose, account, onUpdateAccount }: EditBankAccountModalProps) {
  const [editedAccount, setEditedAccount] = useState<BankAccount>(account)

  useEffect(() => {
    setEditedAccount(account)
  }, [account])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onUpdateAccount(editedAccount)
    onClose()
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>تعديل الحساب البنكي</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="accountNumber">رقم الحساب</Label>
            <Input
              id="accountNumber"
              value={editedAccount.accountNumber}
              onChange={(e) => setEditedAccount({ ...editedAccount, accountNumber: e.target.value })}
              required
            />
          </div>
          <div>
            <Label htmlFor="bankName">اسم البنك</Label>
            <Input
              id="bankName"
              value={editedAccount.bankName}
              onChange={(e) => setEditedAccount({ ...editedAccount, bankName: e.target.value })}
              required
            />
          </div>
          <div>
            <Label htmlFor="balance">الرصيد</Label>
            <Input
              id="balance"
              type="number"
              value={editedAccount.balance}
              onChange={(e) => setEditedAccount({ ...editedAccount, balance: Number(e.target.value) })}
              required
            />
          </div>
          <Button type="submit">تحديث الحساب</Button>
        </form>
      </DialogContent>
    </Dialog>
  )
}

