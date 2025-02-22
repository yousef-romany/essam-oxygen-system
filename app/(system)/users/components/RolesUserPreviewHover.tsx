"use client";
import { CalendarIcon } from "@radix-ui/react-icons";

import { Button } from "@/components/ui/button";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";
import { roleDataType } from "@/constant/User.info";
import { formatDate } from "@/lib/formatDate";
import { CheckCircle, ShieldX } from "lucide-react";
import { memo } from "react";
import { cn } from "@/lib/utils";
import { Separator } from "@/components/ui/separator";
// import { decodeRole } from "@/lib/decodeRole";

const RolesUserPreviewHover = ({
  data,
  date,
}: {
  data: roleDataType[];
  date: string;
}) => {
  //   const dataPreview: roleDataType[] = decodeRole(data);
  return (
    <HoverCard>
      <HoverCardTrigger asChild>
        <Button variant="link">@صلحيات</Button>
      </HoverCardTrigger>
      <HoverCardContent className="w-80">
        <div className="flex justify-between items-center space-x-4 w-full">
          <div className="space-y-1 w-full">
            <h4 className="text-sm font-semibold">@تفصيل عن صلحيات</h4>
            <ul className="flex flex-col items-start w-full gap-1">
              {data
                ?.filter((element: roleDataType) => element.value == true)
                ?.map((item: roleDataType, key: number) => (
                  <li
                    key={key}
                    className="list-disc list-inside flex gap-1 text-destructive"
                  >
                    <CheckCircle
                      className={cn("h-5 w-5")}
                      color={
                        item.featureName == "تعديل" ||
                        item.featureName == "أضافه" ||
                        item.featureName == "حذف"
                          ? "red"
                          : ""
                      }
                    />

                    {item.featureName}
                  </li>
                ))}
              <Separator />
              {data
                ?.filter((element: roleDataType) => element.value == false)
                ?.map((item: roleDataType, key: number) => (
                  <li
                    key={key}
                    className="list-disc list-inside flex gap-1 text-destructive"
                  >
                    <ShieldX
                      className={cn("h-5 w-5")}
                      color={
                        item.featureName == "تعديل" ||
                        item.featureName == "أضافه" ||
                        item.featureName == "حذف"
                          ? "red"
                          : ""
                      }
                    />
                    {item.featureName}
                  </li>
                ))}
            </ul>
            <div className="flex items-center pt-2 gap-2">
              <CalendarIcon className="mr-2 h-4 w-4 opacity-70" />{" "}
              <span className="text-xs text-muted-foreground">
                تاريخ الانشاء {formatDate(date)}
              </span>
            </div>
          </div>
        </div>
      </HoverCardContent>
    </HoverCard>
  );
};

export default memo(RolesUserPreviewHover);
