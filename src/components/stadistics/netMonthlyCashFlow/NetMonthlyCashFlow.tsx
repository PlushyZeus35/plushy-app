import { Container, Spinner } from "react-bootstrap";
import { useEffect, useState } from "react";
import { Finance } from "@/app/types/Finance";

import { Bar } from 'react-chartjs-2';
import {
    Chart as ChartJS,
    BarElement,
    Title,
    Tooltip,
    Legend,
    ChartData,
    TooltipItem
} from 'chart.js';

// Registrar los componentes de Chart.js que utilizarás
ChartJS.register(
    BarElement,
    Title,
    Tooltip,
    Legend
);

interface FinanceRec {
    items: Finance[];
}

const NetMonthlyCashFlow: React.FC<FinanceRec> = ({ items }) => {
    const [isLoading, setIsLoading] = useState(true);
    const [chartData, setChartData] = useState<ChartData<'bar'>>({
        labels: [],
        datasets: [{
            label: 'Flujo de Caja Mensual',
            data: [],
            backgroundColor: 'rgba(75, 192, 192, 0.6)',
            borderColor: 'rgba(75, 192, 192, 1)',
            borderWidth: 1,
        }]
    });

    useEffect(() => {
        setIsLoading(true);
        
        // Crear arrays para almacenar los totales por mes
        const netMonthlyCashFlow = new Array(12).fill(0);

        // Agrupar valores por mes
        items.forEach(item => {
            const [year, month] = item.value_date.split('-');
            const mes = parseInt(month) - 1;
            if (item.type === 'Gasto') {
                netMonthlyCashFlow[mes] -= item.value;
            } else if (item.type === 'Ingreso') {
                netMonthlyCashFlow[mes] += item.value;
            }
        });

        // Generar los datos para el gráfico
        const labels = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'];
        const data = netMonthlyCashFlow;
        const backgroundColors = data.map(value => value >= 0 ? 'rgba(75, 192, 192, 0.5)' : 'rgba(255, 99, 132, 0.5)');
        const borderColors = data.map(value => value >= 0 ? 'rgb(75, 192, 192)' : 'rgb(255, 99, 132)');
        // Actualizar el estado de la gráfica con los datos calculados
        setChartData(prevData => ({
            ...prevData,
            labels,
            datasets: [{
                ...prevData.datasets[0],
                data,
                backgroundColor: backgroundColors,
                borderColor: borderColors
            }]
        }));

        setIsLoading(false);
    }, [items]);

    return (
        <Container>
            {isLoading ? (
                <Spinner animation="grow" variant="light" />
            ) : (
                <Container fluid>
                    <h4 className="mb-4">Flujo Neto Mensual</h4>
                    <Bar
                    data={chartData}
                    options={{
                        responsive: true,
                        plugins: {
                            legend: {
                                display: false,
                                position: 'top',
                            }
                        }
                    }}
                    height={80}
                />
                </Container>
                
            )}
        </Container>
    );
};

export default NetMonthlyCashFlow;
