/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import { Plus, Trash2 } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

const ProductsBridgePoint = ({
  fields,
  append,
  remove,
  calculateGrandTotal,
  calculateTotal,
  form,
}: any) => {
  return (
    <div className="space-y-6" dir="rtl">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">منتجات</h3>
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() => append({ name: "", amount: 0, price: 0 })}
        >
          أضف صنف
          <Plus className="h-4 w-4 mr-2" />
        </Button>
      </div>

      <div className="space-y-2">
        {fields.map((field: any, index: any) => (
          <Card key={field.id} className="p-4">
            <div className="grid grid-cols-1 md:grid-cols-6 gap-4">
              <FormField
                control={form.control}
                name={`products.${index}.name`}
                rules={{ required: "اسم صنف مطلوب" }}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>اسم صنف</FormLabel>
                    <FormControl>
                      <Input placeholder="أدخل اسم صنف" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name={`products.${index}.amount`}
                rules={{
                  required: "كميه مطلوبه",
                  min: { value: 1, message: "كميه يجب تكون على اقل 1" },
                }}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>كميه</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        placeholder="ادخل كميه"
                        {...field}
                        onChange={(e) => field.onChange(Number(e.target.value))}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name={`products.${index}.priceBuy`}
                rules={{
                  required: " سعر شراء مطلوب",
                  min: { value: 0, message: " سعر شراء لايكون ب سالب" },
                }}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel> سعر شراء للوحده الواحده</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        placeholder="أدخل سعر"
                        {...field}
                        onChange={(e) => field.onChange(Number(e.target.value))}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name={`products.${index}.priceSale`}
                rules={{
                  required: " سعر بيع مطلوب",
                  min: { value: 0, message: " سعر بيع لايكون ب سالب" },
                }}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel> سعر بيع للوحده الواحده</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        placeholder="أدخل سعر"
                        {...field}
                        onChange={(e) => field.onChange(Number(e.target.value))}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="flex flex-col justify-end gap-2">
                <div className="text-sm font-medium"> أجمالى شراء عنصر </div>
                <div className="flex items-center justify-between">
                  <span className="text-lg font-semibold">
                    $
                    {calculateTotal(
                      form.watch(`products.${index}.amount`) || 0,
                      form.watch(`products.${index}.priceBuy`) || 0
                    )}
                  </span>
                </div>
              </div>
              <div className="flex flex-col justify-end gap-2">
                <div className="text-sm font-medium"> أجمالى بيع عنصر </div>
                <div className="flex items-center justify-between">
                  <span className="text-lg font-semibold">
                    $
                    {calculateTotal(
                      form.watch(`products.${index}.amount`) || 0,
                      form.watch(`products.${index}.priceSale`) || 0
                    )}
                  </span>
                  {fields.length > 1 && (
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => remove(index)}
                      className="text-destructive hover:text-destructive/90"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              </div>
            </div>
          </Card>
        ))}
      </div>

      <div className="flex justify-end">
        <div className="bg-secondary p-4 rounded-lg">
          <div className="text-sm font-medium">صافى ربح </div>
          <div className="text-2xl font-bold">
            {calculateGrandTotal()
              ? calculateGrandTotal()
              : calculateGrandTotal() == 0
              ? 0
              : "رجاء أدخل جميع بيانات !!!"}
          </div>
        </div>
      </div>
    </div>
  );
};
export default ProductsBridgePoint;
