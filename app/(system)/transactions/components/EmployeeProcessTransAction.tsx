/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import { ChangeEvent, Dispatch, memo, SetStateAction, useState } from "react";
import { CaretSortIcon, CheckIcon } from "@radix-ui/react-icons";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
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
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { employeeDataType } from "@/hooks/UseTransAction";


const EmployeeProcessTransAction = ({
  employee,
  setEmployee,
  paymentEmployee,
  setPaymentEmployee,
  data,
}: {
  employee?: employeeDataType | null;
  setEmployee?: Dispatch<SetStateAction<employeeDataType | null>> | any;

  paymentEmployee: number;
  setPaymentEmployee: Dispatch<SetStateAction<number>>;
  data: any[]
}) => {
  const [open, setOpen] = useState(false);
  return (
    <>
      <div className="flex flex-col gap-3">
        <Label htmlFor="worker">العامل المسؤول</Label>
        <Popover open={open} onOpenChange={setOpen}>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              role="combobox"
              aria-expanded={open}
              className="w-full justify-between"
            >
              {employee
                ? data?.find(
                    (item: employeeDataType) => item.id === employee?.id
                  )?.name
                : "أختر موظف..."}
              <CaretSortIcon className="ml-2 h-4 w-4 shrink-0 opacity-50" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-full p-0">
            <Command>
              <CommandInput placeholder="أبحث عن موظف..." className="h-9" />
              <CommandList>
                <CommandEmpty>لا يوجد موظف.</CommandEmpty>
                <CommandGroup>
                  {data?.map((item: employeeDataType) => (
                    <CommandItem
                      key={item.id}
                      onSelect={() => {
                        setEmployee(item);
                        setOpen(false);
                      }}
                    >
                      {item.name}
                      <CheckIcon
                        className={cn(
                          "ml-auto h-4 w-4",
                          employee?.id === item.id ? "opacity-100" : "opacity-0"
                        )}
                      />
                    </CommandItem>
                  ))}
                </CommandGroup>
              </CommandList>
            </Command>
          </PopoverContent>
        </Popover>
      </div>
      <div>
        <Label htmlFor="amountPaid">المبلغ المدفوع</Label>
        <Input
          id="amountPaid"
          type="number"
          placeholder="أدخل المبلغ المدفوع"
          value={paymentEmployee}
          onChange={(e: ChangeEvent<HTMLInputElement>) => {
            setPaymentEmployee(Number(e.target.value) || 0);
          }}
        />
      </div>
    </>
  );
};
export default memo(EmployeeProcessTransAction);
