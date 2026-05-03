import { fetchPokemonList } from './api.js';

class HomePage extends HTMLElement {
  constructor() {
    super();
    this.offset = 0;
    this.pokemons = [];
    this.observer = null;
  }

  async connectedCallback() {
    this.innerHTML = `
      <ion-header>
        <ion-toolbar color="danger">
          <ion-title>Pokédex</ion-title>
        </ion-toolbar>
      </ion-header>
      <ion-content>
        <div id="carrossel-outer" class="carrossel-outer">
          <button id="btn-prev" class="carousel-nav-btn" aria-label="Anterior">◀</button>
          <div id="carrossel-container" class="carrossel-wrapper" tabindex="0"></div>
          <button id="btn-next" class="carousel-nav-btn" aria-label="Próximo">▶</button>
        </div>
        <div style="text-align:center; padding: 16px;">
          <ion-button id="load-more" expand="block" fill="outline">Carregar mais</ion-button>
        </div>
        <ion-spinner id="spinner" style="display:none; margin:20px auto;"></ion-spinner>
      </ion-content>
      <ion-alert id="error-alert" header="Erro" message="" buttons={['OK']}></ion-alert>
    `;

    await this.loadPokemons();
    this.setupIntersectionObserver();
    this.setupNavigation();
    document.getElementById('load-more').addEventListener('click', () => this.loadMore());
  }

  async loadPokemons(append = false) {
    const spinner = document.getElementById('spinner');
    const btn = document.getElementById('load-more');
    try {
      spinner.style.display = 'block';
      btn.disabled = true;
      const novos = await fetchPokemonList(50, this.offset);
      if (append) {
        this.pokemons = [...this.pokemons, ...novos];
      } else {
        this.pokemons = novos;
      }
      this.renderCarrossel(append);
      this.offset += 50;
    } catch (err) {
      this.showError(err.message);
    } finally {
      spinner.style.display = 'none';
      btn.disabled = false;
    }
  }

  loadMore() {
    this.loadPokemons(true);
  }

  renderCarrossel(append = false) {
    const container = document.getElementById('carrossel-container');
    if (!append) container.innerHTML = '';

    this.pokemons.forEach(p => {
      const card = document.createElement('ion-card');
      card.className = 'pokeball-card';
      card.setAttribute('data-pokemon-name', p.name);
      card.innerHTML = `
        <div class="card-half red"></div>
        <div class="card-half white"></div>
        <div class="card-line"></div>
        <div class="pokemon-img-circle">
          <img src="${p.sprites?.other?.home?.front_default || p.sprites?.front_default}" alt="${p.name}">
        </div>
        <div class="card-info">
          <h3>${p.name.charAt(0).toUpperCase() + p.name.slice(1)}</h3>
          <p>#${p.id}</p>
        </div>
      `;

      card.addEventListener('click', (e) => {
        const currentCard = e.currentTarget;
        if (currentCard.classList.contains('pop-out')) return;
        currentCard.classList.add('pop-out');
        setTimeout(() => {
          sessionStorage.setItem('pokemonSelecionado', JSON.stringify(p));
          window.location.hash = '#/detalhes';
        }, 300);
      });

      container.appendChild(card);
      if (this.observer) this.observer.observe(card);
    });
  }

  setupIntersectionObserver() {
    const wrapper = document.getElementById('carrossel-container');
    this.observer = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          const card = entry.target;
          if (entry.isIntersecting && entry.intersectionRatio >= 0.7) {
            document.querySelectorAll('.pokeball-card.centered').forEach(c => c.classList.remove('centered'));
            card.classList.add('centered');
          } else {
            card.classList.remove('centered');
          }
        });
      },
      {
        root: wrapper,
        threshold: [0.7]
      }
    );

    document.querySelectorAll('.pokeball-card').forEach(card => this.observer.observe(card));
  }

  setupNavigation() {
    const container = document.getElementById('carrossel-container');
    const btnPrev = document.getElementById('btn-prev');
    const btnNext = document.getElementById('btn-next');
    const scrollAmount = 220; // largura do cartão + gap (200 + 20)

    btnPrev.addEventListener('click', () => {
      container.scrollBy({ left: -scrollAmount, behavior: 'smooth' });
    });

    btnNext.addEventListener('click', () => {
      container.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    });

    // Suporte a teclado: setas esquerda/direita
    container.addEventListener('keydown', (e) => {
      if (e.key === 'ArrowLeft') {
        e.preventDefault();
        container.scrollBy({ left: -scrollAmount, behavior: 'smooth' });
      } else if (e.key === 'ArrowRight') {
        e.preventDefault();
        container.scrollBy({ left: scrollAmount, behavior: 'smooth' });
      }
    });

    // Deixar o container focável já está com tabindex="0"
  }

  showError(msg) {
    const alert = document.getElementById('error-alert');
    alert.message = msg;
    alert.present();
  }
}

customElements.define('app-home', HomePage);