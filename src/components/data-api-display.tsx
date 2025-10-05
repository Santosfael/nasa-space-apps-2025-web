import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Progress } from './ui/progress';
import { Thermometer, Database, Droplets, Cloud } from 'lucide-react';
import type { WeatherData } from '@/data/mock-weather-data';

interface APIDataDisplayProps {
  weatherData: WeatherData
}

export function APIDataDisplay({ weatherData }: APIDataDisplayProps) {
  // Verifica se há dados da API para temperatura
  const hasTemperatureAPIData = weatherData.temperature.rawData
  const hasPrecipitationAPIData = weatherData.precipitation?.rawData
  const hasHumidityAPIData = weatherData.humidity?.rawData

  const temperatureAPI = weatherData.temperature.rawData;
  const precipitationAPI = weatherData.precipitation?.rawData;
  const humidityAPI = weatherData.humidity?.rawData;

  if (!hasTemperatureAPIData) {
    return null;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Database className="h-5 w-5" />
          Dados Detalhados da API NASA
        </CardTitle>
        <div className="flex flex-wrap items-center gap-2">
          {temperatureAPI && (
            <Badge variant="outline">Temperatura: {temperatureAPI.data_source_location}</Badge>
          )}
          {precipitationAPI && (
            <Badge variant="outline">Precipitação: {precipitationAPI.data_source_location}</Badge>
          )}
          {humidityAPI && (
            <Badge variant="outline">Umidade: {humidityAPI.data_source_location}</Badge>
          )}
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Dados de Temperatura */}
        {hasTemperatureAPIData && (
          <div>
            <h4 className="font-medium mb-3 flex items-center gap-2">
              <Thermometer className="h-4 w-4" />
              Análise de Temperatura Detalhada
            </h4>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {Object.entries(temperatureAPI.analysis.full_analysis).map(([condition, data]) => {
                const probability = parseFloat(data.probability.replace('%', ''));
                const isHighest = condition === temperatureAPI.analysis.most_likely_condition;

                return (
                  <div
                    key={condition}
                    className={`p-4 border rounded-lg ${isHighest ? 'border-blue-500 bg-blue-50' : 'border-border'}`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <h5 className="font-medium">{condition}</h5>
                      <Badge variant={isHighest ? 'default' : 'secondary'}>
                        {data.probability}
                      </Badge>
                    </div>

                    <Progress value={probability} className="mb-2" />

                    <p className="text-sm text-muted-foreground">
                      {data.threshold}
                    </p>

                    {isHighest && (
                      <div className="mt-2">
                        <Badge variant="outline" className="text-xs">
                          Condição mais provável
                        </Badge>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Dados de Precipitação */}
        {hasPrecipitationAPIData && (
          <div>
            <h4 className="font-medium mb-3 flex items-center gap-2">
              <Cloud className="h-4 w-4" />
              Análise de Precipitação Detalhada
            </h4>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {Object.entries(precipitationAPI.analysis.full_analysis).map(([condition, data]) => {
                const probability = parseFloat(data.probability.replace('%', ''));
                const isHighest = condition === precipitationAPI.analysis.most_likely_condition;

                return (
                  <div
                    key={condition}
                    className={`p-4 border rounded-lg ${isHighest ? 'border-green-500 bg-green-50' : 'border-border'}`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <h5 className="font-medium">{condition}</h5>
                      <Badge variant={isHighest ? 'default' : 'secondary'}>
                        {data.probability}
                      </Badge>
                    </div>

                    <Progress value={probability} className="mb-2" />

                    <p className="text-sm text-muted-foreground">
                      {data.threshold}
                    </p>

                    {isHighest && (
                      <div className="mt-2">
                        <Badge variant="outline" className="text-xs">
                          Condição mais provável
                        </Badge>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Dados de Umidade */}
        {hasHumidityAPIData && (
          <div>
            <h4 className="font-medium mb-3 flex items-center gap-2">
              <Droplets className="h-4 w-4" />
              Análise de Umidade Detalhada
            </h4>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {Object.entries(humidityAPI.analysis.full_analysis).map(([condition, data]) => {
                const probability = parseFloat(data.probability.replace('%', ''));
                const isHighest = condition === humidityAPI.analysis.most_likely_condition;

                return (
                  <div
                    key={condition}
                    className={`p-4 border rounded-lg ${isHighest ? 'border-purple-500 bg-purple-50' : 'border-border'}`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <h5 className="font-medium">{condition}</h5>
                      <Badge variant={isHighest ? 'default' : 'secondary'}>
                        {data.probability}
                      </Badge>
                    </div>

                    <Progress value={probability} className="mb-2" />

                    <p className="text-sm text-muted-foreground">
                      {data.threshold}
                    </p>

                    {isHighest && (
                      <div className="mt-2">
                        <Badge variant="outline" className="text-xs">
                          Condição mais provável
                        </Badge>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Interpretação dos Dados */}
        <div className="border-t pt-4">
          <h4 className="font-medium mb-2">Interpretação dos Dados</h4>
          <div className="space-y-2 text-sm text-muted-foreground">
            {hasTemperatureAPIData && (
              <p>
                • <strong>Temperatura:</strong> {temperatureAPI.analysis.most_likely_condition}
                com {temperatureAPI.analysis.full_analysis[temperatureAPI.analysis.most_likely_condition as keyof typeof temperatureAPI.analysis.full_analysis]?.probability} de probabilidade
              </p>
            )}
            {hasPrecipitationAPIData && (
              <p>
                • <strong>Precipitação:</strong> {precipitationAPI.analysis.most_likely_condition}
                com {precipitationAPI.analysis.full_analysis[precipitationAPI.analysis.most_likely_condition as keyof typeof precipitationAPI.analysis.full_analysis]?.probability} de probabilidade
              </p>
            )}
            {hasHumidityAPIData && (
              <p>
                • <strong>Umidade:</strong> {humidityAPI.analysis.most_likely_condition}
                com {humidityAPI.analysis.full_analysis[humidityAPI.analysis.most_likely_condition as keyof typeof humidityAPI.analysis.full_analysis]?.probability} de probabilidade
              </p>
            )}
          </div>
        </div>

        <div className="p-3 bg-amber-50 border border-amber-200 rounded-lg">
          <p className="text-sm text-amber-800">
            <strong>Nota:</strong> Estes dados são fornecidos diretamente pela API da NASA e
            representam probabilidades baseadas em modelos meteorológicos avançados.
          </p>
        </div>
      </CardContent>
    </Card>
  );
}