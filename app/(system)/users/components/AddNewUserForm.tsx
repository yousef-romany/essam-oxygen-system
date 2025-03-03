import { Dispatch, memo, SetStateAction, useState } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  roleDataType,
  userDataForm,
} from "@/constant/User.info";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { toast } from "@/hooks/use-toast";
import db from "@/lib/db";

const AddNewUserForm = ({
  sheetCollapse,
}: {
  sheetCollapse: Dispatch<SetStateAction<boolean>>;
}) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<userDataForm>();
  const onSubmit: SubmitHandler<userDataForm> = async (data: userDataForm) => {
    if (
      roleState.some((user: roleDataType) => user.value) &&
      userEffect.some((user: roleDataType) => user.value)
    ) {
      (await db)
        .execute(
          "INSERT INTO users (userName, password, role, date) VALUES (?, ?, ?, ?)",
          [
            data.userName,
            data.password,
            [...roleState, ...userEffect],
            Date.now(),
          ]
        )
        .then(() => {
          sheetCollapse(false);
          toast({
            variant: "default",
            title: "تم 🔐",
            description: "تم الاضافه",
          });
        })
        .catch((error: Error) => {
          toast({
            variant: "destructive",
            title: "خطئ فى قواعد البيانات",
            description: `${error}`,
          });
        });
      sheetCollapse(false);
      return;
    } else {
      toast({
        variant: "destructive",
        title: "معلومات مفقوده",
        description: "رجاء أختر صلحيات المستخدم و تأثيره على نظام",
      });
      return;
    }
  };

  const [roleState, setRoleState] = useState<roleDataType[]>([
    { value: false, featureName: "مستخدمين", dbName: "users" },
    { value: false, featureName: "الموظفين", dbName: "employees" },
    { value: false, featureName: "الأصناف", dbName: "categories" },
    { value: false, featureName: "الموردين", dbName: "suppliers" },
    { value: false, featureName: "العملاء", dbName: "customers" },
    { value: false, featureName: "إدارة العمليات والخدمات", dbName: "permits" },
    { value: false, featureName: "المخزن", dbName: "inventory" },
    { value: false, featureName: "خزنه", dbName: "safeMoney" },
    { value: false, featureName: "بنوك", dbName: "banks" },
    { value: false, featureName: "المعاملات", dbName: "transactions" },
    { value: false, featureName: "التقارير عملاء و موردين", dbName: "reports" },
    { value: false, featureName: "الأسمنت", dbName: "bridgePoint" },
  ]);
  const [userEffect, setUserEffect] = useState<roleDataType[]>([
    { value: false, featureName: "تعديل", dbName: "update" },
    { value: false, featureName: "أضافه", dbName: "add" },
    { value: false, featureName: "حذف", dbName: "delete" },
  ]);
  const handleCheckboxChange = (dbName: string, checked: boolean) => {
    setRoleState((prevRoleState) =>
      prevRoleState.map((item) =>
        item.dbName === dbName ? { ...item, value: checked } : item
      )
    );
  };
  const handleCheckboxEffectUserChange = (dbName: string, checked: boolean) => {
    setUserEffect((prevRoleState) =>
      prevRoleState.map((item) =>
        item.dbName === dbName ? { ...item, value: checked } : item
      )
    );
  };
  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
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
          placeholder="كلمه المرور"
        />
      </div>

      <div className="flex flex-wrap gap-3">
        {roleState.map((item: roleDataType, key: number) => (
          <div key={key} className="flex items-center gap-x-2">
            <Checkbox
              id={item.dbName}
              checked={item.value}
              onCheckedChange={(event: boolean) => {
                handleCheckboxChange(item.dbName, event);
              }}
            />
            <label
              htmlFor={item.dbName}
              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
            >
              {item.featureName}
            </label>
          </div>
        ))}
        <Separator />
        <Badge variant={"destructive"}>تحذير كل صفحات له نفس تأثير</Badge>
        <div className="w-full flex flex-wrap gap-5">
          {userEffect.map((item: roleDataType, key: number) => (
            <div key={key} className="flex items-center gap-x-2">
              <Checkbox
                id={item.dbName}
                checked={item.value}
                onCheckedChange={(event: boolean) =>
                  handleCheckboxEffectUserChange(item.dbName, event)
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
      </div>

      {errors.userName && (
        <p className="text-destructive">{errors.userName.message}</p>
      )}
      {errors.password && (
        <p className="text-destructive">{errors.password.message}</p>
      )}

      <Button type="submit">تسجيل</Button>
    </form>
  );
};
export default memo(AddNewUserForm);
