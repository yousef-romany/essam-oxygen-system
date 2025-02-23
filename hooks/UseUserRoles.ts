/* eslint-disable @typescript-eslint/no-explicit-any */
import { roleDataType } from "@/constant/User.info";
import { useRouter } from "next/navigation";

const UseUserRoles = () => {
  const route = useRouter();
  const saveUserData = (
    id: number,
    userName: string,
    password: string,
    role: roleDataType[]
  ) => {
    localStorage?.setItem("id", `${id}` as string);
    localStorage?.setItem("userName", userName);
    localStorage?.setItem("password", password);

    if (Array.isArray(role)) {
      role?.forEach((item: roleDataType) => {
        localStorage?.setItem(item.dbName, `${item.value}` as string);
      });
      return;
    }
    return;
  };
  const redirectUserByRole = (role?: any) => {
    const theRoute = role?.find((element: any) => element.value == true);
    route.push(theRoute.dbName);
  };

  return {
    saveUserData,
    redirectUserByRole,
  };
};
export default UseUserRoles;
