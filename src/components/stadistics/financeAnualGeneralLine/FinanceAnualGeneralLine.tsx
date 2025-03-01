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
}

const FinanceAnualGeneralLine: React.FC<FinanceRec> = ({ items }) => {
    const [isLoading, setIsLoading] = useState(true);

    const [chartData, setChartData] = useState({
        labels: ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'],
        datasets: [
            {
                label: 'Gastos',
                data: new Array(12).fill(0),
                borderColor: 'rgb(255, 99, 132)',
                backgroundColor: 'rgba(255, 99, 132, 0.5)',
                tension: 0.1
            },
            {
                label: 'Ingresos',
                data: new Array(12).fill(0),
                borderColor: 'rgb(75, 192, 192)',
                backgroundColor: 'rgba(75, 192, 192, 0.5)',
                tension: 0.1
            },
            {
                label: 'Inversiones',
                data: new Array(12).fill(0),
                borderColor: 'rgb(153, 102, 255)',
                backgroundColor: 'rgba(153, 102, 255, 0.5)',
                tension: 0.1
            }
        ]
    });

    useEffect(() => {
        setIsLoading(true);
        
        // Crear copias de los arrays de datos
        const newGastosPorMes = new Array(12).fill(0);
        const newIngresosPorMes = new Array(12).fill(0);
        const newInversionesPorMes = new Array(12).fill(0);

        // Agrupar valores por mes y tipo
        items.forEach(item => {
            const [year, month] = item.value_date.split('-');
            const mes = parseInt(month) - 1;
            if (item.type === 'Gasto') {
                newGastosPorMes[mes] += item.value;
            } else if (item.type === 'Ingreso') {
                newIngresosPorMes[mes] += item.value;
            } else if (item.type === 'Inversion') {
                newInversionesPorMes[mes] += item.value;
            }
        });

        // Actualizar chartData con los nuevos valores
        setChartData(prevData => ({
            ...prevData,
            datasets: [
                { ...prevData.datasets[0], data: newGastosPorMes },
                { ...prevData.datasets[1], data: newIngresosPorMes },
                { ...prevData.datasets[2], data: newInversionesPorMes }
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
                <Container fluid>
                    <h4 className="mb-4">Registros Mensuales del Año</h4>
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

export default FinanceAnualGeneralLine;
