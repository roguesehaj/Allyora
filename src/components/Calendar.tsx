import { Card } from "@/components/ui/card";
import { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { getOvulationAndFertileDates } from "@/utils/predict";
import type { Entry, Prediction } from "@/types";

interface CalendarProps {
  entries: Entry[];
  prediction: Prediction | null;
}

// Droplet Icon Component
const DropletIcon = ({ filled = false, className, day, size = "w-8 h-8" }: { filled?: boolean; className?: string; day?: number; size?: string }) => {
  const dropletPath = "M12 2.69l5.66 5.66a8 8 0 1 1-11.31 0z";
  return (
    <div className={cn("relative flex items-center justify-center", size)}>
      <svg
        viewBox="0 0 24 24"
        fill={filled ? "currentColor" : "none"}
        stroke="currentColor"
        strokeWidth={filled ? 0 : 1.5}
        className={cn("absolute inset-0", className)}
      >
        <path d={dropletPath} />
      </svg>
      {day !== undefined && (
        <span className={cn(
          "absolute text-xs font-semibold leading-none",
          filled ? "text-white" : "text-gray-700"
        )}>
          {day}
        </span>
      )}
    </div>
  );
};

export function Calendar({ entries, prediction }: CalendarProps) {
  const [currentMonth, setCurrentMonth] = useState(new Date());

  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    
    // Get starting day of week (0 = Sunday, 1 = Monday, etc.)
    // Adjust to start from Monday (0 = Monday, 6 = Sunday)
    let startingDayOfWeek = firstDay.getDay();
    startingDayOfWeek = startingDayOfWeek === 0 ? 6 : startingDayOfWeek - 1; // Convert to Monday-based (0-6)

    return { daysInMonth, startingDayOfWeek, year, month };
  };

  const { daysInMonth, startingDayOfWeek, year, month } = getDaysInMonth(currentMonth);

  // Get entry dates
  const entryDates = new Set(entries.map(e => e.date));
  
  // Get prediction dates
  const predDates = new Set<string>();
  if (prediction) {
    const predStart = new Date(prediction.earliest);
    const predEnd = new Date(prediction.latest);
    for (let d = new Date(predStart); d <= predEnd; d.setDate(d.getDate() + 1)) {
      predDates.add(d.toISOString().slice(0, 10));
    }
  }
  
  // Get ovulation and fertile dates
  const entryStartDates = entries.map(e => e.date).sort();
  const { ovulationDates, fertileDates } = getOvulationAndFertileDates(entryStartDates, prediction);

  const formatDate = (year: number, month: number, day: number): string => {
    return `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
  };

  const isEntry = (dateStr: string) => entryDates.has(dateStr);
  const isPred = (dateStr: string) => predDates.has(dateStr) && !entryDates.has(dateStr);
  const isOvulation = (dateStr: string) => ovulationDates.has(dateStr) && !entryDates.has(dateStr) && !predDates.has(dateStr);
  const isFertile = (dateStr: string) => fertileDates.has(dateStr) && !entryDates.has(dateStr) && !predDates.has(dateStr) && !ovulationDates.has(dateStr);
  
  const today = new Date();
  const isTodayDate = (year: number, month: number, day: number) => {
    return (
      day === today.getDate() &&
      month === today.getMonth() &&
      year === today.getFullYear()
    );
  };

  const prevMonth = () => {
    setCurrentMonth(new Date(year, month - 1));
  };

  const nextMonth = () => {
    setCurrentMonth(new Date(year, month + 1));
  };

  const monthName = currentMonth.toLocaleDateString("en-US", { month: "long", year: "numeric" });

  // Calculate days to show (6 weeks = 42 days)
  const daysToShow: Array<{ day: number; isCurrent: boolean; dateStr: string }> = [];
  
  // Previous month days
  const prevMonthLastDay = new Date(year, month, 0).getDate();
  for (let i = startingDayOfWeek - 1; i >= 0; i--) {
    const day = prevMonthLastDay - i;
    const dateStr = formatDate(year, month - 1, day);
    daysToShow.push({ day, isCurrent: false, dateStr });
  }
  
  // Current month days
  for (let day = 1; day <= daysInMonth; day++) {
    const dateStr = formatDate(year, month, day);
    daysToShow.push({ day, isCurrent: true, dateStr });
  }
  
  // Next month days (fill to 42 total)
  const remainingDays = 42 - daysToShow.length;
  for (let day = 1; day <= remainingDays; day++) {
    const dateStr = formatDate(year, month + 1, day);
    daysToShow.push({ day, isCurrent: false, dateStr });
  }

  return (
    <Card className="p-6 space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="font-semibold">{monthName}</h3>
        <div className="flex gap-1">
          <Button variant="ghost" size="icon" onClick={prevMonth}>
            <ChevronLeft className="w-4 h-4" />
          </Button>
          <Button variant="ghost" size="icon" onClick={nextMonth}>
            <ChevronRight className="w-4 h-4" />
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-7 gap-2">
        {/* Day headers starting from Monday */}
        {["M", "T", "W", "T", "F", "S", "S"].map((day, i) => (
          <div key={i} className="text-center text-xs text-muted-foreground font-medium">
            {day}
          </div>
        ))}

        {/* Calendar days */}
        {daysToShow.map(({ day, isCurrent, dateStr }, idx) => {
          const isEntryDate = isEntry(dateStr);
          const isPredDate = isPred(dateStr);
          const isOvulationDate = isOvulation(dateStr);
          const isFertileDate = isFertile(dateStr);
          const isToday = isCurrent && isTodayDate(year, month, day);

          return (
            <div
              key={idx}
              className={cn(
                "aspect-square rounded-lg flex items-center justify-center text-sm relative",
                !isCurrent && "text-muted-foreground/50"
              )}
            >
              {/* Confirmed Period - Filled red droplet */}
              {isEntryDate && (
                <DropletIcon filled day={day} className="text-red-500" size="w-8 h-8" />
              )}

              {/* Predicted Period - Outlined red droplet */}
              {!isEntryDate && isPredDate && (
                <DropletIcon day={day} className="text-red-400" size="w-8 h-8" />
              )}

              {/* Ovulation - Refined light pink circle */}
              {!isEntryDate && !isPredDate && isOvulationDate && (
                <div className="w-7 h-7 rounded-full bg-pink-100 border border-pink-200 flex items-center justify-center shadow-sm">
                  <span className="text-[10px] font-medium text-pink-700 leading-none">{day}</span>
                </div>
              )}

              {/* Fertile - Refined yellow circle */}
              {!isEntryDate && !isPredDate && !isOvulationDate && isFertileDate && (
                <div className="w-7 h-7 rounded-full bg-amber-100 border border-amber-200 flex items-center justify-center shadow-sm">
                  <span className="text-[10px] font-medium text-amber-700 leading-none">{day}</span>
                </div>
              )}

              {/* Today - Professional dark pink circle with subtle border */}
              {!isEntryDate && !isPredDate && !isOvulationDate && !isFertileDate && isToday && (
                <div className="w-7 h-7 rounded-full bg-primary border-2 border-primary/20 flex items-center justify-center shadow-md">
                  <span className="text-[10px] font-semibold text-primary-foreground leading-none">{day}</span>
                </div>
              )}

              {/* Regular day */}
              {!isEntryDate && !isPredDate && !isOvulationDate && !isFertileDate && !isToday && (
                <span className={cn(
                  "text-xs font-medium",
                  !isCurrent && "text-muted-foreground/50"
                )}>{day}</span>
              )}
            </div>
          );
        })}
      </div>

      {/* Legend */}
      <div className="flex flex-wrap gap-4 text-xs pt-2 border-t">
        <div className="flex items-center gap-2">
          <DropletIcon filled className="text-red-500" size="w-4 h-4" />
          <span className="text-muted-foreground">Confirmed Period</span>
        </div>
        <div className="flex items-center gap-2">
          <DropletIcon className="text-red-400" size="w-4 h-4" />
          <span className="text-muted-foreground">Predicted Period</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded-full bg-pink-100 border border-pink-200" />
          <span className="text-muted-foreground">Ovulation</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded-full bg-amber-100 border border-amber-200" />
          <span className="text-muted-foreground">Fertile Window</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded-full bg-primary border-2 border-primary/20" />
          <span className="text-muted-foreground">Today</span>
        </div>
      </div>
    </Card>
  );
}
