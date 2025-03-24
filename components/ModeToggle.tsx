"use client";

import * as React from "react";
import { MoonIcon, SunIcon } from "@radix-ui/react-icons";
import { useTheme } from "next-themes";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { invoke } from "@tauri-apps/api/tauri";
import { open } from "@tauri-apps/api/dialog";
import { toast } from "@/hooks/use-toast";
import { Database } from "lucide-react";


export function ModeToggle() {
  const { setTheme } = useTheme();

  const handleGetBackUp = async () => {
      try {
        const selectedPath = await open({
          directory: true, // Opens a folder picker
          multiple: false, // Allow only single folder selection
          title: "Select a Folder",
        });
        await invoke("backup_mysql_database", {
          path: selectedPath,
        });
        console.log("select path : ", selectedPath);
        toast({
          variant: "default",
          title: "تم",
          description: "تمت عمليه بنجاح !",
        });
      } catch (error: any) {
        if (
          error.trim() ==
          "invalid args `path` for command `backup_mysql_database`: invalid type: null, expected a string".trim()
        ) {
          toast({
            variant: "destructive",
            title: "حدث خطئ",
            description: `رجاء اختيار مكان حفظ ملف الاحتياطى`,
          });
        } else {
          console.error("Failed to create backup:", error);
          toast({
            variant: "destructive",
            title: "حدث خطئ",
            description: `${error}`,
          });
        }
      }
    };

  return (
    <div className="p-4 space-y-2">
      <DropdownMenu dir="rtl">
        <DropdownMenuTrigger className="w-full" asChild>
          <Button variant="outline" size="icon">
            <SunIcon className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
            <MoonIcon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
            <span className="sr-only">Toggle theme</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="center" className="w-full">
          <DropdownMenuItem onClick={() => setTheme("light")}>
            فاتح
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => setTheme("dark")}>
            غامق
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => setTheme("system")}>
            نظام
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
      <Button variant="destructive" size="icon" className="w-full" onClick={handleGetBackUp}>
        <Database />
      </Button>
    </div>
  );
}
