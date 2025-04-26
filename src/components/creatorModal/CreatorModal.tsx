import { Button, Modal } from "react-bootstrap";
import { useState } from "react";
import { Finance, mapFinanceToStrapi } from "@/app/types/Finance";
import { CircularProgressbar } from "react-circular-progressbar";
import 'react-circular-progressbar/dist/styles.css';
interface CreatorModalProps {
    show: boolean;
    onHide: () => void;
    onConfirm: () => void;
    records: Finance[];
}

interface BackRecord {
    totalRecords: number;
    successRecords: number;
    errorRecords: number;
}

const CreatorModal: React.FC<CreatorModalProps> = ({
    show,
    onHide,
    onConfirm,
    records
}) => {

    const [status, setStatus] = useState<string>("prepared");
    const [backRecords, setBackRecords] = useState<BackRecord>({
        totalRecords: 0,
        successRecords: 0,
        errorRecords: 0
    });
    const totals = records.length;

    const handleConfirm = () => {
        if(status === "executing"){
            return;
        }
        if(status === "prepared"){
            setStatus("executing");
            executeRecordsSave();
        }
        if(status === "finished"){
            console.log("finished");
            onConfirm();
        }
    }

    async function executeRecordsSave(){
        setBackRecords(prev => ({
            ...prev,
            totalRecords: records.length
        }));
        const parsedList = [];
        for(const item of records){
            parsedList.push(mapFinanceToStrapi(item))
        }
        let errors = 0;
		for(const eachParsedItem of parsedList){
			try{
				const response = await fetch("/api/finance", { // 🔒 El cliente solo llama a esta API interna
					method: "POST",
					headers: { "Content-Type": "application/json" },
					body: JSON.stringify({ records: eachParsedItem }),
				});
				const result = await response.json();
	
				if (!response.ok) {
				    throw new Error(result.error || "Error al crear registros");
				}
                setBackRecords(prev => ({
                    ...prev,
                    successRecords: prev.successRecords + 1
                }));
			}catch(error){
				errors = errors + 1;
				console.log(error)
                setBackRecords(prev => ({
                    ...prev,
                    errorRecords: prev.errorRecords + 1
                }));
			}
		}
        setStatus("finished");
    }

    return (
        <Modal show={show} onHide={onHide} centered size="lg">
            <Modal.Header closeButton>
                <Modal.Title>Confirmación</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                {status === "prepared" && (
                    <p>Total de registros: {totals}</p>
                )}
                {status === "executing" && (
                    <div className="d-flex flex-column justify-content-center align-items-center">
                        <div style={{ width: 200, height: 200 }}>
                            <CircularProgressbar value={(backRecords.successRecords + backRecords.errorRecords) / backRecords.totalRecords * 100} text={`${((backRecords.successRecords + backRecords.errorRecords) / backRecords.totalRecords * 100).toFixed(0)}%`} />
                        </div>

                        <p>Registros fallidos: {backRecords.errorRecords} / {backRecords.totalRecords}</p>
                    </div>
                )}
            </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={onHide}>
                    Cancelar
                </Button>
                <Button variant="primary" onClick={handleConfirm}>
                    Confirmar
                </Button>
            </Modal.Footer>
        </Modal>
    );
};

export default CreatorModal;
