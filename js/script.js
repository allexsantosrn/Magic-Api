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
    }
    xhttp.open("GET", url, true);
    xhttp.send();
}

var limitDeck = 10; // Variável global que armazena o limite máximo de cartas do deck.
 
var common = 0;  // Variável global que armazena o número de cartas comuns.

var rare = 0; // Variável global que armazena o número de cartas raras.

var uncommon = 0; // Variável global que armazena o número de cartas incomuns.

var mythic = 0; // Variável global que armazena o número de cartas míticas.

var cardList = new Array(); // Arraylist que armazena as cartas adicionadas.

var nameCard = "name"; // Variável que armazena a carta selecionada.

var rarity = "rarity"; // Variável que armazena a raridade da carta selecionada.

// Função que inicializa a consulta das edições de Magic.
function getData() {    
    startStorage(); // Inicia consulta ao storage.
    xhttpAssincrono(returnEditions,1);  // Inicia a consulta das edições.
}

// Realiza por meio do AJAX a consulta das edições de Magic e cria o combo das edições.
function returnEditions(file) {

    var div = document.getElementById("content1");

    var comboEditions = document.createElement("select") // Criando o combo para seleção das edições.
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
        
        if (json.sets[i].type == "expansion") {            // Adicionando edições da coleção principal de Magic.
            
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
    
    if(div.hasChildNodes()){                             // Remove qualquer dado da div, caso exista.
        var child = document.getElementById("card");
        div.removeChild(child); 
    }

    var comboCards = document.createElement("select")  // Criando o combo para seleção das cartas.
    comboCards.setAttribute("id","card");
    div.appendChild(comboCards);

    var option = document.createElement("option"); 
    option.innerHTML = "Selecione"
    option.value = -1;
    option.disabled = true
    comboCards.appendChild(option)
    comboCards.selectedIndex = 0

    json = JSON.parse(file); 

    for(i = 0; i < json.cards.length; i++){              // Adicionando cartas da coleção selecionada.
           
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

    var card = document.getElementById("card").value;    // Pegando id da carta selecionada.

    for(i = 0; i < json.cards.length; i++){

        if (card == i) {    // Exibindo em tela informações da carta selecionada.

            document.getElementById('nameCard').innerHTML = json.cards[i].name;
            document.getElementById('descriptionCard').innerHTML = json.cards[i].text;
            document.getElementById('imgCard').src = json.cards[i].imageUrl;
            document.getElementById('type').innerHTML = "Type: "+json.cards[i].types;
            document.getElementById('cost').innerHTML = "Cost Mana: "+json.cards[i].manaCost;
            document.getElementById('rarity').innerHTML = "Rarity: "+json.cards[i].rarity;       
            rarity = json.cards[i].rarity; 
            nameCard = json.cards[i].name;
        } 

    }      
   
    var div = document.getElementById("addCard");

    // Removendo informações da DIV caso existam.
    while (div.hasChildNodes()){
       // var child = document.getElementById("addButton");
      //div.removeChild(child); 
      div.removeChild(list.firstChild);
    }   

    // Adicionado botão de adição de carta junto ao deck.
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

    // Verificando se carta já foi adicionada à lista de cartas.
    if (cardList.includes(nameCard)){        
        alert("Carta já foi adicionada á sua lista de cartas. Selecione outra carta!!!");
    }

    // Verificando se o limite de cartas do deck já foi atingido.
    else if (cardList.length >= limitDeck) {
        alert("Limite de " + cardList.length + " cartas atingido para o deck!!!");
    }   

    // Adicionando carta ao deck e armazenando no storage.
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

// Função que apaga/remove o deck do usuário.
function eraseDeck() {

    google.setOnLoadCallback(drawChart);

    var list = document.getElementById("viewCards");

    while (list.hasChildNodes()) {

        list.removeChild(list.firstChild);
    }

    while (cardList.length) {

        cardList.splice(0,1);   // Removendo os itens do array de cartas.
        clearRarity();          // Zerando as variáveis globais de raridade.
        localStorage.clear();   // Limpando Storage.
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

// Função que carrega os dados do storage.
function startStorage(){

    let data = localStorage.getItem('listaCartas');

    let cartas = JSON.parse(data);
    
    let rareReturn = parseInt(localStorage.getItem('rare'));
    let commonReturn = parseInt(localStorage.getItem('common'));
    let uncommonReturn = parseInt(localStorage.getItem('uncommon'));  
    let mythicReturn = parseInt(localStorage.getItem('mythic'));

    // Transferindo cartas do storage para o deck de cartas.
    if (cartas != null) {

        for (i = 0; i < cartas.length; i++){

            cardList[i] = cartas[i];
        }    
    }

    // Incrementando variáveis de raridade para atualização do gráfico.
    if (rareReturn > 0 || commonReturn > 0 || uncommonReturn > 0 || mythicReturn > 0) {

        rare = rareReturn;
        common = commonReturn;
        uncommon = uncommonReturn;
        mythic = mythicReturn;     

        google.setOnLoadCallback(drawChart);   

        document.getElementById('chart_div').style.display = "inline";   // Exibindo gráfico.
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
                   'backgroundColor': '#DCDCDC',
                   'is3D': true};

    // Instantiate and draw our chart, passing in some options.
    var chart = new google.visualization.PieChart(document.getElementById('chart_div'));
    chart.draw(data, options);
  }