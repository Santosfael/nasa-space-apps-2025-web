import { Database, Download, FileText } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { formatDataForExport, type Location, type WeatherData } from "@/data/mock-weather-data";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";

interface ExportData {
  location: Location
  dateRange: {
    startDate: string
    endDate: string
  };
  weatherData: WeatherData
  exportDate: string
}

interface DataExportProps {
  data: ExportData
}

export function DataExport({ data }: DataExportProps) {
  const getFormattedData = () => {
    return formatDataForExport(data.location, data.dateRange, data.weatherData)
  };

  const downloadJSON = () => {
    const exportData = getFormattedData()
    const dataStr = JSON.stringify(exportData, null, 2)
    const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr)
    
    const exportFileDefaultName = `weather-data-${data.location.name.replace(/[^a-z0-9]/gi, '_').toLowerCase()}-${data.dateRange.startDate}.json`
    
    const linkElement = document.createElement('a')
    linkElement.setAttribute('href', dataUri)
    linkElement.setAttribute('download', exportFileDefaultName)
    linkElement.click()
  };

  const downloadCSV = () => {
    const exportData = getFormattedData()
    
    // Headers para CSV
    const headers = [
      'Date',
      'Temperature (°C)',
      'Precipitation (mm)',
      'Wind Speed (km/h)',
      'Humidity (%)',
      'Air Quality'
    ]
    
    // Dados para CSV
    const csvData = exportData.dailyForecast.map(day => [
      day.date,
      day.temperature,
      day.precipitation,
      day.windSpeed,
      day.humidity,
      day.airQuality
    ])
    
    // Criar conteúdo CSV
    const csvContent = [
      `# Weather Data Export`,
      `# Location: ${data.location.name} (${data.location.lat}, ${data.location.lng})`,
      `# Date Range: ${data.dateRange.startDate} to ${data.dateRange.endDate}`,
      `# Export Date: ${data.exportDate}`,
      `# Source: NASA Earth Observation Data (Mocked)`,
      '',
      headers.join(','),
      ...csvData.map(row => row.join(','))
    ].join('\n')
    
    const dataUri = 'data:text/csv;charset=utf-8,' + encodeURIComponent(csvContent)
    const exportFileDefaultName = `weather-data-${data.location.name.replace(/[^a-z0-9]/gi, '_').toLowerCase()}-${data.dateRange.startDate}.csv`
    
    const linkElement = document.createElement('a')
    linkElement.setAttribute('href', dataUri)
    linkElement.setAttribute('download', exportFileDefaultName)
    linkElement.click()
  };

  const getDataSize = () => {
    const jsonString = JSON.stringify(getFormattedData())
    const sizeInBytes = new Blob([jsonString]).size
    return sizeInBytes < 1024 ? `${sizeInBytes} bytes` : `${(sizeInBytes / 1024).toFixed(1)} KB`
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Download className="h-5 w-5" />
          Download dos Dados
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Informações do dataset */}
        <div className="p-4 bg-muted rounded-lg space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">Local:</span>
            <Badge variant="secondary">{data.location.name}</Badge>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">Período:</span>
            <Badge variant="secondary">
              {data.dateRange.startDate === data.dateRange.endDate 
                ? new Date(data.dateRange.startDate).toLocaleDateString('pt-BR')
                : `${new Date(data.dateRange.startDate).toLocaleDateString('pt-BR')} - ${new Date(data.dateRange.endDate).toLocaleDateString('pt-BR')}`
              }
            </Badge>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">Tamanho estimado:</span>
            <Badge variant="outline">{getDataSize()}</Badge>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">Fonte:</span>
            <Badge variant="outline">NASA Earth Observation</Badge>
          </div>
        </div>

        {/* Opções de download */}
        <div className="space-y-3">
          <div className="border rounded-lg p-4">
            <div className="flex items-start justify-between mb-2">
              <div className="flex items-center gap-2">
                <Database className="h-5 w-5 text-blue-500" />
                <div>
                  <h4 className="font-medium">Formato JSON</h4>
                  <p className="text-sm text-muted-foreground">
                    Dados estruturados com metadados completos
                  </p>
                </div>
              </div>
              <Button onClick={downloadJSON} variant="outline" size="sm">
                <Download className="h-4 w-4 mr-2" />
                JSON
              </Button>
            </div>
            <div className="text-xs text-muted-foreground">
              Inclui probabilidades climáticas, previsões diárias e metadados da consulta
            </div>
          </div>

          <div className="border rounded-lg p-4">
            <div className="flex items-start justify-between mb-2">
              <div className="flex items-center gap-2">
                <FileText className="h-5 w-5 text-green-500" />
                <div>
                  <h4 className="font-medium">Formato CSV</h4>
                  <p className="text-sm text-muted-foreground">
                    Planilha compatível com Excel e Google Sheets
                  </p>
                </div>
              </div>
              <Button onClick={downloadCSV} variant="outline" size="sm">
                <Download className="h-4 w-4 mr-2" />
                CSV
              </Button>
            </div>
            <div className="text-xs text-muted-foreground">
              Dados tabulares com previsões diárias e comentários informativos
            </div>
          </div>
        </div>

        {/* Informações sobre os dados */}
        <div className="border-t pt-4">
          <h4 className="font-medium mb-2">Sobre os dados exportados:</h4>
          <ul className="text-sm text-muted-foreground space-y-1">
            <li>• Probabilidades baseadas em modelos preditivos da NASA</li>
            <li>• Dados incluem temperatura, precipitação, vento e qualidade do ar</li>
            <li>• Coordenadas geográficas precisas da localização</li>
            <li>• Timestamp da consulta para rastreabilidade</li>
            <li>• Dados são simulados para demonstração</li>
          </ul>
        </div>

        {/* Nota sobre uso */}
        <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
          <p className="text-sm text-yellow-800">
            <strong>Nota:</strong> Estes dados são simulados para fins de demonstração. 
            Em produção, os dados viriam diretamente da API da NASA.
          </p>
        </div>
      </CardContent>
    </Card>
  );
}