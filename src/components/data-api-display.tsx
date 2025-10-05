import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Progress } from './ui/progress';
import { Thermometer, Database } from 'lucide-react';
import type { WeatherData } from '@/data/mock-weather-data';

interface APIDataDisplayProps {
  weatherData: WeatherData
}

export function APIDataDisplay({ weatherData }: APIDataDisplayProps) {
  // Verifica se há dados da API para temperatura
  const hasTemperatureAPIData = weatherData.temperature.rawData

  if (!hasTemperatureAPIData) {
    return null;
  }

  const temperatureAPI = weatherData.temperature.rawData
  const analysis = temperatureAPI.analysis.full_analysis

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Database className="h-5 w-5" />
          Dados Detalhados da API NASA
        </CardTitle>
        <div className="flex items-center gap-2">
          <Badge variant="outline">Fonte: {temperatureAPI.data_source_location}</Badge>
          <Badge variant="secondary">Condição mais provável: {temperatureAPI.analysis.most_likely_condition}</Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <h4 className="font-medium mb-3 flex items-center gap-2">
            <Thermometer className="h-4 w-4" />
            Análise de Temperatura Detalhada
          </h4>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {Object.entries(analysis).map(([condition, data]) => {
              const probability = parseFloat(data.probability.replace('%', ''))
              const isHighest = condition === temperatureAPI.analysis.most_likely_condition
              
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

        <div className="border-t pt-4">
          <h4 className="font-medium mb-2">Interpretação dos Dados</h4>
          <div className="space-y-2 text-sm text-muted-foreground">
            <p>
              • <strong>Condição mais provável:</strong> {temperatureAPI.analysis.most_likely_condition} 
              com {analysis[temperatureAPI.analysis.most_likely_condition as keyof typeof analysis]?.probability} de probabilidade
            </p>
            <p>
              • <strong>Critério:</strong> {analysis[temperatureAPI.analysis.most_likely_condition as keyof typeof analysis]?.threshold}
            </p>
            <p>
              • <strong>Localização dos dados:</strong> {temperatureAPI.data_source_location}
            </p>
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