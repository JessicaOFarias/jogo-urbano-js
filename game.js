let playerX = 150;
let playerY = 100;
const playerSize = 30;
const playerSpeed = 5;
let entregaConcluida = false;
let passos = 0;
let recorde = null;

const recordeSalvo = localStorage.getItem("cidadeNeonRecorde");

if (recordeSalvo !== null) {
  recorde = Number(recordeSalvo);
}
const predioX = 30;
const predioY = 2;
const predioLargura = 100;
const predioAltura = 20;
const entregaX = 650;
const entregaY = 340;
const entregaTamanho = 50;
const carroX = 480;
const carroY = 120;
const carroLargura = 70;
const carroAltura = 35;

const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

const telaInicial = document.getElementById("telaInicial");
const botaoJogar = document.getElementById("botaoJogar");
let jogoIniciado = false;

botaoJogar.addEventListener("click", () => {
  telaInicial.hidden = true;
  canvas.hidden = false;
  jogoIniciado = true;
  canvas.focus();
  desenhar();
});

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
  } else {
    ctx.strokeStyle = "#4dff88";
  }

  ctx.lineWidth = 3;
  ctx.strokeRect(entregaX, entregaY, entregaTamanho, entregaTamanho);
  if (entregaConcluida === false) {
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

  ctx.fillStyle = "#8b5a2b";
  ctx.fillRect(playerX + 8, playerY + 12, 14, 12);

  ctx.fillStyle = "#10121f";
  ctx.fillRect(playerX + 7, playerY + 5, 4, 4);
  ctx.fillRect(playerX + 19, playerY + 5, 4, 4);
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
  ctx.fillRect(10, 40, 340, 60);

  ctx.fillStyle = "#10121f";
  ctx.fillRect(600, 40, 180, 65);

  ctx.fillStyle = "#ffffff";
  ctx.font = "16px Arial";
  ctx.fillText("Passos: " + passos, 610, 63);

  if (recorde === null) {
    ctx.fillText("Recorde: —", 610, 88);
  } else {
    ctx.fillText("Recorde: " + recorde, 610, 88);
  }

  ctx.font = "20px Arial";

  if (entregaConcluida === true) {
    ctx.fillStyle = "#4dff88";
    ctx.fillText("Entrega concluída em " + passos + " passos!", 20, 65);
    ctx.font = "14px Arial";
    ctx.fillText("Pressione R para tentar bater seu recorde", 20, 90);
  } else {
    ctx.fillStyle = "#ffffff";
    ctx.fillText("Missão: vá até o quadrado verde", 20, 65);
  }
}

desenhar();

document.addEventListener("keydown", (e) => {
  if (jogoIniciado === false) {
    return;
  }

  if (e.key === "Escape") {
    jogoIniciado = false;
    canvas.hidden = true;
    telaInicial.hidden = false;
    botaoJogar.textContent = "Continuar";
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

  const oldX = playerX;
  const oldY = playerY;
  let passo = playerSpeed;

  if (e.shiftKey === true) {
    passo = playerSpeed * 2;
  }

  if (e.key === "ArrowRight") {
    playerX = playerX + passo;

    if (playerX > canvas.width - playerSize) {
      playerX = canvas.width - playerSize;
    }
  }

  if (e.key === "ArrowLeft") {
    playerX = playerX - passo;

    if (playerX < 0) {
      playerX = 0;
    }
  }

  if (e.key === "ArrowUp") {
    playerY = playerY - passo;

    if (playerY < 0) {
      playerY = 0;
    }
  }

  if (e.key === "ArrowDown") {
    playerY = playerY + passo;

    if (playerY > canvas.height - playerSize) {
      playerY = canvas.height - playerSize;
    }
  }

  if (
    playerX < predioX + predioLargura &&
    playerX + playerSize > predioX &&
    playerY < predioY + predioAltura &&
    playerY + playerSize > predioY
  ) {
    playerX = oldX;
    playerY = oldY;
  }

  if (
    playerX < carroX + carroLargura &&
    playerX + playerSize > carroX &&
    playerY < carroY + carroAltura &&
    playerY + playerSize > carroY
  ) {
    playerX = oldX;
    playerY = oldY;
  }

  if (entregaConcluida === false && (playerX !== oldX || playerY !== oldY)) {
    passos = passos + 1;
  }

  if (
    entregaConcluida === false &&
    playerX >= entregaX &&
    playerX + playerSize <= entregaX + entregaTamanho &&
    playerY >= entregaY &&
    playerY + playerSize <= entregaY + entregaTamanho
  ) {
    entregaConcluida = true;
    if (recorde === null || passos < recorde) {
      recorde = passos;
      localStorage.setItem("cidadeNeonRecorde", String(recorde));
    }
  }

  if (e.key === "r" || e.key === "R") {
    passos = 0;
    entregaConcluida = false;
    playerX = 150;
    playerY = 100;
  }

  desenhar();
});
