"use client";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import Form from "react-bootstrap/Form";
import Container from "react-bootstrap/Container";
import Spinner from "react-bootstrap/Spinner";
import { useState } from "react";
import { Finance, mapStrapiToFinance } from "@/app/types/Finance";
import FinanceRecordDisplayer from "@/components/FinanceRecordsDisplayer";

export default function AnalisisPage() {
  const { status } = useSession();
  const router = useRouter();

  const [fechaInicio, setFechaInicio] = useState<string>(new Date().toISOString().split("T")[0]);
  const [rango, setRango] = useState<string>("day");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [rangedData, setRangedData] = useState<Finance[]>([]);

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/auth/");
    }
  }, [status, router]);

    useEffect(() => {
        if (status === "authenticated") {
        setIsLoading(true);
        fetch(`/api/finance?init=${fechaInicio}&range=${rango}`)
            .then((res) => res.json())
            .then((data) => {
                setRangedData(mapStrapiToFinance(data));
            })
            .finally(() => {
                setIsLoading(false);
            });
        }
    }, [status, fechaInicio, rango]);

  if (status === "loading") {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ minHeight: "60vh" }}>
        <Spinner animation="border" variant="primary" />
      </div>
    );
  }

  return (
    <Container>
      <div className="d-flex gap-3 align-items-center my-4">
      <Form.Group>
        <Form.Label>Fecha inicio</Form.Label>
        <Form.Control
            type="date"
            onChange={(e) => setFechaInicio(e.target.value)}
            value={fechaInicio}
        />
    </Form.Group>
      <Form.Group>
        <Form.Label>Tipo de análisis</Form.Label>
        <Form.Select
            onChange={(e) => setRango(e.target.value)}
            value={rango}>
          <option value="day">Diario</option>
          <option value="month">Mensual</option>
          <option value="year">Anual</option>
        </Form.Select>
      </Form.Group>
    </div>
    <div>
        {isLoading ? (
            <div className="d-flex justify-content-center align-items-center" style={{ minHeight: "60vh" }}>
            <Spinner animation="border" variant="primary" />
            </div>
        ) : (
            <div>
            {/* Aquí puedes renderizar los resultados del análisis */}
            <h2>Resultados del Análisis</h2>
            <FinanceRecordDisplayer items={rangedData} />
            </div>
        )}
    </div>
    </Container>
  );
}
