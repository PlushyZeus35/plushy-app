import { Finance } from "@/app/types/Finance";
import { Container, Row, Col, Card } from "react-bootstrap";
import { useEffect, useState } from "react";
import { Pie } from "react-chartjs-2";
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
    selectedMonth: number;
}

const FinanceMensualKpis: React.FC<FinanceRec> = ({ items, selectedMonth }) => {
    const [kpis, setKpis] = useState({
        gastoTotal: 0,
        ingresoTotal: 0,
        flujoNeto: 0,
        categorias: {} as Record<string, number>
    });

    useEffect(() => {
        // Filtrar registros del mes seleccionado
        const registrosMes = items.filter(item => {
            const [year, month] = item.value_date.split('-');
            return parseInt(month) === selectedMonth;
        });

        // Calcular totales por tipo
        const totales = registrosMes.reduce((acc, item) => {
            if (item.type === 'Gasto') {
                acc.gastos += item.value;
                // Agrupar por categoría
                acc.categorias[item.category] = (acc.categorias[item.category] || 0) + item.value;
            } else if (item.type === 'Ingreso') {
                acc.ingresos += item.value;
            }
            return acc;
        }, { gastos: 0, ingresos: 0, categorias: {} as Record<string, number> });

        // Calcular flujo neto (porcentaje de gasto sobre ingreso)
        const flujoNeto = totales.ingresos > 0 ? (totales.gastos / totales.ingresos) * 100 : 0;

        setKpis({
            gastoTotal: totales.gastos,
            ingresoTotal: totales.ingresos,
            flujoNeto: flujoNeto,
            categorias: totales.categorias
        });
    }, [items, selectedMonth]);

    return (
        <Container fluid className="mt-3">
            <h4 className="mb-4">KPIs Mensuales</h4>
            <Row>
                <Col md={4} className="d-flex">
                    <Row className="flex-fill">
                        <Card className="p-3 mb-3">
                            <h5 style={{color: "#f5f5f5"}}>Gasto Mensual</h5>
                            <h3 style={{color: "#f5f5f5"}}>€{kpis.gastoTotal.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}</h3>
                        </Card>
                        <Card className="p-3 mb-3">
                            <h5 style={{color: "#f5f5f5"}}>Ingreso Mensual</h5>
                            <h3 style={{color: "#f5f5f5"}}>€{kpis.ingresoTotal.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}</h3>
                        </Card>
                        <Card className="p-3 mb-3">
                            <h5 style={{color: "#f5f5f5"}}>Flujo Neto</h5>
                            <h3 style={{color: "#f5f5f5"}}>{kpis.flujoNeto.toFixed(2)}%</h3>
                        </Card>
                    </Row>
                </Col>
                <Col md={8} className="d-flex">
                    <Card className="p-3 flex-fill d-flex justify-content-center align-items-center">
                        <div style={{ height: '300px', width: '100%', display: 'flex', justifyContent: 'center' }}>
                            <Pie 
                                height={300}
                                width={300}
                                data={{
                                    labels: Object.keys(kpis.categorias),
                                    datasets: [{
                                        label: 'Gastos por Categoría',
                                        data: Object.values(kpis.categorias),
                                        backgroundColor: Object.keys(kpis.categorias).map(categoria => 
                                            categoryColors[categoria]?.backgroundColor || 'rgba(200, 200, 200, 0.5)'
                                        ),
                                        borderColor: Object.keys(kpis.categorias).map(categoria => 
                                            categoryColors[categoria]?.borderColor || 'rgb(200, 200, 200)'
                                        ),
                                        borderWidth: 1
                                    }]
                                }}
                                options={{
                                    responsive: true,
                                    maintainAspectRatio: false,
                                    plugins: {
                                        tooltip: {
                                            callbacks: {
                                                title: (tooltipItems) => {
                                                    if (!tooltipItems.length) {
                                                        return '';
                                                    }
                                                    return tooltipItems[0].label || '';
                                                },
                                                afterLabel: (tooltipItem) => {
                                                    const total = kpis.gastoTotal;
                                                    if (total === 0) return '(0%)';
                                                    const value = tooltipItem.parsed;
                                                    const percent = Math.round((value / total) * 100);
                                                    return `(${percent}%)`;
                                                },
                                            },
                                        },
                                        legend: {
                                            position: 'right',
                                            labels: {
                                                color: '#f5f5f5'
                                            }
                                        }
                                    }
                                }}
                            />
                        </div>
                    </Card>
                </Col>
            </Row>
        </Container>
    );
};

export default FinanceMensualKpis;
