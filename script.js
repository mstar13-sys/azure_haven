const $ = (selector, root = document) => root.querySelector(selector);
const $$ = (selector, root = document) => [...root.querySelectorAll(selector)];

const roomCatalog = [
  {
    id: "ocean-view-suite",
    name: "Ocean View Suite",
    description: "Wake to wide ocean views in a calm, light-filled suite with a private balcony and handcrafted details.",
    maxGuests: 2,
    size: 45,
    price: 6500,
    image: "https://images.unsplash.com/photo-1777017246552-8b0e36b92d52?auto=format&fit=crop&w=900&q=80",
    amenities: ["King bed", "Ocean view", "Rainfall shower", "Private balcony"],
  },
  {
    id: "tropical-garden-villa",
    name: "Tropical Garden Villa",
    description: "A spacious hideaway wrapped in private tropical greenery, with generous indoor and outdoor living.",
    maxGuests: 4,
    size: 65,
    price: 8500,
    image: "https://images.unsplash.com/photo-1661069540645-fda115a217ae?auto=format&fit=crop&w=900&q=80",
    amenities: ["Two queen beds", "Private garden", "Outdoor lounge", "Large bath"],
  },
  {
    id: "private-pool-villa",
    name: "Private Pool Villa",
    description: "Our signature ocean-facing villa pairs a private pool with a spacious deck and slow mornings.",
    maxGuests: 4,
    size: 85,
    price: 12500,
    image: "https://images.unsplash.com/photo-1774280960001-ce8169cfc38f?auto=format&fit=crop&w=900&q=80",
    amenities: ["King bed", "Private pool", "Oceanfront deck", "Premium bath"],
  },
];

const infoCatalog = {
  story: {
    eyebrow: "Our story",
    title: "A slower way to experience the island",
    copy: "Azure Haven is an imagined Palawan retreat designed around unhurried days: ocean views, tropical gardens, thoughtful spaces, and warm island hospitality. Explore the villas, discover experiences, then create a sample stay in the demo booking flow.",
  },
  island: {
    eyebrow: "Island day",
    title: "Island Hopping",
    copy: "Spend the day exploring quiet coves, limestone scenery, and clear lagoons with a local guide. Ask the resort team to help shape a day that suits your pace.",
  },
  cruise: {
    eyebrow: "Golden hour",
    title: "Sunset Cruise",
    copy: "Leave the shoreline behind for an easy evening on the water, timed to the colors of sunset. The perfect start to a special night on the island.",
  },
  snorkeling: {
    eyebrow: "Underwater discovery",
    title: "Snorkeling",
    copy: "Drift above coral gardens and discover the life beneath Palawan's turquoise water. Beginner-friendly guidance makes it easy to get started.",
  },
  spa: {
    eyebrow: "Wellness",
    title: "Spa & Wellness",
    copy: "Ease into an afternoon of restorative rituals, gentle movement, and quiet time. Our imagined spa menu is inspired by the island's natural calm.",
  },
  dinner: {
    eyebrow: "Romance",
    title: "Romantic Dinner",
    copy: "Share an intimate evening by the shore with candlelight, coastal flavors, and the sound of the sea. A memorable way to mark an occasion.",
  },
  kayaking: {
    eyebrow: "Adventure",
    title: "Kayaking",
    copy: "Paddle along calm coastline and sheltered inlets at your own pace. Early mornings offer especially peaceful views across the water.",
  },
  faqs: {
    eyebrow: "Good to know",
    title: "Frequently Asked Questions",
    copy: "Is this a real resort? No. Azure Haven Resort is a fictional portfolio concept. Can I make a real reservation? The booking journey is interactive, but it creates a sample confirmation only. Will I be charged? No payment information is requested or processed.",
  },
  terms: {
    eyebrow: "Demo information",
    title: "Terms & Conditions",
    copy: "This website is a portfolio demonstration. Room availability, rates, offers, guest reviews, contact details, and reservation references are illustrative. A demo confirmation does not reserve accommodation or create a payment obligation.",
  },
  privacy: {
    eyebrow: "Demo information",
    title: "Privacy Policy",
    copy: "This local demonstration does not send booking or newsletter form information to a server. Form values are used in your browser to show a sample reservation and are cleared when the page is refreshed.",
  },
};

const state = {
  step: 1,
  checkin: "",
  checkout: "",
  guests: 2,
  rooms: 1,
  selectedRoom: null,
  offer: false,
  guest: {},
  reference: "",
};

const money = (amount) => `₱${Math.round(amount).toLocaleString("en-PH")}`;
const isoDate = (date) => `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
const addDays = (value, days) => {
  const [year, month, day] = value.split("-").map(Number);
  const date = new Date(year, month - 1, day);
  date.setDate(date.getDate() + days);
  return isoDate(date);
};
const today = () => isoDate(new Date());
const displayDate = (value) => value
  ? new Intl.DateTimeFormat("en-US", { month: "short", day: "numeric", year: "numeric" }).format(new Date(`${value}T12:00:00`))
  : "—";
const nightsBetween = (start, end) => {
  if (!start || !end) return 0;
  const a = Date.UTC(...start.split("-").map((part, index) => Number(part) - (index === 1 ? 1 : 0)));
  const b = Date.UTC(...end.split("-").map((part, index) => Number(part) - (index === 1 ? 1 : 0)));
  return Math.max(0, Math.round((b - a) / 86400000));
};
const roomFits = (room) => room.maxGuests * state.rooms >= state.guests;
const selectedRoom = () => roomCatalog.find((room) => room.id === state.selectedRoom);

function toast(message, type = "success") {
  const item = document.createElement("div");
  item.className = `toast ${type}`;
  item.textContent = message;
  $("#toastContainer").append(item);
  setTimeout(() => item.remove(), 3500);
}

function syncDateLimits() {
  const minimum = today();
  ["#checkinDate", "#modalCheckin"].forEach((selector) => { $(selector).min = minimum; });
  $("#checkoutDate").min = addDays($("#checkinDate").value || minimum, 1);
  $("#modalCheckout").min = addDays($("#modalCheckin").value || minimum, 1);
}

function validateDates(start, end) {
  if (!start || !end) return "Please choose check-in and check-out dates.";
  if (start < today()) return "Check-in cannot be in the past.";
  if (nightsBetween(start, end) < 1) return "Check-out must be after check-in.";
  return "";
}

function setInitialDates() {
  const checkin = addDays(today(), 7);
  const checkout = addDays(checkin, 4);
  state.checkin = checkin;
  state.checkout = checkout;
  $("#checkinDate").value = checkin;
  $("#checkoutDate").value = checkout;
  $("#modalCheckin").value = checkin;
  $("#modalCheckout").value = checkout;
  syncDateLimits();
  updateNightCount();
}

function readSearch() {
  state.checkin = $("#checkinDate").value;
  state.checkout = $("#checkoutDate").value;
  state.guests = Number($("#guestCount").value);
  state.rooms = Number($("#roomCount").value);
}

function readStay() {
  state.checkin = $("#modalCheckin").value;
  state.checkout = $("#modalCheckout").value;
  state.guests = Number($("#modalGuests").value);
  state.rooms = Number($("#modalRooms").value);
  updateNightCount();
}

function fillStayForm() {
  $("#modalCheckin").value = state.checkin;
  $("#modalCheckout").value = state.checkout;
  $("#modalGuests").value = String(state.guests);
  $("#modalRooms").value = String(state.rooms);
  syncDateLimits();
  updateNightCount();
}

function updateNightCount() {
  const nights = nightsBetween($("#modalCheckin").value, $("#modalCheckout").value);
  $("#stayNightCount").textContent = `${nights} night${nights === 1 ? "" : "s"}`;
  $("#guestEstimateNote").hidden = $("#modalGuests").value !== "5";
}

function showResults() {
  const available = roomCatalog.filter(roomFits);
  const nights = nightsBetween(state.checkin, state.checkout);
  $("#resultsMeta").textContent = `${displayDate(state.checkin)} – ${displayDate(state.checkout)} · ${state.rooms} room${state.rooms === 1 ? "" : "s"}${state.guests === 5 ? " · 5+ guests estimated for five" : ` · ${state.guests} guest${state.guests === 1 ? "" : "s"}`}`;
  $("#searchResults").innerHTML = available.length
    ? available.map((room) => `
      <article class="room-card result-card">
        <div class="room-image-wrap"><img src="${room.image}" alt="${room.name}" loading="lazy"></div>
        <div class="room-body">
          <h3>${room.name}</h3>
          <p class="room-description">${room.description}</p>
          <div class="room-meta"><span><i class="fa-solid fa-user"></i> Up to ${room.maxGuests} per room</span><span><i class="fa-solid fa-ruler-combined"></i> ${room.size} m²</span></div>
          <div class="room-price">${money(room.price)} / room / night<br><small>${money(room.price * state.rooms * nights)} for ${state.rooms} room${state.rooms > 1 ? "s" : ""} · ${nights} night${nights > 1 ? "s" : ""}, before fees</small></div>
          <button type="button" class="btn btn-primary" data-book-room="${room.id}">Book This Stay</button>
        </div>
      </article>`).join("")
    : `<div class="no-results"><h3>Let's find the right fit</h3><p>For ${state.guests === 5 ? "5+" : state.guests} guests, increase the number of rooms to see sample stays.</p><button type="button" class="btn btn-primary" data-focus-search>Adjust your search</button></div>`;
  $("#availability").classList.add("is-shown", "visible");
  $("#availability").scrollIntoView({ behavior: "smooth", block: "start" });
}

function openOverlay(overlay, trigger) {
  overlay._returnFocus = trigger || document.activeElement;
  overlay.classList.add("is-open");
  overlay.setAttribute("aria-hidden", "false");
  document.body.classList.add("modal-open");
  $(".modal-close", overlay)?.focus();
}

function closeOverlay(overlay) {
  overlay.classList.remove("is-open");
  overlay.setAttribute("aria-hidden", "true");
  if (!$$(".modal.is-open, .lightbox.is-open").length) document.body.classList.remove("modal-open");
  overlay._returnFocus?.focus?.();
}

function renderRooms() {
  const available = roomCatalog.filter(roomFits);
  if (!available.some((room) => room.id === state.selectedRoom)) state.selectedRoom = null;
  $("#bookingRoomOptions").innerHTML = available.length
    ? available.map((room) => {
      const active = state.selectedRoom === room.id;
      return `<button type="button" class="booking-room-option ${active ? "selected" : ""}" data-select-room="${room.id}" aria-pressed="${active}">
        <img src="${room.image}" alt="" loading="lazy">
        <span class="room-option-body">
          <strong class="room-option-title">${room.name}</strong>
          <span class="room-option-description">${room.description}</span>
          <span class="room-option-meta"><span>Up to ${room.maxGuests} guests / room</span><span>${room.size} m²</span>${room.amenities.map((amenity) => `<span>${amenity}</span>`).join("")}</span>
          <span class="room-option-price"><span>${money(room.price)} / room / night</span><span>${money(room.price * state.rooms * nightsBetween(state.checkin, state.checkout))} stay</span></span>
        </span>
      </button>`;
    }).join("")
    : `<div class="no-results"><p>No single room type fits this group with ${state.rooms} room. Add another room to continue.</p></div>`;
}

function showStep(step) {
  state.step = step;
  $$(".booking-step").forEach((panel) => panel.classList.toggle("active", Number(panel.dataset.step) === step));
  $$(".progress-step").forEach((item, index) => item.classList.toggle("active", index < step && step < 5));
  $(".booking-back").classList.toggle("visible", step > 1 && step < 5);
  $(".booking-next").classList.toggle("visible", step < 4);
  $(".booking-confirm").classList.toggle("visible", step === 4);
  $(".booking-home").classList.toggle("visible", step === 5);
  $(".booking-view").classList.toggle("visible", step === 5);
  $(".modal-dialog", $("#bookingModal")).scrollTop = 0;
}

function openBooking(trigger, roomId = null, offer = false) {
  readSearch();
  state.selectedRoom = roomId;
  state.offer = offer;
  state.reference = "";
  fillStayForm();
  renderRooms();
  showStep(1);
  openOverlay($("#bookingModal"), trigger);
  if (offer) toast("Extended stay offer applies to stays of 3 nights or more.");
}

function calculateTotal() {
  const room = selectedRoom();
  const nights = nightsBetween(state.checkin, state.checkout);
  const base = room.price * state.rooms * nights;
  const discount = state.offer && nights >= 3 ? Math.round(base * 0.2) : 0;
  const fees = Math.round((base - discount) * 0.11);
  return { room, nights, base, discount, fees, total: base - discount + fees };
}

function updateSummary() {
  const { room, nights, base, discount, fees, total } = calculateTotal();
  $("#summaryRoom").textContent = room.name;
  $("#summaryCheckin").textContent = displayDate(state.checkin);
  $("#summaryCheckout").textContent = displayDate(state.checkout);
  $("#summaryGuests").textContent = state.guests === 5 ? "5+ guests (estimate for five)" : `${state.guests} guest${state.guests === 1 ? "" : "s"}`;
  $("#summaryRooms").textContent = `${state.rooms} room${state.rooms === 1 ? "" : "s"}`;
  $("#summaryNights").textContent = `${nights} night${nights === 1 ? "" : "s"}`;
  $("#summaryRoomPriceLabel").textContent = `Room price (${state.rooms} × ${nights} nights)`;
  $("#summaryRoomPrice").textContent = money(base);
  $("#summaryDiscountRow").hidden = !discount;
  $("#summaryDiscount").textContent = `−${money(discount)}`;
  $("#summaryTaxes").textContent = money(fees);
  $("#summaryTotal").textContent = money(total);
  $("#confirmationName").textContent = `${state.guest.firstName} ${state.guest.lastName}`;
  $("#confirmationCheckin").textContent = displayDate(state.checkin);
  $("#confirmationCheckout").textContent = displayDate(state.checkout);
  $("#confirmationRoom").textContent = room.name;
  $("#confirmationParty").textContent = `${state.rooms} room${state.rooms === 1 ? "" : "s"} · ${state.guests === 5 ? "5+ guests (estimate for five)" : `${state.guests} guest${state.guests === 1 ? "" : "s"}`}`;
  $("#confirmationTotal").textContent = money(total);
}

function validateGuest() {
  const fields = ["firstName", "lastName", "email", "phone", "country"];
  for (const id of fields) {
    const input = $(`#${id}`);
    input.value = input.value.trim();
    if (!input.value || !input.checkValidity() || (id === "phone" && input.value.replace(/\D/g, "").length < 7)) {
      toast(`Please enter a valid ${id.replace(/([A-Z])/g, " $1").toLowerCase()}.`, "error");
      input.focus();
      return false;
    }
  }
  state.guest = Object.fromEntries([...fields, "requests"].map((id) => [id, $(`#${id}`).value.trim()]));
  return true;
}

function nextStep() {
  if (state.step === 1) {
    readStay();
    const error = validateDates(state.checkin, state.checkout);
    if (error) return toast(error, "error");
    renderRooms();
    if (!$$("[data-select-room]").length) return toast("Increase the number of rooms for this group.", "error");
    showStep(2);
  } else if (state.step === 2) {
    if (!selectedRoom()) return toast("Please select a room to continue.", "error");
    showStep(3);
  } else if (state.step === 3 && validateGuest()) {
    updateSummary();
    showStep(4);
  }
}

function confirmBooking() {
  if (state.step !== 4 || !selectedRoom()) return;
  const button = $(".booking-confirm");
  button.disabled = true;
  button.classList.add("is-loading");
  setTimeout(() => {
    state.reference = `AHR-${new Date().getFullYear()}-${Math.floor(10000 + Math.random() * 90000)}`;
    $("#confirmationReference").textContent = state.reference;
    button.disabled = false;
    button.classList.remove("is-loading");
    showStep(5);
    toast("Demo reservation created.");
  }, 500);
}

function openInfo(key, trigger) {
  const data = infoCatalog[key] || roomCatalog.find((room) => room.id === key);
  if (!data) return;
  const isRoom = Boolean(data.id);
  $("#infoContent").innerHTML = `${isRoom ? `<img class="info-image" src="${data.image}" alt="${data.name}">` : ""}
    <p class="section-intro">${data.eyebrow || "Our villas"}</p>
    <h2 id="infoTitle">${data.title || data.name}</h2>
    <p>${data.copy || data.description}</p>
    ${isRoom ? `<div class="info-features"><span>Up to ${data.maxGuests} guests per room</span><span>${data.size} m²</span>${data.amenities.map((item) => `<span>${item}</span>`).join("")}</div><p class="info-price">From ${money(data.price)} / room / night</p><button type="button" class="btn btn-primary" data-info-book="${data.id}">Book this villa</button>` : ""}
    ${["island", "cruise", "snorkeling", "spa", "dinner", "kayaking"].includes(key) ? `<button type="button" class="btn btn-primary" data-info-plan>Plan a demo stay</button>` : ""}`;
  openOverlay($("#infoModal"), trigger);
}

function escapeHtml(value) {
  return String(value).replace(/[&<>"']/g, (character) => ({
    "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;",
  })[character]);
}

function viewReservation(trigger) {
  const { room, nights, discount, fees, total } = calculateTotal();
  $("#infoContent").innerHTML = `
    <p class="section-intro">Demo reservation · ${escapeHtml(state.reference)}</p>
    <h2 id="infoTitle">Your Stay at Azure Haven</h2>
    <p>Thank you, ${escapeHtml(state.guest.firstName)}. Here are the details of your sample reservation.</p>
    <div class="summary-list reservation-view">
      <div><span>Room</span><strong>${room.name}</strong></div>
      <div><span>Check-in</span><strong>${displayDate(state.checkin)}</strong></div>
      <div><span>Check-out</span><strong>${displayDate(state.checkout)}</strong></div>
      <div><span>Guests & rooms</span><strong>${state.guests === 5 ? "5+ guests (estimated for five)" : `${state.guests} guest${state.guests === 1 ? "" : "s"}`} · ${state.rooms} room${state.rooms === 1 ? "" : "s"}</strong></div>
      <div><span>Nights</span><strong>${nights}</strong></div>
      ${discount ? `<div><span>Extended stay offer</span><strong>−${money(discount)}</strong></div>` : ""}
      <div><span>Taxes & fees</span><strong>${money(fees)}</strong></div>
      <div class="summary-total"><span>Total</span><strong>${money(total)}</strong></div>
    </div>
    <p class="demo-note">This is a demo reservation. No actual booking or payment has been made.</p>`;
  openOverlay($("#infoModal"), trigger);
}

function openLightbox(image) {
  const overlay = $("#galleryLightbox");
  const large = $("img", overlay);
  large.src = image.src.replace(/w=900/, "w=1600");
  large.alt = image.alt;
  openOverlay(overlay, image);
  $(".lightbox-close").focus();
}

function initReveals() {
  if (!("IntersectionObserver" in window) || matchMedia("(prefers-reduced-motion: reduce)").matches) {
    $$(".reveal").forEach((element) => element.classList.add("visible"));
    return;
  }
  const observer = new IntersectionObserver((entries) => entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.classList.add("visible");
      observer.unobserve(entry.target);
    }
  }), { threshold: 0.08 });
  $$(".reveal").forEach((element) => observer.observe(element));
}

function updateChrome() {
  $(".site-header").classList.toggle("scrolled", window.scrollY > 35);
  $("#backToTop").classList.toggle("visible", window.scrollY > 500);
}

function closeMobileMenu() {
  $(".nav-menu").classList.remove("is-open");
  $(".nav-toggle").setAttribute("aria-expanded", "false");
  $(".nav-toggle").setAttribute("aria-label", "Open menu");
}

document.addEventListener("DOMContentLoaded", () => {
  setInitialDates();
  initReveals();
  updateChrome();
  window.addEventListener("scroll", updateChrome, { passive: true });

  $("#searchForm").addEventListener("submit", (event) => {
    event.preventDefault();
    readSearch();
    const error = validateDates(state.checkin, state.checkout);
    if (error) return toast(error, "error");
    const button = $(".search-btn");
    button.disabled = true;
    button.classList.add("is-loading");
    setTimeout(() => {
      button.disabled = false;
      button.classList.remove("is-loading");
      showResults();
      toast("Sample availability updated for your stay.");
    }, 350);
  });

  $("#newsletterForm").addEventListener("submit", (event) => {
    event.preventDefault();
    const input = $("#newsletterEmail");
    if (!input.checkValidity() || !input.value.trim()) {
      toast("Please enter a valid email address.", "error");
      input.focus();
      return;
    }
    input.value = "";
    toast("Demo only: no email was submitted.");
  });
  $("#guestForm").addEventListener("submit", (event) => {
    event.preventDefault();
    if (state.step === 3) nextStep();
  });

  ["#checkinDate", "#modalCheckin"].forEach((selector) => $(selector).addEventListener("change", () => {
    syncDateLimits();
    updateNightCount();
  }));
  $("#modalCheckout").addEventListener("change", updateNightCount);
  $("#modalGuests").addEventListener("change", updateNightCount);
  $(".nav-toggle").addEventListener("click", () => {
    const menu = $(".nav-menu");
    const expanded = menu.classList.toggle("is-open");
    $(".nav-toggle").setAttribute("aria-expanded", String(expanded));
    $(".nav-toggle").setAttribute("aria-label", expanded ? "Close menu" : "Open menu");
  });
  $$(".nav-menu a").forEach((link) => link.addEventListener("click", closeMobileMenu));
  $("#backToTop").addEventListener("click", () => window.scrollTo({ top: 0, behavior: "smooth" }));

  document.addEventListener("click", (event) => {
    const target = event.target;
    const booking = target.closest("[data-open-booking], [data-book-room], .room-book-btn");
    if (booking) {
      closeMobileMenu();
      openBooking(booking, booking.dataset.bookRoom || booking.dataset.roomId || null, booking.dataset.offer === "extended");
      return;
    }
    const details = target.closest(".room-details-btn");
    if (details) return openInfo(details.closest(".room-card").dataset.room, details);
    const info = target.closest("[data-info]");
    if (info) return openInfo(info.dataset.info, info);
    const select = target.closest("[data-select-room]");
    if (select) {
      state.selectedRoom = select.dataset.selectRoom;
      renderRooms();
      return;
    }
    const bookFromInfo = target.closest("[data-info-book], [data-info-plan]");
    if (bookFromInfo) {
      const returnFocus = $("#infoModal")._returnFocus || bookFromInfo;
      closeOverlay($("#infoModal"));
      openBooking(returnFocus, bookFromInfo.dataset.infoBook || null);
      return;
    }
    if (target.closest("[data-focus-search]")) return $("#roomCount").focus();
    if (target.closest("[data-social]")) return toast("Social profiles are not connected in this demo.");
    if (target.closest(".booking-next")) return nextStep();
    if (target.closest(".booking-back")) return showStep(Math.max(1, state.step - 1));
    if (target.closest(".booking-confirm")) return confirmBooking();
    if (target.closest(".booking-home")) {
      closeOverlay($("#bookingModal"));
      window.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }
    if (target.closest(".booking-view")) {
      return viewReservation(target.closest(".booking-view"));
    }
    if (target.closest(".info-close, [data-close-info]")) return closeOverlay($("#infoModal"));
    if (target.closest(".modal-close, [data-close-modal]")) return closeOverlay($("#bookingModal"));
    if (target.closest(".lightbox-close") || target === $("#galleryLightbox")) return closeOverlay($("#galleryLightbox"));
    const gallery = target.closest("[data-gallery]");
    if (gallery) openLightbox(gallery);
  });

  $$("[data-gallery]").forEach((image) => {
    image.tabIndex = 0;
    image.setAttribute("role", "button");
    image.setAttribute("aria-label", `Enlarge ${image.alt.toLowerCase()} photo`);
  });
  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
      const open = $(".lightbox.is-open") || $("#infoModal.is-open") || $("#bookingModal.is-open");
      if (open) closeOverlay(open);
      else closeMobileMenu();
    }
    if ((event.key === "Enter" || event.key === " ") && event.target.matches("[data-gallery]")) {
      event.preventDefault();
      openLightbox(event.target);
    }
    if (event.key === "Tab") {
      const open = $(".lightbox.is-open") || $("#infoModal.is-open") || $("#bookingModal.is-open");
      if (!open) return;
      const focusable = $$("button:not([disabled]), input, select, textarea, a[href]", open).filter((item) => item.offsetParent !== null);
      if (!focusable.length) return;
      const first = focusable[0], last = focusable.at(-1);
      if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last.focus(); }
      else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first.focus(); }
    }
  });
});
