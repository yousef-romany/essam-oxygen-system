import { memo } from "react";
import AddNewUser from "./components/AddNewUser";
import UsersTable from "./components/UsersTable";

const UsersPage = () => {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">المستخدمين</h1>
        
        <AddNewUser />
      </div>
      <UsersTable />
    </div>
  );
};
export default memo(UsersPage);
