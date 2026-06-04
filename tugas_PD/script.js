/**
 * SKARISA ENTERTAINMENT – script.js
 * Semua logika JavaScript: Cursor, Particles, Navbar,
 * Counter, Members, Slider, Absensi, Google Sheets
 */

"use strict";

/* ══════════════════════════════════════════════════════════════
   ① GOOGLE APPS SCRIPT URL (GANTI DENGAN URL ANDA)
   ══════════════════════════════════════════════════════════════ */
const SCRIPT_URL =
  "https://script.google.com/macros/s/AKfycbz33yOmXFi-bndhn6vnvagsNeeEOAqXnFKpzlcx5-5Ra8y8ncxouaJbLoP7UESssUCFMw/exec";

/* ══════════════════════════════════════════════════════════════
   ② DATA ANGGOTA
   ══════════════════════════════════════════════════════════════ */
const MEMBERS = [
  "Alya Rahmawati",
  "Bima Saputra",
  "Citra Dewi",
  "Daffa Rizky",
  "Elisa Putri",
  "Fariz Maulana",
  "Gita Cantika",
  "Hendra Wijaya",
  "Indira Sari",
  "Jovan Pratama",
  "Karina Ningsih",
  "Lutfi Hakim",
  "Melisa Anggraini",
  "Naufal Hidayat",
  "Olivia Santoso",
  "Pramudya Yudha",
  "Qonita Azizah",
  "Rafi Kurniawan",
  "Sari Wulandari",
  "Tirta Adhitya",
  "Ulfa Ramadhani",
  "Vino Prasetyo",
  "Winda Lestari",
  "Xander Nugroho",
  "Yasmin Fadillah",
  "Zain Mahendra",
  "Aulia Permata",
  "Bagas Setiawan",
];

/* ══════════════════════════════════════════════════════════════
   ③ CUSTOM CURSOR
   ══════════════════════════════════════════════════════════════ */
function initCursor() {
  const cursor = document.getElementById("cursor");
  const cursorTrail = document.getElementById("cursorTrail");
  if (!cursor || !cursorTrail) return;

  let mouseX = 0,
    mouseY = 0;
  let trailX = 0,
    trailY = 0;

  document.addEventListener("mousemove", (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
    cursor.style.left = mouseX + "px";
    cursor.style.top = mouseY + "px";
  });

  function animateTrail() {
    trailX += (mouseX - trailX) * 0.12;
    trailY += (mouseY - trailY) * 0.12;
    cursorTrail.style.left = trailX + "px";
    cursorTrail.style.top = trailY + "px";
    requestAnimationFrame(animateTrail);
  }
  animateTrail();

  // Cursor grow on interactive elements
  const interactable =
    "a, button, .member-card, .admin-card, .leader-card, .status-option, .nav-link";
  document.querySelectorAll(interactable).forEach((el) => {
    el.addEventListener("mouseenter", () => {
      cursor.style.transform = "translate(-50%, -50%) scale(2)";
      cursor.style.opacity = "0.6";
      cursorTrail.style.transform = "translate(-50%, -50%) scale(1.5)";
    });
    el.addEventListener("mouseleave", () => {
      cursor.style.transform = "translate(-50%, -50%) scale(1)";
      cursor.style.opacity = "1";
      cursorTrail.style.transform = "translate(-50%, -50%) scale(1)";
    });
  });
}

/* ══════════════════════════════════════════════════════════════
   ④ PARTICLE CANVAS
   ══════════════════════════════════════════════════════════════ */
function initParticles() {
  const canvas = document.getElementById("particleCanvas");
  if (!canvas) return;
  const ctx = canvas.getContext("2d");

  let width, height;
  const particles = [];
  const PARTICLE_COUNT = 80;

  function resize() {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
  }

  class Particle {
    constructor() {
      this.reset();
    }

    reset() {
      this.x = Math.random() * width;
      this.y = Math.random() * height;
      this.size = Math.random() * 2 + 0.5;
      this.speedX = (Math.random() - 0.5) * 0.4;
      this.speedY = (Math.random() - 0.5) * 0.4;
      this.alpha = Math.random() * 0.5 + 0.1;
      this.color = Math.random() > 0.5 ? "0, 191, 255" : "138, 43, 226";
    }

    update() {
      this.x += this.speedX;
      this.y += this.speedY;
      if (this.x < 0 || this.x > width || this.y < 0 || this.y > height)
        this.reset();
    }

    draw() {
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(${this.color}, ${this.alpha})`;
      ctx.fill();
    }
  }

  for (let i = 0; i < PARTICLE_COUNT; i++) {
    particles.push(new Particle());
  }

  function drawConnections() {
    const THRESHOLD = 120;
    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const dx = particles[i].x - particles[j].x;
        const dy = particles[i].y - particles[j].y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < THRESHOLD) {
          const alpha = (1 - dist / THRESHOLD) * 0.15;
          ctx.beginPath();
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          ctx.strokeStyle = `rgba(0, 191, 255, ${alpha})`;
          ctx.lineWidth = 0.5;
          ctx.stroke();
        }
      }
    }
  }

  function animate() {
    ctx.clearRect(0, 0, width, height);
    particles.forEach((p) => {
      p.update();
      p.draw();
    });
    drawConnections();
    requestAnimationFrame(animate);
  }

  resize();
  animate();
  window.addEventListener("resize", resize);
}

/* ══════════════════════════════════════════════════════════════
   ⑤ NAVBAR – STICKY & MOBILE TOGGLE
   ══════════════════════════════════════════════════════════════ */
function initNavbar() {
  const navbar = document.getElementById("navbar");
  const toggle = document.getElementById("navToggle");
  const navLinks = document.getElementById("navLinks");
  const links = document.querySelectorAll(".nav-link");

  // Scroll effect
  window.addEventListener("scroll", () => {
    navbar.classList.toggle("scrolled", window.scrollY > 60);
  });

  // Mobile toggle
  if (toggle && navLinks) {
    toggle.addEventListener("click", () => {
      navLinks.classList.toggle("open");
    });

    // Close on link click
    links.forEach((link) => {
      link.addEventListener("click", () => navLinks.classList.remove("open"));
    });
  }

  // Active link on scroll
  const sections = document.querySelectorAll("section[id]");
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          links.forEach((l) => l.classList.remove("active"));
          const active = document.querySelector(
            `.nav-link[href="#${entry.target.id}"]`,
          );
          if (active) active.classList.add("active");
        }
      });
    },
    { threshold: 0.4 },
  );

  sections.forEach((sec) => observer.observe(sec));
}

/* ══════════════════════════════════════════════════════════════
   ⑥ COUNTER ANIMATION
   ══════════════════════════════════════════════════════════════ */
function animateCounter(el, target, duration = 2000) {
  let start = 0;
  const step = 16;
  const steps = duration / step;
  const increment = target / steps;

  const timer = setInterval(() => {
    start += increment;
    if (start >= target) {
      el.textContent = target;
      clearInterval(timer);
    } else {
      el.textContent = Math.floor(start);
    }
  }, step);
}

function initCounters() {
  const counters = document.querySelectorAll(".stat-num[data-target]");
  if (!counters.length) return;

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const el = entry.target;
          const target = parseInt(el.dataset.target, 10);
          animateCounter(el, target);
          observer.unobserve(el);
        }
      });
    },
    { threshold: 0.5 },
  );

  counters.forEach((c) => observer.observe(c));
}

/* ══════════════════════════════════════════════════════════════
   ⑦ USER ICON SVG
   ══════════════════════════════════════════════════════════════ */
function getUserIconSVG(colorA = "#00BFFF", colorB = "#8A2BE2", id = "u0") {
  return `<svg viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="20" cy="14" r="7" stroke="url(#${id})" stroke-width="1.8"/>
    <path d="M6 36c0-7.732 6.268-14 14-14s14 6.268 14 14" stroke="url(#${id})" stroke-width="1.8" stroke-linecap="round"/>
    <defs>
      <linearGradient id="${id}" x1="0" y1="0" x2="40" y2="40" gradientUnits="userSpaceOnUse">
        <stop stop-color="${colorA}"/>
        <stop offset="1" stop-color="${colorB}"/>
      </linearGradient>
    </defs>
  </svg>`;
}

/* ══════════════════════════════════════════════════════════════
   ⑧ RENDER MEMBER GRID
   ══════════════════════════════════════════════════════════════ */
function initMemberGrid() {
  const grid = document.getElementById("memberGrid");
  if (!grid) return;

  MEMBERS.forEach((name, i) => {
    const card = document.createElement("div");
    card.className = "member-card reveal";
    if (i % 3 === 1) card.classList.add("reveal-delay-1");
    if (i % 3 === 2) card.classList.add("reveal-delay-2");

    const num = String(i + 1).padStart(2, "0");
    card.innerHTML = `
      <span class="member-num">${num}</span>
      <div class="member-icon-wrap">
        ${getUserIconSVG("#00BFFF", "#8A2BE2", `mg${i}`)}
      </div>
      <p class="member-name">${name}</p>
    `;
    grid.appendChild(card);
  });

  initRevealObserver();
}

/* ══════════════════════════════════════════════════════════════
   ⑨ ANGGOTA SLIDER – OTOMATIS, INFINITE LOOP
   ══════════════════════════════════════════════════════════════ */
function initSlider() {
  const track = document.getElementById("sliderTrack");
  if (!track) return;

  // Build items (triple for seamless loop)
  const allMembers = [...MEMBERS, ...MEMBERS, ...MEMBERS];

  allMembers.forEach((name, i) => {
    const item = document.createElement("div");
    item.className = "slider-item";
    item.innerHTML = `
      <div class="slider-item-icon">
        ${getUserIconSVG("#00BFFF", "#8A2BE2", `sl${i}`)}
      </div>
      <span class="slider-item-name">${name}</span>
    `;
    track.appendChild(item);
  });

  // Pause on hover
  let paused = false;
  track.addEventListener("mouseenter", () => {
    paused = true;
  });
  track.addEventListener("mouseleave", () => {
    paused = false;
  });

  // Animation via requestAnimationFrame
  const SPEED = 0.6; // px per frame
  let currentX = 0;
  let singleSetWidth = 0;

  function measureWidth() {
    const items = track.querySelectorAll(".slider-item");
    if (!items.length) return;
    // Width of one full set (MEMBERS.length items)
    let w = 0;
    for (let i = 0; i < MEMBERS.length; i++) {
      const rect = items[i].getBoundingClientRect();
      w += rect.width;
      if (i < MEMBERS.length - 1) {
        const style = window.getComputedStyle(track);
        w += parseFloat(style.gap) || 16;
      }
    }
    singleSetWidth = w;
  }

  // Wait a frame for layout
  requestAnimationFrame(() => {
    measureWidth();

    function animate() {
      if (!paused && singleSetWidth > 0) {
        currentX -= SPEED;
        // Reset to start of second set for seamless loop
        if (Math.abs(currentX) >= singleSetWidth) {
          currentX = 0;
        }
        track.style.transform = `translateX(${currentX}px)`;
      }
      requestAnimationFrame(animate);
    }
    animate();
  });

  window.addEventListener("resize", measureWidth);

  // Dot animation cycle
  const dots = document.querySelectorAll(".slider-dot");
  let dotIdx = 0;
  setInterval(() => {
    dots.forEach((d) => d.classList.remove("active"));
    dotIdx = (dotIdx + 1) % dots.length;
    dots[dotIdx].classList.add("active");
  }, 1500);
}

/* ══════════════════════════════════════════════════════════════
   ⑩ REVEAL ON SCROLL
   ══════════════════════════════════════════════════════════════ */
function initRevealObserver() {
  const reveals = document.querySelectorAll(".reveal");
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("visible");
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.1 },
  );
  reveals.forEach((el) => observer.observe(el));
}

function addRevealClasses() {
  const targets = [
    ".leader-card",
    ".admin-card",
    ".section-header",
    ".form-card",
    ".slider-section",
  ];
  targets.forEach((sel, i) => {
    document.querySelectorAll(sel).forEach((el, j) => {
      el.classList.add("reveal");
      if ((i + j) % 3 === 1) el.classList.add("reveal-delay-1");
      if ((i + j) % 3 === 2) el.classList.add("reveal-delay-2");
    });
  });
}

/* ══════════════════════════════════════════════════════════════
   ⑪ REAL-TIME CLOCK
   ══════════════════════════════════════════════════════════════ */
function initClock() {
  const el = document.getElementById("formTime");
  if (!el) return;

  function update() {
    const now = new Date();
    const hh = String(now.getHours()).padStart(2, "0");
    const mm = String(now.getMinutes()).padStart(2, "0");
    const ss = String(now.getSeconds()).padStart(2, "0");
    el.textContent = `${hh}:${mm}:${ss}`;
  }

  update();
  setInterval(update, 1000);
}

/* ══════════════════════════════════════════════════════════════
   ⑫ STATUS OPTION INTERACTIVITY
   ══════════════════════════════════════════════════════════════ */
function initStatusOptions() {
  const options = document.querySelectorAll(".status-option");
  options.forEach((opt) => {
    opt.addEventListener("click", () => {
      options.forEach((o) => o.classList.remove("selected"));
      opt.classList.add("selected");
    });
  });
}

/* ══════════════════════════════════════════════════════════════
   ⑬ NOTIFICATION HELPER
   ══════════════════════════════════════════════════════════════ */
function showNotification({ type = "success", title = "", message = "" }) {
  const notif = document.getElementById("notification");
  const notifIcon = document.getElementById("notifIcon");
  const notifTitle = document.getElementById("notifTitle");
  const notifMsg = document.getElementById("notifMsg");
  if (!notif) return;

  notif.className = `notification ${type}`;
  notifIcon.textContent = type === "success" ? "✓" : "✕";
  notifTitle.textContent = title;
  notifMsg.textContent = message;

  // Show
  requestAnimationFrame(() => {
    requestAnimationFrame(() => notif.classList.add("show"));
  });

  // Auto hide after 4s
  const hideTimer = setTimeout(() => closeNotification(), 4000);

  // Close button
  const closeBtn = document.getElementById("notifClose");
  if (closeBtn) {
    closeBtn.onclick = () => {
      clearTimeout(hideTimer);
      closeNotification();
    };
  }

  function closeNotification() {
    notif.classList.remove("show");
  }
}

/* ══════════════════════════════════════════════════════════════
   ⑭ FORM ABSENSI + GOOGLE SHEETS INTEGRATION
   ══════════════════════════════════════════════════════════════ */
function initAbsensiForm() {
  const submitBtn = document.getElementById("submitBtn");
  const submitText = document.querySelector(".btn-submit-text");
  const submitLoader = document.getElementById("submitLoader");
  const submitIcon = document.querySelector(".btn-submit-icon");

  if (!submitBtn) return;

  submitBtn.addEventListener("click", async () => {
    // ── Collect values
    const nama = document.getElementById("nama")?.value.trim();
    const kelas = document.getElementById("kelas")?.value.trim();
    const status = document.querySelector(
      'input[name="status"]:checked',
    )?.value;

    // ── Validate
    if (!nama) {
      showNotification({
        type: "error",
        title: "VALIDASI GAGAL",
        message: "Mohon isi nama lengkap Anda.",
      });
      document.getElementById("nama")?.focus();
      return;
    }
    if (!kelas) {
      showNotification({
        type: "error",
        title: "VALIDASI GAGAL",
        message: "Mohon isi kelas Anda.",
      });
      document.getElementById("kelas")?.focus();
      return;
    }
    if (!status) {
      showNotification({
        type: "error",
        title: "VALIDASI GAGAL",
        message: "Mohon pilih status kehadiran.",
      });
      return;
    }

    // ── UI: loading state
    submitText.style.display = "none";
    submitLoader.style.display = "flex";
    if (submitIcon) submitIcon.style.display = "none";
    submitBtn.disabled = true;

    // ── Timestamp
    const now = new Date();
    const timestamp = now.toLocaleString("id-ID", {
      day: "2-digit",
      month: "long",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    });

    // ── Build payload
    const payload = { nama, kelas, status, timestamp };

    // ── Send to Google Apps Script
    try {
      if (!SCRIPT_URL || SCRIPT_URL === "PASTE_GOOGLE_APPS_SCRIPT_URL_HERE") {
        throw new Error("URL Google Apps Script belum dikonfigurasi.");
      }

      // Google Apps Script butuh request lewat URL params (JSONP-style)
      // karena doPost dengan mode cors perlu header khusus di Apps Script.
      // Cara paling reliable: kirim via fetch POST ke URL dengan ?method=POST
      // Google Apps Script: gunakan no-cors agar tidak diblokir browser
      // Data tetap terkirim meskipun response opaque
      await fetch(SCRIPT_URL, {
        method: "POST",
        mode: "no-cors",
        headers: { "Content-Type": "text/plain;charset=utf-8" },
        body: JSON.stringify(payload),
      });

      // no-cors = response opaque, asumsikan sukses jika tidak ada exception
      resetForm();
      showNotification({
        type: "success",
        title: "ABSENSI TERKIRIM ✓",
        message: `${nama} · ${kelas} · ${status} berhasil dicatat!`,
      });
    } catch (err) {
      console.error("Absensi error:", err);
      showNotification({
        type: "error",
        title: "PENGIRIMAN GAGAL",
        message:
          err.message ||
          "Terjadi kesalahan saat mengirim data. Periksa koneksi dan URL.",
      });
    } finally {
      // ── UI: restore button
      submitText.style.display = "inline";
      submitLoader.style.display = "none";
      if (submitIcon) submitIcon.style.display = "block";
      submitBtn.disabled = false;
    }
  });

  function resetForm() {
    document.getElementById("nama").value = "";
    document.getElementById("kelas").value = "";
    const checked = document.querySelector('input[name="status"]:checked');
    if (checked) checked.checked = false;
    document
      .querySelectorAll(".status-option")
      .forEach((o) => o.classList.remove("selected"));
  }
}

/* ══════════════════════════════════════════════════════════════
   ⑮ NEON HOVER RIPPLE ON CARDS
   ══════════════════════════════════════════════════════════════ */
function initCardRipple() {
  const cards = document.querySelectorAll(".glass-card, .member-card");
  cards.forEach((card) => {
    card.addEventListener("mousemove", (e) => {
      const rect = card.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width) * 100;
      const y = ((e.clientY - rect.top) / rect.height) * 100;
      card.style.setProperty("--mx", `${x}%`);
      card.style.setProperty("--my", `${y}%`);
    });
  });
}

/* ══════════════════════════════════════════════════════════════
   ⑯ INIT ALL
   ══════════════════════════════════════════════════════════════ */
document.addEventListener("DOMContentLoaded", () => {
  initCursor();
  initParticles();
  initNavbar();
  initCounters();
  addRevealClasses();
  initRevealObserver();
  initMemberGrid();
  initSlider();
  initClock();
  initStatusOptions();
  initAbsensiForm();
  initCardRipple();

  console.log(
    "%c SKARISA ENTERTAINMENT ",
    "background: linear-gradient(135deg, #00BFFF, #8A2BE2); color: white; font-size: 14px; font-weight: bold; padding: 8px 16px; border-radius: 4px;",
  );
  console.log(
    "%c Photography & Broadcasting Extracurricular",
    "color: #00BFFF; font-size: 12px;",
  );
  console.log(
    "%c © 2026 SKARISA Entertainment",
    "color: #8A2BE2; font-size: 11px;",
  );
});
