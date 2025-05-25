import { Finance } from "@/app/types/Finance";
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { options } from "@/app/api/auth/[...nextauth]/options";
const STRAPI_URL = process.env.NEXT_PUBLIC_STRAPI_URL;

// init = fecha inicial range = day,month,year
export async function GET(req: Request){
	const session = await getServerSession(options);
	if (!session || !session.user?.email) {
		return NextResponse.json({ error: "No autenticado" }, { status: 401 });
	}
  console.log(session.jwt)
  // Aquí tu lógica para obtener las comidas
  // const meals = await fetch(...);
    if(!session.jwt){
        return NextResponse.json({ error: "No autenticado" }, { status: 401 });
    }
	const { searchParams } = new URL(req.url);
	let range = searchParams.get('range');
	let init = searchParams.get('init');
	const res = await fetch(
    `${process.env.PLUSHYSERVER_URL}/finance?init=${init}&range=${range}`,
    {
        headers: {
            Authorization: `Bearer ${session.jwt}`,
            "Content-Type": "application/json"
        }
    }
);
	const data = await res.json();
	if (!res.ok) {
		return NextResponse.json({ error: `Error al obtener los registros: ${res.statusText} ${JSON.stringify(data)}` }, { status: res.status });
	}
	console.log(data)
	if (!data || !Array.isArray(data.data)) {
		return NextResponse.json({ error: "Datos no válidos" }, { status: 400 });
	}

	return NextResponse.json(data.data, { status: res.status });
}

export async function POST(req: Request) {
    try {
        const { records } = await req.json();
        const response = await fetch(`${STRAPI_URL}/api/finanzas`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${process.env.STRAPI_API_KEY}`, 
          },
          body: JSON.stringify({ data: records }),
        });
    
        if (!response.ok) {
          return NextResponse.json({ error: `Error en Strapi: ${response.statusText} ${JSON.stringify(await response.json())} ${STRAPI_URL}/api/finanzas ${JSON.stringify(records)}` }, { status: response.status });
        }
    
        const result = await response.json();
        return NextResponse.json({ message: "Registros creados con éxito", result }, { status: 200 });
    } catch (error: any) {
        return NextResponse.json({ error: error.message || "Error interno del servidor" }, { status: 500 });
    }
}