/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
 
import { memo, useState } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import ProductsBridgePoint from "./ProductsBridgePoint";
import { FormValuesBridagePoint } from "@/constant/bridgePoint";
import { toast } from "@/hooks/use-toast";
import db from "@/lib/db";
import SelectClients from "@/components/SelectClients";
import SelectSources from "@/components/SelectSources";

export function convertToTimestamp(dateString: string): number {
  return Math.floor(new Date(dateString).getTime() / 1000);
}
const CreateProcess = () => {
  const userId = localStorage.getItem("id");
  const [clientID, setClientID]: any = useState<any>();
  const [sourceID, setSourceID]: any = useState<any>();
  const [notNowClient, setNotNowClient] = useState(true);
  const [notNowSource, setNotNowSource] = useState(true);
  const form = useForm<FormValuesBridagePoint>({
    defaultValues: {
      clientName: "",
      sourceName: "",
      date: "",
      catagoryName: "",
      catagoryPrice: "",
      catagoryQuantity: "",
      catagoryTotal: "",
      invokeNumber: "",
      driverName: "",
      carNumber: "",
      products: [{ name: "", amount: 0, priceBuy: 0, priceSale: 0 }],
      taxs: 0,
    },
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "products",
  });
  async function onSubmit(values: any) {
    if (clientID || clientID == "0") {
      if (sourceID || sourceID == "0") {
        try {
          (await db)
            .execute(
              "INSERT INTO invokesbridgepoint (clientId, sourceId, statusSource, statusClient, invokeNumber, driverName, carNumber, taxs, total,  date, userId) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)",
              [
                clientID?.id || 0,
                sourceID?.id || 0,
                notNowSource ? "أجل" : "تم",
                notNowClient ? "أجل" : "تم",
                values.invokeNumber,
                values.driverName,
                values.carNumber,
                values.taxs,
                calculateGrandTotal(),
                convertToTimestamp(values.date),
                userId,
              ]
            )
            .then(async (res: any) => {
              const idInvoke = res.lastInsertId;
              console.log(res);
              for (const product of values?.products) {
                (await db)
                  .execute(
                    "INSERT INTO productsbridgepoint (idInvoke, name, amount, priceBuy, priceSale, date, userId) VALUES (?, ?, ?, ?, ?, ?, ?)",
                    [
                      idInvoke,
                      product.name,
                      product.amount,
                      product.priceBuy,
                      product.priceSale,
                      convertToTimestamp(values.date),
                      userId,
                    ]
                  )
                  .catch((error: any) => {
                    toast({
                      variant: "destructive",
                      title: "خطئ !!",
                      description: error,
                    });
                  });
              }
              form.reset();
            })
            .catch((error: any) => {
              toast({
                variant: "destructive",
                title: "خطئ !!",
                description: error,
              });
            });
        } catch (error: any) {
          toast({
            variant: "destructive",
            title: "خطئ !!",
            description: error,
          });
        }
      } else
        toast({
          variant: "destructive",
          title: "خطئ !!",
          description: "أدخل المورد",
        });
    } else
      toast({
        variant: "destructive",
        title: "خطئ !!",
        description: "أدخل عميل",
      });
  }
  const calculateTotal = (amount: number, price: number) => {
    return (amount * price).toFixed(2);
  };

  const calculateGrandTotal = () => {
    const products = form.getValues("products");
    const valueBuy: any = products?.reduce(
      (totalBuy, { amount, priceBuy }) => totalBuy + amount * priceBuy,
      0
    );

    const valueSale: any = products?.reduce(
      (totalSale, { amount, priceSale }) => totalSale + amount * priceSale,
      0
    );

    return valueSale - (valueBuy + Number(form.watch(`taxs`)));
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 h-fit">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <SelectClients setClient={setClientID} />

          <SelectSources setSource={setSourceID} />

          <FormField
            control={form.control}
            name="invokeNumber"
            rules={{ required: "رقم البوليصه مطلوب" }}
            render={({ field }: any) => (
              <FormItem>
                <FormLabel>رقم البوليصه</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    placeholder="ادخل رقم البوليصه"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="date"
            rules={{ required: "تاريخ مطلوب" }}
            render={({ field }: any) => (
              <FormItem>
                <FormLabel>تاريخ</FormLabel>

                <FormControl>
                  <Input
                    type="datetime-local"
                    placeholder="ادخل تاريخ"
                    {...field}
                    dir="rtl"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="driverName"
            rules={{ required: "اسم سائق مطلوب" }}
            render={({ field }: any) => (
              <FormItem>
                <FormLabel>اسم سائق</FormLabel>

                <FormControl>
                  <Input
                    type="text"
                    placeholder="ادخل اسم سائق"
                    {...field}
                    dir="rtl"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="carNumber"
            rules={{ required: "رقم سياره مطلوب" }}
            render={({ field }: any) => (
              <FormItem>
                <FormLabel>رقم سياره</FormLabel>

                <FormControl>
                  <Input
                    type="number"
                    placeholder="ادخل رقم سياره"
                    {...field}
                    dir="rtl"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div>
          <FormField
            control={form.control}
            name="taxs"
            rules={{ required: "تكاليف مطلوب" }}
            render={({ field }: any) => (
              <FormItem>
                <FormLabel>تكاليف</FormLabel>

                <FormControl>
                  <Input
                    type="number"
                    placeholder="ادخل تكاليف"
                    {...field}
                    dir="rtl"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        {/* <div className="flex gap-6">
          <div className="flex gap-1 items-center">
            <Label htmlFor="notNowClient">أجل عميل</Label>
            <Input
              type="checkbox"
              className="w-6"
              
              onChange={() => setNotNowClient((prev) => !prev)}
              id="notNowClient"
            />
          </div>
          <div className="flex gap-1 items-center">
            <Label htmlFor="notNowSource">أجل مورد</Label>
            <Input
              type="checkbox"
              className="w-6"
              onChange={() => setNotNowSource((prev) => !prev)}
              id="notNowSource"
            />
          </div>
        </div> */}

        <ProductsBridgePoint
          fields={fields}
          append={append}
          remove={remove}
          calculateTotal={calculateTotal}
          calculateGrandTotal={calculateGrandTotal}
          form={form}
        />

        <Button type="submit" className="w-full md:w-auto">
          حفظ
        </Button>
      </form>
    </Form>
  );
};
export default memo(CreateProcess);
