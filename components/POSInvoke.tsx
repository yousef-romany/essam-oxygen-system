/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import { memo } from "react";
import { formatDate } from "@/lib/formatDate";
import logoCompany from "@/public/logoCompany.jpg";
import Barcode from "react-barcode";
import Image from "next/image";
import { useQuery } from "@tanstack/react-query";
import { fetchListUsers, userDataType } from "@/constant/User.info";

const POSInvoke = ({
  products,
  sourcerOrClient,
  transactionType,
  employee,
  newTransactionIdState,
  total,
  userId,
}: any) => {
  const { data } = useQuery<{ data: userDataType[] }, Error>({
    queryKey: ["fetchUsersList"],
    queryFn: fetchListUsers,
    refetchInterval: 1500,
  });
  console.log(data);
  return (
    <div className="w-full p-4 font-mono text-sm" dir="rtl">
      {/* Header */}
      <div className="text-center mb-4">
        <Image
          src={logoCompany}
          alt={"logo company"}
          className="!w-full !h-[100px]"
          priority
        />
        <h2 className="text-lg text-gray-600">{"شركه العالميه للأكسجين"}</h2>
      </div>

      <div className="w-full text-center">
        <span className="text-gray-600">
          {transactionType == "بيع" ? "بيع" : "شراء"}
        </span>
      </div>

      {/* Receipt Details */}
      <div className="border-b border-gray-300 pb-2 mb-2">
        <div className="flex justify-between flex-wrap">
          <span className="text-gray-600">
            {transactionType == "شراء" ? "مورد :" : "عميل :"}
          </span>
          <span className="text-gray-600">{sourcerOrClient?.name}</span>
        </div>
        <div className="flex justify-between flex-wrap">
          <span className="text-gray-600">مندوب : </span>
          <span className="text-gray-600">{employee?.name}</span>
        </div>
        <div className="flex justify-between flex-wrap">
          <span className="text-gray-600">تاريخ الفاتورة: </span>
          <span className="text-gray-600">{formatDate(Date?.now())}</span>
        </div>
        <div className="flex justify-between flex-wrap">
          <span className="text-gray-600">محرر الفاتوره :</span>
          <span className="text-gray-600">
            {Array.isArray(data) &&
              data?.find((element: any) => element.id == userId)?.userName}
          </span>
        </div>
        <div className="flex justify-between flex-wrap">
          <span className="text-gray-600">رقم الفاتورة:</span>
          <span className="text-gray-600">{newTransactionIdState}</span>
        </div>
        <div className="flex justify-between flex-wrap">
          <span className="text-gray-600">الأصناف:</span>
          <span className="text-gray-600"> {products?.length}</span>
        </div>
      </div>

      {/* Items Table */}
      <table className="w-full mb-4">
        <thead>
          <tr className="border-b">
            <th className="text-center text-gray-600 border !border-gray-300">
              الاسم
            </th>
            <th className="text-center text-gray-600 border !border-gray-300">
              العدد
            </th>
            <th className="text-center text-gray-600 border !border-gray-300">
              السعر
            </th>
            <th className="text-center text-gray-600 border !border-gray-300">
              أجمالى السعر
            </th>
          </tr>
        </thead>
        <tbody className="border !border-gray-300">
          {products?.map((item: any, key: number) => (
            <tr key={key}>
              <td className="text-center border text-gray-600 !border-gray-300">
                {item?.title}
              </td>
              <td className="text-center border text-gray-600 !border-gray-300">
                {item?.amount}
              </td>
              <td className="text-center border text-gray-600 !border-gray-300">
                {item?.price}
              </td>
              <td className="text-center border text-gray-600 !border-gray-300">
                {item?.amount * item?.price}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Totals */}
      <div className="border-t border-gray-300 pt-2">
        <div className="flex justify-between font-bold">
          <span className="text-gray-600">الإجمالي:</span>
          <span className="text-gray-600">{Number(total)?.toFixed(2)}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-600">المطلوب:</span>
          <span className="text-gray-600">{Number(total)?.toFixed(2)}</span>
        </div>
      </div>

      {newTransactionIdState && (
        <div className="w-full justify-center items-center px-4 pt-2 print:flex hidden text-gray-600">
          <Barcode
            value={newTransactionIdState?.toString() || ""}
            width={5}
            height={20}
            lineColor="#1f2937"
          />
        </div>
      )}

      {/* Footer */}
      <div className="mt-4 text-center text-xs">
        <p className="mt-2 text-gray-600">{"الاقصر - شارع أحمد عرابى "}</p>
        <p className="text-xs mt-2 text-gray-600">
          {"شكرا على ثقتكم فى التعامل مع شركه العالميه للأكسجين ."}
        </p>
        <div className="flex justify-around">
          <p className="mt-2 text-gray-600">{"01009000161"}</p>
          <p className="mt-2 text-gray-600">{"01029922277"}</p>
        </div>
      </div>
    </div>
  );
};
export default memo(POSInvoke);
