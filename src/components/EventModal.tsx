import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useState, useEffect } from "react";
import { format } from "date-fns";
import { Trash2 } from "lucide-react";

interface Event {
  id: string;
  title: string;
  description: string | null;
  start_time: string;
  end_time: string;
  color: string | null;
}

interface EventModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (event: Partial<Event>) => void;
  onDelete?: () => void;
  event?: Event | null;
  selectedDate?: Date;
}

export const EventModal = ({
  isOpen,
  onClose,
  onSave,
  onDelete,
  event,
  selectedDate,
}: EventModalProps) => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [color, setColor] = useState("#1a73e8");

  useEffect(() => {
    if (event) {
      setTitle(event.title);
      setDescription(event.description || "");
      setStartTime(format(new Date(event.start_time), "yyyy-MM-dd'T'HH:mm"));
      setEndTime(format(new Date(event.end_time), "yyyy-MM-dd'T'HH:mm"));
      setColor(event.color || "#1a73e8");
    } else if (selectedDate) {
      const dateStr = format(selectedDate, "yyyy-MM-dd");
      setStartTime(`${dateStr}T09:00`);
      setEndTime(`${dateStr}T10:00`);
      setTitle("");
      setDescription("");
      setColor("#1a73e8");
    }
  }, [event, selectedDate]);

  const handleSave = () => {
    if (!title || !startTime || !endTime) return;

    onSave({
      id: event?.id,
      title,
      description: description || null,
      start_time: new Date(startTime).toISOString(),
      end_time: new Date(endTime).toISOString(),
      color,
    });
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>{event ? "Edit Event" : "Create Event"}</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="title">Title</Label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Event title"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Event description (optional)"
              rows={3}
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="start">Start Time</Label>
              <Input
                id="start"
                type="datetime-local"
                value={startTime}
                onChange={(e) => setStartTime(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="end">End Time</Label>
              <Input
                id="end"
                type="datetime-local"
                value={endTime}
                onChange={(e) => setEndTime(e.target.value)}
              />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="color">Color</Label>
            <div className="flex gap-2">
              {["#1a73e8", "#d50000", "#e67c73", "#33b679", "#f4511e", "#8e24aa"].map((c) => (
                <button
                  key={c}
                  onClick={() => setColor(c)}
                  className={cn(
                    "w-8 h-8 rounded-full border-2 transition-transform hover:scale-110",
                    color === c ? "border-foreground" : "border-transparent"
                  )}
                  style={{ backgroundColor: c }}
                />
              ))}
            </div>
          </div>
        </div>
        <div className="flex justify-between">
          {event && onDelete && (
            <Button variant="destructive" size="icon" onClick={onDelete}>
              <Trash2 className="h-4 w-4" />
            </Button>
          )}
          <div className="flex gap-2 ml-auto">
            <Button variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button onClick={handleSave} disabled={!title || !startTime || !endTime}>
              {event ? "Update" : "Create"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

function cn(...classes: (string | boolean | undefined)[]) {
  return classes.filter(Boolean).join(" ");
}
