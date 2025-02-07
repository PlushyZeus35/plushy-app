import { Finance } from "@/app/types/Finance";
import { useRef, useState } from "react";
import { Button, Col, Container, Form, Row } from "react-bootstrap";
import {financeCategories} from "../app/constants/financeValueMapping";
import { v4 as uuidv4 } from 'uuid';
import { parse } from 'csv-parse';

interface FinanceFormProps {
    onAddFinanceRecord: (financeRecord: Finance) => void;
    onAddBulkFinanceRecords: (financeRecords: Finance[]) => void;
    onClearFinanceRecords: () => void;
}

interface FinanceRow {
    operation_date: string;
    value_date: string;
    concept: string;
    value: string
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

    const handleOnChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
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

    const handleOnChangeSelect = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const { name, value } = e.target;
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

    const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (!file) return;

        const csvText = await file.text();

        // 2. Usa csv-parse para parsearlo en el navegador
        parse(
        csvText,
        {
            columns: true,       // Usa primera fila como cabeceras, creando objetos
            delimiter: ';',
            skip_empty_lines: true,
            trim: true,
        },
        (err, output: FinanceRow[]) => { // Callback con el array parseado
            if (err) {
                console.error("Error al parsear CSV:", err);
                return;
            }
            console.log("Datos parseados:", output);
            const records: Finance[] = [];
            for(const eachFileRec of output){
                records.push({
                    id: uuidv4(),
                    type: parseFloat(eachFileRec["value"].replace(",", ".")) > 0 ? 'Ingreso' : 'Gasto',
                    concept: eachFileRec["concept"],
                    name: eachFileRec["concept"],
                    value_date: formatDateForInput(eachFileRec["value_date"]),
                    value: Math.abs(parseFloat(eachFileRec["value"].replace(",", "."))),
                    category: '',
                    subcategory: ''
                })
            }
            if (inputRef.current) {
                inputRef.current.value = "";
            }
            onAddBulkFinanceRecords(records)
        }
        );

        /*reader.onload = async ({ target }) => {
        if (!target?.result) return;

        const csv = target.result as string;

        Papa.parse(csv, {
            header: true, // Convierte la primera fila en claves del objeto
            skipEmptyLines: true, // Ignorar filas vacías
            delimiter: ";",
            complete: (result: ParseResult<FinanceRow>) => {
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

        reader.readAsText(file);*/
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
                        <Form.Select name="type" onChange={handleOnChangeSelect} value={formData.type}>
                            <option value="">Selecciona una tipología</option>
                            <option value="Gasto">Gasto</option>
                            <option value="Ingreso">Ingreso</option>
                            <option value="Inversion">Inversión</option>
                        </Form.Select>
                    </Form.Group>
                    <Form.Group as={Col}>
                        <Form.Label>Categoría</Form.Label>
                        <Form.Select name="category" onChange={handleOnChangeSelect} value={formData.category}>
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
                        <Form.Select name="subcategory" onChange={handleOnChangeSelect} value={formData.subcategory} disabled={!formData.category}>
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