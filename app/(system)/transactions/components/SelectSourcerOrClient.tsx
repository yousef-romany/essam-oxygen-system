/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import { Label } from "@/components/ui/label";
import { Dispatch, memo, SetStateAction, useState } from "react";
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
import { CaretSortIcon, CheckIcon } from "@radix-ui/react-icons";
import { sourcerOrClientDataType } from "@/hooks/UseTransAction";
import { cn } from "@/lib/utils";

const SelectSourcerOrClient = ({
  transactionType,
  sourcerOrClient,
  setSourcerOrClient,
  data,
  setEntity_type
}: {
  transactionType: string;
  sourcerOrClient?: sourcerOrClientDataType | null;
  setSourcerOrClient?:
    | Dispatch<SetStateAction<sourcerOrClientDataType | null>>
    | any;
  data: sourcerOrClientDataType[];
  setEntity_type: Dispatch<SetStateAction<"customer" | "supplier" | "else">>
}) => {
  const [open, setOpen] = useState(false);
  return (
    <div>
      <Label htmlFor="name">
        {transactionType == "شراء"
          ? "اسم المورد"
          : transactionType == "بيع"
          ? "اسم عميل"
          : "اسم عميل / مورد"}
      </Label>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={open}
            className="w-full justify-between"
          >
            {sourcerOrClient
              ? data?.find(
                  (item: sourcerOrClientDataType) =>
                    item.id === sourcerOrClient?.id
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
                {data
                  ?.filter((element: sourcerOrClientDataType) => {
                    if (transactionType === "إرجاع") {
                      return true;
                    } else if (transactionType === "شراء") {
                      return element.entity_type === "supplier" || element.entity_type === "else";
                    } else {
                      return element.entity_type === "customer" || element.entity_type === "else";
                    }
                  })
                  ?.map((item: sourcerOrClientDataType, key: number) => (
                    <CommandItem
                      key={key}
                      onSelect={() => {
                        setSourcerOrClient(item);
                        setEntity_type(item.entity_type)
                        setOpen(false);
                      }}
                    >
                      {item.name}
                      <CheckIcon
                        className={cn(
                          "ml-auto h-4 w-4",
                          sourcerOrClient?. id === item.id
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
    </div>
  );
};
export default memo(SelectSourcerOrClient);
