import { Finance } from "@/app/types/Finance";
import { Button, Card, Col, Form, Row } from "react-bootstrap";
import {financeCategories} from "../app/constants/financeValueMapping"
import { useState } from "react";

interface FinanceRec {
    item: Finance;
    onEdit: (updatedItem: Finance) => void;
    onRemoveItem: (itemToDelete: Finance) => void;
}
const FinanceRecord: React.FC<FinanceRec> = ({item, onEdit, onRemoveItem}) => {
    const [financeRecord, setFinanceRecord] = useState(item);

    const handleOnChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFinanceRecord((prev) => {
            const updatedRecord = { 
                ...prev, 
                [name]: value 
            };
    
            if (name === "category") {
                updatedRecord.subcategory = "";
            }
            //onEdit(updatedRecord);
            return updatedRecord;
            
        })
        onEdit({ ...financeRecord, [name]: value, ...(name === "category" && { subcategory: "" }) });
        console.log({name, value})
    }

    const handleOnChangeSelect = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFinanceRecord((prev) => {
            const updatedRecord = { 
                ...prev, 
                [name]: value 
            };
    
            if (name === "category") {
                updatedRecord.subcategory = "";
            }
            //onEdit(updatedRecord);
            return updatedRecord;
            
        })
        onEdit({ ...financeRecord, [name]: value, ...(name === "category" && { subcategory: "" }) });
        console.log({name, value})
    }

    function handleRemoveItem(e: React.MouseEvent<HTMLButtonElement>): void {
        onRemoveItem(item);
    }

    return (
        <>
            <Card border={financeRecord.type === "Gasto" ? "danger" : financeRecord.type === "Ingreso" ? "success" : "primary"}>
                <Card.Header>
                    <Card.Title>{financeRecord.type}</Card.Title>
                </Card.Header>
                <Card.Body>
                    <Row>
                        <Form.Group as={Col}>
                            <Form.Label htmlFor="name">Nombre</Form.Label>
                            <Form.Control name="name" onChange={handleOnChange} value={financeRecord.name} type="text" size="sm"/>
                        </Form.Group>
                        <Form.Group as={Col}>
                            <Form.Label htmlFor="concept">Concepto</Form.Label>
                            <Form.Control name="concept" onChange={handleOnChange} value={financeRecord.concept} type="text" size="sm"/>
                        </Form.Group>
                    </Row>
                    <Row className="mt-2">
                        <Form.Group as={Col} xs={6}>
                        <Form.Label htmlFor="type">Tipología</Form.Label>
                            <Form.Select name="type" onChange={handleOnChangeSelect} value={financeRecord.type} size="sm">
                                <option value="">Selecciona una tipología</option>
                                <option value="Gasto">Gasto</option>
                                <option value="Ingreso">Ingreso</option>
                                <option value="Inversion">Inversión</option>
                            </Form.Select>
                        </Form.Group>
                        <Form.Group as={Col} xs={3}>
                            <Form.Label htmlFor="value_date">Fecha</Form.Label>
                            <Form.Control name="value_date" onChange={handleOnChange} value={financeRecord.value_date} type="date" size="sm"/>
                        </Form.Group>
                        <Form.Group as={Col} xs={3}>
                            <Form.Label htmlFor="value">Valor</Form.Label>
                            <Form.Control name="value" onChange={handleOnChange} value={financeRecord.value} type="number" min="1" step="any" size="sm"/>
                        </Form.Group>
                    </Row>
                    <Row className="mt-2">
                        <Form.Group as={Col}>
                            <Form.Label htmlFor="category">Categoría</Form.Label>
                            <Form.Select name="category" onChange={handleOnChangeSelect} value={financeRecord.category} size="sm">
                                <option value="">Selecciona una categoría</option>
                                {Object.keys(financeCategories).map((category) => (
                                        <option key={category} value={category}>
                                        {category}
                                        </option>
                                    ))}
                            </Form.Select>
                        </Form.Group>
                        <Form.Group as={Col}>
                            <Form.Label htmlFor="subcategory">Subcategoría</Form.Label>
                            <Form.Select name="subcategory" onChange={handleOnChangeSelect} value={financeRecord.subcategory} disabled={!item.category} size="sm">
                                <option value="">Selecciona una subcategoría</option>
                                {financeRecord.category &&
                                    financeCategories[financeRecord.category].map((subcategory) => (
                                    <option key={subcategory} value={subcategory}>
                                        {subcategory}
                                    </option>
                                ))}
                            </Form.Select>
                        </Form.Group>
                    </Row>
                </Card.Body>
                <Card.Footer>
                <Button name={item.id} onClick={handleRemoveItem} variant="outline-danger">Eliminar</Button>
                </Card.Footer>
            </Card>
        </>
    );
}


export default FinanceRecord;