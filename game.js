let playerX = 150;
let playerY = 100;
const playerSize = 30;
const playerSpeed = 5;
let entregaConcluida = false;
let temEncomenda = false;
let passos = 0;
let recorde = null;

const recordeSalvo = localStorage.getItem("cidadeNeonRecordeRetirada");

if (recordeSalvo !== null) {
  recorde = Number(recordeSalvo);
}
const predioX = 30;
const predioY = 2;
const predioLargura = 100;
const predioAltura = 20;
const retiradaX = predioX + predioLargura - 40;
const retiradaY = predioY + predioAltura + 5;
const retiradaTamanho = 40;
const entregaX = 650;
const entregaY = 340;
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
  reiniciarMissao();
  botaoJogar.textContent = "Continuar";
  abrirJogo();
});

function abrirJogo() {
  limparTeclas();
  avisoPausa.hidden = true;
  telaInicial.hidden = true;
  canvas.hidden = false;
  jogoIniciado = true;
  canvas.focus();
  desenhar();
}

function abrirMenu() {
  limparTeclas();
  jogoIniciado = false;
  avisoPausa.hidden = false;
  canvas.hidden = true;
  telaInicial.hidden = false;
  botaoJogar.textContent = "Continuar";
  botaoNovaPartida.hidden = false;
}

function reiniciarMissao() {
  passos = 0;
  entregaConcluida = false;
  temEncomenda = false;
  playerX = 150;
  playerY = 100;
}

function desenharRetirada() {
  if (temEncomenda === false && entregaConcluida === false) {
    ctx.strokeStyle = "#ffd54a";
    ctx.lineWidth = 2;
    ctx.strokeRect(retiradaX, retiradaY, retiradaTamanho, retiradaTamanho);

    ctx.fillStyle = "#ffd54a";
    ctx.font = "12px Arial";
    ctx.fillText("RETIRADA", retiradaX + retiradaTamanho + 8, retiradaY + 24);
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

  // Pinta o asfalto
  ctx.fillStyle = "#20232e";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // Desenha a faixa clara

  ctx.fillStyle = "#303b57";
  ctx.fillRect(0, 0, canvas.width, 25);
  ctx.fillRect(0, canvas.height - 25, canvas.width, 25);

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

  desenharLoja();
  desenharOficina();
  desenharRetirada();

  desenharFaixa(280, 60, "#e6edf7");
  desenharFaixa(100, 60, "#ffe08a");

  desenharDestino();

  if (entregaConcluida === true) {
    desenharCarro("#4dff88");
  } else {
    desenharCarro("#b83dff");
  }
  desenharPersonagem("#ffd54a");

  ctx.fillStyle = "#ffffff";
  ctx.font = "14px Arial";
  ctx.fillText(
    "Setas: mover | Shift + seta: correr | R: reiniciar missão  | Esc: menu",
    20,
    canvas.height - 8,
  );

  ctx.fillStyle = "#10121f";
  ctx.fillRect(10, canvas.height - 100, 340, 60);

  ctx.fillStyle = "#10121f";
  ctx.fillRect(600, 40, 180, 65);

  ctx.fillStyle = "#ffffff";
  ctx.font = "16px Arial";
  ctx.fillText("Movimentos: " + passos, 610, 63);

  if (recorde === null) {
    ctx.fillText("Recorde: —", 610, 88);
  } else {
    ctx.fillText("Recorde: " + recorde, 610, 88);
  }

  ctx.font = "20px Arial";

  if (entregaConcluida === true) {
    ctx.fillStyle = "#4dff88";
    ctx.fillText("Entrega concluída!", 20, canvas.height - 75);
    ctx.font = "14px Arial";
    ctx.fillText(
      "Pressione R para tentar bater seu recorde",
      20,
      canvas.height - 50,
    );
  } else if (temEncomenda === false) {
    ctx.fillStyle = "#ffd54a";
    ctx.fillText("Retire a encomenda na loja", 20, canvas.height - 75);

    ctx.font = "14px Arial";
    ctx.fillText("Etapa 1 de 2: retirada", 20, canvas.height - 50);
  } else {
    ctx.fillStyle = "#ffffff";
    ctx.fillText("Leve a encomenda ao ponto verde", 20, canvas.height - 75);

    ctx.font = "14px Arial";
    ctx.fillText("Etapa 2 de 2: entrega", 20, canvas.height - 50);
  }
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

  if (entregaConcluida === false && (playerX !== oldX || playerY !== oldY)) {
    passos = passos + 1;
  }

  if (
    temEncomenda === false &&
    entregaConcluida === false &&
    playerX >= retiradaX &&
    playerX + playerSize <= retiradaX + retiradaTamanho &&
    playerY >= retiradaY &&
    playerY + playerSize <= retiradaY + retiradaTamanho
  ) {
    temEncomenda = true;
  }

  if (
    entregaConcluida === false &&
    temEncomenda === true &&
    playerX >= entregaX &&
    playerX + playerSize <= entregaX + entregaTamanho &&
    playerY >= entregaY &&
    playerY + playerSize <= entregaY + entregaTamanho
  ) {
    entregaConcluida = true;
    temEncomenda = false;
    if (recorde === null || passos < recorde) {
      recorde = passos;
      localStorage.setItem("cidadeNeonRecordeRetirada", String(recorde));
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
