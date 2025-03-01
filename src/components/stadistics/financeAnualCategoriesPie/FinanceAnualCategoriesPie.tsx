import { Finance } from "@/app/types/Finance";
import { Container, Spinner } from "react-bootstrap";
import { useEffect, useState } from "react";
import { Pie } from 'react-chartjs-2';
import {
    Chart as ChartJS,
    ArcElement,
    Tooltip,
    Legend,
    ChartData
} from 'chart.js';

ChartJS.register(
    ArcElement,
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

const FinanceAnualCategoriesPie: React.FC<FinanceRec> = ({ items }) => {
    const [isLoading, setIsLoading] = useState(true);
    const [chartData, setChartData] = useState<ChartData<"pie">>({
        labels: [],
        datasets: [{
            data: [],
            backgroundColor: [],
            borderColor: [],
            borderWidth: 1
        }]
    });

    useEffect(() => {
        setIsLoading(true);
        
        const totalesPorCategoria: Record<string, number> = {};

        // Calcular totales por categoría
        items.forEach(item => {
            if(item.type === 'Gasto') {
                const categoria = item.category;
                totalesPorCategoria[categoria] = (totalesPorCategoria[categoria] || 0) + item.value;
            }
        });

        // Preparar datos para el gráfico
        const labels = Object.keys(totalesPorCategoria);
        const data = labels.map(categoria => totalesPorCategoria[categoria]);
        const backgroundColors = labels.map(categoria => categoryColors[categoria].backgroundColor);
        const borderColors = labels.map(categoria => categoryColors[categoria].borderColor);

        setChartData({
            labels,
            datasets: [{
                data,
                backgroundColor: backgroundColors,
                borderColor: borderColors,
                borderWidth: 1
            }]
        });

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
                                legend: {
                                    position: 'right',
                                    labels: {
                                        color: '#f5f5f5'
                                    }
                                },
                                tooltip: {
                                    callbacks: {
                                        label: function(context) {
                                            const value = context.raw as number;
                                            return `${context.label}: $${value.toLocaleString()}`;
                                        }
                                    }
                                }
                            }
                        }}
                    />
                )}
        </>
    );
};

export default FinanceAnualCategoriesPie;
