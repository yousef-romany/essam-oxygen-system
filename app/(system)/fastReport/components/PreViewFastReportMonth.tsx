/* eslint-disable @typescript-eslint/no-explicit-any */
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { memo } from "react";
import SheetTransactionFastReport from "./SheetTransactionFastReport";
import { useQuery } from "@tanstack/react-query";
import SheetPermitFastReport from "./SheetPermitFastReport";
import SheetBankFastReport from "./SheetBankFastReport";
import SheetBridgePointFastReport from "./SheetBridgePointFastReport";
import { fetchMonthDataBanksMonth, fetchMonthDataBridgePointMonth, fetchMonthDataPermitsMonth, fetchMonthDataTransactionsMonth } from "@/constant/fastReportMonth";
import { formatToYearMonth } from "@/lib/formatDate";

const PreViewFastReportMonth = ({
    previewStatus,
    month
  }: any) => {
  
    const monthFetchData = useQuery<any>({
      queryKey: ["fetchMonthDataTransactionsMonth"],
      queryFn: async () => {
            const formattedDate = new Date(month || Date.now())
              .toISOString()
              .split("T")[0];
            return (
              (await fetchMonthDataTransactionsMonth(formatToYearMonth(formattedDate))) || []
            );
          },
      refetchInterval: 1500,
    });
  
  
    const monthFetchDataPermits = useQuery<any>({
      queryKey: ["fetchDayDataPermits"],
      queryFn: async () => {
        const formattedDate = new Date(month || Date.now())
              .toISOString()
              .split("T")[0];
        return (await fetchMonthDataPermitsMonth(formatToYearMonth(formattedDate))) || [];
      },
      refetchInterval: 1500,
    });
  
  
    const monthFetchDataBanks = useQuery<any>({
      queryKey: ["fetchMonthDataBanksMonth"],
      queryFn: async () => {
        const formattedDate = new Date(month || Date.now())
          .toISOString()
          .split("T")[0];
        return (await fetchMonthDataBanksMonth(formatToYearMonth(formattedDate))) || [];
      },
      refetchInterval: 1500,
    });
  
  
    const monthFetchDataBridgePoint = useQuery<any>({
      queryKey: ["fetchDayDataBridgePoint"],
      queryFn: async () => {
        const formattedDate = new Date(month || Date.now())
          .toISOString()
          .split("T")[0];
        return (await fetchMonthDataBridgePointMonth(formatToYearMonth(formattedDate))) || [];
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
                  {monthFetchData.data?.length}
                </div>
                <p className="text-xs text-muted-foreground">تقارير متاحة</p>
              </CardContent>
              <div className="p-4 pt-0">
                <SheetTransactionFastReport data={monthFetchData.data} />
              </div>
            </Card>
            <Card className="flex flex-col">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">
                  تقارير أذونات الصرف والتوريد والخدمات للعملاء
                </CardTitle>
              </CardHeader>
              <CardContent className="flex-1">
                <div className="text-2xl font-bold">{monthFetchDataPermits.data?.length}</div>
                <p className="text-xs text-muted-foreground">تقارير متاحة</p>
              </CardContent>
              <div className="p-4 pt-0">
                <SheetPermitFastReport data={monthFetchDataPermits.data} />
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
                  {monthFetchDataBanks.data?.length}
                </div>
                <p className="text-xs text-muted-foreground">تقارير متاحة</p>
              </CardContent>
              <div className="p-4 pt-0">
              <SheetBankFastReport data={monthFetchDataBanks.data} />
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
                  {monthFetchDataBridgePoint.data?.length}
                </div>
                <p className="text-xs text-muted-foreground">تقارير متاحة</p>
              </CardContent>
              <div className="p-4 pt-0">
                <SheetBridgePointFastReport data={monthFetchDataBridgePoint.data} />
              </div>
            </Card>
          </div>
        )}
      </>
    );
}
export default memo(PreViewFastReportMonth)