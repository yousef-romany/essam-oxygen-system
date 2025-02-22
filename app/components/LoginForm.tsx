"use client";

import type React from "react";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import UseUserRoles from "@/hooks/UseUserRoles";
import { dataExampleUsers, userDataType } from "@/constant/User.info";
import { toast } from "@/hooks/use-toast";
// import { decodeRole } from "@/lib/decodeRole";

export function LoginForm() {
  const [userName, setUserName] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const { saveUserData, redirectUserByRole } = UseUserRoles();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");
    const userName: string = e.target["userName"].value;
    const password: string = e.target["password"].value;

    const userData: userDataType = dataExampleUsers.find(
      (element: userDataType) =>
        element.userName == userName && element.password == password
    );
    // Here you would typically send a request to your authentication API
    // For this example, we'll just do a simple check
    if (userData) {
      // Successful login
      saveUserData(
        userData.id,
        userData.userName,
        userData.password,
        // decodeRole(userData?.role)
        userData?.role
      );
      // redirectUserByRole(decodeRole(userData.role));
      redirectUserByRole(userData.role);
      toast({
        variant: "default",
        title: "تم 🔐",
        description: "جارى التحويل",
      });
      return;
    } else {
      toast({
        variant: "destructive",
        title: "خطئ",
        description: " اسم مستخدم أو كلمة المرور غير صحيحة",
      });
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>تسجيل الدخول إلى حسابك</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit}>
          <div className="grid w-full items-center gap-4">
            <div className="flex flex-col space-y-1.5">
              <Label htmlFor="userName">البريد الإلكتروني</Label>
              <Input
                id="userName"
                type="userName"
                placeholder="أدخل بريدك الإلكتروني"
                value={userName}
                onChange={(e) => setUserName(e.target.value)}
                required
              />
            </div>
            <div className="flex flex-col space-y-1.5">
              <Label htmlFor="password">كلمة المرور</Label>
              <Input
                id="password"
                type="password"
                placeholder="أدخل كلمة المرور"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
          </div>
          {error && (
            <Alert variant="destructive" className="mt-4">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
          <CardFooter className="flex justify-between mt-4 px-0">
            <Button type="submit" className="w-full">
              تسجيل الدخول
            </Button>
          </CardFooter>
        </form>
      </CardContent>
    </Card>
  );
}
