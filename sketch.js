let trator;
let vegetais = [];
let pedras = [];
let powerUps = [];
let pontos = 0;
let vida = 3;
let emojisVegetais = ["🥕", "🍅", "🌽", "🥬", "🍆"];

let velocidadeBase = 3;
let velocidadeIncremento = 0;

let mensagemFinal = "";
let jogoAtivo = true;

let vegetaisMultiplicador = 1;
let powerUpTimers = {
  maisVegetais: 0,
  velocidadeTrator: 0
};

function setup() {
  createCanvas(600, 400);
  iniciarJogo();
  textAlign(CENTER, CENTER);
  textSize(24);
}

function draw() {
  background(100, 200, 100);
  
  if (jogoAtivo) {
    trator.mostrar();
    trator.mover();

    vegetais.forEach((veg, i) => {
      veg.mostrar();
      veg.mover();
      if (trator.colidiu(veg)) {
        pontos++;
        vegetais[i] = new ObjetoAleatorio('vegetal', velocidadeBase + velocidadeIncremento);
        checarVitoria();
      }
    });

    pedras.forEach((ped, i) => {
      ped.mostrar();
      ped.mover();
      if (trator.colidiu(ped)) {
        vida--;
        pedras[i] = new ObjetoAleatorio('pedra', velocidadeBase + velocidadeIncremento);
        if (vida <= 0) {
          mensagemFinal = "Game Over";
          jogoAtivo = false;
        }
      }
    });

    powerUps.forEach((pwr, i) => {
      pwr.mostrar();
      pwr.mover();
      if (trator.colidiu(pwr)) {
        aplicarPowerUp(pwr.tipo);
        powerUps.splice(i, 1);
      }
    });

    gerarPowerUps();

    atualizarPowerUps();

    fill(255);
    textSize(18);
    textAlign(LEFT, TOP);
    text('Pontos: ' + pontos, 10, 10);
    text('Vida: ' + vida, 10, 30);

    if (vegetaisMultiplicador > 1) {
      text('Vegetais x3 ativado!', 10, 50);
    }
    if (powerUpTimers.velocidadeTrator > 0) {
      text('Trator 2x velocidade!', 10, 70);
    }
  } else {
    textAlign(CENTER, CENTER);
    fill(mensagemFinal === "Você conseguiu uma Super Vitória!" ? 'gold' : mensagemFinal === "Game Over" ? 'red' : 'white');
    textSize(32);
    text(mensagemFinal, width / 2, height / 2);
    textSize(20);
    fill(255);
    text("Pressione ENTER para jogar novamente", width / 2, height / 2 + 50);
    noLoop();
  }
}

function keyPressed() {
  if (jogoAtivo) {
    if (keyCode === LEFT_ARROW) trator.direcao = -1;
    else if (keyCode === RIGHT_ARROW) trator.direcao = 1;
  } else if (keyCode === ENTER) {
    iniciarJogo();
    loop();
  }
}

function keyReleased() {
  if (jogoAtivo) trator.direcao = 0;
}

function iniciarJogo() {
  trator = new Trator();
  vegetais = [];
  pedras = [];
  powerUps = [];
  pontos = 0;
  vida = 3;
  mensagemFinal = "";
  jogoAtivo = true;
  vegetaisMultiplicador = 1;
  powerUpTimers = { maisVegetais: 0, velocidadeTrator: 0 };

  for (let i = 0; i < 5; i++) {
    vegetais.push(new ObjetoAleatorio('vegetal', velocidadeBase + velocidadeIncremento));
    pedras.push(new ObjetoAleatorio('pedra', velocidadeBase + velocidadeIncremento));
  }
}

function checarVitoria() {
  if (pontos >= 100) {
    if (vida === 3) {
      mensagemFinal = "Você conseguiu uma Super Vitória!";
      velocidadeIncremento++;
    } else {
      mensagemFinal = "Você ganhou!";
    }
    jogoAtivo = false;
  }
}

function aplicarPowerUp(tipo) {
  if (tipo === 'vida') {
    if (vida < 3) vida++;
  } else if (tipo === 'maisVegetais') {
    vegetaisMultiplicador = 3;
    powerUpTimers.maisVegetais = millis() + 10000; // 10 segundos
    for (let i = 0; i < 10; i++) {
      vegetais.push(new ObjetoAleatorio('vegetal', velocidadeBase + velocidadeIncremento));
    }
  } else if (tipo === 'velocidadeTrator') {
    powerUpTimers.velocidadeTrator = millis() + 7000; // 7 segundos
  }
}

function gerarPowerUps() {
  if (random(1) < 0.0018 && powerUps.length < 3) {
    let tipos = ['vida', 'maisVegetais', 'velocidadeTrator'];
    let tipo = random(tipos);
    powerUps.push(new ObjetoAleatorio(tipo, velocidadeBase + velocidadeIncremento));
  }
}

function atualizarPowerUps() {
  let agora = millis();

  if (vegetaisMultiplicador > 1 && agora > powerUpTimers.maisVegetais) {
    vegetaisMultiplicador = 1;
    vegetais.splice(vegetais.length - 10, 10);
  }

  if (powerUpTimers.velocidadeTrator > 0 && agora > powerUpTimers.velocidadeTrator) {
    powerUpTimers.velocidadeTrator = 0;
  }
}

class Trator {
  constructor() {
    this.x = width / 2;
    this.y = height - 40;
    this.direcao = 0;
  }

  mostrar() {
    fill(150, 75, 0);
    rect(this.x, this.y, 40, 30);
    fill(0);
    ellipse(this.x + 5, this.y + 30, 10);
    ellipse(this.x + 35, this.y + 30, 10);
  }

  mover() {
    let velocidadeAtual = 5;
    if (powerUpTimers.velocidadeTrator > 0) {
      velocidadeAtual *= 2;
    }
    this.x += this.direcao * velocidadeAtual;
    this.x = constrain(this.x, 0, width - 40);
  }

  colidiu(obj) {
    return dist(this.x + 20, this.y + 15, obj.x, obj.y) < 25;
  }
}

class ObjetoAleatorio {
  constructor(tipo, velocidade) {
    this.tipo = tipo;
    this.x = random(width);
    this.y = random(-200, -20);
    this.velocidade = velocidade;
    if (tipo === 'vegetal') {
      this.emoji = random(emojisVegetais);
    } else if (tipo === 'vida') {
      this.emoji = "❤️";
    } else if (tipo === 'maisVegetais') {
      this.emoji = "🌟";
    } else if (tipo === 'velocidadeTrator') {
      this.emoji = "⚡";
    }
  }

  mostrar() {
    textSize(24);
    if (this.tipo === 'vegetal' || this.tipo === 'vida' || this.tipo === 'maisVegetais' || this.tipo === 'velocidadeTrator') {
      text(this.emoji, this.x, this.y);
    } else {
      fill(100);
      ellipse(this.x, this.y, 20);
    }
  }

  mover() {
    this.y += this.velocidade;
    if (this.y > height) {
      this.y = random(-100, -10);
      this.x = random(width);
    }
  }
}
