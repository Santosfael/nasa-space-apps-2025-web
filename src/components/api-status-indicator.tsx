import { Badge } from './ui/badge';
import { AlertCircle, Clock, Wifi, WifiOff } from 'lucide-react';

interface APIStatusIndicatorProps {
  isLoading: boolean
  hasAPIData: boolean
  error?: string | null
}

export function APIStatusIndicator({ isLoading, hasAPIData, error }: APIStatusIndicatorProps) {

  if (isLoading) {
    return (
      <Badge variant="secondary" className="flex items-center gap-1">
        <Clock className="h-3 w-3 animate-pulse" />
        Consultando API NASA...
      </Badge>
    )
  }

  if (error) {
    return (
      <Badge variant="destructive" className="flex items-center gap-1">
        <WifiOff className="h-3 w-3" />
        API indisponível - dados simulados
      </Badge>
    )
  }

  if (hasAPIData) {
    return (
      <Badge variant="default" className="flex items-center gap-1 bg-green-600">
        <Wifi className="h-3 w-3" />
        Dados da API NASA
      </Badge>
    );
  }

  return (
    <Badge variant="outline" className="flex items-center gap-1">
      <AlertCircle className="h-3 w-3" />
      Dados simulados
    </Badge>
  )
}