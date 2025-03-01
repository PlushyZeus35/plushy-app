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

type CategoryColors = {
    backgroundColor: string;
    borderColor: string;
}

const categoryColors: Record<string, CategoryColors> = {
    'Comida y Bebidas': {
        backgroundColor: 'rgba(255, 99, 132, 0.5)',
        borderColor: 'rgb(255, 99, 132)'
    },
    'Servicios del Hogar': {
        backgroundColor: 'rgba(54, 162, 235, 0.5)', 
        borderColor: 'rgb(54, 162, 235)'
    },
    'Salud y Bienestar': {
        backgroundColor: 'rgba(255, 206, 86, 0.5)',
        borderColor: 'rgb(255, 206, 86)'
    },
    'Tecnologia': {
        backgroundColor: 'rgba(75, 192, 192, 0.5)',
        borderColor: 'rgb(75, 192, 192)'
    },
    'Medios y Suscripciones Digitales': {
        backgroundColor: 'rgba(153, 102, 255, 0.5)',
        borderColor: 'rgb(153, 102, 255)'
    },
    'Mascotas': {
        backgroundColor: 'rgba(255, 159, 64, 0.5)',
        borderColor: 'rgb(255, 159, 64)'
    },
    'Moda y Accesorios': {
        backgroundColor: 'rgba(199, 199, 199, 0.5)',
        borderColor: 'rgb(199, 199, 199)'
    },
    'Regalos y Donaciones': {
        backgroundColor: 'rgba(83, 102, 255, 0.5)',
        borderColor: 'rgb(83, 102, 255)'
    },
    'Transporte y Viajes': {
        backgroundColor: 'rgba(255, 99, 132, 0.5)',
        borderColor: 'rgb(255, 99, 132)'
    },
    'Entretenimiento': {
        backgroundColor: 'rgba(75, 192, 192, 0.5)',
        borderColor: 'rgb(75, 192, 192)'
    }
};


const FinanceAnualCategoriesBar: React.FC<FinanceRec> = ({ items }) => {
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
        
        // Define the type for the object
        const valoresPorMesYCategoria: Record<string, number[]> = {};
        const totalesPorMes = new Array(12).fill(0);

        // Agrupar valores por mes y categoría
        items.forEach(item => {
            if(item.type === 'Gasto'){
                const [year, month] = item.value_date.split('-');
                const mes = parseInt(month) - 1;
                const categoria = item.category;

                if (!valoresPorMesYCategoria[categoria]) {
                    valoresPorMesYCategoria[categoria] = new Array(12).fill(0);
                }

                valoresPorMesYCategoria[categoria][mes] += item.value;
                totalesPorMes[mes] += item.value;
            }
        });

        // Calcular porcentajes por categoría
        const datasets = Object.keys(valoresPorMesYCategoria).map(categoria => {
            const dataPorcentaje = valoresPorMesYCategoria[categoria].map((valor, index) => 
                totalesPorMes[index] ? (valor / totalesPorMes[index]) * 100 : 0
            );

            return {
                label: categoria,
                data: dataPorcentaje,
                backgroundColor: categoryColors[categoria].backgroundColor,
                borderColor: categoryColors[categoria].borderColor,
                borderWidth: 1,
                stack: 'Stack 0',
            };
        });

        setChartData(prevData => ({
            ...prevData,
            datasets: datasets
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
        </>
    );
};

export default FinanceAnualCategoriesBar;
