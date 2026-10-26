import { useRef } from "react";
import { Link } from "react-router";

const phrases = [
  "Book My Free Consultation",
  "Book My Free Consultation",
  "Book My Free Consultation",
  "Book My Free Consultation",
  "Book My Free Consult",
  "Get In Touch",
  "Book My Free Consultation",
  "Book My Free Consultation",
  "Book My Free Consultation",
  "Get In Touch",
  "Book My Free Consultation",
  "Book My Free Consult",
];

export default function InteractiveTickerButton() {
  const linkRef = useRef<HTMLAnchorElement>(null);

  const handleMouseMove = (e: React.MouseEvent<HTMLAnchorElement>) => {
    if (!linkRef.current) return;
    const rect = linkRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    linkRef.current.style.setProperty("--mx", `${x}px`);
    linkRef.current.style.setProperty("--my", `${y}px`);
  };

  const handleMouseEnter = (e: React.MouseEvent<HTMLAnchorElement>) => {
    if (!linkRef.current) return;
    const rect = linkRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    linkRef.current.style.setProperty("--mx", `${x}px`);
    linkRef.current.style.setProperty("--my", `${y}px`);
  };

  return (
    <div
      className="elementor-element elementor-element-2728519 headerButton elementor-hidden-tablet elementor-hidden-mobile elementor-widget elementor-widget-html"
      data-id="2728519"
      data-element_type="widget"
      data-e-type="widget"
      data-widget_type="html.default"
    >
      <div className="elementor-widget-container">
        <Link
          ref={linkRef}
          to="/contact"
          target="_self"
          rel="nofollow"
          className="tp-btn-animation group"
          id="bookaDemo"
          onMouseEnter={handleMouseEnter}
          onMouseMove={handleMouseMove}
        >
          {/* Base Layer: Cyan text scrolling continuously */}
          <div className="tp-marquee-track tp-marquee-cyan">
            {phrases.map((phrase, i) => (
              <span key={i} className="tp-marquee-item">
                {phrase}
              </span>
            ))}
          </div>

          {/* Masked Lens Layer: White circle follows cursor, revealing RED text scrolling */}
          <div className="tp-mask-lens pointer-events-none absolute inset-0 z-10 overflow-hidden">
            {/* Solid White Circle Background */}
            <div className="absolute inset-0 bg-white" />

            {/* Red Text Track scrolling in exact microsecond synchronization */}
            <div className="tp-marquee-track tp-marquee-red relative z-10">
              {phrases.map((phrase, i) => (
                <span key={i} className="tp-marquee-item">
                  {phrase}
                </span>
              ))}
            </div>
          </div>
        </Link>
      </div>
    </div>
  );
}
