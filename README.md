# Magic-Api

## Autor:
- Alexandre Dantas dos Santos

## Objetivos
- Sistema para gerenciamento de cartas do jogo Magic The Gathering.

## Metodologia
- O projeto visa montar um gerenciador de cartas para o jogo Magic The Gathering.
- O projeto foi desenvolvido através da IDE Visual Studio Code utilizando HTML, CSS e JavaScript.
- O projeto foi construído com a devida separação entre os arquivos HTML, CSS e JavaScript.
- Foi utilizado também o BootStrap e JQuery na aplicação.
- O projeto possui um layout responsivo, para as interfaces mobile e desktop.
- Foi utilizada a API pública do jogo de cartas Magic The Gathering: https://docs.magicthegathering.io/ para consumo das informações das edições e cartas de Magic (via requisições AJAX).
- Foi utilizado também o Local Storage para armazenamento das cartas adicionadas pelo usuário.
- Também foi utilizado o gráfico Google Charts para armazenamento de informações de raridade das cartas.

## Detalhes de Implementação
- O projeto em questão utiliza o serviço disponível em: https://docs.magicthegathering.io/.
- Durante acesso a aplicação, o usuário pode selecionar uma edição de Magic(através de AJAX) e uma carta daquela coleção selecionada.
- Após seleção da carta, é apresentado alguns dados da carta selecionada: imagem, texto, tipo, custo de mana e raridade.
- E possível após seleção da carta desejada adicioná-la ao deck do usuário. Para deixar o projeto mais dinâmico, algumas regras foram adicionadas no gerenciador de cartas: 
- Cada carta só pode ser adicionada uma vez junto ao deck.
- O deck possui um limite máximo de 10 cartas. Este valor é controlado pela variável: limiteDeck, presente no arquivo: script.js.
- Para cada carta adicionada é gerado um gráfico através do Google Charts que mapeia o percentual de raridade de cartas presentes no deck: Cartas comuns, raras, incomuns ou míticas.
- O deck de cartas pode ser visualizado clicando-se no botão: Minhas Cartas presente na página.
- É utilizado o Local Storage para armazenamento das cartas adicionadas pelo usuário.
- É possível remover todo o deck de cartas clicando no botão: Esvaziar Deck.



