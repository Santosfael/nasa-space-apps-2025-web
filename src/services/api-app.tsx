import { env } from '@/env';
import axios from 'axios';

// Tipos para a resposta da API
export interface APITemperatureCondition {
  probability: string
  threshold: string
}

export interface APITemperatureResponse {
  analysis: {
    full_analysis: {
      Cold: APITemperatureCondition;
      Hot: APITemperatureCondition;
      'Very Cold': APITemperatureCondition;
      'Very Hot': APITemperatureCondition;
    }
    most_likely_condition: string;
  }
  data_source_location: string;
}

export interface APIPrecipitationResponse {
  analysis: {
    full_analysis: {
      Light: APITemperatureCondition;
      Moderate: APITemperatureCondition;
      Heavy: APITemperatureCondition;
      'Very Heavy': APITemperatureCondition;
    }
    most_likely_condition: string;
  }
  data_source_location: string;
}

export interface APIHumidityResponse {
  analysis: {
    full_analysis: {
      Low: APITemperatureCondition;
      Moderate: APITemperatureCondition;
      High: APITemperatureCondition;
      'Very High': APITemperatureCondition;
    }
    most_likely_condition: string;
  }
  data_source_location: string;
}

// Parâmetros para as requisições
export interface WeatherAPIParams {
  lat: number
  lon: number
  date: string // YYYY-MM-DD
  hour?: number // 0-23, opcional
}

// Configuração do axios
const api = axios.create({
  baseURL: env.VITE_API_BASE_URL,
  timeout: 10000, // 10 segundos
})

// Serviços de API
export const weatherAPI = {
  // Buscar dados de temperatura
  getTemperatureData: async (params: WeatherAPIParams): Promise<APITemperatureResponse> => {
    let pathUrl: string = "";
    const queryParams = new URLSearchParams({
      lat: params.lat.toString(),
      lon: params.lon.toString(),
      date: params.date,
    })

    if (params.hour !== undefined) {
      queryParams.append('hour', params.hour.toString())
      console.log(params.hour)
      pathUrl = `/hourly-probability?${queryParams}`
    } else {
      pathUrl = `/daily-probability?${queryParams}`
    }

    const response = await api.get<APITemperatureResponse>(pathUrl)
    return response.data
  },

  // Buscar dados de precipitação (preparado para futuro uso)
  getPrecipitationData: async (params: WeatherAPIParams): Promise<APIPrecipitationResponse> => {
    const queryParams = new URLSearchParams({
      lat: params.lat.toString(),
      lon: params.lon.toString(),
      date: params.date,
    })

    if (params.hour !== undefined) {
      queryParams.append('hour', params.hour.toString())
    }

    // Endpoint ainda não existe, mas estrutura está pronta
    const response = await api.get<APIPrecipitationResponse>(`/precipitation-probability?${queryParams}`)
    return response.data;
  },

  // Buscar dados de umidade (preparado para futuro uso)
  getHumidityData: async (params: WeatherAPIParams): Promise<APIHumidityResponse> => {
    const queryParams = new URLSearchParams({
      lat: params.lat.toString(),
      lon: params.lon.toString(),
      date: params.date,
    })

    if (params.hour !== undefined) {
      queryParams.append('hour', params.hour.toString())
    }

    // Endpoint ainda não existe, mas estrutura está pronta
    const response = await api.get<APIHumidityResponse>(`/humidity-probability?${queryParams}`)
    return response.data
  },

  // Buscar todos os dados de uma vez (quando todos os endpoints estiverem disponíveis)
  getAllWeatherData: async (params: WeatherAPIParams) => {
    try {
      const [temperatureData] = await Promise.all([
        weatherAPI.getTemperatureData(params),
        // Quando os outros endpoints estiverem prontos, descomente:
        // weatherAPI.getPrecipitationData(params),
        // weatherAPI.getHumidityData(params),
      ]);

      return {
        temperature: temperatureData,
        // precipitation: precipitationData,
        // humidity: humidityData,
      };
    } catch (error) {
      console.error('Error fetching weather data:', error)
      throw error
    }
  }
}

// Utilitário para converter resposta da API para formato interno
export const convertAPITemperatureData = (apiData: APITemperatureResponse) => {
  const analysis = apiData.analysis.full_analysis;
  
  // Encontrar a condição com maior probabilidade
  const conditions = Object.entries(analysis);
  const highestProbability = conditions.reduce((max, [key, value]) => {
    const prob = parseFloat(value.probability.replace('%', ''))
    const maxProb = parseFloat(max[1].probability.replace('%', ''))
    return prob > maxProb ? [key, value] : max
  })

  // Extrair informações de temperatura do threshold
  const extractTemperatureRange = (threshold: string): string => {
    const match = threshold.match(/between ([\d.]+)°C and ([\d.]+)°C/)
    if (match) {
      return `${match[1]}°C - ${match[2]}°C`
    }
    
    const lessThanMatch = threshold.match(/< ([\d.]+)°C/)
    if (lessThanMatch) {
      return `< ${lessThanMatch[1]}°C`
    }
    
    const greaterThanMatch = threshold.match(/> ([\d.]+)°C/)
    if (greaterThanMatch) {
      return `> ${greaterThanMatch[1]}°C`
    }
    
    return 'N/A'
  };

  return {
    probability: parseFloat(highestProbability[1].probability.replace('%', '')),
    range: extractTemperatureRange(highestProbability[1].threshold),
    description: `${apiData.analysis.most_likely_condition} é a condição mais provável`,
    rawData: apiData,
    mostLikelyCondition: apiData.analysis.most_likely_condition,
    allConditions: analysis
  }
}

// Interceptador para tratamento de erros
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response) {
      // Erro com resposta do servidor
      console.error('API Error:', error.response.status, error.response.data)
    } else if (error.request) {
      // Erro de rede
      console.error('Network Error:', error.request)
    } else {
      // Outro tipo de erro
      console.error('Error:', error.message)
    }
    throw error
  }
)

export default api