import { useMemo, useState } from "react";

export interface productsDataType {
  id: number;
  title: string;
  idDb: number;
  amount: number;
  price: number;
  type: string
}
export interface employeeDataType {
  id: number;
  name: string;
}

export interface sourcerOrClientDataType {
  id: number;
  name: string;
  type: "client" | "sourcer";
}
const UseTransAction = () => {
  // بيع , شراء , إرجاع
  const [transactionType, setTransactionType] = useState<string>("بيع");
  const [sourcerOrClientDetails, setSourcerOrClientDetails] = useState<{
    id: number;
    type: string;
  }>({ id: 0, type: "none" });
  const [products, setProducts] = useState<productsDataType[]>([]);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [employee, setEmployee] = useState<employeeDataType | null>(null);
  const [paymentEmployee, setPaymentEmployee] = useState<number>(0);
  const [sourcerOrClient, setSourcerOrClient] =
    useState<sourcerOrClientDataType | null>(null);
  const [paymentStatus, setPaymentStatus] = useState<string>("مدفوع");

  const handleSave = (id: number, field: "price" | "amount" | "type", value: string) => {
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
        return product.id === id
          ? { ...product, type: value }
          : product;
      })
    );
    setEditingId(null);
  } 
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
    handleEditeType
  };
};
export default UseTransAction;
