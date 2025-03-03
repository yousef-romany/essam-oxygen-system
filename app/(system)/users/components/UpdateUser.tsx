/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { userDataForm, userDataType } from "@/constant/User.info";
import { toast } from "@/hooks/use-toast";
import db from "@/lib/db";
import { decodeRole } from "@/lib/decodeRole";
import { memo, useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";

const UpdateUser = ({ id, userName, password, date, role }: userDataType) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<userDataForm>();
  const roleData = decodeRole(role);
  const [roleState, setRoleState] = useState(roleData);

  const handleCheckboxChange = (dbName: any, checked: any) => {
    setRoleState((prevRoleState: any) =>
      prevRoleState.map((item: any) =>
        item.dbName === dbName ? { ...item, value: checked } : item
      )
    );
  };
  const onSubmit: SubmitHandler<userDataForm> = async (data) => {
    (await db)
      .execute(
        "UPDATE users SET userName = ?, password = ?, role = ?, date = ? WHERE id = ?",
        [data.userName, data.password, roleState, Date.now() || date, id]
      )
      .then(() => {
        toast({
          variant: "default",
          title: "تم 🔐",
          description: "تم تعديل",
        });
      })
      .catch((error: any) => {
        toast({
          variant: "destructive",
          title: "خطئ",
          description: "حدث خطئ فى استقبال البيانات",
        });
        console.log(error);
      });
  };
  const updateRole = localStorage.getItem("update");
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant={"secondary"} className="w-full">
          تعديل
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px] bg-card" dir="rtl">
        <DialogHeader dir="ltr">
          <DialogTitle>تعديل البيانات</DialogTitle>
          <DialogDescription>عدل بيانات المستخدم</DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="flex flex-wrap gap-3">
            <div className="grid w-full max-w-sm items-center gap-1.5">
              <Label htmlFor="userName">اسم مستخدم</Label>
              <Input
                {...register("userName", {
                  required: "اسم مستخدم مطلوب .",
                  pattern: {
                    value:
                      /^[\u0600-\u06FF\u0750-\u077F\u08A0-\u08FF\uFB50-\uFDFF\uFE70-\uFEFF\u0660-\u0669A-Za-z\s]+$/,
                    message: "رجاء أدخل أحرف فقط",
                  },
                })}
                defaultValue={userName}
                placeholder="اسم مستخدم"
              />
            </div>

            <div className="grid w-full max-w-sm items-center gap-1.5">
              <Label htmlFor="password">كلمه المرور</Label>
              <Input
                {...register("password", {
                  pattern: {
                    value: /^[A-Za-z\u0600-\u06FF\0-9]+$/,
                    message: "رجاء أدخل أرقام فقط",
                  },
                })}
                defaultValue={password}
                placeholder="كلمه المرور"
              />
            </div>
            {roleState?.map((item: any, key: number) => (
              <div key={key} className="flex items-center gap-x-2">
                <Checkbox
                  id={item.dbName}
                  checked={item.value}
                  onCheckedChange={(event) =>
                    handleCheckboxChange(item.dbName, event)
                  }
                />
                <label
                  htmlFor={item.dbName}
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                  {item.featureName}
                </label>
              </div>
            ))}
          </div>
          {errors.userName && (
            <p className="text-destructive">{errors.userName.message}</p>
          )}
          {errors.password && (
            <p className="text-destructive">{errors.password.message}</p>
          )}
          <DialogFooter dir="rtl" className="flex !items-start">
            <Button
              type="submit"
              disabled={updateRole == "false" ? true : false}
            >
              حفظ
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};
export default memo(UpdateUser);
