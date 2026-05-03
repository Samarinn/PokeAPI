class DetalhesPage extends HTMLElement {
  connectedCallback() {
    const dados = JSON.parse(sessionStorage.getItem('pokemonSelecionado'));
    if (!dados) {
      window.location.hash = '#/';
      return;
    }

    const tipos = dados.types.map(t => t.type.name).join(', ');
    const habilidades = dados.abilities.map(a => a.ability.name).join(', ');

    this.innerHTML = `
      <ion-header>
        <ion-toolbar color="danger">
          <ion-buttons slot="start">
            <ion-button id="custom-back-btn" fill="clear">
              <ion-icon slot="icon-only" name="arrow-back"></ion-icon>
            </ion-button>
          </ion-buttons>
          <ion-title>${dados.name.toUpperCase()}</ion-title>
        </ion-toolbar>
      </ion-header>
      <ion-content class="ion-padding">
        <ion-card>
          <img src="${dados.sprites?.other?.home?.front_default || dados.sprites?.front_default}" alt="${dados.name}"/>
          <ion-card-content>
            <h2>#${dados.id} ${dados.name.toUpperCase()}</h2>
            <p><strong>Tipo(s):</strong> ${tipos}</p>
            <p><strong>Altura:</strong> ${dados.height / 10} m</p>
            <p><strong>Peso:</strong> ${dados.weight / 10} kg</p>
            <p><strong>Habilidades:</strong> ${habilidades}</p>
          </ion-card-content>
        </ion-card>
      </ion-content>
    `;

    document.getElementById('custom-back-btn').addEventListener('click', () => {
      window.location.hash = '#/';
    });
  }
}

customElements.define('app-detalhes', DetalhesPage);