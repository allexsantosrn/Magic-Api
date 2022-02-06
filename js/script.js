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

// Função que inicializa a consulta das edições de Magic.
function getData() {

    xhttpAssincrono(returnEditions,1);
}

// Realiza por meio do AJAX a consulta das edições de Magic e cria o combo das edições.
function returnEditions(file) {

    var div = document.getElementById("content1");

    var comboEditions = document.createElement("select")
    comboEditions.setAttribute("id","edition");
    div.appendChild(comboEditions);    
    
    var option = document.createElement("option"); 
    option.innerHTML = "Selecione"
    option.value = 0
    option.disabled = true
    comboEditions.appendChild(option)
    comboEditions.selectedIndex = 0

    json = JSON.parse(file); 

    for(i = 0; i < json.sets.length; i++){
        
        if (json.sets[i].type == "expansion") {            
            
            var option = document.createElement("option"); 
            option.value = json.sets[i].code;
            option.innerHTML = json.sets[i].name;
            comboEditions.appendChild(option);
        }
    }
    
}   

// Função que obtém uma lista de cartas através do AJAX.
function getCardsList(){
    var edition = document.getElementById("edition").value;      
    xhttpAssincrono(returnCards, 2, edition);
}

// Realiza por meio do AJAX a consulta das cardas de Magic e cria o combo das catas.
function returnCards(file){

    var div = document.getElementById("content2");
    
    if(div.hasChildNodes()){
        var child = document.getElementById("card");
        div.removeChild(child); 
    }

    var comboCards = document.createElement("select")
    comboCards.setAttribute("id","card");
    div.appendChild(comboCards);

    json = JSON.parse(file); 

    for(i = 0; i < json.cards.length; i++){
           
        var option = document.createElement("option"); 
        option.value = i;
        option.innerHTML = json.cards[i].name;
        comboCards.appendChild(option);       
    }  

}

function getCardsData(){
    var edition = document.getElementById("edition").value;
    xhttpAssincrono(returnCardInfo,2,edition);                       
}

function returnCardInfo(resposta){

    json = JSON.parse(resposta); 

    var card = document.getElementById("card").value;

    for(i = 0; i < json.cards.length; i++){

        if (card == i) {

            document.getElementById('nameCard').innerHTML = json.cards[i].name;
            document.getElementById('descriptionCard').innerHTML = json.cards[i].text;
            document.getElementById('imgCard').src = json.cards[i].imageUrl;
            document.getElementById('typePokemon').innerHTML = "Type: "+json.cards[i].types;
            document.getElementById('height').innerHTML = "Cost Mana: "+json.cards[i].manaCost;
            document.getElementById('weight').innerHTML = "Rarity: "+json.cards[i].rarity;       
            var rarity = json.cards[i].rarity; 
        } 

    }      
   
    var div = document.getElementById("addCard");

    if(div.hasChildNodes()){
        var child = document.getElementById("addButton");
        div.removeChild(child); 
    }

    var button = document.createElement("input");
    button.setAttribute("type","button");
    button.setAttribute("id","addButton");
    button.setAttribute("value", "Adicionar carta à minha Decklist");     

    div.appendChild(button);    
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