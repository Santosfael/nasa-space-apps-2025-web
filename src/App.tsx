import { Satellite } from "lucide-react";
import { Badge } from "./components/ui/badge";
import { LocationSelector } from "./components/location-selector";
import { SelectorDate } from "./components/selector-date";

export function App() {

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
            <Badge variant="outline">Demonstração</Badge>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Painel de seleção para analise das informações */}
          <div className="lg:col-span-1 space-y-6">
            <LocationSelector />
            <SelectorDate />
          </div>
        </div>
      </div>
    </div>
  )
}
