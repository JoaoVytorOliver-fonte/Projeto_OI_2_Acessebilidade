/**
 * AcessiMap — script.js
 * ======================
 * Organização:
 *  1. Seletores de elementos do DOM
 *  2. Funções utilitárias
 *  3. Módulo: Sidebar (menu lateral)
 *  4. Módulo: Modal de Perfil
 *  5. Módulo: Modal do Mapa
 *  6. Módulo: Tabs (sistema de abas)
 *  7. Módulo: Scroll (animações + header)
 *  8. Inicialização
 */

'use strict';

/* ─────────────────────────────────────────────
   1. SELETORES
───────────────────────────────────────────── */
const overlay        = document.getElementById('overlay');
const header         = document.getElementById('header');

// Sidebar
const sidebar        = document.getElementById('sidebar');
const hamburgerBtn   = document.getElementById('hamburgerBtn');
const sidebarClose   = document.getElementById('sidebarClose');
const sidebarLinks   = sidebar.querySelectorAll('.sidebar__link');

// Modal Perfil
const profileBtn         = document.getElementById('profileBtn');
const profileModal       = document.getElementById('profileModal');
const profileModalClose  = document.getElementById('profileModalClose');

// Modal Mapa
const mapBtn         = document.getElementById('mapBtn');
const mapModal       = document.getElementById('mapModal');
const mapModalClose  = document.getElementById('mapModalClose');

// Tabs
const tabBtns        = document.querySelectorAll('.tab-btn');
const tabPanels      = document.querySelectorAll('.tab-panel');

// Elementos com animação ao rolar
const animEls        = document.querySelectorAll('.animate-on-scroll');


/* ─────────────────────────────────────────────
   2. UTILITÁRIOS
───────────────────────────────────────────── */

/**
 * Adiciona "is-active" ao overlay e trava o scroll do body.
 * Chamado sempre que um modal ou sidebar é aberto.
 */
function openOverlay() {
  overlay.classList.add('is-active');
  document.body.style.overflow = 'hidden';
}

/**
 * Remove "is-active" do overlay e restaura o scroll do body.
 */
function closeOverlay() {
  overlay.classList.remove('is-active');
  document.body.style.overflow = '';
}

/**
 * Move o foco para o primeiro elemento focável dentro de um container.
 * Importante para acessibilidade com teclado.
 * @param {HTMLElement} container - elemento pai onde buscar o foco
 */
function trapFocus(container) {
  const focusable = container.querySelectorAll(
    'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
  );
  if (focusable.length) focusable[0].focus();
}


/* ─────────────────────────────────────────────
   3. MÓDULO: SIDEBAR
───────────────────────────────────────────── */

/** Abre a sidebar com animação deslizante */
function openSidebar() {
  sidebar.classList.add('is-open');
  hamburgerBtn.classList.add('is-active');
  hamburgerBtn.setAttribute('aria-expanded', 'true');
  openOverlay();
  trapFocus(sidebar);
}

/** Fecha a sidebar */
function closeSidebar() {
  sidebar.classList.remove('is-open');
  hamburgerBtn.classList.remove('is-active');
  hamburgerBtn.setAttribute('aria-expanded', 'false');
  closeOverlay();
  hamburgerBtn.focus(); // devolve foco ao botão
}

// Eventos da sidebar
hamburgerBtn.addEventListener('click', () => {
  sidebar.classList.contains('is-open') ? closeSidebar() : openSidebar();
});

sidebarClose.addEventListener('click', closeSidebar);

// Fechar ao clicar em um link do menu (scroll suave já é CSS)
sidebarLinks.forEach(link => {
  link.addEventListener('click', closeSidebar);
});

// Fechar com tecla ESC
document.addEventListener('keydown', e => {
  if (e.key === 'Escape') {
    if (sidebar.classList.contains('is-open'))       closeSidebar();
    if (profileModal.classList.contains('is-open'))  closeProfileModal();
    if (mapModal.classList.contains('is-open'))      closeMapModal();
  }
});


/* ─────────────────────────────────────────────
   4. MÓDULO: MODAL DE PERFIL
───────────────────────────────────────────── */

/** Abre o modal de perfil */
function openProfileModal() {
  profileModal.classList.add('is-open');
  openOverlay();
  trapFocus(profileModal);
}

/** Fecha o modal de perfil */
function closeProfileModal() {
  profileModal.classList.remove('is-open');
  closeOverlay();
  profileBtn.focus();
}

profileBtn.addEventListener('click', openProfileModal);
profileModalClose.addEventListener('click', closeProfileModal);


/* ─────────────────────────────────────────────
   5. MÓDULO: MODAL DO MAPA
───────────────────────────────────────────── */

/** Abre o modal do mapa */
function openMapModal() {
  mapModal.classList.add('is-open');
  openOverlay();
  trapFocus(mapModal);
}

/** Fecha o modal do mapa */
function closeMapModal() {
  mapModal.classList.remove('is-open');
  closeOverlay();
  mapBtn.focus();
}

mapBtn.addEventListener('click', openMapModal);
mapModalClose.addEventListener('click', closeMapModal);


/* ─────────────────────────────────────────────
   OVERLAY — clique fecha tudo que estiver aberto
───────────────────────────────────────────── */
overlay.addEventListener('click', () => {
  if (sidebar.classList.contains('is-open'))       closeSidebar();
  if (profileModal.classList.contains('is-open'))  closeProfileModal();
  if (mapModal.classList.contains('is-open'))      closeMapModal();
});


/* ─────────────────────────────────────────────
   6. MÓDULO: TABS (ABAS)
───────────────────────────────────────────── */

/**
 * Ativa a aba clicada e exibe o painel correspondente.
 * Adiciona animação de entrada via toggle de classe.
 * @param {HTMLButtonElement} activeBtn - botão da aba clicada
 */
function activateTab(activeBtn) {
  const targetTab = activeBtn.dataset.tab;

  // Atualiza botões
  tabBtns.forEach(btn => {
    const isActive = btn === activeBtn;
    btn.classList.toggle('tab-btn--active', isActive);
    btn.setAttribute('aria-selected', String(isActive));
  });

  // Atualiza painéis
  tabPanels.forEach(panel => {
    const isTarget = panel.id === `tab-${targetTab}`;
    panel.classList.toggle('tab-panel--active', isTarget);

    // Re-dispara as animações dos cards do painel ativo
    if (isTarget) {
      const cards = panel.querySelectorAll('.animate-on-scroll');
      cards.forEach(card => {
        // Remove e adiciona a classe para reiniciar a animação
        card.classList.remove('is-visible');
        // Pequeno delay para garantir o reflow do browser
        requestAnimationFrame(() => {
          requestAnimationFrame(() => card.classList.add('is-visible'));
        });
      });
    }
  });
}

tabBtns.forEach(btn => {
  btn.addEventListener('click', () => activateTab(btn));
});

// Navegar pelas abas com setas do teclado (acessibilidade)
tabBtns.forEach((btn, index) => {
  btn.addEventListener('keydown', e => {
    let newIndex = null;
    if (e.key === 'ArrowRight') newIndex = (index + 1) % tabBtns.length;
    if (e.key === 'ArrowLeft')  newIndex = (index - 1 + tabBtns.length) % tabBtns.length;
    if (newIndex !== null) {
      tabBtns[newIndex].focus();
      activateTab(tabBtns[newIndex]);
    }
  });
});


/* ─────────────────────────────────────────────
   7. MÓDULO: SCROLL
───────────────────────────────────────────── */

/**
 * IntersectionObserver para animações de entrada ao rolar.
 * Cada elemento com .animate-on-scroll recebe .is-visible
 * quando entra 15% da viewport.
 */
const scrollObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        // Para de observar após a primeira vez (animação única)
        scrollObserver.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.15 }
);

animEls.forEach(el => scrollObserver.observe(el));

/**
 * Adiciona classe "scrolled" ao header quando rola > 20px,
 * intensificando a sombra da barra fixa.
 */
window.addEventListener('scroll', () => {
  header.classList.toggle('scrolled', window.scrollY > 20);
}, { passive: true });


/* ─────────────────────────────────────────────
   8. INICIALIZAÇÃO
───────────────────────────────────────────── */

/**
 * Ao carregar o DOM, marca imediatamente como visíveis
 * os elementos que já estão dentro da viewport
 * (ex: hero e primeiros cards).
 */
document.addEventListener('DOMContentLoaded', () => {
  // Força a verificação inicial do observer
  animEls.forEach(el => {
    const rect = el.getBoundingClientRect();
    if (rect.top < window.innerHeight * 0.9) {
      el.classList.add('is-visible');
    }
  });

  // Marca a primeira aba como ativa ao iniciar
  const firstPanel = document.getElementById('tab-top');
  if (firstPanel) {
    const initialCards = firstPanel.querySelectorAll('.animate-on-scroll');
    initialCards.forEach(card => {
      setTimeout(() => card.classList.add('is-visible'), 200);
    });
  }

  console.log('%c♿ AcessiMap carregado com sucesso!', 'color: #2db560; font-size: 14px; font-weight: bold;');
});
