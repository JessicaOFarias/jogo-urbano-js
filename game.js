let somAtivado = true;
let contextoAudio = null;

const botaoSom = document.getElementById("botaoSom");
const sonsEmExecucao = new Set();

function prepararAudio() {
  if (!somAtivado) {
    return;
  }

  try {
    const AudioContextDisponivel =
      window.AudioContext || window.webkitAudioContext;

    if (!AudioContextDisponivel) {
      return;
    }

    if (!contextoAudio) {
      contextoAudio = new AudioContextDisponivel();
    }

    if (contextoAudio.state === "suspended") {
      contextoAudio.resume().catch(() => {});
    }
  } catch {
    // O jogo continua mesmo se o áudio não estiver disponível.
  }
}

function tocarSom(tipo) {
  if (!somAtivado || !contextoAudio || contextoAudio.state !== "running") {
    return;
  }

  const efeitos = {
    retirada: [
      { frequencia: 660, inicio: 0, duracao: 0.09 },
      { frequencia: 880, inicio: 0.1, duracao: 0.13 },
    ],

    entrega: [
      { frequencia: 523, inicio: 0, duracao: 0.1 },
      { frequencia: 659, inicio: 0.12, duracao: 0.1 },
      { frequencia: 784, inicio: 0.24, duracao: 0.2 },
    ],

    colisao: [
      { frequencia: 330, inicio: 0, duracao: 0.15 },
      { frequencia: 220, inicio: 0.16, duracao: 0.22 },
    ],
  };

  const notas = efeitos[tipo];

  if (!notas) {
    return;
  }

  const agora = contextoAudio.currentTime;

  for (const nota of notas) {
    const oscilador = contextoAudio.createOscillator();
    const volume = contextoAudio.createGain();
    const inicio = agora + nota.inicio;
    const fim = inicio + nota.duracao;

    oscilador.type = tipo === "colisao" ? "triangle" : "sine";
    oscilador.frequency.setValueAtTime(nota.frequencia, inicio);

    volume.gain.setValueAtTime(0, inicio);
    volume.gain.linearRampToValueAtTime(0.06, inicio + 0.01);
    volume.gain.linearRampToValueAtTime(0, fim);

    oscilador.connect(volume);
    volume.connect(contextoAudio.destination);

    sonsEmExecucao.add(oscilador);

    oscilador.onended = () => {
      oscilador.disconnect();
      volume.disconnect();
      sonsEmExecucao.delete(oscilador);
    };

    oscilador.start(inicio);
    oscilador.stop(fim);
  }
}

function silenciarEfeitos() {
  for (const oscilador of sonsEmExecucao) {
    oscilador.stop();
  }

  sonsEmExecucao.clear();
}

botaoSom.addEventListener("click", () => {
  somAtivado = !somAtivado;

  botaoSom.textContent = somAtivado ? "Som: ligado" : "Som: desligado";

  botaoSom.setAttribute("aria-pressed", String(somAtivado));

  if (somAtivado) {
    prepararAudio();
  } else {
    silenciarEfeitos();
  }

  canvas.focus();
});

let faseCaminhada = 0;
let personagemAndando = false;
const metaEntregas = 10;
let partidaVencida = false;
const carrosTransito = [
  {
    x: 40,
    inicioX: 40,
    y: 180,
    largura: 60,
    altura: 30,
    velocidade: 3,
    cor: "#ff6b81",
  },
  {
    x: 700,
    inicioX: 700,
    y: 350,
    largura: 60,
    altura: 30,
    velocidade: -4,
    cor: "#38bdf8",
  },
];

let protecaoRestante = 0;
let avisoBatidaRestante = 0;

function reiniciarTransito() {
  for (const carro of carrosTransito) {
    carro.x = carro.inicioX;
  }

  protecaoRestante = 0;
  avisoBatidaRestante = 0;
}

function moverTransito() {
  const nivel = calcularNivel();

  // Cada nível acrescenta 15% à velocidade original.
  const multiplicador = 1 + (nivel - 1) * 0.15;

  for (const carro of carrosTransito) {
    carro.x = carro.x + carro.velocidade * multiplicador;

    if (carro.velocidade > 0 && carro.x > canvas.width) {
      carro.x = -carro.largura;
    } else if (carro.velocidade < 0 && carro.x + carro.largura < 0) {
      carro.x = canvas.width;
    }
  }
}

function verificarBatida() {
  if (protecaoRestante > 0) {
    return false;
  }

  const bateu = carrosTransito.some((carro) =>
    colidiuComRetangulo(carro.x, carro.y, carro.largura, carro.altura),
  );

  if (!bateu) {
    return false;
  }

  tocarSom("colisao");

  tempoRestante = Math.max(0, tempoRestante - 5);
  playerX = 150;
  playerY = 100;

  protecaoRestante = 2;
  avisoBatidaRestante = 2;
  limparTeclas();

  if (tempoRestante <= 0) {
    missaoFalhou = true;
  }

  return true;
}

function desenharTransito() {
  for (const carro of carrosTransito) {
    ctx.save();

    // Espelha o desenho quando o carro anda para a esquerda.
    ctx.translate(
      carro.x + (carro.velocidade < 0 ? carro.largura : 0),
      carro.y,
    );
    ctx.scale(carro.velocidade < 0 ? -1 : 1, 1);

    ctx.fillStyle = "#080b12";
    ctx.fillRect(8, -3, 12, 6);
    ctx.fillRect(40, -3, 12, 6);
    ctx.fillRect(8, 27, 12, 6);
    ctx.fillRect(40, 27, 12, 6);

    ctx.fillStyle = carro.cor;
    ctx.fillRect(0, 0, carro.largura, carro.altura);

    ctx.fillStyle = "#b5efff";
    ctx.fillRect(12, 5, 9, 20);
    ctx.fillRect(38, 5, 10, 20);

    ctx.fillStyle = "#fff3b0";
    ctx.fillRect(56, 3, 4, 6);
    ctx.fillRect(56, 21, 4, 6);

    ctx.fillStyle = "#ff304f";
    ctx.fillRect(0, 3, 3, 6);
    ctx.fillRect(0, 21, 3, 6);

    ctx.restore();
  }
}

function desenharProtecao() {
  if (protecaoRestante <= 0) {
    return;
  }

  ctx.save();
  ctx.strokeStyle = "#ffffff";
  ctx.lineWidth = 2;
  ctx.strokeRect(playerX - 5, playerY - 5, playerSize + 10, playerSize + 10);
  ctx.restore();
}
const duracaoMissao = 60;
let tempoRestante = duracaoMissao;
let missaoFalhou = false;
let playerX = 150;
let playerY = 100;
const playerSize = 30;
const playerSpeed = 5;
let entregaConcluida = false;
let temEncomenda = false;
let passos = 0;

const destinos = [
  { nome: "Residencial Neon", x: 650, y: 340 },
  { nome: "Praça Central", x: 350, y: 120 },
  { nome: "Estação Norte", x: 680, y: 150 },
];

const painelTempo = document.getElementById("painelTempo");

let indiceDestino = 0;
let saldo = 0;
let entregasRealizadas = 0;

const pagamentoPorEntrega = 50;

function chaveDoRecorde() {
  return "cidadeNeonRecordeDestinoV1_" + indiceDestino;
}

function carregarRecorde() {
  try {
    const valorSalvo = localStorage.getItem(chaveDoRecorde());

    if (valorSalvo === null) {
      return null;
    }

    const valor = Number(valorSalvo);

    return Number.isFinite(valor) && valor >= 0 ? valor : null;
  } catch {
    return null;
  }
}

function salvarRecorde() {
  try {
    localStorage.setItem(chaveDoRecorde(), String(recorde));
  } catch {
    // O jogo continua funcionando se o navegador bloquear o armazenamento.
  }
}

let recorde = carregarRecorde();
const predioX = 30;
const predioY = 2;
const predioLargura = 100;
const predioAltura = 20;
const retiradaX = predioX + predioLargura - 40;
const retiradaY = predioY + predioAltura + 5;
const retiradaTamanho = 40;
let entregaX = destinos[indiceDestino].x;
let entregaY = destinos[indiceDestino].y;
const entregaTamanho = 50;
const carroX = 480;
const carroY = 120;
const carroLargura = 70;
const carroAltura = 35;
const oficinaX = 450;
const oficinaY = 270;
const oficinaLargura = 120;
const oficinaAltura = 60;

const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

const telaInicial = document.getElementById("telaInicial");
const botaoJogar = document.getElementById("botaoJogar");
const botaoNovaPartida = document.getElementById("botaoNovaPartida");
const avisoPausa = document.getElementById("avisoPausa");
const areaJogo = document.getElementById("areaJogo");
const painelDestino = document.getElementById("painelDestino");
const painelSaldo = document.getElementById("painelSaldo");
const painelEntregas = document.getElementById("painelEntregas");
const painelMovimentos = document.getElementById("painelMovimentos");
const painelRecorde = document.getElementById("painelRecorde");
const painelMissao = document.getElementById("painelMissao");
const painelNivel = document.getElementById("painelNivel");
const telaVitoria = document.getElementById("telaVitoria");
const tituloVitoria = document.getElementById("tituloVitoria");
const resultadoEntregas = document.getElementById("resultadoEntregas");
const resultadoSaldo = document.getElementById("resultadoSaldo");
const resultadoNivel = document.getElementById("resultadoNivel");
const botaoJogarNovamente = document.getElementById("botaoJogarNovamente");

function calcularNivel() {
  return Math.min(6, 1 + Math.floor(entregasRealizadas / 3));
}

function atualizarPainel() {
  painelDestino.textContent = destinos[indiceDestino].nome;

  painelSaldo.textContent = saldo.toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
  });

  painelEntregas.textContent = entregasRealizadas + " / " + metaEntregas;
  const nivelAtual = calcularNivel();

  if (nivelAtual === 6) {
    painelNivel.textContent = "6 · Máximo";
  } else {
    const faltam = 3 - (entregasRealizadas % 3);

    painelNivel.textContent = nivelAtual + " · Faltam " + faltam;
  }
  painelMovimentos.textContent = passos;
  painelRecorde.textContent = recorde === null ? "—" : recorde;

  painelTempo.textContent = Math.ceil(tempoRestante) + " s";
  painelTempo.style.color = tempoRestante <= 10 ? "#ff6b81" : "#00e5ff";

  let mensagem;
  let cor = "#ffd54a";

  if (missaoFalhou) {
    mensagem =
      "Tempo esgotado! Pressione R para tentar novamente. Seu saldo foi mantido.";
    cor = "#ff6b81";
  } else if (entregaConcluida) {
    mensagem =
      "Entrega concluída! +R$ " +
      pagamentoPorEntrega +
      " · N: próxima entrega · R: repetir.";
    cor = "#4dff88";
  } else if (avisoBatidaRestante > 0) {
    mensagem =
      "Batida! −5 segundos. Você voltou ao início e está protegido por 2 segundos.";
    cor = "#ff6b81";
  } else if (temEncomenda) {
    mensagem =
      "Etapa 2 de 2: leve a encomenda ao ponto verde — " +
      destinos[indiceDestino].nome +
      ".";
  } else {
    mensagem =
      "Etapa 1 de 2: entre no quadrado amarelo da loja para retirar a encomenda.";
  }

  if (painelMissao.textContent !== mensagem) {
    painelMissao.textContent = mensagem;
  }

  painelMissao.style.borderLeftColor = cor;

  document.getElementById("botaoProxima").disabled =
    !entregaConcluida || partidaVencida;
}
let jogoIniciado = false;
const teclas = {};

function limparTeclas() {
  for (const tecla in teclas) {
    teclas[tecla] = false;
  }

  limparControlesToque();
}
botaoJogar.addEventListener("click", () => {
  abrirJogo();
});

// Botão Nova partida
function iniciarNovaPartida() {
  partidaVencida = false;
  saldo = 0;
  entregasRealizadas = 0;
  indiceDestino = 0;

  entregaX = destinos[indiceDestino].x;
  entregaY = destinos[indiceDestino].y;
  recorde = carregarRecorde();

  telaVitoria.hidden = true;
  botaoJogar.textContent = "Continuar";

  reiniciarMissao();
  abrirJogo();
}

botaoNovaPartida.addEventListener("click", iniciarNovaPartida);
botaoJogarNovamente.addEventListener("click", iniciarNovaPartida);

function mostrarVitoria() {
  partidaVencida = true;
  jogoIniciado = false;
  limparTeclas();

  areaJogo.hidden = true;
  telaInicial.hidden = true;
  telaVitoria.hidden = false;

  resultadoEntregas.textContent = entregasRealizadas;
  resultadoSaldo.textContent = saldo.toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
  });
  resultadoNivel.textContent = calcularNivel();
  document.getElementById("mensagemVitoria").textContent =
    "Você concluiu " + entregasRealizadas + " entregas. Trabalho finalizado!";

  tituloVitoria.focus();
}

function abrirJogo() {
  prepararAudio();
  limparTeclas();
  avisoPausa.hidden = true;
  telaInicial.hidden = true;
  areaJogo.hidden = false;
  jogoIniciado = true;
  canvas.focus();
  desenhar();
}

function abrirMenu() {
  silenciarEfeitos();
  limparTeclas();
  jogoIniciado = false;
  areaJogo.hidden = true;
  telaInicial.hidden = false;
  avisoPausa.hidden = false;
  botaoJogar.textContent = "Continuar";
  botaoNovaPartida.hidden = false;
  botaoJogar.focus();
}

function reiniciarMissao() {
  passos = 0;
  entregaConcluida = false;
  temEncomenda = false;
  missaoFalhou = false;
  tempoRestante = duracaoMissao;

  playerX = 150;
  playerY = 100;

  limparTeclas();
  reiniciarTransito();
}

function proximaMissao() {
  if (entregaConcluida === false) {
    return;
  }

  indiceDestino = (indiceDestino + 1) % destinos.length;

  entregaX = destinos[indiceDestino].x;
  entregaY = destinos[indiceDestino].y;
  recorde = carregarRecorde();

  limparTeclas();
  reiniciarMissao();
}

function desenharRetirada() {
  if (temEncomenda || entregaConcluida) {
    return;
  }

  ctx.save();

  ctx.fillStyle = "rgba(255, 213, 74, 0.18)";
  ctx.fillRect(retiradaX, retiradaY, retiradaTamanho, retiradaTamanho);

  ctx.strokeStyle = "#ffd54a";
  ctx.lineWidth = 2;
  ctx.shadowColor = "#ffd54a";
  ctx.shadowBlur = 8;
  ctx.strokeRect(retiradaX, retiradaY, retiradaTamanho, retiradaTamanho);
  ctx.shadowBlur = 0;

  ctx.fillStyle = "#c58b45";
  ctx.fillRect(retiradaX + 11, retiradaY + 12, 18, 18);

  ctx.fillStyle = "#f4d19b";
  ctx.fillRect(retiradaX + 18, retiradaY + 12, 4, 18);

  // Placa ao lado da faixa de pedestres.
  const placaX = retiradaX + retiradaTamanho + 45;

  ctx.fillStyle = "#10121f";
  ctx.fillRect(placaX - 5, retiradaY + 8, 88, 24);

  ctx.fillStyle = "#ffd54a";
  ctx.font = "bold 12px Arial";
  ctx.fillText("RETIRADA", placaX, retiradaY + 24);

  ctx.restore();
}

function desenharFaixa(x, largura, cor, inicioY = 35) {
  ctx.fillStyle = cor;

  for (let y = inicioY; y < canvas.height - 25; y += 30) {
    ctx.fillRect(x, y, largura, 15);
  }
}

function desenharCarro(cor) {
  ctx.fillStyle = "#080b12";
  ctx.fillRect(carroX + 10, carroY - 4, 12, 8);
  ctx.fillRect(carroX + 48, carroY - 4, 12, 8);
  ctx.fillRect(carroX + 10, carroY + carroAltura - 4, 12, 8);
  ctx.fillRect(carroX + 48, carroY + carroAltura - 4, 12, 8);

  ctx.fillStyle = cor;
  ctx.fillRect(carroX, carroY, carroLargura, carroAltura);
  ctx.fillStyle = "#8de8ff";
  ctx.fillRect(carroX + 45, carroY + 5, 10, carroAltura - 10);
  ctx.fillRect(carroX + 15, carroY + 5, 8, carroAltura - 10);
  ctx.fillStyle = "#fff3b0";
  ctx.shadowColor = "#fff3b0";
  ctx.shadowBlur = 10;

  ctx.fillRect(carroX + carroLargura - 4, carroY + 4, 4, 7);
  ctx.fillRect(carroX + carroLargura - 4, carroY + carroAltura - 11, 4, 7);

  ctx.shadowBlur = 0;

  ctx.fillStyle = "#ff3b5c";
  ctx.fillRect(carroX, carroY + 4, 4, 7);
  ctx.fillRect(carroX, carroY + carroAltura - 11, 4, 7);
}

function desenharDestino() {
  ctx.save();

  const ativo = temEncomenda && !entregaConcluida;
  const cor = entregaConcluida ? "#8de8ff" : ativo ? "#4dff88" : "#8892a6";

  ctx.fillStyle = ativo ? "rgba(77, 255, 136, 0.16)" : "rgba(16, 18, 31, 0.75)";
  ctx.fillRect(entregaX, entregaY, entregaTamanho, entregaTamanho);

  ctx.strokeStyle = cor;
  ctx.lineWidth = 3;
  ctx.shadowColor = cor;
  ctx.shadowBlur = ativo ? 12 : 0;
  ctx.strokeRect(entregaX, entregaY, entregaTamanho, entregaTamanho);
  ctx.shadowBlur = 0;

  if (entregaConcluida) {
    // Símbolo de confirmação.
    ctx.beginPath();
    ctx.moveTo(entregaX + 13, entregaY + 25);
    ctx.lineTo(entregaX + 22, entregaY + 34);
    ctx.lineTo(entregaX + 38, entregaY + 16);
    ctx.stroke();
  } else {
    // Marca indicando onde parar.
    ctx.beginPath();
    ctx.arc(
      entregaX + entregaTamanho / 2,
      entregaY + entregaTamanho / 2,
      12,
      0,
      Math.PI * 2,
    );
    ctx.stroke();

    ctx.fillStyle = cor;
    ctx.fillRect(entregaX + 22, entregaY + 22, 6, 6);
  }

  ctx.fillStyle = "#10121f";
  ctx.fillRect(entregaX - 5, entregaY - 25, 90, 20);

  ctx.fillStyle = cor;
  ctx.font = "bold 11px Arial";
  ctx.fillText(
    entregaConcluida ? "ENTREGUE!" : "ENTREGA",
    entregaX,
    entregaY - 11,
  );

  ctx.restore();
}

function desenharLoja() {
  ctx.save();

  ctx.fillStyle = "#101a2c";
  ctx.fillRect(predioX, predioY, predioLargura, predioAltura);

  // Letreiro.
  ctx.fillStyle = "#080b12";
  ctx.fillRect(predioX + 4, predioY + 3, 60, 14);

  ctx.font = "bold 10px Arial";
  ctx.fillStyle = "#00e5ff";
  ctx.shadowColor = "#00e5ff";
  ctx.shadowBlur = 6;
  ctx.fillText("NEON BOX", predioX + 6, predioY + 14);
  ctx.shadowBlur = 0;

  // Vitrine.
  ctx.fillStyle = "#16465c";
  ctx.fillRect(predioX + 69, predioY + 4, 25, 12);

  ctx.fillStyle = "#8de8ff";
  ctx.fillRect(predioX + 71, predioY + 5, 2, 9);
  ctx.fillRect(predioX + 81, predioY + 5, 2, 10);

  // Contorno luminoso.
  ctx.strokeStyle = "#00e5ff";
  ctx.lineWidth = 2;
  ctx.strokeRect(predioX, predioY, predioLargura, predioAltura);

  ctx.restore();
}

function desenharPersonagem(cor) {
  ctx.save();
  ctx.translate(playerX, playerY);

  // Sombra.
  ctx.fillStyle = "rgba(0, 0, 0, 0.35)";
  ctx.beginPath();
  ctx.ellipse(15, 26, 14, 4, 0, 0, Math.PI * 2);
  ctx.fill();

  // Sapatos e calça animados.
  const animando =
    personagemAndando &&
    jogoIniciado &&
    !entregaConcluida &&
    !missaoFalhou &&
    !partidaVencida;

  const balanco = animando ? Math.round(Math.sin(faseCaminhada) * 2) : 0;

  ctx.fillStyle = "#526078";
  ctx.fillRect(7, 20, 6, 6 + balanco);
  ctx.fillRect(17, 20, 6, 6 - balanco);

  ctx.fillStyle = "#080b12";
  ctx.fillRect(6, 25 + balanco, 7, 3);
  ctx.fillRect(17, 25 - balanco, 7, 3);

  // Uniforme.
  ctx.fillStyle = cor;
  ctx.fillRect(5, 12, 20, 11);

  // Braços.
  ctx.fillStyle = "#d99b72";
  ctx.fillRect(2, 14, 4, 8);
  ctx.fillRect(24, 14, 4, 8);

  // Rosto.
  ctx.fillRect(8, 4, 14, 9);

  // Boné e aba.
  ctx.fillStyle = "#00e5ff";
  ctx.fillRect(7, 0, 16, 5);
  ctx.fillRect(7, 4, 21, 3);

  // Olhos.
  ctx.fillStyle = "#10121f";
  ctx.fillRect(11, 8, 2, 2);
  ctx.fillRect(18, 8, 2, 2);

  // Alça da bolsa.
  ctx.fillStyle = "#283246";
  ctx.fillRect(9, 13, 3, 9);

  // Bolsa de entregas.
  const carregando = temEncomenda && !entregaConcluida;
  ctx.fillStyle = carregando ? "#c58b45" : "#283246";
  ctx.fillRect(12, 16, 12, 10);

  ctx.strokeStyle = carregando ? "#ffd54a" : "#8de8ff";
  ctx.lineWidth = 1;
  ctx.strokeRect(12.5, 16.5, 11, 9);

  ctx.fillStyle = carregando ? "#f4d19b" : "#00e5ff";
  ctx.fillRect(17, 17, 3, 8);

  ctx.restore();
}

function desenharPredio(x, y, largura, altura, corBorda) {
  ctx.fillStyle = "#181d35";
  ctx.fillRect(x, y, largura, altura);

  ctx.strokeStyle = corBorda;
  ctx.lineWidth = 2;
  ctx.shadowColor = corBorda;
  ctx.shadowBlur = 10;

  ctx.strokeRect(x, y, largura, altura);

  ctx.shadowBlur = 0;
}

function desenharOficina() {
  ctx.save();

  desenharPredio(oficinaX, oficinaY, oficinaLargura, oficinaAltura, "#ff2bd6");

  ctx.fillStyle = "#080b12";
  ctx.fillRect(oficinaX + 7, oficinaY + 5, oficinaLargura - 14, 18);

  ctx.font = "bold 12px Arial";
  ctx.textAlign = "center";
  ctx.fillStyle = "#ff8ce8";
  ctx.shadowColor = "#ff2bd6";
  ctx.shadowBlur = 6;
  ctx.fillText("NEON GARAGE", oficinaX + oficinaLargura / 2, oficinaY + 18);
  ctx.shadowBlur = 0;

  // Janelas laterais.
  for (const deslocamento of [8, 98]) {
    ctx.fillStyle = "#16465c";
    ctx.fillRect(oficinaX + deslocamento, oficinaY + 31, 14, 20);

    ctx.fillStyle = "#8de8ff";
    ctx.fillRect(oficinaX + deslocamento + 2, oficinaY + 33, 10, 6);
    ctx.fillRect(oficinaX + deslocamento + 2, oficinaY + 42, 10, 6);
  }

  // Portão.
  ctx.fillStyle = "#526078";
  ctx.fillRect(oficinaX + 30, oficinaY + 29, 60, 31);

  ctx.fillStyle = "#283246";
  for (let linha = 0; linha < 5; linha++) {
    ctx.fillRect(oficinaX + 30, oficinaY + 32 + linha * 6, 60, 2);
  }

  ctx.fillStyle = "#ffd54a";
  ctx.fillRect(oficinaX + 30, oficinaY + 57, 60, 3);

  ctx.restore();
}
function desenhar() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // Asfalto e calçadas.
  ctx.fillStyle = "#20232e";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  ctx.fillStyle = "#303b57";
  ctx.fillRect(0, 0, canvas.width, 25);
  ctx.fillRect(0, canvas.height - 25, canvas.width, 25);

  // Iluminação neon.
  ctx.fillStyle = "#00e5ff";
  ctx.shadowColor = "#00e5ff";
  ctx.shadowBlur = 12;
  ctx.fillRect(0, 23, canvas.width, 2);
  ctx.fillRect(0, canvas.height - 25, canvas.width, 2);
  ctx.shadowBlur = 0;

  ctx.fillStyle = "#ff2bd6";
  ctx.globalAlpha = 0.2;
  ctx.fillRect(0, canvas.height / 2 - 6, canvas.width, 12);
  ctx.globalAlpha = 1;
  ctx.fillRect(0, canvas.height / 2 - 1, canvas.width, 2);

  desenharFaixa(280, 60, "#e6edf7");
  desenharFaixa(100, 60, "#ffe08a", 95);

  desenharLoja();
  desenharOficina();
  desenharRetirada();
  desenharDestino();

  desenharCarro(entregaConcluida ? "#4dff88" : "#b83dff");

  // Carros em movimento, desenhados sobre o asfalto.
  desenharTransito();

  desenharPersonagem("#ffd54a");
  desenharProtecao();

  atualizarPainel();
}

desenhar();

function colidiuComRetangulo(x, y, largura, altura) {
  return (
    playerX < x + largura &&
    playerX + playerSize > x &&
    playerY < y + altura &&
    playerY + playerSize > y
  );
}
function colidiuComObstaculo() {
  const colidiuComLoja = colidiuComRetangulo(
    predioX,
    predioY,
    predioLargura,
    predioAltura,
  );

  const colidiuComCarro = colidiuComRetangulo(
    carroX,
    carroY,
    carroLargura,
    carroAltura,
  );

  const colidiuComOficina = colidiuComRetangulo(
    oficinaX,
    oficinaY,
    oficinaLargura,
    oficinaAltura,
  );

  return colidiuComLoja || colidiuComCarro || colidiuComOficina;
}

function atualizar() {
  personagemAndando = false;

  if (!jogoIniciado || partidaVencida || entregaConcluida || missaoFalhou) {
    return;
  }

  const segundos = intervaloMovimento / 1000;

  tempoRestante = Math.max(0, tempoRestante - segundos);
  protecaoRestante = Math.max(0, protecaoRestante - segundos);
  avisoBatidaRestante = Math.max(0, avisoBatidaRestante - segundos);

  if (tempoRestante <= 0) {
    missaoFalhou = true;
    limparTeclas();
    return;
  }

  moverTransito();

  // Detecta também quando um carro atinge o personagem parado.
  if (verificarBatida()) {
    return;
  }

  const oldX = playerX;
  const oldY = playerY;
  let passo = playerSpeed;

  if (teclaPressionada("Shift")) {
    passo = playerSpeed * 2;
  }

  const direcaoX =
    Number(teclaPressionada("ArrowRight")) -
    Number(teclaPressionada("ArrowLeft"));

  const direcaoY =
    Number(teclaPressionada("ArrowDown")) - Number(teclaPressionada("ArrowUp"));

  if (direcaoX !== 0 && direcaoY !== 0) {
    passo = passo / Math.sqrt(2);
  }

  playerX = playerX + direcaoX * passo;
  playerX = Math.max(0, Math.min(playerX, canvas.width - playerSize));

  if (colidiuComObstaculo()) {
    playerX = oldX;
  }

  playerY = playerY + direcaoY * passo;
  playerY = Math.max(0, Math.min(playerY, canvas.height - playerSize));

  if (colidiuComObstaculo()) {
    playerY = oldY;
  }

  if (playerX !== oldX || playerY !== oldY) {
    passos = passos + 1;
    personagemAndando = true;

    const distancia = Math.hypot(playerX - oldX, playerY - oldY);
    faseCaminhada = (faseCaminhada + distancia * 0.12) % (Math.PI * 2);
  }

  // Detecta quando o personagem se move contra um carro.
  if (verificarBatida()) {
    return;
  }

  if (
    temEncomenda === false &&
    playerX >= retiradaX &&
    playerX + playerSize <= retiradaX + retiradaTamanho &&
    playerY >= retiradaY &&
    playerY + playerSize <= retiradaY + retiradaTamanho
  ) {
    temEncomenda = true;
    tocarSom("retirada");
  }

  if (
    temEncomenda === true &&
    playerX >= entregaX &&
    playerX + playerSize <= entregaX + entregaTamanho &&
    playerY >= entregaY &&
    playerY + playerSize <= entregaY + entregaTamanho
  ) {
    entregaConcluida = true;
    temEncomenda = false;

    saldo = saldo + pagamentoPorEntrega;
    entregasRealizadas = entregasRealizadas + 1;
    tocarSom("entrega");

    if (recorde === null || passos < recorde) {
      recorde = passos;
      salvarRecorde();
    }
  }
  if (entregasRealizadas >= metaEntregas) {
    mostrarVitoria();
  }
}

document.addEventListener("keydown", (e) => {
  teclas[e.key] = true;
  if (jogoIniciado === false) {
    return;
  }

  if (e.key === "Escape") {
    abrirMenu();
    botaoJogar.focus();
    return;
  }
  // Vamos colocar o movimento aqui

  if (
    e.key === "ArrowRight" ||
    e.key === "ArrowLeft" ||
    e.key === "ArrowUp" ||
    e.key === "ArrowDown"
  ) {
    e.preventDefault();
  }

  if ((e.key === "r" || e.key === "R") && e.repeat === false) {
    reiniciarMissao();
  }

  if ((e.key === "n" || e.key === "N") && e.repeat === false) {
    proximaMissao();
  }

  desenhar();
});

document.addEventListener("keyup", (e) => {
  teclas[e.key] = false;
});

window.addEventListener("blur", () => {
  limparTeclas();

  if (jogoIniciado === true) {
    abrirMenu();
  }
});

let tempoAnterior = null;
let tempoAcumulado = 0;
const intervaloMovimento = 1000 / 30;

function animar(tempoAtual) {
  if (tempoAnterior === null) {
    tempoAnterior = tempoAtual;
  }

  const tempoPassado = Math.min(tempoAtual - tempoAnterior, 100);
  tempoAnterior = tempoAtual;

  if (jogoIniciado === true) {
    tempoAcumulado = tempoAcumulado + tempoPassado;

    while (tempoAcumulado >= intervaloMovimento) {
      atualizar();
      tempoAcumulado = tempoAcumulado - intervaloMovimento;
    }

    desenhar();
  } else {
    tempoAcumulado = 0;
  }

  requestAnimationFrame(animar);
}

requestAnimationFrame(animar);

const comandosToque = new Map();
const botoesToque = document.querySelectorAll("[data-tecla]");
const botaoPausar = document.getElementById("botaoPausar");
const botaoReiniciar = document.getElementById("botaoReiniciar");
const botaoProxima = document.getElementById("botaoProxima");

function teclaPressionada(tecla) {
  return (
    teclas[tecla] === true || Array.from(comandosToque.values()).includes(tecla)
  );
}

function limparControlesToque() {
  comandosToque.clear();

  for (const botao of botoesToque) {
    botao.classList.remove("pressionado");
  }
}

for (const botao of botoesToque) {
  botao.addEventListener("pointerdown", (evento) => {
    if (
      evento.button !== 0 ||
      !jogoIniciado ||
      entregaConcluida ||
      missaoFalhou ||
      partidaVencida
    ) {
      return;
    }

    evento.preventDefault();
    prepararAudio();

    botao.setPointerCapture(evento.pointerId);
    comandosToque.set(evento.pointerId, botao.dataset.tecla);
    botao.classList.add("pressionado");
  });

  function soltarBotao(evento) {
    comandosToque.delete(evento.pointerId);

    const aindaPressionado = Array.from(comandosToque.values()).includes(
      botao.dataset.tecla,
    );

    botao.classList.toggle("pressionado", aindaPressionado);
  }

  botao.addEventListener("pointerup", soltarBotao);
  botao.addEventListener("pointercancel", soltarBotao);
  botao.addEventListener("lostpointercapture", soltarBotao);

  botao.addEventListener("contextmenu", (evento) => {
    evento.preventDefault();
  });
}

botaoPausar.addEventListener("click", () => {
  if (jogoIniciado) {
    abrirMenu();
  }
});

botaoReiniciar.addEventListener("click", () => {
  if (!jogoIniciado || partidaVencida) {
    return;
  }

  reiniciarMissao();
  desenhar();
  canvas.focus({ preventScroll: true });
});

botaoProxima.addEventListener("click", () => {
  if (!jogoIniciado || !entregaConcluida || partidaVencida) {
    return;
  }

  proximaMissao();
  desenhar();
  canvas.focus({ preventScroll: true });
});

document.addEventListener("visibilitychange", () => {
  if (document.hidden) {
    limparTeclas();

    if (jogoIniciado) {
      abrirMenu();
    }
  }
});
