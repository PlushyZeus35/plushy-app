"use client";
import { useState } from "react";
import { Finance, mapFinanceToStrapi } from "../../types/Finance";
import { Button, Container, Stack } from "react-bootstrap";
import FinanceForm from "@/components/FinanceForm";
import FinanceRecord from "@/components/FinanceRecord";

const areItemsValidToBackend = (items: Finance[]): boolean => {
	return items.every((record) =>
		record.id &&
		record.name &&
		record.concept &&
		record.value_date &&
		record.value !== undefined && // Verifica que `value` no sea null o undefined
		record.category &&
		record.subcategory &&
		record.type
	  );
}

export default function Creator() {
  const [items, setItems] = useState<Finance[]>([]);

  const onAddFinanceRecord = (newFinanceRecord: Finance) => {
	console.log("finance rec");
	console.log(newFinanceRecord)
	setItems([newFinanceRecord, ...items]);
  }

  const handleOnEdit = (updatedItem: Finance) => {
	console.log("he llegao al padre!")
	console.log(updatedItem)
	setItems((prev) => prev.map((item) =>
        item.id === updatedItem.id ? updatedItem  : item
      ));
  }

  const handleRemoveItem = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const itemId = e.target.name; // 🔹 Convertir name a número con `Number()`
    console.log("🔹 Eliminando item con ID:", itemId);
    setItems((prev) => prev.filter((eachPrev) => eachPrev.id !== itemId));
};

  const handleFinishClick = async (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
	console.log("clickk");
	console.log(items);
	console.log("aqui llego?")
	if(!areItemsValidToBackend(items)){
		alert("Hay algún registro con algún campo incompleto")
		return;
	}

	const parsedList = [];
	for(const item of items){
		parsedList.push(mapFinanceToStrapi(item))
	}
	
		console.log("aqui llego")
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
			}catch(error){
				errors = errors + 1;
				console.log(error)
			}
		}
		alert('Errores: ' + errors)
		setItems([]);
  }

  const addBulkFinanceRecords = (newFinanceRecords: Finance[]) => {
	console.log("en el padre!")
	console.log(newFinanceRecords)
	setItems([...newFinanceRecords, ...items]);
  }

  const clearFinanceRecords = () => {
	setItems([]);
  }

  return (
    <>
		<FinanceForm onAddFinanceRecord={onAddFinanceRecord} onAddBulkFinanceRecords={addBulkFinanceRecords} onClearFinanceRecords={clearFinanceRecords}></FinanceForm>
		<Container className="mt-3">
			{items.map(item => (
				<div key={item.id} className="border-top border-3 py-3">
				<Stack >
					<FinanceRecord item={item} onEdit={handleOnEdit}>
					</FinanceRecord>
				</Stack>
				<Stack className="mt-3">
					<Button name={item.id} onClick={handleRemoveItem} variant="outline-danger">Eliminar</Button>
				</Stack>
				</div>
				
			))}
		</Container>
		<Container className="border-top border-3 py-3">
			<Button variant="primary" onClick={handleFinishClick} disabled={items.length==0}>
				Crear
			</Button>
		</Container>
	
    </>
  );
}
