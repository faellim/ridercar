'use strict';

const cars = (window.RIDERCAR_CARS || []).slice(0, 6);

const state = {
  filteredCars: [...cars],
  favorites: new Set(),
  selectedCar: null
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

const overlay = document.querySelector('[data-overlay]');
const navbar = document.querySelector('[data-navbar]');
const navToggleBtn = document.querySelector('[data-nav-toggle-btn]');
const navbarLinks = document.querySelectorAll('[data-nav-link]');
const header = document.querySelector('[data-header]');
const themeToggle = document.querySelector('[data-theme-toggle]');
const filterForm = document.querySelector('[data-filter-form]');
const carList = document.querySelector('[data-car-list]');
const filterFeedback = document.querySelector('[data-filter-feedback]');
const modal = document.querySelector('[data-modal]');
const modalContent = document.querySelector('[data-modal-content]');
const toast = document.querySelector('[data-toast]');
const contactForm = document.querySelector('[data-contact-form]');
const yearElement = document.querySelector('[data-current-year]');

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

const formatCurrency = (value) =>
  new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value);

const showToast = (message) => {
  toast.textContent = message;
  toast.hidden = false;
  clearTimeout(showToast.timeoutId);
  showToast.timeoutId = setTimeout(() => {
    toast.textContent = '';
    toast.hidden = true;
  }, 2800);
};

const renderCars = (items) => {
  carList.innerHTML = items
    .map(
      (car) => `
        <li>
          <article class="featured-car-card">
            <figure class="card-banner">
              <img src="${car.image}" alt="${car.alt}" loading="lazy" width="440" height="300">
            </figure>

            <div class="card-content">
              <div class="card-title-wrapper">
                <div>
                  <span class="tag">${car.tag}</span>
                  <h3 class="h3 card-title"><a href="catalogo.html">${car.name}</a></h3>
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
                    aria-label="Adicionar ${car.name} aos favoritos">
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

const updateFeedback = (total) => {
  if (total === cars.length) {
    filterFeedback.textContent = 'Exibindo os principais destaques da frota. Veja o catalogo completo para explorar mais opcoes.';
    return;
  }

  if (total === 0) {
    filterFeedback.textContent = 'Nenhum carro encontrado para esse filtro. Tente ampliar a faixa de preco ou reduzir o ano minimo.';
    return;
  }

  filterFeedback.textContent = `${total} destaque(s) encontrado(s) na selecao inicial da RiderCar.`;
};

const applyFilters = ({ query = '', price = '', year = '' } = {}) => {
  const normalizedQuery = query.trim().toLowerCase();
  const maxPrice = Number(price);
  const minYear = Number(year);

  state.filteredCars = cars.filter((car) => {
    const matchQuery =
      !normalizedQuery ||
      `${car.name} ${car.brand} ${car.tag} ${car.city}`.toLowerCase().includes(normalizedQuery);
    const matchPrice = !maxPrice || car.price <= maxPrice;
    const matchYear = !minYear || car.year >= minYear;

    return matchQuery && matchPrice && matchYear;
  });

  renderCars(state.filteredCars);
  updateFeedback(state.filteredCars.length);
};

const openModal = (car) => {
  state.selectedCar = car;
  modalContent.innerHTML = `
    <p><strong>Modelo:</strong> ${car.name}</p>
    <p><strong>Categoria:</strong> ${car.tag}</p>
    <p><strong>Cidade base:</strong> ${car.city}</p>
    <p><strong>Faixa mensal:</strong> ${formatCurrency(car.price)}</p>
    <p><strong>Proximo passo:</strong> use o formulario de contato para concluir a simulacao com retirada e periodo.</p>
  `;
  modal.hidden = false;
  document.body.style.overflow = 'hidden';
};

const closeModal = () => {
  modal.hidden = true;
  document.body.style.overflow = '';
};

const scrollToContact = () => {
  document.querySelector('#contact').scrollIntoView({ behavior: 'smooth' });
};

const goToCatalog = () => {
  const formData = new FormData(filterForm);
  const params = new URLSearchParams();
  ['query', 'price', 'year'].forEach((field) => {
    const value = formData.get(field);
    if (value) {
      params.set(field, value.toString());
    }
  });
  window.location.href = params.toString() ? `catalogo.html?${params}` : 'catalogo.html';
};

document.addEventListener('click', (event) => {
  const favoriteButton = event.target.closest('[data-favorite]');
  const rentButton = event.target.closest('[data-rent]');
  const showAllButton = event.target.closest('[data-show-all]');
  const openContactButton = event.target.closest('[data-open-contact]');
  const closeModalButton = event.target.closest('[data-modal-close]');
  const scrollTopButton = event.target.closest('[data-scroll-top]');

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

  if (showAllButton) {
    goToCatalog();
  }

  if (openContactButton) {
    if (!modal.hidden) {
      closeModal();
    }
    if (state.selectedCar) {
      contactForm.elements.message.value = `Quero simular a locacao do ${state.selectedCar.name} com retirada em ${state.selectedCar.city}.`;
    }
    scrollToContact();
  }

  if (closeModalButton && !modal.hidden) {
    closeModal();
  }

  if (scrollTopButton) {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }
});

document.addEventListener('keydown', (event) => {
  if (event.key === 'Escape' && !modal.hidden) {
    closeModal();
  }
});

filterForm.addEventListener('submit', (event) => {
  event.preventDefault();
  const formData = new FormData(filterForm);
  applyFilters({
    query: formData.get('query'),
    price: formData.get('price'),
    year: formData.get('year')
  });
  document.querySelector('#featured-car').scrollIntoView({ behavior: 'smooth' });
});

contactForm.addEventListener('submit', (event) => {
  event.preventDefault();
  const formData = new FormData(contactForm);
  const name = formData.get('name');
  const carName = state.selectedCar ? ` para o ${state.selectedCar.name}` : '';

  showToast(`Solicitacao enviada com sucesso, ${name}${carName}.`);
  contactForm.reset();
  state.selectedCar = null;
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
renderCars(cars);
updateFeedback(cars.length);
