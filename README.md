# RiderCar

RiderCar e um projeto front-end de locadora de carros criado para portfolio. A proposta e transformar uma landing page estatica em uma experiencia mais profissional, com foco em responsividade, UX, organizacao de codigo, SEO basico e interacoes que simulam um fluxo real de aluguel.

## Preview

![Preview da homepage da RiderCar](assets/images/ridercar-scroll.gif)

Demo: [rider-car.vercel.app](https://rider-car.vercel.app)

## Sobre o projeto

Este projeto simula a interface de uma locadora moderna, com uma frota renderizada via JavaScript, busca por marca/preco/ano, simulacao de reserva, modo escuro e secoes pensadas para portfolio.

O objetivo principal foi deixar o projeto com uma apresentacao mais crivel para GitHub e recrutadores, mantendo a stack simples e acessivel.

## Funcionalidades

- Busca por marca, modelo, preco mensal maximo e ano minimo
- Cards de carros renderizados por array JavaScript
- Catalogo dedicado com 25 veiculos e filtros combinados
- Botao "Alugar agora" com modal de simulacao
- Favoritos com feedback visual
- Formulario de contato com envio simulado
- Modo escuro
- Ano do rodape atualizado automaticamente
- Textos reescritos para contexto real de aluguel
- SEO basico com `meta description`, Open Graph e `alt` descritivos
- Layout responsivo para mobile, tablet e desktop

## Tecnologias

- HTML5
- CSS3
- JavaScript
- Ionicons
- Google Fonts

## Estrutura

```text
.
|-- index.html
|-- catalogo.html
|-- README.md
`-- assets
    |-- css/style.css
    |-- js/cars.js
    |-- js/script.js
    |-- js/catalog.js
    `-- images/
```

## Como rodar localmente

1. Clone o repositorio:

```bash
git clone https://github.com/faellim/ridercar.git
```

2. Entre na pasta do projeto:

```bash
cd ridercar
```

3. Abra o arquivo `index.html` no navegador.

Se quiser uma experiencia mais proxima de deploy, voce tambem pode usar uma extensao como Live Server no VS Code.

## Melhorias aplicadas nesta versao

- Reescrita completa dos textos genericos
- Inclusao da secao "Sobre o projeto"
- Padronizacao de capitalizacao e informacoes dos cards
- Transformacao de links e botoes em acoes reais
- Refino visual para parecer mais produto e menos template
- Criacao de um catalogo completo com pagina propria
- Melhor documentacao do repositorio

## Sugestao de metadata para o GitHub

Descricao:

`Projeto front-end de locadora de carros com filtros, simulacao de aluguel, dark mode e layout responsivo para portfolio.`

Website:

`https://faellim.github.io/ridercar/`

Topics:

`html`
`css`
`javascript`
`responsive-design`
`landing-page`
`frontend-project`
`portfolio`
`car-rental`
`ui-design`

## Aprendizados

Durante a evolucao do projeto, os principais aprendizados foram:

- como melhorar a percepcao de qualidade de um projeto com conteudo mais realista
- como organizar melhor um front-end estatico para facilitar manutencao
- como usar JavaScript para tornar a interface mais dinamica sem depender de backend
- como aplicar detalhes de SEO e acessibilidade que valorizam um projeto no portfolio

## Proximos passos

- integrar um backend ou API para reservas reais
- adicionar filtros por categoria e cidade
- persistir tema e favoritos no `localStorage`
- criar pagina individual para detalhes de cada carro
- publicar com dominio proprio e customizar o social preview do GitHub
