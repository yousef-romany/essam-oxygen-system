/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import { memo, useState } from "react";
import DateFilter from "./DateFilter";
import PreViewFastReport from "./PreViewFastReport";
import { useQuery } from "@tanstack/react-query";
import {
  dayFetchDataConstant,
  monthFetchDataConstant,
  rangeFetchDataConstant,
} from "@/constant/FastReport.Info";
import { formatToYearMonth } from "@/lib/formatDate";

const FastReportComponent = () => {
  const [filterType, setFilterType] = useState("range");
  const [dateRange, setDateRange] = useState({
    from: undefined,
    to: undefined,
  });
  const [month, setMonth] = useState<Date | undefined>(undefined);
  const [day, setDay] = useState<Date | undefined>(undefined);

  const rangeFetchData = useQuery<any[]>({
    queryKey: ["rangeFetchData"],
    queryFn: async () => {
      const formattedDateFrom = new Date(dateRange.from || Date.now())
        .toISOString()
        .split("T")[0];
      const formattedDateTo = new Date(dateRange.to || Date.now())
        .toISOString()
        .split("T")[0];
      return await rangeFetchDataConstant(formattedDateFrom, formattedDateTo);
    },
    refetchInterval: 1500,
    enabled: filterType == "range" ? true : false,
  });

  const monthFetchData = useQuery<any[]>({
    queryKey: ["monthFetchData"],
    queryFn: async () => {
      const formattedDate = new Date(month || Date.now())
        .toISOString()
        .split("T")[0];
      return await monthFetchDataConstant(formatToYearMonth(formattedDate));
    },
    refetchInterval: 1500,
    enabled: filterType == "month" ? true : false,
  });

  const dayFetchData = useQuery<any[]>({
    queryKey: ["dayFetchData"],
    queryFn: async () => {
      const formattedDate = new Date(day || Date.now())
        .toISOString()
        .split("T")[0];

      return await dayFetchDataConstant(formattedDate);
    },
    refetchInterval: 1500,
    enabled: filterType == "day" ? true : false,
  });

  const handlePreViewReport = () => {
    if (filterType == "range") {
      console.log(" rangeFetchData : ", rangeFetchData);
    } else if (filterType == "month") {
      console.log(" monthFetchData : ", monthFetchData);
    } else if (filterType == "day") {
      const formattedDate = new Date(day || Date.now())
        .toISOString()
        .split("T")[0];
      console.log("day : ", formattedDate);
      console.log(" dayFetchData : ", dayFetchData);
    }
  };
  return (
    <>
      <div className="space-y-4">
        <DateFilter
          filterType={filterType}
          setFilterType={setFilterType}
          dateRange={dateRange}
          setDateRange={setDateRange}
          month={month}
          setMonth={setMonth}
          day={day}
          setDay={setDay}
          handlePreViewReport={handlePreViewReport}
        />

        <PreViewFastReport />
      </div>
    </>
  );
};
export default memo(FastReportComponent);
