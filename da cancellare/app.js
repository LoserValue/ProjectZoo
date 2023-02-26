//palette colori pastello
var color = ["#D1BE93", "#A8BAC0", "#C6D8CC", "#D3ADAC", "#D3ADAC", "#E6C1B5"]
var isRunning = true;
//valore timer predefinito in ms. 
var time = 15000; //1s = 1000ms

const toast = document.querySelector(".toast");
(closeIcon = document.querySelector(".close")),
(progress = document.querySelector(".progress"));

let timer1, timer2;

//icona di chiusura
closeIcon.addEventListener("click", () => {
  toast.classList.remove("active");

  setTimeout(() => {
    progress.classList.remove("active");
  }, 300);

  clearTimeout(timer1);
  clearTimeout(timer2);
});

//funzione richiamata al click sul bottone per avviare il timer
document.getElementById("start").addEventListener("click", () => {
    isRunning = true; console.log("Start");
    //modifica testo
    document.querySelector(".text-1").innerHTML = "Timer Start";
    document.querySelector(".text-2").innerHTML = "Fra 15 secondi lo sfondo cambierà colore";


    toast.classList.add("active");
    progress.classList.add("active");
  
    timer1 = setTimeout(() => {
      toast.classList.remove("active");
    }, 5000); 
  
    timer2 = setTimeout(() => {
      progress.classList.remove("active");
    }, 5300);
})
//funzione richiamata al click sul bottone per fermare il timer
document.getElementById("stop").addEventListener("click", () => {
    isRunning = false; 
    //modifica testo
    document.querySelector(".text-1").innerHTML = "Timer Stop";
    document.querySelector(".text-2").innerHTML = "Lo sfondo non cambierà più";

    toast.classList.add("active");
    progress.classList.add("active");
  
    timer1 = setTimeout(() => {
      toast.classList.remove("active");
    }, 5000); 
  
    timer2 = setTimeout(() => {
      progress.classList.remove("active");
    }, 5300);
})

//funzione richiamata al loading della pagina, addEventListener("load") non è possibile applicarlo all'elemento <body>
window.addEventListener("load", e => {
    var i=0; 

    setInterval(() => {
        if(isRunning)
        {
            if(i==color.length)
                i=0;
            document.body.style.background = color[i];
            console.log(document.body.style.background + " : " + i);
            i++;
        }
    }, time);
});



