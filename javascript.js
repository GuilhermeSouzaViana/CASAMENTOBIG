const pix = document.getElementById("pix").innerHTML;
const mpix = document.getElementById("mpix");

//const API_URL = "https://presentesbig.lovable.app";



function playHistoria(){

    let video = document.getElementById("video");

    if(!video){
        return;
    }

    video.play().catch(()=>{});

    if(video.requestFullscreen){

        video.requestFullscreen().catch(()=>{});

    }

}



function fecharPix() {

    document.getElementById("area-pix").style.display = "none";

}



function copiarPix() {

    const codigo = document
        .getElementById("pix")
        .textContent
        .trim();

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

function crc16(str) {

    let crc = 0xFFFF;

    for (let i = 0; i < str.length; i++) {

        crc ^= str.charCodeAt(i) << 8;

        for (let j = 0; j < 8; j++) {

            if (crc & 0x8000) {
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

    value = String(value).trim();

    const tamanho = new TextEncoder().encode(value).length;

    return id +
           tamanho.toString().padStart(2, "0") +
           value;
}

function gerarPixLocal(valor) {

    const chave = PIX_CONFIG.chave.trim();

    const nome = PIX_CONFIG.nome
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .substring(0, 25);

    const cidade = PIX_CONFIG.cidade
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .substring(0, 15);

    const payload =
        emv("00", "01") +
        emv("01", "12") +
        emv(
            "26",
            emv("00", "BR.GOV.BCB.PIX") +
            emv("01", chave)
        ) +
        emv("52", "0000") +
        emv("53", "986") +
        emv("54", Number(valor).toFixed(2)) +
        emv("58", "BR") +
        emv("59", nome) +
        emv("60", cidade) +
        emv("62", emv("05", "***")) +
        "6304";

        const finalPix = payload + crc16(payload);
console.log(finalPix);
return finalPix;

   //return payload + crc16(payload);
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