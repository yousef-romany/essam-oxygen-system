/* eslint-disable @typescript-eslint/no-explicit-any */
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { memo } from "react";
import SheetTransactionFastReport from "./SheetTransactionFastReport";
import { useQuery } from "@tanstack/react-query";
import SheetPermitFastReport from "./SheetPermitFastReport";
import SheetBankFastReport from "./SheetBankFastReport";
import SheetBridgePointFastReport from "./SheetBridgePointFastReport";
import { fetchMonthDataBanksRange, fetchMonthDataBridgePointRange, fetchMonthDataPermitsRange, fetchMonthDataTransactionsRange } from "@/constant/fastReportRange";


const PreViewFastReportRange = ({
    previewStatus,
    dateRange
  }: any) => {
  
    const rangeFetchData = useQuery<any>({
      queryKey: ["fetchMonthDataTransactionsRange"],
      queryFn: async () => {
        const formattedDateFrom = new Date(dateRange.from || Date.now())
        .toISOString()
        .split("T")[0];
      const formattedDateTo = new Date(dateRange.to || Date.now())
        .toISOString()
        .split("T")[0];
            return (
              (await fetchMonthDataTransactionsRange(formattedDateFrom, formattedDateTo)) || []
            );
          },
      refetchInterval: 1500,
    });
  
  
    const rangeFetchDataPermits = useQuery<any>({
      queryKey: ["fetchMonthDataPermitsRange"],
      queryFn: async () => {
        const formattedDateFrom = new Date(dateRange.from || Date.now())
        .toISOString()
        .split("T")[0];
      const formattedDateTo = new Date(dateRange.to || Date.now())
        .toISOString()
        .split("T")[0];
        return (await fetchMonthDataPermitsRange(formattedDateFrom, formattedDateTo)) || [];
      },
      refetchInterval: 1500,
    });
  
  
    const rangeFetchDataBanks = useQuery<any>({
      queryKey: ["fetchMonthDataBanksMonth"],
      queryFn: async () => {
        const formattedDateFrom = new Date(dateRange.from || Date.now())
        .toISOString()
        .split("T")[0];
      const formattedDateTo = new Date(dateRange.to || Date.now())
        .toISOString()
        .split("T")[0];
        return (await fetchMonthDataBanksRange(formattedDateFrom, formattedDateTo)) || [];
      },
      refetchInterval: 1500,
    });
  
  
    const rangeFetchDataBridgePoint = useQuery<any>({
      queryKey: ["fetchDayDataBridgePoint"],
      queryFn: async () => {
        const formattedDateFrom = new Date(dateRange.from || Date.now())
        .toISOString()
        .split("T")[0];
      const formattedDateTo = new Date(dateRange.to || Date.now())
        .toISOString()
        .split("T")[0];
        return (await fetchMonthDataBridgePointRange(formattedDateFrom, formattedDateTo)) || [];
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
                  {rangeFetchData.data?.length}
                </div>
                <p className="text-xs text-muted-foreground">تقارير متاحة</p>
              </CardContent>
              <div className="p-4 pt-0">
                <SheetTransactionFastReport data={rangeFetchData.data} />
              </div>
            </Card>
            <Card className="flex flex-col">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">
                  تقارير أذونات الصرف والتوريد والخدمات للعملاء
                </CardTitle>
              </CardHeader>
              <CardContent className="flex-1">
                <div className="text-2xl font-bold">{rangeFetchDataPermits.data?.length}</div>
                <p className="text-xs text-muted-foreground">تقارير متاحة</p>
              </CardContent>
              <div className="p-4 pt-0">
                <SheetPermitFastReport data={rangeFetchDataPermits.data} />
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
                  {rangeFetchDataBanks.data?.length}
                </div>
                <p className="text-xs text-muted-foreground">تقارير متاحة</p>
              </CardContent>
              <div className="p-4 pt-0">
              <SheetBankFastReport data={rangeFetchDataBanks.data} />
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
                  {rangeFetchDataBridgePoint.data?.length}
                </div>
                <p className="text-xs text-muted-foreground">تقارير متاحة</p>
              </CardContent>
              <div className="p-4 pt-0">
                <SheetBridgePointFastReport data={rangeFetchDataBridgePoint.data} />
              </div>
            </Card>
          </div>
        )}
      </>
    );
}
export default memo(PreViewFastReportRange)