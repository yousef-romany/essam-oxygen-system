import Link from "next/link";
import {
  Package,
  Users,
  Truck,
  FileText,
  Blinds,
  ChevronRight,
  ChevronLeft,
  DollarSign,
  ShoppingBasket,
  FileDown,
  Luggage,
  HardHat,
  UserRoundCog,
  Database,
} from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { ModeToggle } from "@/components/ModeToggle";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useEffect, useState } from "react";

const navItems = [
  {
    featureName: "المستخدمين",
    dbName: "users",
    href: "/users",
    icon: UserRoundCog,
  },
  {
    featureName: "الموظفين",
    dbName: "employees",
    href: "/employees",
    icon: HardHat,
  },
  {
    featureName: "الأصناف",
    href: "/categories",
    dbName: "categories",
    icon: ShoppingBasket,
  },
  {
    featureName: "المخزون",
    dbName: "inventory",
    href: "/inventory",
    icon: Package,
  },
  {
    featureName: "الخزينة",
    dbName: "safeMoney",
    href: "/safeMoney",
    icon: DollarSign,
  },
  {
    featureName: "الموردون",
    dbName: "suppliers",
    href: "/suppliers",
    icon: Truck,
  },
  {
    featureName: "العملاء",
    dbName: "customers",
    href: "/customers",
    icon: Users,
  },
  {
    featureName: "المعاملات",
    dbName: "transactions",
    href: "/transactions",
    icon: FileText,
  },
  {
    featureName: "إدارة العمليات والخدمات",
    dbName: "permits",
    href: "/permits",
    icon: Blinds,
  },
  {
    featureName: "بنوك",
    dbName: "banks",
    href: "/banks",
    icon: FileText,
  },
  {
    featureName: "التقارير عملاء و موردين",
    dbName: "reports",
    href: "/reports",
    icon: FileDown,
  },
  
  {
    featureName: "التقارير سريعه",
    dbName: "fastReport",
    href: "/fastReport",
    icon: FileDown,
  },
  {
    featureName: "الأسمنت",
    dbName: "bridgePoint",
    href: "/bridgePoint",
    icon: Luggage,
  },
];

interface SidebarProps {
  collapsed: boolean;
  onToggle: () => void;
}
export function Sidebar({ collapsed, onToggle }: SidebarProps) {
  const [storedItems, setStoredItems] = useState<{ [key: string]: boolean }>(
    {}
  );

  useEffect(() => {
    const data: { [key: string]: boolean } = {};
    navItems.forEach((item) => {
      data[item.dbName] = localStorage.getItem(item.dbName) === "true";
    });
    setStoredItems(data);
  }, []);
  return (
    <div
      className={cn(
        "flex flex-col bg-muted border-l transition-all duration-300 ease-in-out relative",
        collapsed ? "w-16" : "w-64"
      )}
    >
      <div className="p-4">
        {!collapsed && (
          <h1 className="text-2xl font-bold">متتبع أسطوانات الغاز</h1>
        )}
      </div>
      <Button
        className="absolute left-[-2rem] bg-muted rounded-tr-none rounded-br-none"
        variant="ghost"
        size="icon"
        onClick={onToggle}
      >
        {collapsed ? (
          <ChevronRight className="h-4 w-4" />
        ) : (
          <ChevronLeft className="h-4 w-4" />
        )}
      </Button>
      <nav className="flex-1">
        {navItems.map((item) => {
          return storedItems[item.dbName] ? (
            <TooltipProvider key={item.featureName}>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Link
                    key={item.featureName}
                    href={`${item.href}` as string}
                    className={cn(
                      "flex items-center px-4 py-2 text-foreground hover:bg-accent hover:text-accent-foreground",
                      collapsed && "justify-center"
                    )}
                  >
                    <item.icon
                      className={cn("w-5 h-5", collapsed ? "ml-0" : "ml-3")}
                    />

                    {!collapsed && item.featureName}
                  </Link>
                </TooltipTrigger>
                <TooltipContent>
                  <p>{item.featureName}</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          ) : null;
        })}
      </nav>
      <ModeToggle />
    </div>
  );
}
