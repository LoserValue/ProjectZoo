var container = document.getElementById("container-car");
var icons = {"cherry.png": 0, "strawberry.png" : 0, "banana.png" : 0, "watermelon.png" : 0};
var selection = [];

var cardNumber = 8;
var cards = [];
for(var i=0; i<cardNumber; i++)
{
    var card = document.createElement("div");
    var icon = document.createElement("img");
    var src = document.createAttribute("src");
    src.value = "asset/" + Object.values(icons)[0]; 
    icon.setAttributeNode(src);
    card.appendChild(icon);
    card.setAttribute("class", "card");
    container.appendChild(card)
    cards[i] = card;   
    
}