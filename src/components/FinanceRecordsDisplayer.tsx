import { Finance } from "@/app/types/Finance";
import { Button, Card, Col, Form, Row } from "react-bootstrap";
import {financeCategories} from "../app/constants/financeValueMapping"
import { useEffect, useState } from "react";
import Table from "react-bootstrap/Table";

interface FinanceRec {
    items: Finance[];
}

function ordenarPorFecha(registros: Finance[], descendente: boolean = true) {
    return [...registros].sort((a, b) => {
        const fechaA = new Date(a.value_date).getTime();
        const fechaB = new Date(b.value_date).getTime();
        return descendente ? fechaB - fechaA : fechaA - fechaB;
    });
}

const FinanceRecord: React.FC<FinanceRec> = ({items}) => {
    const [recordsToDisplay, setRecordsToDisplay] = useState<Finance[]>(items);
    const [selectedTipo, setSelectedTipo] = useState<string>('');
    const [selectedCategoria, setSelectedCategoria] = useState<string>('');
    const [selectedSubcategoria, setSelectedSubcategoria] = useState<string>('');

    useEffect(() => {
        let filteredRecords = items;

        if (selectedTipo) {
            filteredRecords = filteredRecords.filter(item => item.type === selectedTipo);
        }
        if (selectedCategoria) {
            filteredRecords = filteredRecords.filter(item => item.category === selectedCategoria);
        }
        if (selectedSubcategoria) {
            filteredRecords = filteredRecords.filter(item => item.subcategory === selectedSubcategoria);
        }

        setRecordsToDisplay(filteredRecords);
    }, [items, selectedTipo, selectedCategoria, selectedSubcategoria]);

    const tipos = Array.from(new Set(items.map(item => item.type)));
    const categorias = Array.from(new Set(items.map(item => item.category)));
    const subcategorias = Array.from(new Set(items.map(item => item.subcategory)));
    return (
        <>
            <Card >
                <Card.Header>
                    <div className="d-flex justify-content-between align-items-center">
                        <Card.Title>Registros</Card.Title>
                        <div className="filters d-flex gap-2">
                            <Form.Select
                                size="sm"
                                value={selectedTipo}
                                onChange={e => setSelectedTipo(e.target.value)}
                            >
                                <option value="">Todos los tipos</option>
                                {tipos.map(tipo => (
                                    <option key={tipo} value={tipo}>{tipo}</option>
                                ))}
                            </Form.Select>
                            <Form.Select
                                size="sm"
                                value={selectedCategoria}
                                onChange={e => setSelectedCategoria(e.target.value)}
                            >
                                <option value="">Todas las categorías</option>
                                {categorias.map(cat => (
                                    <option key={cat} value={cat}>{cat}</option>
                                ))}
                            </Form.Select>
                            <Form.Select
                                size="sm"
                                value={selectedSubcategoria}
                                onChange={e => setSelectedSubcategoria(e.target.value)}
                            >
                                <option value="">Todas las subcategorías</option>
                                {subcategorias.map(sub => (
                                    <option key={sub} value={sub}>{sub}</option>
                                ))}
                            </Form.Select>
                        </div>
                        
                    </div>
                </Card.Header>
                <Card.Body>
                    <Table striped bordered hover>
                        <thead>
                            <tr>
                                <th>Nombre</th>
                                <th>Concepto</th>
                                <th>Fecha</th>
                                <th>Valor</th>
                                <th>Tipo</th>
                                <th>Categoria</th>
                                <th>Subcategoria</th>
                            </tr>
                        </thead>
                        <tbody>
                            {ordenarPorFecha(recordsToDisplay).map((item) => (
                                <tr key={item.id}>
                                    <td>{item.name}</td>
                                    <td>{item.concept}</td>
                                    <td>{new Date(item.value_date).toLocaleDateString()}</td>
                                    <td>{item.value.toFixed(2)}€</td>
                                    <td>{item.type}</td>
                                    <td>{item.category}</td>
                                    <td>{item.subcategory}</td>
                                </tr>
                            ))}
                            <tr>
                                <td colSpan={7} style={{ fontWeight: "bold", textAlign: "right" }}>
                                    Total: {recordsToDisplay.reduce((total, current) => total + current.value, 0).toFixed(2)}€
                                    </td>
                            </tr>
                        </tbody>
                    </Table>
                </Card.Body>
            </Card>
        </>
    );
}


export default FinanceRecord;