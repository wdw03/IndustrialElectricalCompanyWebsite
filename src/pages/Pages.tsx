import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { Link, useParams } from "react-router";
import { motion, useInView, useMotionValue, useSpring } from "framer-motion";
import {
  ArrowRight, Award, Bolt, Building2, Check, CheckCircle2, ChevronRight, CircuitBoard,
  Clock3, Cog, Factory, Gauge, HardHat, Headphones, Mail, MapPin, Phone, Search,
  Settings, ShieldCheck, SlidersHorizontal, Wrench, Zap,
} from "lucide-react";
import products from "../data/products";
import ThreePanelScene from "../components/ThreePanelScene";
import InteractivePanel3D from "../components/InteractivePanel3D";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const HERO = "https://images.unsplash.com/photo-1636986056048-06f553d44666?auto=format&fit=crop&w=2000&q=90";
const ABOUT = "https://images.unsplash.com/photo-1702128411190-5061e7756d5c?auto=format&fit=crop&w=1400&q=85";
const FACTORY_IMAGE = "https://images.unsplash.com/photo-1636867900334-025210ac78a0?auto=format&fit=crop&w=1600&q=85";

const services = [
  { icon: CircuitBoard, title: "Electrical Panel Manufacturing", text: "Purpose-built LT, PCC, MCC and APFC panels with premium switchgear and rigorous quality control." },
  { icon: Cog, title: "Industrial Automation", text: "PLC, HMI, SCADA and drive integration that improves productivity, visibility and process consistency." },
  { icon: Wrench, title: "Electrical Installation", text: "Safe site installation, cable laying and integration delivered by qualified project teams." },
  { icon: Bolt, title: "HT/LT Electrical Solutions", text: "End-to-end power distribution from transformer yard to the final industrial load." },
  { icon: Gauge, title: "Testing & Commissioning", text: "Structured validation, protection testing and commissioning for dependable start-up." },
  { icon: Settings, title: "Annual Maintenance", text: "Preventive and breakdown maintenance plans that protect uptime and asset life." },
  { icon: Factory, title: "Turnkey Electrical Projects", text: "Single-point responsibility from engineering and supply through installation and handover." },
  { icon: SlidersHorizontal, title: "Control & Instrumentation", text: "Precise field instrumentation, control architecture and data acquisition solutions." },
];

const projects = [
  { name: "Automotive Assembly Power Upgrade", location: "Sanand, Gujarat", category: "Industrial", image: FACTORY_IMAGE },
  { name: "Smart Commercial Power Distribution", location: "Pune, Maharashtra", category: "Commercial", image: "https://images.unsplash.com/photo-1639648263454-3d2f0c3b7434?auto=format&fit=crop&w=1200&q=85" },
  { name: "Water Treatment Automation", location: "Indore, Madhya Pradesh", category: "Automation", image: "https://images.unsplash.com/photo-1686710278078-26f028c6dad8?auto=format&fit=crop&w=1200&q=85" },
  { name: "Metro Auxiliary Power System", location: "Ahmedabad, Gujarat", category: "Infrastructure", image: "https://images.unsplash.com/photo-1636867759143-c28c1e909bd3?auto=format&fit=crop&w=1200&q=85" },
  { name: "Pharma Plant MCC Modernization", location: "Ankleshwar, Gujarat", category: "Industrial", image: HERO },
  { name: "Warehouse Energy Management", location: "Navi Mumbai, Maharashtra", category: "Automation", image: ABOUT },
];

function SectionHeading({ eyebrow, title, text, light = false, center = false }: { eyebrow: string; title: string; text?: string; light?: boolean; center?: boolean }) {
  return <div className={`${center ? "mx-auto max-w-3xl text-center" : "max-w-2xl"}`} data-gsap-reveal>
    <p className={`eyebrow ${center ? "justify-center" : ""}`}><span />{eyebrow}</p>
    <h2 className={`section-title mt-3 sm:mt-4 ${light ? "text-white" : "text-navy"}`}>{title}</h2>
    {text && <p className={`mt-3 sm:mt-5 text-sm sm:text-base leading-6 sm:leading-7 ${light ? "text-slate-300" : "text-slate-600"}`}>{text}</p>}
  </div>;
}

function PageHero({ eyebrow, title, text }: { eyebrow: string; title: string; text: string }) {
  return (
    <section className="relative overflow-hidden bg-navy pb-20 pt-36 text-white md:pb-24 md:pt-44">
      <div className="absolute inset-0 opacity-20" style={{ backgroundImage: `url(${FACTORY_IMAGE})`, backgroundSize: "cover", backgroundPosition: "center" }} />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_60%_at_50%_-10%,rgba(255,255,255,0.12),transparent_70%)]" />
      <div className="absolute inset-0 bg-gradient-to-r from-navy/95 via-navy/80 to-navy/45" />
      <div className="grid-pattern absolute inset-0 opacity-25" />
      <div className="site-container relative">
        <p className="flex items-center gap-2 text-xs font-bold uppercase tracking-[.22em] text-orange"><Link to="/">Home</Link><ChevronRight size={14} />{eyebrow}</p>
        <motion.h1 initial={{ y: 30, opacity: 0 }} animate={{ y: 0, opacity: 1 }} className="mt-4 max-w-4xl text-3xl font-extrabold leading-[1.12] tracking-tight text-white md:text-5xl lg:text-6xl font-display">{title}</motion.h1>
        <p className="mt-4 max-w-2xl text-base leading-7 text-slate-300 md:text-lg">{text}</p>
      </div>
    </section>
  );
}

function ProductCard({ product }: { product: any }) {
  const tilt = (event: React.MouseEvent<HTMLElement>) => {
    if (window.matchMedia("(hover: none)").matches) return;
    const card = event.currentTarget;
    const rect = card.getBoundingClientRect();
    const rotateX = ((event.clientY - rect.top) / rect.height - 0.5) * -9;
    const rotateY = ((event.clientX - rect.left) / rect.width - 0.5) * 9;
    card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-7px)`;
  };
  return <article onMouseMove={tilt} onMouseLeave={(e) => { e.currentTarget.style.transform = ""; }} className="product-card-3d group overflow-hidden border border-slate-200 bg-white shadow-[0_10px_30px_rgba(8,31,58,.06)] rounded-sm">
    <Link to={`/products/${product.slug}`} className="block overflow-hidden relative">
      <img src={product.image} alt={product.name} className="h-44 sm:h-52 md:h-56 w-full object-cover transition duration-700 group-hover:scale-105" />
      <span className="card-glare" />
    </Link>
    <div className="relative p-5 sm:p-6">
      <span className="absolute -top-5 right-5 grid size-10 sm:size-11 place-items-center bg-orange text-white shadow-lg"><Zap size={18} /></span>
      <p className="text-[10px] sm:text-[11px] font-bold uppercase tracking-[.18em] text-orange">{product.category}</p>
      <h3 className="mt-1.5 sm:mt-2 text-lg sm:text-xl font-bold text-navy font-display">{product.name}</h3>
      <p className="mt-2.5 sm:mt-3 min-h-10 sm:min-h-12 text-xs sm:text-sm leading-5 sm:leading-6 text-slate-600">{product.shortDescription}</p>
      <Link to={`/products/${product.slug}`} className="mt-4 sm:mt-5 inline-flex items-center gap-2 text-xs sm:text-sm font-bold text-navy transition group-hover:text-orange">View details <ArrowRight size={16} /></Link>
    </div>
  </article>;
}

function Product3DShowcase() {
  const [active, setActive] = useState(0);
  const featured = products.slice(0, 4);
  return <section className="showroom-section relative overflow-hidden bg-[#061629] py-14 sm:py-20 md:py-28 text-white">
    <div className="absolute inset-0 grid-pattern opacity-50" />
    <div className="absolute left-1/2 top-1/2 h-[560px] w-[560px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-orange/10 blur-[120px]" />
    <div className="site-container relative">
      <SectionHeading eyebrow="Interactive 3D showroom" title="Explore Engineering From Every Angle" text="Move your cursor across the panel. Scroll to rotate the assembly and inspect the industrial detailing in real time." light />
      <div className="mt-8 sm:mt-12 grid items-center gap-6 sm:gap-10 lg:grid-cols-[1.25fr_.75fr]">
        <div className="three-stage relative h-[320px] sm:h-[420px] md:h-[520px] lg:h-[620px] overflow-hidden border border-white/10 bg-white/[.025] rounded-xl">
          <div className="absolute left-3.5 top-3.5 sm:left-5 sm:top-5 z-10 flex items-center gap-2 text-[9px] sm:text-[10px] font-bold uppercase tracking-[.2em] text-slate-300"><span className="block size-2 animate-pulse rounded-full bg-green-400" />Live 3D model</div>
          <ThreePanelScene key={active} variant={active} className="absolute inset-0" />
          <div className="absolute bottom-3 left-3 sm:bottom-5 sm:left-5 z-10 border border-white/10 bg-navy/80 px-3.5 py-2 sm:px-4 sm:py-3 backdrop-blur-md rounded-lg">
            <p className="text-[9px] sm:text-[10px] uppercase tracking-[.18em] text-orange">Current system</p>
            <p className="mt-0.5 sm:mt-1 text-xs sm:text-sm font-bold text-white">{featured[active].name}</p>
          </div>
          <div className="pointer-events-none absolute inset-3 sm:inset-5 border border-white/5 rounded-lg" />
        </div>
        <div className="space-y-2.5 sm:space-y-3">
          {featured.map((product: any, i: number) => <button key={product.id} onClick={() => setActive(i)} className={`showroom-control group w-full border p-4 sm:p-5 text-left transition duration-300 rounded-lg ${active === i ? "border-orange bg-orange/10 shadow-lg shadow-orange/10" : "border-white/10 bg-white/[.025] hover:border-white/30"}`}>
            <span className="flex items-center justify-between"><span><span className="text-[9px] sm:text-[10px] font-bold uppercase tracking-[.18em] text-orange">0{i + 1} · {product.category}</span><strong className="mt-1 sm:mt-2 block text-base sm:text-lg text-white font-display">{product.name}</strong></span><ArrowRight className={`size-4 sm:size-5 transition shrink-0 ml-2 ${active === i ? "translate-x-1 text-orange" : "text-slate-600"}`} /></span>
            <span className="mt-2 sm:mt-3 block text-xs sm:text-sm leading-5 sm:leading-6 text-slate-400">{product.shortDescription}</span>
          </button>)}
          <Link to={`/products/${featured[active].slug}`} className="btn-primary mt-3 sm:mt-4 w-full sm:w-auto justify-center sm:justify-start">View system details <ArrowRight size={16} /></Link>
        </div>
      </div>
    </div>
  </section>;
}

function AnimatedNumber({ value, suffix }: { value: number; suffix: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true });
  const motionValue = useMotionValue(0);
  const spring = useSpring(motionValue, { damping: 35, stiffness: 70 });
  useEffect(() => { if (inView) motionValue.set(value); }, [inView, motionValue, value]);
  useEffect(() => spring.on("change", (v) => { if (ref.current) ref.current.textContent = `${Math.round(v)}${suffix}`; }), [spring, suffix]);
  return <span ref={ref}>0{suffix}</span>;
}

function HeroSection() {
  const containerRef = useRef<HTMLDivElement>(null);
  const heroAnimState = useRef({ open: 0, explode: 0, spin: 0 });

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const ctx = gsap.context(() => {
      gsap.to(heroAnimState.current, { open: 0.25, duration: 1.6, ease: "power3.inOut" });

      gsap.to("[data-hud]", {
        y: "+=10",
        duration: 2.4,
        ease: "sine.inOut",
        yoyo: true,
        repeat: -1,
        stagger: 0.35,
      });

      gsap.timeline({
        scrollTrigger: {
          trigger: el,
          start: "top top",
          end: "bottom top",
          scrub: 1.1,
        },
      })
        .to("[data-hero-content]", { yPercent: -18, opacity: 0.25, ease: "none" }, 0)
        .to(heroAnimState.current, { open: 1, explode: 0.55, spin: 0.85, ease: "none" }, 0)
        .to("[data-hero-bg]", { yPercent: 15, scale: 1.08, ease: "none" }, 0);
    }, el);

    return () => ctx.revert();
  }, []);

  const hudData = [
    { k: "Busbar", v: "6300A", pos: "left-[4%] top-[18%]" },
    { k: "Fault level", v: "65kA / 1s", pos: "right-[4%] top-[30%]" },
    { k: "Enclosure", v: "IP54 CRCA", pos: "left-[10%] bottom-[22%]" },
  ];

  return (
    <section ref={containerRef} className="relative min-h-[100svh] overflow-hidden bg-[#061628] pt-24 text-white md:pt-28">
      <div className="absolute inset-0 overflow-hidden">
        <img
          data-hero-bg="true"
          src={HERO}
          alt=""
          className="h-full w-full scale-105 object-cover opacity-45"
          fetchPriority="high"
        />
      </div>
      {/* Translucent directional fade for razor-sharp text readability */}
      <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(5,18,34,0.85)_0%,rgba(5,18,34,0.58)_48%,rgba(5,18,34,0.20)_100%)]" />
      {/* Subtle translucent whitish frosted glass mist sheen */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_90%_60%_at_50%_-10%,rgba(255,255,255,0.14),transparent_70%)]" />
      <div className="absolute inset-0 bg-gradient-to-b from-white/[0.08] via-transparent to-[#061628]" />
      <div className="grid-pattern absolute inset-0 opacity-25" />
      <div className="absolute right-[10%] top-1/3 size-[520px] rounded-full bg-orange/20 blur-[150px] pointer-events-none" />

      <div className="site-container relative grid min-h-[calc(100svh-7rem)] items-center gap-8 lg:grid-cols-[1fr_1.05fr] lg:gap-10">
        <div data-hero-content="true" className="relative z-10 pt-6 sm:pt-8 md:pt-10 lg:pt-8 xl:pt-12">
          <div data-hero-eyebrow="true" className="flex flex-wrap items-center gap-2.5 sm:gap-3">
            <p className="inline-flex items-center gap-2.5 sm:gap-3 text-[11px] sm:text-xs font-bold uppercase tracking-[.22em] sm:tracking-[.24em] text-orange">
              <span className="h-px w-8 sm:w-10 bg-orange" /> Industrial electrical solutions
            </p>
            <span className="inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-white/5 px-2.5 sm:px-3 py-1 text-[10px] sm:text-[11px] font-medium text-slate-300 backdrop-blur">
              <ShieldCheck size={13} className="text-orange" /> ISO 9001:2015
            </span>
          </div>

          <h1
            data-hero-title="true"
            className="mt-5 sm:mt-6 text-3xl font-extrabold leading-[1.12] tracking-[-.03em] text-white sm:text-5xl md:text-6xl lg:text-[66px] xl:text-[74px] font-display"
          >
            Powering Industries With <span className="text-orange">Reliable</span> Engineering
          </h1>

          <p
            data-hero-copy="true"
            className="mt-5 sm:mt-7 max-w-2xl border-l-2 border-orange pl-4 sm:pl-5 text-sm sm:text-base leading-7 sm:leading-8 text-slate-300 md:text-lg"
          >
            Advanced electrical panels, automation systems and power distribution solutions engineered for performance, safety and reliability.
          </p>

          <dl className="mt-8 sm:mt-10 lg:mt-12 grid max-w-lg grid-cols-3 gap-2.5 sm:gap-4 border-t border-white/10 pt-5 sm:pt-7">
            <div data-hero-stat="true">
              <dt className="sr-only">Years</dt>
              <dd className="font-display text-2xl sm:text-3xl md:text-4xl font-extrabold text-white">15+</dd>
              <p className="mt-1 text-[10px] sm:text-xs uppercase tracking-[.15em] sm:tracking-[.18em] text-slate-400">Years Exp.</p>
            </div>
            <div data-hero-stat="true">
              <dt className="sr-only">Projects</dt>
              <dd className="font-display text-2xl sm:text-3xl md:text-4xl font-extrabold text-white">500+</dd>
              <p className="mt-1 text-[10px] sm:text-xs uppercase tracking-[.15em] sm:tracking-[.18em] text-slate-400">Projects Done</p>
            </div>
            <div data-hero-stat="true">
              <dt className="sr-only">Clients</dt>
              <dd className="font-display text-2xl sm:text-3xl md:text-4xl font-extrabold text-white">250+</dd>
              <p className="mt-1 text-[10px] sm:text-xs uppercase tracking-[.15em] sm:tracking-[.18em] text-slate-400">Happy Clients</p>
            </div>
          </dl>
        </div>

        {/* 3D Stage with PCC Model */}
        <div data-hero-stage="true" className="relative h-[320px] sm:h-[440px] md:h-[520px] lg:h-[680px]">
          <div className="absolute inset-0" role="img" aria-label="3D model of a PCC power control centre panel">
            <InteractivePanel3D
              model={{ form: "floor", bays: 5, finish: "light", interior: "acb", meters: 3 }}
              code="PCC"
              stateRef={heroAnimState}
              className="absolute inset-0"
              autoRotate={false}
              interactive={false}
            />
          </div>

          {hudData.map((h) => (
            <div
              key={h.k}
              data-hud="true"
              className={`glass pointer-events-none absolute hidden rounded-2xl px-3.5 py-2.5 sm:block sm:px-4 sm:py-3 border border-white/12 bg-white/[0.06] backdrop-blur-md shadow-2xl ${h.pos}`}
            >
              <p className="text-[9px] sm:text-[10px] uppercase tracking-[.2em] text-mist">{h.k}</p>
              <p className="mt-0.5 sm:mt-1 font-display text-base sm:text-lg font-bold text-white">{h.v}</p>
            </div>
          ))}

          <p className="pointer-events-none absolute bottom-3 sm:bottom-4 left-1/2 -translate-x-1/2 whitespace-nowrap text-[10px] sm:text-[11px] uppercase tracking-[.2em] sm:tracking-[.25em] text-mist">
            Scroll to open the panel
          </p>
        </div>
      </div>
    </section>
  );
}

export function HomePage() {
  const stats = [[15, "+", "Years of Experience"], [500, "+", "Projects Completed"], [250, "+", "Happy Clients"], [24, "/7", "Technical Support"]];
  return <>
    <HeroSection />

    <section className="relative z-10 -mt-px bg-white shadow-sm">
      <div className="site-container grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 divide-y sm:divide-y-0 divide-x-0 sm:divide-x divide-slate-200 border-b border-slate-200">
        {stats.map(([value, suffix, label], idx) => (
          <div
            key={String(label)}
            className={`px-3 py-6 sm:px-4 sm:py-9 md:py-11 text-center ${idx % 2 === 1 ? "border-l border-slate-200 sm:border-l-0" : ""
              }`}
          >
            <strong className="block text-2xl sm:text-3xl md:text-4xl font-extrabold text-navy font-display">
              <AnimatedNumber value={Number(value)} suffix={String(suffix)} />
            </strong>
            <span className="mt-1.5 sm:mt-2 block text-[10px] sm:text-xs font-semibold uppercase tracking-wider text-slate-500">
              {label}
            </span>
          </div>
        ))}
      </div>
    </section>

    <Product3DShowcase />

    <section className="section-padding overflow-hidden">
      <div className="site-container grid items-center gap-10 lg:grid-cols-2 lg:gap-16 xl:gap-20">
        <div className="relative" data-gsap-reveal>
          <img
            src={ABOUT}
            alt="Engineering team inspecting industrial equipment"
            className="h-[320px] sm:h-[420px] lg:h-[490px] w-full object-cover rounded-md shadow-lg"
          />
          <div className="absolute -bottom-4 right-2 sm:-bottom-6 sm:-right-4 md:-right-6 bg-navy p-4 sm:p-6 md:p-7 text-white shadow-2xl rounded-sm">
            <p className="text-3xl sm:text-4xl font-extrabold text-orange font-display">15+</p>
            <p className="mt-1 text-[10px] sm:text-xs font-bold uppercase tracking-[.15em] leading-snug">
              Years of<br />engineering trust
            </p>
          </div>
          <div className="absolute -left-3 -top-3 sm:-left-4 sm:-top-4 -z-10 h-full w-full border-2 border-orange/30 rounded-md hidden sm:block" />
        </div>
        <div className="pt-2 lg:pt-0">
          <SectionHeading
            eyebrow="About our company"
            title="Engineering Reliable Power Solutions for Modern Industries"
          />
          <p className="mt-4 sm:mt-6 text-sm sm:text-base leading-6 sm:leading-7 text-slate-600">
            Sharma Electrical is an integrated electrical engineering company delivering robust panel systems, factory automation and turnkey distribution solutions to businesses across India. From concept to commissioning, our team combines practical field knowledge with disciplined engineering.
          </p>
          <div className="mt-6 sm:mt-7 grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
            {["Quality Engineering", "Advanced Technology", "Reliable Support"].map((x) => (
              <div key={x} className="flex items-center gap-2.5 text-xs sm:text-sm font-bold text-navy">
                <CheckCircle2 className="text-orange shrink-0" size={18} />
                <span>{x}</span>
              </div>
            ))}
          </div>
          <Link to="/about" className="btn-dark mt-7 sm:mt-9">
            Learn more <ArrowRight size={16} />
          </Link>
        </div>
      </div>
    </section>

    <section className="section-padding bg-steel">
      <div className="site-container">
        <div className="flex flex-col justify-between gap-4 sm:gap-6 md:flex-row md:items-end">
          <SectionHeading
            eyebrow="Engineered products"
            title="Reliable Hardware. Intelligent Control."
            text="Purpose-built solutions for power distribution, automation and industrial control."
          />
          <Link to="/products" className="text-link self-start md:self-auto">
            View all products <ArrowRight size={17} />
          </Link>
        </div>
        <div className="mt-8 sm:mt-12 grid gap-5 sm:gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {products.map((p: any) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      </div>
    </section>

    <section className="section-padding bg-navy text-white">
      <div className="site-container">
        <SectionHeading
          eyebrow="What we do"
          title="Complete Electrical Engineering, Under One Roof"
          text="From panel fabrication to turnkey project execution, we take ownership at every stage."
          light
          center
        />
        <div className="mt-8 sm:mt-12 grid gap-px bg-white/10 sm:grid-cols-2 lg:grid-cols-4 rounded-lg overflow-hidden border border-white/10">
          {services.map(({ icon: Icon, title, text }, i) => (
            <motion.div
              whileHover={{ backgroundColor: "rgba(239,107,37,.12)" }}
              key={title}
              className="group bg-navy p-6 sm:p-7 md:p-8 transition-colors duration-200"
            >
              <div className="flex items-start justify-between">
                <Icon className="text-orange" size={32} strokeWidth={1.6} />
                <span className="text-xs font-bold text-white/20">0{i + 1}</span>
              </div>
              <h3 className="mt-5 sm:mt-7 text-base sm:text-lg font-bold font-display">{title}</h3>
              <p className="mt-2.5 sm:mt-3 text-xs sm:text-sm leading-6 text-slate-400">{text}</p>
            </motion.div>
          ))}
        </div>
        <div className="mt-8 sm:mt-10 text-center">
          <Link to="/services" className="btn-primary">
            Explore all services <ArrowRight size={16} />
          </Link>
        </div>
      </div>
    </section>

    <WhySection />

    <section className="section-padding bg-steel">
      <div className="site-container">
        <div className="flex flex-col justify-between gap-4 sm:gap-6 md:flex-row md:items-end">
          <SectionHeading
            eyebrow="Selected work"
            title="Engineering That Performs in the Real World"
          />
          <Link to="/projects" className="text-link self-start md:self-auto">
            View all projects <ArrowRight size={17} />
          </Link>
        </div>
        <div className="mt-8 sm:mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {projects.slice(0, 3).map((p) => (
            <ProjectCard key={p.name} project={p} />
          ))}
        </div>
      </div>
    </section>

    <CTA />
  </>;
}

function WhySection() {
  const why = [
    ["Quality First", ShieldCheck],
    ["Experienced Engineers", HardHat],
    ["Customized Solutions", SlidersHorizontal],
    ["On-Time Delivery", Clock3],
    ["After-Sales Support", Headphones],
    ["Safety & Compliance", Award],
  ];
  return (
    <section className="section-padding overflow-hidden bg-white">
      <div className="site-container grid gap-8 sm:gap-10 lg:grid-cols-[.75fr_1.25fr] lg:gap-14">
        <div>
          <SectionHeading
            eyebrow="The Sharma Electrical advantage"
            title="Why Industries Choose Us"
            text="Our clients rely on us for disciplined execution, transparent communication and equipment that performs long after commissioning."
          />
          <div className="mt-6 sm:mt-8 border-l-2 border-orange pl-4 sm:pl-5 text-xs sm:text-sm font-semibold leading-6 text-navy">
            Designed to applicable IS/IEC standards<br />Tested before every dispatch
          </div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 border-t sm:border-t-0 border-slate-200">
          {why.map(([label, Icon], i) => (
            <div
              key={label as string}
              data-gsap-reveal
              className="group border-b border-slate-200 p-5 sm:p-6 md:p-8 sm:border-l transition-colors hover:bg-slate-50/60"
            >
              <div className="flex items-center justify-between">
                <span className="text-3xl sm:text-4xl font-extrabold text-slate-200 transition group-hover:text-orange font-display">
                  0{i + 1}
                </span>
                <Icon className="text-orange" size={26} strokeWidth={1.7} />
              </div>
              <h3 className="mt-4 sm:mt-6 text-base sm:text-lg font-bold text-navy font-display">{label as string}</h3>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function ProjectCard({ project }: { project: any }) {
  return (
    <motion.article whileHover="hover" className="group relative h-[340px] sm:h-[380px] md:h-[420px] overflow-hidden bg-navy rounded-sm shadow-md">
      <motion.img
        variants={{ hover: { scale: 1.07 } }}
        transition={{ duration: .6 }}
        src={project.image}
        alt={project.name}
        className="h-full w-full object-cover opacity-80"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-navy via-navy/20 to-transparent" />
      <div className="absolute inset-x-0 bottom-0 p-5 sm:p-7 text-white">
        <p className="text-[10px] sm:text-xs font-bold uppercase tracking-[.18em] text-orange">{project.category}</p>
        <h3 className="mt-1.5 sm:mt-2 text-lg sm:text-xl font-bold font-display">{project.name}</h3>
        <p className="mt-1.5 sm:mt-2 flex items-center gap-2 text-xs sm:text-sm text-slate-300">
          <MapPin size={15} />{project.location}
        </p>
      </div>
    </motion.article>
  );
}

function CTA() {
  return (
    <section className="relative overflow-hidden bg-orange py-12 sm:py-16 text-white">
      <div className="absolute inset-0 grid-pattern opacity-20" />
      <div className="site-container relative flex flex-col items-start justify-between gap-6 sm:gap-8 lg:flex-row lg:items-center">
        <div>
          <p className="text-[10px] sm:text-xs font-bold uppercase tracking-[.2em]">Start your next project</p>
          <h2 className="mt-2 sm:mt-3 text-2xl sm:text-3xl font-extrabold md:text-4xl font-display">
            Need a reliable electrical engineering partner?
          </h2>
        </div>
        <Link
          to="/contact"
          className="inline-flex items-center gap-3 bg-white px-6 sm:px-7 py-3.5 sm:py-4 text-xs sm:text-sm font-bold uppercase tracking-wider text-navy transition duration-200 hover:bg-navy hover:text-white shrink-0 shadow-lg"
        >
          Talk to our engineers <ArrowRight size={18} />
        </Link>
      </div>
    </section>
  );
}

export function AboutPage() {
  return <><PageHero eyebrow="About" title="Built on Engineering. Driven by Reliability." text="An experienced Indian electrical engineering company helping industries power operations with confidence." />
    <section className="section-padding"><div className="site-container grid items-center gap-14 lg:grid-cols-2">
      <div><SectionHeading eyebrow="Our story" title="Powering Progress Since 2011" /><p className="mt-6 leading-7 text-slate-600">Sharma Electrical began with a clear purpose: to make industrial electrical systems safer, more efficient and easier to maintain. Today, our multidisciplinary team supports projects across manufacturing, infrastructure, pharmaceuticals, water and commercial facilities.</p><p className="mt-4 leading-7 text-slate-600">Our Vadodara facility brings design, fabrication, assembly and testing together under one roof—giving every customer consistent quality and a single accountable partner.</p>
        <div className="mt-8 grid grid-cols-2 gap-4"><div className="bg-steel p-6"><strong className="text-3xl text-navy">35+</strong><p className="mt-1 text-sm text-slate-500">Skilled professionals</p></div><div className="bg-steel p-6"><strong className="text-3xl text-navy">12</strong><p className="mt-1 text-sm text-slate-500">States served</p></div></div></div>
      <div className="relative"><img src={FACTORY_IMAGE} alt="Sharma Electrical manufacturing facility" className="h-[520px] w-full object-cover" /><div className="absolute bottom-0 left-0 max-w-xs bg-orange p-7 text-white"><p className="font-bold leading-6">“We engineer every panel as if our own operation depends on it.”</p></div></div>
    </div></section>
    <section className="section-padding bg-navy text-white"><div className="site-container"><SectionHeading eyebrow="What guides us" title="Principles Behind Every Project" light center /><div className="mt-12 grid gap-px bg-white/10 md:grid-cols-3">{[
      ["Our Mission", "Deliver safe, efficient and scalable electrical systems that enable industries to operate at their best.", Bolt],
      ["Our Vision", "Become India's most trusted engineering partner for intelligent power and industrial automation.", Gauge],
      ["Our Promise", "Uncompromised workmanship, honest advice and responsive support through the asset lifecycle.", ShieldCheck],
    ].map(([t, d, I]: any) => <div key={t} className="bg-navy p-9 text-center"><I className="mx-auto text-orange" size={40} /><h3 className="mt-6 text-xl font-bold">{t}</h3><p className="mt-4 text-sm leading-7 text-slate-400">{d}</p></div>)}</div></div></section><WhySection /><CTA /></>;
}

export function ProductsPage() {
  const [category, setCategory] = useState("All");
  const [query, setQuery] = useState("");
  const categories = ["All", "Power Panels", "Automation", "Distribution", "Control Systems"];
  const filtered = products.filter((p: any) => (category === "All" || p.category === category) && `${p.name} ${p.shortDescription}`.toLowerCase().includes(query.toLowerCase()));
  return <><PageHero eyebrow="Products" title="Electrical & Automation Products" text="Engineered panel systems built around your load, process and operating environment." />
    <section className="section-padding bg-steel"><div className="site-container">
      <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex flex-wrap gap-2">{categories.map((c) => <button key={c} onClick={() => setCategory(c)} className={`px-4 py-3 text-xs font-bold uppercase tracking-wider transition ${category === c ? "bg-orange text-white" : "border border-slate-200 bg-white text-navy hover:border-orange"}`}>{c}</button>)}</div>
        <label className="flex h-12 min-w-72 items-center gap-3 border border-slate-200 bg-white px-4"><Search size={18} className="text-slate-400" /><input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search products..." className="w-full bg-transparent text-sm outline-none" /></label>
      </div>
      <p className="mt-8 text-sm text-slate-500">Showing {filtered.length} engineered solutions</p>
      <div className="mt-6 grid gap-6 sm:grid-cols-2 xl:grid-cols-4">{filtered.map((p: any) => <ProductCard key={p.id} product={p} />)}</div>
      {!filtered.length && <div className="mt-8 bg-white p-12 text-center text-slate-500">No products match your search.</div>}
    </div></section><CTA /></>;
}

export function ProductDetailPage() {
  const { slug } = useParams();
  const product: any = products.find((p: any) => p.slug === slug);
  if (!product) return <NotFoundPage />;
  return <><PageHero eyebrow="Product" title={product.name} text={product.shortDescription} />
    <section className="section-padding"><div className="site-container">
      <div className="grid items-center gap-12 lg:grid-cols-2"><div className="relative h-[520px] overflow-hidden bg-navy"><ThreePanelScene variant={product.id} compact className="absolute inset-0" /><span className="absolute left-0 top-0 z-10 bg-orange px-5 py-3 text-xs font-bold uppercase tracking-wider text-white">{product.category}</span><span className="absolute bottom-5 right-5 z-10 border border-white/10 bg-navy/70 px-4 py-2 text-[10px] font-bold uppercase tracking-[.16em] text-white backdrop-blur">Move cursor · Scroll to rotate</span></div>
        <div><p className="eyebrow"><span />Engineered solution</p><h2 className="mt-4 text-4xl font-extrabold text-navy md:text-5xl">{product.name}</h2><p className="mt-6 text-lg leading-8 text-slate-600">{product.description}</p><div className="mt-7 grid gap-3 sm:grid-cols-2">{product.features.slice(0, 4).map((x: string) => <p key={x} className="flex items-center gap-3 text-sm font-semibold text-navy"><CheckCircle2 size={19} className="text-orange" />{x}</p>)}</div><Link to="/contact" className="btn-primary mt-9">Request a quote <ArrowRight size={16} /></Link></div>
      </div>
      <div className="mt-20 grid gap-10 lg:grid-cols-[1fr_1fr]">
        <div><h3 className="detail-title">Overview & Features</h3><p className="mt-5 leading-7 text-slate-600">{product.description}</p><ul className="mt-6 space-y-3">{product.features.map((x: string) => <li key={x} className="flex gap-3 text-sm text-slate-700"><Check size={18} className="mt-0.5 text-orange" />{x}</li>)}</ul><h3 className="detail-title mt-10">Applications</h3><div className="mt-5 flex flex-wrap gap-2">{product.applications.map((x: string) => <span key={x} className="bg-steel px-4 py-3 text-sm font-semibold text-navy">{x}</span>)}</div></div>
        <div><h3 className="detail-title">Technical Specifications</h3><div className="mt-5 border border-slate-200">{Object.entries(product.specifications).map(([k, v], i) => <div key={k} className={`grid grid-cols-2 p-4 text-sm ${i % 2 ? "bg-steel" : "bg-white"}`}><strong className="text-navy">{k}</strong><span className="text-slate-600">{String(v)}</span></div>)}</div><p className="mt-4 text-xs text-slate-400">Specifications are indicative and can be customized for project requirements.</p></div>
      </div>
    </div></section>
    <section className="bg-navy py-16 text-white"><div className="site-container flex flex-col items-start justify-between gap-7 md:flex-row md:items-center"><div><p className="text-sm font-bold uppercase tracking-[.18em] text-orange">Project inquiry</p><h2 className="mt-2 text-3xl font-extrabold">Need this product for your project?</h2></div><Link to="/contact" className="btn-primary">Get a quote <ArrowRight size={16} /></Link></div></section></>;
}

export function ServicesPage() {
  return <><PageHero eyebrow="Services" title="End-to-End Electrical Engineering Services" text="Practical engineering expertise—from initial study to installation, commissioning and lifecycle support." />
    <section className="section-padding"><div className="site-container"><SectionHeading eyebrow="Our capabilities" title="One Partner. Every Stage." text="Flexible engagement models for standalone equipment, automation upgrades and complete turnkey projects." />
      <div className="mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-4">{services.map(({ icon: Icon, title, text }, i) => <motion.article whileHover={{ y: -7 }} key={title} className="border border-slate-200 p-7 shadow-[0_10px_40px_rgba(8,31,58,.05)]"><div className="flex justify-between"><span className="grid size-14 place-items-center bg-orange/10 text-orange"><Icon size={27} /></span><span className="text-xs font-bold text-slate-300">0{i + 1}</span></div><h3 className="mt-6 text-lg font-bold text-navy">{title}</h3><p className="mt-3 text-sm leading-6 text-slate-600">{text}</p><Link to="/contact" className="mt-5 inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-orange">Discuss project <ArrowRight size={14} /></Link></motion.article>)}</div>
    </div></section>
    <section className="section-padding bg-steel"><div className="site-container"><SectionHeading eyebrow="How we work" title="Structured for Predictable Delivery" center /><div className="mt-12 grid gap-6 md:grid-cols-4">{["Requirement Study", "Engineering & Approval", "Manufacturing & Testing", "Installation & Support"].map((x, i) => <div key={x} className="relative bg-white p-7"><span className="text-5xl font-extrabold text-slate-100">0{i + 1}</span><h3 className="mt-5 font-bold text-navy">{x}</h3>{i < 3 && <ArrowRight className="absolute -right-4 top-1/2 z-10 hidden text-orange md:block" />}</div>)}</div></div></section><CTA /></>;
}

export function ProjectsPage() {
  const [filter, setFilter] = useState("All");
  const cats = ["All", "Industrial", "Commercial", "Infrastructure", "Automation"];
  const visible = filter === "All" ? projects : projects.filter((p) => p.category === filter);
  return <><PageHero eyebrow="Projects" title="Projects Engineered for Performance" text="Selected power distribution, panel manufacturing and automation work delivered across India." />
    <section className="section-padding bg-steel"><div className="site-container"><div className="flex flex-wrap justify-center gap-2">{cats.map((c) => <button key={c} onClick={() => setFilter(c)} className={`px-5 py-3 text-xs font-bold uppercase tracking-wider ${filter === c ? "bg-orange text-white" : "bg-white text-navy"}`}>{c}</button>)}</div><motion.div layout className="mt-10 grid gap-6 md:grid-cols-2 lg:grid-cols-3">{visible.map((p) => <ProjectCard key={p.name} project={p} />)}</motion.div></div></section><CTA /></>;
}

export function ClientsPage() {
  const clientNames = ["ARVIND AUTO", "ZENITH PHARMA", "NEXA STEEL", "SURYODAY CEMENT", "VARDHAN INFRA", "ORBIT WATER", "TITAN PROCESS", "ASCENT FOODS", "WESTERN RAIL", "PRIME POLYMERS", "INDUS ENGINEERING", "BLUEPEAK ENERGY"];
  return <><PageHero eyebrow="Clients" title="Trusted Across Critical Industries" text="Long-term engineering relationships built on reliable products, accountable delivery and responsive support." />
    <section className="section-padding"><div className="site-container"><SectionHeading eyebrow="Partners in progress" title="Powering Ambitious Indian Businesses" center /><div className="mt-12 grid grid-cols-2 border-l border-t border-slate-200 md:grid-cols-3 lg:grid-cols-4">{clientNames.map((name, i) => <motion.div whileHover={{ backgroundColor: "#f5f7fa" }} key={name} className="grid h-36 place-items-center border-b border-r border-slate-200 p-5 text-center"><div><Building2 className="mx-auto text-slate-300" size={28} /><p className="mt-3 text-sm font-extrabold tracking-wider text-navy">{name}</p><span className="text-[9px] uppercase tracking-[.2em] text-slate-400">{["Manufacturing", "Infrastructure", "Process Industry"][i % 3]}</span></div></motion.div>)}</div></div></section>
    <section className="section-padding bg-navy text-white"><div className="site-container grid gap-10 lg:grid-cols-3">{[["98%", "On-time project delivery"], ["72%", "Business from repeat clients"], ["12", "Industrial sectors served"]].map(([v, l]) => <div key={l} className="border-l-2 border-orange pl-7"><strong className="text-5xl font-extrabold">{v}</strong><p className="mt-3 text-sm uppercase tracking-wider text-slate-400">{l}</p></div>)}</div></section><CTA /></>;
}

export function ContactPage() {
  const [sent, setSent] = useState(false);
  return <><PageHero eyebrow="Contact" title="Let's Engineer Your Next Solution" text="Share your requirement with our engineering team. We typically respond within one business day." />
    <section className="section-padding"><div className="site-container grid gap-12 lg:grid-cols-[.75fr_1.25fr]">
      <div><SectionHeading eyebrow="Get in touch" title="Talk to an Engineer" /><p className="mt-6 leading-7 text-slate-600">Whether you need a single custom panel or a complete turnkey electrical system, our team can help define the right technical approach.</p>
        <div className="mt-9 space-y-5">{[
          [MapPin, "Visit our facility", "Plot 42, GIDC Industrial Estate, Vadodara, Gujarat 390010"],
          [Phone, "Call us", "+91 98765 43210"],
          [Mail, "Email projects", "projects@sharmaelectrical.in"],
          [Clock3, "Working hours", "Monday–Saturday, 9:00 AM–6:00 PM"],
        ].map(([I, t, d]: any) => <div key={t} className="flex gap-4"><span className="grid size-12 shrink-0 place-items-center bg-orange/10 text-orange"><I size={21} /></span><div><h3 className="font-bold text-navy">{t}</h3><p className="mt-1 text-sm leading-6 text-slate-500">{d}</p></div></div>)}</div>
      </div>
      <div className="bg-steel p-6 md:p-10"><h2 className="text-2xl font-extrabold text-navy">Request a Quote</h2><p className="mt-2 text-sm text-slate-500">Tell us a little about your application.</p>
        {sent ? <div className="mt-8 bg-white p-10 text-center"><CheckCircle2 className="mx-auto text-orange" size={44} /><h3 className="mt-4 text-xl font-bold text-navy">Thank you for your inquiry.</h3><p className="mt-2 text-sm text-slate-500">Our project team will contact you shortly.</p></div> :
          <form onSubmit={(e) => { e.preventDefault(); setSent(true); }} className="mt-7 grid gap-5 sm:grid-cols-2">
            <Field label="Full name" placeholder="Your name" /><Field label="Company" placeholder="Company name" /><Field label="Phone" placeholder="+91" type="tel" /><Field label="Email" placeholder="name@company.com" type="email" />
            <label className="sm:col-span-2"><span className="form-label">Interested in</span><select className="form-input"><option>Electrical panel manufacturing</option><option>Industrial automation</option><option>Turnkey electrical project</option><option>Maintenance & support</option></select></label>
            <label className="sm:col-span-2"><span className="form-label">Project requirement</span><textarea className="form-input min-h-32 resize-y" placeholder="Tell us about ratings, quantity, location or timeline..." required /></label>
            <button className="btn-primary w-fit sm:col-span-2" type="submit">Submit inquiry <ArrowRight size={16} /></button>
          </form>}</div>
    </div></section></>;
}

function Field({ label, placeholder, type = "text" }: { label: string; placeholder: string; type?: string }) {
  return <label><span className="form-label">{label}</span><input className="form-input" type={type} placeholder={placeholder} required /></label>;
}

export function NotFoundPage() {
  return <section className="grid min-h-[75vh] place-items-center bg-steel px-4 pt-24 text-center"><div><p className="text-8xl font-extrabold text-orange">404</p><h1 className="mt-4 text-3xl font-extrabold text-navy">Page not found</h1><p className="mt-3 text-slate-500">The page you are looking for may have moved.</p><Link to="/" className="btn-dark mt-7">Back to home <ArrowRight size={16} /></Link></div></section>;
}
