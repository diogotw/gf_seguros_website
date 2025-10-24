// ===== ROLAGEM SUAVE PARA LINKS DE NAVEGAÇÃO =====
document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
  anchor.addEventListener("click", function (e) {
    e.preventDefault();

    const alvoId = this.getAttribute("href");
    const elementoAlvo = document.querySelector(alvoId);

    if (elementoAlvo) {
      const deslocamentoCabecalho = 80;
      const posicaoElemento = elementoAlvo.getBoundingClientRect().top;
      const posicaoComOffset =
        posicaoElemento + window.pageYOffset - deslocamentoCabecalho;

      window.scrollTo({
        top: posicaoComOffset,
        behavior: "smooth",
      });

      // Fecha o menu mobile se estiver aberto
      if (navegacaoMenu) navegacaoMenu.classList.remove("show-menu");
    }
  });
});

// ===== TOGGLE DO MENU MOBILE =====
const navegacaoToggle = document.getElementById("navegacao-toggle");
const navegacaoMenu = document.getElementById("navegacao-menu");

if (navegacaoToggle) {
  navegacaoToggle.addEventListener("click", () => {
    navegacaoMenu.classList.toggle("show-menu");
  });
}

// Fecha o menu ao clicar em um link
const navegacaoLinks = document.querySelectorAll(".navegacao__link");
navegacaoLinks.forEach((link) => {
  link.addEventListener("click", () => {
    if (navegacaoMenu) navegacaoMenu.classList.remove("show-menu");
  });
});

// ===== EFEITO NO CABEÇALHO AO ROLAR =====
const cabecalho = document.getElementById("cabecalho");

function rolarCabecalho() {
  if (!cabecalho) return;
  if (window.scrollY >= 50) {
    cabecalho.classList.add("scroll-header");
  } else {
    cabecalho.classList.remove("scroll-header");
  }
}

window.addEventListener("scroll", rolarCabecalho);

// ===== ANIMAÇÕES AO ROLAR (INTERSECTION OBSERVER) =====
const opcoesObservador = {
  threshold: 0.15,
  rootMargin: "0px 0px -50px 0px",
};

const observador = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.classList.add("animate");

      // Animação com stagger para cartões de serviço
      if (entry.target.classList.contains("servico__cartao")) {
        const cartoes = document.querySelectorAll(".servico__cartao");
        cartoes.forEach((card, index) => {
          setTimeout(() => {
            card.classList.add("animate");
          }, index * 100);
        });
      }
    }
  });
}, opcoesObservador);

// Seleciona elementos que devem animar ao aparecer na tela
const animarAoRolar = document.querySelectorAll(
  ".sobre__text, .sobre__image, .servico__cartao, .contato__cartao, .contato__whatsapp"
);

animarAoRolar.forEach((elemento) => {
  observador.observe(elemento);
});

// ===== DESTAQUE DA SEÇÃO ATIVA NO MENU =====
const secoes = document.querySelectorAll("section[id]");

function destacarSecao() {
  const scrollY = window.pageYOffset;

  secoes.forEach((current) => {
    const alturaSecao = current.offsetHeight;
    const topoSecao = current.offsetTop - 150;
    const idSecao = current.getAttribute("id");
    const linkNav = document.querySelector(
      `.navegacao__link[href*="${idSecao}"]`
    );

    if (linkNav) {
      if (scrollY > topoSecao && scrollY <= topoSecao + alturaSecao) {
        linkNav.classList.add("active-link");
      } else {
        linkNav.classList.remove("active-link");
      }
    }
  });
}

window.addEventListener("scroll", destacarSecao);

// ===== EFEITO PARALLAX NO DESTAQUE =====
const destaque = document.querySelector(".destaque");

window.addEventListener("scroll", () => {
  const scrolled = window.pageYOffset;
  const velocidadeParallax = 0.5;

  if (destaque && scrolled < destaque.offsetHeight) {
    destaque.style.transform = `translateY(${scrolled * velocidadeParallax}px)`;
  }
});

// ===== ANIMAÇÃO DE CONTADOR PARA ESTATÍSTICAS =====
function animarContador(elemento, alvo, duracao = 2000) {
  let inicio = 0;
  const incremento = alvo / (duracao / 16);

  const contador = setInterval(() => {
    inicio += incremento;
    if (inicio >= alvo) {
      elemento.textContent =
        alvo + (elemento.textContent.includes("+") ? "+" : "");
      clearInterval(contador);
    } else {
      elemento.textContent =
        Math.floor(inicio) + (elemento.textContent.includes("+") ? "+" : "");
    }
  }, 16);
}

// Observa a seção de estatísticas para iniciar o contador
const observadorEstatisticas = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        const numeros = entry.target.querySelectorAll(".estatistica__numero");
        numeros.forEach((num) => {
          const texto = num.textContent;
          const temMais = texto.includes("+");
          const numero = parseInt(texto.replace(/\D/g, ""));

          if (numero && !num.classList.contains("counted")) {
            num.classList.add("counted");
            num.textContent = "0" + (temMais ? "+" : "");
            animarContador(num, numero);
          }
        });
        observadorEstatisticas.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.5 }
);

const secaoEstatisticas = document.querySelector(".sobre__stats");
if (secaoEstatisticas) {
  observadorEstatisticas.observe(secaoEstatisticas);
}

// ===== EFEITO SUAVE AO PASSAR O MOUSE NOS CARTÕES =====
const cartoes = document.querySelectorAll(".servico__cartao, .destaque__card");

cartoes.forEach((card) => {
  card.addEventListener("mouseenter", function () {
    this.style.transition = "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)";
  });

  card.addEventListener("mousemove", function (e) {
    const rect = this.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    const rotateX = (y - centerY) / 20;
    const rotateY = (centerX - x) / 20;

    this.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-10px)`;
  });

  card.addEventListener("mouseleave", function () {
    this.style.transform =
      "perspective(1000px) rotateX(0) rotateY(0) translateY(0)";
  });
});

// ===== EVITA PULO DE ROLAGEM AO CARREGAR COM HASH =====
window.addEventListener("load", () => {
  if (window.location.hash) {
    setTimeout(() => {
      const alvo = document.querySelector(window.location.hash);
      if (alvo) {
        const deslocamentoCabecalho = 80;
        const posicaoElemento = alvo.getBoundingClientRect().top;
        const posicaoComOffset =
          posicaoElemento + window.pageYOffset - deslocamentoCabecalho;

        window.scrollTo({
          top: posicaoComOffset,
          behavior: "smooth",
        });
      }
    }, 100);
  }
});

// ===== ANIMAÇÃO DO BOTÃO FLUTUANTE DO WHATSAPP =====
const whatsappFloat = document.querySelector(".whatsapp-float");

if (whatsappFloat) {
  window.addEventListener("scroll", () => {
    if (window.pageYOffset > 300) {
      whatsappFloat.style.opacity = "1";
      whatsappFloat.style.visibility = "visible";
    } else {
      whatsappFloat.style.opacity = "0";
      whatsappFloat.style.visibility = "hidden";
    }
  });

  // Estado inicial
  if (window.pageYOffset <= 300) {
    whatsappFloat.style.opacity = "0";
    whatsappFloat.style.visibility = "hidden";
  }
}

// ===== LAZY LOADING PARA IMAGENS =====
if ("IntersectionObserver" in window) {
  const imageObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        const img = entry.target;
        img.src = img.dataset.src;
        img.classList.add("loaded");
        observer.unobserve(img);
      }
    });
  });

  const images = document.querySelectorAll("img[data-src]");
  images.forEach((img) => imageObserver.observe(img));
}

// ===== VALIDAÇÃO DE E-MAIL (se formulário for adicionado) =====
function validarEmail(email) {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email);
}


