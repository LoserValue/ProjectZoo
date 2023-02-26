var container = document.getElementById("container-card");
var icons = new Map([["cherry.png", 0], ["strawberry.png" , 0] ,["banana.png" , 0], 
["watermelon.png" , 0], ["avocado.png", 0], ["mango.png", 0]]);

const cEvent = new CustomEvent("flip");
var canBeFlipped = false;
//nummero massimo di carte uguali 
var maxCard = 2;

//calcolo numero di carte, il 
var cardNumber = icons.size * maxCard;
var cards = [];

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
    var index = Math.trunc(Math.random()*icons.size);
    //console.log(index);
    console.log(i);
    //max carte dello stesso tipo nel tavolo
    if(icons.get(keys[index]) < cardNumber/icons.size)
    {
        src.value = "asset/" + keys[index]; 
        icons.set(keys[index], icons.get(keys[index]) + 1);
        icon.setAttributeNode(src);

        cardFront.appendChild(icon);
        cardFront.setAttribute("class", "card-front");
        cardBack.setAttribute("class", "card-back");

        card.appendChild(cardFront);
        card.appendChild(cardBack);

        card.setAttribute("class", "card");
        card.addEventListener("flip", e => {
            e.target.classList.toggle("flipped");
        });

        container.appendChild(card)
        cards[i] = card;
        card.addEventListener("click", (e) => {
            if(canBeFlipped)
                e.target.classList.toggle("flipped");
        });
        i++;
    }
}
function flipAllCards()
{
    for(var card of cards)
    {
        card.dispatchEvent(cEvent);
    }
    canBeFlipped = true;
}
setTimeout(flipAllCards, 2500);

