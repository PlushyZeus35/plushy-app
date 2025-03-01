import { Finance } from "@/app/types/Finance";
import { Container, Spinner } from "react-bootstrap";
import { useEffect, useState } from "react";
import { Pie } from 'react-chartjs-2';
import {
    Chart as ChartJS,
    ArcElement,
    Title,
    Tooltip,
    Legend,
    ChartData,
    ChartDataset,
    TooltipItem
} from 'chart.js';

// 1. Extender la interfaz ChartDataset para incluir "total"
interface CustomChartDataset extends ChartDataset<'pie', number[]> {
    total?: number; // Hacemos que total sea opcional
}

// 2. Registrar los componentes de Chart.js que utilizarás
ChartJS.register(
    ArcElement,
    Title,
    Tooltip,
    Legend
);

interface FinanceRec {
    items: Finance[];
}

const FinanceAnualTipologyPie: React.FC<FinanceRec> = ({ items }) => {
    const [isLoading, setIsLoading] = useState(true);

    // 3. Definir el tipo de estado para "chartData" usando el tipo “pie” y el dataset personalizado
    const [chartData, setChartData] = useState<ChartData<'pie', number[], unknown>>({
        labels: [],
        // Forzamos a que los datasets sean CustomChartDataset[]
        datasets: [{
            label: 'Tipologías',
            data: [],
            backgroundColor: [],
            borderColor: [],
            borderWidth: 1,
            total: 0
        } as CustomChartDataset]
    });

    useEffect(() => {
        setIsLoading(true);

        // 4. Agrupar los datos por tipo
        const groupedData: Record<string, number> = {};
        items.forEach(item => {
            if (groupedData[item.type]) {
                groupedData[item.type] += item.value;
            } else {
                groupedData[item.type] = item.value;
            }
        });

        const labels = Object.keys(groupedData);
        const data = Object.values(groupedData);

        // 5. Generar algunos colores de ejemplo
        const backgroundColors = labels.map((_, index) => {
            const colors = ['rgb(255, 99, 132)', 'rgb(153, 102, 255)', 'rgb(75, 192, 192)'];
            return colors[index % colors.length];
        });

        // 6. Calcular el total
        const total = data.reduce((acc, val) => acc + val, 0);

        // 7. Actualizar el estado de la gráfica con los datos calculados
        setChartData(prevData => ({
            ...prevData,
            labels,
            datasets: [
                {
                    ...prevData.datasets[0],
                    data,
                    backgroundColor: backgroundColors,
                    borderColor: backgroundColors,
                    total
                } as CustomChartDataset
            ]
        }));

        setIsLoading(false);
    }, [items]);

    return (
        <>
            {isLoading ? (
                <Container fluid className="d-flex justify-content-center align-items-center" style={{ height: '30vh' }}>
                    <Spinner animation="grow" variant="light" />
                </Container>
            ) : (
                <Pie
                    data={chartData}
                    options={{
                        responsive: true,
                        plugins: {
                            tooltip: {
                                callbacks: {
                                    title: (tooltipItems: TooltipItem<'pie'>[]) => {
                                        if (!tooltipItems.length) {
                                          return '';
                                        }
                                        return tooltipItems[0].label || '';
                                      },
                                      afterLabel: (tooltipItem: TooltipItem<'pie'>) => {
                                        const dataset = tooltipItem.dataset as CustomChartDataset;
                                      
                                        const total = dataset.total ?? 0;

                                        if (total === 0) return '(0%)';
                                        const value = tooltipItem.parsed;
                                        const percent = Math.round((value / total) * 100);
                                        return `(${percent}%)`;
                                      },
                                  },
                            },
                            legend: {
                                position: 'top',
                                labels: {
                                    color: '#f5f5f5'
                                }
                            }
                        }
                    }}
                    height={100}
                />
            )}
        </>
    );
};

export default FinanceAnualTipologyPie;
