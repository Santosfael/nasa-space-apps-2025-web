import { DISTRIBUTION_DATA, generateProbabilityData, TREND_DATA, type WeatherData } from "@/data/mock-weather-data";
import { Cloud, Droplets, Eye, Gauge, PieChart, Thermometer, Wind } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";

import { Bar, BarChart, CartesianGrid, Cell, Legend, Line, LineChart, Pie, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { Progress } from "./ui/progress";
import { APIDataDisplay } from "./data-api-display";

interface WeatherDataVisualizationProps {
    weatherData: WeatherData
    location: string
    dateRange: string
}

export function WeatherDataVisualization({ weatherData, location, dateRange }: WeatherDataVisualizationProps) {
    // Dados importados do mock
    const trendData = TREND_DATA;
    const probabilityData = generateProbabilityData(weatherData);
    const distributionData = DISTRIBUTION_DATA;

    const weatherCards = [
        {
            title: 'Temperatura',
            icon: Thermometer,
            data: weatherData.temperature,
            color: 'text-orange-500',
            bgColor: 'bg-orange-50',
        },
        {
            title: 'Precipitação',
            icon: Droplets,
            data: weatherData.precipitation,
            color: 'text-blue-500',
            bgColor: 'bg-blue-50',
        },
        {
            title: 'Velocidade do Vento',
            icon: Wind,
            data: weatherData.windSpeed,
            color: 'text-gray-500',
            bgColor: 'bg-gray-50',
        },
        {
            title: 'Qualidade do Ar',
            icon: Gauge,
            data: weatherData.airQuality,
            color: 'text-green-500',
            bgColor: 'bg-green-50',
        },
        {
            title: 'Umidade',
            icon: Cloud,
            data: weatherData.humidity,
            color: 'text-cyan-500',
            bgColor: 'bg-cyan-50',
        },
        {
            title: 'Visibilidade',
            icon: Eye,
            data: weatherData.visibility,
            color: 'text-purple-500',
            bgColor: 'bg-purple-50',
        },
    ]

    return (
        <div className="space-y-6">
            {/* Header */}
            <Card>
                <CardHeader>
                    <CardTitle>Previsão Climático para {location}</CardTitle>
                    <p className="text-muted-foreground">{dateRange}</p>
                </CardHeader>
            </Card>

            {/* Cards de probabilidades */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {
                    weatherCards.map((item) => {
                        const Icon = item.icon
                        return (
                            <Card key={item.title}>
                                <CardContent className="p-4">
                                    <div className="flex items-center justify-between mb-3">
                                        <div className={`p-2 rounded-full ${item.bgColor}`}>
                                            <Icon className={`h-5 w-5 ${item.color}`} />
                                        </div>
                                        <div className="text-right">
                                            <p className="text-2xl font-bold">{item.data.probability}%</p>
                                        </div>
                                    </div>
                                    <h3 className="font-medium mb-1">{item.title}</h3>
                                    <p className="text-sm text-muted-foreground mb-2">
                                        {item.data.range || item.data.amount || item.data.speed || item.data.index || item.data.level || item.data.distance}
                                    </p>
                                    <Progress value={item.data.probability} className="mb-2" />
                                    <p className="text-xs text-muted-foreground">{item.data.description}</p>
                                </CardContent>
                            </Card>
                        )
                    })
                }
            </div>

            {/* Apresentação dos gráficos tendência */}
            <Card>
                <CardHeader>
                    <CardTitle>Tedência ao longo do período</CardTitle>
                </CardHeader>
                <CardContent>
                    <ResponsiveContainer width="100%" height={300}>
                        <LineChart data={trendData}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="day" />
                            <YAxis />
                            <Tooltip />
                            <Legend />
                            <Line type="monotone" dataKey="temperatura" stroke="#f97316" strokeWidth={2} name="Temperatura (°C)" />
                            <Line type="monotone" dataKey="precipitacao" stroke="#3b82f6" strokeWidth={2} name="Precipitação (mm)" />
                            <Line type="monotone" dataKey="vento" stroke="#6b7280" strokeWidth={2} name="Vento (km/h)" />
                        </LineChart>
                    </ResponsiveContainer>
                </CardContent>
            </Card>
            <APIDataDisplay weatherData={weatherData} />
        </div>
    )
}