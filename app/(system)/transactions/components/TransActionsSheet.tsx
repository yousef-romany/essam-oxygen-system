/* eslint-disable @typescript-eslint/no-explicit-any */
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
  SheetContent,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { PlusCircle, RefreshCcwIcon } from "lucide-react";
import UseTransAction from "@/hooks/UseTransAction";
import SelectSourcerOrClient from "./SelectSourcerOrClient";
import EmployeeProcessTransAction from "./EmployeeProcessTransAction";
import SelectProducts from "./SelectProducts";
import PreviewItemWhenCreateTransaction from "./PreviewItemWhenCreateTransaction";
import POSInvoke from "@/components/POSInvoke";
import { useReactToPrint } from "react-to-print";
import { useEffect, useRef, useState } from "react";

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
    setEntity_type,
    // ------- Start data ------
    customersANDSuppliersList,
    employeeList,
    categoriesList,
    // ------- End data ------
    // ------- Start state of POS Invokes ------
    stateInvoke,
    // ------- End state of POS Invokes ------
    // ------- Start handleSubmitData -------
    handleSubmitData,
    // ------- End handleSubmitData -------

    newTransactionIdState,

    handleRefresh,
  } = UseTransAction();

  const posInvokeRef: any = useRef<any>(null);

  const handleSubmit = () => handleSubmitData();
  const [userId, setUserId] = useState<any>(null);

  useEffect(() => {
    setUserId(localStorage?.getItem("id"));
  }, []);
  const handlePrintPos = useReactToPrint({ contentRef: posInvokeRef });
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
        <div className="space-y-4">
          <div className="grid grid-cols-3 gap-4">
            <div>
              <Label htmlFor="transactionType">نوع المعاملة</Label>
              <Select
                onValueChange={setTransactionType}
                value={transactionType}
                dir="rtl"
                name="typeTransaction"
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
              data={customersANDSuppliersList.data}
              setEntity_type={setEntity_type}
            />
            <SelectProducts
              data={categoriesList.data}
              products={products}
              setProducts={setProducts}
              transactionType={transactionType}
            />
          </div>

          <div className="w-full min-h-[400px] max-h-[500px] overflow-y-scroll">
            <PreviewItemWhenCreateTransaction
              transactionType={transactionType}
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
              data={employeeList.data}
            />
            <div>
              <Label htmlFor="paymentStatus">حالة الدفع</Label>
              <Select
                dir="rtl"
                onValueChange={(value: "نقدي" | "آجل") =>
                  setPaymentStatus(value)
                }
                value={paymentStatus}
              >
                <SelectTrigger id="paymentStatus">
                  <SelectValue placeholder="اختر حالة الدفع" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="نقدي">نقدي</SelectItem>
                  <SelectItem value="آجل">آجل</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <SheetFooter className="flex gap-4">
            <div className="flex justify-between items-center flex-row-reverse w-full">
              <h1 className="text-lg font-semibold">
                أجمالى الفاتوره : { total?.toFixed(2)}
              </h1>
            </div>
            <Button onClick={handleSubmit} disabled={stateInvoke}>
              إضافة المعاملة
            </Button>
            {stateInvoke && (
              <>
                <Button onClick={() => handlePrintPos()} variant={"secondary"}>
                  Print
                </Button>
                <Button onClick={() => handleRefresh()} variant={"secondary"}>
                  <RefreshCcwIcon />
                </Button>
              </>
            )}
          </SheetFooter>
        </div>
      </SheetContent>
      <div ref={posInvokeRef} className="hidden print:block">
        <POSInvoke
          products={products}
          sourcerOrClient={sourcerOrClient}
          transactionType={transactionType}
          employee={employee}
          newTransactionIdState={newTransactionIdState}
          total={total}
          userId={userId}
        />
      </div>
    </Sheet>
  );
};
export default TransActionsSheet;
