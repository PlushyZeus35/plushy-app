"use client";
import { useState } from "react";
import { Finance, mapFinanceToStrapi } from "../../types/Finance";
import { Button, Col, Container, Nav, Navbar, Row, Stack } from "react-bootstrap";
import FinanceForm from "@/components/FinanceForm";
import FinanceRecord from "@/components/FinanceRecord";
import FinanceCreatorStats from "@/components/stadistics/financeCreatorStats/financeCreatorStats";
import "./page.css";
import CreatorModal from "@/components/creatorModal/CreatorModal";
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
	const [showModal, setShowModal] = useState(false);
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

  const handleRemoveItem = (itemToDelete: Finance) => {
    const itemId = itemToDelete.id; // 🔹 Convertir name a número con `Number()`
    console.log("🔹 Eliminando item con ID:", itemId);
    setItems((prev) => prev.filter((eachPrev) => eachPrev.id !== itemId));
};

  const handleFinishClick = async (e: React.MouseEvent<HTMLButtonElement>) => {
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
	setShowModal(true);
		console.log("aqui llego")
		/*let errors = 0;
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
		}*/
		//alert('Errores: ' + errors)
		//setItems([]);
  }

  const addBulkFinanceRecords = (newFinanceRecords: Finance[]) => {
	console.log("en el padre!")
	console.log(newFinanceRecords)
	setItems([...newFinanceRecords, ...items]);
  }

  const clearFinanceRecords = () => {
	setItems([]);
  }

	function handleConfirm(): void {
		console.log("confirmar")
		setShowModal(false);
	}

  return (
    <>
		<Navbar sticky="top" expand="lg" variant="dark" className="navbar">
          <Container fluid>
            <Navbar.Brand href="#" style={{ color: '#1a1a1a' }}>P.L.U.S.H.Y</Navbar.Brand>
            <Navbar.Toggle aria-controls="basic-navbar-nav" />
            <Navbar.Collapse id="basic-navbar-nav" className="justify-content-end">
              <Nav>
                <Nav.Link href="#" style={{ color: '#1a1a1a' }}>Creación</Nav.Link>
                <Nav.Link href="#" style={{ color: '#1a1a1a' }}>Estadísticas</Nav.Link>
              </Nav>
            </Navbar.Collapse>
          </Container>
        </Navbar>
		{showModal && <CreatorModal show={showModal} onHide={() => setShowModal(false)} onConfirm={handleConfirm} records={items} />}
		<div style={{backgroundColor: "#f5f5f5", minHeight: "100vh", paddingTop: "30px"}}>
			<Container>
				<Row>
					<Col md={8}>
						<FinanceForm onAddFinanceRecord={onAddFinanceRecord} onAddBulkFinanceRecords={addBulkFinanceRecords} onClearFinanceRecords={clearFinanceRecords}></FinanceForm>
						<Container className="mt-3">
							{items.map(item => (
								<div key={item.id} className="border-top border-3 py-3">
									<Stack>
										<FinanceRecord item={item} onEdit={handleOnEdit} onRemoveItem={handleRemoveItem}>
										</FinanceRecord>
									</Stack>
								</div>
							))}
						</Container>
						<Container className="border-top border-3 py-3">
							<Button variant="primary" onClick={handleFinishClick} disabled={items.length==0}>
								Crear
							</Button>
						</Container>
					</Col>
					<Col md={4}>
						<div className="sticky-top" style={{top: "80px"}}>
							<FinanceCreatorStats items={items}></FinanceCreatorStats>
						</div>
					</Col>
				</Row>
			</Container>
		</div>
    </>
  );
}
