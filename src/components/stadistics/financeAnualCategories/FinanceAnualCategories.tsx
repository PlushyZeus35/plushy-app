import { Finance } from '@/app/types/Finance';
import React from 'react';
import { Col, Container, Row } from 'react-bootstrap';
import FinanceAnualCategoriesBar from '../financeAnualCategoriesBar/FinanceAnualCategoriesBar';
import FinanceAnualCategoriesPie from '../financeAnualCategoriesPie/FinanceAnualCategoriesPie';

interface FinanceRec {
    items: Finance[];
}

const FinanceAnualCategories: React.FC<FinanceRec> = ({ items }) => {
    return (
        <>
            <Container fluid>
                <h4 className="mb-4">Distribución de Gastos por Categorias</h4>
                <Row>
                    <Col md={8}>
                        <FinanceAnualCategoriesBar items={items} />
                    </Col>
                    <Col md={3}>
                        <FinanceAnualCategoriesPie items={items} />
                    </Col>
                </Row>
            </Container>
        </>
    );
};

export default FinanceAnualCategories;



