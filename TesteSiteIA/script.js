/**
 * AcessiMap — script.js
 * ======================
 * Código modular e limpo em Vanilla JS
 */

'use strict';

// ==========================================
// Seletores do DOM
// ==========================================
const DOM = {
  overlay: document.getElementById('overlay'),
  header: document.getElementById('header'),
  
  sidebar: {
    el: document.getElementById('sidebar'),
    btn: document.getElementById('hamburgerBtn'),
    close: document.getElementById('sidebarClose'),
    links: document.querySelectorAll('.sidebar__link')
  },
  
  modals: {
    profileBtn: document.getElementById('profileBtn'),
    profileModal: document.getElementById('profileModal'),
    profileClose: document.getElementById('profileModalClose')
  },
  
  tabs: {
    btns: document.querySelectorAll('.tab-btn'),
    panels: document.querySelectorAll('.tab-panel')
  },

  animations: document.querySelectorAll('.animate-on-scroll')
};

// ==========================================
// Funções Utilitárias Globais
// ==========================================
const Util = {
  openOverlay: () => {
    DOM.overlay.classList.add('is-active');
    document.body.style.overflow = 'hidden';
  },
  closeOverlay: () => {
    DOM.overlay.classList.remove('is-active');
    document.body.style.overflow = '';
  },
  trapFocus: (container) => {
    const focusable = container.querySelectorAll('button, [href], input, select, textarea, [tabindex]:not([tabindex=\"-1\"])');
    if (focusable.length) focusable[0].focus();
  }
};

// ==========================================
// Módulo: Menu Lateral (Sidebar)
// ==========================================
const SidebarManager = {
  open: () => {
    DOM.sidebar.el.classList.add('is-open');
    DOM.sidebar.btn.classList.add('is-active');
    DOM.sidebar.btn.setAttribute('aria-expanded', 'true');
    Util.openOverlay();
    Util.trapFocus(DOM.sidebar.el);
  },
  close: () => {
    DOM.sidebar.el.classList.remove('is-open');
    DOM.sidebar.btn.classList.remove('is-active');
    DOM.sidebar.btn.setAttribute('aria-expanded', 'false');
    Util.closeOverlay();
    DOM.sidebar.btn.focus();
  },
  toggle: () => {
    DOM.sidebar.el.classList.contains('is-open') ? SidebarManager.close() : SidebarManager.open();
  },
  init: () => {
    DOM.sidebar.btn.addEventListener('click', SidebarManager.toggle);
    DOM.sidebar.close.addEventListener('click', SidebarManager.close);
    DOM.sidebar.links.forEach(link => link.addEventListener('click', SidebarManager.close));
  }
};

// ==========================================
// Módulo: Modal de Perfil
// ==========================================
const ModalManager = {
  openProfile: () => {
    DOM.modals.profileModal.classList.add('is-open');
    Util.openOverlay();
    Util.trapFocus(DOM.modals.profileModal);
  },
  closeProfile: () => {
    DOM.modals.profileModal.classList.remove('is-open');
    Util.closeOverlay();
    DOM.modals.profileBtn.focus();
  },
  init: () => {
    DOM.modals.profileBtn.addEventListener('click', ModalManager.openProfile);
    DOM.modals.profileClose.addEventListener('click', ModalManager.closeProfile);
  }
};

// ==========================================
// Módulo: Tabs (Sistema de Abas de Conteúdo)
// ==========================================
const TabsManager = {
  activate: (activeBtn) => {
    const targetId = `tab-${activeBtn.dataset.tab}`;

    // Atualiza classes dos botões
    DOM.tabs.btns.forEach(btn => {
      const isActive = btn === activeBtn;
      btn.classList.toggle('tab-btn--active', isActive);
      btn.setAttribute('aria-selected', String(isActive));
    });

    // Atualiza a visibilidade dos painéis de conteúdo
    DOM.tabs.panels.forEach(panel => {
      const isTarget = panel.id === targetId;
      panel.classList.toggle('tab-panel--active', isTarget);

      // Reinicia as animações caso existam dentro do painel
      if (isTarget) {
        const cards = panel.querySelectorAll('.animate-on-scroll');
        cards.forEach(card => {
          card.classList.remove('is-visible');
          requestAnimationFrame(() => {
            requestAnimationFrame(() => card.classList.add('is-visible'));
          });
        });
      }
    });
  },
  init: () => {
    DOM.tabs.btns.forEach(btn => {
      btn.addEventListener('click', () => TabsManager.activate(btn));
    });
  }
};

// ==========================================
// Módulo: Interações de Scroll & Observer
// ==========================================
const ScrollManager = {
  observer: new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        observer.unobserve(entry.target); // Anima apenas uma vez
      }
    });
  }, { threshold: 0.1 }),

  init: () => {
    // Aplica o observer em todos os elementos com a classe mapeada
    DOM.animations.forEach(el => ScrollManager.observer.observe(el));

    // Efeito sutil no header ao rolar a página
    window.addEventListener('scroll', () => {
      DOM.header.classList.toggle('scrolled', window.scrollY > 10);
    }, { passive: true });
  }
};

// ==========================================
// Inicialização Geral da Interface
// ==========================================
const App = {
  init: () => {
    SidebarManager.init();
    ModalManager.init();
    TabsManager.init();
    ScrollManager.init();

    // Fecha modais e sidebar clicando no overlay negro ou usando a tecla ESC
    DOM.overlay.addEventListener('click', () => {
      if (DOM.sidebar.el.classList.contains('is-open')) SidebarManager.close();
      if (DOM.modals.profileModal.classList.contains('is-open')) ModalManager.closeProfile();
    });

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        if (DOM.sidebar.el.classList.contains('is-open')) SidebarManager.close();
        if (DOM.modals.profileModal.classList.contains('is-open')) ModalManager.closeProfile();
      }
    });

    // Exibe elementos visíveis no carregamento sem precisar rolar
    setTimeout(() => {
      DOM.animations.forEach(el => {
        const rect = el.getBoundingClientRect();
        if (rect.top < window.innerHeight) {
          el.classList.add('is-visible');
        }
      });
    }, 100);
  }
};

// Inicia os scripts quando o DOM carregar
document.addEventListener('DOMContentLoaded', App.init);