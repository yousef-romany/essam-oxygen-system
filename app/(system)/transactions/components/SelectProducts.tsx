/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react-hooks/exhaustive-deps */
"use client";

import { Dispatch, memo, SetStateAction, useEffect, useState } from "react";

import { CaretSortIcon, CheckIcon } from "@radix-ui/react-icons";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { toast } from "@/hooks/use-toast";
import React from "react";
import { Label } from "@/components/ui/label";
import { productsDataType } from "@/hooks/UseTransAction";

const SelectProducts = ({
  setProducts,
  products,
  data,
  transactionType
}: {
  setProducts: Dispatch<SetStateAction<productsDataType | null>> | any;
  products: productsDataType[];
  data: any[];
  transactionType: string
}) => {
  const [open, setOpen] = useState<boolean>(false);
  const [value, setValue] = useState<string>("");
  useEffect(() => {
    if (value) {
      handleSaveInProducts();
      return;
    }
    return;
  }, [value]);
  useEffect(() => {
    if (products.length == 0) {
      setValue(String(""));
    }
    return;
  }, [products]);
  const handleSaveInProducts = () => {
    const objectProduct = data?.find(
      (item: { id: number; name: string; price: number }) =>
        item?.name === value
    );
    if (
      products?.some(
        (item: productsDataType) => item?.title == objectProduct?.name
      )
    ) {
      toast({
        variant: "destructive",
        title: "صنف مكرر",
      });
    } else {
      setProducts((prev: productsDataType[]) => {
        return [
          ...prev,
          {
            id: prev.length == 0 ? 0 + 1 : (prev?.at(-1)?.id ?? 0) + 1,
            idDb: objectProduct?.id,
            title: objectProduct?.name,
            price: Number(objectProduct?.price),
            amount: 1,
            type: transactionType == "بيع" ? "ممتلئ" : transactionType == "شراء" ? "فارغ" : "ممتلئ",
          },
        ];
      });
    }
  };
  return (
    <div>
      <Label htmlFor="name">أختر أصنافك</Label>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={open}
            className="w-full justify-between"
          >
            {value
              ? data.find(
                  (item: { id: number; name: string; price: number }) =>
                    item?.name === value
                )?.name
              : "أختر صنف..."}
            <CaretSortIcon className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-full p-0">
          <Command>
            <CommandInput placeholder="أبحث عن صنف..." className="h-9" />
            <CommandList>
              <CommandEmpty>لا يوجد صنف.</CommandEmpty>
              <CommandGroup>
                {data?.map(
                  (item: { id: number; name: string; price: number }) => (
                    <CommandItem
                      key={item?.id}
                      value={item?.name}
                      onSelect={(currentValue) => {
                        setValue(currentValue === value ? "" : currentValue);
                        setOpen(false);
                      }}
                    >
                      {item?.name}
                      <CheckIcon
                        className={cn(
                          "ml-auto h-4 w-4",
                          value === item?.name ? "opacity-100" : "opacity-0"
                        )}
                      />
                    </CommandItem>
                  )
                )}
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
    </div>
  );
};
export default memo(SelectProducts);
