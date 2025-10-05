import { RefreshCw, Satellite } from "lucide-react";
import { Badge } from "./components/ui/badge";
import { LocationSelector } from "./components/location-selector";
import { SelectorDate } from "./components/selector-date";
import { Card, CardContent } from "./components/ui/card";
import { Button } from "./components/ui/button";
import { useState } from "react";
import { generateMockWeatherData, type DateRange, type Location, type WeatherData } from "./data/mock-weather-data";
import { DataExport } from "./components/data-export";
import { Separator } from "./components/ui/separator";
import { WeatherDataVisualization } from "./components/weatcher-date-visualization";
import { APIStatusIndicator } from "./components/api-status-indicator";
import { convertAPITemperatureData, weatherAPI } from "./services/api-app";


export function App() {

  const [selectedLocation, setSelectedLocation] = useState<Location | null>(null)
  const [selectedDateRange, setSelectedDateRange] = useState<DateRange | null>(null)
  const [weatherData, setWeatherData] = useState<WeatherData | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [apiError, setApiError] = useState<string | null>(null)

  async function handleGenerateData() {
    if (!selectedLocation || !selectedDateRange) return

    setIsLoading(true)
    setApiError(null)

    try {
      // Chama a API real da NASA para temperatura
      const temperatureResponse = await weatherAPI.getTemperatureData({
        lat: selectedLocation.lat,
        lon: selectedLocation.lng,
        date: selectedDateRange.startDate,
        hour: selectedDateRange.hour
      })

      console.log(temperatureResponse)

      // Converte os dados da API para o formato interno
      const temperatureData = convertAPITemperatureData(temperatureResponse)

      // Gera dados mocados para outras métricas (até que as APIs estejam disponíveis)
      const mockData = generateMockWeatherData(selectedLocation, selectedDateRange)
      // Combina dados reais da temperatura com dados mocados
      const combinedData: WeatherData = {
        ...mockData,
        temperature: {
          ...temperatureData,
          rawData: temperatureResponse
        }
      }
      setWeatherData(combinedData)
    } catch (error) {
      console.error('Erro ao buscar dados da API:', error)

      // Define o erro para exibição no status
      setApiError(error instanceof Error ? error.message : 'Erro desconhecido')

      // Fallback para dados mocados em caso de erro
      const mockData = generateMockWeatherData(selectedLocation, selectedDateRange)
      setWeatherData(mockData)
    } finally {
      setIsLoading(false)
    }
  };

  const canGenerateData = selectedLocation && selectedDateRange

  const formatDateRange = (dateRange: DateRange) => {
    const formatSingleDate = (date: string) => {
      const formatted = new Date(date).toLocaleDateString('pt-BR');
      return dateRange.hour !== undefined
        ? `${formatted} às ${dateRange.hour.toString().padStart(2, '0')}:00`
        : formatted;
    };

    if (dateRange.startDate === dateRange.endDate) {
      return formatSingleDate(dateRange.startDate);
    }

    const start = new Date(dateRange.startDate).toLocaleDateString('pt-BR');
    const end = new Date(dateRange.endDate).toLocaleDateString('pt-BR');
    const hourInfo = dateRange.hour !== undefined
      ? ` às ${dateRange.hour.toString().padStart(2, '0')}:00`
      : '';

    return `${start} - ${end}${hourInfo}`
  }

  return (
    <div className="min-h-screen bg-background">
      {/*Header */}
      <div className="border-b">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-blue-100 rounded-lg">
              <Satellite className="h-6 w-6 text-blue-600" />
            </div>

            <div>
              <h1 className="text-3xl">Climate Dashboard</h1>
              <p className="text-muted-foreground">
                Análise de probabilidade climáticas baseadas em dados de observação da Terra disponibilizado pela Nasa
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Badge variant="outline">Dados Da NASA</Badge>
            <Badge variant="outline">Modelos Preditivos</Badge>
            <APIStatusIndicator
              isLoading={isLoading}
              hasAPIData={weatherData?.temperature?.rawData !== undefined}
              error={apiError}
            />
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Painel de seleção para analise das informações */}
          <div className="lg:col-span-1 space-y-6">
            <LocationSelector
              onLocationSelect={setSelectedLocation}
            />
            <SelectorDate
              onDateSelect={setSelectedDateRange}
              selectedDateRange={selectedDateRange}
            />

            <Card>
              <CardContent className="p-4">
                <Button
                  onClick={handleGenerateData}
                  disabled={!canGenerateData || isLoading}
                  className="w-full"
                  size="lg"
                >
                  {isLoading ? (
                    <>
                      <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                      Processando dados...
                    </>
                  ) : (
                    <>
                      <Satellite className="h-4 w-4 mr-2" />
                      Gerar Análise Climáticas
                    </>
                  )}
                </Button>

                {!canGenerateData && (
                  <p className="text-sm text-muted-foreground mt-2 text-center">
                    Selecione um local e período para continuar
                  </p>
                )}

                {canGenerateData && !weatherData && (
                  <div className="mt-3 p-3 bg-blue-50 rounded-lg">
                    <p className="text-sm text-blue-800">
                      Pronto para analisar dados climáticos para <strong>{selectedLocation?.name}</strong>
                      {selectedDateRange && (
                        <> no período de <strong>{formatDateRange(selectedDateRange)}</strong></>
                      )}
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Export sempre disponível quando há dados */}
            {weatherData && selectedLocation && selectedDateRange && (
              <DataExport
                data={{
                  location: selectedLocation,
                  dateRange: selectedDateRange,
                  weatherData: weatherData,
                  exportDate: new Date().toISOString()
                }}
              />
            )}
          </div>

          {/* Área de visualização */}
          <div className="lg:col-span-2">
            {isLoading && (
              <Card>
                <CardContent className="p-8">
                  <div className="flex flex-col items-center justify-center space-y-4">
                    <RefreshCw className="h-8 w-8 animate-spin text-blue-500" />
                    <div className="text-center">
                      <h3 className="font-medium">Processando dados da NASA</h3>
                      <p className="text-sm text-muted-foreground">
                        Analisando dados de observação da Terra...
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {weatherData && selectedLocation && selectedDateRange && !isLoading && (
              <WeatherDataVisualization
                weatherData={weatherData}
                location={selectedLocation.name}
                dateRange={formatDateRange(selectedDateRange)}
              />
            )}

            {!weatherData && !isLoading && (
              <Card>
                <CardContent className="p-8">
                  <div className="text-center space-y-4">
                    <div className="p-4 bg-muted rounded-full w-16 h-16 mx-auto flex items-center justify-center">
                      <Satellite className="h-8 w-8 text-muted-foreground" />
                    </div>
                    <div>
                      <h3 className="font-medium mb-2">Bem-vindo ao Dashboard Climático</h3>
                      <p className="text-muted-foreground">
                        Selecione uma localização e período para começar a análise dos dados climáticos da NASA.
                      </p>
                    </div>
                    <Separator className="my-6" />
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div className="text-center">
                        <h4 className="font-medium">Dados Disponíveis</h4>
                        <ul className="text-muted-foreground mt-1">
                          <li>Temperatura</li>
                          <li>Precipitação</li>
                          <li>Qualidade do Ar</li>
                        </ul>
                      </div>
                      <div className="text-center">
                        <h4 className="font-medium">Recursos</h4>
                        <ul className="text-muted-foreground mt-1">
                          <li>Gráficos Interativos</li>
                          <li>Mapas de Calor</li>
                          <li>Export de Dados</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
