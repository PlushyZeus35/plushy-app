import { Finance } from "@/app/types/Finance";
import { Col, Container, Form, Row, Spinner } from "react-bootstrap";
import { useEffect, useState } from "react";
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

interface FinanceRec {
    items: Finance[];
    selectedMonth: number;
}

const FinanceMensualGeneralLine: React.FC<FinanceRec> = ({ items, selectedMonth }) => {
    const [isLoading, setIsLoading] = useState(true);

    const [chartData, setChartData] = useState({
        labels: Array.from({length: 31}, (_, i) => (i + 1).toString()),
        datasets: [
            {
                label: 'Gastos',
                data: new Array(31).fill(0),
                borderColor: 'rgb(255, 99, 132)',
                backgroundColor: 'rgba(255, 99, 132, 0.5)',
                tension: 0.1
            },
            {
                label: 'Ingresos', 
                data: new Array(31).fill(0),
                borderColor: 'rgb(75, 192, 192)',
                backgroundColor: 'rgba(75, 192, 192, 0.5)',
                tension: 0.1
            },
            {
                label: 'Inversiones',
                data: new Array(31).fill(0),
                borderColor: 'rgb(153, 102, 255)',
                backgroundColor: 'rgba(153, 102, 255, 0.5)',
                tension: 0.1
            }
        ]
    });

    useEffect(() => {
        setIsLoading(true);
        
        // Crear copias de los arrays de datos
        const newGastosPorDia = new Array(31).fill(0);
        const newIngresosPorDia = new Array(31).fill(0);
        const newInversionesPorDia = new Array(31).fill(0);

        // Filtrar y agrupar valores por día y tipo para el mes seleccionado
        items.forEach(item => {
            const [year, month, day] = item.value_date.split('-');
            const itemMonth = parseInt(month);
            
            if (itemMonth === selectedMonth) {
                const dia = parseInt(day) - 1;
                if (item.type === 'Gasto') {
                    newGastosPorDia[dia] += item.value;
                } else if (item.type === 'Ingreso') {
                    newIngresosPorDia[dia] += item.value;
                } else if (item.type === 'Inversion') {
                    newInversionesPorDia[dia] += item.value;
                }
            }
        });

        // Actualizar chartData con los nuevos valores
        setChartData(prevData => ({
            ...prevData,
            datasets: [
                { ...prevData.datasets[0], data: newGastosPorDia },
                { ...prevData.datasets[1], data: newIngresosPorDia },
                { ...prevData.datasets[2], data: newInversionesPorDia }
            ]
        }));

        setIsLoading(false);
    }, [items, selectedMonth]);

    return (
        <>
            {isLoading ? (
                <Container fluid className="d-flex justify-content-center align-items-center" style={{ height: '30vh' }}>
                    <Spinner animation="grow" variant="light" />
                </Container>
            ) : (
                <Container fluid>
                    <h4 className="mb-4">Registros Mensuales del Mes</h4>
                    <Line 
                        data={chartData}
                        options={{
                            responsive: true,
                            plugins: {
                                legend: {
                                    position: 'top',
                                    labels: {
                                        color: '#f5f5f5'
                                    }
                                }
                            },
                            scales: {
                                y: {
                                    min: 0,
                                    beginAtZero: true,
                                    ticks: {
                                        color: '#f5f5f5'
                                    },
                                    grid: {
                                        color: 'rgba(255, 255, 255, 0.1)'
                                    }
                                },
                                x: {
                                    ticks: {
                                        color: '#f5f5f5'
                                    },
                                    grid: {
                                        color: 'rgba(255, 255, 255, 0.1)'
                                    }
                                }
                            }
                        }}
                        height={100}
                    />
                </Container>
            )}
        </>
    );
};

export default FinanceMensualGeneralLine;
