/* eslint-disable no-use-before-define */
(function () {
  "use strict";

  const $ = (sel, root = document) => root.querySelector(sel);
  const $$ = (sel, root = document) => Array.from(root.querySelectorAll(sel));

  /**
   * Smoothly scroll to the shared lead form.
   * Works across all pages because `id="lead-form"` is consistent.
   */
  function scrollToLeadForm() {
    const leadForm = $("#lead-form");
    if (!leadForm) return;
    leadForm.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  // -------------------------
  // Mobile nav toggle
  // -------------------------
  const navToggle = $("#nav-toggle");
  const siteNav = $("#site-nav");
  if (navToggle && siteNav) {
    navToggle.addEventListener("click", () => {
      const isOpen = siteNav.classList.toggle("is-open");
      navToggle.setAttribute("aria-expanded", String(isOpen));
    });

    // Close nav when a link is clicked (mobile UX).
    $$(".site-nav__link, .site-nav__cta", siteNav).forEach((a) => {
      a.addEventListener("click", () => {
        if (window.innerWidth <= 720) {
          siteNav.classList.remove("is-open");
          navToggle.setAttribute("aria-expanded", "false");
        }
      });
    });
  }

  // -------------------------
  // CTA scroll handling
  // -------------------------
  $$(".cta-scroll").forEach((cta) => {
    cta.addEventListener("click", (e) => {
      const targetId = cta.getAttribute("data-scroll-target") || "lead-form";
      const targetEl = document.getElementById(targetId);
      if (!targetEl) return;

      e.preventDefault();
      targetEl.scrollIntoView({ behavior: "smooth", block: "start" });

      // Close mobile nav if open.
      if (siteNav && siteNav.classList.contains("is-open")) {
        siteNav.classList.remove("is-open");
        if (navToggle) navToggle.setAttribute("aria-expanded", "false");
      }
    });
  });

  // -------------------------
  // Reveal on scroll
  // -------------------------
  const revealEls = $$(".reveal");
  if (revealEls.length) {
    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            io.unobserve(entry.target);
          }
        }
      },
      { threshold: 0.14 }
    );

    revealEls.forEach((el) => io.observe(el));
  }

  // -------------------------
  // Lead form validation
  // -------------------------
  const leadForm = $("#lead-form");
  if (leadForm) {
    const nameInput = $("#lead-name", leadForm);
    const phoneInput = $("#lead-phone", leadForm);
    const emailInput = $("#lead-email", leadForm);

    const errorFor = (key) => $('[data-error-for="' + key + '"]', leadForm);
    const successBox = $(".form-success", leadForm);
    const submitBtn = leadForm.querySelector('button[type="submit"]');

    function setError(key, message) {
      const errorEl = errorFor(key);
      if (!errorEl) return;
      errorEl.textContent = message;
      errorEl.classList.add("is-visible");
    }

    function clearErrors() {
      ["name", "phone", "email"].forEach((k) => {
        const errorEl = errorFor(k);
        if (!errorEl) return;
        errorEl.textContent = "";
        errorEl.classList.remove("is-visible");
      });
    }

    function isValidName(v) {
      const val = String(v || "").trim();
      return val.length >= 2;
    }

    function isValidPhone(v) {
      const val = String(v || "").trim();
      // Vietnamese phone rough check: at least 8 digits.
      const digits = val.replace(/\D/g, "");
      return digits.length >= 8;
    }

    function isValidEmail(v) {
      const val = String(v || "").trim();
      // Simple, practical email regex.
      return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/i.test(val);
    }

    function getValues() {
      return {
        name: nameInput ? nameInput.value : "",
        phone: phoneInput ? phoneInput.value : "",
        email: emailInput ? emailInput.value : "",
      };
    }

    leadForm.addEventListener("submit", (e) => {
      e.preventDefault();
      clearErrors();

      const { name, phone, email } = getValues();
      let ok = true;

      if (!isValidName(name)) {
        setError("name", "Vui lòng nhập họ & tên (tối thiểu 2 ký tự).");
        ok = false;
      }

      if (!isValidPhone(phone)) {
        setError("phone", "Vui lòng nhập số điện thoại hợp lệ (ít nhất 8 chữ số).");
        ok = false;
      }

      if (!isValidEmail(email)) {
        setError("email", "Vui lòng nhập email hợp lệ (ví dụ: ten@domain.com).");
        ok = false;
      }

      if (!ok) return;

      // Success UI (no backend).
      if (submitBtn) submitBtn.disabled = true;
      if (successBox) successBox.hidden = false;

      // Clear inputs after showing success.
      if (nameInput) nameInput.value = "";
      if (phoneInput) phoneInput.value = "";
      if (emailInput) emailInput.value = "";

      // Optional: scroll success box into view for mobile.
      successBox?.scrollIntoView({ behavior: "smooth", block: "nearest" });
    });

    // Live validation (lightweight, avoids being noisy).
    [nameInput, phoneInput, emailInput].forEach((input) => {
      if (!input) return;
      input.addEventListener("input", () => {
        const id = input.getAttribute("name") || input.id || "";
        const key = id === "name" || input.id === "lead-name" ? "name" : id === "phone" || input.id === "lead-phone" ? "phone" : "email";
        if (!successBox || successBox.hidden) return;

        // If user edits again after success, hide the success box.
        if (successBox) successBox.hidden = true;
        clearErrors();

        if (key === "name" && isValidName(input.value)) clearErrors();
        if (key === "phone" && isValidPhone(input.value)) clearErrors();
        if (key === "email" && isValidEmail(input.value)) clearErrors();
      });
    });
  }

  // -------------------------
  // Chat UI (UI only)
  // -------------------------
  const chatPanel = $("#chat-panel");
  const chatClose = $("#chat-close");
  const chatMessenger = $("#chat-messenger");
  const chatZalo = $("#chat-zalo");
  const chatCta = $("#chat-cta");

  function openChat(origin) {
    if (!chatPanel) return;
    chatPanel.hidden = false;

    const body = $(".chat-panel__body", chatPanel);
    if (body) {
      // Replace the first chip with context of which button user clicked.
      const chips = $$(".chat-chip", body);
      if (chips[0]) {
        chips[0].textContent =
          origin === "zalo"
            ? "Demo Zalo: Nhận tư vấn khóa phù hợp"
            : "Demo Messenger: Tư vấn nhanh khóa phù hợp";
      }
    }
  }

  function closeChat() {
    if (!chatPanel) return;
    chatPanel.hidden = true;
  }

  if (chatMessenger) {
    chatMessenger.addEventListener("click", () => openChat("messenger"));
  }
  if (chatZalo) {
    chatZalo.addEventListener("click", () => openChat("zalo"));
  }
  if (chatClose) {
    chatClose.addEventListener("click", closeChat);
  }

  if (chatCta) {
    chatCta.addEventListener("click", () => {
      closeChat();
      scrollToLeadForm();
    });
  }
})();

