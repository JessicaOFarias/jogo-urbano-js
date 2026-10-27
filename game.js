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

function calcularNivel() {
  return Math.min(6, 1 + Math.floor(entregasRealizadas / 3));
}

function atualizarPainel() {
  painelDestino.textContent = destinos[indiceDestino].nome;

  painelSaldo.textContent = saldo.toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
  });

  painelEntregas.textContent = entregasRealizadas;
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
}
let jogoIniciado = false;
const teclas = {};

function limparTeclas() {
  for (const tecla in teclas) {
    teclas[tecla] = false;
  }
}
botaoJogar.addEventListener("click", () => {
  abrirJogo();
});

// Botão Nova partida
botaoNovaPartida.addEventListener("click", () => {
  saldo = 0;
  entregasRealizadas = 0;
  indiceDestino = 0;

  entregaX = destinos[indiceDestino].x;
  entregaY = destinos[indiceDestino].y;
  recorde = carregarRecorde();

  reiniciarMissao();
  botaoJogar.textContent = "Continuar";
  abrirJogo();
});

function abrirJogo() {
  limparTeclas();
  avisoPausa.hidden = true;
  telaInicial.hidden = true;
  areaJogo.hidden = false;
  jogoIniciado = true;
  canvas.focus();
  desenhar();
}

function abrirMenu() {
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
  if (temEncomenda === false && entregaConcluida === false) {
    ctx.strokeStyle = "#ffd54a";
    ctx.lineWidth = 2;
    ctx.strokeRect(retiradaX, retiradaY, retiradaTamanho, retiradaTamanho);

    ctx.fillStyle = "#ffd54a";
    ctx.font = "12px Arial";
    ctx.fillText("RETIRADA", retiradaX + retiradaTamanho + 45, retiradaY + 24);
  }
}

function desenharFaixa(x, largura, cor) {
  ctx.fillStyle = cor;

  for (let y = 35; y < canvas.height - 25; y = y + 30) {
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
  if (entregaConcluida === true) {
    ctx.strokeStyle = "#8892a6";
  } else if (temEncomenda === true) {
    ctx.strokeStyle = "#4dff88";
  } else {
    ctx.strokeStyle = "#8892a6";
  }

  ctx.lineWidth = 3;
  ctx.strokeRect(entregaX, entregaY, entregaTamanho, entregaTamanho);
  if (temEncomenda === true && entregaConcluida === false) {
    ctx.fillStyle = "#c58b45";
    ctx.fillRect(entregaX + 15, entregaY + 15, 20, 20);

    ctx.fillStyle = "#f4d19b";
    ctx.fillRect(entregaX + 23, entregaY + 15, 4, 20);
  }

  ctx.fillStyle = "#ffffff";
  ctx.font = "12px Arial";
  ctx.fillText("ENTREGA", entregaX, entregaY - 10);
}

function desenharLoja() {
  ctx.fillStyle = "#181d35";
  ctx.fillRect(predioX, predioY, predioLargura, predioAltura);
  ctx.fillStyle = "#00e5ff";
  ctx.fillRect(
    predioX + predioLargura - 20,
    predioY + predioAltura - 10,
    12,
    10,
  );

  ctx.strokeStyle = "#00e5ff";
  ctx.lineWidth = 2;
  ctx.strokeRect(predioX, predioY, predioLargura, predioAltura);

  ctx.fillStyle = "#ffffff";
  ctx.font = "12px Arial";
  ctx.fillText("LOJA", predioX + 8, predioY + 14);
}

function desenharPersonagem(cor) {
  ctx.fillStyle = cor;
  ctx.fillRect(playerX, playerY, playerSize, playerSize);

  ctx.strokeStyle = "#10121f";
  ctx.lineWidth = 2;
  ctx.strokeRect(playerX, playerY, playerSize, playerSize);

  if (temEncomenda === true && entregaConcluida === false) {
    ctx.fillStyle = "#8b5a2b";
    ctx.fillRect(playerX + 8, playerY + 12, 14, 12);
  }

  ctx.fillStyle = "#10121f";
  ctx.fillRect(playerX + 7, playerY + 5, 4, 4);
  ctx.fillRect(playerX + 19, playerY + 5, 4, 4);
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
  desenharPredio(oficinaX, oficinaY, oficinaLargura, oficinaAltura, "#ff2bd6");

  ctx.fillStyle = "#ffffff";
  ctx.font = "14px Arial";
  ctx.fillText("OFICINA", oficinaX + 10, oficinaY + 25);

  ctx.fillStyle = "#526078";
  ctx.fillRect(oficinaX + 30, oficinaY + oficinaAltura - 24, 60, 24);

  ctx.fillStyle = "#283246";

  for (let linha = 1; linha <= 3; linha = linha + 1) {
    ctx.fillRect(
      oficinaX + 30,
      oficinaY + oficinaAltura - 24 + linha * 6,
      60,
      1,
    );
  }
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
  desenharFaixa(100, 60, "#ffe08a");

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
  if (entregaConcluida || missaoFalhou) {
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

  if (teclas["Shift"] === true) {
    passo = playerSpeed * 2;
  }

  const direcaoX =
    Number(teclas["ArrowRight"] === true) -
    Number(teclas["ArrowLeft"] === true);

  const direcaoY =
    Number(teclas["ArrowDown"] === true) - Number(teclas["ArrowUp"] === true);

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

    if (recorde === null || passos < recorde) {
      recorde = passos;
      salvarRecorde();
    }
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
