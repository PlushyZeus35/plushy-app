import { Finance } from "@/app/types/Finance";
import { useRef, useState } from "react";
import { Button, Col, Container, Form, Row } from "react-bootstrap";
import {financeCategories} from "../app/constants/financeValueMapping";
import { v4 as uuidv4 } from 'uuid';
import Papa from "papaparse";
interface FinanceFormProps {
    onAddFinanceRecord: (financeRecord: Finance) => void;
    onAddBulkFinanceRecords: (financeRecords: Finance[]) => void;
    onClearFinanceRecords: () => void;
}

const formatDateForInput = (dateString: string): string => {
    const [day, month, year] = dateString.split("/"); // Divide la fecha en partes
    return `${year}-${month}-${day}`; // Reorganiza en formato YYYY-MM-DD
  };
  

const FinanceRecord: React.FC<FinanceFormProps> = ({onAddFinanceRecord, onAddBulkFinanceRecords, onClearFinanceRecords}) => {
    const [formData, setFormData] = useState({
        name: '',
        concept: '',
        type: '',
        value_date: '',
        category: '',
        value: '',
        subcategory: ''
    });
    const inputRef = useRef<HTMLInputElement | null>(null);
    const [isFormValid, setIsFormValid] = useState(false);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        
        const newFinance: Finance = {
          id: uuidv4(), // Usamos timestamp como id único
          name: formData.name,
          concept: formData.concept,
          type: formData.type,
          value_date: formData.value_date,
          category: formData.category,
          subcategory: formData.subcategory,
          value: parseFloat(formData.value)
        };
    
        onAddFinanceRecord(newFinance); // Enviamos el objeto al padre
        setFormData({
            name: '',
            concept: '',
            type: '',
            value_date: '',
            category: '',
            value: '',
            subcategory: ''
        }); 
        setIsFormValid(false)
    };

    const handleOnChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target as HTMLInputElement | HTMLSelectElement;
        setFormData(
            (prev) => {
                const updatedFormData = { 
                    ...prev, 
                    [name]: value 
                };
        
                if (name === "category") {
                    updatedFormData.subcategory = "";
                }
                const isFormValid = Boolean(
                    updatedFormData.name &&
                    updatedFormData.category &&
                    updatedFormData.concept &&
                    updatedFormData.type &&
                    updatedFormData.value_date &&
                    updatedFormData.subcategory
                );
        
                setIsFormValid(isFormValid);
                return updatedFormData;
            }
        );        
    };

    const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (!file) return;

        const reader = new FileReader();
    reader.onload = async ({ target }) => {
        if (!target?.result) return;

        const csv = target.result as string;

        Papa.parse(csv, {
            header: true, // Convierte la primera fila en claves del objeto
            skipEmptyLines: true, // Ignorar filas vacías
            delimiter: ";",
            complete: (result) => {
            // Mapear los datos a la interfaz `FinanceRecord`
            const records: Finance[] = result.data.map((row: any) => ({
                id: uuidv4(),
                type: parseFloat(row["value"].replace(",", ".")) > 0 ? 'Ingreso' : 'Gasto',
                concept: row["concept"],
                name: row["concept"],
                value_date: formatDateForInput(row["value_date"]),
                value: Math.abs(parseFloat(row["value"].replace(",", ".")))
            }));
            if (inputRef.current) {
                inputRef.current.value = "";
            }
            onAddBulkFinanceRecords(records)
            console.log(records);
            },
        });
        };

        reader.readAsText(file);
    };

    return (
        <Container>
            <Form onSubmit={handleSubmit}>
                <Form.Group>
                    <Form.Label>Nombre</Form.Label>
                    <Form.Control name="name" onChange={handleOnChange} value={formData.name} type="text"/>
                </Form.Group>
                <Form.Group>
                    <Form.Label>Concepto</Form.Label>
                    <Form.Control name="concept" onChange={handleOnChange} value={formData.concept} type="text"/>
                </Form.Group>
                <Row>
                    <Form.Group as={Col}>
                        <Form.Label>Fecha</Form.Label>
                        <Form.Control name="value_date" onChange={handleOnChange} value={formData.value_date} type="date"/>
                    </Form.Group>
                    <Form.Group as={Col}>
                        <Form.Label>Valor</Form.Label>
                        <Form.Control name="value" onChange={handleOnChange} value={formData.value} type="number" min="1" step="any"/>
                    </Form.Group>
                </Row>
                <Row className="mb-3">
                    <Form.Group as={Col}>
                        <Form.Label>Tipología</Form.Label>
                        <Form.Select name="type" onChange={handleOnChange} value={formData.type}>
                            <option value="">Selecciona una tipología</option>
                            <option value="Gasto">Gasto</option>
                            <option value="Ingreso">Ingreso</option>
                            <option value="Inversion">Inversión</option>
                        </Form.Select>
                    </Form.Group>
                    <Form.Group as={Col}>
                        <Form.Label>Categoría</Form.Label>
                        <Form.Select name="category" onChange={handleOnChange} value={formData.category}>
                            <option value="">Selecciona una categoría</option>
                            {Object.keys(financeCategories).map((category) => (
                                <option key={category} value={category}>
                                {category}
                                </option>
                            ))}
                        </Form.Select>
                    </Form.Group>
                    <Form.Group as={Col}>
                        <Form.Label>Subcategoría</Form.Label>
                        <Form.Select name="subcategory" onChange={handleOnChange} value={formData.subcategory} disabled={!formData.category}>
                            <option value="">Selecciona una subcategoría</option>
                            {formData.category &&
                                financeCategories[formData.category].map((subcategory) => (
                                <option key={subcategory} value={subcategory}>
                                    {subcategory}
                                </option>
                            ))}
                        </Form.Select>
                    </Form.Group>
                </Row>
                <Button variant="primary" type="submit" disabled={!isFormValid}>
                    Añadir
                </Button>
                <Button variant="outline-danger" className="ms-3" onClick={onClearFinanceRecords}>
                    Clear
                </Button>
                <Form.Group controlId="formFileSm" className="mb-3">
                    <Form.Label>Por CSV</Form.Label>
                    <Form.Control ref={inputRef} accept=".csv" type="file" size="sm" onChange={handleFileUpload} />
                </Form.Group>
            </Form>
        </Container>
    );
}


export default FinanceRecord;