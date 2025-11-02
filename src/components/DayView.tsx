import { format, isSameDay } from "date-fns";

interface Event {
  id: string;
  title: string;
  description: string | null;
  start_time: string;
  end_time: string;
  color: string | null;
}

interface DayViewProps {
  currentDate: Date;
  events: Event[];
  onDateClick: (date: Date) => void;
  onEventClick: (event: Event) => void;
}

export const DayView = ({ currentDate, events, onDateClick, onEventClick }: DayViewProps) => {
  const hours = Array.from({ length: 24 }, (_, i) => i);
  const dayEvents = events.filter((event) =>
    isSameDay(new Date(event.start_time), currentDate)
  );

  return (
    <div className="flex-1 overflow-auto bg-background">
      <div className="border-b border-calendar-border p-4">
        <div className="text-xs text-muted-foreground">{format(currentDate, "EEEE")}</div>
        <div className={`text-4xl font-normal ${isSameDay(currentDate, new Date()) ? "text-calendar-today" : ""}`}>
          {format(currentDate, "d")}
        </div>
      </div>
      <div className="relative">
        {hours.map((hour) => (
          <div key={hour} className="grid grid-cols-[80px_1fr] border-b border-calendar-border">
            <div className="p-2 text-xs text-muted-foreground text-right pr-4">
              {format(new Date().setHours(hour, 0), "ha")}
            </div>
            <div
              className="min-h-[60px] hover:bg-calendar-hover cursor-pointer relative"
              onClick={() => onDateClick(new Date(currentDate.setHours(hour, 0)))}
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
                      className="absolute inset-x-2 top-1 p-2 rounded text-sm text-white cursor-pointer hover:opacity-90"
                      style={{ backgroundColor: event.color || "#1a73e8" }}
                    >
                      <div className="font-medium">{event.title}</div>
                      {event.description && (
                        <div className="text-xs opacity-90 mt-1">{event.description}</div>
                      )}
                    </div>
                  );
                }
                return null;
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
