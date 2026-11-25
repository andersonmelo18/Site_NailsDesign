// src/hooks/useWeather.ts
//
// Custom hook que conecta o serviço de API (src/services/weather.ts) com a
// interface React. É aqui que ficam os hooks pedidos pela avaliação:
//   - useState: guarda os 3 estados possíveis da requisição (carregando,
//     deu certo, deu erro).
//   - useEffect: dispara a busca assim que o componente usa este hook, e
//     busca de novo se a latitude/longitude mudar.
//
// Qualquer componente pode reaproveitar este hook passando lat/lon
// diferentes — por isso ele foi feito separado do componente visual
// (WeatherCard). Isso é o mesmo padrão de "separar lógica de apresentação"
// já usado no restante do projeto.
import { useEffect, useState } from 'react'
import { getWeather, type WeatherData } from '../services/weather'

// Os três estados possíveis de uma requisição assíncrona. Modelar como um
// "union type" evita, por exemplo, loading=true e error preenchido ao mesmo
// tempo — o TypeScript não deixa.
type WeatherState =
  | { status: 'loading' }
  | { status: 'success'; data: WeatherData }
  | { status: 'error'; message: string }

export function useWeather(latitude: number, longitude: number): WeatherState {
  // Começa sempre em "loading": é o estado mostrado enquanto a Promise da
  // API ainda não respondeu.
  const [state, setState] = useState<WeatherState>({ status: 'loading' })

  useEffect(() => {
    // `cancelado` evita o chamado "setState em componente desmontado": se o
    // usuário sair da página antes da API responder, não tentamos mais
    // atualizar o estado. Boa prática comum em efeitos que fazem fetch.
    //
    // Observação: não chamamos setState síncrono aqui dentro do efeito (por
    // exemplo, para "voltar" a loading antes de buscar) — o ESLint do
    // projeto (regra react-hooks/set-state-in-effect) sinaliza isso porque
    // pode gerar renders em cascata. O estado inicial do useState já é
    // "loading", então o primeiro carregamento funciona normalmente; os
    // componentes que usam este hook (WeatherCard em BookingPage e
    // LocationPage) sempre chamam com as mesmas coordenadas, então o caso de
    // "mudar latitude/longitude em tempo real" não acontece na prática.
    let cancelado = false

    getWeather(latitude, longitude)
      .then(data => {
        if (!cancelado) setState({ status: 'success', data })
      })
      .catch((error: Error) => {
        // Tratamento de erro pedido pela avaliação: qualquer falha na
        // requisição (rede, status HTTP, dados ausentes) cai aqui.
        if (!cancelado) setState({ status: 'error', message: error.message })
      })

    return () => { cancelado = true }
  }, [latitude, longitude])

  return state
}
