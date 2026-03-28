import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Link } from "@tanstack/react-router";
import {
  Award,
  ChevronRight,
  Clock,
  Instagram,
  MapPin,
  Phone,
  Scissors,
  Sparkles,
  Star,
  Users,
} from "lucide-react";
import { motion } from "motion/react";
import { useRef } from "react";
import BookingForm from "../components/BookingForm";

const SERVICES = [
  {
    emoji: "✂️",
    title: "Hair Cut & Style",
    desc: "Precision cuts and stunning styles tailored to your face shape and personality.",
  },
  {
    emoji: "🎨",
    title: "Hair Coloring",
    desc: "Vibrant shades, balayage, highlights — our colorists bring your vision to life.",
  },
  {
    emoji: "💍",
    title: "Bridal Makeup",
    desc: "Flawless bridal looks that last all day. Packages for the entire bridal party.",
  },
  {
    emoji: "✨",
    title: "Facial & Cleanup",
    desc: "Deep cleansing facials and brightening cleanups for radiant, healthy skin.",
  },
  {
    emoji: "💆",
    title: "Keratin Treatment",
    desc: "Smooth, frizz-free hair with our professional keratin smoothing treatments.",
  },
  {
    emoji: "🌿",
    title: "Mehndi",
    desc: "Intricate bridal and festive mehndi designs by skilled henna artists.",
  },
  {
    emoji: "💅",
    title: "Nail Art",
    desc: "Creative nail designs, gel manicures, and pedicures for every occasion.",
  },
  {
    emoji: "🪷",
    title: "Waxing & Threading",
    desc: "Expert hair removal services for smooth, beautiful skin.",
  },
];

const GALLERY = [
  {
    label: "Bridal",
    gradient: "from-rose-900/60 via-rose-800/40 to-pink-900/60",
  },
  {
    label: "Hair Color",
    gradient: "from-amber-900/60 via-yellow-800/40 to-amber-900/60",
  },
  {
    label: "Makeup",
    gradient: "from-purple-900/60 via-pink-800/40 to-rose-900/60",
  },
  {
    label: "Keratin",
    gradient: "from-stone-800/60 via-amber-900/40 to-stone-800/60",
  },
  {
    label: "Nail Art",
    gradient: "from-pink-900/60 via-rose-800/40 to-fuchsia-900/60",
  },
  {
    label: "Mehndi",
    gradient: "from-green-900/60 via-emerald-800/40 to-teal-900/60",
  },
];

const TESTIMONIALS = [
  {
    name: "Priya Sharma",
    review:
      "Sanrix Salon is absolutely magical! My bridal makeup was flawless and stayed perfect throughout the entire ceremony. The team is so professional and talented.",
    service: "Bridal Makeup",
  },
  {
    name: "Neha Gupta",
    review:
      "I've been coming here for my hair color for 2 years now. The results are always stunning. Love the warm ambiance and expert staff!",
    service: "Hair Coloring",
  },
  {
    name: "Ritika Verma",
    review:
      "The keratin treatment I got here was life-changing. My hair has never been so smooth and manageable. Highly recommend to everyone!",
    service: "Keratin Treatment",
  },
];

export default function Landing() {
  const bookingRef = useRef<HTMLElement>(null);

  const scrollToBooking = () => {
    bookingRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 glass-dark border-b border-primary/10">
        <div className="container flex items-center justify-between h-16">
          <div className="flex items-center gap-2">
            <Scissors className="w-5 h-5 gold-text" />
            <span className="font-display text-lg font-semibold gold-text tracking-wide">
              SANRIX SALON
            </span>
          </div>
          <nav className="hidden md:flex items-center gap-6 text-sm">
            {["Services", "Gallery", "About", "Contact"].map((item) => (
              <a
                key={item}
                href={`#${item.toLowerCase()}`}
                data-ocid={"nav.link"}
                className="text-muted-foreground hover:text-primary transition-colors"
              >
                {item}
              </a>
            ))}
          </nav>
          <div className="flex items-center gap-3">
            <a
              href="tel:9911831623"
              className="hidden sm:flex items-center gap-1.5 text-sm text-muted-foreground hover:text-primary transition-colors"
            >
              <Phone className="w-3.5 h-3.5" />
              99118 31623
            </a>
            <Button
              onClick={scrollToBooking}
              size="sm"
              data-ocid="nav.primary_button"
              className="bg-primary text-primary-foreground hover:bg-primary/90 text-xs font-semibold px-4"
            >
              Book Now
            </Button>
            <Link to="/admin">
              <Button
                variant="outline"
                size="sm"
                data-ocid="nav.secondary_button"
                className="text-xs gold-border gold-text hover:bg-primary/10"
              >
                Admin
              </Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-16">
        {/* Background pattern */}
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-gradient-to-br from-background via-background to-card" />
          <div
            className="absolute inset-0 opacity-5"
            style={{
              backgroundImage:
                "radial-gradient(circle at 1px 1px, oklch(0.76 0.10 75) 1px, transparent 0)",
              backgroundSize: "48px 48px",
            }}
          />
          <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-primary/5 blur-3xl" />
        </div>

        <div className="container relative z-10 text-center">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            <Badge className="mb-6 bg-primary/15 text-primary border-primary/30 text-xs tracking-widest uppercase font-medium px-4 py-1.5">
              <Star className="w-3 h-3 mr-1.5 fill-current" />
              Delhi's Premier Beauty Studio
            </Badge>

            <h1 className="font-display text-5xl sm:text-7xl font-bold leading-tight mb-6">
              Beauty <span className="gold-gradient italic">Redefined</span>
            </h1>

            <p className="text-muted-foreground text-lg sm:text-xl max-w-xl mx-auto mb-8 leading-relaxed">
              Experience world-class beauty treatments at Sanrix Salon — where
              every visit transforms you inside and out.
            </p>

            <div className="flex items-center justify-center gap-2 mb-10">
              <div className="flex">
                {[1, 2, 3, 4, 5].map((s) => (
                  <Star key={s} className="w-5 h-5 fill-primary text-primary" />
                ))}
              </div>
              <span className="font-display text-lg font-semibold text-foreground">
                4.7
              </span>
              <span className="text-muted-foreground text-sm">·</span>
              <span className="text-muted-foreground text-sm">
                1,467 Reviews
              </span>
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Button
                onClick={scrollToBooking}
                size="lg"
                data-ocid="hero.primary_button"
                className="bg-primary text-primary-foreground hover:bg-primary/90 gold-glow text-base font-semibold px-8 h-13"
              >
                Book Appointment
                <ChevronRight className="ml-1 w-4 h-4" />
              </Button>
              <a href="tel:9911831623">
                <Button
                  variant="outline"
                  size="lg"
                  data-ocid="hero.secondary_button"
                  className="gold-border gold-text hover:bg-primary/10 text-base font-semibold px-8"
                >
                  <Phone className="mr-2 w-4 h-4" />
                  99118 31623
                </Button>
              </a>
            </div>
          </motion.div>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 opacity-40">
          <div className="w-px h-10 bg-gradient-to-b from-primary to-transparent" />
        </div>
      </section>

      {/* Stats */}
      <div className="section-divider" />
      <section className="py-10 bg-card/50">
        <div className="container">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            {[
              {
                icon: <Users className="w-5 h-5" />,
                value: "1467+",
                label: "Happy Clients",
              },
              {
                icon: <Star className="w-5 h-5" />,
                value: "4.7 ★",
                label: "Star Rating",
              },
              {
                icon: <Award className="w-5 h-5" />,
                value: "8+ Yrs",
                label: "Experience",
              },
              {
                icon: <Clock className="w-5 h-5" />,
                value: "11 PM",
                label: "Open Till",
              },
            ].map(({ icon, value, label }) => (
              <motion.div
                key={label}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5 }}
                className="flex flex-col items-center gap-2"
              >
                <div className="gold-text">{icon}</div>
                <div className="font-display text-2xl font-bold gold-text">
                  {value}
                </div>
                <div className="text-muted-foreground text-xs uppercase tracking-widest">
                  {label}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
      <div className="section-divider" />

      {/* Services */}
      <section id="services" className="py-20">
        <div className="container">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-14"
          >
            <p className="text-primary text-xs uppercase tracking-[0.25em] font-semibold mb-3">
              What We Offer
            </p>
            <h2 className="font-display text-4xl font-bold text-foreground">
              Our <span className="gold-gradient italic">Services</span>
            </h2>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {SERVICES.map(({ emoji, title, desc }, i) => (
              <motion.div
                key={title}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.07 }}
                className="group relative p-6 rounded-xl gold-border bg-card hover:bg-card/80 transition-all duration-300 hover:gold-glow cursor-default"
              >
                <div className="text-3xl mb-4">{emoji}</div>
                <h3 className="font-semibold text-foreground mb-2 group-hover:gold-text transition-colors">
                  {title}
                </h3>
                <p className="text-muted-foreground text-sm leading-relaxed">
                  {desc}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* About */}
      <section id="about" className="py-20 bg-card/30">
        <div className="container">
          <div className="max-w-3xl mx-auto text-center">
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <p className="text-primary text-xs uppercase tracking-[0.25em] font-semibold mb-3">
                Our Story
              </p>
              <h2 className="font-display text-4xl font-bold text-foreground mb-6">
                About <span className="gold-gradient italic">Sanrix</span>
              </h2>
              <p className="text-muted-foreground text-lg leading-relaxed mb-6">
                Sanrix Salon is Delhi's premium beauty destination, trusted by
                over 1,400 clients for more than 8 years. We are dedicated to
                bringing out your natural beauty through expertly crafted
                treatments.
              </p>
              <p className="text-muted-foreground leading-relaxed">
                From everyday grooming to grand bridal occasions, our team of
                expert stylists and beauticians deliver personalized results
                that exceed expectations. Visit us any day — we're open from 9
                AM to <span className="gold-text font-semibold">11 PM</span>.
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Gallery */}
      <section id="gallery" className="py-20">
        <div className="container">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-14"
          >
            <p className="text-primary text-xs uppercase tracking-[0.25em] font-semibold mb-3">
              Our Work
            </p>
            <h2 className="font-display text-4xl font-bold">
              <span className="gold-gradient italic">Gallery</span>
            </h2>
          </motion.div>

          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {GALLERY.map(({ label, gradient }, i) => (
              <motion.div
                key={label}
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08 }}
                className="relative aspect-square rounded-xl overflow-hidden gold-border group cursor-pointer"
              >
                <div
                  className={`absolute inset-0 bg-gradient-to-br ${gradient} group-hover:opacity-80 transition-opacity`}
                />
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="font-display text-white/90 text-xl font-semibold tracking-wide">
                    {label}
                  </span>
                </div>
                <div className="absolute inset-0 border-2 border-primary/0 group-hover:border-primary/30 rounded-xl transition-all" />
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 bg-card/30">
        <div className="container">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-14"
          >
            <p className="text-primary text-xs uppercase tracking-[0.25em] font-semibold mb-3">
              Client Love
            </p>
            <h2 className="font-display text-4xl font-bold">
              What They <span className="gold-gradient italic">Say</span>
            </h2>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {TESTIMONIALS.map(({ name, review, service }, i) => (
              <motion.div
                key={name}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="p-6 rounded-xl gold-border bg-card"
              >
                <div className="flex mb-3">
                  {[1, 2, 3, 4, 5].map((s) => (
                    <Star
                      key={s}
                      className="w-4 h-4 fill-primary text-primary"
                    />
                  ))}
                </div>
                <p className="text-muted-foreground text-sm leading-relaxed mb-4 italic">
                  "{review}"
                </p>
                <div>
                  <div className="font-semibold text-foreground text-sm">
                    {name}
                  </div>
                  <div className="text-primary text-xs">{service}</div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Booking */}
      <section id="booking" ref={bookingRef} className="py-20">
        <div className="container">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <p className="text-primary text-xs uppercase tracking-[0.25em] font-semibold mb-3">
              Reserve Your Spot
            </p>
            <h2 className="font-display text-4xl font-bold">
              Book an <span className="gold-gradient italic">Appointment</span>
            </h2>
            <p className="text-muted-foreground mt-3">
              Fill in the form below and we'll confirm your appointment shortly.
            </p>
          </motion.div>

          <div className="max-w-2xl mx-auto">
            <div className="p-8 rounded-2xl gold-border bg-card">
              <BookingForm />
            </div>
          </div>
        </div>
      </section>

      {/* Contact */}
      <section id="contact" className="py-20 bg-card/30">
        <div className="container">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <p className="text-primary text-xs uppercase tracking-[0.25em] font-semibold mb-3">
              Find Us
            </p>
            <h2 className="font-display text-4xl font-bold">
              <span className="gold-gradient italic">Contact</span>
            </h2>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-3xl mx-auto">
            <a
              href="tel:9911831623"
              data-ocid="contact.primary_button"
              className="flex flex-col items-center gap-3 p-6 rounded-xl gold-border bg-card hover:gold-glow transition-all text-center group"
            >
              <Phone className="w-6 h-6 gold-text" />
              <div>
                <div className="text-xs uppercase tracking-widest text-muted-foreground mb-1">
                  Call Us
                </div>
                <div className="font-semibold text-foreground group-hover:gold-text transition-colors">
                  99118 31623
                </div>
              </div>
            </a>

            <a
              href="https://maps.app.goo.gl/kSmGA6SYeXjXMAip8"
              target="_blank"
              rel="noopener noreferrer"
              data-ocid="contact.link"
              className="flex flex-col items-center gap-3 p-6 rounded-xl gold-border bg-card hover:gold-glow transition-all text-center group"
            >
              <MapPin className="w-6 h-6 gold-text" />
              <div>
                <div className="text-xs uppercase tracking-widest text-muted-foreground mb-1">
                  Location
                </div>
                <div className="font-semibold text-foreground group-hover:gold-text transition-colors">
                  Delhi
                </div>
                <div className="text-xs text-primary mt-0.5">
                  View on Maps →
                </div>
              </div>
            </a>

            <div className="flex flex-col items-center gap-3 p-6 rounded-xl gold-border bg-card text-center">
              <Clock className="w-6 h-6 gold-text" />
              <div>
                <div className="text-xs uppercase tracking-widest text-muted-foreground mb-1">
                  Hours
                </div>
                <div className="font-semibold text-foreground">Mon – Sun</div>
                <div className="text-primary text-sm">9:00 AM – 11:00 PM</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 border-t border-border">
        <div className="container flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <Scissors className="w-4 h-4 gold-text" />
            <span className="font-display font-semibold gold-text">
              SANRIX SALON
            </span>
            <span className="text-muted-foreground text-sm">
              · Beauty Redefined
            </span>
          </div>
          <div className="text-center text-muted-foreground text-sm">
            <a
              href="tel:9911831623"
              className="hover:gold-text transition-colors"
            >
              99118 31623
            </a>
          </div>
          <div className="text-muted-foreground text-xs">
            © {new Date().getFullYear()}. Built with ❤️ using{" "}
            <a
              href={`https://caffeine.ai?utm_source=caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(typeof window !== "undefined" ? window.location.hostname : "")}`}
              target="_blank"
              rel="noopener noreferrer"
              className="hover:gold-text transition-colors"
            >
              caffeine.ai
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}
