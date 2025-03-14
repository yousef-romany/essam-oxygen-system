/* eslint-disable @typescript-eslint/no-explicit-any */
import { fetchInventoryList } from "@/constant/Category.info";
import { fetchCustomersAndSuppliersList } from "@/constant/Comon.info";
import { fetchEmployeesList } from "@/constant/Employee.info";
import { useQuery } from "@tanstack/react-query";
import { useMemo, useState } from "react";
import { toast } from "./use-toast";
import db from "@/lib/db";

export interface productsDataType {
  id: number;
  title: string;
  idDb: number;
  amount: number;
  price: number;
  type: string;
}
export interface employeeDataType {
  id: number;
  name: string;
}

export interface sourcerOrClientDataType {
  id: number;
  name: string;
  entity_type: "customer" | "supplier" | "else";
}
const UseUpdateTransAction = () => {
  // بيع , شراء , إرجاع
  const [transactionType, setTransactionType] = useState<string>("بيع");
  const [sourcerOrClientDetails, setSourcerOrClientDetails] = useState<{
    id: number;
    type: string;
  }>({ id: 0, type: "none" });
  const [products, setProducts] = useState<productsDataType[]>([]);
  const [productsBackUp, setProductsBackUp] = useState<productsDataType[]>([]);
  const [backUpProducts, setBackUpProducts] = useState<productsDataType[]>([]);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [employee, setEmployee] = useState<employeeDataType | null>(null);
  const [paymentEmployee, setPaymentEmployee] = useState<number>(0);
  const [sourcerOrClient, setSourcerOrClient] =
    useState<sourcerOrClientDataType | null>(null);
  const [entity_type, setEntity_type] = useState<
    "customer" | "supplier" | "else"
  >("else");
  const [paymentStatus, setPaymentStatus] = useState<"نقدي" | "آجل">("نقدي");
  const [stateInvoke, setStateInvoke] = useState<boolean>(false);
  const [newTransactionIdState, setNewTransactionIdState] = useState(0);
  const customersANDSuppliersList = useQuery({
    queryKey: ["fetchCustomersAndSuppliersList"],
    queryFn: async () => await fetchCustomersAndSuppliersList(),
    refetchInterval: 2000,
  });

  const employeeList = useQuery({
    queryKey: ["fetchEmployeesList"],
    queryFn: async () => await fetchEmployeesList(),
    refetchInterval: 2000,
  });

  const categoriesList = useQuery({
    queryKey: ["fetchInventoryList"],
    queryFn: async () => await fetchInventoryList(),
    refetchInterval: 2000,
  });

  const handleSave = (
    id: number,
    field: "price" | "amount" | "type",
    value: string
  ) => {
    setProducts(
      products?.map((product: productsDataType) => {
        return product.id === id
          ? { ...product, [field]: parseFloat(value) || 0 }
          : product;
      })
    );
    setEditingId(null);
  };
  const handleEditeType = (id: number, value: string) => {
    setProducts(
      products?.map((product: productsDataType) => {
        return product.id === id ? { ...product, type: value } : product;
      })
    );
    setEditingId(null);
  };
  const handleDelete = (id: number) => {
    setProducts(
      products.filter((product: productsDataType) => product?.id !== id)
    );
  };
  const handleEdit = (id: number) => {
    setEditingId(id);
  };
  const total = useMemo(() => {
    return products.reduce((sum: number, product: productsDataType) => {
      return sum + (product?.price || 0) * (product?.amount || 0);
    }, 0);
  }, [products]);

  const handleSubmitData = async (transactionId: number) => {
    try {
      const userId = localStorage.getItem("id");
      if (!userId) throw new Error("⚠️ لم يتم العثور على معرف المستخدم.");

      let customerId: number | null = null;
      let supplierId: number | null = null;

      if (transactionType == "بيع") {
        customerId = sourcerOrClient?.id || null;
      } else if (transactionType == "شراء") {
        supplierId = sourcerOrClient?.id || null;
      } else if (transactionType == "إرجاع") {
        if (entity_type == "customer") {
          customerId = sourcerOrClient?.id || null;
        } else if (entity_type == "supplier") {
          supplierId = sourcerOrClient?.id || null;
        } else {
          customerId = sourcerOrClient?.id || null;
          supplierId = sourcerOrClient?.id || null;
        }
      }

      console.log(
        "mena say : ",
        entity_type,
        sourcerOrClient,
        "customerId : ",
        customerId,
        "supplierId : ",
        supplierId
      );

      // ✅ تحديث المعاملة إذا كانت موجودةx
      await (
        await db
      ).execute(
        `UPDATE transactions 
          SET transaction_type = ?, customer_id = ?, supplier_id = ?, employee_id = ?, total_amount = ?, payment_status = ?, entity_type = ?, paymentEmployee = ?, userId = ?
          WHERE id = ?`,
        [
          transactionType,
          entity_type ? customerId : null,
          entity_type ? supplierId : null,
          employee?.id || null,
          total,
          paymentStatus,
          entity_type,
          paymentEmployee,
          userId,
          transactionId,
        ]
      );

      for (const item of backUpProducts) {
        if(transactionType == "إرجاع") {
          await (
            await db
          ).execute(
            `UPDATE inventory 
                SET full_quantity = CASE WHEN ? = 'ممتلئ' THEN full_quantity - ? ELSE full_quantity END, 
                empty_quantity = CASE WHEN ? = 'فارغ' THEN empty_quantity - ? ELSE empty_quantity END
                WHERE id = ?;`,
            [item.type, item.amount, item.type, item.amount, item.idDb]
          );
        } else {
          await (
            await db
          ).execute(
            `UPDATE inventory 
                SET full_quantity = CASE WHEN ? = 'ممتلئ' THEN full_quantity + ? ELSE full_quantity END, 
                empty_quantity = CASE WHEN ? = 'فارغ' THEN empty_quantity + ? ELSE empty_quantity END
                WHERE id = ?;`,
            [item.type, item.amount, item.type, item.amount, item.idDb]
          );
        }
      }

      // ✅ حذف العناصر القديمة من المعاملة قبل التحديث
      await (
        await db
      )
        .execute(`DELETE FROM transaction_items WHERE transaction_id = ?;`, [
          transactionId,
        ])
        .then(async () => {
          // ✅ تحديث أو إدخال عناصر المعاملة
          for (const item of products) {
            console.log(
              "test : ",
              transactionId,
              item.idDb,
              item.amount,
              item.price,
              item?.type
            );
            await (
              await db
            ).execute(
              `INSERT INTO transaction_items (transaction_id, inventory_id, quantity, price, status) 
                 VALUES (?, ?, ?, ?, ?);`,
              [transactionId, item.idDb, item.amount, item.price, item?.type]
            );

            // ✅ تحديث المخزون بعد التعديل
            if (transactionType == "إرجاع") {
              await (
                await db
              ).execute(
                `UPDATE inventory 
                  SET full_quantity = CASE WHEN ? = 'ممتلئ' THEN full_quantity + ? ELSE full_quantity END, 
                  empty_quantity = CASE WHEN ? = 'فارغ' THEN empty_quantity + ? ELSE empty_quantity END
                  WHERE id = ?;`,
                [item.type, item.amount, item.type, item.amount, item.idDb]
              );
            } else {
              await (
                await db
              ).execute(
                `UPDATE inventory 
                  SET full_quantity = CASE WHEN ? = 'ممتلئ' THEN full_quantity - ? ELSE full_quantity END, 
                  empty_quantity = CASE WHEN ? = 'فارغ' THEN empty_quantity - ? ELSE empty_quantity END
                  WHERE id = ?;`,
                [item.type, item.amount, item.type, item.amount, item.idDb]
              );
            }
          }

          await (
            await db
          ).execute(
            `DELETE FROM payments WHERE transaction_id = ?;;`,
            [transactionId]
          );

          // ✅ تحديث أو إدخال بيانات الدفع
          await (
            await db
          ).execute(
            `INSERT INTO payments (transaction_id, amount, payment_method, paid_at) 
               VALUES (?, ?, ?, NOW())
               ON DUPLICATE KEY UPDATE amount = ?, payment_method = ?;`,
            [transactionId, total, paymentStatus, total, paymentStatus]
          );

          console.log("✅ تمت معالجة المعاملة بنجاح");
          handleFinishSaveInvoke(Number(transactionId));
          toast({
            variant: "default",
            title: transactionId ? "تم التحديث" : "تمت الإضافة",
          });
        })
        .catch((error: any) =>
          toast({
            variant: "destructive",
            title: "مشكلة",
            description: `${error}` as string,
          })
        );

      return transactionId;
    } catch (error) {
      console.error("⚠️ خطأ أثناء تنفيذ المعاملة:", error);
      await (await db).execute("ROLLBACK");

      toast({
        variant: "destructive",
        title: "مشكلة",
        description: `${error}` as string,
      });

      return null;
    }
  };

  const handleFinishSaveInvoke = (newTransactionId: number) => {
    setNewTransactionIdState(newTransactionId);
    setStateInvoke(true);
  };

  return {
    transactionType,
    setTransactionType,
    sourcerOrClientDetails,
    setSourcerOrClientDetails,
    products,
    setProducts,
    handleSave,
    handleDelete,
    handleEdit,
    total,
    editingId,
    setEditingId,
    employee,
    setEmployee,
    paymentEmployee,
    setPaymentEmployee,
    sourcerOrClient,
    setSourcerOrClient,
    paymentStatus,
    setPaymentStatus,
    handleEditeType,
    setEntity_type,

    customersANDSuppliersList,
    employeeList,
    categoriesList,

    stateInvoke,
    setStateInvoke,

    handleSubmitData,

    setNewTransactionIdState,
    newTransactionIdState,

    setBackUpProducts,
    setProductsBackUp,
  };
};
export default UseUpdateTransAction;
