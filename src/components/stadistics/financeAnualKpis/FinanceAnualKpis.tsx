import { Finance } from "@/app/types/Finance";
import { Container, Row, Col, Card } from "react-bootstrap";
import { useEffect, useState } from "react";

interface FinanceRec {
    items: Finance[];
}

const FinanceAnualKpis: React.FC<FinanceRec> = ({ items }) => {
    const [kpis, setKpis] = useState({
        gastoMensual: 0,
        ingresoMensual: 0,
        colchonEmergencia: 0
    });

    useEffect(() => {
        // Obtener los meses únicos con datos
        const mesesConDatos = new Set(items.map(item => {
            const [year, month] = item.value_date.split('-');
            return month;
        }));

        const numMeses = mesesConDatos.size;

        // Calcular totales por tipo
        const totales = items.reduce((acc, item) => {
            if (item.type === 'Gasto') {
                acc.gastos += item.value;
            } else if (item.type === 'Ingreso') {
                acc.ingresos += item.value;
            }
            return acc;
        }, { gastos: 0, ingresos: 0 });

        // Calcular medias mensuales y colchón de emergencia (6 meses de gastos)
        const gastoMensual = totales.gastos / numMeses;
        setKpis({
            gastoMensual: gastoMensual,
            ingresoMensual: totales.ingresos / numMeses,
            colchonEmergencia: gastoMensual * 6
        });
    }, [items]);

    return (
        <Container fluid className="mt-3">
            <h4 className="mb-4">KPIs Anuales</h4>
            <Row>
                <Col md={4}>
                    <Card className="p-3">
                        <h5 style={{color: "#f5f5f5"}}>Gasto Mensual Medio</h5>
                        <h3 style={{color: "#f5f5f5"}}>€{kpis.gastoMensual.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}</h3>
                    </Card>
                </Col>
                <Col md={4}>
                    <Card className="p-3">
                        <h5 style={{color: "#f5f5f5"}}>Ingreso Mensual Medio</h5>
                        <h3 style={{color: "#f5f5f5"}}>€{kpis.ingresoMensual.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}</h3>
                    </Card>
                </Col>
                <Col md={4}>
                    <Card className="p-3">
                        <h5 style={{color: "#f5f5f5"}}>Colchón de Emergencia</h5>
                        <h3 style={{color: "#f5f5f5"}}>€{kpis.colchonEmergencia.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}</h3>
                    </Card>
                </Col>
            </Row>
        </Container>
    );
};

export default FinanceAnualKpis;
