"use client";
import { useState } from "react";
import { Sidebar } from "../components/Sidebar";

const MainLayout = ({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) => {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)

  return (
    <div className="w-full h-screen flex">
        <Sidebar collapsed={sidebarCollapsed} onToggle={() => setSidebarCollapsed(!sidebarCollapsed)} />
      <main className="flex-1 overflow-y-auto p-8">{children}</main>
    </div>
  );
};
export default MainLayout;
