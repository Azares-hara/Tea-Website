const navlinks = document.querySelectorAll(".nav-menu .nav-link");
const menuOpenButton = document.querySelector("#menu-open-button");
const menuCloseButton =document.querySelector("#menu-close-button");


menuOpenButton.addEventListener("click", () => {
  //toggling mobile menu flexibility
  document.body.classList.toggle("show-mobile-menu");
});
menuCloseButton.addEventListener("click", () => menuOpenButton.click());
//close menu when nav link is clicked
navlinks.forEach(link => {
  link.addEventListener("click", () => menuOpenButton.click());
} );

//initi swiper
const swiper = new Swiper('.slider-wrapper', {
  // Optional parameters
  loop: true,
  grabCursor: true,
  spaceBetween: 25,

  pagination: {
    el: '.swiper-pagination',
    clickable: true,
    dynamicBullets: true,
  },

  //Navigation arrows
  navigation: {
    nextEl: '.swiper-button-next',
    prevEl: '.swiper-button-prev',
  },
  breakpoints: {
    0: {
      sliperPerView: 1
    },
    768: {
      sliperPerView: 2
    },
    1024: {
      sliperPerView: 3
    }
  }
});


//Booking functionality 
const API_URL = "https://6ab0fa519751d2b03e6cb26f.mockapi.io/Bookings";
const bookingForm = document.querySelector("#booking-form");
const submitBtn = document.querySelector("#submit-btn");
const bookingMessage = document.querySelector("#booking-message");
const reservationsList = document.querySelector("#reservations-list");
const dateInput = document.querySelector("#booking-date");

//Prevent booking dates in the past
dateInput.min = new Date().toISOString().split("T")[0];

// Display bookings from the API
async function loadReservations() {
  try {
    const response = await fetch(API_URL);
    if (!response.ok) throw new Error("Could not fetch bookings");
    const bookings = await response.json();

    // Sort by date/time, newest first, keep the next 6
    bookings.sort((a, b) => new Date(b.date + "T" + b.time) - new Date(a.date + "T" + a.time));

    reservationsList.innerHTML = bookings.length
      ? bookings.slice(0, 6).map(b => `
          <li>
            <strong>${b.name}</strong> — ${b.guests} guest${b.guests > 1 ? "s" : ""}<br>
            ${b.date} at ${b.time}
          </li>
        `).join("")
      : `<li class="reservation-empty">No reservations yet — be the first!</li>`;
  } catch (error) {
    reservationsList.innerHTML = `<li class="reservation-empty">Couldn't load bookings. Is the MockAPI project running?</li>`;
  }
}

//Submit new booking
bookingForm.addEventListener("submit", async (e) => {
  e.preventDefault();
  submitBtn.disabled = true;
  submitBtn.textContent = "Booking...";
  bookingMessage.textContent = "";

  const booking = {
    name: document.querySelector("#customer-name").value.trim(),
    date: dateInput.value,
    time: document.querySelector("#booking-time").value,
    guests: document.querySelector("#party-size").value
  };

  try {
    const response = await fetch(API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(booking)
    });
    if (!response.ok) throw new Error("Booking failed");

    bookingMessage.textContent = "Reservation confirmed — see you soon!";
    bookingForm.reset();
    loadReservations();
  } catch (error) {
    bookingMessage.textContent = "Something went wrong. Please try again.";
  } finally {
    submitBtn.disabled = false;
    submitBtn.textContent = "Confirm Reservation";
  }
});

loadReservations();
