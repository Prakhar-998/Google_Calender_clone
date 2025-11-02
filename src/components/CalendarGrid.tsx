import { format, startOfMonth, endOfMonth, startOfWeek, endOfWeek, addDays, isSameMonth, isSameDay, isToday } from "date-fns";
import { cn } from "@/lib/utils";

interface Event {
  id: string;
  title: string;
  description: string | null;
  start_time: string;
  end_time: string;
  color: string | null;
}

interface CalendarGridProps {
  currentDate: Date;
  events: Event[];
  onDateClick: (date: Date) => void;
  onEventClick: (event: Event) => void;
}

export const CalendarGrid = ({
  currentDate,
  events,
  onDateClick,
  onEventClick,
}: CalendarGridProps) => {
  const monthStart = startOfMonth(currentDate);
  const monthEnd = endOfMonth(monthStart);
  const calendarStart = startOfWeek(monthStart);
  const calendarEnd = endOfWeek(monthEnd);

  const days = [];
  let day = calendarStart;

  while (day <= calendarEnd) {
    days.push(day);
    day = addDays(day, 1);
  }

  const weekDays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  const getEventsForDay = (date: Date) => {
    return events.filter((event) => {
      const eventDate = new Date(event.start_time);
      return isSameDay(eventDate, date);
    });
  };

  return (
    <div className="flex-1 flex flex-col bg-background">
      {/* Weekday headers */}
      <div className="grid grid-cols-7 border-b border-calendar-border">
        {weekDays.map((day) => (
          <div
            key={day}
            className="p-2 text-center text-xs font-medium text-muted-foreground border-r last:border-r-0 border-calendar-border"
          >
            {day}
          </div>
        ))}
      </div>

      {/* Calendar grid */}
      <div className="grid grid-cols-7 flex-1" style={{ gridAutoRows: "1fr" }}>
        {days.map((day, index) => {
          const dayEvents = getEventsForDay(day);
          const isCurrentMonth = isSameMonth(day, currentDate);
          const isTodayDate = isToday(day);

          return (
            <div
              key={index}
              onClick={() => onDateClick(day)}
              className={cn(
                "border-r border-b last:border-r-0 border-calendar-border p-2 min-h-[100px] cursor-pointer hover:bg-calendar-hover transition-colors",
                !isCurrentMonth && "bg-muted/30",
                isTodayDate && "bg-calendar-today"
              )}
            >
              <div className="flex flex-col h-full">
                <span
                  className={cn(
                    "text-sm mb-1",
                    !isCurrentMonth && "text-muted-foreground",
                    isTodayDate && "font-semibold text-primary"
                  )}
                >
                  {format(day, "d")}
                </span>
                <div className="flex-1 space-y-1 overflow-hidden">
                  {dayEvents.map((event) => (
                    <div
                      key={event.id}
                      onClick={(e) => {
                        e.stopPropagation();
                        onEventClick(event);
                      }}
                      className="text-xs p-1 rounded truncate cursor-pointer hover:opacity-80 transition-opacity"
                      style={{
                        backgroundColor: event.color || "#1a73e8",
                        color: "white",
                      }}
                    >
                      {format(new Date(event.start_time), "HH:mm")} {event.title}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
