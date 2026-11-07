# Nails Academy — React + TypeScript

Migração do site multipágina original para o projeto Vite, React e TypeScript. O conteúdo, as imagens, a paleta e as oito páginas foram preservados. A navegação agora usa React Router, com carregamento separado das páginas.

## Executar

```sh
npm install
npm run dev
```

Abra o endereço informado pelo Vite no terminal (normalmente `http://localhost:5173`). `npm start` também inicia o servidor. Ao editar componentes, o Vite atualiza a página automaticamente.

```sh
npm run build    # verifica TypeScript e gera dist/
npm run preview  # confere a versão compilada
npm run lint     # verifica o código
npm test         # testa desktop e celular no Chrome
```

Os testes usam o Google Chrome instalado no computador, em modo headless. A configuração fica em `playwright.config.ts`. Não é necessário instalar outro navegador neste computador.

## Páginas e rotas

| Rota | Componente |
| --- | --- |
| `/` | `HomePage.tsx` |
| `/sobre` | `AboutPage.tsx` |
| `/servicos` | `ServicesPage.tsx` |
| `/cores` | `ColorsPage.tsx` |
| `/estilos` | `StylesPage.tsx` |
| `/depoimentos` | `TestimonialsPage.tsx` |
| `/localizacao` | `LocationPage.tsx` |
| `/agendamento` | `BookingPage.tsx` |

As rotas antigas, como `/servicos.html` e `/index.html`, redirecionam para as novas. Endereços desconhecidos mostram uma página 404 com acesso ao início.

## Estrutura

```text
src/
  App.tsx                   Rotas e carregamento das páginas
  main.tsx                  Entrada React e BrowserRouter
  index.css                 Estilos globais
  components/
    Layout.tsx              Estrutura comum, metadados, breadcrumbs e foco
    Header.tsx              Menu responsivo e página ativa
    Footer.tsx              Navegação e contato
    WhatsAppButton.tsx       Botão flutuante
    SectionHeading.tsx       Título das páginas
    NailGallery.tsx          Cards e carrossel
    NailModal.tsx            Detalhes, fotos e mensagem de WhatsApp
    StudioMap.tsx            Mapa Leaflet com limpeza ao trocar de rota
  data/
    site.ts                 Contato, endereço, horários, coordenadas e metadados
    catalog.ts              Cores e formatos tipados
  pages/                    Um componente para cada página
  styles/
    base.css                Paleta, fontes e acessibilidade
    layout.css              Menu e rodapé
    components.css          Botões e elementos compartilhados
    pages/                  Estilos específicos por página
public/
  images/                   Todas as imagens do projeto original
  favicon.svg               Ícone do Nails Academy
  _redirects                Fallback SPA para hospedagens compatíveis
tests/
  site.spec.ts              Testes de navegação, responsividade, modais e mapa
```

## Manutenção

- **WhatsApp, endereço, horários e coordenadas:** `src/data/site.ts`.
- **Cores, descrições, fotos e formatos:** `src/data/catalog.ts`. Sem foto, o modal mostra a amostra de cor.
- **Serviços e preços:** `src/pages/ServicesPage.tsx`.
- **Textos das páginas:** os componentes correspondentes em `src/pages/`.
- **Paleta e fontes:** `src/styles/base.css`; fontes externas no `index.html`.
- **Nova página:** crie o componente, adicione a rota em `App.tsx` e os metadados em `site.ts`.

O menu, rodapé e contatos são compartilhados. Os modais fecham com Escape, mantêm o foco dentro do diálogo e devolvem o foco ao card ao fechar. O mapa usa Leaflet instalado pelo npm; as imagens do mapa e as fontes externas precisam de internet. A página mantém endereço, horários e o link para traçar rota quando as imagens do mapa não carregam.

## Publicar

Execute `npm run build` e publique **a pasta `dist/`**. A hospedagem precisa encaminhar rotas como `/servicos` para `/index.html`, pois a aplicação usa BrowserRouter. O arquivo `public/_redirects` fornece essa regra para provedores compatíveis, como Netlify. Em outros servidores, configure o fallback SPA equivalente.

Para hospedar em uma subpasta, configure `base: '/nome-da-subpasta/'` no `vite.config.ts` antes de compilar. O roteador e as imagens usam essa base.

Este projeto é o frontend do studio; o agendamento continua sendo combinado pelo WhatsApp. Os dados e a indicação de demonstração foram mantidos do site original.
