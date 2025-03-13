"use client";
import { memo, useEffect } from "react";
/* eslint-disable @typescript-eslint/no-explicit-any */

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
import POSInvoke from "@/components/POSInvoke";
import { useReactToPrint } from "react-to-print";
import { useRef } from "react";
import SelectSourcerOrClient from "../(system)/transactions/components/SelectSourcerOrClient";
import SelectProducts from "../(system)/transactions/components/SelectProducts";
import PreviewItemWhenCreateTransaction from "../(system)/transactions/components/PreviewItemWhenCreateTransaction";
import EmployeeProcessTransAction from "../(system)/transactions/components/EmployeeProcessTransAction";
import UseUpdateTransAction from "@/hooks/UseUpdateTransAction";

const UpdateTransAction = ({ transaction }: any) => {
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
    setProductsBackUp,
    // ------- End data ------
    // ------- Start state of POS Invokes ------
    // ------- End state of POS Invokes ------
    // ------- Start handleSubmitData -------
    handleSubmitData,
    // ------- End handleSubmitData -------

    setNewTransactionIdState,
    newTransactionIdState,
    setBackUpProducts,
  } = UseUpdateTransAction();

  useEffect(() => {
    console.log(transaction);
    handleUndo();
  }, [transaction]);

  const handleUndo = () => {
    setNewTransactionIdState(transaction.id);
    setEmployee(transaction.employee);
    setPaymentEmployee(0);
    setSourcerOrClient(
      transaction.customer ? transaction.customer : transaction.supplier
    );
    setEntity_type(transaction.entity_type);
    setPaymentStatus(transaction.payment_status);

    setProducts(transaction.items);

    setProductsBackUp(transaction.items);

    setTransactionType(transaction.transaction_type);
    setPaymentEmployee(transaction.paymentEmployee);
    setBackUpProducts(transaction.items);
  };

  const posInvokeRef: any = useRef<any>(null);

  const handleSubmit = () => handleSubmitData(newTransactionIdState);

  const handlePrintPos = useReactToPrint({ contentRef: posInvokeRef });
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant={"ghost"} className="w-full">
          تعديل / طباعه
        </Button>
      </SheetTrigger>
      <SheetContent
        className="bg-card h-full overflow-y-scroll"
        side={"bottom"}
        dir="rtl"
      >
        <SheetHeader>
          <SheetTitle>تعديل معامله</SheetTitle>
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
              products={products}
              editingId={editingId}
              handleSave={handleSave}
              handleDelete={handleDelete}
              handleEdit={handleEdit}
              handleEditeType={handleEditeType}
              transactionType={transactionType}
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
                أجمالى الفاتوره : {total.toFixed(2)}
              </h1>
            </div>
            <Button onClick={() => handleSubmit()}>تعديل المعاملة</Button>
            <Button onClick={() => handlePrintPos()} variant={"secondary"}>
              Print
            </Button>
          </SheetFooter>
        </div>
      </SheetContent>
      <div ref={posInvokeRef} className="hidden print:!block">
        <POSInvoke
          products={products}
          sourcerOrClient={sourcerOrClient}
          transactionType={transactionType}
          employee={employee}
          newTransactionIdState={newTransactionIdState}
          total={total}
          userId={transaction.userId}
        />
      </div>
    </Sheet>
  );
};

export default memo(UpdateTransAction);
