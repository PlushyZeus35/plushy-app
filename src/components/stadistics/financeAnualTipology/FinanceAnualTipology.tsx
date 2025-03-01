import { Finance } from "@/app/types/Finance";
import { Col, Container, Row, Spinner } from "react-bootstrap";
import { useEffect, useState } from "react";
import { Pie } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  ArcElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js';
import FinanceAnualTipologyBars from "../financeAnualTipologyBars/financeAnualTipologyBars";
import FinanceAnualTipologyPie from "../financeAnualTipologyPie/FinanceAnualTipologyPie";

ChartJS.register(
  ArcElement,
  Title,
  Tooltip,
  Legend
);

interface FinanceRec {
    items: Finance[];
}

const FinanceAnualTipology: React.FC<FinanceRec> = ({ items }) => {

    return (
        <>
            <Container fluid>
                <h4 className="mb-4">Distribución por Tipología</h4>
                <Row>
                    <Col md={8}>
                        <FinanceAnualTipologyBars items={items} />
                    </Col>
                    <Col md={3}>
                        <FinanceAnualTipologyPie items={items} />
                    </Col>
                </Row>
            </Container>
        </>
    );
};

export default FinanceAnualTipology;
