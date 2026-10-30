# 🌆 Cidade Neon — Versão 1.0

Jogo 2D de entrega urbana com estética neon, desenvolvido com HTML, CSS e JavaScript. O cenário e os personagens são desenhados por código usando a API Canvas 2D.

Retire encomendas na loja, atravesse o trânsito e chegue ao destino antes que o tempo termine. Complete 10 entregas e acumule R$ 500 para vencer a partida!

> ✅ Versão 1.0 jogável concluída e testada no computador e no celular.
>
> Criado como projeto de aprendizado e portfólio em desenvolvimento front-end. Novas versões poderão expandir o mapa e a apresentação visual.

## 🎮 Jogue agora

👉 **[Abrir Cidade Neon](https://jessicaofarias.github.io/jogo-urbano-js/)**

Jogue no computador usando o teclado ou no celular usando os controles por toque.

## 📸 Prévia do jogo

![Tela do jogo Cidade Neon](imagens/cidade-neon.jpg)

## 📦 Como jogar

1. Clique ou toque em **Jogar**.
2. Vá até a área de retirada da loja para coletar a encomenda.
3. Leve a encomenda ao destino indicado em verde.
4. Entre completamente na área de entrega antes que o tempo termine.
5. Use **Próxima entrega** para continuar a partida.
6. Complete **10 entregas e R$ 500** para alcançar a vitória.

Evite os obstáculos e os carros em movimento. Colisões com o trânsito causam uma penalidade de 5 segundos, seguida de 2 segundos de proteção.

Se o tempo acabar, reinicie a missão para tentar novamente.

## ✨ Funcionalidades

### Missões, tempo e vitória

- Missões em duas etapas: retirada e entrega.
- Indicadores visuais dos pontos de retirada e entrega.
- Barra de tempo para acompanhar o prazo da missão.
- Painel com saldo, entregas e progressão.
- Vitória ao completar 10 entregas e acumular R$ 500.
- Reinício da missão após o tempo acabar.
- Opção de jogar novamente, zerando o saldo e as entregas da partida.
- Recordes salvos no navegador com localStorage e preservados após recarregar a página.

### Movimento, trânsito e colisões

- Movimento contínuo e corrida.
- Movimento diagonal com velocidade ajustada.
- Limites de movimentação dentro do mapa.
- Colisões com os obstáculos do cenário.
- Colisões por eixo, permitindo deslizar ao longo dos obstáculos.
- Dois carros em movimento.
- Penalidade de 5 segundos ao colidir com o trânsito.
- Proteção temporária de 2 segundos após uma colisão.
- Progressão de níveis com aumento da velocidade do trânsito.
- Painel indicando as entregas restantes para subir de nível.

### Personagem e cenário

- Personagem com boné e uniforme.
- Bolsa que muda de cor ao carregar uma encomenda.
- Animação das pernas ao andar e correr.
- Loja e oficina com letreiros neon e detalhes visuais.
- Pontos de retirada e entrega destacados.
- Faixa amarela posicionada para não sobrepor a retirada.
- Cenário desenhado com Canvas 2D.

### Interface e dispositivos

- Tela inicial com apresentação, instruções e autoria.
- Menu com instruções roláveis e botões visíveis.
- Pausa e continuação da partida.
- Botões para pausar, reiniciar a missão e iniciar a próxima entrega.
- Controles de movimento e corrida por toque.
- Layout adaptado para celular em pé e deitado.
- Navegação pelos botões usando o teclado.
- Foco no canvas ao iniciar ou retomar a partida.
- Pausa automática quando a janela perde o foco.

### Efeitos sonoros

- Som ao retirar uma encomenda.
- Som ao concluir uma entrega.
- Som ao colidir com o trânsito.
- Botão para ligar e desligar os sons.

## ⌨️ Controles no computador

| Tecla           | Ação                                |
| --------------- | ----------------------------------- |
| Setas           | Mover o personagem                  |
| Shift + seta    | Correr                              |
| R               | Reiniciar a missão                  |
| Esc             | Voltar ao menu mantendo o progresso |
| Tab             | Navegar pelos botões                |
| Enter ou Espaço | Acionar o botão selecionado         |

Os botões da interface também permitem pausar, reiniciar a missão, iniciar a próxima entrega e controlar o som.

## 📱 Controles no celular

- Use os botões direcionais na tela para mover o personagem.
- Use o controle de corrida junto com uma direção para correr.
- Toque em **Pausar** para acessar o menu.
- Toque em **Reiniciar missão** para tentar novamente.
- Após concluir uma entrega, toque em **Próxima entrega**.
- Use o botão de som para ativar ou silenciar os efeitos.

O jogo pode ser utilizado com o celular em pé ou deitado.

## 🏆 Progresso e recordes

A meta da partida é completar **10 entregas e acumular R$ 500**.

Ao escolher jogar novamente, o saldo e as entregas da partida são zerados. Os recordes permanecem salvos no navegador utilizado, inclusive após atualizar a página.

Os dados são armazenados localmente com localStorage e não são sincronizados entre dispositivos ou navegadores.

## 🛠️ Tecnologias

| Tecnologia   | Uso no projeto                                           |
| ------------ | -------------------------------------------------------- |
| HTML5        | Estrutura da página, botões e elemento Canvas            |
| CSS3         | Identidade visual neon e adaptação da interface às telas |
| JavaScript   | Movimento, missões, colisões, tempo, sons e interação    |
| Canvas 2D    | Desenho do cenário e animação do personagem              |
| localStorage | Armazenamento dos recordes no navegador                  |
| Git e GitHub | Controle de versão e hospedagem do código                |
| GitHub Pages | Publicação da versão jogável                             |

## 🚀 Como executar localmente

1. Clique em **Code → Download ZIP** neste repositório.
2. Extraia a pasta do projeto.
3. Abra o arquivo `index.html` em um navegador.
4. Clique em **Jogar**.

Também é possível abrir a pasta no VS Code e executar o projeto com a extensão Live Server.

## 📁 Estrutura do projeto

| Arquivo ou pasta | Descrição                                |
| ---------------- | ---------------------------------------- |
| `index.html`     | Estrutura da página, menus e controles   |
| `style.css`      | Estilos e adaptação da interface         |
| `game.js`        | Desenho, animação, sons e regras do jogo |
| `imagens/`       | Imagens utilizadas na documentação       |
| `README.md`      | Apresentação e documentação do projeto   |

## ✅ Validação da versão 1.0

Testes manuais realizados durante o desenvolvimento:

- [x] Vitória com 10 entregas e R$ 500.
- [x] Nova partida zerando saldo e entregas.
- [x] Reinício da missão após o tempo acabar.
- [x] Recordes preservados após atualizar a página.
- [x] Controles funcionando no computador e no celular.
- [x] Sons de retirada, entrega e colisão.
- [x] Botão para silenciar os sons.
- [x] Menu ajustado e barra de tempo funcionando.

## 📚 Aprendizados praticados

- Variáveis, constantes, funções, condicionais e laços.
- Manipulação de elementos HTML com JavaScript.
- Eventos de teclado e controles por toque.
- Coordenadas, desenho e animação no Canvas.
- Loop de animação com requestAnimationFrame.
- Detecção de colisão entre retângulos.
- Ajuste da velocidade no movimento diagonal.
- Controle dos estados do menu, das missões e da partida.
- Temporizadores, penalidades e proteção temporária.
- Integração de efeitos sonoros e controle de áudio.
- Layout adaptado para diferentes tamanhos e orientações de tela.
- Persistência de dados com localStorage.
- Versionamento com Git e publicação no GitHub Pages.

## 🔜 Evolução futura

A versão 1.0 conclui a primeira experiência jogável do Cidade Neon.

As próximas etapas poderão incluir:

- Mapa detalhado com quarteirões, ruas e novos estabelecimentos.
- Arte pixelada para edifícios, veículos e personagens.
- Novas rotas e tipos de missão.
- Mais elementos visuais para dar vida à cidade.
- Melhorias na organização do código conforme o projeto crescer.

Esses itens são planos de evolução e ainda não fazem parte da versão 1.0.

## 👩‍💻 Autora

Desenvolvido por **Jessica Farias**, estudante de Gestão da Tecnologia da Informação e desenvolvimento full stack, como projeto de aprendizado e portfólio.

[Conheça meu GitHub](https://github.com/JessicaOFarias)
