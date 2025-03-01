import { Finance } from "@/app/types/Finance";
import { NextResponse } from "next/server";
const STRAPI_URL = process.env.NEXT_PUBLIC_STRAPI_URL;

// init = fecha inicial range = day,month,year
export async function GET(req: Request){
	const { searchParams } = new URL(req.url);
	let range = searchParams.get('range');
	let init = searchParams.get('init');
	let query = `${STRAPI_URL}/api/finanzas`;
	const records = [];
	if(!init){
		const today = new Date();
		const currentYear = today.getFullYear();
		const currentMonth = today.getMonth();
		const firstDayOfCurrentMonth = new Date(currentYear, currentMonth, 1);
		init = firstDayOfCurrentMonth.toISOString().slice(0, 10);
	}
	if(!range){
		range = 'month';
	}
	console.log(init)
	console.log(range)
	if(range == 'day'){
		query = query + `?filters[Fecha_valor][$eq]=${init}`;
	}else if(range == 'year'){
		const [yearStr, monthStr, dayStr] = init.split('-');
		const year = parseInt(yearStr, 10);
		const month = parseInt(monthStr, 10);
		const day = parseInt(dayStr, 10);
		const nextYear = year + 1;
		const nextDate = new Date(nextYear, month - 1, day);
		query = query + `?filters[Fecha_valor][$gte]=${init}&filters[Fecha_valor][$lt]=${nextDate.toISOString().slice(0, 10)}`;
	}else{
		const [anioStr, mesStr] = init.split("-");
		const anio = parseInt(anioStr, 10);
		const mes = parseInt(mesStr, 10);
		const ultimoDiaFecha = new Date(anio, mes, 0);
		query = query + `?filters[Fecha_valor][$gte]=${init}&filters[Fecha_valor][$lte]=${ultimoDiaFecha.toISOString().slice(0, 10)}`;
	}

	const response = await fetch(query, {
		method: "GET",
		headers: {
		  "Content-Type": "application/json",
		  Authorization: `Bearer ${process.env.STRAPI_API_KEY}`, 
		},
	});
	let respJson = await response.json();
	records.push(...respJson.data)
	while (respJson.meta.pagination.page < respJson.meta.pagination.pageCount) {
		// Siguiente página
		const nextPage = respJson.meta.pagination.page + 1;
		const pagedQuery = query + `&pagination[page]=${nextPage}&pagination[pageSize]=${respJson.meta.pagination.pageSize}`;
		// Haces un nuevo fetch ajustando el parámetro de página
		const nextResponse = await fetch(
		  pagedQuery
		);
		
		respJson = await nextResponse.json();
	  
		// Agregas estos datos al array principal
		records.push(...respJson.data);
	  }
	return NextResponse.json(records);
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