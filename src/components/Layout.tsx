import { useEffect, useLayoutEffect, useState } from "react";
import { Link, NavLink, Outlet, useLocation } from "react-router";
import { ArrowRight, Globe2, Mail, MapPin, Menu, Phone, Send, Share2, X, Zap } from "lucide-react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import InteractiveTickerButton from "./InteractiveTickerButton";

gsap.registerPlugin(ScrollTrigger);

const nav = [
  ["Home", "/"],
  ["About", "/about"],
  ["Products", "/products"],
  ["Services", "/services"],
  ["Projects", "/projects"],
  ["Clients", "/clients"],
  ["Contact", "/contact"],
];

export function Brand({ light = false, compact = false }: { light?: boolean; compact?: boolean }) {
  return (
    <Link to="/" className="brand inline-flex items-center gap-2 sm:gap-2.5 transition-all duration-500" aria-label="Sharma Electrical home">
      <span className={`grid place-items-center bg-orange text-white shadow-md shadow-orange/20 transition-all duration-500 ${compact ? "size-8.5 sm:size-9 rounded-full" : "size-10 sm:size-11 rounded"}`}>
        <Zap size={compact ? 17 : 22} fill="currentColor" className="transition-all duration-500" />
      </span>
      <span className={`leading-none ${light ? "text-white" : "text-navy"}`}>
        <strong className={`block font-extrabold tracking-[.04em] transition-all duration-500 ${compact ? "text-[15px] sm:text-[16px]" : "text-[18px] sm:text-[19px]"}`}>
          SHARMA
        </strong>
        <span className={`mt-0.5 block font-bold tracking-[.32em] text-orange transition-all duration-500 ${compact ? "text-[8px] sm:text-[8.5px]" : "text-[9.5px] sm:text-[10px]"}`}>
          ELECTRICAL
        </span>
      </span>
    </Link>
  );
}

function Navbar() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 15);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);
  useEffect(() => setOpen(false), [location.pathname]);

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 pointer-events-none transition-all duration-500 ease-out flex flex-col items-center ${
        scrolled ? "pt-2.5 sm:pt-3.5 px-3 sm:px-6 lg:px-8" : "pt-0 px-0"
      }`}
    >
      {/* Top Edge Accent line when at top */}
      <div
        className={`w-full h-[2.5px] bg-gradient-to-r from-orange/85 via-amber-400/90 to-orange/85 transition-all duration-500 ${
          scrolled ? "opacity-0 h-0" : "opacity-75"
        }`}
      />

      {/* Floating Pill Nav Container */}
      <div className={`w-full transition-all duration-500 ease-out ${scrolled ? "max-w-[1360px]" : "max-w-[1520px]"}`}>
        <nav
          className={`pointer-events-auto relative w-full flex items-center justify-between transition-all duration-500 ease-out ${
            scrolled
              ? "rounded-full bg-[#061527]/60 backdrop-blur-xl border border-white/15 shadow-[0_16px_40px_rgba(0,0,0,0.35)] shadow-[inset_0_1px_0_rgba(255,255,255,0.12)] h-[58px] sm:h-[62px] px-4 sm:px-6 lg:px-7"
              : "rounded-none bg-transparent border-b border-transparent shadow-none h-[84px] sm:h-[90px] px-4 sm:px-6 lg:px-8 xl:px-12"
          }`}
          aria-label="Main navigation"
        >
          {/* Left: Brand */}
          <div className="shrink-0 z-10">
            <Brand light compact={scrolled} />
          </div>

          {/* True Center: Nav Links */}
          <div className="hidden lg:flex items-center gap-2.5 lg:gap-3.5 xl:gap-4.5 2xl:gap-5 absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-10">
            {nav.map(([label, href]) => (
              <NavLink
                key={href}
                to={href}
                end={href === "/"}
                className={({ isActive }) => `nav-link ${isActive ? "active" : ""}`}
              >
                {label}
              </NavLink>
            ))}
          </div>

          {/* Right Actions: Consultation Ticker + Compact Get a Quote Button */}
          <div className="hidden lg:flex items-center gap-2.5 xl:gap-3 shrink-0 ml-auto z-10">
            <InteractiveTickerButton />
            
            <Link
              to="/contact"
              className={`btn-primary group shadow-sm shadow-orange/20 hover:shadow-md hover:shadow-orange/30 hover:scale-[1.02] active:scale-[0.98] transition-all duration-500 flex items-center gap-1.5 ${
                scrolled ? "!px-3.5 !py-2 text-[10.5px] xl:text-[11px] rounded-full" : "!px-4 !py-2.5 text-[11px] xl:text-[11.5px] rounded"
              }`}
            >
              <span className="font-bold tracking-wider">Get a quote</span>
              <ArrowRight size={13} className="transition-transform duration-200 group-hover:translate-x-1" />
            </Link>
          </div>

          {/* Mobile Hamburger Button - Only below 1024px */}
          <button
            className={`grid place-items-center border transition-all duration-500 hover:border-orange hover:text-orange hover:shadow-sm lg:hidden ${
              scrolled
                ? "size-9 rounded-full border-white/20 bg-white/10 backdrop-blur-md text-white shadow-sm"
                : "size-10 rounded-lg border-white/20 bg-white/10 backdrop-blur-md text-white shadow-sm"
            }`}
            onClick={() => setOpen(!open)}
            aria-label="Toggle navigation"
            aria-expanded={open}
          >
            {open ? <X size={20} /> : <Menu size={20} />}
          </button>
        </nav>
      </div>

      {/* Mobile Drawer */}
      <div
        className={`pointer-events-auto w-full transition-all duration-500 ease-out lg:hidden ${
          scrolled ? "max-w-[1360px] px-0 mt-2" : "w-full"
        }`}
      >
        <div
          className={`overflow-hidden backdrop-blur-2xl transition-all duration-500 ${
            scrolled
              ? "rounded-2xl bg-[#061527]/95 border border-white/15 shadow-2xl"
              : "bg-[#061527]/95 border-t border-white/10 shadow-2xl"
          } ${open ? "max-h-[640px] opacity-100" : "max-h-0 opacity-0 pointer-events-none"}`}
        >
          <div className="site-container flex flex-col py-5 space-y-1">
            {nav.map(([label, href]) => (
              <NavLink
                key={href}
                to={href}
                end={href === "/"}
                className={({ isActive }) =>
                  `rounded-md px-3 py-3 text-sm font-bold tracking-wide transition-colors ${
                    isActive ? "bg-orange/15 text-orange" : "text-slate-200 hover:bg-white/5 hover:text-orange"
                  }`
                }
              >
                {label}
              </NavLink>
            ))}
            <div className="pt-3 border-t border-white/10">
              <Link to="/contact" className="btn-primary w-full justify-center !py-3.5 rounded-full shadow-md shadow-orange/25">
                Get a quote <ArrowRight size={16} />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}

function Footer() {
  return (
    <footer className="bg-[#07182c] text-white">
      <div className="site-container grid gap-12 py-16 md:grid-cols-2 lg:grid-cols-[1.4fr_.7fr_.9fr_1.1fr]">
        <div>
          <Brand light />
          <p className="mt-6 max-w-sm text-sm leading-7 text-slate-400">Engineered electrical panels, automation and turnkey power solutions built for safer, smarter and more productive industries.</p>
          <div className="mt-6 flex gap-2">
            {[Globe2, Share2, Send].map((Icon, i) => <a key={i} href="#" aria-label="Social media" className="grid size-10 place-items-center border border-white/10 text-slate-300 transition hover:border-orange hover:bg-orange hover:text-white"><Icon size={17} /></a>)}
          </div>
        </div>
        <div>
          <h3 className="footer-title">Company</h3>
          <div className="footer-links">{nav.slice(1).map(([label, href]) => <Link key={href} to={href}>{label}</Link>)}</div>
        </div>
        <div>
          <h3 className="footer-title">Our solutions</h3>
          <div className="footer-links">
            <Link to="/products/lt-control-panel">LT Control Panels</Link>
            <Link to="/products/pcc-panel">PCC Panels</Link>
            <Link to="/products/plc-automation-panel">PLC Automation</Link>
            <Link to="/services">Turnkey Projects</Link>
            <Link to="/services">Annual Maintenance</Link>
          </div>
        </div>
        <div>
          <h3 className="footer-title">Get in touch</h3>
          <div className="space-y-5 text-sm text-slate-400">
            <p className="flex gap-3"><MapPin className="mt-1 shrink-0 text-orange" size={18} />Plot 42, GIDC Industrial Estate, Vadodara, Gujarat 390010</p>
            <a className="flex gap-3 hover:text-white" href="tel:+919876543210"><Phone className="shrink-0 text-orange" size={18} />+91 98765 43210</a>
            <a className="flex gap-3 hover:text-white" href="mailto:projects@sharmaelectrical.in"><Mail className="shrink-0 text-orange" size={18} />projects@sharmaelectrical.in</a>
          </div>
        </div>
      </div>
      <div className="border-t border-white/10">
        <div className="site-container flex flex-col gap-2 py-5 text-xs text-slate-500 sm:flex-row sm:justify-between">
          <p>© 2026 Sharma Electrical. All rights reserved.</p><p>Reliable Power. Smarter Engineering.</p>
        </div>
      </div>
    </footer>
  );
}

export function RootLayout() {
  const location = useLocation();
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "instant" });
    const title = location.pathname === "/" ? "Sharma Electrical | Industrial Electrical Solutions" : `${location.pathname.split("/").filter(Boolean).map((s) => s.replaceAll("-", " ")).map((s) => s.replace(/\b\w/g, (c) => c.toUpperCase())).join(" | ")} | Sharma Electrical`;
    document.title = title;
  }, [location.pathname]);

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      gsap.utils.toArray<HTMLElement>("[data-gsap-reveal]").forEach((el) => {
        gsap.fromTo(el, { y: 34, opacity: 0 }, { y: 0, opacity: 1, duration: 0.85, ease: "power3.out", scrollTrigger: { trigger: el, start: "top 88%", once: true } });
      });
    });
    return () => ctx.revert();
  }, [location.pathname]);

  return <><Navbar /><main><Outlet /></main><Footer /></>;
}
