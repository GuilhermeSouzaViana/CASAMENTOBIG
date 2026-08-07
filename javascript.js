const pix = document.getElementById("pix").innerHTML;
const mpix = document.getElementById("mpix");

//const API_URL = "https://presentesbig.lovable.app";



function playHistoria(){

let video = document.getElementById("video");

video.play();

video.requestFullscreen();

}



function fecharPix() {

    document.getElementById("area-pix").style.display = "none";

}



function copiarPix() {

    const codigo = document.getElementById("pix").textContent;

    navigator.clipboard.writeText(codigo);

    mpix.style.opacity = "1";

  setTimeout(() => {

    mpix.style.opacity = "0";
  }, 1500);

}

const presentesBig={
1:{nome:"Lua de mel",valor: 1.00},
2:{nome:"Kit Sobrevivência do Primeiro Ano",valor:2.00},
3:{nome:"Decoração da Nossa Casa",valor: 3.00},
4:{nome:"Rolo de macarrão",valor: 4.00},
5:{nome:"Capacete contra rolo de macarrão",valor: 5.00},
6:{nome:"Manual do Marido/Esposa",valor: 6.00},
7:{nome:"Conjunto avental de casal",valor: 7.00},
8:{nome:"Vasos para plantas",valor: 8.00}
}


const PIX_CONFIG = {
    chave: "vianagui355@gmail.com",
    nome: "Guilherme Viana",
    cidade: "SAO PAULO"
};

function crc16(payload) {
    let crc = 0xFFFF;

    for (let c = 0; c < payload.length; c++) {
        crc ^= payload.charCodeAt(c) << 8;

        for (let i = 0; i < 8; i++) {
            if ((crc & 0x8000) !== 0) {
                crc = (crc << 1) ^ 0x1021;
            } else {
                crc <<= 1;
            }

            crc &= 0xFFFF;
        }
    }

    return crc.toString(16).toUpperCase().padStart(4, "0");
}

function emv(id, value) {
    const size = value.length.toString().padStart(2, "0");
    return id + size + value;
}

function gerarPixLocal(valor, descricao) {

    // Limites da especificação Pix
    const nome = PIX_CONFIG.nome.substring(0, 25);
    const cidade = PIX_CONFIG.cidade.substring(0, 15);
    const desc = descricao.substring(0, 25);

    // TxId único
    const txid = Date.now().toString();

    const merchantAccount =
        emv(
            "26",
            emv("00", "BR.GOV.BCB.PIX") +
            emv("01", PIX_CONFIG.chave)
        );

    const additionalData =
        emv(
            "62",
            emv("05", txid)
        );

    const payload =
        emv("00", "01") +              // Payload Format Indicator
        emv("01", "12") +              // Pix estático
        merchantAccount +
        emv("52", "0000") +
        emv("53", "986") +             // BRL
        emv("54", valor.toFixed(2)) +
        emv("58", "BR") +
        emv("59", nome) +
        emv("60", cidade) +
        additionalData +
        "6304";

    return payload + crc16(payload);
}

async function comprarlocal(presenteId) {

    const loading = document.getElementById("loading-pix");

    loading.style.display = "flex";

    try {

        const presente = presentesBig[presenteId];

        if (!presente) {
            throw new Error("Presente não encontrado");
        }

        const codigoPix = gerarPixLocal(
            presente.valor,
            presente.nome
        );

        document.getElementById("pix").textContent = codigoPix;

        setTimeout(() => {

            loading.style.display = "none";

            document.getElementById("area-pix").style.display = "flex";

        }, 300);

    } catch {

        loading.style.display = "none";

        alert("Erro ao gerar Pix.");

    }

}