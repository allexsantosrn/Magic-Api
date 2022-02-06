// Carregando selectbox das edições ao carregar a página.
window.onload = function() {

    xhttpAssincrono(addEditions,1);
}

var comboEditions = document.getElementById("comboEditions");

var comboCards = document.getElementById("comboCards");

comboEditions.addEventListener('click', callCards);

// Carrega as edições de Magic e adiciona ao selectbox.
function addEditions(file){    

    var editions = JSON.parse(file)      

    for(i = 0; i < editions.sets.length; i++){
        
        if (editions.sets[i].name == "Odyssey") {
           
            var option = document.createElement("option"); 
            option.value = editions.sets[i].code;
            option.innerHTML = editions.sets[i].name;
            comboEditions.appendChild(option);
        }
    }   
}

// Função que ordena os itens do selectbox das edições.
function ordenarEditionsCombo() {

    var itensOrdenados = $('#comboEditions option').sort(function (a, b) {
        return a.text < b.text ? -1 : 1;
    });

    $('#comboEditions').html(itensOrdenados);
}

// Carregando selectbox das cartas de Magic.
function callCards() {

    value = comboEditions.value;

    if (comboEditions.value != 0) {
        xhttpAssincrono(addCards,2,value);
    }
}

// Carrega as cartas de Magic e adiciona ao selectbox.
function addCards(file){    

    var cards = JSON.parse(file)     
    
    removeCardsCombo();

    for(i = 0; i < cards.cards.length; i++){
           
        var option = document.createElement("option"); 
        option.value = i;
        option.innerHTML = cards.cards[i].name;
        comboCards.appendChild(option);        
    }  

}

// Remove as cartas adicionadas ao selectbox.
function removeCardsCombo() {

    while (comboCards.hasChildNodes()) {

        comboCards.removeChild(comboCards.firstChild);
    }
}

// Função que ordena os itens do selectbox das cartas.
function ordenarCardsCombo() {

    var itensOrdenados = $('#comboCards option').sort(function (a, b) {
        return a.text < b.text ? -1 : 1;
    });

    $('#comboCards').html(itensOrdenados);
}

// Carregando a carta de Magic selecionada.
function callCard() {

    if (comboEditions.value != 0)  {
        xhttpAssincrono(showCard,2,value);
    }
}

// Carrega as carta de Magic selecionada e adiciona a view.
function showCard(file){    

    var cards = JSON.parse(file)    
    
    document.getElementById("content").style.display = "inline"; 
    
    var text = comboCards.options[comboCards.selectedIndex].text
 
    for(i = 0; i < cards.cards.length; i++){

        if (text == cards.cards[i].name) {

            document.getElementById('name').innerHTML = "Nome: " + cards.cards[i].name;
            document.getElementById('imagem').src = cards.cards[i].imageUrl;
            document.getElementById('rarity').innerHTML = "Raridade: " + cards.cards[i].rarity;          
            document.getElementById('color').innerHTML = "Cor: " + cards.cards[i].colors;    
            document.getElementById('cost').innerHTML = "Custo: " + cards.cards[i].manaCost;     
            document.getElementById('type').innerHTML = "Tipo: " + cards.cards[i].types;         
        }     
    }      
}

function drawChart() {

    // Create the data table.
    var data = new google.visualization.DataTable();
    data.addColumn('string', 'Topping');
    data.addColumn('number', 'Slices');
    data.addRows([
      ['Mushrooms', 1],
      ['Onions', 2],
      ['Olives', 0],
      ['Zucchini', 0],
      ['Pepperoni', 1]
    ]);

    // Set chart options
    var options = {'title':'How Much Pizza I Ate Last Night',
                   'width':400,
                   'height':300,
                   'is3D': true};

    // Instantiate and draw our chart, passing in some options.
    var chart = new google.visualization.PieChart(document.getElementById('chart_div'));
    chart.draw(data, options);
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

