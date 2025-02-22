"use client"

import type React from "react"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

type BankAccount = {
  id: string
  accountNumber: string
  bankName: string
  balance: number
  transactions: []
}

type NewBankAccountModalProps = {
  isOpen: boolean
  onClose: () => void
}

export function NewBankAccountModal({ isOpen, onClose }: NewBankAccountModalProps) {
  const [newAccount, setNewAccount] = useState<Partial<BankAccount>>({
    accountNumber: "",
    bankName: "",
    balance: 0,
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const account: BankAccount = {
      id: `${Date.now()}`,
      accountNumber: newAccount.accountNumber!,
      bankName: newAccount.bankName!,
      balance: newAccount.balance!,
      transactions: [],
    }
    // onAddAccount(account)
    console.log(account)
    onClose()
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>إضافة حساب بنكي جديد</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="accountNumber">رقم الحساب</Label>
            <Input
              id="accountNumber"
              value={newAccount.accountNumber}
              onChange={(e) => setNewAccount({ ...newAccount, accountNumber: e.target.value })}
              required
            />
          </div>
          <div>
            <Label htmlFor="bankName">اسم البنك</Label>
            <Input
              id="bankName"
              value={newAccount.bankName}
              onChange={(e) => setNewAccount({ ...newAccount, bankName: e.target.value })}
              required
            />
          </div>
          <div>
            <Label htmlFor="balance">الرصيد الافتتاحي</Label>
            <Input
              id="balance"
              type="number"
              value={newAccount.balance}
              onChange={(e) => setNewAccount({ ...newAccount, balance: Number(e.target.value) })}
              required
            />
          </div>
          <Button type="submit">إضافة الحساب</Button>
        </form>
      </DialogContent>
    </Dialog>
  )
}

