import { useEffect, useRef } from "react";
import * as THREE from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";
import { RoomEnvironment } from "three/addons/environments/RoomEnvironment.js";

// ============================================================================
// Canvas texture generators (High-DPI, 0 network bytes, instant load)
// ============================================================================
function createCanvasTexture(
  width: number,
  height: number,
  drawFn: (ctx: CanvasRenderingContext2D, w: number, h: number) => void
) {
  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext("2d")!;
  drawFn(ctx, width, height);
  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.anisotropy = 8;
  return texture;
}

// 1. Digital Multi-Function Meter (MFM) - Modern Schneider / Selec / L&T Style
function createDigitalMfmTexture(channel = "INCOMER 1", voltage = "415.2", current = "1248") {
  return createCanvasTexture(384, 384, (ctx, w, h) => {
    // Bezel outer casing
    ctx.fillStyle = "#12151a";
    ctx.fillRect(0, 0, w, h);

    // Bezel inner chamfer
    ctx.strokeStyle = "#2b323d";
    ctx.lineWidth = 6;
    ctx.strokeRect(6, 6, w - 12, h - 12);

    // Dark screen surround
    ctx.fillStyle = "#090d12";
    ctx.fillRect(20, 20, w - 40, h - 110);

    // LCD / VFD Backlit Screen
    const screenGrad = ctx.createLinearGradient(0, 28, 0, 28 + h - 126);
    screenGrad.addColorStop(0, "#081d26");
    screenGrad.addColorStop(1, "#031016");
    ctx.fillStyle = screenGrad;
    ctx.fillRect(28, 28, w - 56, h - 126);

    // Screen fine grid pattern
    ctx.strokeStyle = "rgba(40, 160, 200, 0.04)";
    ctx.lineWidth = 1;
    for (let x = 32; x < w - 32; x += 12) {
      ctx.beginPath();
      ctx.moveTo(x, 28);
      ctx.lineTo(x, h - 98);
      ctx.stroke();
    }

    // Header strip on LCD
    ctx.fillStyle = "#38bdf8";
    ctx.font = "bold 13px 'Segoe UI', system-ui, sans-serif";
    ctx.fillText("SHARMA MFM-96", 36, 48);

    ctx.fillStyle = "#22c55e";
    ctx.font = "bold 11px monospace";
    ctx.textAlign = "right";
    ctx.fillText("● RMS NORMAL", w - 36, 48);
    ctx.textAlign = "left";

    // Subheader channel
    ctx.fillStyle = "#94a3b8";
    ctx.font = "11px monospace";
    ctx.fillText(channel, 36, 68);

    // Row 1: Voltage V_LL
    ctx.fillStyle = "#f59e0b";
    ctx.font = "bold 11px monospace";
    ctx.fillText("V LL (AVG)", 36, 96);

    ctx.fillStyle = "#38bdf8";
    ctx.font = "bold 32px 'Courier New', monospace";
    ctx.fillText(voltage, 36, 130);

    ctx.fillStyle = "#7dd3fc";
    ctx.font = "bold 14px monospace";
    ctx.fillText("V", 180, 130);

    // Row 2: Current I_AVG
    ctx.fillStyle = "#f59e0b";
    ctx.font = "bold 11px monospace";
    ctx.fillText("I AVG", 36, 164);

    ctx.fillStyle = "#34d399";
    ctx.font = "bold 32px 'Courier New', monospace";
    ctx.fillText(current, 36, 198);

    ctx.fillStyle = "#6ee7b7";
    ctx.font = "bold 14px monospace";
    ctx.fillText("A", 180, 198);

    // Row 3: Frequency & Power Factor
    ctx.fillStyle = "#94a3b8";
    ctx.font = "bold 10px monospace";
    ctx.fillText("FREQ", 36, 226);
    ctx.fillStyle = "#e2e8f0";
    ctx.font = "bold 17px monospace";
    ctx.fillText("50.02 Hz", 36, 246);

    ctx.fillStyle = "#94a3b8";
    ctx.font = "bold 10px monospace";
    ctx.fillText("PF (TRUE)", 140, 226);
    ctx.fillStyle = "#e2e8f0";
    ctx.font = "bold 17px monospace";
    ctx.fillText("0.994 Lag", 140, 246);

    // Active power on right column
    ctx.fillStyle = "#ef4444";
    ctx.font = "bold 10px monospace";
    ctx.fillText("KW TOTAL", 250, 96);
    ctx.fillStyle = "#fca5a5";
    ctx.font = "bold 24px 'Courier New', monospace";
    ctx.fillText("864.5", 250, 126);

    // Phase mini indicators (R, Y, B status)
    const phases = [
      { name: "R", col: "#ef4444", val: "239.8V" },
      { name: "Y", col: "#eab308", val: "240.2V" },
      { name: "B", col: "#3b82f6", val: "239.5V" },
    ];
    phases.forEach((p, idx) => {
      ctx.fillStyle = p.col;
      ctx.fillRect(250, 150 + idx * 28, 12, 12);
      ctx.fillStyle = "#f8fafc";
      ctx.font = "bold 10px monospace";
      ctx.fillText(`${p.name}: ${p.val}`, 268, 160 + idx * 28);
    });

    // Bottom keypad area
    ctx.fillStyle = "#1e242d";
    ctx.fillRect(20, h - 80, w - 40, 60);

    const buttons = ["V / A", "W / PF", "E / MD", "PROG"];
    buttons.forEach((btn, idx) => {
      const bx = 32 + idx * 82;
      const by = h - 68;
      ctx.fillStyle = "#0e1116";
      ctx.fillRect(bx, by, 72, 36);
      ctx.strokeStyle = "#475569";
      ctx.lineWidth = 1.5;
      ctx.strokeRect(bx, by, 72, 36);

      ctx.fillStyle = "#cbd5e1";
      ctx.font = "bold 11px system-ui, sans-serif";
      ctx.textAlign = "center";
      ctx.fillText(btn, bx + 36, by + 22);
    });
    ctx.textAlign = "left";
  });
}

// 2. High-Tech SCADA / HMI Touchscreen Display (Siemens SIMATIC / Schneider Magelis)
function createScadaHmiTexture() {
  return createCanvasTexture(640, 420, (ctx, w, h) => {
    // Industrial Bezel & Screen
    const grad = ctx.createLinearGradient(0, 0, 0, h);
    grad.addColorStop(0, "#081320");
    grad.addColorStop(1, "#040911");
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, w, h);

    // Top Header Banner
    ctx.fillStyle = "#ef6b25";
    ctx.fillRect(0, 0, w, 44);

    ctx.fillStyle = "#ffffff";
    ctx.font = "bold 16px 'Segoe UI', system-ui, sans-serif";
    ctx.fillText("SHARMA SCADA PRO · PCC MONITORING SYSTEM", 20, 28);

    ctx.font = "bold 13px monospace";
    ctx.textAlign = "right";
    ctx.fillText("AUTO-SYNCHRONIZED ● 415V / 50Hz", w - 20, 28);
    ctx.textAlign = "left";

    // Status Ribbon
    ctx.fillStyle = "#0c2339";
    ctx.fillRect(20, 56, w - 40, 40);
    ctx.strokeStyle = "#1d4ed8";
    ctx.lineWidth = 1.5;
    ctx.strokeRect(20, 56, w - 40, 40);

    ctx.fillStyle = "#38bdf8";
    ctx.font = "bold 12px system-ui";
    ctx.fillText("INCOMER 1: 3200A ACB [CLOSED]", 36, 80);
    ctx.fillStyle = "#22c55e";
    ctx.fillText("BUS COUPLER: [CLOSED]", 260, 80);
    ctx.fillStyle = "#eab308";
    ctx.fillText("DG INCOMER 2: [STANDBY]", 440, 80);

    // Left Panel: Real-time Bar Graphs (Load Distribution)
    ctx.fillStyle = "rgba(15, 23, 42, 0.7)";
    ctx.fillRect(20, 110, 280, 180);
    ctx.strokeStyle = "#1e293b";
    ctx.strokeRect(20, 110, 280, 180);

    ctx.fillStyle = "#94a3b8";
    ctx.font = "bold 11px system-ui";
    ctx.fillText("FEEDER LOAD PROFILE (% CURRENT)", 32, 130);

    const loads = [
      { name: "F1 MLDB", pct: 0.74, col: "#22c55e" },
      { name: "F2 MCC-A", pct: 0.88, col: "#ef6b25" },
      { name: "F3 MCC-B", pct: 0.62, col: "#38bdf8" },
      { name: "F4 APFC", pct: 0.94, col: "#a855f7" },
      { name: "F5 HVAC", pct: 0.48, col: "#10b981" },
    ];
    loads.forEach((item, idx) => {
      const by = 150 + idx * 26;
      ctx.fillStyle = "#64748b";
      ctx.font = "10px monospace";
      ctx.fillText(item.name, 32, by + 12);

      // Track
      ctx.fillStyle = "#1e293b";
      ctx.fillRect(100, by, 140, 14);
      // Fill
      ctx.fillStyle = item.col;
      ctx.fillRect(100, by, 140 * item.pct, 14);

      ctx.fillStyle = "#f8fafc";
      ctx.font = "bold 10px monospace";
      ctx.fillText(`${Math.round(item.pct * 100)}%`, 248, by + 12);
    });

    // Right Panel: 3-Phase Voltage Sine Wave Simulation
    ctx.fillStyle = "rgba(15, 23, 42, 0.7)";
    ctx.fillRect(320, 110, 300, 180);
    ctx.strokeStyle = "#1e293b";
    ctx.strokeRect(320, 110, 300, 180);

    ctx.fillStyle = "#94a3b8";
    ctx.font = "bold 11px system-ui";
    ctx.fillText("THREE-PHASE VOLTAGE HARMONIC OSCILLOSCOPE", 332, 130);

    // Center zero line
    ctx.strokeStyle = "rgba(148, 163, 184, 0.2)";
    ctx.setLineDash([4, 4]);
    ctx.beginPath();
    ctx.moveTo(330, 205);
    ctx.lineTo(610, 205);
    ctx.stroke();
    ctx.setLineDash([]);

    // Sine waves R, Y, B
    const waveColors = ["#ef4444", "#eab308", "#3b82f6"];
    waveColors.forEach((color, pIdx) => {
      ctx.strokeStyle = color;
      ctx.lineWidth = 2.2;
      ctx.beginPath();
      const phaseOffset = (pIdx * 2 * Math.PI) / 3;
      for (let x = 0; x <= 270; x += 4) {
        const rad = (x / 270) * Math.PI * 4 + phaseOffset;
        const y = 205 - Math.sin(rad) * 44;
        if (x === 0) ctx.moveTo(330 + x, y);
        else ctx.lineTo(330 + x, y);
      }
      ctx.stroke();
    });

    // Bottom Metric Tiles
    const metrics = [
      { label: "GRID VOLTAGE", val: "415.2 V", col: "#38bdf8" },
      { label: "TOTAL CURRENT", val: "1,842 A", col: "#22c55e" },
      { label: "ACTIVE POWER", val: "1,260 kW", col: "#ef6b25" },
      { label: "FREQUENCY", val: "50.00 Hz", col: "#eab308" },
    ];
    metrics.forEach((m, idx) => {
      const mx = 20 + idx * 153;
      ctx.fillStyle = "#0c1523";
      ctx.fillRect(mx, 306, 142, 72);
      ctx.strokeStyle = "#1e293b";
      ctx.strokeRect(mx, 306, 142, 72);

      ctx.fillStyle = "#94a3b8";
      ctx.font = "9px system-ui";
      ctx.fillText(m.label, mx + 12, 324);

      ctx.fillStyle = m.col;
      ctx.font = "bold 18px monospace";
      ctx.fillText(m.val, mx + 12, 354);
    });

    // Touch bar bottom
    ctx.fillStyle = "#020617";
    ctx.fillRect(0, 392, w, 28);
    ctx.fillStyle = "#475569";
    ctx.font = "10px monospace";
    ctx.fillText("SYSTEM STATUS: NORMAL  |  PLC: SIEMENS S7-1500  |  COMM: MODBUS-TCP READY", 20, 410);
  });
}

// 3. Indian & International Standard Bilingual Caution / Danger Plate
function createDangerPlateTexture() {
  return createCanvasTexture(384, 192, (ctx, w, h) => {
    // White/Signal Yellow warning plate with black bevel border
    ctx.fillStyle = "#ffcc00";
    ctx.fillRect(0, 0, w, h);

    ctx.strokeStyle = "#111111";
    ctx.lineWidth = 8;
    ctx.strokeRect(6, 6, w - 12, h - 12);

    ctx.strokeStyle = "#ffffff";
    ctx.lineWidth = 2;
    ctx.strokeRect(12, 12, w - 24, h - 24);

    // Hazard triangle with lightning flash
    ctx.fillStyle = "#d32f2f";
    ctx.beginPath();
    ctx.moveTo(56, 30);
    ctx.lineTo(96, 110);
    ctx.lineTo(16, 110);
    ctx.closePath();
    ctx.fill();

    // Lightning bolt in white
    ctx.fillStyle = "#ffffff";
    ctx.beginPath();
    ctx.moveTo(60, 45);
    ctx.lineTo(44, 76);
    ctx.lineTo(56, 76);
    ctx.lineTo(48, 100);
    ctx.lineTo(72, 68);
    ctx.lineTo(58, 68);
    ctx.closePath();
    ctx.fill();

    // Hindi text: ख़तरा ४१५ वोल्ट
    ctx.fillStyle = "#111111";
    ctx.font = "bold 32px 'Segoe UI', Arial, sans-serif";
    ctx.fillText("ख़तरा", 120, 62);

    // English text: DANGER 415 VOLTS
    ctx.font = "900 30px 'Arial Black', Impact, sans-serif";
    ctx.fillStyle = "#b91c1c";
    ctx.fillText("DANGER", 120, 102);

    // Voltage rating line
    ctx.fillStyle = "#111111";
    ctx.font = "900 22px 'Arial Black', sans-serif";
    ctx.fillText("415 VOLTS · 50 Hz", 120, 132);

    // Subtext
    ctx.fillStyle = "#222222";
    ctx.font = "bold 11px system-ui, sans-serif";
    ctx.fillText("AUTHORIZED PERSONNEL ONLY · विद्युत झटका का खतरा", 24, 168);
  });
}

// 4. Feeder Engraved Identification Plate (Form 4b black acrylic / white engraved)
function createFeederNameplateTexture(title: string, subtitle = "3200A · 415V · 65kA") {
  return createCanvasTexture(512, 120, (ctx, w, h) => {
    // Chamfered black acrylic panel
    ctx.fillStyle = "#0c1015";
    ctx.fillRect(0, 0, w, h);

    // Beveled frame
    ctx.strokeStyle = "#38434f";
    ctx.lineWidth = 4;
    ctx.strokeRect(4, 4, w - 8, h - 8);

    // Inner white engraving line
    ctx.strokeStyle = "rgba(255, 255, 255, 0.25)";
    ctx.lineWidth = 1;
    ctx.strokeRect(10, 10, w - 20, h - 20);

    // Mounting screw rivets at 4 corners
    const rivets = [
      [18, 18],
      [w - 18, 18],
      [18, h - 18],
      [w - 18, h - 18],
    ];
    rivets.forEach(([rx, ry]) => {
      ctx.fillStyle = "#94a3b8";
      ctx.beginPath();
      ctx.arc(rx, ry, 5, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = "#1e293b";
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.moveTo(rx - 3, ry);
      ctx.lineTo(rx + 3, ry);
      ctx.stroke();
    });

    // Primary feeder title
    ctx.fillStyle = "#ffffff";
    ctx.font = "bold 34px 'Segoe UI', Arial, sans-serif";
    ctx.textAlign = "center";
    ctx.fillText(title, w / 2, 54);

    // Subtitle rating
    ctx.fillStyle = "#ef6b25";
    ctx.font = "bold 18px monospace";
    ctx.fillText(subtitle, w / 2, 92);
    ctx.textAlign = "left";
  });
}

// 5. Air Circuit Breaker (ACB) Draw-out Mechanism & Trip Unit Faceplate
function createAcbFaceplateTexture(breakerName = "3200A 4P ACB") {
  return createCanvasTexture(512, 360, (ctx, w, h) => {
    // Industrial textured charcoal body
    ctx.fillStyle = "#1e2229";
    ctx.fillRect(0, 0, w, h);

    ctx.strokeStyle = "#333b47";
    ctx.lineWidth = 6;
    ctx.strokeRect(4, 4, w - 8, h - 8);

    // Top Brand & Breaker designation
    ctx.fillStyle = "#0f1217";
    ctx.fillRect(16, 16, w - 32, 44);

    ctx.fillStyle = "#ef6b25";
    ctx.font = "bold 17px 'Segoe UI', sans-serif";
    ctx.fillText("SHARMA · C-POWER SERIES", 32, 44);

    ctx.fillStyle = "#ffffff";
    ctx.font = "bold 15px monospace";
    ctx.textAlign = "right";
    ctx.fillText(breakerName, w - 32, 44);
    ctx.textAlign = "left";

    // Mechanical Position Indicator (CONNECTED / TEST / DISCONNECTED)
    ctx.fillStyle = "#0c0e12";
    ctx.fillRect(32, 76, 210, 56);
    ctx.strokeStyle = "#475569";
    ctx.lineWidth = 2;
    ctx.strokeRect(32, 76, 210, 56);

    ctx.fillStyle = "#22c55e";
    ctx.fillRect(40, 84, 95, 40);
    ctx.fillStyle = "#ffffff";
    ctx.font = "900 13px 'Segoe UI', sans-serif";
    ctx.textAlign = "center";
    ctx.fillText("CONNECTED", 87, 109);

    ctx.fillStyle = "#334155";
    ctx.fillRect(140, 84, 95, 40);
    ctx.fillStyle = "#94a3b8";
    ctx.font = "bold 12px 'Segoe UI', sans-serif";
    ctx.fillText("DISCONN.", 187, 109);
    ctx.textAlign = "left";

    // Spring Charge Status Indicator
    ctx.fillStyle = "#0c0e12";
    ctx.fillRect(270, 76, 210, 56);
    ctx.strokeStyle = "#475569";
    ctx.lineWidth = 2;
    ctx.strokeRect(270, 76, 210, 56);

    ctx.fillStyle = "#eab308";
    ctx.fillRect(278, 84, 194, 40);
    ctx.fillStyle = "#000000";
    ctx.font = "900 14px 'Segoe UI', sans-serif";
    ctx.textAlign = "center";
    ctx.fillText("⚡ SPRING CHARGED", 375, 109);
    ctx.textAlign = "left";

    // Microprocessor Protection Trip Unit
    ctx.fillStyle = "#0a131f";
    ctx.fillRect(32, 148, w - 64, 120);
    ctx.strokeStyle = "#1e3a5f";
    ctx.lineWidth = 2;
    ctx.strokeRect(32, 148, w - 64, 120);

    ctx.fillStyle = "#38bdf8";
    ctx.font = "bold 13px monospace";
    ctx.fillText("MICROPROCESSOR TRIP UNIT (ETU-4B)", 48, 172);

    // Dials / Potentiometers for Ir, Isd, Ii, Ig
    const dials = [
      { name: "Ir", val: "1.0 In", col: "#22c55e" },
      { name: "Isd", val: "6 x Ir", col: "#eab308" },
      { name: "Ii", val: "10 x In", col: "#ef4444" },
      { name: "Ig", val: "0.4 In", col: "#38bdf8" },
    ];
    dials.forEach((d, idx) => {
      const dx = 56 + idx * 105;
      ctx.fillStyle = "#16222f";
      ctx.beginPath();
      ctx.arc(dx + 30, 215, 22, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = "#475569";
      ctx.lineWidth = 2;
      ctx.stroke();

      // Notch
      ctx.strokeStyle = d.col;
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.moveTo(dx + 30, 215);
      ctx.lineTo(dx + 42, 203);
      ctx.stroke();

      ctx.fillStyle = "#94a3b8";
      ctx.font = "bold 11px monospace";
      ctx.textAlign = "center";
      ctx.fillText(d.name, dx + 30, 190);
      ctx.fillStyle = d.col;
      ctx.fillText(d.val, dx + 30, 252);
    });
    ctx.textAlign = "left";

    // Bottom Push Buttons: Green ON (I) and Red OFF (O)
    // OFF button
    ctx.fillStyle = "#b91c1c";
    ctx.beginPath();
    ctx.arc(100, 312, 24, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = "#450a0a";
    ctx.lineWidth = 3;
    ctx.stroke();
    ctx.fillStyle = "#ffffff";
    ctx.font = "900 22px sans-serif";
    ctx.textAlign = "center";
    ctx.fillText("O", 100, 320);

    ctx.fillStyle = "#ef4444";
    ctx.font = "bold 11px system-ui";
    ctx.fillText("PUSH OFF", 100, 348);

    // ON button
    ctx.fillStyle = "#15803d";
    ctx.beginPath();
    ctx.arc(220, 312, 24, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = "#052e16";
    ctx.lineWidth = 3;
    ctx.stroke();
    ctx.fillStyle = "#ffffff";
    ctx.font = "900 22px sans-serif";
    ctx.fillText("I", 220, 320);

    ctx.fillStyle = "#22c55e";
    ctx.font = "bold 11px system-ui";
    ctx.fillText("PUSH ON", 220, 348);

    // Racking Handle Access Shutter Hole
    ctx.fillStyle = "#000000";
    ctx.fillRect(330, 290, 140, 44);
    ctx.strokeStyle = "#64748b";
    ctx.lineWidth = 2;
    ctx.strokeRect(330, 290, 140, 44);

    ctx.fillStyle = "#e2e8f0";
    ctx.font = "bold 10px monospace";
    ctx.fillText("RACKING SHUTTER", 400, 316);
    ctx.textAlign = "left";
  });
}

// 6. Rotary Operating Handle (ROH) Escutcheon Plate
function createRotaryHandleTexture() {
  return createCanvasTexture(160, 160, (ctx, w, h) => {
    ctx.fillStyle = "#1b2028";
    ctx.beginPath();
    ctx.arc(w / 2, h / 2, 74, 0, Math.PI * 2);
    ctx.fill();

    ctx.strokeStyle = "#384252";
    ctx.lineWidth = 4;
    ctx.stroke();

    // Yellow inner emergency padlock ring
    ctx.strokeStyle = "#eab308";
    ctx.lineWidth = 5;
    ctx.beginPath();
    ctx.arc(w / 2, h / 2, 54, 0, Math.PI * 2);
    ctx.stroke();

    // Markings: OFF (top), ON (right), TRIP (45 deg)
    ctx.font = "bold 13px sans-serif";
    ctx.textAlign = "center";

    ctx.fillStyle = "#22c55e";
    ctx.fillText("OFF", w / 2, 24);

    ctx.fillStyle = "#ef4444";
    ctx.fillText("ON", w - 20, h / 2 + 5);

    ctx.fillStyle = "#f59e0b";
    ctx.fillText("TRIP", w - 34, 44);
  });
}

// 7. Ground / Earth Bar Label (Green & Yellow)
function createEarthBadgeTexture() {
  return createCanvasTexture(128, 64, (ctx, w, h) => {
    ctx.fillStyle = "#15803d";
    ctx.fillRect(0, 0, w, h);

    // Yellow diagonal stripe
    ctx.fillStyle = "#eab308";
    ctx.beginPath();
    ctx.moveTo(30, 0);
    ctx.lineTo(60, 0);
    ctx.lineTo(30, h);
    ctx.lineTo(0, h);
    ctx.closePath();
    ctx.fill();

    ctx.beginPath();
    ctx.moveTo(90, 0);
    ctx.lineTo(120, 0);
    ctx.lineTo(90, h);
    ctx.lineTo(60, h);
    ctx.closePath();
    ctx.fill();

    // Ground symbol in circle
    ctx.fillStyle = "#ffffff";
    ctx.beginPath();
    ctx.arc(w / 2, h / 2, 22, 0, Math.PI * 2);
    ctx.fill();

    ctx.strokeStyle = "#111111";
    ctx.lineWidth = 3;
    // Main vertical stem
    ctx.beginPath();
    ctx.moveTo(w / 2, 18);
    ctx.lineTo(w / 2, 34);
    // Three horizontal ground lines
    ctx.moveTo(w / 2 - 14, 34);
    ctx.lineTo(w / 2 + 14, 34);
    ctx.moveTo(w / 2 - 9, 39);
    ctx.lineTo(w / 2 + 9, 39);
    ctx.moveTo(w / 2 - 4, 44);
    ctx.lineTo(w / 2 + 4, 44);
    ctx.stroke();
  });
}

// 8. Louver Vent Texture with realistic angled shadow slashes
function createLouverVentTexture() {
  return createCanvasTexture(256, 128, (ctx, w, h) => {
    ctx.fillStyle = "#1e242d";
    ctx.fillRect(0, 0, w, h);

    // Slanted louver slots with deep shadow & metallic lip
    const slots = 8;
    const slotH = h / (slots + 1);
    for (let i = 1; i <= slots; i += 1) {
      const y = i * slotH;

      // Dark slot intake
      ctx.fillStyle = "#07090c";
      ctx.fillRect(16, y, w - 32, 5);

      // Angled louver blade upper highlight
      ctx.fillStyle = "#4b5563";
      ctx.fillRect(16, y - 2, w - 32, 2);

      // Angled blade lower shadow
      ctx.fillStyle = "#111827";
      ctx.fillRect(16, y + 5, w - 32, 4);
    }

    ctx.strokeStyle = "#374151";
    ctx.lineWidth = 3;
    ctx.strokeRect(6, 6, w - 12, h - 12);
  });
}

function createShadowTexture() {
  const canvas = document.createElement("canvas");
  canvas.width = canvas.height = 128;
  const ctx = canvas.getContext("2d")!;
  const grad = ctx.createRadialGradient(64, 64, 0, 64, 64, 64);
  grad.addColorStop(0, "rgba(0,0,0,0.85)");
  grad.addColorStop(0.5, "rgba(0,0,0,0.35)");
  grad.addColorStop(1, "rgba(0,0,0,0)");
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, 128, 128);
  return new THREE.CanvasTexture(canvas);
}

// ============================================================================
// Photorealistic Industrial Switchgear Materials (RAL 7035 Powder-coat + Copper)
// ============================================================================
function createMaterials(finish = "light") {
  const isLight = finish === "light";
  return {
    // Standard switchgear RAL 7035 light grey textured electrostatic powder coating
    body: new THREE.MeshPhysicalMaterial({
      color: isLight ? "#c8ced4" : "#26303d",
      metalness: 0.3,
      roughness: 0.44,
      clearcoat: 0.38,
      clearcoatRoughness: 0.35,
    }),
    // Internal galvanized zinc-chromate / Aluzinc segregation partition
    bodyInner: new THREE.MeshStandardMaterial({
      color: isLight ? "#b0b8c0" : "#1f2733",
      metalness: 0.55,
      roughness: 0.42,
      side: THREE.DoubleSide,
    }),
    // Heavy 100mm ISMC base plinth (Anthracite Black)
    plinth: new THREE.MeshStandardMaterial({
      color: "#12151a",
      metalness: 0.4,
      roughness: 0.6,
    }),
    // Galvanized steel interior mounting backplate
    plate: new THREE.MeshStandardMaterial({
      color: "#9aa5b0",
      metalness: 0.85,
      roughness: 0.28,
    }),
    // Electrolytic Tough Pitch (ETP) 99.9% Pure Copper (Busbars & Droppers)
    copper: new THREE.MeshStandardMaterial({
      color: "#d9783f",
      metalness: 0.98,
      roughness: 0.22,
    }),
    // Phase R insulated heat-shrink sleeve (Red)
    busbarRed: new THREE.MeshStandardMaterial({
      color: "#c5221f",
      metalness: 0.2,
      roughness: 0.4,
    }),
    // Phase Y insulated heat-shrink sleeve (Yellow)
    busbarYellow: new THREE.MeshStandardMaterial({
      color: "#eab308",
      metalness: 0.2,
      roughness: 0.4,
    }),
    // Phase B insulated heat-shrink sleeve (Blue)
    busbarBlue: new THREE.MeshStandardMaterial({
      color: "#1d6cd8",
      metalness: 0.2,
      roughness: 0.4,
    }),
    // Neutral N insulated heat-shrink sleeve (Black)
    busbarBlack: new THREE.MeshStandardMaterial({
      color: "#1e2227",
      metalness: 0.25,
      roughness: 0.45,
    }),
    // DMC / SMC molded fiberglass busbar support insulator comb (Flame-Retardant Red)
    dmcInsulator: new THREE.MeshStandardMaterial({
      color: "#881e1b",
      metalness: 0.05,
      roughness: 0.75,
    }),
    // Polished stainless steel hardware (Eyebolts, Hinge Pins, Bolts)
    steel: new THREE.MeshStandardMaterial({
      color: "#e2e8f0",
      metalness: 0.95,
      roughness: 0.16,
    }),
    // Cast chrome / zinc door locks
    chrome: new THREE.MeshStandardMaterial({
      color: "#f1f5f9",
      metalness: 1.0,
      roughness: 0.12,
    }),
    // Matte industrial black (Breaker housing, shrouds, handles)
    black: new THREE.MeshStandardMaterial({
      color: "#13161c",
      metalness: 0.2,
      roughness: 0.55,
    }),
    // Dark graphite grey (Escutcheons, meters)
    darkGrey: new THREE.MeshStandardMaterial({
      color: "#28303a",
      metalness: 0.35,
      roughness: 0.48,
    }),
    // Off-white / RAL 9010 (MCB bodies, terminal blocks)
    white: new THREE.MeshStandardMaterial({
      color: "#f1f3f5",
      metalness: 0.05,
      roughness: 0.4,
    }),
    // Perforated grey PVC wiring duct / slotted trunking
    duct: new THREE.MeshStandardMaterial({
      color: "#6b7280",
      metalness: 0.08,
      roughness: 0.65,
    }),
    // Industrial safety orange (Emergency handles & high-visibility trims)
    orange: new THREE.MeshStandardMaterial({
      color: "#ef6b25",
      metalness: 0.25,
      roughness: 0.3,
      emissive: "#ef6b25",
      emissiveIntensity: 0.15,
    }),
    // Indicator & status red
    red: new THREE.MeshStandardMaterial({
      color: "#dc2626",
      metalness: 0.2,
      roughness: 0.3,
    }),
    // Indicator & status green
    green: new THREE.MeshStandardMaterial({
      color: "#16a34a",
      metalness: 0.2,
      roughness: 0.3,
    }),
  };
}

// ============================================================================
// Helper 3D geometry builders
// ============================================================================
function boxMesh(w: number, h: number, d: number, material: THREE.Material, x = 0, y = 0, z = 0) {
  const mesh = new THREE.Mesh(new THREE.BoxGeometry(w, h, d), material);
  mesh.position.set(x, y, z);
  mesh.castShadow = true;
  mesh.receiveShadow = true;
  return mesh;
}

function cylinderMesh(r: number, h: number, material: THREE.Material, x = 0, y = 0, z = 0, segments = 16) {
  const mesh = new THREE.Mesh(new THREE.CylinderGeometry(r, r, h, segments), material);
  mesh.position.set(x, y, z);
  mesh.castShadow = true;
  return mesh;
}

function planeDecal(w: number, h: number, texture: THREE.Texture, x = 0, y = 0, z = 0, glowing = false) {
  const mat = glowing
    ? new THREE.MeshBasicMaterial({
        map: texture,
        transparent: true,
      })
    : new THREE.MeshStandardMaterial({
        map: texture,
        roughness: 0.42,
        metalness: 0.1,
        transparent: true,
      });
  const mesh = new THREE.Mesh(new THREE.PlaneGeometry(w, h), mat);
  mesh.position.set(x, y, z);
  return mesh;
}

// Crane Lifting Eyebolt (Heavy-duty forged steel M24 lifting eye on canopy)
function addLiftingEyebolt(parent: THREE.Group, materials: any, x: number, y: number, z: number) {
  const group = new THREE.Group();
  group.position.set(x, y, z);

  // Threaded base boss
  const base = cylinderMesh(0.032, 0.024, materials.steel, 0, 0.012, 0, 16);
  // Heavy forged steel ring
  const ringGeo = new THREE.TorusGeometry(0.042, 0.014, 12, 24);
  const ring = new THREE.Mesh(ringGeo, materials.steel);
  ring.position.set(0, 0.054, 0);
  ring.castShadow = true;

  group.add(base, ring);
  parent.add(group);
}

// Industrial Door Cam Lock (Quarter-turn DIN double-bit lock)
function addDoorLock(parent: THREE.Group, materials: any, x: number, y: number, z: number) {
  const bezel = cylinderMesh(0.024, 0.012, materials.chrome, x, y, z, 16);
  bezel.rotation.x = Math.PI / 2;
  const keySlot = boxMesh(0.018, 0.005, 0.014, materials.black, x, y, z + 0.003);
  parent.add(bezel, keySlot);
}

// Heavy-duty Die-cast Lift-off Door Hinge
function addDoorHinge(parent: THREE.Group, materials: any, x: number, y: number, z: number) {
  const hingeGroup = new THREE.Group();
  hingeGroup.position.set(x, y, z);

  // Upper knuckle
  const upper = cylinderMesh(0.014, 0.04, materials.black, 0, 0.022, 0, 12);
  // Lower knuckle
  const lower = cylinderMesh(0.014, 0.04, materials.black, 0, -0.022, 0, 12);
  // Center stainless steel hinge pin
  const pin = cylinderMesh(0.008, 0.09, materials.steel, 0, 0, 0, 12);
  // Leaf flange
  const leaf = boxMesh(0.022, 0.07, 0.008, materials.darkGrey, -0.011, 0, -0.005);

  hingeGroup.add(upper, lower, pin, leaf);
  parent.add(hingeGroup);
}

// Rotary Operating Handle (ROH) for Outgoing MCCBs
function addRotaryHandle(parent: THREE.Group, materials: any, x: number, y: number, z: number) {
  const handleGroup = new THREE.Group();
  handleGroup.position.set(x, y, z);

  // Escutcheon decal plate
  const escutcheon = planeDecal(0.12, 0.12, createRotaryHandleTexture(), 0, 0, 0.002);
  // Yellow emergency padlocking collar ring
  const yellowCollar = cylinderMesh(0.038, 0.018, materials.orange, 0, 0, 0.012, 20);
  yellowCollar.rotation.x = Math.PI / 2;

  // Ergonomic pistol-grip handle lever
  const handleBase = cylinderMesh(0.022, 0.026, materials.black, 0, 0, 0.026, 16);
  handleBase.rotation.x = Math.PI / 2;

  const leverArm = boxMesh(0.022, 0.11, 0.026, materials.black, 0, 0.042, 0.032);
  // Red tip accent
  const redTip = boxMesh(0.024, 0.024, 0.028, materials.red, 0, 0.092, 0.032);

  handleGroup.add(escutcheon, yellowCollar, handleBase, leverArm, redTip);
  parent.add(handleGroup);
}

// Indicator Pilot Lamps with Knurled Chrome Bezels & Faceted Glowing Lenses
function addPilotLamps(
  parent: THREE.Group,
  lampsArray: THREE.MeshStandardMaterial[],
  x: number,
  y: number,
  z: number,
  spacing = 0.085,
  labels = ["R", "Y", "B"]
) {
  const colors = ["#ef4444", "#eab308", "#2563eb"];
  colors.forEach((col, idx) => {
    const lampMat = new THREE.MeshStandardMaterial({
      color: col,
      emissive: col,
      emissiveIntensity: 1.6,
      roughness: 0.15,
      metalness: 0.1,
    });
    lampsArray.push(lampMat);

    // Chrome outer knurled bezel
    const bezel = cylinderMesh(0.028, 0.02, new THREE.MeshStandardMaterial({ color: "#222", metalness: 0.8, roughness: 0.2 }), x + idx * spacing, y, z);
    bezel.rotation.x = Math.PI / 2;

    // Glowing faceted dome lens
    const dome = new THREE.Mesh(
      new THREE.SphereGeometry(0.02, 16, 12, 0, Math.PI * 2, 0, Math.PI / 2),
      lampMat
    );
    dome.rotation.x = Math.PI / 2;
    dome.position.set(x + idx * spacing, y, z + 0.011);

    parent.add(bezel, dome);
  });
}

// DIN Rail with Modular Breakers & Terminals
function addDinRail(parent: THREE.Group, materials: any, w: number, y: number, z: number) {
  // Slotted 35mm DIN rail
  parent.add(boxMesh(w, 0.035, 0.012, materials.steel, 0, y, z));
  const breakerCount = Math.floor(w / 0.048);

  for (let i = 0; i < breakerCount; i += 1) {
    const posX = -w / 2 + 0.024 + i * 0.048;
    // Miniature Circuit Breaker body
    parent.add(boxMesh(0.042, 0.14, 0.075, materials.white, posX, y, z + 0.045));
    // Toggle switch (Red for main poles, Black for auxiliary)
    const toggleMat = i % 4 === 0 ? materials.red : materials.black;
    parent.add(boxMesh(0.014, 0.026, 0.022, toggleMat, posX, y + 0.01, z + 0.09));
    // Terminal screw indicators
    parent.add(boxMesh(0.034, 0.012, 0.01, materials.steel, posX, y + 0.055, z + 0.05));
    parent.add(boxMesh(0.034, 0.012, 0.01, materials.steel, posX, y - 0.055, z + 0.05));
  }
}

// PVC Slotted Wiring Ducts (Trunking with removable snap-on cover)
function addWiringDucts(parent: THREE.Group, materials: any, w: number, h: number, z: number) {
  parent.add(boxMesh(w * 0.94, 0.065, 0.07, materials.duct, 0, h / 2 - 0.12, z + 0.035));
  parent.add(boxMesh(w * 0.94, 0.065, 0.07, materials.duct, 0, -h / 2 + 0.12, z + 0.035));
  parent.add(boxMesh(0.065, h - 0.3, 0.07, materials.duct, -w / 2 + 0.07, 0, z + 0.035));
  parent.add(boxMesh(0.065, h - 0.3, 0.07, materials.duct, w / 2 - 0.07, 0, z + 0.035));
}

// ============================================================================
// Internal Compartments (Form 4b ACB Incomer & Feeder Modules)
// ============================================================================
function buildBayInterior(
  type: string,
  materials: any,
  bayW: number,
  bayH: number,
  zOffset: number,
  bayIdx: number
) {
  const group = new THREE.Group();
  // Galvanized steel rear mounting plate
  group.add(boxMesh(bayW * 0.94, bayH * 0.94, 0.015, materials.plate, 0, 0, zOffset));

  const z = zOffset + 0.01;
  const innerW = bayW * 0.74;

  if (type === "mcb") {
    addWiringDucts(group, materials, bayW, bayH, z);
    // Main Incomer MCCB in center-top
    group.add(boxMesh(0.28, 0.34, 0.15, materials.black, 0, bayH * 0.28, z + 0.075));
    group.add(boxMesh(0.08, 0.1, 0.035, materials.white, 0, bayH * 0.28, z + 0.165));
    // 4 rows of DIN rail modules
    for (let i = 0; i < 4; i += 1) {
      addDinRail(group, materials, innerW, bayH * 0.08 - i * 0.2, z);
    }
  } else if (type === "acb") {
    if (bayIdx % 2 === 0) {
      // -------------------------------------------------------------
      // High-Current Draw-Out Air Circuit Breaker (ACB) Assembly
      // -------------------------------------------------------------
      const acbY = bayH * 0.08;

      // Draw-out cradle chassis frame
      group.add(boxMesh(innerW, 0.58, 0.36, materials.darkGrey, 0, acbY, z + 0.18));

      // Side guide rails with racking teeth
      group.add(boxMesh(0.02, 0.54, 0.32, materials.steel, -innerW / 2 + 0.01, acbY, z + 0.18));
      group.add(boxMesh(0.02, 0.54, 0.32, materials.steel, innerW / 2 - 0.01, acbY, z + 0.18));

      // Top Arc Chutes (De-ion grid cooling vents)
      for (let chute = 0; chute < 4; chute += 1) {
        const cx = -innerW * 0.3 + chute * (innerW * 0.2);
        group.add(boxMesh(0.08, 0.14, 0.12, materials.black, cx, acbY + 0.28, z + 0.18));
        // Arc chute metallic louvers
        for (let l = 0; l < 4; l += 1) {
          group.add(boxMesh(0.07, 0.008, 0.1, materials.steel, cx, acbY + 0.23 + l * 0.025, z + 0.18));
        }
      }

      // Front breaker faceplate with trip unit & racking socket
      const faceW = innerW * 0.86;
      group.add(boxMesh(faceW, 0.38, 0.04, materials.black, 0, acbY, z + 0.38));
      group.add(planeDecal(faceW * 0.94, 0.34, createAcbFaceplateTexture(`ACB ${3200 - bayIdx * 400}A 4P`), 0, acbY, z + 0.402));

      // Heavy manual spring charging lever (pivoted on right)
      group.add(boxMesh(0.018, 0.22, 0.02, materials.steel, faceW / 2 - 0.04, acbY - 0.02, z + 0.41));
    } else {
      // -------------------------------------------------------------
      // Modular Outgoing MCCB Feeder Compartments
      // -------------------------------------------------------------
      for (let i = 0; i < 3; i += 1) {
        const rowY = bayH * 0.24 - i * 0.36;
        // Feeder compartment horizontal divider shelf
        group.add(boxMesh(innerW * 1.1, 0.02, 0.3, materials.bodyInner, 0, rowY - 0.16, z + 0.15));

        // Dual MCCB Modules per row
        [-0.14, 0.14].forEach((posX, mIdx) => {
          group.add(boxMesh(0.22, 0.28, 0.14, materials.black, posX, rowY, z + 0.07));
          // Breaker toggle / rotary base
          group.add(cylinderMesh(0.035, 0.03, materials.orange, posX, rowY + 0.02, z + 0.15));
          // Rating decal
          group.add(planeDecal(0.18, 0.05, createFeederNameplateTexture(`FEEDER ${i * 2 + mIdx + 1}`, "400A 3P 50kA"), posX, rowY + 0.1, z + 0.145));
        });
      }
    }

    // ---------------------------------------------------------------
    // Vertical Copper Busbar Droppers (Phase R, Y, B, N)
    // ---------------------------------------------------------------
    const dropperMats = [materials.busbarRed, materials.busbarYellow, materials.busbarBlue, materials.busbarBlack];
    dropperMats.forEach((mat, idx) => {
      const dropX = bayW / 2 - 0.11 - idx * 0.055;
      // Insulated vertical dropper bar
      group.add(boxMesh(0.022, bayH * 0.88, 0.06, mat, dropX, 0, z + 0.12));
      // Joint bare copper connecting clamp
      group.add(boxMesh(0.032, 0.06, 0.07, materials.copper, dropX, bayH * 0.15, z + 0.12));
    });
  } else {
    addWiringDucts(group, materials, bayW, bayH, z);
    group.add(boxMesh(0.26, 0.22, 0.12, materials.black, 0, bayH * 0.28, z + 0.06));
    for (let i = 0; i < 4; i += 1) {
      addDinRail(group, materials, innerW, bayH * 0.08 - i * 0.2, z);
    }
  }

  return group;
}

// ============================================================================
// Main 3D Panel Model Builder (Form 4b Multi-Bay Switchboard)
// ============================================================================
function buildPanelModel(config: any, code = "PT-01") {
  const materials = createMaterials(config.finish || "light");
  const lamps: THREE.MeshStandardMaterial[] = [];
  const root = new THREE.Group();
  const interior = new THREE.Group();
  const doors: THREE.Group[] = [];

  const bayW = 0.95;
  const bayH = 2.65;
  const depth = 0.88;
  const totalW = bayW * (config.bays || 1);
  const wallThick = 0.035;
  const plinthH = 0.15;
  const centerY = plinthH + bayH / 2;

  // 1. External Cabinet Framework (Sheet Steel Enclosure)
  const cabinet = new THREE.Group();
  // Rear wall
  cabinet.add(boxMesh(totalW, bayH, wallThick, materials.bodyInner, 0, centerY, -depth / 2 + wallThick / 2));
  // Left end side panel
  cabinet.add(boxMesh(wallThick, bayH, depth, materials.body, -totalW / 2 + wallThick / 2, centerY, 0));
  // Right end side panel
  cabinet.add(boxMesh(wallThick, bayH, depth, materials.body, totalW / 2 - wallThick / 2, centerY, 0));
  // Roof top panel
  cabinet.add(boxMesh(totalW, wallThick, depth, materials.body, 0, centerY + bayH / 2 - wallThick / 2, 0));
  // Bottom gland base plate
  cabinet.add(boxMesh(totalW, wallThick, depth, materials.body, 0, plinthH + wallThick / 2, 0));

  // Internal bay segregation barriers (Form 4b separation between columns)
  for (let b = 1; b < (config.bays || 1); b += 1) {
    cabinet.add(boxMesh(wallThick * 0.7, bayH - 0.04, depth - 0.03, materials.bodyInner, -totalW / 2 + b * bayW, centerY, 0));
  }
  root.add(cabinet);

  // 2. Heavy-Duty Base Plinth (100mm/150mm ISMC Steel Channel)
  const plinth = new THREE.Group();
  plinth.add(boxMesh(totalW + 0.03, plinthH, depth + 0.03, materials.plinth, 0, plinthH / 2, 0));
  // Plinth anchor bolt slots on front
  for (let b = 0; b < (config.bays || 1); b += 1) {
    const px = -totalW / 2 + b * bayW + bayW / 2;
    plinth.add(boxMesh(0.12, 0.03, 0.015, materials.black, px, plinthH / 2, depth / 2 + 0.018));
  }
  root.add(plinth);

  // 3. Continuous Electrolytic Copper Earth Busbar (along bottom plinth)
  const earthBarY = plinthH * 0.75;
  const earthBarZ = depth / 2 + 0.019;
  const earthBar = boxMesh(totalW - 0.06, 0.038, 0.008, materials.copper, 0, earthBarY, earthBarZ);
  root.add(earthBar);

  // Earth connection badge decals on left & right ends
  root.add(planeDecal(0.08, 0.04, createEarthBadgeTexture(), -totalW / 2 + 0.12, earthBarY, earthBarZ + 0.006));
  root.add(planeDecal(0.08, 0.04, createEarthBadgeTexture(), totalW / 2 - 0.12, earthBarY, earthBarZ + 0.006));

  // 4. Canopy Roof Detailing & Heavy Crane Lifting Eyebolts
  const canopyZ = 0;
  const canopyY = centerY + bayH / 2 + 0.02;
  // Overhanging canopy drip-rim
  root.add(boxMesh(totalW + 0.06, 0.04, depth + 0.06, materials.body, 0, canopyY, canopyZ));

  // 4x Forged Steel Crane Lifting Eyebolts on roof
  const eyeX = totalW / 2 - 0.18;
  const eyeZ = depth / 2 - 0.18;
  [
    [-eyeX, -eyeZ],
    [eyeX, -eyeZ],
    [-eyeX, eyeZ],
    [eyeX, eyeZ],
  ].forEach(([ex, ez]) => {
    addLiftingEyebolt(root, materials, ex, canopyY + 0.02, ez);
  });

  // 5. Top Form 4b Insulated Horizontal Busbar Chamber
  // Phase R, Y, B and Neutral insulated busbars with DMC/SMC support combs
  const busbarYStart = centerY + bayH / 2 - 0.11;
  const busbarZ = depth / 2 - 0.13;
  const busbarColors = [
    { mat: materials.busbarRed, name: "R-Phase" },
    { mat: materials.busbarYellow, name: "Y-Phase" },
    { mat: materials.busbarBlue, name: "B-Phase" },
    { mat: materials.busbarBlack, name: "Neutral" },
  ];

  busbarColors.forEach((bColor, busIdx) => {
    const yPos = busbarYStart - busIdx * 0.065;
    // Continuous insulated copper busbar
    root.add(boxMesh(totalW - 0.08, 0.045, 0.018, bColor.mat, 0, yPos, busbarZ));

    // Bare copper overlap joints with silver hex bolts at each bay transition
    for (let b = 0; b <= (config.bays || 1); b += 1) {
      const jx = -totalW / 2 + b * bayW;
      if (b > 0 && b < (config.bays || 1)) {
        root.add(boxMesh(0.06, 0.048, 0.024, materials.copper, jx, yPos, busbarZ));
        root.add(cylinderMesh(0.008, 0.028, materials.steel, jx - 0.015, yPos, busbarZ));
        root.add(cylinderMesh(0.008, 0.028, materials.steel, jx + 0.015, yPos, busbarZ));
      }
    }

    // Red DMC/SMC molded fiberglass support insulator combs (every bay)
    for (let b = 0; b < (config.bays || 1); b += 1) {
      const sx = -totalW / 2 + b * bayW + bayW * 0.18;
      root.add(boxMesh(0.03, 0.055, 0.055, materials.dmcInsulator, sx, yPos, busbarZ - 0.02));
    }
  });

  // 6. Bays Assembly: Form 4b Interior Modules + Hinged Doors
  for (let b = 0; b < (config.bays || 1); b += 1) {
    const bayLeft = -totalW / 2 + b * bayW;
    const bayCenter = bayLeft + bayW / 2;

    // Internal bay modules
    const bayInterior = buildBayInterior(
      config.interior || "acb",
      materials,
      bayW - 0.06,
      bayH - 0.12,
      -depth / 2 + wallThick + 0.01,
      b
    );
    bayInterior.position.set(bayCenter, centerY, 0);
    interior.add(bayInterior);

    // Hinged Door Assembly
    const hingeGroup = new THREE.Group();
    hingeGroup.position.set(bayLeft + 0.012, centerY, depth / 2);

    const doorLeaf = new THREE.Group();
    doorLeaf.position.x = bayW / 2 - 0.012;

    const doorW = bayW - 0.028;
    const doorH = bayH - 0.05;

    // Main door panel with beveled pressed-edge look
    doorLeaf.add(boxMesh(doorW, doorH, 0.032, materials.body, 0, 0, 0.016));
    // Perimeter rubber EPDM sealing gasket border shadow
    doorLeaf.add(boxMesh(doorW + 0.004, doorH + 0.004, 0.008, materials.black, 0, 0, 0.002));

    const frontZ = 0.033;

    // A. Feeder Designation Nameplate on top
    const plateText =
      b === 0
        ? "INCOMER 1 · 3200A ACB"
        : b === Math.floor((config.bays || 1) / 2)
        ? "BUS COUPLER · 2500A"
        : `OUTGOING FEEDER ${b}`;
    const subText = b === 0 ? "415V · 3PH 4W · 50Hz · 65kA" : "FORM 4b · TYPE-TESTED";

    doorLeaf.add(
      planeDecal(
        doorW * 0.76,
        0.082,
        createFeederNameplateTexture(plateText, subText),
        0,
        doorH / 2 - 0.13,
        frontZ + 0.002
      )
    );

    // B. Bay-specific Instrumentation & Displays
    const isCenterBay = b === Math.floor((config.bays || 1) / 2);

    if (isCenterBay) {
      // CENTER BAY: 15-inch Touchscreen SCADA / HMI Display
      const hmiW = 0.46;
      const hmiH = 0.3;
      doorLeaf.add(boxMesh(hmiW + 0.04, hmiH + 0.04, 0.026, materials.darkGrey, 0, doorH * 0.18, frontZ + 0.013));
      doorLeaf.add(planeDecal(hmiW, hmiH, createScadaHmiTexture(), 0, doorH * 0.18, frontZ + 0.027, true));
      // Status LEDs under HMI
      addPilotLamps(doorLeaf, lamps, -0.09, doorH * 0.18 - 0.2, frontZ + 0.012, 0.09);
    } else if (b === 0) {
      // INCOMER BAY: Digital Multifunction Meter (MFM) + Phase Pilot Lamps
      const mfmSize = 0.28;
      doorLeaf.add(boxMesh(mfmSize + 0.03, mfmSize + 0.03, 0.028, materials.black, 0, doorH * 0.24, frontZ + 0.014));
      doorLeaf.add(
        planeDecal(mfmSize, mfmSize, createDigitalMfmTexture("INCOMER 1", "415.2", "1248"), 0, doorH * 0.24, frontZ + 0.029, true)
      );

      // R-Y-B Phase Indicator Lamps
      addPilotLamps(doorLeaf, lamps, -0.09, doorH * 0.24 - 0.2, frontZ + 0.012, 0.09);
    } else if (b % 2 === 0) {
      // ACB INCOMER / COUPLER BAY: Secondary Digital Meter
      const mfmSize = 0.24;
      doorLeaf.add(boxMesh(mfmSize + 0.02, mfmSize + 0.02, 0.024, materials.black, 0, doorH * 0.24, frontZ + 0.012));
      doorLeaf.add(
        planeDecal(mfmSize, mfmSize, createDigitalMfmTexture(`FEEDER ${b}`, "414.8", "840"), 0, doorH * 0.24, frontZ + 0.025, true)
      );
      // Breaker ON / OFF indicator lamps
      addPilotLamps(doorLeaf, lamps, -0.09, doorH * 0.24 - 0.18, frontZ + 0.012, 0.09);
    } else {
      // MOTOR / FEEDER BAY: Rotary Operating Handle (ROH) with Padlocking Collar
      addRotaryHandle(doorLeaf, materials, 0, doorH * 0.14, frontZ);
      addPilotLamps(doorLeaf, lamps, -0.09, doorH * 0.24, frontZ + 0.012, 0.09);
    }

    // C. Official Bilingual DANGER 415V Notice Plate
    doorLeaf.add(
      planeDecal(0.2, 0.1, createDangerPlateTexture(), -doorW / 2 + 0.15, doorH * 0.38, frontZ + 0.002)
    );

    // D. Ventilation Louver Vent with internal dust-mesh
    doorLeaf.add(
      planeDecal(doorW * 0.65, 0.14, createLouverVentTexture(), 0, -doorH / 2 + 0.14, frontZ + 0.002)
    );

    // E. Heavy Industrial Door Handle & Lock Mechanism
    // Quarter-turn DIN double-bit cam locks (top and bottom)
    addDoorLock(doorLeaf, materials, doorW / 2 - 0.065, doorH * 0.38, frontZ);
    addDoorLock(doorLeaf, materials, doorW / 2 - 0.065, -doorH * 0.38, frontZ);

    // Center ergonomic door handle
    doorLeaf.add(boxMesh(0.038, 0.24, 0.034, materials.black, doorW / 2 - 0.065, 0, frontZ + 0.017));
    doorLeaf.add(boxMesh(0.048, 0.05, 0.038, materials.orange, doorW / 2 - 0.065, 0.14, frontZ + 0.019));

    // F. Heavy-Duty Lift-Off Hinges on door left edge
    addDoorHinge(doorLeaf, materials, -doorW / 2 + 0.008, doorH * 0.36, frontZ);
    addDoorHinge(doorLeaf, materials, -doorW / 2 + 0.008, -doorH * 0.36, frontZ);

    hingeGroup.add(doorLeaf);
    root.add(hingeGroup);
    doors.push(hingeGroup);
  }

  root.add(interior);

  // Normalize and center
  const bbox = new THREE.Box3().setFromObject(root);
  const size = bbox.getSize(new THREE.Vector3());
  const center = bbox.getCenter(new THREE.Vector3());
  root.position.set(-center.x, -bbox.min.y, -center.z);

  const container = new THREE.Group();
  container.add(root);

  return {
    group: container,
    doors,
    interior,
    lamps,
    size,
    dispose: () => {
      container.traverse((obj: any) => {
        if (obj.geometry) obj.geometry.dispose();
        if (obj.material) {
          const mats = Array.isArray(obj.material) ? obj.material : [obj.material];
          mats.forEach((m) => {
            if (m.map) m.map.dispose();
            if (m.emissiveMap) m.emissiveMap.dispose();
            m.dispose();
          });
        }
      });
    },
  };
}

// ============================================================================
// React Component Props & Definition
// ============================================================================
export interface InteractivePanel3DProps {
  model?: any;
  code?: string;
  className?: string;
  interactive?: boolean;
  autoRotate?: boolean;
  stateRef?: React.MutableRefObject<{ open: number; explode: number; spin: number }>;
  label?: string;
}

export default function InteractivePanel3D({
  model = { form: "floor", bays: 5, finish: "light", interior: "acb", meters: 3 },
  code = "PCC",
  className = "",
  interactive = false,
  autoRotate = false,
  stateRef,
  label = "3D model of an industrial electrical panel",
}: InteractivePanel3DProps) {
  const mountRef = useRef<HTMLDivElement>(null);
  const defaultState = useRef({ open: 0, explode: 0, spin: 0 });
  const animState = stateRef || defaultState;

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;

    const isMobile = window.innerWidth < 768;
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    let renderer: THREE.WebGLRenderer;
    try {
      renderer = new THREE.WebGLRenderer({
        alpha: true,
        antialias: !isMobile,
        powerPreference: isMobile ? "default" : "high-performance",
      });
    } catch {
      return;
    }

    // Performance-optimized pixel ratio (ensures instant 60fps on mobile & laptop)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, isMobile ? 1.35 : 1.75));
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.12;
    renderer.shadowMap.enabled = !isMobile;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;

    const domElement = renderer.domElement;
    domElement.style.width = "100%";
    domElement.style.height = "100%";
    domElement.style.display = "block";
    mount.appendChild(domElement);

    const scene = new THREE.Scene();

    // Environment Lighting (RoomEnvironment gives ultra-realistic metal reflections)
    const pmremGenerator = new THREE.PMREMGenerator(renderer);
    const envTexture = pmremGenerator.fromScene(new RoomEnvironment(), 0.04).texture;
    scene.environment = envTexture;

    const camera = new THREE.PerspectiveCamera(30, 1, 0.1, 100);
    const targetLookAt = new THREE.Vector3(0, 1.25, 0);
    const viewDir = new THREE.Vector3(0, 0.15, 1).normalize();

    // -------------------------------------------------------------
    // Industrial Switchgear Studio Lighting
    // -------------------------------------------------------------
    // Hemisphere ambient light (cool daylight above, warm floor bounce)
    scene.add(new THREE.HemisphereLight("#e2e8f0", "#0a0f18", 0.7));

    // High Key Directional Light (Simulates switchboard workshop high-bay LED)
    const keyLight = new THREE.DirectionalLight("#ffffff", 2.6);
    keyLight.position.set(5, 8, 6.5);
    keyLight.castShadow = !isMobile;
    keyLight.shadow.mapSize.set(1024, 1024);
    keyLight.shadow.bias = -0.0004;
    scene.add(keyLight);

    // Warm Industrial Orange Accent Rim Light
    const orangeRim = new THREE.PointLight("#ef6b25", 22, 16, 1.5);
    orangeRim.position.set(-4, 3, -1.8);
    scene.add(orangeRim);

    // Cool High-Bay Blue Backlight
    const blueRim = new THREE.PointLight("#38bdf8", 12, 14, 1.6);
    blueRim.position.set(4, 1.5, 3);
    scene.add(blueRim);

    // Ground Contact Shadow
    const shadowPlane = new THREE.Mesh(
      new THREE.PlaneGeometry(1, 1),
      new THREE.MeshBasicMaterial({ map: createShadowTexture(), transparent: true, depthWrite: false })
    );
    shadowPlane.rotation.x = -Math.PI / 2;
    shadowPlane.position.y = 0.002;
    scene.add(shadowPlane);

    // Glowing Orange Industrial Pedestal Ring
    const pedestalRing = new THREE.Mesh(
      new THREE.RingGeometry(0.98, 1.0, 96),
      new THREE.MeshBasicMaterial({ color: "#ef6b25", transparent: true, opacity: 0.55, side: THREE.DoubleSide })
    );
    pedestalRing.rotation.x = -Math.PI / 2;
    pedestalRing.position.y = 0.004;
    scene.add(pedestalRing);

    // Outer Precision Grid Ring
    const outerRing = new THREE.Mesh(
      new THREE.RingGeometry(1.18, 1.185, 96),
      new THREE.MeshBasicMaterial({ color: "#ffffff", transparent: true, opacity: 0.12, side: THREE.DoubleSide })
    );
    outerRing.rotation.x = -Math.PI / 2;
    outerRing.position.y = 0.004;
    scene.add(outerRing);

    // Floating Sparks / Ambient Energy Particles
    const particleCount = isMobile ? 25 : 65;
    const particlePositions = new Float32Array(particleCount * 3);
    for (let i = 0; i < particleCount; i += 1) {
      particlePositions[i * 3] = (Math.random() - 0.5) * 7.5;
      particlePositions[i * 3 + 1] = Math.random() * 4.2;
      particlePositions[i * 3 + 2] = (Math.random() - 0.5) * 5.5;
    }
    const particleGeo = new THREE.BufferGeometry();
    particleGeo.setAttribute("position", new THREE.BufferAttribute(particlePositions, 3));
    const particles = new THREE.Points(
      particleGeo,
      new THREE.PointsMaterial({ color: "#ef6b25", size: 0.024, transparent: true, opacity: 0.65, depthWrite: false })
    );
    scene.add(particles);

    // Root Pivot Group
    const pivot = new THREE.Group();
    pivot.rotation.y = -0.5;
    scene.add(pivot);

    let controls: OrbitControls | null = null;
    if (interactive) {
      controls = new OrbitControls(camera, domElement);
      controls.target.copy(targetLookAt);
      controls.enableDamping = true;
      controls.dampingFactor = 0.07;
      controls.enablePan = false;
      controls.enableZoom = false;
      controls.minPolarAngle = Math.PI * 0.22;
      controls.maxPolarAngle = Math.PI * 0.52;
      controls.rotateSpeed = 0.7;
      controls.autoRotate = autoRotate && !reducedMotion;
      controls.autoRotateSpeed = 0.8;
      domElement.style.touchAction = "pan-y";
      domElement.style.cursor = "grab";
      controls.update();
    }

    // Build the Photorealistic Model
    const panelInstance = buildPanelModel(model, code);
    pivot.add(panelInstance.group);

    const modelSize = panelInstance.size;
    const fovRad = THREE.MathUtils.degToRad(camera.fov);
    const fitFactor = 1.35;
    const distY = (modelSize.y * 0.5 * fitFactor) / Math.tan(fovRad / 2);
    const aspect = mount.clientWidth / (mount.clientHeight || 1);
    const distX = (Math.max(modelSize.x, modelSize.z) * 0.92 * 0.5 * fitFactor) / (Math.tan(fovRad / 2) * aspect);
    const cameraDist = Math.max(distY, distX) + modelSize.z * 0.6;
    targetLookAt.y = modelSize.y * 0.48;

    const ringScale = Math.max(modelSize.x, modelSize.z) * 0.72;
    pedestalRing.scale.set(ringScale, ringScale, ringScale);
    outerRing.scale.set(ringScale, ringScale, ringScale);
    shadowPlane.scale.set(modelSize.x * 1.6, modelSize.z * 2.4, 1);

    camera.position.copy(targetLookAt).addScaledVector(viewDir, cameraDist);
    camera.lookAt(targetLookAt);
    if (controls) controls.target.copy(targetLookAt);

    // Parallax mouse tilt
    const pointer = new THREE.Vector2();
    const onPointerMove = (e: MouseEvent) => {
      const rect = mount.getBoundingClientRect();
      pointer.x = ((e.clientX - rect.left) / rect.width - 0.5) * 2;
      pointer.y = ((e.clientY - rect.top) / rect.height - 0.5) * 2;
    };
    if (!interactive) {
      window.addEventListener("pointermove", onPointerMove, { passive: true });
    }

    const onResize = () => {
      const { width, height } = mount.getBoundingClientRect();
      if (!width || !height) return;
      renderer.setSize(width, height, false);
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
    };
    const resizeObserver = new ResizeObserver(onResize);
    resizeObserver.observe(mount);
    onResize();

    // Battery / CPU Saver: Intersection Observer pauses animation loop when offscreen
    let isVisible = true;
    const intersectionObserver = new IntersectionObserver(
      ([entry]) => {
        isVisible = entry.isIntersecting;
      },
      { rootMargin: "150px" }
    );
    intersectionObserver.observe(mount);

    let animFrame = 0;
    const clock = new THREE.Clock();

    const animate = () => {
      animFrame = requestAnimationFrame(animate);
      if (!isVisible || document.hidden) return;

      const elapsed = clock.getElapsedTime();
      const st = animState.current;

      // Animate hinged doors when scrolled
      panelInstance.doors.forEach((door, idx) => {
        const openAmt = Math.min(1, Math.max(0, (st.open || 0) * 1.25 - idx * 0.06));
        door.rotation.y = -openAmt * 1.85;
      });

      // Animate interior slide-out explode
      panelInstance.interior.position.z = (st.explode || 0) * panelInstance.size.z * 0.7;

      // Subtle realistic pilot lamp pulse
      panelInstance.lamps.forEach((lamp, idx) => {
        lamp.emissiveIntensity = 1.3 + Math.sin(elapsed * 3 + idx * 1.3) * 0.4;
      });

      if (!reducedMotion) {
        pivot.position.y = Math.sin(elapsed * 0.9) * 0.025;
        particles.rotation.y = elapsed * 0.03;
        pedestalRing.material.opacity = 0.4 + Math.sin(elapsed * 2) * 0.15;
      }

      if (controls) {
        pivot.rotation.y = -0.5 + (st.spin || 0);
        controls.target.lerp(targetLookAt, 0.1);
        controls.update();
      } else {
        const mouseX = reducedMotion ? 0 : pointer.x;
        const mouseY = reducedMotion ? 0 : pointer.y;
        pivot.rotation.y += (-0.5 + (st.spin || 0) + mouseX * 0.28 - pivot.rotation.y) * 0.05;
        pivot.rotation.x += (mouseY * 0.04 - pivot.rotation.x) * 0.05;
      }

      renderer.render(scene, camera);
    };
    animate();

    return () => {
      cancelAnimationFrame(animFrame);
      resizeObserver.disconnect();
      intersectionObserver.disconnect();
      if (!interactive) {
        window.removeEventListener("pointermove", onPointerMove);
      }
      controls?.dispose();
      panelInstance.dispose();
      pmremGenerator.dispose();
      envTexture.dispose();
      shadowPlane.geometry.dispose();
      shadowPlane.material.dispose();
      pedestalRing.geometry.dispose();
      pedestalRing.material.dispose();
      outerRing.geometry.dispose();
      outerRing.material.dispose();
      particleGeo.dispose();
      particles.material.dispose();
      renderer.dispose();
      domElement.remove();
    };
  }, [model, code, interactive, autoRotate]);

  return (
    <div
      ref={mountRef}
      className={`relative h-full w-full ${className}`}
      role="img"
      aria-label={label}
    />
  );
}
