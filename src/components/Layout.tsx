import { useEffect, useLayoutEffect, useState } from "react";
import { Link, NavLink, Outlet, useLocation } from "react-router";
import { ArrowRight, Globe2, Mail, MapPin, Menu, Phone, Send, Share2, X, Zap } from "lucide-react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

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

export function Brand({ light = false }: { light?: boolean }) {
  return (
    <Link to="/" className="brand inline-flex items-center gap-3" aria-label="Powertech Engineers home">
      <span className="grid size-11 place-items-center bg-orange text-white shadow-lg shadow-orange/20">
        <Zap size={23} fill="currentColor" />
      </span>
      <span className={`leading-none ${light ? "text-white" : "text-navy"}`}>
        <strong className="block text-[19px] font-extrabold tracking-[.04em]">POWERTECH</strong>
        <span className="mt-1 block text-[10px] font-bold tracking-[.34em] text-orange">ENGINEERS</span>
      </span>
    </Link>
  );
}

function Navbar() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);
  useEffect(() => setOpen(false), [location.pathname]);

  return (
    <header className={`fixed inset-x-0 top-0 z-50 transition-all duration-300 ${scrolled ? "bg-white shadow-[0_8px_30px_rgba(8,28,55,.09)]" : "bg-white/95"}`}>
      <div className="h-1 bg-orange" />
      <nav className={`site-container flex items-center justify-between transition-all ${scrolled ? "h-[76px]" : "h-[86px]"}`} aria-label="Main navigation">
        <Brand />
        <div className="hidden items-center gap-7 xl:flex">
          {nav.map(([label, href]) => (
            <NavLink key={href} to={href} end={href === "/"} className={({ isActive }) => `nav-link ${isActive ? "active" : ""}`}>
              {label}
            </NavLink>
          ))}
          <Link to="/contact" className="btn-primary ml-1">
            Get a quote <ArrowRight size={16} />
          </Link>
        </div>
        <button className="grid size-11 place-items-center border border-slate-200 text-navy xl:hidden" onClick={() => setOpen(!open)} aria-label="Toggle navigation" aria-expanded={open}>
          {open ? <X /> : <Menu />}
        </button>
      </nav>
      <div className={`overflow-hidden bg-white transition-all duration-300 xl:hidden ${open ? "max-h-[620px] border-t border-slate-100" : "max-h-0"}`}>
        <div className="site-container flex flex-col py-4">
          {nav.map(([label, href]) => (
            <NavLink key={href} to={href} end={href === "/"} className={({ isActive }) => `border-b border-slate-100 px-1 py-3.5 text-sm font-semibold ${isActive ? "text-orange" : "text-navy"}`}>
              {label}
            </NavLink>
          ))}
          <Link to="/contact" className="btn-primary mt-4 justify-center">Get a quote <ArrowRight size={16} /></Link>
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
            <a className="flex gap-3 hover:text-white" href="mailto:projects@powertech.in"><Mail className="shrink-0 text-orange" size={18} />projects@powertech.in</a>
          </div>
        </div>
      </div>
      <div className="border-t border-white/10">
        <div className="site-container flex flex-col gap-2 py-5 text-xs text-slate-500 sm:flex-row sm:justify-between">
          <p>© 2026 Powertech Engineers. All rights reserved.</p><p>Reliable Power. Smarter Engineering.</p>
        </div>
      </div>
    </footer>
  );
}

export function RootLayout() {
  const location = useLocation();
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "instant" });
    const title = location.pathname === "/" ? "Powertech Engineers | Industrial Electrical Solutions" : `${location.pathname.split("/").filter(Boolean).map((s) => s.replaceAll("-", " ")).map((s) => s.replace(/\b\w/g, (c) => c.toUpperCase())).join(" | ")} | Powertech Engineers`;
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
