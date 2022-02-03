window.onload = function() {

    xhttpAssincrono(carryEditions,1);
}

function carryEditions(file){
    
    var comboEditions = document.getElementById("comboEditions");

    var editions = JSON.parse(file)   

     for(i = 0; i < editions.sets.length; i++){

        var option = document.createElement("option");        
        option.value = editions.sets[i].code;
        option.innerHTML = editions.sets[i].name;
        comboEditions.appendChild(option);
    }   

    console.log(editions.sets)    
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
            console.log(url);
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

