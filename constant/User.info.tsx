/* eslint-disable @typescript-eslint/no-explicit-any */
import { toast } from "@/hooks/use-toast";
import db from "@/lib/db";

export type userDataType = {
  id: number;
  userName: string;
  password: string;
  role: roleDataType[];
  date: string;
};
export const roles: roleDataType[] = [
  { value: false, featureName: "مستخدمين", dbName: "users" },
  { value: false, featureName: "الموظفين", dbName: "employees" },
  { value: false, featureName: "الأصناف", dbName: "categories" },
  { value: false, featureName: "الموردين", dbName: "suppliers" },
  { value: false, featureName: "العملاء", dbName: "customers" },
  { value: true, featureName: "إدارة العمليات والخدمات", dbName: "permits" },
  { value: false, featureName: "المخزن", dbName: "inventory" },
  { value: false, featureName: "خزنه", dbName: "safeMoney" },
  { value: false, featureName: "بنوك", dbName: "banks" },
  { value: false, featureName: "المعاملات", dbName: "transactions" },
  { value: false, featureName: "التقارير عملاء و موردين", dbName: "reports" },
  { value: false, featureName: "الأسمنت", dbName: "bridgePoint" },
];
export interface roleDataType {
  featureName: string;
  dbName: string;
  value: boolean;
}

export type userDataForm = {
  userName: string;
  password: string;
  role: roleDataType[];
};

export const dataExampleUsers: userDataType[] = [
  {
    id: 1,
    userName: "yousef",
    password: "1234",
    role: [
      { value: true, featureName: "مستخدمين", dbName: "users" },
      { value: true, featureName: "الموظفين", dbName: "employees" },
      { value: true, featureName: "الأصناف", dbName: "categories" },
      { value: true, featureName: "الموردين", dbName: "suppliers" },
      { value: true, featureName: "العملاء", dbName: "customers" },
      {
        value: true,
        featureName: "إدارة العمليات والخدمات",
        dbName: "permits",
      },
      { value: true, featureName: "المخزن", dbName: "inventory" },
      { value: true, featureName: "خزنه", dbName: "safeMoney" },
      { value: true, featureName: "بنوك", dbName: "banks" },
      { value: true, featureName: "المعاملات", dbName: "transactions" },
      {
        value: true,
        featureName: "التقارير عملاء و موردين",
        dbName: "reports",
      },
      { value: true, featureName: "الأسمنت", dbName: "bridgePoint" },
    ],
    date: "135465564",
  },
];

export const fetchListUsers = async () => {
  const rows = (await db).select("SELECT * FROM users;");
  return rows;
};
export const handleDeleteUser = async (id: number) => {
  (await db)
    .execute("DELETE FROM users WHERE id = ?;", [id])
    .then(() => {
      toast({
        variant: "default",
        title: "تم 🔐",
        description: "تم حذف",
      });
    })
    .catch((error: any) => {
      toast({
        variant: "destructive",
        title: "خطئ",
        description: `حدث خطئ فى استقبال البيانات ${error}`,
      });
    });
};
