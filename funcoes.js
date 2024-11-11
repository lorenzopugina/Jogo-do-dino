const canvas = document.getElementById("meuCanvas");
const ctx = canvas.getContext("2d");

canvas.width = canvas.clientWidth;
canvas.height = canvas.clientHeight;

const dino = new Image();
const cacto = new Image();
dino.src = "dino.png";
cacto.src = "cacto.png";

// Variaveis pro dinossauro
let posY = canvas.height - 65; 
let pulando = false; 
let alturaPulo = 0; 
let gravidade = 0.15; 

//Variaveis pro cacto
let tamanho = canvas.width;
let posX = [tamanho, tamanho, tamanho, tamanho, tamanho]; 
let cactos = [0, 0, 0, 0, 0]; 
let quantCactos = 0;
let velocidade = 4;

//Variaveis pro jogo
let pontuacao = 0;
let gameOver = false;

//Se a tecla foi apertada
document.addEventListener("keydown", function(event) {
    if (event.key === "ArrowUp" && !gameOver) {
        pular();
    }
    if(event.key === "ArrowDown" && !gameOver){
        gravidade = 0.65;
    }
});

//Se a tecla foi solta
document.addEventListener("keyup", function(event) {
    if(event.key === "ArrowDown"){
        gravidade = 0.15;
    }
});

function pular() {
    if (!pulando && !gameOver) {
        pulando = true;
        alturaPulo = 5;
    }
}

// Verifica se o cacto está na mesma posição do dinossauro
function verificarColisao() {
    for (let i = 0; i < 5; i++) {
        
        if (cactos[i] === 1) {
            if (posX[i] < 50 && posX[i] > 20 && posY + 60 >= canvas.height - 50){
                gameOver = true; 
            }
        }
    }
}

function atualizar() {
    if (gameOver) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.font = "40px Arial";
        ctx.fillText("Fim de jogo", canvas.width / 2 - 150, canvas.height / 2);
        ctx.fillText("Pontuação Final: " + pontuacao, canvas.width / 2 - 180, canvas.height / 2 + 50);
        return;
    }

    // Limpa o canvas antes de redesenhar
    ctx.clearRect(0, 0, canvas.width, canvas.height-10);

    if (pulando) {
        posY -= alturaPulo; // negativo para ir para cima
        alturaPulo -= gravidade; 

        // Verifica se o dinossauro atingiu o chão
        if (posY >= canvas.height - 65) {
            posY = canvas.height - 65; // Reseta a posição 
            pulando = false; 
        }
    }
    // Redesenha o dinossauro
    ctx.drawImage(dino, 20, posY, 50, 60);

    // Cria cactos "Aleatoriamente"
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
            if (posX[i] < -100) {
                posX[i] = tamanho; 
                cactos[i] = 0; 
                quantCactos--; 
                pontuacao++;
            }

            // Desenha o cacto
            ctx.drawImage(cacto, posX[i], canvas.height - 50, 40, 40);
        }
    }

    // Desenha a pontuação
    ctx.font = "15px Arial";
    ctx.fillText("Pontuação: " + pontuacao, canvas.width - 100, 20); 

    verificarColisao();
}

// executa a função atualizar 60x por sec
setInterval(atualizar, 1000 / 60);

// Desenha o chão
ctx.beginPath();
ctx.moveTo(0, canvas.height - 10); // Início da linha
ctx.lineTo(canvas.width, canvas.height - 10); // Fim da linha
ctx.stroke();

function gerarNumeroAleatorio(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}
