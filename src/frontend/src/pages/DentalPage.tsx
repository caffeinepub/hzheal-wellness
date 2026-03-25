import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
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
import {
  AlertCircle,
  Award,
  Calendar,
  CheckCircle,
  ChevronLeft,
  ChevronRight,
  Clock,
  Facebook,
  Heart,
  Lock,
  MapPin,
  Menu,
  Phone,
  Shield,
  Smile,
  Star,
  X,
  Zap,
} from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useCallback, useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import { useActor } from "../hooks/useActor";

function useCountUp(end: number, duration = 2000, started = false) {
  const [count, setCount] = useState(0);
  useEffect(() => {
    if (!started) return;
    let startTime: number | null = null;
    const step = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / duration, 1);
      const eased = 1 - (1 - progress) ** 3;
      setCount(Math.floor(eased * end));
      if (progress < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }, [end, duration, started]);
  return count;
}

function StatItem({
  value,
  label,
  icon: Icon,
  started,
}: {
  value: string;
  label: string;
  icon: React.ElementType;
  started: boolean;
}) {
  const numericMatch = value.match(/(\d+\.?\d*)([^\d]*)/);
  const numericValue = numericMatch ? Number.parseFloat(numericMatch[1]) : 0;
  const suffix = numericMatch ? numericMatch[2] : "";
  const isFloat = numericValue % 1 !== 0;
  const counted = useCountUp(
    isFloat ? Math.round(numericValue * 10) : numericValue,
    2000,
    started,
  );
  const displayValue = isFloat ? (counted / 10).toFixed(1) : counted;

  return (
    <div className="flex flex-col items-center gap-2 text-white">
      <Icon className="w-8 h-8 mb-1" style={{ color: "#C8A463" }} />
      <span className="text-3xl md:text-4xl font-bold font-serif">
        {displayValue}
        {suffix}
      </span>
      <span className="text-sm md:text-base text-white/70 font-sans text-center">
        {label}
      </span>
    </div>
  );
}

const services = [
  {
    icon: Shield,
    title: "Diagnostic & Preventive",
    desc: "Comprehensive exams, cleanings, X-rays and more to keep your smile healthy",
  },
  {
    icon: Zap,
    title: "Dental Implants",
    desc: "State-of-the-art implant solutions including same-day implants and All-on-4",
  },
  {
    icon: Smile,
    title: "Invisalign",
    desc: "Diamond Plus Invisalign provider — save up to $1,700 on clear aligner treatment",
  },
  {
    icon: Star,
    title: "Cosmetic Dentistry",
    desc: "Veneers, whitening, smile makeovers and crowns for your dream smile",
  },
  {
    icon: Heart,
    title: "Periodontics",
    desc: "Expert gum disease treatment and periodontal care to protect your foundation",
  },
  {
    icon: AlertCircle,
    title: "Emergency Dental",
    desc: "Open 7 days a week for dental emergencies and same-day appointments",
  },
];

const stats = [
  { value: "1,000+", label: "5-Star Reviews", icon: Star },
  { value: "145", label: "Years Serving NYC", icon: Calendar },
  { value: "18,100+", label: "Smiles Transformed", icon: Smile },
  { value: "4.9", label: "Average Google Rating", icon: Award },
];

const testimonials = [
  {
    text: "I was very lucky to have had a referral for this Dental Practice. From the wonderful staff at the front desk...This was a wonderful experience.",
    author: "S.D.",
    source: "Google",
  },
  {
    text: "Dr Wang is the best periodontist I've seen in NYC! He went above and beyond to fully explain all my options...Will definitely recommend to my friends and come back!",
    author: "Ben",
    source: "Google",
  },
  {
    text: "All staff is very polite! From front desk to dental assistants. Dr. Reddy is one of the best dentists out there!",
    author: "Donika",
    source: "Google",
  },
  {
    text: "Literally the best experience I've had at a dentist office. All the staff was so kind and welcoming.",
    author: "Rossy",
    source: "Google",
  },
  {
    text: "Dr. Stella Park is the BEST dentist ever! I honestly cannot rave about her enough. Her gentle approach to patient care can help soothe any apprehensive patient.",
    author: "J.V.",
    source: "Google",
  },
];

const faqs = [
  {
    q: "How do I find a dentist in NYC?",
    a: "You've found one! 209 NYC Dental is NYC's longest-running dentistry practice, open 7 days a week.",
  },
  {
    q: "How much does it cost to fix a cavity?",
    a: "Costs vary based on severity. We work to ensure the lowest possible price and offer flexible financing options.",
  },
  {
    q: "What is the best quality dentist?",
    a: "Look for experience, credentials, and patient reviews. With 145+ years of history and 1,000+ 5-star reviews, 209 NYC Dental exceeds every standard.",
  },
  {
    q: "Do you offer financing?",
    a: "Yes! Our financing team works hard to find affordable payment options for every patient, with or without insurance.",
  },
  {
    q: "Do you treat dental emergencies?",
    a: "Yes. We're open 7 days a week including same-day appointments for dental emergencies. Call 212-355-2290.",
  },
  {
    q: "Do you offer pediatric dental services?",
    a: "Yes. Our kid-friendly office and caring staff make children feel at ease during every visit.",
  },
  {
    q: "How often should I visit a dentist?",
    a: "Generally once or twice per year. We customize care plans based on your individual dental needs and budget.",
  },
];

const whyPoints = [
  {
    icon: Calendar,
    title: "Longevity",
    desc: "Serving NYC since 1887, proven quality for over a century",
  },
  {
    icon: Clock,
    title: "Open 7 Days",
    desc: "Dental problems don't wait — neither do we",
  },
  {
    icon: Star,
    title: "1,700+ Reviews",
    desc: "Thousands of satisfied patients speak for themselves",
  },
  {
    icon: Shield,
    title: "All Specialties",
    desc: "Comprehensive dental care under one roof",
  },
];

const quickLinks = [
  { label: "Home", href: "/" },
  { label: "Services", href: "#services" },
  { label: "About Us", href: "#why" },
  { label: "Testimonials", href: "#testimonials" },
  { label: "Before & Afters", href: "#why" },
  { label: "Book Appointment", href: "#book" },
];

interface BookingForm {
  name: string;
  phone: string;
  email: string;
  service: string;
  preferredDate: string;
  message: string;
}

export default function DentalPage() {
  const { actor } = useActor();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [testimonialIndex, setTestimonialIndex] = useState(0);
  const [statsStarted, setStatsStarted] = useState(false);
  const statsRef = useRef<HTMLDivElement>(null);
  const [bookingOpen, setBookingOpen] = useState(false);
  const [bookingForm, setBookingForm] = useState<BookingForm>({
    name: "",
    phone: "",
    email: "",
    service: "",
    preferredDate: "",
    message: "",
  });
  const [bookingSubmitting, setBookingSubmitting] = useState(false);

  const openBooking = () => setBookingOpen(true);

  const handleBookingSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!actor) {
      toast.error("Unable to connect to the server. Please try again.");
      return;
    }
    setBookingSubmitting(true);
    try {
      await (actor as any).submitDentalBooking({ ...bookingForm });
      setBookingOpen(false);
      setBookingForm({
        name: "",
        phone: "",
        email: "",
        service: "",
        preferredDate: "",
        message: "",
      });
      toast.success(
        "Your appointment request has been submitted! We'll contact you shortly.",
      );
    } catch {
      toast.error("Failed to submit booking. Please try again.");
    } finally {
      setBookingSubmitting(false);
    }
  };

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setStatsStarted(true);
      },
      { threshold: 0.3 },
    );
    if (statsRef.current) observer.observe(statsRef.current);
    return () => observer.disconnect();
  }, []);

  const prevTestimonial = useCallback(() => {
    setTestimonialIndex(
      (i) => (i - 1 + testimonials.length) % testimonials.length,
    );
  }, []);

  const nextTestimonial = useCallback(() => {
    setTestimonialIndex((i) => (i + 1) % testimonials.length);
  }, []);

  const navLinks = [
    { label: "Services", href: "#services" },
    { label: "About", href: "#why" },
    { label: "Testimonials", href: "#testimonials" },
    { label: "FAQ", href: "#faq" },
    { label: "Contact", href: "#footer" },
  ];

  return (
    <div className="min-h-screen bg-dental-offwhite font-sans">
      {/* STICKY HEADER */}
      <header
        className="sticky top-0 z-50 bg-white border-b border-gray-100 shadow-sm"
        data-ocid="header.panel"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 md:h-20">
            <a
              href="/"
              className="flex items-center gap-2"
              data-ocid="nav.link"
            >
              <span className="font-serif text-2xl font-bold text-dental-navy">
                209 NYC
              </span>
              <span className="font-sans text-sm font-medium text-dental-gold tracking-widest uppercase">
                Dental
              </span>
            </a>

            <nav
              className="hidden md:flex items-center gap-6 lg:gap-8"
              aria-label="Main navigation"
            >
              {navLinks.map((link) => (
                <a
                  key={link.label}
                  href={link.href}
                  className="font-sans text-sm font-medium text-dental-navy hover:text-dental-gold transition-colors"
                  data-ocid="nav.link"
                >
                  {link.label}
                </a>
              ))}
            </nav>

            <div className="hidden md:flex items-center gap-4">
              <a
                href="tel:2123552290"
                className="flex items-center gap-1.5 text-sm font-medium text-dental-navy hover:text-dental-gold transition-colors"
                data-ocid="header.phone.link"
              >
                <Phone className="w-4 h-4" />
                212-355-2290
              </a>
              <button
                type="button"
                onClick={openBooking}
                className="btn-gold px-5 py-2.5 rounded-md text-sm font-semibold"
                data-ocid="header.book.button"
              >
                Book Online
              </button>
              <a
                href="#admin"
                className="flex items-center gap-1 text-xs font-medium text-gray-400 hover:text-dental-navy transition-colors"
                data-ocid="header.admin.link"
              >
                <Lock className="w-3 h-3" />
                Admin
              </a>
            </div>

            <button
              type="button"
              className="md:hidden p-2 text-dental-navy"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label="Toggle mobile menu"
              data-ocid="nav.toggle"
            >
              {mobileMenuOpen ? (
                <X className="w-6 h-6" />
              ) : (
                <Menu className="w-6 h-6" />
              )}
            </button>
          </div>
        </div>

        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.2 }}
              className="md:hidden bg-white border-t border-gray-100 px-4 pb-4"
            >
              <nav className="flex flex-col gap-3 pt-3">
                {navLinks.map((link) => (
                  <a
                    key={link.label}
                    href={link.href}
                    className="font-sans text-sm font-medium text-dental-navy py-2 border-b border-gray-50"
                    onClick={() => setMobileMenuOpen(false)}
                    data-ocid="nav.link"
                  >
                    {link.label}
                  </a>
                ))}
                <a
                  href="tel:2123552290"
                  className="flex items-center gap-2 text-sm font-medium text-dental-navy py-2"
                  data-ocid="nav.phone.link"
                >
                  <Phone className="w-4 h-4" /> 212-355-2290
                </a>
                <button
                  type="button"
                  onClick={() => {
                    setMobileMenuOpen(false);
                    openBooking();
                  }}
                  className="btn-gold px-5 py-3 rounded-md text-sm font-semibold text-center"
                  data-ocid="nav.book.button"
                >
                  Book Online
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setMobileMenuOpen(false);
                    window.location.hash = "admin";
                  }}
                  className="flex items-center gap-1.5 text-sm font-medium text-gray-400 py-2 text-left"
                  data-ocid="nav.admin.link"
                >
                  <Lock className="w-4 h-4" />
                  Admin
                </button>
              </nav>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      {/* HERO SECTION */}
      <section className="bg-dental-offwhite" data-ocid="hero.section">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-20 lg:py-28">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            <motion.div
              initial={{ opacity: 0, y: 32 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, ease: "easeOut" }}
            >
              <div className="inline-flex items-center gap-2 bg-dental-teal text-dental-navy px-3 py-1.5 rounded-full text-xs font-semibold mb-6 font-sans">
                <Award className="w-3.5 h-3.5" />
                Diamond Invisalign Provider
              </div>
              <h1 className="font-serif text-4xl md:text-5xl lg:text-[52px] font-bold text-dental-navy leading-tight mb-6">
                NYC's Premier
                <br />
                <span style={{ color: "#C8A463" }}>Dental Practice</span>
                <br />
                Since 1887
              </h1>
              <p className="font-sans text-base md:text-lg text-dental-muted leading-relaxed mb-8 max-w-md">
                Experience exceptional dental care at New York State's oldest
                continually operating dental practice. Trusted by generations of
                New Yorkers for over 145 years.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <button
                  type="button"
                  onClick={openBooking}
                  className="btn-gold px-8 py-3.5 rounded-md text-base font-semibold text-center"
                  data-ocid="hero.book.button"
                >
                  Book Online
                </button>
                <a
                  href="tel:2123552290"
                  className="btn-outline-navy px-8 py-3.5 rounded-md text-base font-semibold text-center flex items-center justify-center gap-2"
                  data-ocid="hero.call.button"
                >
                  <Phone className="w-4 h-4" />
                  Call 212-355-2290
                </a>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 32 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.7, delay: 0.15, ease: "easeOut" }}
              className="relative"
            >
              <div className="rounded-2xl overflow-hidden shadow-xl">
                <img
                  src="/assets/generated/dental-hero.dim_800x600.jpg"
                  alt="Professional dental care at 209 NYC Dental"
                  className="w-full h-[400px] md:h-[500px] object-cover"
                  loading="eager"
                />
              </div>
              <div className="absolute -bottom-5 -left-5 bg-white rounded-xl shadow-card-hover p-4 flex items-center gap-3">
                <div className="flex">
                  {[1, 2, 3, 4, 5].map((i) => (
                    <Star
                      key={i}
                      className="w-4 h-4 fill-yellow-400 text-yellow-400"
                    />
                  ))}
                </div>
                <div>
                  <div className="text-dental-navy font-bold text-sm font-sans">
                    1,000+ Reviews
                  </div>
                  <div className="text-dental-muted text-xs font-sans">
                    Google · Yelp
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* FEATURE STRIP */}
      <section className="bg-dental-teal" data-ocid="features.section">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {[
              { icon: Calendar, label: "Est. 1887" },
              { icon: MapPin, label: "209 E 56th St, Manhattan" },
              { icon: Clock, label: "Open 7 Days a Week" },
              { icon: Award, label: "Diamond Invisalign Provider" },
            ].map(({ icon: Icon, label }) => (
              <div
                key={label}
                className="flex flex-col md:flex-row items-center gap-3 text-dental-navy"
              >
                <Icon className="w-6 h-6 flex-shrink-0" />
                <span className="font-sans text-sm font-semibold text-center md:text-left">
                  {label}
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* SERVICES GRID */}
      <section
        id="services"
        className="bg-white py-20"
        data-ocid="services.section"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-14"
          >
            <h2 className="font-serif text-3xl md:text-4xl font-bold text-dental-navy mb-4">
              Our Dental Services
            </h2>
            <p className="font-sans text-dental-muted max-w-xl mx-auto">
              Comprehensive dental care for the whole family — all under one
              roof in the heart of Manhattan.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {services.map(({ icon: Icon, title, desc }, idx) => (
              <motion.div
                key={title}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: idx * 0.08 }}
                className="bg-white border border-gray-200 rounded-xl p-6 shadow-card hover:shadow-card-hover transition-shadow"
                data-ocid={`services.item.${idx + 1}`}
              >
                <div
                  className="w-10 h-10 rounded-lg flex items-center justify-center mb-4"
                  style={{ backgroundColor: "#CFE8E6" }}
                >
                  <Icon className="w-5 h-5" style={{ color: "#132B45" }} />
                </div>
                <h3 className="font-serif text-lg font-semibold text-dental-navy mb-2">
                  {title}
                </h3>
                <p className="font-sans text-sm text-dental-muted leading-relaxed">
                  {desc}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* STATS BAND */}
      <section
        className="py-16"
        style={{ backgroundColor: "#132B45" }}
        ref={statsRef}
        data-ocid="stats.section"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-12">
            {stats.map(({ value, label, icon }) => (
              <StatItem
                key={label}
                value={value}
                label={label}
                icon={icon}
                started={statsStarted}
              />
            ))}
          </div>
        </div>
      </section>

      {/* TESTIMONIALS */}
      <section
        id="testimonials"
        className="py-20 bg-dental-teal"
        data-ocid="testimonials.section"
      >
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <h2 className="font-serif text-3xl md:text-4xl font-bold text-dental-navy mb-3">
              What Our Patients Say
            </h2>
            <p className="font-sans text-dental-navy/70">
              Real stories from real New Yorkers
            </p>
          </motion.div>

          <div className="relative">
            <AnimatePresence mode="wait">
              <motion.div
                key={testimonialIndex}
                initial={{ opacity: 0, x: 30 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -30 }}
                transition={{ duration: 0.4 }}
                className="bg-white rounded-2xl p-8 md:p-12 shadow-card text-center"
                data-ocid="testimonials.panel"
              >
                <div className="flex justify-center mb-4">
                  {[1, 2, 3, 4, 5].map((i) => (
                    <Star
                      key={i}
                      className="w-5 h-5 fill-yellow-400 text-yellow-400"
                    />
                  ))}
                </div>
                <blockquote className="font-serif text-xl md:text-2xl text-dental-navy italic mb-6 leading-relaxed">
                  "{testimonials[testimonialIndex].text}"
                </blockquote>
                <div className="font-sans font-semibold text-dental-navy">
                  {testimonials[testimonialIndex].author}
                </div>
                <div className="font-sans text-sm text-dental-muted">
                  {testimonials[testimonialIndex].source} Review
                </div>
              </motion.div>
            </AnimatePresence>

            <div className="flex justify-center gap-4 mt-8">
              <button
                type="button"
                onClick={prevTestimonial}
                className="w-10 h-10 rounded-full bg-white border border-gray-200 flex items-center justify-center hover:bg-dental-navy hover:text-white hover:border-dental-navy transition-colors shadow-sm"
                aria-label="Previous testimonial"
                data-ocid="testimonials.pagination_prev"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <div className="flex items-center gap-2">
                {testimonials.map((t, i) => (
                  <button
                    key={t.author}
                    type="button"
                    onClick={() => setTestimonialIndex(i)}
                    className={`h-2 rounded-full transition-all ${
                      i === testimonialIndex
                        ? "bg-dental-navy w-6"
                        : "bg-dental-navy/30 w-2"
                    }`}
                    aria-label={`Go to testimonial ${i + 1}`}
                  />
                ))}
              </div>
              <button
                type="button"
                onClick={nextTestimonial}
                className="w-10 h-10 rounded-full bg-white border border-gray-200 flex items-center justify-center hover:bg-dental-navy hover:text-white hover:border-dental-navy transition-colors shadow-sm"
                aria-label="Next testimonial"
                data-ocid="testimonials.pagination_next"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* WHY CHOOSE 209 NYC DENTAL */}
      <section id="why" className="py-20 bg-white" data-ocid="why.section">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -24 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="rounded-2xl overflow-hidden shadow-xl"
            >
              <img
                src="/assets/generated/dental-team.dim_600x500.jpg"
                alt="The 209 NYC Dental team"
                className="w-full h-[400px] md:h-[480px] object-cover"
                loading="lazy"
              />
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 24 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.1 }}
            >
              <h2 className="font-serif text-3xl md:text-4xl font-bold text-dental-navy mb-4">
                Why Choose <br />
                <span style={{ color: "#C8A463" }}>209 NYC Dental?</span>
              </h2>
              <p className="font-sans text-dental-muted mb-8 leading-relaxed">
                New York State's oldest continuously operating dental practice
                has been setting the standard for exceptional care since 1887.
              </p>
              <div className="flex flex-col gap-5">
                {whyPoints.map(({ icon: Icon, title, desc }) => (
                  <div key={title} className="flex items-start gap-4">
                    <div
                      className="w-10 h-10 rounded-full flex-shrink-0 flex items-center justify-center"
                      style={{ backgroundColor: "#CFE8E6" }}
                    >
                      <Icon className="w-5 h-5" style={{ color: "#132B45" }} />
                    </div>
                    <div>
                      <div className="font-sans font-semibold text-dental-navy mb-0.5">
                        {title}
                      </div>
                      <div className="font-sans text-sm text-dental-muted">
                        {desc}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section
        id="faq"
        className="py-20 bg-dental-offwhite"
        data-ocid="faq.section"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-14"
          >
            <h2 className="font-serif text-3xl md:text-4xl font-bold text-dental-navy mb-4">
              Frequently Asked Questions
            </h2>
            <p className="font-sans text-dental-muted max-w-xl mx-auto">
              Everything you need to know before your visit.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-x-12 gap-y-2">
            {faqs.map((faq, idx) => (
              <Accordion
                key={faq.q}
                type="single"
                collapsible
                data-ocid={`faq.item.${idx + 1}`}
              >
                <AccordionItem
                  value={`faq-${idx}`}
                  className="border-b border-gray-200"
                >
                  <AccordionTrigger className="font-sans font-semibold text-dental-navy text-left hover:text-dental-gold hover:no-underline py-4">
                    {faq.q}
                  </AccordionTrigger>
                  <AccordionContent className="font-sans text-dental-muted pb-4">
                    {faq.a}
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            ))}
          </div>
        </div>
      </section>

      {/* CTA BANNER */}
      <section className="py-16 px-4 sm:px-6 lg:px-8" data-ocid="cta.section">
        <div
          className="max-w-4xl mx-auto rounded-2xl px-8 py-14 text-center"
          style={{ backgroundColor: "#C8A463" }}
        >
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="font-serif text-3xl md:text-4xl font-bold text-dental-navy mb-4">
              Ready to Achieve Your Best Smile?
            </h2>
            <p className="font-sans text-dental-navy/80 mb-8 max-w-lg mx-auto">
              Join thousands of satisfied patients. Book your appointment today
              and experience the 209 NYC Dental difference.
            </p>
            <button
              type="button"
              onClick={openBooking}
              className="inline-flex items-center gap-2 bg-dental-navy text-white px-10 py-4 rounded-lg font-sans font-semibold text-base transition-all hover:bg-dental-navy/90"
              data-ocid="cta.book.button"
            >
              <CheckCircle className="w-5 h-5" />
              Book Your Appointment Today
            </button>
          </motion.div>
        </div>
      </section>

      {/* FOOTER */}
      <footer
        id="footer"
        className="bg-dental-navy text-white pt-16 pb-8"
        data-ocid="footer.panel"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 mb-12">
            {/* Quick Links */}
            <div>
              <div
                className="font-serif text-lg font-semibold mb-5"
                style={{ color: "#C8A463" }}
              >
                Quick Links
              </div>
              <ul className="flex flex-col gap-2.5">
                {quickLinks.map(({ label, href }) => (
                  <li key={label}>
                    <a
                      href={href}
                      className="font-sans text-sm text-white/70 hover:text-white transition-colors"
                      data-ocid="footer.link"
                    >
                      {label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            {/* Contact */}
            <div>
              <div
                className="font-serif text-lg font-semibold mb-5"
                style={{ color: "#C8A463" }}
              >
                Contact
              </div>
              <ul className="flex flex-col gap-3 font-sans text-sm text-white/70">
                <li className="flex items-start gap-2">
                  <MapPin
                    className="w-4 h-4 mt-0.5 flex-shrink-0"
                    style={{ color: "#C8A463" }}
                  />
                  <span>
                    209 East 56th Street, 1st Floor
                    <br />
                    New York, NY 10022
                  </span>
                </li>
                <li className="flex items-center gap-2">
                  <Phone
                    className="w-4 h-4 flex-shrink-0"
                    style={{ color: "#C8A463" }}
                  />
                  <a
                    href="tel:2123552290"
                    className="hover:text-white transition-colors"
                  >
                    212-355-2290
                  </a>
                </li>
                <li className="flex items-center gap-2">
                  <span
                    className="w-4 h-4 flex-shrink-0 text-center text-xs font-bold"
                    style={{ color: "#C8A463" }}
                  >
                    @
                  </span>
                  <a
                    href="mailto:info@209nycdental.com"
                    className="hover:text-white transition-colors"
                  >
                    info@209nycdental.com
                  </a>
                </li>
              </ul>
            </div>

            {/* Hours */}
            <div>
              <div
                className="font-serif text-lg font-semibold mb-5"
                style={{ color: "#C8A463" }}
              >
                Opening Hours
              </div>
              <ul className="flex flex-col gap-2 font-sans text-sm text-white/70">
                <li className="flex justify-between gap-4">
                  <span>Mon – Thu</span>
                  <span>7:30am – 6:30pm</span>
                </li>
                <li className="flex justify-between gap-4">
                  <span>Friday</span>
                  <span>7:30am – 5:00pm</span>
                </li>
                <li className="flex justify-between gap-4">
                  <span>Saturday</span>
                  <span>7:30am – 3:00pm</span>
                </li>
                <li className="flex justify-between gap-4">
                  <span>Sunday</span>
                  <span>9:00am – 3:00pm</span>
                </li>
              </ul>
            </div>

            {/* Follow */}
            <div>
              <div
                className="font-serif text-lg font-semibold mb-5"
                style={{ color: "#C8A463" }}
              >
                Follow Us
              </div>
              <ul className="flex flex-col gap-3 font-sans text-sm">
                <li>
                  <a
                    href="https://www.google.com/search?q=209+NYC+Dental"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 text-white/70 hover:text-white transition-colors"
                    data-ocid="footer.social.link"
                  >
                    <Star className="w-4 h-4" style={{ color: "#C8A463" }} />
                    Google Reviews
                  </a>
                </li>
                <li>
                  <a
                    href="https://www.instagram.com/209nycdental"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 text-white/70 hover:text-white transition-colors"
                    data-ocid="footer.social.link"
                  >
                    <span
                      className="w-4 h-4 flex items-center justify-center text-xs font-bold"
                      style={{ color: "#C8A463" }}
                    >
                      IG
                    </span>
                    @209nycdental
                  </a>
                </li>
                <li>
                  <a
                    href="https://www.facebook.com/209nycDentist"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 text-white/70 hover:text-white transition-colors"
                    data-ocid="footer.social.link"
                  >
                    <Facebook
                      className="w-4 h-4"
                      style={{ color: "#C8A463" }}
                    />
                    @209nycDentist
                  </a>
                </li>
                <li>
                  <a
                    href="https://www.yelp.com/biz/209-nyc-dental"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 text-white/70 hover:text-white transition-colors"
                    data-ocid="footer.social.link"
                  >
                    <Star className="w-4 h-4" style={{ color: "#C8A463" }} />
                    Yelp
                  </a>
                </li>
              </ul>
            </div>
          </div>

          <div className="border-t border-white/10 pt-6 flex flex-col sm:flex-row items-center justify-between gap-3">
            <p className="font-sans text-xs text-white/40">
              © {new Date().getFullYear()} 209 NYC Dental. All rights reserved.
            </p>
            <div className="flex items-center gap-4">
              <p className="font-sans text-xs text-white/40">
                Built with ❤️ using{" "}
                <a
                  href={`https://caffeine.ai?utm_source=caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(window.location.hostname)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="underline hover:text-white/70 transition-colors"
                >
                  caffeine.ai
                </a>
              </p>
              <a
                href="#admin"
                className="font-sans text-xs text-white/20 hover:text-white/50 transition-colors"
                data-ocid="footer.admin.link"
              >
                Admin
              </a>
            </div>
          </div>
        </div>
      </footer>

      {/* BOOKING MODAL */}
      <Dialog open={bookingOpen} onOpenChange={setBookingOpen}>
        <DialogContent
          className="max-w-lg max-h-[90vh] overflow-y-auto"
          data-ocid="booking.dialog"
        >
          <DialogHeader>
            <DialogTitle
              className="font-serif text-xl font-bold"
              style={{ color: "#132B45" }}
            >
              Book an Appointment
            </DialogTitle>
            <p className="font-sans text-sm text-gray-500 mt-1">
              Fill in your details and we&apos;ll confirm your appointment
              shortly.
            </p>
          </DialogHeader>

          <form
            onSubmit={handleBookingSubmit}
            className="mt-4 flex flex-col gap-4"
          >
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="flex flex-col gap-1.5">
                <Label
                  htmlFor="booking-name"
                  className="font-sans text-sm font-medium"
                  style={{ color: "#132B45" }}
                >
                  Full Name <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="booking-name"
                  placeholder="Jane Smith"
                  required
                  value={bookingForm.name}
                  onChange={(e) =>
                    setBookingForm((p) => ({ ...p, name: e.target.value }))
                  }
                  className="font-sans text-sm"
                  data-ocid="booking.name.input"
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <Label
                  htmlFor="booking-phone"
                  className="font-sans text-sm font-medium"
                  style={{ color: "#132B45" }}
                >
                  Phone <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="booking-phone"
                  type="tel"
                  placeholder="(212) 555-0100"
                  required
                  value={bookingForm.phone}
                  onChange={(e) =>
                    setBookingForm((p) => ({ ...p, phone: e.target.value }))
                  }
                  className="font-sans text-sm"
                  data-ocid="booking.phone.input"
                />
              </div>
            </div>

            <div className="flex flex-col gap-1.5">
              <Label
                htmlFor="booking-email"
                className="font-sans text-sm font-medium"
                style={{ color: "#132B45" }}
              >
                Email <span className="text-red-500">*</span>
              </Label>
              <Input
                id="booking-email"
                type="email"
                placeholder="jane@example.com"
                required
                value={bookingForm.email}
                onChange={(e) =>
                  setBookingForm((p) => ({ ...p, email: e.target.value }))
                }
                className="font-sans text-sm"
                data-ocid="booking.email.input"
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <Label
                className="font-sans text-sm font-medium"
                style={{ color: "#132B45" }}
              >
                Service <span className="text-red-500">*</span>
              </Label>
              <Select
                required
                value={bookingForm.service}
                onValueChange={(v) =>
                  setBookingForm((p) => ({ ...p, service: v }))
                }
              >
                <SelectTrigger
                  className="font-sans text-sm"
                  data-ocid="booking.service.select"
                >
                  <SelectValue placeholder="Select a service" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="General Checkup">
                    General Checkup
                  </SelectItem>
                  <SelectItem value="Dental Implants">
                    Dental Implants
                  </SelectItem>
                  <SelectItem value="Invisalign">Invisalign</SelectItem>
                  <SelectItem value="Cosmetic Dentistry">
                    Cosmetic Dentistry
                  </SelectItem>
                  <SelectItem value="Periodontics">Periodontics</SelectItem>
                  <SelectItem value="Emergency Dental">
                    Emergency Dental
                  </SelectItem>
                  <SelectItem value="Other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex flex-col gap-1.5">
              <Label
                htmlFor="booking-date"
                className="font-sans text-sm font-medium"
                style={{ color: "#132B45" }}
              >
                Preferred Date
              </Label>
              <Input
                id="booking-date"
                type="date"
                min={new Date().toISOString().split("T")[0]}
                value={bookingForm.preferredDate}
                onChange={(e) =>
                  setBookingForm((p) => ({
                    ...p,
                    preferredDate: e.target.value,
                  }))
                }
                className="font-sans text-sm"
                data-ocid="booking.date.input"
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <Label
                htmlFor="booking-message"
                className="font-sans text-sm font-medium"
                style={{ color: "#132B45" }}
              >
                Message (optional)
              </Label>
              <Textarea
                id="booking-message"
                placeholder="Any additional information or specific concerns…"
                rows={3}
                value={bookingForm.message}
                onChange={(e) =>
                  setBookingForm((p) => ({ ...p, message: e.target.value }))
                }
                className="font-sans text-sm resize-none"
                data-ocid="booking.message.textarea"
              />
            </div>

            <div className="flex gap-3 pt-2">
              <Button
                type="button"
                variant="outline"
                className="flex-1 font-sans text-sm"
                onClick={() => setBookingOpen(false)}
                data-ocid="booking.cancel.button"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={bookingSubmitting || !bookingForm.service}
                className="flex-1 font-sans text-sm font-semibold"
                style={{ backgroundColor: "#132B45", color: "white" }}
                data-ocid="booking.submit.button"
              >
                {bookingSubmitting ? (
                  <span className="flex items-center justify-center gap-2">
                    <span className="animate-spin rounded-full h-4 w-4 border-2 border-white/30 border-t-white" />
                    Submitting…
                  </span>
                ) : (
                  "Request Appointment"
                )}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
