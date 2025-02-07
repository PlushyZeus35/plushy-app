import { Finance } from "@/app/types/Finance";
import { NextResponse } from "next/server";
const STRAPI_URL = process.env.NEXT_PUBLIC_STRAPI_URL;
const API_KEY = process.env.STRAPI_API_KEY;
let items: Finance[] = [];

export async function POST(req: Request) {
    try {
        const { records } = await req.json(); // Leer los registros enviados desde el frontend
        const response = await fetch(`${STRAPI_URL}/api/finanzas`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${API_KEY}`, // Usa la clave de Strapi de forma segura
          },
          body: JSON.stringify({ data: records }), // Strapi requiere `{ data: {...} }`
        });
    
        if (!response.ok) {
          return NextResponse.json({ error: `Error en Strapi: ${response.statusText} ${STRAPI_URL}/api/finanzas ${JSON.stringify(records)}` }, { status: response.status });
        }
    
        const result = await response.json();
        return NextResponse.json({ message: "Registros creados con éxito", result }, { status: 200 });
    } catch (error: any) {
        return NextResponse.json({ error: error.message || "Error interno del servidor" }, { status: 500 });
    }
}