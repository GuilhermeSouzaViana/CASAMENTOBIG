const pix = document.getElementById("pix").innerHTML;
const mpix = document.getElementById("mpix");

const API_URL = "https://presentesbig.lovable.app";



function playHistoria(){

let video = document.getElementById("video");

video.play();

video.requestFullscreen();

}


async function comprar(presenteId) {

    const loading = document.getElementById("loading-pix");

    loading.style.display = "flex";


    try {

        const resposta = await fetch(
            `${API_URL}/api/public/pagamentos`,
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    presenteId: presenteId
                })
            }
        );


        const dados = await resposta.json();


        document.getElementById("qrcode").src = dados.qrcode;

        document.getElementById("pix").textContent = dados.copia_e_cola;


        setTimeout(() => {

            loading.style.display = "none";

            document.getElementById("area-pix").style.display = "flex";

        }, 300);


    } catch {

        loading.style.display = "none";

        alert("Erro ao gerar Pix");

    }

}



// FECHAR JANELA PIX
function fecharPix() {

    document.getElementById("area-pix").style.display = "none";

}



// COPIAR CÓDIGO PIX
function copiarPix() {

    const codigo = document.getElementById("pix").textContent;

    navigator.clipboard.writeText(codigo);

    mpix.style.opacity = "1";

  setTimeout(() => {

    mpix.style.opacity = "0";
  }, 1500);

}