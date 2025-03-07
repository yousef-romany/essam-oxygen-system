/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react-hooks/exhaustive-deps */
"use client";

import { memo, useEffect, useState } from "react";

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
import React from "react";
import { useQuery } from "@tanstack/react-query";
import { fetchSuppliersList } from "@/constant/Suppliers.info";

const SelectSources = ({ setSource }: any) => {
  const { data } = useQuery({
    queryKey: ["fetchSuppliersList"],
    queryFn: fetchSuppliersList,
    refetchInterval: 2000,
  });
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState("");
  useEffect(() => {
    if (value) {
      handleSaveInSource();
      return;
    }
    return;
  }, [value]);
  const handleSaveInSource = () => {
    if (value !== "مجهول") {
      const objectSource = data.find((item: any) => item.id === value);
      console.log(objectSource);
      setSource(objectSource);
      return;
    } else {
      setSource(0);
      return;
    }
  };
  return (
    <>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={open}
            className="w-[200px] justify-between"
          >
            {value
              ? value === "مجهول"
                ? "مجهول"
                : data.find((item: any) => item.id === value)?.name
              : "أختر مورد..."}
            <CaretSortIcon className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-[200px] p-0">
          <Command>
            <CommandInput placeholder="أبحث عن مورد..." className="h-9" />
            <CommandList>
              <CommandEmpty>لا يوجد مورد.</CommandEmpty>
              <CommandGroup>
                <CommandItem
                  key={"مجهول"}
                  value={"مجهول"}
                  onSelect={() => {
                    setValue("مجهول");
                    setOpen(false);
                  }}
                >
                  {"مجهول"}
                </CommandItem>
                {data?.map((item: any) => (
                  <CommandItem
                    key={item.id}
                    value={item.id}
                    onSelect={() => {
                      setValue(item.id === value ? "" : item.id);
                      setOpen(false);
                    }}
                  >
                    {item.name}
                    <CheckIcon
                      className={cn(
                        "ml-auto h-4 w-4",
                        value === item.value ? "opacity-100" : "opacity-0"
                      )}
                    />
                  </CommandItem>
                ))}
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
    </>
  );
};
export default memo(SelectSources);
