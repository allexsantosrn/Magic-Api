// Carregando selectbox das edições ao carregar a página.
window.onload = function() {

    xhttpAssincrono(carryEditions,1);
}

var itens = ['alpha', 'beta']

var comboEditions = document.getElementById("comboEditions");

var comboCards = document.getElementById("comboCards");

comboEditions.addEventListener('click', callCodes);

// Carrega as edições de Magic e adiciona a um array.
function carryEditions(file){    

    var editions = JSON.parse(file)      

    for(i = 0; i < editions.sets.length; i++){

        itens[i] = editions.sets[i].name; 
    }   

    itens.sort();
    addEditions() ;
}

// Preenche o combo das edições com os valores do array.
function addEditions() {
    
    for(i = 0; i < itens.length; i++){

        var option = document.createElement("option"); 
        option.value = i;
        option.innerHTML = itens[i]
        comboEditions.appendChild(option);        
    } 

}


function callCodes() {

    xhttpAssincrono(carryCodeEditions,1);
}

function carryCodeEditions(file){    

    var editions = JSON.parse(file)      

    var text = comboEditions.options[comboEditions.selectedIndex].text

    var value = comboEditions.value

    for(i = 0; i < editions.sets.length; i++){

        if (text == editions.sets[i].name) {

            value = editions.sets[i].code;

        }
    }

    callCards(value)    
}

function callCards(value) {

    xhttpAssincrono(carryCards,2,value);
}

function carryCards(file){    

    removeComboCards()

    var cards = JSON.parse(file)      

    for(i = 0; i < cards.cards.length; i++){

        var option = document.createElement("option"); 
        option.value = i;
        option.innerHTML = cards.cards[i].name;
        comboCards.appendChild(option);           
    }

}

function removeComboCards() {

    while (comboCards.hasChildNodes()) {

        comboCards.removeChild(comboCards.firstChild);
    }
}



/*
 * Função AJAX base do tipo assíncrona.
 * type é o tipo de objeto que você quer recuperar.
 * value é o valor do parâmetro para filtrar os resultados dos tipos 2, 3 e 4.
 * [Importante!] Você não pode, em nenhuma hipótese, alterar a função xhttpAssincrono.
 */
function xhttpAssincrono(callBackFunction, type, value) {
    var xhttp = new XMLHttpRequest();;
    xhttp.onreadystatechange = function () {
        if (this.readyState === 4 && this.status === 200) {
            // Chama a função em callback e passa a resposta da requisição
            callBackFunction(this.responseText);
        }
    };
    // Path para a requisição AJAX.
    var url = "https://api.magicthegathering.io/v1/";
    switch (type) {
        case 1:
            url += "sets"
            break;
        case 2:
            url += "cards?set=" + value;
            break;
        case 3:
            url += "todos?userId=" + value;
            break;
        case 4:
            url += "comments?postId=" + value;
            break;
    }
    xhttp.open("GET", url, true);
    xhttp.send();
}

