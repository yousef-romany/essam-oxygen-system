"use client";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { memo } from "react";
import ListProcess from "./components/ListProcess";
import CreateProcess from "./components/CreateProcess";
// import { RiArrowLeftRightFill } from "react-icons/ri";

const BridgePointPage = () => {
  return (
    <div className="mx-auto py-0 h-full">
      <div className="flex flex-col space-y-6" dir="rtl">
        <div className="space-y-2">
          <h1 className="text-3xl font-bold tracking-tight flex gap-2">
            {" "}
            {/* <RiArrowLeftRightFill /> نقطه وصل */}
          </h1>
          <p className="text-muted-foreground">
            وساطه تجاريه بين العميل والمورد
          </p>
        </div>

        <Tabs defaultValue="list" className="space-y-4" dir="rtl">
          <TabsList>
            <TabsTrigger value="create">أضف عمليه</TabsTrigger>
            <TabsTrigger value="list">عمليات سابقه</TabsTrigger>
          </TabsList>
          <TabsContent value="list" className="space-y-4">
            <ListProcess />
          </TabsContent>
          <TabsContent value="create" className="space-y-4 px-2">
            <CreateProcess />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};
export default memo(BridgePointPage);
