/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import { format } from "date-fns";
import { ar } from "date-fns/locale";
import { CalendarIcon } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

export default function DateFilter({
  filterType,
  setFilterType,
  dateRange,
  setDateRange,
  month,
  setMonth,
  day,
  setDay,
  handlePreViewReport,
}: {
  filterType: any;
  setFilterType: any;
  dateRange: any;
  setDateRange: any;
  month: any;
  setMonth: any;
  day: any;
  setDay: any;
  handlePreViewReport: () => void;
}) {
  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle className="text-right">تصفية حسب التاريخ</CardTitle>
        <CardDescription className="text-right">
          اختر نوع التصفية المناسب لاحتياجاتك
        </CardDescription>
      </CardHeader>
      <CardContent dir="rtl">
        <div className="space-y-6" dir="rtl">
          <RadioGroup
            onValueChange={setFilterType}
            className="flex flex-col space-y-2"
            dir="rtl"
          >
            <div className="flex items-center space-x-2 space-x-reverse">
              <RadioGroupItem value="range" id="range" />
              <Label htmlFor="range" className="text-right">
                نطاق تاريخ (من - إلى)
              </Label>
            </div>
            <div className="flex items-center space-x-2 space-x-reverse">
              <RadioGroupItem value="month" id="month" />
              <Label htmlFor="month" className="text-right">
                تصفية حسب الشهر
              </Label>
            </div>
            <div className="flex items-center space-x-2 space-x-reverse">
              <RadioGroupItem value="day" id="day" />
              <Label htmlFor="day" className="text-right">
                تصفية حسب اليوم
              </Label>
            </div>
          </RadioGroup>

          {filterType === "range" && (
            <div className="flex flex-col space-y-4">
              {/* من تاريخ */}
              <div className="grid gap-2">
                <Label htmlFor="from" className="text-right">
                  من تاريخ
                </Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      id="from"
                      variant="outline"
                      className={cn(
                        "w-full justify-between text-right",
                        !dateRange.from && "text-muted-foreground"
                      )}
                    >
                      {dateRange.from ? (
                        format(dateRange.from, "PPP", { locale: ar })
                      ) : (
                        <span>اختر تاريخ البداية</span>
                      )}
                      <CalendarIcon className="ml-2 h-4 w-4" />
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={dateRange.from}
                      onSelect={(date) => {
                        if (date) {
                          const adjustedFrom = new Date(date);
                          adjustedFrom.setHours(12, 0, 0, 0); // ضبط الساعة 12 ظهرًا
                          setDateRange((prev: any) => ({
                            ...prev,
                            from: adjustedFrom,
                            to:
                              prev.to && prev.to < adjustedFrom
                                ? adjustedFrom
                                : prev.to, // التأكد أن `to` ليس قبل `from`
                          }));
                        }
                      }}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>

              {/* إلى تاريخ */}
              <div className="grid gap-2">
                <Label htmlFor="to" className="text-right">
                  إلى تاريخ
                </Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      id="to"
                      variant="outline"
                      className={cn(
                        "w-full justify-between text-right",
                        !dateRange.to && "text-muted-foreground"
                      )}
                    >
                      {dateRange.to ? (
                        format(dateRange.to, "PPP", { locale: ar })
                      ) : (
                        <span>اختر تاريخ النهاية</span>
                      )}
                      <CalendarIcon className="ml-2 h-4 w-4" />
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={dateRange.to}
                      onSelect={(date) => {
                        if (date && date >= dateRange.from) {
                          const adjustedTo = new Date(date);
                          adjustedTo.setHours(12, 0, 0, 0); // ضبط الساعة 12 ظهرًا
                          setDateRange((prev: any) => ({
                            ...prev,
                            to: adjustedTo,
                          }));
                        }
                      }}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>
            </div>
          )}

          {filterType === "month" && (
            <div className="grid gap-2">
              <Label htmlFor="month-select" className="text-right">
                اختر الشهر
              </Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    id="month-select"
                    variant="outline"
                    className={cn(
                      "w-full justify-between text-right",
                      !month && "text-muted-foreground"
                    )}
                  >
                    {month ? (
                      format(month, "MMMM yyyy", { locale: ar })
                    ) : (
                      <span>اختر الشهر</span>
                    )}
                    <CalendarIcon className="ml-2 h-4 w-4" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={month}
                    onSelect={(date) => {
                      if (date) {
                        const adjustedDate = new Date(date);
                        adjustedDate.setDate(1); // ضبط اليوم ليكون الأول من الشهر
                        adjustedDate.setHours(12, 0, 0, 0); // ضبط الساعة 12 ظهرًا
                        setMonth(adjustedDate);
                      }
                    }}
                    initialFocus
                    locale={ar}
                  />
                </PopoverContent>
              </Popover>
            </div>
          )}

          {filterType === "day" && (
            <div className="grid gap-2">
              <Label htmlFor="day-select" className="text-right">
                اختر اليوم
              </Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    id="day-select"
                    variant="outline"
                    className={cn(
                      "w-full justify-between text-right",
                      !day && "text-muted-foreground"
                    )}
                  >
                    {day ? (
                      format(day, "dd MMMM yyyy", { locale: ar })
                    ) : (
                      <span>اختر اليوم</span>
                    )}
                    <CalendarIcon className="ml-2 h-4 w-4" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={day}
                    onSelect={(date) => {
                      if (date) {
                        const adjustedDate = new Date(date);
                        adjustedDate.setHours(12, 0, 0, 0); // ضبط الساعة 12 ظهرًا
                        setDay(adjustedDate);
                      }
                    }}
                    initialFocus
                    locale={ar}
                  />
                </PopoverContent>
              </Popover>
            </div>
          )}

          <Button className="w-full" onClick={handlePreViewReport}>
            تطبيق التصفية
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
