"use client";

import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { PlusCircle } from "lucide-react";
import UseTransAction from "@/hooks/UseTransAction";
import SelectSourcerOrClient from "./SelectSourcerOrClient";
import EmployeeProcessTransAction from "./EmployeeProcessTransAction";
import SelectProducts from "./SelectProducts";
import PreviewItemWhenCreateTransaction from "./PreviewItemWhenCreateTransaction";

const TransActionsSheet = () => {
  const {
    transactionType,
    setTransactionType,
    employee,
    setEmployee,
    paymentEmployee,
    setPaymentEmployee,
    sourcerOrClient,
    setSourcerOrClient,
    setProducts,
    products,
    handleEditeType,
    editingId,
    handleSave,
    handleDelete,
    handleEdit,
    paymentStatus,
    setPaymentStatus,
    total,
  } = UseTransAction();

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    // Handle form submission here
    console.log("تم إرسال النموذج");
    //   onClose()
  };
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button>
          <PlusCircle className="ml-2 h-4 w-4" /> معاملة جديدة
        </Button>
      </SheetTrigger>
      <SheetContent
        className="bg-card h-full overflow-y-scroll"
        side={"bottom"}
        dir="rtl"
      >
        <SheetHeader>
          <SheetTitle>أضف معامله</SheetTitle>
        </SheetHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-3 gap-4">
            <div>
              <Label htmlFor="transactionType">نوع المعاملة</Label>
              <Select
                onValueChange={setTransactionType}
                value={transactionType}
                dir="rtl"
              >
                <SelectTrigger id="transactionType">
                  <SelectValue placeholder="اختر نوع المعاملة" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="بيع">بيع</SelectItem>
                  <SelectItem value="شراء">شراء</SelectItem>
                  <SelectItem value="إرجاع">إرجاع</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <SelectSourcerOrClient
              transactionType={transactionType}
              sourcerOrClient={sourcerOrClient}
              setSourcerOrClient={setSourcerOrClient}
            />
            <SelectProducts products={products} setProducts={setProducts} />
          </div>

          <div className="w-full min-h-[400px] max-h-[500px] overflow-y-scroll">
            <PreviewItemWhenCreateTransaction
              products={products}
              editingId={editingId}
              handleSave={handleSave}
              handleDelete={handleDelete}
              handleEdit={handleEdit}
              handleEditeType={handleEditeType}
            />
          </div>

          <div className="grid grid-cols-3 gap-4">
            <EmployeeProcessTransAction
              employee={employee}
              setEmployee={setEmployee}
              paymentEmployee={paymentEmployee}
              setPaymentEmployee={setPaymentEmployee}
            />
            <div>
              <Label htmlFor="paymentStatus">حالة الدفع</Label>
              <Select
                dir="rtl"
                onValueChange={setPaymentStatus}
                value={paymentStatus || "مدفوع"}
              >
                <SelectTrigger id="paymentStatus">
                  <SelectValue placeholder="اختر حالة الدفع" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="مدفوع">مدفوع</SelectItem>
                  <SelectItem value="قيد الانتظار">قيد الانتظار</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <SheetFooter className="flex gap-4">
            <div className="flex justify-between items-center flex-row-reverse w-full">
              <h1 className="text-lg font-semibold">
                أجمالى الفاتوره : {total.toFixed(2)}
              </h1>

              <h1 className="text-lg text-destructive text-wrap">
                {transactionType == "بيع"
                  ? "معنا ذالك ان خرج من مخزنى اسطوانات ممتلئ و لم يتم اخذ الفارغ من العميل"
                  : transactionType == "شراء"
                  ? "معنا ذالك ان خرج من مخزنى اسطوانات فارغه و لم يتم اخذ ممتلئ من مورد"
                  : null}
              </h1>
            </div>
            <SheetClose asChild>
              <Button type="submit">إضافة المعاملة</Button>
            </SheetClose>
          </SheetFooter>
        </form>
      </SheetContent>
    </Sheet>
  );
};
export default TransActionsSheet;
