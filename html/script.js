document.addEventListener("DOMContentLoaded", () => {
  const menuToggle = document.getElementById("menuToggle");
  const mobileMenu = document.getElementById("mobileMenu");
  const toggleCompact = document.getElementById("toggleCompact");
  const resultList = document.getElementById("resultList");
  const resultCards = document.querySelectorAll(".result-card");
  const floatingPlaceCard = document.getElementById("floatingPlaceCard");
  const toggleSidebarButton = document.getElementById("toggleSidebarButton");
  const fitMapButton = document.getElementById("fitMapButton");
  const searchSidebar = document.getElementById("searchSidebar");
  const filterChips = document.querySelectorAll(".filter-chip");

  const places = [
    {
      title: "Café Jardim",
      subtitle: "Centro",
      description: "Ambiente com boa circulação e acesso facilitado.",
      coords: [-23.55052, -46.633308]
    },
    {
      title: "Mercado Vida",
      subtitle: "Bela Vista",
      description: "Entrada confortável e espaços mais amplos.",
      coords: [-23.5522, -46.629]
    },
    {
      title: "Clínica Movimento",
      subtitle: "Paraíso",
      description: "Estrutura moderna com acessibilidade bem resolvida.",
      coords: [-23.5614, -46.6559]
    }
  ];

  const map = L.map("map", {
    zoomControl: true,
    scrollWheelZoom: true
  }).setView([-23.55052, -46.633308], 13);

  L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
    maxZoom: 19,
    attribution: "&copy; OpenStreetMap contributors"
  }).addTo(map);

  const markers = [];

  places.forEach((place, index) => {
    const marker = L.marker(place.coords).addTo(map);

    marker.bindPopup(`
      <div class="map-popup">
        <strong>${place.title}</strong>
        <span>${place.subtitle}</span>
      </div>
    `);

    marker.on("click", () => {
      activatePlace(index);
    });

    markers.push(marker);
  });

  function activatePlace(index) {
    resultCards.forEach((card, cardIndex) => {
      card.classList.toggle("is-active", cardIndex === index);
    });

    const selectedPlace = places[index];

    floatingPlaceCard.innerHTML = `
      <span class="mini-label">Selecionado</span>
      <strong>${selectedPlace.title}</strong>
      <p>${selectedPlace.description}</p>
    `;

    map.setView(selectedPlace.coords, 15, { animate: true });
    markers[index].openPopup();
  }

  resultCards.forEach((card, index) => {
    card.addEventListener("click", () => activatePlace(index));

    card.addEventListener("keydown", (event) => {
      if (event.key === "Enter" || event.key === " ") {
        event.preventDefault();
        activatePlace(index);
      }
    });
  });

  filterChips.forEach((chip) => {
    chip.addEventListener("click", () => {
      filterChips.forEach((item) => item.classList.remove("is-active"));
      chip.classList.add("is-active");
    });
  });

  toggleCompact.addEventListener("click", () => {
    const isCompact = resultList.classList.toggle("is-compact");
    toggleCompact.textContent = isCompact ? "Expandir" : "Compactar";
  });

  menuToggle.addEventListener("click", () => {
    const isOpen = mobileMenu.classList.toggle("is-open");
    mobileMenu.hidden = !isOpen;
    menuToggle.setAttribute("aria-expanded", String(isOpen));
  });

  toggleSidebarButton.addEventListener("click", () => {
    if (window.innerWidth <= 900) {
      searchSidebar.scrollIntoView({
        behavior: "smooth",
        block: "start"
      });
      return;
    }

    searchSidebar.classList.toggle("is-collapsed");

    setTimeout(() => {
      map.invalidateSize();
    }, 260);
  });

  fitMapButton.addEventListener("click", () => {
    const bounds = L.latLngBounds(places.map((place) => place.coords));
    map.fitBounds(bounds, { padding: [40, 40] });
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
      mobileMenu.classList.remove("is-open");
      mobileMenu.hidden = true;
      menuToggle.setAttribute("aria-expanded", "false");
    }
  });
});