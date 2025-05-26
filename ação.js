
let linhas = 5;
let colunas = 5;


let estacionamento = [];
for (let i = 0; i < linhas; i++) {
    estacionamento[i] = [];
    for (let j = 0; j < colunas; j++) {
        estacionamento[i][j] = '';
    }
}


let estados = {
    'AAA': 'Paraná (PR)',
    'AAB': 'Paraná (PR)',
    'BEB': 'Paraná (PR)',
    'MAI': 'Santa Catarina (SC)',
    'NAH': 'Santa Catarina (SC)',
    'IAA': 'Rio Grande do Sul (RS)',
    'JCN': 'Rio Grande do Sul (RS)'
};


let registros = {};

// Valores de cobrança
let valorBase = 5.00;   
let valorExtra = 2.00;  
let tolerancia = 15;    


function validarPlaca(placa) {
    let padrao = /^[A-Z]{3}[0-9][A-Z][0-9]{2}$/;
    return padrao.test(placa);
}


function buscarEstado(placa) {
    let prefixo = placa.substring(0, 3).toUpperCase();
    if (estados[prefixo]) {
        return estados[prefixo];
    } else {
        return 'Desconhecido';
    }
}


function encontrarVagaLivre() {
    for (let i = 0; i < linhas; i++) {
        for (let j = 0; j < colunas; j++) {
            if (estacionamento[i][j] === '') {
                return { linha: i, coluna: j };
            }
        }
    }
    return null; 
}


function calcularTempo(horaEntrada, horaSaida) {
    let partesEntrada = horaEntrada.split(':');
    let partesSaida = horaSaida.split(':');

    let entradaMinutos = parseInt(partesEntrada[0]) * 60 + parseInt(partesEntrada[1]);
    let saidaMinutos = parseInt(partesSaida[0]) * 60 + parseInt(partesSaida[1]);

    let tempo = saidaMinutos - entradaMinutos;

    
    if (tempo < 0) {
        tempo += 24 * 60;
    }

    return tempo;
}


function calcularValor(tempo) {
    if (tempo <= tolerancia) {
        return 0; 
    }

    let horas = Math.ceil(tempo / 60); 

    if (horas <= 3) {
        return valorBase;
    } else {
        return valorBase + (horas - 3) * valorExtra;
    }
}


function registrarEntrada() {
    let placa = document.getElementById('placaEntrada').value.toUpperCase();
    let horaEntrada = document.getElementById('horaEntrada').value;

    if (!validarPlaca(placa)) {
        alert('Placa inválida! Use o formato ABC1D23.');
        return;
    }

    if (!horaEntrada) {
        alert('Preencha a hora de entrada.');
        return;
    }

    if (registros[placa]) {
        alert('Este veículo já está no estacionamento.');
        return;
    }

    let vaga = encontrarVagaLivre();
    if (!vaga) {
        alert('Estacionamento lotado!');
        return;
    }

    estacionamento[vaga.linha][vaga.coluna] = placa;
    registros[placa] = { horaEntrada: horaEntrada, vaga: vaga };

    atualizarEstacionamento();
    alert('Veículo ' + placa + ' entrou na vaga (' + (vaga.linha + 1) + ', ' + (vaga.coluna + 1) + ').');
}


function registrarSaida() {
    let placa = document.getElementById('placaSaida').value.toUpperCase();
    let horaSaida = document.getElementById('horaSaida').value;

    if (!registros[placa]) {
        alert('Veículo não encontrado no estacionamento.');
        return;
    }

    if (!horaSaida) {
        alert('Preencha a hora de saída.');
        return;
    }

    let dados = registros[placa];
    let tempo = calcularTempo(dados.horaEntrada, horaSaida);
    let valor = calcularValor(tempo);
    let estado = buscarEstado(placa);

    // Liberar a vaga
    estacionamento[dados.vaga.linha][dados.vaga.coluna] = '';
    delete registros[placa];

    atualizarEstacionamento();
    gerarTicket(placa, estado, tempo, valor);
}


function gerarTicket(placa, estado, tempo, valor) {
    let horas = Math.floor(tempo / 60);
    let minutos = tempo % 60;

    let texto = `
    <p><strong>Placa:</strong> ${placa}</p>
    <p><strong>Estado:</strong> ${estado}</p>
    <p><strong>Tempo:</strong> ${horas}h ${minutos}min</p>
    <p><strong>Valor:</strong> R$ ${valor.toFixed(2)}</p>
    <hr>
`;


    document.getElementById('ticket').innerHTML += texto;
}


function atualizarEstacionamento() {
    let div = document.getElementById('matrizEstacionamento');
    div.innerHTML = '';

    for (let i = 0; i < linhas; i++) {
        for (let j = 0; j < colunas; j++) {
            let placa = estacionamento[i][j];
            let celula = document.createElement('div');
            celula.className = 'celula';

            if (placa !== '') {
                celula.classList.add('ocupado');
                celula.textContent = placa;
            } else {
                celula.textContent = 'Livre';
            }

            div.appendChild(celula);
        }
    }
}


atualizarEstacionamento();
