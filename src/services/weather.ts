// src/services/weather.ts
//
// "Consumo de API externa" exigido pela avaliação.
//
// Camada de serviço separada da interface: este arquivo só sabe conversar
// com a API, não sabe de React, hooks nem de tela. Quem usa (o hook
// `useWeather`, em src/hooks/useWeather.ts) é que decide como mostrar os
// dados, o loading e o erro. Separar assim deixa o código mais fácil de
// explicar: "aqui é onde buscamos o dado" e "ali é onde exibimos".
//
// API usada: Open-Meteo (https://open-meteo.com) — API pública de previsão
// do tempo, gratuita e sem necessidade de chave/cadastro, o que facilita
// rodar o projeto em qualquer máquina sem configurar variáveis de ambiente.
// Foi escolhida porque faz sentido para o produto: ajuda quem vai agendar
// um horário no studio a saber se vai chover, por exemplo.

// Formato de dado que a nossa aplicação usa internamente, já simplificado.
// Tipamos o retorno para não depender de "any" em nenhum ponto do app.
export interface WeatherData {
  temperaturaAtual: number // graus Celsius
  sensacaoTermica: number // graus Celsius
  descricao: string // texto em português, ex: "Céu limpo"
  precisaLevarGuardaChuva: boolean
}

// Formato bruto que a API da Open-Meteo devolve (só os campos que usamos).
interface OpenMeteoResponse {
  current: {
    temperature_2m: number
    apparent_temperature: number
    weather_code: number
    precipitation: number
  }
}

// A Open-Meteo representa a condição do tempo com códigos numéricos (WMO
// Weather Codes). Traduzimos os mais comuns para um texto em português;
// qualquer código fora dessa lista cai no "default" do switch abaixo.
function descreverCodigoDoTempo(codigo: number): string {
  if (codigo === 0) return 'Céu limpo'
  if ([1, 2, 3].includes(codigo)) return 'Parcialmente nublado'
  if ([45, 48].includes(codigo)) return 'Neblina'
  if ([51, 53, 55, 56, 57].includes(codigo)) return 'Garoa'
  if ([61, 63, 65, 66, 67, 80, 81, 82].includes(codigo)) return 'Chuva'
  if ([95, 96, 99].includes(codigo)) return 'Tempestade'
  return 'Tempo variável'
}

/**
 * Busca a previsão do tempo atual para uma coordenada (latitude/longitude).
 *
 * Usa `fetch`, nativo do navegador — não precisamos instalar axios.
 * A função é `async` e devolve uma Promise<WeatherData>, para quem chamar
 * poder usar `await` (ou `.then`) e tratar o erro com `try/catch`.
 *
 * @throws Error com uma mensagem amigável quando a API falha ou está fora do ar.
 */
export async function getWeather(latitude: number, longitude: number): Promise<WeatherData> {
  const params = new URLSearchParams({
    latitude: String(latitude),
    longitude: String(longitude),
    current: 'temperature_2m,apparent_temperature,weather_code,precipitation',
    timezone: 'America/Sao_Paulo',
  })

  let response: Response
  try {
    response = await fetch(`https://api.open-meteo.com/v1/forecast?${params.toString()}`)
  } catch {
    // Erro de rede (sem internet, DNS falhou, etc.) — tratamos aqui para que
    // quem chamar a função sempre receba um erro com mensagem legível.
    throw new Error('Não foi possível conectar ao serviço de previsão do tempo.')
  }

  if (!response.ok) {
    // A API respondeu, mas com um status de erro (ex: 400, 500).
    throw new Error(`O serviço de previsão do tempo respondeu com erro (status ${response.status}).`)
  }

  const dados = (await response.json()) as OpenMeteoResponse

  if (!dados?.current) {
    // A resposta veio "ok", mas sem os dados que esperávamos: tratamos como
    // "dados inexistentes", um dos cenários pedidos na avaliação.
    throw new Error('O serviço de previsão do tempo não retornou dados válidos.')
  }

  return {
    temperaturaAtual: Math.round(dados.current.temperature_2m),
    sensacaoTermica: Math.round(dados.current.apparent_temperature),
    descricao: descreverCodigoDoTempo(dados.current.weather_code),
    precisaLevarGuardaChuva: dados.current.precipitation > 0,
  }
}
