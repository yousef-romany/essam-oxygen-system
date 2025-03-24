/* eslint-disable @typescript-eslint/no-explicit-any */
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { memo } from "react";
import SheetTransactionFastReport from "./SheetTransactionFastReport";
import { useQuery } from "@tanstack/react-query";
import { fetchDayDataBanks, fetchDayDataBridgePoint, fetchDayDataPermits, fetchDayDataTransactions } from "@/constant/fastReport";
import SheetPermitFastReport from "./SheetPermitFastReport";
import SheetBankFastReport from "./SheetBankFastReport";
import SheetBridgePointFastReport from "./SheetBridgePointFastReport";



const PreViewFastReport = ({
  previewStatus,
  day
}: any) => {

  const dayFetchData = useQuery<any>({
    queryKey: ["fetchDayDataTransactions"],
    queryFn: async () => {
      const formattedDate = new Date(day || Date.now())
        .toISOString()
        .split("T")[0];
      return (await fetchDayDataTransactions(formattedDate)) || [];
    },
    refetchInterval: 1500,
  });


  const dayFetchDataPermits = useQuery<any>({
    queryKey: ["fetchDayDataPermits"],
    queryFn: async () => {
      const formattedDate = new Date(day || Date.now())
        .toISOString()
        .split("T")[0];
      return (await fetchDayDataPermits(formattedDate)) || [];
    },
    refetchInterval: 1500,
  });


  const dayFetchDataBanks = useQuery<any>({
    queryKey: ["fetchDayDataBanks"],
    queryFn: async () => {
      const formattedDate = new Date(day || Date.now())
        .toISOString()
        .split("T")[0];
      return (await fetchDayDataBanks(formattedDate)) || [];
    },
    refetchInterval: 1500,
  });


  const dayFetchDataBridgePoint = useQuery<any>({
    queryKey: ["fetchDayDataBridgePoint"],
    queryFn: async () => {
      const formattedDate = new Date(day || Date.now())
        .toISOString()
        .split("T")[0];
      return (await fetchDayDataBridgePoint(formattedDate)) || [];
    },
    refetchInterval: 1500,
  });


  return (
    <>
      {previewStatus && (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mb-6">
          <Card className="flex flex-col">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">
                تقارير المعاملات
              </CardTitle>
            </CardHeader>
            <CardContent className="flex-1">
              <div className="text-2xl font-bold">
                {dayFetchData.data?.length}
              </div>
              <p className="text-xs text-muted-foreground">تقارير متاحة</p>
            </CardContent>
            <div className="p-4 pt-0">
              <SheetTransactionFastReport data={dayFetchData.data} />
            </div>
          </Card>
          <Card className="flex flex-col">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">
                تقارير أذونات الصرف والتوريد والخدمات للعملاء
              </CardTitle>
            </CardHeader>
            <CardContent className="flex-1">
              <div className="text-2xl font-bold">{dayFetchDataPermits.data?.length}</div>
              <p className="text-xs text-muted-foreground">تقارير متاحة</p>
            </CardContent>
            <div className="p-4 pt-0">
              <SheetPermitFastReport data={dayFetchDataPermits.data} />
            </div>
          </Card>
          <Card className="flex flex-col">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">
                تقارير المعاملات البنكيه
              </CardTitle>
            </CardHeader>
            <CardContent className="flex-1">
              <div className="text-2xl font-bold">
                {dayFetchDataBanks.data?.length}
              </div>
              <p className="text-xs text-muted-foreground">تقارير متاحة</p>
            </CardContent>
            <div className="p-4 pt-0">
            <SheetBankFastReport data={dayFetchDataBanks.data} />
            </div>
          </Card>
          <Card className="flex flex-col">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">
                تقارير اسمنت
              </CardTitle>
            </CardHeader>
            <CardContent className="flex-1">
              <div className="text-2xl font-bold">
                {dayFetchDataBridgePoint.data?.length}
              </div>
              <p className="text-xs text-muted-foreground">تقارير متاحة</p>
            </CardContent>
            <div className="p-4 pt-0">
              <SheetBridgePointFastReport data={dayFetchDataBridgePoint.data} />
            </div>
          </Card>
        </div>
      )}
    </>
  );
};
export default memo(PreViewFastReport);
