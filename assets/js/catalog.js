'use strict';

const cars = window.RIDERCAR_CARS || [];

const state = {
  filteredCars: [...cars],
  favorites: new Set()
};

const storage = {
  get(key, fallback) {
    try {
      const value = localStorage.getItem(key);
      return value ? JSON.parse(value) : fallback;
    } catch (error) {
      return fallback;
    }
  },
  set(key, value) {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch (error) {
      return null;
    }
    return null;
  }
};

const header = document.querySelector('[data-header]');
const overlay = document.querySelector('[data-overlay]');
const navbar = document.querySelector('[data-navbar]');
const navToggleBtn = document.querySelector('[data-nav-toggle-btn]');
const navbarLinks = document.querySelectorAll('[data-nav-link]');
const themeToggle = document.querySelector('[data-theme-toggle]');
const filterForm = document.querySelector('[data-catalog-filter]');
const carList = document.querySelector('[data-catalog-list]');
const resultsCount = document.querySelector('[data-results-count]');
const resultsMessage = document.querySelector('[data-results-message]');
const emptyState = document.querySelector('[data-empty-state]');
const toast = document.querySelector('[data-toast]');
const modal = document.querySelector('[data-modal]');
const modalContent = document.querySelector('[data-modal-content]');
const yearElement = document.querySelector('[data-current-year]');
const chipContainer = document.querySelector('[data-brand-chips]');

state.favorites = new Set(storage.get('ridercar-favorites', []));

if (storage.get('ridercar-theme', 'light') === 'dark') {
  document.body.classList.add('dark-theme');
}

const navToggleFunc = () => {
  navToggleBtn.classList.toggle('active');
  navbar.classList.toggle('active');
  overlay.classList.toggle('active');
};

if (navToggleBtn) {
  navToggleBtn.addEventListener('click', navToggleFunc);
}

if (overlay) {
  overlay.addEventListener('click', navToggleFunc);
}

navbarLinks.forEach((link) => {
  link.addEventListener('click', () => {
    if (navbar.classList.contains('active')) {
      navToggleFunc();
    }
  });
});

window.addEventListener('scroll', () => {
  header.classList.toggle('active', window.scrollY >= 10);
});

const showToast = (message) => {
  toast.textContent = message;
  toast.hidden = false;
  clearTimeout(showToast.timeoutId);
  showToast.timeoutId = setTimeout(() => {
    toast.textContent = '';
    toast.hidden = true;
  }, 2800);
};

const formatCurrency = (value) =>
  new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value);

const renderCars = (items) => {
  carList.innerHTML = items
    .map(
      (car) => `
        <li>
          <article class="featured-car-card featured-car-card--catalog">
            <figure class="card-banner">
              <img src="${car.image}" alt="${car.alt}" loading="lazy" width="440" height="300">
            </figure>

            <div class="card-content">
              <div class="card-title-wrapper">
                <div>
                  <span class="tag">${car.tag}</span>
                  <h3 class="h3 card-title"><a href="#catalogo">${car.name}</a></h3>
                </div>
                <data class="year" value="${car.year}">${car.year}</data>
              </div>

              <p class="card-description">${car.description}</p>

              <ul class="card-list">
                <li class="card-list-item">
                  <ion-icon name="people-outline"></ion-icon>
                  <span class="card-item-text">${car.passengers}</span>
                </li>
                <li class="card-list-item">
                  <ion-icon name="flash-outline"></ion-icon>
                  <span class="card-item-text">${car.fuel}</span>
                </li>
                <li class="card-list-item">
                  <ion-icon name="speedometer-outline"></ion-icon>
                  <span class="card-item-text">${car.consumption}</span>
                </li>
                <li class="card-list-item">
                  <ion-icon name="location-outline"></ion-icon>
                  <span class="card-item-text">${car.city}</span>
                </li>
              </ul>

              <div class="card-price-wrapper">
                <p class="card-price">
                  <strong>${formatCurrency(car.price)}</strong>
                  <span>por mes</span>
                </p>

                <div class="card-actions">
                  <button
                    type="button"
                    class="icon-btn ${state.favorites.has(car.id) ? 'active' : ''}"
                    data-favorite="${car.id}"
                    aria-label="Salvar ${car.name} nos favoritos">
                    <ion-icon name="heart-outline"></ion-icon>
                  </button>
                  <button type="button" class="btn" data-rent="${car.id}">Alugar agora</button>
                </div>
              </div>
            </div>
          </article>
        </li>
      `
    )
    .join('');
};

const updateResults = () => {
  resultsCount.textContent = `${state.filteredCars.length} veiculos`;

  if (state.filteredCars.length) {
    resultsMessage.textContent = 'Catalogo atualizado com base nos filtros selecionados.';
    emptyState.hidden = true;
    carList.hidden = false;
    return;
  }

  resultsMessage.textContent = 'Nenhum veiculo encontrado para este conjunto de filtros.';
  emptyState.hidden = false;
  carList.hidden = true;
};

const applyFilters = (filters = {}) => {
  const query = (filters.query || '').trim().toLowerCase();
  const maxPrice = Number(filters.price);
  const minYear = Number(filters.year);
  const brand = (filters.brand || '').trim().toLowerCase();

  state.filteredCars = cars.filter((car) => {
    const haystack = `${car.name} ${car.brand} ${car.tag} ${car.city}`.toLowerCase();
    const matchesQuery = !query || haystack.includes(query);
    const matchesBrand = !brand || car.brand.toLowerCase() === brand;
    const matchesPrice = !maxPrice || car.price <= maxPrice;
    const matchesYear = !minYear || car.year >= minYear;

    return matchesQuery && matchesBrand && matchesPrice && matchesYear;
  });

  renderCars(state.filteredCars);
  updateResults();
};

const syncFormWithQuery = () => {
  const params = new URLSearchParams(window.location.search);
  const query = params.get('query') || '';
  const price = params.get('price') || '';
  const year = params.get('year') || '';
  const brand = params.get('brand') || '';

  filterForm.elements.query.value = query;
  filterForm.elements.price.value = price;
  filterForm.elements.year.value = year;
  filterForm.elements.brand.value = brand;

  applyFilters({ query, price, year, brand });
};

const openModal = (car) => {
  modalContent.innerHTML = `
    <p><strong>Modelo:</strong> ${car.name}</p>
    <p><strong>Categoria:</strong> ${car.tag}</p>
    <p><strong>Cidade base:</strong> ${car.city}</p>
    <p><strong>Preco estimado:</strong> ${formatCurrency(car.price)} por mes</p>
    <p><strong>Descricao:</strong> ${car.description}</p>
  `;
  modal.hidden = false;
  document.body.style.overflow = 'hidden';
};

const closeModal = () => {
  modal.hidden = true;
  document.body.style.overflow = '';
};

const renderBrandChips = () => {
  const brands = [...new Set(cars.map((car) => car.brand))].sort((a, b) => a.localeCompare(b));
  chipContainer.innerHTML = [
    '<button type="button" class="filter-chip active" data-brand-chip="">Todos</button>',
    ...brands.map((brand) => `<button type="button" class="filter-chip" data-brand-chip="${brand}">${brand}</button>`)
  ].join('');
};

document.addEventListener('click', (event) => {
  const favoriteButton = event.target.closest('[data-favorite]');
  const rentButton = event.target.closest('[data-rent]');
  const closeModalButton = event.target.closest('[data-modal-close]');
  const brandChip = event.target.closest('[data-brand-chip]');
  const resetFiltersButton = event.target.closest('[data-reset-filters]');

  if (favoriteButton) {
    const carId = Number(favoriteButton.dataset.favorite);
    if (state.favorites.has(carId)) {
      state.favorites.delete(carId);
      showToast('Veiculo removido dos favoritos.');
    } else {
      state.favorites.add(carId);
      showToast('Veiculo salvo nos favoritos.');
    }
    storage.set('ridercar-favorites', [...state.favorites]);
    renderCars(state.filteredCars);
  }

  if (rentButton) {
    const carId = Number(rentButton.dataset.rent);
    const car = cars.find((item) => item.id === carId);
    openModal(car);
  }

  if (closeModalButton && !modal.hidden) {
    closeModal();
  }

  if (brandChip) {
    const brand = brandChip.dataset.brandChip;
    filterForm.elements.brand.value = brand;
    document.querySelectorAll('[data-brand-chip]').forEach((chip) => chip.classList.remove('active'));
    brandChip.classList.add('active');
    applyFilters({
      query: filterForm.elements.query.value,
      price: filterForm.elements.price.value,
      year: filterForm.elements.year.value,
      brand
    });
  }

  if (resetFiltersButton) {
    filterForm.reset();
    document.querySelectorAll('[data-brand-chip]').forEach((chip) => chip.classList.remove('active'));
    const firstChip = document.querySelector('[data-brand-chip=""]');
    if (firstChip) {
      firstChip.classList.add('active');
    }
    applyFilters();
  }
});

document.addEventListener('keydown', (event) => {
  if (event.key === 'Escape' && !modal.hidden) {
    closeModal();
  }
});

filterForm.addEventListener('submit', (event) => {
  event.preventDefault();
  applyFilters({
    query: filterForm.elements.query.value,
    price: filterForm.elements.price.value,
    year: filterForm.elements.year.value,
    brand: filterForm.elements.brand.value
  });
});

themeToggle.addEventListener('click', () => {
  document.body.classList.toggle('dark-theme');
  const isDark = document.body.classList.contains('dark-theme');
  storage.set('ridercar-theme', isDark ? 'dark' : 'light');
  themeToggle.innerHTML = isDark
    ? '<ion-icon name="sunny-outline"></ion-icon><span>Modo claro</span>'
    : '<ion-icon name="moon-outline"></ion-icon><span>Modo escuro</span>';
  showToast(isDark ? 'Modo escuro ativado.' : 'Modo claro ativado.');
});

if (document.body.classList.contains('dark-theme')) {
  themeToggle.innerHTML = '<ion-icon name="sunny-outline"></ion-icon><span>Modo claro</span>';
}

yearElement.textContent = new Date().getFullYear();
renderBrandChips();
syncFormWithQuery();
