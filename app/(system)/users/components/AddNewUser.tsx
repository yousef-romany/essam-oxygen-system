"use client";
import React, { memo, useState } from "react";

import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { PlusCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import AddNewUserForm from "./AddNewUserForm";

const AddNewUser = () => {
  const [stateSheet, setStateSheet] = useState(false);

   
  return (
    <Sheet open={stateSheet} onOpenChange={setStateSheet}>
      <SheetTrigger asChild>
        <Button variant="outline"  >
          <PlusCircle className="ml-2 h-4 w-4" /> إضافة مستخدم
        </Button>
      </SheetTrigger>
      <SheetContent className="bg-card">
        <SheetHeader>
          <SheetTitle>أضف مستخدم</SheetTitle>
          <SheetDescription>
            قم بإجراء إضافه مستخدم إلى قاعدة البيانات الخاصة بك هنا. انقر على
            حفظ عند الانتهاء.
          </SheetDescription>
        </SheetHeader>
        <AddNewUserForm sheetCollapse={setStateSheet} />
      </SheetContent>
    </Sheet>
  );
};

export default memo(AddNewUser);
