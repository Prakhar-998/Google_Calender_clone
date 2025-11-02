import { Calendar } from "@/components/ui/calendar";

interface SidebarProps {
  selectedDate: Date;
  onDateSelect: (date: Date | undefined) => void;
}

export const Sidebar = ({ selectedDate, onDateSelect }: SidebarProps) => {
  return (
    <div className="w-72 border-r border-calendar-border bg-background p-4">
      <h2 className="text-xl font-normal text-foreground mb-4 px-2">Calendar</h2>
      <Calendar
        mode="single"
        selected={selectedDate}
        onSelect={onDateSelect}
        className="rounded-md border-0 scale-95"
      />
    </div>
  );
};
