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
import { fetchCustomersAndSuppliersListOrEmployee } from "@/constant/Comon.info";

type Permit = {
  id: string;
  type: "صرف" | "توريد" | "خدمة";
  customerORSupplierId: number;
  customerORSupplierType: string;
  entity_id: number;
  amount: number;
  date: string;
  description: string;
};

const SelectCustomerOrSupplierOrEmployee = ({
  setNewPermit,
  setEditingTransaction,
  newPermit,
  editingTransaction,
}: {
  setNewPermit?: Dispatch<SetStateAction<Permit>> | any;
  setEditingTransaction?: Dispatch<SetStateAction<Permit>> | any;
  newPermit?: Permit | any;
  editingTransaction?: Permit | any;
}) => {
  const { data = [] } = useQuery({
    queryKey: ["fetchCustomersAndSuppliersListOrEmployee"],
    queryFn: fetchCustomersAndSuppliersListOrEmployee,
    refetchInterval: 2000,
  });

  const [open, setOpen] = useState(false);
  const [value, setValue] = useState("");

  // تحديث القيمة عند تحميل `editingTransaction`
  useEffect(() => {
    setValue(
      editingTransaction?.entity_id?.toString() ||
        newPermit?.entity_id?.toString()
    );
  }, [newPermit, editingTransaction]);

  useEffect(() => {
    if (value) {
      handleSaveInSource();
    }
  }, [value]);

  const handleSaveInSource = () => {
    const selectedSource = data.find(
      (item: any) => item?.id?.toString() === value
    );
    if (selectedSource) {
      if (setEditingTransaction) {
        setEditingTransaction((prev: Permit) => ({
          ...prev,
          entity_id: selectedSource.id,
          entity_type: selectedSource.entity_type,
        }));
      } else {
        setNewPermit((prev: Permit) => ({
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
            ? data.find((item: any) => item?.id?.toString() === value)?.name
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
              {data.map((item: any) => (
                <CommandItem
                  key={item?.id}
                  value={item?.id?.toString()}
                  onSelect={() => {
                    setValue(item?.id?.toString());
                    setOpen(false);
                  }}
                >
                  {item?.entity_type === "supplier"
                    ? "المورد : "
                    : item?.entity_type === "customer"
                    ? "عميل : "
                    : "موظف : "}{" "}
                  {item?.name}
                  <CheckIcon
                    className={cn(
                      "ml-auto h-4 w-4",
                      value === item?.id?.toString()
                        ? "opacity-100"
                        : "opacity-0"
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

export default memo(SelectCustomerOrSupplierOrEmployee);
