const mockRides = [
  {
    id: 1,
    date: "2025-11-20",
    time: "08:15",
    from: "Miraflores",
    to: "UTEC",
    driver: "Valentina",
    freeSeats: 3,
    price: 5,
  },
  {
    id: 2,
    date: "2025-11-20",
    time: "08:40",
    from: "Barranco",
    to: "UTEC",
    driver: "Diego",
    freeSeats: 2,
    price: 4,
  },
  {
    id: 3,
    date: "2025-11-20",
    time: "21:15",
    from: "UTEC",
    to: "Surco",
    driver: "Lucía",
    freeSeats: 1,
    price: 6,
  },
];

const ridesList = document.getElementById("rides-list");
const resultsCount = document.getElementById("results-count");
const searchForm = document.getElementById("search-form");
const sortSelect = document.getElementById("sort");
const template = document.getElementById("ride-card-template");

const confirmModal = document.getElementById("confirm-modal");
const modalText = document.getElementById("modal-text");
const modalCancel = document.getElementById("modal-cancel");
const modalConfirm = document.getElementById("modal-confirm");

let pendingRide = null;

function showComingSoon() {
  alert(
    "Oops, esta función todavía no está habilitada. 🚗💨\n\nMantente atento al lanzamiento oficial de UtecRide."
  );
}

function filterRides(data) {
  const date = document.getElementById("date").value;
  const time = document.getElementById("time").value;
  const from = document.getElementById("from").value.trim().toLowerCase();
  const to = document.getElementById("to").value.trim().toLowerCase();
  const seats = document.getElementById("seats").value;

  return data.filter((ride) => {
    if (date && ride.date !== date) return false;
    if (time && ride.time < time) return false;
    if (from && !ride.from.toLowerCase().includes(from)) return false;
    if (to && !ride.to.toLowerCase().includes(to)) return false;
    if (seats && ride.freeSeats < Number(seats)) return false;
    return true;
  });
}

function sortRides(data) {
  const mode = sortSelect.value;
  const sorted = [...data];

  if (mode === "time") {
    sorted.sort((a, b) => a.time.localeCompare(b.time));
  } else if (mode === "price") {
    sorted.sort((a, b) => a.price - b.price);
  }

  return sorted;
}

function renderRides(data) {
  ridesList.innerHTML = "";

  if (!data.length) {
    resultsCount.textContent = "0 resultados";
    const empty = document.createElement("p");
    empty.className = "ride-empty";
    empty.textContent = "No hay rides que coincidan con tu búsqueda. Prueba cambiando los filtros o crea un viaje.";
    ridesList.appendChild(empty);
    return;
  }

  resultsCount.textContent = `${data.length} resultado${data.length !== 1 ? "s" : ""}`;

  data.forEach((ride) => {
    const node = template.content.cloneNode(true);
    node.querySelector(".ride-time").textContent = ride.time;
    node.querySelector(".ride-route").textContent = `${ride.from} → ${ride.to}`;
    node.querySelector(".ride-driver strong").textContent = ride.driver;
    node.querySelector(".ride-meta").textContent = `${ride.freeSeats} asientos libres · Aporte S/ ${ride.price}`;
    node.querySelector(".btn-secondary").addEventListener("click", () => {
      pendingRide = ride;
      modalText.textContent = `Vas a unirte al ride de ${ride.driver} a las ${ride.time}. El aporte es de S/ ${ride.price}. ¿Deseas confirmar el pago y unirte?`;
      confirmModal.classList.add("is-open");
    });
    ridesList.appendChild(node);
  });
}

function refresh() {
  const filtered = filterRides(mockRides);
  const sorted = sortRides(filtered);
  renderRides(sorted);
}

searchForm.addEventListener("submit", (e) => {
  e.preventDefault();
  refresh();
});

sortSelect.addEventListener("change", refresh);

document.addEventListener("DOMContentLoaded", () => {
  const today = new Date().toISOString().slice(0, 10);
  document.getElementById("date").value = today;
  refresh();

  const loginBtn = document.getElementById("btn-login");
  const conductorLink = document.getElementById("link-mis-conductor");

  if (loginBtn) loginBtn.addEventListener("click", showComingSoon);
  if (conductorLink)
    conductorLink.addEventListener("click", (e) => {
      e.preventDefault();
      showComingSoon();
    });
});

modalCancel.addEventListener("click", () => {
  pendingRide = null;
  confirmModal.classList.remove("is-open");
});

modalConfirm.addEventListener("click", () => {
  if (pendingRide) {
    const reservasRaw = localStorage.getItem("mis_reservas");
    const reservas = reservasRaw ? JSON.parse(reservasRaw) : [];

    reservas.push({
      ...pendingRide,
      joinedAt: new Date().toISOString(),
    });

    localStorage.setItem("mis_reservas", JSON.stringify(reservas));

    alert(`Pago confirmado. Te uniste al ride de ${pendingRide.driver} a las ${pendingRide.time}.`);
  }
  pendingRide = null;
  confirmModal.classList.remove("is-open");
});
