import { CalendarDays, Calendar as CalendarIcon, ChevronDownIcon } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { RadioGroup } from "@radix-ui/react-radio-group";
import { RadioGroupItem } from "./ui/radio-group";
import { useState } from "react";
import { Label } from "./ui/label";
import { Popover } from "./ui/popover";
import { PopoverContent, PopoverTrigger } from "@radix-ui/react-popover";
import { Button } from "./ui/button";
import { Calendar } from "./ui/calendar";

interface DateRange {
    startDate: string
    endDate: string
}

interface DateSelectorProps {
    onDateSelect: (dateRange: DateRange) => void
    selectedDateRange: DateRange | null
}

export function SelectorDate({ onDateSelect, selectedDateRange }: DateSelectorProps) {
    const [dataSelectedType, setDataSelectedType] = useState<"single" | "range">("single")
    const [open, setOpen] = useState(false)
    const [openEndData, setOpenEndData] = useState(false)
    const [date, setDate] = useState<Date | undefined>(undefined)
    const [startDate, setStartDate] = useState<Date | undefined>(undefined)
    const [endDate, setEndDate] = useState<Date | undefined>(undefined)

    function handleApply() {
        if (dataSelectedType === 'single' && date) {
            onDateSelect({ startDate: date.toDateString(), endDate: date.toDateString() })
        } else if (dataSelectedType === 'range' && startDate && endDate) {
            onDateSelect({ startDate: startDate.toDateString(), endDate: endDate.toDateString() })
        }
    }

    function getQuickDateRange(type: string) {
        const today = new Date()
        const formatDate = (date: Date) => date.toISOString().split('T')[0]

        switch (type) {
            case 'today':
                return { startDate: formatDate(today), endDate: formatDate(today) }
            case 'week':
                // eslint-disable-next-line no-case-declarations
                const weekEnd = new Date(today)
                weekEnd.setDate(today.getDate() + 7)
                return { startDate: formatDate(today), endDate: formatDate(weekEnd) }
            case 'month':
                // eslint-disable-next-line no-case-declarations
                const monthEnd = new Date(today)
                monthEnd.setMonth(today.getMonth() + 1)
                return { startDate: formatDate(today), endDate: formatDate(monthEnd) }
            case 'season':
                // eslint-disable-next-line no-case-declarations
                const seasonEnd = new Date(today)
                seasonEnd.setMonth(today.getMonth() + 3)
                return { startDate: formatDate(today), endDate: formatDate(seasonEnd) }
            default:
                return null
        }
    }

    function handleQuickSelect(type: string) {
        const range = getQuickDateRange(type);
        if (range) {
            onDateSelect(range);
            setStartDate(new Date(range.startDate));
            setEndDate(new Date(range.endDate));
            if (range.startDate === range.endDate) {
                setDate(new Date(range.startDate));
                setDataSelectedType('single');
            } else {
                setDataSelectedType('range');
            }
        }
    };

    return (
        <Card>
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <CalendarIcon className="h-5 w-5" />
                    Selecione uma data
                </CardTitle>
            </CardHeader>

            <CardContent className="space-y-4">
                <RadioGroup value={dataSelectedType} onValueChange={(value: "single" | "range") => setDataSelectedType(value)}>
                    <div className="flex items-center space-x-2">
                        <RadioGroupItem value="single" id="single" />
                        <Label htmlFor="single">Selecionar uma data</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                        <RadioGroupItem value="range" id="range" />
                        <Label htmlFor="range">Selecionar um perído de data</Label>
                    </div>
                </RadioGroup>

                {
                    dataSelectedType === "single" ? (
                        <div className="flex flex-col space-y-2">
                            <Label htmlFor="single-date">Data</Label>
                            <Popover open={open} onOpenChange={setOpen}>
                                <PopoverTrigger asChild>
                                    <Button
                                        variant="outline"
                                        data-empty={!date}
                                        className="justify-between font-normal"
                                    >
                                        <CalendarIcon />
                                        {date ? date.toLocaleDateString() : <span>Selecione a data</span>}
                                        <ChevronDownIcon />
                                    </Button>
                                </PopoverTrigger>
                                <PopoverContent className="w-auto overflow-hidden p-0 bg-gray-50 rounded-lg shadow-lg" align="start">
                                    <Calendar
                                        mode="single"
                                        captionLayout="dropdown"
                                        selected={date}
                                        onSelect={(date) => {
                                            setDate(date)
                                            setOpen(false)
                                        }} />
                                </PopoverContent>
                            </Popover>
                        </div>
                    ) : (
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="start-date">Data inicial:</Label>
                                <Popover open={open} onOpenChange={setOpen}>
                                    <PopoverTrigger asChild>
                                        <Button
                                            variant="outline"
                                            data-empty={!startDate}
                                            className="justify-between font-normal"
                                        >
                                            <CalendarIcon />
                                            {startDate ? startDate.toLocaleDateString() : <span>Selecione a data</span>}
                                            <ChevronDownIcon />
                                        </Button>
                                    </PopoverTrigger>
                                    <PopoverContent className="w-auto overflow-hidden p-0 bg-gray-50 rounded-lg shadow-lg" align="start">
                                        <Calendar
                                            mode="single"
                                            captionLayout="dropdown"
                                            selected={startDate}
                                            onSelect={(date) => {
                                                setStartDate(date)
                                                setOpen(false)
                                            }} />
                                    </PopoverContent>
                                </Popover>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="end-date">Data final:</Label>
                                <Popover open={openEndData} onOpenChange={setOpenEndData}>
                                    <PopoverTrigger asChild>
                                        <Button
                                            variant="outline"
                                            data-empty={!endDate}
                                            className="justify-between font-normal"
                                        >
                                            <CalendarIcon />
                                            {endDate ? endDate.toLocaleDateString() : <span>Selecione a data</span>}
                                            <ChevronDownIcon />
                                        </Button>
                                    </PopoverTrigger>
                                    <PopoverContent className="w-auto overflow-hidden p-0 bg-gray-50 rounded-lg shadow-lg" align="start">
                                        <Calendar
                                            mode="single"
                                            captionLayout="dropdown"
                                            selected={endDate}
                                            disabled={(date) => startDate ? date < startDate : false}
                                            onSelect={(date) => {
                                                setEndDate(date)
                                                setOpenEndData(false)
                                            }} />
                                    </PopoverContent>
                                </Popover>
                            </div>
                        </div>
                    )
                }
                <Button
                    onClick={handleApply}
                    className="w-full"
                    disabled={dataSelectedType === "single" ? !date : !startDate || !endDate}
                >
                    Aplicar Seleção
                </Button>

                <div className="border-t pt-4">
                    <p className="text-sm text-muted-foreground mb-2">Seleções rápidas:</p>
                    <div className="grid grid-cols-2 gap-2">
                        <Button variant="outline" size="sm" onClick={() => handleQuickSelect('today')}>
                            Hoje
                        </Button>
                        <Button variant="outline" size="sm" onClick={() => handleQuickSelect('week')}>
                            Próxima Semana
                        </Button>
                        <Button variant="outline" size="sm" onClick={() => handleQuickSelect('month')}>
                            Próximo mês
                        </Button>
                        <Button variant="outline" size="sm" onClick={() => handleQuickSelect('season')}>
                            Próxima Estação
                        </Button>
                    </div>
                </div>

                {selectedDateRange && (
                    <div className="p-3 bg-muted rounded-lg">
                        <p className="text-sm font-medium flex items-center gap-2">
                            <CalendarDays className="h-4 w-4" />
                            Período selecionado:
                        </p>
                        <p className="text-sm text-muted-foreground">
                            {selectedDateRange.startDate === selectedDateRange.endDate
                                ? `${new Date(selectedDateRange.startDate).toLocaleDateString('pt-BR')}`
                                : `${new Date(selectedDateRange.startDate).toLocaleDateString('pt-BR')} até ${new Date(selectedDateRange.endDate).toLocaleDateString('pt-BR')}`
                            }
                        </p>
                    </div>
                )}
            </CardContent>
        </Card>
    )
}