"use client";
import { useEffect, useState } from "react";
import { Finance, mapStrapiToFinance } from "../types/Finance";
import FinanceAnualStats from "@/components/stadistics/financeAnualStats/FinanceAnualStats";
import "./page.css";
import { Container, Form, Nav, Navbar, Spinner } from "react-bootstrap";
import FinanceMensualStats from "@/components/stadistics/financeMensualStats/FinanceMensualStats";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
function getLocalDateString(date: Date) {
  const year = date.getFullYear();
  // getMonth() devuelve el mes de 0 a 11, por eso se suma 1
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

function getInitActualMonth(){
  const today = new Date();
  const firstDayOfYear = new Date(today.getFullYear(), 0, 1);
  return getLocalDateString(firstDayOfYear);
}

export default function FinanceHome() {
  // ASSERT SESSION USER
  const session = useSession();

  const router = useRouter();
  useEffect(() => {
    if (session.status === "unauthenticated") {
      router.push('/auth/');
    }
  }, [session.status, router]);

      useEffect(() => {
      if (!session.data?.user) return;
        fetch(`/api/finance?init=${getInitActualMonth()}&range=year`)
          .then((res) => res.json())
          .then((data) => {
            console.log(data)
			    setFinanceRecords(mapStrapiToFinance(data))
				console.log(data)
          })
          .catch((error) => {
            console.error('Error al obtener los usuarios:', error);
          })
      .finally(() => {
        setIsLoading(false);
      })
      }, [session.data?.user]);
          // STATE
	const [financeRecords, setFinanceRecords] = useState<Finance[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(true);

  if (session.status === "loading") {
    return <div>Loading...</div>;
  }
 
	function handleChangeYear(targetYear: String){
		setIsLoading(true);
		const firstDayOfYear = new Date(parseInt(targetYear.toString()), 0, 1);
		const initDate = getLocalDateString(firstDayOfYear);
		fetch(`/api/finance?init=${initDate}&range=year`)
          .then((res) => res.json())
          .then((data) => {
			setFinanceRecords(mapStrapiToFinance(data))
			console.log(data)
          })
          .catch((error) => {
            console.error('Error al obtener los registros:', error);
          })
          .finally(() => {
            setIsLoading(false);
          });
	}

  return (
    <>
		<div className="universe-background">
      
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
      
      <Container className="mt-5" >
        <div className="d-flex align-items-center gap-3" style={{color: "#f5f5f5"}}>
          <h1>Anual</h1>
          <Form.Select style={{width: "200px", color: "#000000", border: "1px solid #f5f5f5", fontSize: "2rem", padding: "0.25rem"}} onChange={(e) => handleChangeYear(e.target.value)} defaultValue={new Date().getFullYear().toString()}>
            <option value="2025">2025</option>
            <option value="2024">2024</option>
          </Form.Select>
        </div>
		
        {isLoading ? (
          <Spinner animation="grow" variant="light" />
        ) : (
          <>
			    <FinanceAnualStats items={financeRecords} />
          <FinanceMensualStats items={financeRecords} />
          </>
        )}
      </Container>
		</div>
    </>
  );
}
