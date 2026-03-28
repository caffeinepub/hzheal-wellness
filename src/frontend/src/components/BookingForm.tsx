import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { CheckCircle2, Loader2 } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { useSubmitBooking } from "../hooks/useQueries";

const SERVICES = [
  "Hair Cut & Style",
  "Hair Coloring",
  "Bridal Makeup",
  "Facial & Cleanup",
  "Keratin Treatment",
  "Mehndi",
  "Nail Art",
  "Waxing & Threading",
];

const TIME_SLOTS = [
  "9:00 AM",
  "10:00 AM",
  "11:00 AM",
  "12:00 PM",
  "1:00 PM",
  "2:00 PM",
  "3:00 PM",
  "4:00 PM",
  "5:00 PM",
  "6:00 PM",
  "7:00 PM",
  "8:00 PM",
  "9:00 PM",
  "10:00 PM",
];

export default function BookingForm() {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [service, setService] = useState("");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [notes, setNotes] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const { mutateAsync, isPending } = useSubmitBooking();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !phone || !service || !date || !time) {
      toast.error("Please fill in all required fields.");
      return;
    }
    try {
      await mutateAsync({
        clientName: name,
        clientPhone: phone,
        service,
        appointmentDate: date,
        appointmentTime: time,
        notes,
      });
      setSubmitted(true);
      toast.success("Appointment booked! We'll confirm shortly.");
    } catch {
      toast.error("Booking failed. Please try again or call us.");
    }
  };

  if (submitted) {
    return (
      <div
        data-ocid="booking.success_state"
        className="flex flex-col items-center justify-center py-16 text-center"
      >
        <CheckCircle2 className="w-16 h-16 gold-text mb-4" />
        <h3 className="font-display text-2xl font-semibold text-foreground mb-2">
          Appointment Requested!
        </h3>
        <p className="text-muted-foreground mb-2">
          Thank you, <span className="gold-text font-medium">{name}</span>.
          We'll confirm your booking shortly.
        </p>
        <p className="text-muted-foreground text-sm">
          Questions? Call us at{" "}
          <a href="tel:9911831623" className="gold-text font-semibold">
            99118 31623
          </a>
        </p>
        <Button
          variant="outline"
          className="mt-6 gold-border gold-text hover:bg-primary/10"
          onClick={() => {
            setSubmitted(false);
            setName("");
            setPhone("");
            setService("");
            setDate("");
            setTime("");
            setNotes("");
          }}
        >
          Book Another Appointment
        </Button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <div className="space-y-2">
          <Label
            htmlFor="booking-name"
            className="text-foreground/80 text-sm font-medium"
          >
            Full Name <span className="gold-text">*</span>
          </Label>
          <Input
            data-ocid="booking.input"
            id="booking-name"
            placeholder="Your full name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="bg-muted/50 border-border focus:border-primary/50 h-11"
          />
        </div>
        <div className="space-y-2">
          <Label
            htmlFor="booking-phone"
            className="text-foreground/80 text-sm font-medium"
          >
            Phone Number <span className="gold-text">*</span>
          </Label>
          <Input
            data-ocid="booking.input"
            id="booking-phone"
            type="tel"
            placeholder="Your phone number"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            className="bg-muted/50 border-border focus:border-primary/50 h-11"
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label className="text-foreground/80 text-sm font-medium">
          Service <span className="gold-text">*</span>
        </Label>
        <Select onValueChange={setService} value={service}>
          <SelectTrigger
            data-ocid="booking.select"
            className="bg-muted/50 border-border h-11"
          >
            <SelectValue placeholder="Select a service" />
          </SelectTrigger>
          <SelectContent>
            {SERVICES.map((s) => (
              <SelectItem key={s} value={s}>
                {s}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <div className="space-y-2">
          <Label
            htmlFor="booking-date"
            className="text-foreground/80 text-sm font-medium"
          >
            Preferred Date <span className="gold-text">*</span>
          </Label>
          <Input
            data-ocid="booking.input"
            id="booking-date"
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            min={new Date().toISOString().split("T")[0]}
            className="bg-muted/50 border-border focus:border-primary/50 h-11"
          />
        </div>
        <div className="space-y-2">
          <Label className="text-foreground/80 text-sm font-medium">
            Preferred Time <span className="gold-text">*</span>
          </Label>
          <Select onValueChange={setTime} value={time}>
            <SelectTrigger
              data-ocid="booking.select"
              className="bg-muted/50 border-border h-11"
            >
              <SelectValue placeholder="Select a time" />
            </SelectTrigger>
            <SelectContent>
              {TIME_SLOTS.map((t) => (
                <SelectItem key={t} value={t}>
                  {t}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="space-y-2">
        <Label
          htmlFor="booking-notes"
          className="text-foreground/80 text-sm font-medium"
        >
          Notes (optional)
        </Label>
        <Textarea
          data-ocid="booking.textarea"
          id="booking-notes"
          placeholder="Any special requests or details..."
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          rows={3}
          className="bg-muted/50 border-border focus:border-primary/50 resize-none"
        />
      </div>

      <Button
        data-ocid="booking.submit_button"
        type="submit"
        disabled={isPending}
        className="w-full h-12 text-base font-semibold bg-primary text-primary-foreground hover:bg-primary/90 gold-glow"
      >
        {isPending ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Booking...
          </>
        ) : (
          "Book Appointment"
        )}
      </Button>
    </form>
  );
}
