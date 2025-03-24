/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import { memo, useEffect, useState } from "react";
import DateFilter from "./DateFilter";
import PreViewFastReport from "./PreViewFastReport";
import PreViewFastReportMonth from "./PreViewFastReportMonth";
import PreViewFastReportRange from "./PreViewFastReportRange";

const FastReportComponent = () => {
  const [filterType, setFilterType] = useState("");
  const [dateRange, setDateRange] = useState({
    from: undefined,
    to: undefined,
  });
  const [previewStatus, setPreviewStatus] = useState<boolean>(true);
  const [month, setMonth] = useState<Date | undefined>(undefined);
  const [day, setDay] = useState<Date | undefined>(undefined);
  const [buttonStatus, setButtonStatus] = useState<boolean>(false);

  const handlePreViewReport = () => setButtonStatus(true);
  
  useEffect(() => {
    setButtonStatus(false);
  }, [filterType]);

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

        {filterType == "range" && (
          <PreViewFastReportRange
          dateRange={dateRange}
          previewStatus={previewStatus}
          />
        )}
        {filterType == "month" && (
          <>
            <PreViewFastReportMonth
              month={month}
              previewStatus={previewStatus}
            />
          </>
        )}

        {filterType == "day" && (
          <PreViewFastReport
            day={day}
            previewStatus={previewStatus}
          />
        )}
      </div>
    </>
  );
};
export default memo(FastReportComponent);
