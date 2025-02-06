import { Finance } from "@/app/types/Finance";
import { Col, Form, Row } from "react-bootstrap";
import {financeCategories} from "../app/constants/financeValueMapping"
import { useState } from "react";

interface FinanceRec {
    item: Finance;
    onEdit: (updatedItem: Finance) => void
}
const FinanceRecord: React.FC<FinanceRec> = ({item, onEdit}) => {
    const [financeRecord, setFinanceRecord] = useState(item);

    const handleOnChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
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
    return (
        <>
            <Row>
                <Form.Group as={Col}>
                    <Form.Control name="name" onChange={handleOnChange} value={financeRecord.name} type="text" size="sm"/>
                </Form.Group>
                <Form.Group as={Col}>
                    <Form.Control name="concept" onChange={handleOnChange} value={financeRecord.concept} type="text" size="sm"/>
                </Form.Group>
            </Row>
            <Row className="mt-3">
                <Form.Group as={Col}>
                    <Form.Control name="value_date" onChange={handleOnChange} value={financeRecord.value_date} type="date" size="sm"/>
                </Form.Group>
                <Form.Group as={Col}>
                    <Form.Control name="value" onChange={handleOnChange} value={financeRecord.value} type="number" min="1" step="any" size="sm"/>
                </Form.Group>
            </Row>
            <Row className="mt-3">
                <Form.Group as={Col}>
                    <Form.Select name="type" onChange={handleOnChange} value={financeRecord.type} size="sm">
                        <option value="">Selecciona una tipología</option>
                        <option value="Gasto">Gasto</option>
                        <option value="Ingreso">Ingreso</option>
                        <option value="Inversion">Inversión</option>
                    </Form.Select>
                </Form.Group>
                <Form.Group as={Col}>
                    <Form.Select name="category" onChange={handleOnChange} value={financeRecord.category} size="sm">
                        <option value="">Selecciona una categoría</option>
                        {Object.keys(financeCategories).map((category) => (
                                <option key={category} value={category}>
                                {category}
                                </option>
                            ))}
                    </Form.Select>
                </Form.Group>
                <Form.Group as={Col}>
                    <Form.Select name="subcategory" onChange={handleOnChange} value={financeRecord.subcategory} disabled={!item.category} size="sm">
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
        </>
    );
}


export default FinanceRecord;