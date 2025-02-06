import { Finance } from "@/app/types/Finance";
import { NextResponse } from "next/server";
const STRAPI_URL = process.env.NEXT_PUBLIC_STRAPI_URL;
const API_KEY = process.env.STRAPI_API_KEY;
let items: Finance[] = [];

export async function GET(request: Request){
    return NextResponse.json(items);
}

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

export async function PUT(request: Request) {
    // Obtenemos el parámetro "id" de la query string
    const { searchParams } = new URL(request.url);
    const idParam = searchParams.get('id');
    if (idParam === null) {
        // Manejar el caso en que 'id' no está presente.
        return NextResponse.json({ error: 'Falta el parámetro id' }, { status: 400 });
    }
    const id = Number(idParam);
    const indexToUpdate = items.findIndex((item) => item.id === id);
    const body = await request.json();
    if (indexToUpdate === -1) {
        return NextResponse.json({ error: 'Item no encontrado' });
    }
    // Actualiza el nombre (o cualquier otro campo)
    items[indexToUpdate] = { ...items[indexToUpdate], ...body };
    return NextResponse.json(items[indexToUpdate]);
}

export async function DELETE(request: Request) {
    const { searchParams } = new URL(request.url);
    const idParam = searchParams.get('id');
    if (!idParam) {
      return NextResponse.json({ error: 'Falta el parámetro id' }, { status: 400 });
    }
    const idToDelete = Number(idParam);
  
    const initialLength = items.length;
    items = items.filter((item) => item.id !== idToDelete);
  
    if (items.length === initialLength) {
      return NextResponse.json({ error: 'Item no encontrado' }, { status: 404 });
    }
  
    return NextResponse.json({ message: 'Item eliminado' }, { status: 200 });
}