import { Finance } from "@/app/types/Finance";
import { Container, Row, Col, Card } from "react-bootstrap";
import { useEffect, useState } from "react";

interface FinanceRec {
    items: Finance[];
}

const FinanceCreatorStats: React.FC<FinanceRec> = ({ items }) => {
    const [stats, setStats] = useState({
        totalRegistros: 0,
        totalGastos: 0,
        totalIngresos: 0,
        registrosIncompletos: 0
    });

    useEffect(() => {
        // Calcular el total de registros
        const totalRegistros = items.length;

        // Calcular registros incompletos
        const registrosIncompletos = items.filter(item => {
            return !item.value || 
                   !item.value_date || 
                   !item.type ||
                   !item.category ||
                   !item.name || 
                   !item.concept ||
                   !item.subcategory;
        }).length;

        // Calcular totales por tipo
        const totales = items.reduce((acc, item) => {
            if (item.type === 'Gasto') {
                acc.gastos += item.value || 0;
            } else if (item.type === 'Ingreso') {
                acc.ingresos += item.value || 0;
            }
            return acc;
        }, { gastos: 0, ingresos: 0 });

        setStats({
            totalRegistros,
            totalGastos: totales.gastos,
            totalIngresos: totales.ingresos,
            registrosIncompletos: registrosIncompletos
        });
    }, [items]);

    return (
        <Card className="p-3" style={{backgroundColor: 'transparent'}}>
            <h2 className="text-center mb-3 border-bottom pb-2">Estadísticas</h2>
            <div className="mb-3">
                <h5>Total Registros</h5>
                <h3>{stats.totalRegistros}</h3>
            </div>
            <div className="mb-3">
                <h5>Registros Incompletos</h5>
                <h3>{stats.registrosIncompletos}</h3>
            </div>
            <div className="mb-3">
                <h5>Total Gastos</h5>
                <h3>€{stats.totalGastos.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}</h3>
            </div>
            <div>
                <h5>Total Ingresos</h5>
                <h3>€{stats.totalIngresos.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}</h3>
            </div>
        </Card>
    );
};

export default FinanceCreatorStats;
