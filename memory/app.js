var container = document.getElementById("container-card");
var icons = new Map([["cherry.png", 0], ["strawberry.png" , 0] ,["banana.png" , 0], 
["watermelon.png" , 0], ["avocado.png", 0], ["mango.png", 0]]);

var counter = document.getElementById("counter");

const cEvent = new CustomEvent("flip");
var canBeFlipped = false;
//nummero massimo di carte uguali 
var maxCard = 2;

//calcolo numero di carte, il 
var cardNumber = icons.size * maxCard;
var cards = [];
var cardsSelected = [];

var firstClick = false;
var secondi = 0, minuti = 0;

var pairFinded = 0;

for(var i=0; i<cardNumber; )
{
    //creazione carte nel dom e suoi elementi figli
    var card = document.createElement("div");
    var cardFront = document.createElement("div");
    var cardBack = document.createElement("div");
    var cardInner = document.createElement("div");
    var icon = document.createElement("img");
    var src = document.createAttribute("src");
    
    var keys = [...icons.keys()];
    var index = Math.floor(Math.random()*icons.size);
    console.log(index);
    //max carte dello stesso tipo nel tavolo
    if(icons.get(keys[index]) < cardNumber/icons.size)
    {
        src.value = "asset/" + keys[index]; 
        icons.set(keys[index], icons.get(keys[index]) + 1);
        icon.setAttributeNode(src);

        //creazione dorsi carte
        cardFront.appendChild(icon);
        cardFront.setAttribute("class", "card-front");
        cardBack.setAttribute("class", "card-back");
        //applicazione facce carte
        card.appendChild(cardFront);
        card.appendChild(cardBack);

        card.setAttribute("class", "card");
        card.setAttribute("id", keys[index].replace(".png", ""));
        card.addEventListener("flip", e => {
            e.target.classList.toggle("flipped");
        });

        container.appendChild(card)
        cards[i] = card;
        card.addEventListener("click", (e) => {
            if(canBeFlipped && e.target.classList.contains("flipped"))
            {
                if(!firstClick)
                {
                    firstClick = true;   
                    startChrono();
                }
                e.target.classList.toggle("flipped");
                cardsSelected.push(e.target);
                if(cardsSelected.length > 1)
                {
                    canBeFlipped = false;
                    setTimeout(() => {
                        var pairCardsFinded = true;
                        for(cardSelected of cardsSelected) 
                        {
                            if(cardSelected.id != cardsSelected[0].id)
                            {
                                pairCardsFinded = false
                                for(cardsFlipped of cardsSelected) 
                                    cardsFlipped.classList.toggle("flipped");
                            }      
                        }
                        counter.innerHTML++;
                        if(pairCardsFinded)
                        {
                            pairFinded++;
                            if(pairFinded == icons.size)
                            {
                                console.log("gioco finito");
                                pairFinded = 0;
                                document.getElementById("rematch-button").parentElement.style.display = "block";
                                document.getElementById("rematch-button").parentElement.classList.add("onEnter");
                                document.getElementById("rematch-button").parentElement.addEventListener('animationend', (e) => {
                                    e.target.classList.remove("onEnter")
                                })
                                flipAllCards();
                                restart();
                            }
                        }
                        cardsSelected = [];
                        canBeFlipped = true;
                    }, 750);
                }    
            }
        });
        i++;
    }
}
function write()
{
    secondi++;
    if(secondi>59)
    {
        secondi=0;
        minuti++;
    }
    var secondiText = secondi;
    var minutiText = minuti;
    if(secondi<10)
        secondiText = '0' + secondi;
    if(minuti<10)
        minutiText = '0' + minuti;
    document.getElementById("cronometro").innerHTML = minutiText+":"+secondiText;
};
function startChrono()
{
    timeStarted = setInterval(write, 1000);
}

document.getElementById("rematch-button").addEventListener("click", (e) => {
    counter.innerHTML = 0;
    document.getElementById("cronometro").innerHTML = "00:00"
    e.target.parentElement.classList.add("onExit");
    document.getElementById("rematch-button").parentElement.addEventListener('animationend', (e) => {
        e.target.classList.remove("onExit");
        e.target.style.display = "none";
    })
    flipAllCards();
    setTimeout(flipAllCards, 1500);
});
function flipAllCards()
{
    for(var card of cards)
    {
        card.dispatchEvent(cEvent);
    }
    canBeFlipped = true;
}
function restart()
{
    clearInterval(timeStarted);
    (function shuffleNodes() {
        for (var i = container.children.length; i >= 0; i--) {
            container.appendChild(container.children[Math.random() * i | 0]);
        }
    })()
}

setTimeout(flipAllCards, 1500);



