import { useState, useEffect } from "react";
import { CalendarHeader } from "@/components/CalendarHeader";
import { CalendarGrid } from "@/components/CalendarGrid";
import { WeekView } from "@/components/WeekView";
import { DayView } from "@/components/DayView";
import { Sidebar } from "@/components/Sidebar";
import { EventModal } from "@/components/EventModal";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { addMonths, subMonths, addWeeks, subWeeks, addDays, subDays } from "date-fns";

interface Event {
  id: string;
  title: string;
  description: string | null;
  start_time: string;
  end_time: string;
  color: string | null;
}

const Index = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [currentView, setCurrentView] = useState<"month" | "week" | "day">("month");
  const [events, setEvents] = useState<Event[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);
  const { toast } = useToast();

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    const { data, error } = await supabase
      .from("events")
      .select("*")
      .order("start_time", { ascending: true });

    if (error) {
      toast({
        title: "Error fetching events",
        description: error.message,
        variant: "destructive",
      });
      return;
    }

    setEvents(data || []);
  };

  const handleSaveEvent = async (eventData: Partial<Event>) => {
    if (eventData.id) {
      // Update existing event
      const { error } = await supabase
        .from("events")
        .update({
          title: eventData.title,
          description: eventData.description,
          start_time: eventData.start_time,
          end_time: eventData.end_time,
          color: eventData.color,
        })
        .eq("id", eventData.id);

      if (error) {
        toast({
          title: "Error updating event",
          description: error.message,
          variant: "destructive",
        });
        return;
      }

      toast({
        title: "Event updated",
        description: "Your event has been updated successfully.",
      });
    } else {
      // Create new event
      const { error } = await supabase.from("events").insert({
        title: eventData.title!,
        description: eventData.description,
        start_time: eventData.start_time!,
        end_time: eventData.end_time!,
        color: eventData.color,
      });

      if (error) {
        toast({
          title: "Error creating event",
          description: error.message,
          variant: "destructive",
        });
        return;
      }

      toast({
        title: "Event created",
        description: "Your event has been created successfully.",
      });
    }

    fetchEvents();
    setSelectedEvent(null);
    setSelectedDate(undefined);
  };

  const handleDeleteEvent = async () => {
    if (!selectedEvent) return;

    const { error } = await supabase
      .from("events")
      .delete()
      .eq("id", selectedEvent.id);

    if (error) {
      toast({
        title: "Error deleting event",
        description: error.message,
        variant: "destructive",
      });
      return;
    }

    toast({
      title: "Event deleted",
      description: "Your event has been deleted successfully.",
    });

    fetchEvents();
    setIsModalOpen(false);
    setSelectedEvent(null);
  };

  const handleDateClick = (date: Date) => {
    setSelectedDate(date);
    setSelectedEvent(null);
    setIsModalOpen(true);
  };

  const handleEventClick = (event: Event) => {
    setSelectedEvent(event);
    setSelectedDate(undefined);
    setIsModalOpen(true);
  };

  const handlePrevious = () => {
    switch (currentView) {
      case "day":
        setCurrentDate(subDays(currentDate, 1));
        break;
      case "week":
        setCurrentDate(subWeeks(currentDate, 1));
        break;
      default:
        setCurrentDate(subMonths(currentDate, 1));
    }
  };

  const handleNext = () => {
    switch (currentView) {
      case "day":
        setCurrentDate(addDays(currentDate, 1));
        break;
      case "week":
        setCurrentDate(addWeeks(currentDate, 1));
        break;
      default:
        setCurrentDate(addMonths(currentDate, 1));
    }
  };

  const renderCalendarView = () => {
    switch (currentView) {
      case "day":
        return (
          <DayView
            currentDate={currentDate}
            events={events}
            onDateClick={handleDateClick}
            onEventClick={handleEventClick}
          />
        );
      case "week":
        return (
          <WeekView
            currentDate={currentDate}
            events={events}
            onDateClick={handleDateClick}
            onEventClick={handleEventClick}
          />
        );
      default:
        return (
          <CalendarGrid
            currentDate={currentDate}
            events={events}
            onDateClick={handleDateClick}
            onEventClick={handleEventClick}
          />
        );
    }
  };

  return (
    <div className="flex h-screen">
      <Sidebar
        selectedDate={currentDate}
        onDateSelect={(date) => date && setCurrentDate(date)}
      />
      <div className="flex flex-col flex-1">
        <CalendarHeader
          currentDate={currentDate}
          currentView={currentView}
          onPreviousMonth={handlePrevious}
          onNextMonth={handleNext}
          onToday={() => setCurrentDate(new Date())}
          onViewChange={setCurrentView}
        />
        {renderCalendarView()}
        <EventModal
          isOpen={isModalOpen}
          onClose={() => {
            setIsModalOpen(false);
            setSelectedEvent(null);
            setSelectedDate(undefined);
          }}
          onSave={handleSaveEvent}
          onDelete={selectedEvent ? handleDeleteEvent : undefined}
          event={selectedEvent}
          selectedDate={selectedDate}
        />
      </div>
    </div>
  );
};

export default Index;
