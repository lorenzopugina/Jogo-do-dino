const canvas = document.getElementById("Cenario");
const ctx = canvas.getContext("2d");

const larguraCanvas = canvas.clientWidth;
const alturaCanvas = canvas.clientHeight;
canvas.width = larguraCanvas;
canvas.height = alturaCanvas;

const dino = new Image();
const cacto = new Image();
dino.src = "dino.png";
cacto.src = "cacto.png";

// Variaveis para o dinossauro
let posY = alturaCanvas - 65; 
let pulando = false; 
let alturaPulo = 0; 
let gravidade = 0.25; 

//Variaveis para o cacto
let posX = [larguraCanvas, larguraCanvas, larguraCanvas, larguraCanvas, larguraCanvas]; 
let cactos = [0, 0, 0, 0, 0]; 
let quantCactos = 0;
let velocidade = 4;

//Variaveis para o jogo
let pontuacao = 0;
let gameOver = false;

//Se a tecla foi apertada
document.addEventListener("keydown", function(event) {
    if (event.key === "ArrowUp") {
        pular();
    }
    if(event.key === "ArrowDown"){
        gravidade = 0.85;
    }
});

//Se a tecla foi solta
document.addEventListener("keyup", function(event) {
    if(event.key === "ArrowDown"){
        gravidade = 0.15;
    }
});

function pular() {
    if (!pulando) {
        pulando = true;
        alturaPulo = 5;
    }
}

// Verifica se o cacto está na mesma posição do dinossauro
function verificarColisao() {
    for (let i = 0; i < 5; i++) {
        
        if (cactos[i] === 1) {
            if (posX[i] > 0 && posX[i] < 50 && posY + 45 >= alturaCanvas - 50){
                gameOver = true; 
            }
        }
    }
}

function atualizar() {
    if (gameOver) {
        ctx.clearRect(0, 0, larguraCanvas, alturaCanvas);
        ctx.font = "40px Arial";
        ctx.fillText("Fim de jogo", (larguraCanvas/2 - 150), alturaCanvas / 2 - 40);
        ctx.fillText("Pontuação Final: " + pontuacao, (larguraCanvas/2 - 180), alturaCanvas / 2 + 25);
        ctx.fillText("Pressione F5", (larguraCanvas/2 - 150), alturaCanvas / 2 + 90);
        return;
    }

    // Limpa o canvas antes de redesenhar
    ctx.clearRect(0, 0, larguraCanvas, alturaCanvas - 10);
    
    if (pulando) {
        posY -= alturaPulo; // negativo para ir para cima
        alturaPulo -= gravidade; 

        // Verifica se o dinossauro atingiu o chão
        if (posY >= alturaCanvas - 65) {
            posY = alturaCanvas - 65; // Reseta a posição 
            pulando = false; 
        }
    }

    // Desenha o dinossauro
    ctx.drawImage(dino, 20, posY, 50, 60);

    // Cria cactos aleatoriamente
    if (quantCactos < 5) {
        for (let i = 0; i < 5; i++) {
            if (cactos[i] === 0 && gerarNumeroAleatorio(0, 120) === 10) { 
                cactos[i] = 1; 
                quantCactos++;
                velocidade += 0.15;
            }
        }
    }

    // Desenha os cactos
    for (let i = 0; i < 5; i++) {
        if (cactos[i] === 1) {
            posX[i] -= velocidade; 

            // Se o cacto sair da tela
            if (posX[i] < -40) {
                posX[i] = larguraCanvas; 
                cactos[i] = 0; 
                quantCactos--; 
                pontuacao++;
            }

            // Desenha o cacto
            ctx.drawImage(cacto, posX[i], alturaCanvas - 50, 40, 40);
        }
    }

    // Desenha a pontuação
    ctx.font = "15px Arial";
    ctx.fillText("Pontuação: " + pontuacao, larguraCanvas - 100, 20); 

    verificarColisao();
}

// Desenha o chão
ctx.beginPath();
ctx.moveTo(0, alturaCanvas - 10); // Início da linha
ctx.lineTo(larguraCanvas, alturaCanvas - 10); // Fim da linha
ctx.stroke();

// executa a função atualizar 60x por sec
setInterval(atualizar, 1000 / 60);

function gerarNumeroAleatorio(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

