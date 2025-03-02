import { Finance } from "@/app/types/Finance";
import { useEffect } from "react";
import { useState } from "react";
import { Form } from "react-bootstrap";
import FinanceMensualGeneralLine from "../financeMensualGeneralLine/FinanceMensualGeneralLine";
import FinanceMensualKpis from "../financeMensualKpis/FinanceMensualKpis";
interface FinanceRec {
    items: Finance[];
}

const FinanceMensualStats: React.FC<FinanceRec> = ({ items }) => {
    const [selectedMonth, setSelectedMonth] = useState<number>(1); // Por defecto enero (1)

    const handleChangeMonth = (month: string) => {
        setSelectedMonth(parseInt(month));
    }

    const monthlyRecords = items.filter(record => {
        const recordDate = new Date(record.value_date);
        return recordDate.getMonth() === selectedMonth - 1; // Ajustamos el índice del mes
    });

    return (
        <>
            <div className="d-flex align-items-center gap-3 mt-3" style={{color: "#f5f5f5"}}>
                <h1>Mensual</h1>
                <Form.Select 
                    style={{width: "200px", color: "#000000", border: "1px solid #f5f5f5", fontSize: "2rem", padding: "0.25rem"}} 
                    onChange={(e) => handleChangeMonth(e.target.value)} 
                    value={selectedMonth}
                >
                    <option value="1">Enero</option>
                    <option value="2">Febrero</option>
                    <option value="3">Marzo</option>
                    <option value="4">Abril</option>
                    <option value="5">Mayo</option>
                    <option value="6">Junio</option>
                    <option value="7">Julio</option>
                    <option value="8">Agosto</option>
                    <option value="9">Septiembre</option>
                    <option value="10">Octubre</option>
                    <option value="11">Noviembre</option>
                    <option value="12">Diciembre</option>
                </Form.Select>
            </div>
            <div className="card mt-3" style={{color: "#f5f5f5", padding: "2rem"}}>
                <div className="d-flex flex-column gap-4">
                    <FinanceMensualGeneralLine items={monthlyRecords} selectedMonth={selectedMonth} />
                    <hr style={{
                        borderTop: '1px solid rgba(255, 255, 255, 1)',
                        margin: '1rem 0'
                    }}/>
                    <FinanceMensualKpis items={monthlyRecords} selectedMonth={selectedMonth} />
                </div>
            </div>
        </>
    );
};

export default FinanceMensualStats;