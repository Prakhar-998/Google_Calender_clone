import { Button } from "@/components/ui/button";

interface ViewSwitcherProps {
  currentView: "month" | "week" | "day";
  onViewChange: (view: "month" | "week" | "day") => void;
}

export const ViewSwitcher = ({ currentView, onViewChange }: ViewSwitcherProps) => {
  return (
    <div className="flex gap-1 border border-calendar-border rounded-md overflow-hidden">
      <Button
        variant={currentView === "month" ? "default" : "ghost"}
        size="sm"
        onClick={() => onViewChange("month")}
        className="rounded-none"
      >
        Month
      </Button>
      <Button
        variant={currentView === "week" ? "default" : "ghost"}
        size="sm"
        onClick={() => onViewChange("week")}
        className="rounded-none"
      >
        Week
      </Button>
      <Button
        variant={currentView === "day" ? "default" : "ghost"}
        size="sm"
        onClick={() => onViewChange("day")}
        className="rounded-none"
      >
        Day
      </Button>
    </div>
  );
};
