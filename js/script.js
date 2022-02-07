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

var common = 0;

var rare = 0;

var uncommon = 0;

var mythic = 0;

var cardList = new Array();

var nameCard = "name";

var rarity = "rarity";

// Função que inicializa a consulta das edições de Magic.
function getData() {
    startStorage();
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

// Realiza por meio do AJAX a consulta das cartas de Magic e cria o combo das catas.
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

// Função que obtém uma lista de cartas de uma edição através do AJAX.
function getCardsData(){
    var edition = document.getElementById("edition").value;
    xhttpAssincrono(returnCardInfo,2,edition);                       
}

// Realiza por meio do AJAX a consulta os dados da carta de Magic selecionada.
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
            rarity = json.cards[i].rarity; 
            nameCard = json.cards[i].name;
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

// Adiciona a carta selecionada ao deck de cartas do usuário.
function addCardList(){

    google.setOnLoadCallback(drawChart);

    document.getElementById('chart_div').style.display = "inline";

    if (cardList.includes(nameCard)){        
        alert("Carta já foi adicionada á sua lista de cartas. Selecione outra carta!!!");
    }

    else if (cardList.length >= 10) {
        alert("Limite de 10 cartas atingido para o deck!!!");
    }   

    else {        
        cardList.push(nameCard);
        incrementRarity();
        localStorage.setItem('listaCartas', JSON.stringify(cardList));
        localStorage.setItem('rare', JSON.stringify(rare));
        localStorage.setItem('common', JSON.stringify(common));
        localStorage.setItem('uncommon', JSON.stringify(uncommon));
        localStorage.setItem('mythic', JSON.stringify(mythic));
    }

}

// Incrementa as variáveis globais de raridade.
function incrementRarity() {

    if (rarity == "Rare") {
        rare ++;
    }

    else if (rarity == "Common") {
        common ++;
    }

    else if (rarity == "Uncommon") {
        uncommon ++;
    }

    else if (rarity == "Mythic") {
        mythic ++;
    }
}

// Função que exibe as cartas adicionadas pelo usuário.
function addDeckView() {

    var list = document.getElementById("viewCards");

    while (list.hasChildNodes()) {

        list.removeChild(list.firstChild);
    }

    for (i = 0; i < cardList.length; i++) {

        var item = document.createElement("li");        
        item.innerHTML = cardList[i];
        list.appendChild(item); 
    }

}

// Função que apaga o deck do usuário.
function eraseDeck() {

    google.setOnLoadCallback(drawChart);

    var list = document.getElementById("viewCards");

    while (list.hasChildNodes()) {

        list.removeChild(list.firstChild);
    }

    for (i = 0; i <= cardList.length; i++) {

        cardList.pop();
        clearRarity();
        localStorage.clear();
    }

    document.getElementById('chart_div').style.display = "none";   
}

// Função que zera os valores das variáveis globais de índice de raridade.
function clearRarity() {

    rare = 0;
    common = 0;
    uncommon = 0;
    mythic = 0;
}

function startStorage(){

    let data = localStorage.getItem('listaCartas');

    let cartas = JSON.parse(data);
    
    let rareReturn = parseInt(localStorage.getItem('rare'));
    let commonReturn = parseInt(localStorage.getItem('common'));
    let uncommonReturn = parseInt(localStorage.getItem('uncommon'));  
    let mythicReturn = parseInt(localStorage.getItem('mythic'));

    if (cartas != null) {

        for (i = 0; i < cartas.length; i++){

            cardList[i] = cartas[i];
        }    
    }

    if (rareReturn > 0 || commonReturn > 0 || uncommonReturn > 0 || mythicReturn > 0) {

        rare = rareReturn;
        common = commonReturn;
        uncommon = uncommonReturn;
        mythic = mythicReturn;     

        google.setOnLoadCallback(drawChart);   

        document.getElementById('chart_div').style.display = "inline";  
    }    

  
 

}

// Função que executa o desenho do gráfico do Google Chart.
function drawChart() {

    // Create the data table.
    var data = new google.visualization.DataTable();
    data.addColumn('string', 'Topping');
    data.addColumn('number', 'Slices');
    data.addRows([
      ['Common', common],
      ['Uncommon', uncommon],   
      ['Rare', rare],
      ['Mythic', mythic],
    ]);

    // Set chart options
    var options = {'title':'Índice de raridade das cartas',
                   'width':400,
                   'height':300,
                   'is3D': true};

    // Instantiate and draw our chart, passing in some options.
    var chart = new google.visualization.PieChart(document.getElementById('chart_div'));
    chart.draw(data, options);
  }