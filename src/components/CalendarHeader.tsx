import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { format } from "date-fns";
import { ViewSwitcher } from "./ViewSwitcher";

interface CalendarHeaderProps {
  currentDate: Date;
  currentView: "month" | "week" | "day";
  onPreviousMonth: () => void;
  onNextMonth: () => void;
  onToday: () => void;
  onViewChange: (view: "month" | "week" | "day") => void;
}

export const CalendarHeader = ({
  currentDate,
  currentView,
  onPreviousMonth,
  onNextMonth,
  onToday,
  onViewChange,
}: CalendarHeaderProps) => {
  const getDateFormat = () => {
    switch (currentView) {
      case "day":
        return "MMMM d, yyyy";
      case "week":
        return "MMMM yyyy";
      default:
        return "MMMM yyyy";
    }
  };
  return (
    <div className="flex items-center justify-between p-4 border-b border-calendar-border bg-background">
      <div className="flex items-center gap-4">
        <h1 className="text-2xl font-normal text-foreground">
          {format(currentDate, getDateFormat())}
        </h1>
        <div className="flex items-center gap-1">
          <Button
            variant="ghost"
            size="icon"
            onClick={onPreviousMonth}
            className="hover:bg-calendar-hover"
          >
            <ChevronLeft className="h-5 w-5" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={onNextMonth}
            className="hover:bg-calendar-hover"
          >
            <ChevronRight className="h-5 w-5" />
          </Button>
        </div>
        <Button
          variant="outline"
          onClick={onToday}
          className="border-calendar-border hover:bg-calendar-hover"
        >
          Today
        </Button>
      </div>
      <ViewSwitcher currentView={currentView} onViewChange={onViewChange} />
    </div>
  );
};
