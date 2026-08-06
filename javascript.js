const pix = document.getElementById("pix").innerHTML;
const mpix = document.getElementById("mpix");


function copiarPix(){

navigator.clipboard.writeText(pix);


mpix.style.opacity = "1";

  setTimeout(() => {

    mpix.style.opacity = "0";
  }, 1500);
}


function playHistoria(){

let video = document.getElementById("video");

video.play();

video.requestFullscreen();

}
