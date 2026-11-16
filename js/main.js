document.addEventListener('DOMContentLoaded', () => {

  // ==================================================
  // 1. SCROLL SUAVE (ROLAGEM SUAVE) E DESTROCA DE SEÇÃO NA NAVBAR
  // ==================================================
  const navLinks = document.querySelectorAll('.nav-link-anchor');
  const navbarCollapse = document.getElementById('navbarNav');
  const sections = document.querySelectorAll('header#home, section[id]');

  navLinks.forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      const targetId = this.getAttribute('href');
      
      if (targetId && targetId.startsWith('#') && targetId.length > 1) {
        const targetElement = document.querySelector(targetId);
        
        if (targetElement) {
          e.preventDefault();
          
          // Rola suavemente até a seção de destino
          const navbarHeight = 70;
          const elementPosition = targetElement.getBoundingClientRect().top;
          const offsetPosition = elementPosition + window.pageYOffset - navbarHeight;

          window.scrollTo({
            top: offsetPosition,
            behavior: 'smooth'
          });

          // Fecha menu mobile no Bootstrap
          if (navbarCollapse && navbarCollapse.classList.contains('show')) {
            const bsCollapse = bootstrap.Collapse.getInstance(navbarCollapse);
            if (bsCollapse) bsCollapse.hide();
          }
        }
      }
    });
  });

  // Atualiza o link ativo da Navbar conforme o usuário faz o Scroll
  window.addEventListener('scroll', () => {
    let currentSectionId = '';

    sections.forEach(section => {
      const sectionTop = section.offsetTop - 100;
      const sectionHeight = section.offsetHeight;
      if (window.pageYOffset >= sectionTop && window.pageYOffset < sectionTop + sectionHeight) {
        currentSectionId = section.getAttribute('id');
      }
    });

    if (currentSectionId) {
      navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === `#${currentSectionId}`) {
          link.classList.add('active');
        }
      });
    }
  });

  // ==================================================
  // 2. MODO CLARO / ESCURO (DARK MODE) COM PERSISTÊNCIA
  // ==================================================
  const btnDarkMode = document.getElementById('btnDarkMode');
  const htmlTag = document.documentElement;

  const temaSalvo = localStorage.getItem('lumina_tema') || 'light';
  aplicarTema(temaSalvo);

  if (btnDarkMode) {
    btnDarkMode.addEventListener('click', () => {
      const temaAtual = htmlTag.getAttribute('data-bs-theme');
      const novoTema = temaAtual === 'light' ? 'dark' : 'light';
      
      aplicarTema(novoTema);
      localStorage.setItem('lumina_tema', novoTema);
    });
  }

  function aplicarTema(tema) {
    htmlTag.setAttribute('data-bs-theme', tema);
    if (btnDarkMode) {
      if (tema === 'dark') {
        btnDarkMode.innerHTML = '<i class="bi bi-sun-fill text-warning"></i>';
        btnDarkMode.setAttribute('title', 'Alternar para Modo Claro');
      } else {
        btnDarkMode.innerHTML = '<i class="bi bi-moon-fill"></i>';
        btnDarkMode.setAttribute('title', 'Alternar para Modo Escuro');
      }
    }
  }

  // ==================================================
  // 3. FILTRO DE PRODUTOS (Todos, Rosto, Corpo, Cabelo)
  // ==================================================
  const botoesFiltro = document.querySelectorAll('.btn-filtro');
  const produtos = document.querySelectorAll('.item-produto');

  botoesFiltro.forEach(botao => {
    botao.addEventListener('click', () => {
      botoesFiltro.forEach(b => b.classList.remove('active'));
      botao.classList.add('active');

      const categoriaFiltro = botao.getAttribute('data-filter').toLowerCase().trim();

      produtos.forEach(produto => {
        const categoriaProduto = produto.getAttribute('data-categoria').toLowerCase().trim();

        produto.style.opacity = '0';
        produto.style.transition = 'opacity 0.3s ease-in-out';

        setTimeout(() => {
          if (categoriaFiltro === 'todos' || categoriaProduto === categoriaFiltro) {
            produto.classList.remove('d-none');
            setTimeout(() => { produto.style.opacity = '1'; }, 50);
          } else {
            produto.classList.add('d-none');
          }
        }, 300);
      });
    });
  });

  // ==================================================
  // 4. CARRINHO DE COMPRAS INTERATIVO
  // ==================================================
  let carrinho = [];
  const carrinhoCount = document.getElementById('carrinhoCount');
  const listaCarrinho = document.getElementById('listaCarrinho');
  const totalCarrinho = document.getElementById('totalCarrinho');
  const btnsAddCarrinho = document.querySelectorAll('.add-carrinho');

  btnsAddCarrinho.forEach(btn => {
    btn.addEventListener('click', () => {
      const nome = btn.getAttribute('data-nome');
      const preco = parseFloat(btn.getAttribute('data-preco'));

      carrinho.push({ nome, preco });
      atualizarCarrinho();
    });
  });

  function atualizarCarrinho() {
    if (carrinhoCount) carrinhoCount.innerText = carrinho.length;
    if (!listaCarrinho) return;
    
    listaCarrinho.innerHTML = '';

    if (carrinho.length === 0) {
      listaCarrinho.innerHTML = '<li class="list-group-item text-center text-muted py-3">Seu carrinho está vazio.</li>';
      if (totalCarrinho) totalCarrinho.innerText = 'R$ 0,00';
      return;
    }

    let total = 0;
    carrinho.forEach((item, index) => {
      total += item.preco;
      const li = document.createElement('li');
      li.className = 'list-group-item d-flex justify-content-between align-items-center';
      li.innerHTML = `
        <span>${item.nome}</span>
        <div>
          <strong class="me-3">R$ ${item.preco.toFixed(2).replace('.', ',')}</strong>
          <button class="btn btn-sm btn-outline-danger" onclick="removerDoCarrinho(${index})">
            <i class="bi bi-trash"></i>
          </button>
        </div>
      `;
      listaCarrinho.appendChild(li);
    });

    if (totalCarrinho) totalCarrinho.innerText = `R$ ${total.toFixed(2).replace('.', ',')}`;
  }

  window.removerDoCarrinho = function(index) {
    carrinho.splice(index, 1);
    atualizarCarrinho();
  };

  const btnFinalizar = document.getElementById('btnFinalizar');
  if (btnFinalizar) {
    btnFinalizar.addEventListener('click', () => {
      if (carrinho.length === 0) {
        alert('Seu carrinho está vazio!');
        return;
      }
      alert('Pedido efetuado com sucesso! Obrigado por comprar na Ariane Cosméticos.');
      carrinho = [];
      atualizarCarrinho();
      const modalEl = document.getElementById('carrinhoModal');
      if (modalEl) {
        const modal = bootstrap.Modal.getInstance(modalEl);
        if (modal) modal.hide();
      }
    });
  }

  // ==================================================
  // 5. VALIDAÇÃO DO FORMULÁRIO DE CONTATO
  // ==================================================
  const form = document.getElementById('contactForm');
  const formAlert = document.getElementById('formAlert');

  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();

      const nome = document.getElementById('nome');
      const email = document.getElementById('email');
      const assunto = document.getElementById('assunto');
      const mensagem = document.getElementById('mensagem');
      
      let isValid = true;

      if (nome.value.trim() === '') {
        nome.classList.add('is-invalid');
        isValid = false;
      } else {
        nome.classList.remove('is-invalid');
        nome.classList.add('is-valid');
      }

      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email.value.trim())) {
        email.classList.add('is-invalid');
        isValid = false;
      } else {
        email.classList.remove('is-invalid');
        email.classList.add('is-valid');
      }

      if (assunto.value.trim() === '') {
        assunto.classList.add('is-invalid');
        isValid = false;
      } else {
        assunto.classList.remove('is-invalid');
        assunto.classList.add('is-valid');
      }

      if (mensagem.value.trim().length < 10) {
        mensagem.classList.add('is-invalid');
        isValid = false;
      } else {
        mensagem.classList.remove('is-invalid');
        mensagem.classList.add('is-valid');
      }

      if (isValid) {
        formAlert.classList.remove('d-none', 'alert-danger');
        formAlert.classList.add('alert-success');
        formAlert.innerText = 'Sua mensagem foi enviada com sucesso! Em breve entraremos em contato.';

        form.reset();
        [nome, email, assunto, mensagem].forEach(el => el.classList.remove('is-valid'));
      } else {
        formAlert.classList.remove('d-none', 'alert-success');
        formAlert.classList.add('alert-danger');
        formAlert.innerText = 'Por favor, corrija os erros destacados no formulário.';
      }
    });
  }

});
