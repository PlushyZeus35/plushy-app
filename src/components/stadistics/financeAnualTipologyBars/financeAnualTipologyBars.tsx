import { Finance } from "@/app/types/Finance";
import { Col, Container, Form, Row, Spinner } from "react-bootstrap";
import { useEffect, useState } from "react";
import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

interface FinanceRec {
    items: Finance[];
}

const FinanceAnualTipologyBars: React.FC<FinanceRec> = ({ items }) => {
    const [isLoading, setIsLoading] = useState(true);
    const [chartData, setChartData] = useState({
        labels: ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'],
        datasets: [
            {
                label: 'Gastos',
                data: new Array(12).fill(0),
                borderColor: 'rgb(255, 99, 132)',
                backgroundColor: 'rgba(255, 99, 132, 0.5)',
                borderWidth: 1,
                stack: 'Stack 0',
            },
            {
                label: 'Ingresos', 
                data: new Array(12).fill(0),
                backgroundColor: 'rgba(75, 192, 192, 0.5)',
                borderColor: 'rgb(75, 192, 192)',
                borderWidth: 1,
                stack: 'Stack 0',
            },
            {
                label: 'Inversiones',
                data: new Array(12).fill(0),
                backgroundColor: 'rgba(153, 102, 255, 0.5)',
                borderColor: 'rgb(153, 102, 255)',
                borderWidth: 1,
                stack: 'Stack 0',
            }
        ]
    });

    useEffect(() => {
        setIsLoading(true);
        
        // Crear arrays para almacenar los totales por mes y tipo
        const gastosPorMes = new Array(12).fill(0);
        const ingresosPorMes = new Array(12).fill(0);
        const inversionesPorMes = new Array(12).fill(0);
        const totalesPorMes = new Array(12).fill(0);

        // Agrupar valores por mes y tipo
        items.forEach(item => {
            const [year, month] = item.value_date.split('-');
            const mes = parseInt(month) - 1;
            if (item.type === 'Gasto') {
                gastosPorMes[mes] += item.value;
            } else if (item.type === 'Ingreso') {
                ingresosPorMes[mes] += item.value;
            } else if (item.type === 'Inversion') {
                inversionesPorMes[mes] += item.value;
            }
            totalesPorMes[mes] += item.value;
        });

        // Calcular porcentajes
        const gastosPorcentaje = gastosPorMes.map((valor, index) => 
            totalesPorMes[index] ? (valor / totalesPorMes[index]) * 100 : 0
        );
        const ingresosPorcentaje = ingresosPorMes.map((valor, index) => 
            totalesPorMes[index] ? (valor / totalesPorMes[index]) * 100 : 0
        );
        const inversionesPorcentaje = inversionesPorMes.map((valor, index) => 
            totalesPorMes[index] ? (valor / totalesPorMes[index]) * 100 : 0
        );

        setChartData(prevData => ({
            ...prevData,
            datasets: [
                { ...prevData.datasets[0], data: gastosPorcentaje },
                { ...prevData.datasets[1], data: ingresosPorcentaje },
                { ...prevData.datasets[2], data: inversionesPorcentaje }
            ]
        }));

        setIsLoading(false);
    }, [items]);

    return (
        <>
            <Container fluid>
                {isLoading ? (
                    <Container fluid className="d-flex justify-content-center align-items-center" style={{ height: '30vh' }}>
                        <Spinner animation="grow" variant="light" />
                    </Container>
                ) : (
                    <Bar 
                        data={chartData}
                        options={{
                            responsive: true,
                            plugins: {
                                legend: {
                                    position: 'top',
                                    labels: {
                                        color: '#f5f5f5'
                                    }
                                },
                                tooltip: {
                                    callbacks: {
                                        label: function(context) {
                                            return `${context.dataset.label}: ${context.parsed.y.toFixed(1)}%`;
                                        }
                                    }
                                }
                            },
                            scales: {
                                y: {
                                    stacked: true,
                                    ticks: {
                                        color: '#f5f5f5',
                                        callback: function(value) {
                                            return value + '%';
                                        }
                                    },
                                    grid: {
                                        color: 'rgba(255, 255, 255, 0.1)'
                                    }
                                },
                                x: {
                                    stacked: true,
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
                )}
            </Container>
        </>
    );
};

export default FinanceAnualTipologyBars;
