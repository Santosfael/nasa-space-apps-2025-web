/* eslint-disable @typescript-eslint/no-explicit-any */
// Tipos de dados
export interface Location {
  name: string
  lat: number
  lng: number
}

export interface WeatherData {
  temperature: {
    probability: number
    range: string
    description: string
    mostLikelyCondition?: string
    allConditions?: any
    rawData?: any
  };
  precipitation: {
    probability: number
    amount: string
    description: string
    mostLikelyCondition?: string
    allConditions?: any
    rawData?: any
  };
  windSpeed: {
    probability: number
    speed: string
    description: string
  };
  airQuality: {
    probability: number
    index: string
    description: string
  };
  humidity: {
    probability: number
    level: string
    description: string
    mostLikelyCondition?: string
    allConditions?: any
    rawData?: any
  };
  visibility: {
    probability: number
    distance: string
    description: string
  }
}

export interface DailyForecast {
  date: string
  temperature: number
  precipitation: number
  windSpeed: number
  humidity: number
  airQuality: string
}

export interface DateRange {
  startDate: string
  endDate: string
  hour?: number // Hora específica (0-23)
}

// Dados mocados de localizações populares
export const POPULAR_CITIES: Location[] = [
  { name: 'São Paulo, Brasil', lat: -23.55, lng: -46.63 },
  { name: 'Rio de Janeiro, Brasil', lat: -22.9068, lng: -43.1729 },
  { name: 'New York, EUA', lat: 40.7128, lng: -74.0060 },
  { name: 'London, Reino Unido', lat: 51.5074, lng: -0.1278 },
  { name: 'Tokyo, Japão', lat: 35.6762, lng: 139.6503 },
  { name: 'Sydney, Austrália', lat: -33.8688, lng: 151.2093 },
  { name: 'Paris, França', lat: 48.8566, lng: 2.3522 },
  { name: 'Berlin, Alemanha', lat: 52.5200, lng: 13.4050 },
  { name: 'Mumbai, Índia', lat: 19.0760, lng: 72.8777 },
  { name: 'Cairo, Egito', lat: 30.0444, lng: 31.2357 }
];

// Dados mocados para tendências
export const TREND_DATA = [
  { day: 'Dia 1', temperatura: 22, precipitacao: 10, vento: 15 },
  { day: 'Dia 2', temperatura: 25, precipitacao: 5, vento: 12 },
  { day: 'Dia 3', temperatura: 28, precipitacao: 0, vento: 8 },
  { day: 'Dia 4', temperatura: 26, precipitacao: 20, vento: 18 },
  { day: 'Dia 5', temperatura: 23, precipitacao: 15, vento: 14 },
  { day: 'Dia 6', temperatura: 21, precipitacao: 25, vento: 20 },
  { day: 'Dia 7', temperatura: 24, precipitacao: 5, vento: 10 },
];

// Dados para distribuição de condições climáticas
export const DISTRIBUTION_DATA = [
  { name: 'Ensolarado', value: 35, color: '#FFD700' },
  { name: 'Parcialmente Nublado', value: 30, color: '#87CEEB' },
  { name: 'Nublado', value: 20, color: '#708090' },
  { name: 'Chuvoso', value: 15, color: '#4682B4' },
]

// Dados mocados para previsão diária
export const DAILY_FORECAST_DATA: DailyForecast[] = [
  { date: '2025-01-01', temperature: 22, precipitation: 10, windSpeed: 15, humidity: 65, airQuality: 'Good' },
  { date: '2025-01-02', temperature: 25, precipitation: 5, windSpeed: 12, humidity: 60, airQuality: 'Good' },
  { date: '2025-01-03', temperature: 28, precipitation: 0, windSpeed: 8, humidity: 55, airQuality: 'Moderate' },
  { date: '2025-01-04', temperature: 26, precipitation: 20, windSpeed: 18, humidity: 70, airQuality: 'Good' },
  { date: '2025-01-05', temperature: 23, precipitation: 15, windSpeed: 14, humidity: 68, airQuality: 'Good' },
  { date: '2025-01-06', temperature: 21, precipitation: 25, windSpeed: 20, humidity: 75, airQuality: 'Moderate' },
  { date: '2025-01-07', temperature: 24, precipitation: 5, windSpeed: 10, humidity: 62, airQuality: 'Good' },
]

// Função para gerar dados meteorológicos baseados na localização
export const generateMockWeatherData = (location: Location, dateRange: { startDate: string; endDate: string }): WeatherData => {
  // Fatores baseados na localização (latitude influencia temperatura)
  const latitudeFactor = Math.abs(location.lat) / 90; // 0-1
  const seasonFactor = Math.sin((new Date(dateRange.startDate).getMonth() / 12) * Math.PI * 2); // -1 a 1
  
  // Probabilidades base com alguma variação baseada na localização
  const baseProbabilities = {
    temperature: 65 + Math.random() * 30,
    precipitation: 40 + Math.random() * 40,
    windSpeed: 50 + Math.random() * 35,
    airQuality: 70 + Math.random() * 25,
    humidity: 55 + Math.random() * 35,
    visibility: 75 + Math.random() * 20,
  }

  return {
    temperature: {
      probability: Math.round(baseProbabilities.temperature),
      range: `${Math.round(20 - latitudeFactor * 10 + seasonFactor * 8)}°C - ${Math.round(28 - latitudeFactor * 8 + seasonFactor * 10)}°C`,
      description: baseProbabilities.temperature > 70 
        ? 'Alta probabilidade de temperaturas na faixa prevista'
        : baseProbabilities.temperature > 50
        ? 'Probabilidade moderada de temperaturas na faixa prevista'
        : 'Baixa probabilidade de temperaturas na faixa prevista'
    },
    precipitation: {
      probability: Math.round(baseProbabilities.precipitation),
      amount: `${Math.round(Math.random() * 25)}mm - ${Math.round(15 + Math.random() * 35)}mm`,
      description: baseProbabilities.precipitation > 60
        ? 'Alta chance de precipitação'
        : baseProbabilities.precipitation > 30
        ? 'Possibilidade moderada de chuva'
        : 'Baixa probabilidade de precipitação'
    },
    windSpeed: {
      probability: Math.round(baseProbabilities.windSpeed),
      speed: `${Math.round(5 + Math.random() * 15)}km/h - ${Math.round(20 + Math.random() * 25)}km/h`,
      description: baseProbabilities.windSpeed > 70
        ? 'Ventos fortes esperados'
        : baseProbabilities.windSpeed > 40
        ? 'Ventos moderados'
        : 'Ventos fracos ou calmos'
    },
    airQuality: {
      probability: Math.round(baseProbabilities.airQuality),
      index: Math.random() > 0.7 ? 'Moderado' : 'Bom',
      description: baseProbabilities.airQuality > 80
        ? 'Excelente qualidade do ar esperada'
        : baseProbabilities.airQuality > 60
        ? 'Boa qualidade do ar'
        : 'Qualidade do ar pode ser moderada'
    },
    humidity: {
      probability: Math.round(baseProbabilities.humidity),
      level: `${Math.round(45 + Math.random() * 35)}% - ${Math.round(70 + Math.random() * 25)}%`,
      description: baseProbabilities.humidity > 70
        ? 'Alta umidade relativa'
        : baseProbabilities.humidity > 40
        ? 'Umidade moderada'
        : 'Baixa umidade'
    },
    visibility: {
      probability: Math.round(baseProbabilities.visibility),
      distance: `${Math.round(8 + Math.random() * 7)}km - ${Math.round(15 + Math.random() * 10)}km`,
      description: baseProbabilities.visibility > 80
        ? 'Excelente visibilidade'
        : baseProbabilities.visibility > 60
        ? 'Boa visibilidade'
        : 'Visibilidade pode ser reduzida'
    }
  }
}

// Função para buscar cidade por nome
export const findCityByName = (searchTerm: string): Location | null => {
  return POPULAR_CITIES.find(city => 
    city.name.toLowerCase().includes(searchTerm.toLowerCase())
  ) || null
}

// Função para criar localização fictícia
export const createMockLocation = (searchTerm: string): Location => {
  return {
    name: searchTerm,
    lat: -23.5505 + (Math.random() - 0.5) * 10,
    lng: -46.6333 + (Math.random() - 0.5) * 10
  }
}

// Função para gerar dados de probabilidade para gráficos
export const generateProbabilityData = (weatherData: WeatherData) => {
  return [
    { metric: 'Temperatura', probability: weatherData.temperature.probability },
    { metric: 'Precipitação', probability: weatherData.precipitation.probability },
    { metric: 'Vento', probability: weatherData.windSpeed.probability },
    { metric: 'Qualidade do Ar', probability: weatherData.airQuality.probability },
    { metric: 'Umidade', probability: weatherData.humidity.probability },
    { metric: 'Visibilidade', probability: weatherData.visibility.probability },
  ]
}

// Função para formatar dados de exportação
export const formatDataForExport = (location: Location, dateRange: { startDate: string; endDate: string }, weatherData: WeatherData) => {
  return {
    metadata: {
      location,
      dateRange,
      exportDate: new Date().toISOString(),
      source: 'NASA Earth Observation Data (Mocked)',
      version: '1.0'
    },
    weatherProbabilities: weatherData,
    dailyForecast: DAILY_FORECAST_DATA
  }
}

// Função para simular delay de API
export const simulateAPICall = (delay: number = 2000): Promise<void> => {
  return new Promise(resolve => setTimeout(resolve, delay));
}

// Configurações da aplicação
export const APP_CONFIG = {
  DEFAULT_MAP_CENTER: { lat: -23.55, lng: -46.63 }, // São Paulo como padrão
  API_SIMULATION_DELAY: 2000,
  SUPPORTED_EXPORT_FORMATS: ['json', 'csv'],
  MAX_DATE_RANGE_DAYS: 365,
  APP_NAME: 'NASA Earth Climate Dashboard',
  APP_DESCRIPTION: 'Análise de probabilidades climáticas baseada em dados de observação da Terra'
}