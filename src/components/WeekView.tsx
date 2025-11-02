import { format, startOfWeek, addDays, isSameDay } from "date-fns";

interface Event {
  id: string;
  title: string;
  description: string | null;
  start_time: string;
  end_time: string;
  color: string | null;
}

interface WeekViewProps {
  currentDate: Date;
  events: Event[];
  onDateClick: (date: Date) => void;
  onEventClick: (event: Event) => void;
}

export const WeekView = ({ currentDate, events, onDateClick, onEventClick }: WeekViewProps) => {
  const weekStart = startOfWeek(currentDate, { weekStartsOn: 0 });
  const weekDays = Array.from({ length: 7 }, (_, i) => addDays(weekStart, i));

  const hours = Array.from({ length: 24 }, (_, i) => i);

  return (
    <div className="flex-1 overflow-auto bg-background">
      <div className="grid grid-cols-8 border-b border-calendar-border">
        <div className="p-2 text-xs font-medium text-muted-foreground"></div>
        {weekDays.map((day) => (
          <div
            key={day.toISOString()}
            className="p-2 text-center border-l border-calendar-border"
          >
            <div className="text-xs text-muted-foreground">{format(day, "EEE")}</div>
            <div className={`text-2xl font-normal ${isSameDay(day, new Date()) ? "bg-calendar-today text-white rounded-full w-10 h-10 flex items-center justify-center mx-auto" : ""}`}>
              {format(day, "d")}
            </div>
          </div>
        ))}
      </div>
      <div className="relative">
        {hours.map((hour) => (
          <div key={hour} className="grid grid-cols-8 border-b border-calendar-border">
            <div className="p-2 text-xs text-muted-foreground text-right pr-4">
              {format(new Date().setHours(hour, 0), "ha")}
            </div>
            {weekDays.map((day) => {
              const dayEvents = events.filter((event) =>
                isSameDay(new Date(event.start_time), day)
              );
              return (
                <div
                  key={`${day.toISOString()}-${hour}`}
                  className="min-h-[60px] border-l border-calendar-border hover:bg-calendar-hover cursor-pointer relative"
                  onClick={() => onDateClick(new Date(day.setHours(hour, 0)))}
                >
                  {dayEvents.map((event) => {
                    const eventHour = new Date(event.start_time).getHours();
                    if (eventHour === hour) {
                      return (
                        <div
                          key={event.id}
                          onClick={(e) => {
                            e.stopPropagation();
                            onEventClick(event);
                          }}
                          className="absolute inset-x-1 top-1 p-1 rounded text-xs text-white cursor-pointer hover:opacity-90"
                          style={{ backgroundColor: event.color || "#1a73e8" }}
                        >
                          {event.title}
                        </div>
                      );
                    }
                    return null;
                  })}
                </div>
              );
            })}
          </div>
        ))}
      </div>
    </div>
  );
};
