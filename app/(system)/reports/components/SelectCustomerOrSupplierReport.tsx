/* eslint-disable @typescript-eslint/no-explicit-any */
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
import { useQuery } from "@tanstack/react-query";
import { fetchCustomersAndSuppliersForREPORTList } from "@/constant/Comon.info";

type Transaction = {
  id: string;
  documentNumber: string;
  amount: number;
  date: string;
  description: string;
  customerORSupplierId: number;
  transaction_type: string;
  customerORSupplierType: string;
};

const SelectCustomerOrSupplierReport = ({
  selectedCustomer,
  setSelectedCustomer,
}: {
  selectedCustomer: Transaction | any;
  setSelectedCustomer: Dispatch<SetStateAction<Transaction>> | any;
}) => {
  const { data = [] } = useQuery({
    queryKey: ["fetchCustomersAndSuppliersForREPORTList"],
    queryFn: fetchCustomersAndSuppliersForREPORTList,
    refetchInterval: 2000,
  });

  const [open, setOpen] = useState(false);
  const [value, setValue] = useState("");

  // تحديث القيمة عند تحميل `selectedCustomer`
  useEffect(() => {
    if (selectedCustomer && selectedCustomer.customerORSupplierId) {
      setValue(selectedCustomer.customerORSupplierId.toString());
    } else {
    }
  }, [selectedCustomer]);

  useEffect(() => {
    if (value) {
      handleSaveInSource();
    }
  }, [value]);

  const handleSaveInSource = () => {
    const selectedSource = data.find(
      (item: any) => item.id.toString() === value
    );
    if (selectedSource) {
      if (selectedCustomer) {
        return;
      } else {
        setSelectedCustomer((prev: Transaction) => ({
          ...prev,
          customerORSupplierId: selectedSource.id,
          customerORSupplierType: selectedSource.entity_type,
        }));
      }
    }
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-full justify-between"
        >
          {value
            ? data.find((item: any) => item.id.toString() === value)?.name
            : "أختر عميل..."}
          <CaretSortIcon className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-full p-0">
        <Command>
          <CommandInput placeholder="أبحث عن عميل..." className="h-9" />
          <CommandList>
            <CommandEmpty>لا يوجد عميل.</CommandEmpty>
            <CommandGroup>
              {data.map((item: any, key: number) => (
                <CommandItem
                  key={`${key} ${item.entity_type}`}
                  onSelect={() => {
                    setValue(item.id.toString());
                    setOpen(false);
                    setSelectedCustomer((prev: Transaction) => ({
                      ...prev,
                      customerORSupplierId: item.id,
                      customerORSupplierType: item.entity_type,
                    }));
                  }}
                >
                  {item.entity_type === "supplier" ? "المورد : " : "عميل : "}{" "}
                  {item.name}
                  <CheckIcon
                    className={cn(
                      "ml-auto h-4 w-4",
                      value === item.id.toString() ? "opacity-100" : "opacity-0"
                    )}
                  />
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
};

export default memo(SelectCustomerOrSupplierReport);
