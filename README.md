# 🌆 Cidade Neon

Jogo 2D de entrega urbana com estética neon, desenvolvido com HTML, CSS e JavaScript. O cenário e os personagens são desenhados por código usando a API Canvas 2D.

Retire a encomenda na loja e leve-a ao destino, desviando dos obstáculos e tentando completar a missão com o menor número de movimentos.

> 🚧 Projeto em desenvolvimento, criado como parte do meu aprendizado em programação e desenvolvimento front-end.

## 🎮 Jogue agora

👉 **[Abrir Cidade Neon](https://jessicaofarias.github.io/jogo-urbano-js/)**

Para jogar, utilize um computador com teclado.

## 📸 Prévia do jogo

![Tela do jogo Cidade Neon](imagens/cidade-neon.png)

## 📦 Como jogar

1. Clique em **Jogar** na tela inicial.
2. Vá até a área amarela da loja para retirar a encomenda.
3. Leve a encomenda até o destino indicado em verde.
4. Entre completamente na área de entrega para concluir a missão.
5. Reinicie e tente superar seu recorde!

Desvie da loja, do carro estacionado e da oficina durante o percurso.

## ✨ Funcionalidades

### Movimento e cenário

- Movimento contínuo ao manter as setas pressionadas.
- Movimento diagonal com velocidade ajustada.
- Corrida com Shift + seta.
- Limites de movimentação dentro do mapa.
- Colisões com a loja, o carro e a oficina.
- Colisões por eixo, permitindo deslizar ao longo dos obstáculos.
- Cenário neon desenhado com Canvas 2D.

### Missão e recordes

- Missão em duas etapas: retirada e entrega.
- Indicadores visuais dos pontos de retirada e entrega.
- Encomenda visível no personagem durante o transporte.
- Mensagens com a etapa atual e a conclusão da missão.
- Contador de movimentos.
- Melhor resultado salvo no navegador com localStorage.
- Reinício da missão sem apagar o recorde.

### Menu e interação

- Tela inicial com apresentação, instruções e autoria.
- Botões **Jogar**, **Continuar** e **Nova partida**.
- Retorno ao menu mantendo o progresso da partida.
- Pausa automática quando a janela perde o foco.
- Navegação pelos botões usando o teclado.
- Foco no canvas ao iniciar ou retomar a partida.

## ⌨️ Controles

| Tecla           | Ação                                |
| --------------- | ----------------------------------- |
| Setas           | Mover o personagem                  |
| Shift + seta    | Correr                              |
| R               | Reiniciar a missão                  |
| Esc             | Voltar ao menu mantendo o progresso |
| Tab             | Navegar pelos botões do menu        |
| Enter ou Espaço | Acionar o botão selecionado         |

### Como funciona a pontuação

O objetivo é concluir a retirada e a entrega com o menor número de movimentos.

O contador aumenta a cada atualização da lógica em que o personagem se desloca, até concluir a entrega. Ele não representa a quantidade de teclas pressionadas.

Correr aumenta a distância percorrida por movimento.

O recorde fica salvo no navegador utilizado. A missão com retirada e entrega possui um registro separado do usado na versão anterior do jogo.

## 🛠️ Tecnologias

| Tecnologia   | Uso no projeto                                    |
| ------------ | ------------------------------------------------- |
| HTML5        | Estrutura da página e elemento Canvas             |
| CSS3         | Estilização da interface e identidade visual neon |
| JavaScript   | Movimento, colisões, missão e interação           |
| Canvas 2D    | Desenho do cenário e dos personagens              |
| localStorage | Armazenamento do recorde no navegador             |
| Git e GitHub | Controle de versão e hospedagem do código         |
| GitHub Pages | Publicação da versão jogável                      |

## 🚀 Como executar localmente

1. Clique em **Code → Download ZIP** neste repositório.
2. Extraia a pasta do projeto.
3. Abra o arquivo `index.html` em um navegador.
4. Clique em **Jogar**.

Também é possível abrir a pasta no VS Code e executar o projeto com a extensão Live Server.

## 📁 Estrutura do projeto

| Arquivo ou pasta | Descrição                                       |
| ---------------- | ----------------------------------------------- |
| `index.html`     | Estrutura da página e menu inicial              |
| `style.css`      | Estilos da página e da interface                |
| `game.js`        | Desenho, controles, colisões e regras da missão |
| `imagens/`       | Imagens utilizadas na documentação              |
| `README.md`      | Apresentação e documentação do projeto          |

## 📚 Aprendizados praticados

- Uso de variáveis, constantes e funções.
- Condicionais e laços de repetição.
- Manipulação de elementos HTML com JavaScript.
- Eventos de teclado e controle de teclas pressionadas.
- Coordenadas e desenho no Canvas.
- Animação com requestAnimationFrame.
- Detecção de colisão entre retângulos.
- Ajuste da velocidade no movimento diagonal.
- Controle dos estados do menu e da missão.
- Reutilização de funções de desenho e colisão.
- Persistência de dados com localStorage.
- Versionamento com Git e publicação no GitHub Pages.

## 🔜 Evolução do projeto

- [x] Publicar uma versão jogável online.
- [x] Adicionar uma captura de tela ao README.
- [x] Criar uma tela inicial com instruções.
- [x] Implementar movimento contínuo e corrida.
- [x] Adicionar retirada e entrega de encomenda.
- [x] Salvar o recorde no navegador.
- [x] Implementar pausa, continuação e nova partida.
- [x] Adicionar oficina e melhorar as colisões.
- [ ] Melhorar a adaptação da interface a diferentes telas.
- [ ] Continuar organizando o código para facilitar a manutenção.
- [ ] Expandir o mapa e adicionar novas missões.

## 👩‍💻 Autora

Desenvolvido por **Jessica Farias**, estudante de Gestão da Tecnologia da Informação e desenvolvimento full stack, como projeto de aprendizado e portfólio.

[Conheça meu GitHub](https://github.com/JessicaOFarias)
