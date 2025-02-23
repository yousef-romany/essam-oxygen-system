"use client";

import type React from "react";

import { useEffect, useState } from "react";
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
import { fetchListUsers, userDataType } from "@/constant/User.info";
import { toast } from "@/hooks/use-toast";
import { useQuery } from "@tanstack/react-query";
import { LoadingSpinner } from "@/components/LoadingSpinner";
import { ErrorDisplay } from "@/components/ErrorDisplay";
import { decodeRole } from "@/lib/decodeRole";

export function LoginForm() {
  const [userName, setUserName] = useState("");
  const [password, setPassword] = useState("");
  const [errorFront, setErrorFront] = useState("");
  const [enabled, setEnabled] = useState(false);
  useEffect(() => {
    setEnabled(true);
  });
  const { saveUserData, redirectUserByRole } = UseUserRoles();
  const { isLoading, isError, data, error } = useQuery<
    { data: userDataType[] },
    Error
  >({
    queryKey: ["fetchUsersList"],
    queryFn: fetchListUsers,
    refetchInterval: 1000,
    enabled,
  });
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setErrorFront("");
    const userName: string = e.target["userName"].value;
    const password: string = e.target["password"].value;


    const userData: userDataType =
      data &&
      data?.find(
        (element: userDataType) =>
          element.userName == userName && element.password == password
      );

      console.log(userData)
    // Here you would typically send a request to your authentication API
    // For this example, we'll just do a simple check
    if (userData) {
      // Successful login
      saveUserData(
        userData.id,
        userData.userName,
        userData.password,
        decodeRole(userData?.role)
      );
      redirectUserByRole(decodeRole(userData.role));
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
  if (isLoading) {
    return <LoadingSpinner />;
  }
  if (isError) {
    return <ErrorDisplay message={error.message} />;
  }
  if (error) {
    return <ErrorDisplay message={"Error"} />;
  }
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
          {errorFront && (
            <Alert variant="destructive" className="mt-4">
              <AlertDescription>{errorFront}</AlertDescription>
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
