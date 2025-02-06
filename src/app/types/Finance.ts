export interface Finance {
    id: string,
    name: string,
    concept: string,
    value_date: string,
    value: number,
    type: string,
    category: string,
    subcategory: string
}

export const mapFinanceToStrapi = (record: Finance) => {
    return {
        Nombre: record.name,
        Concepto: record.concept,
        Fecha_valor: record.value_date,
        Tipologia: record.type,
        Categoria: record.category,
        Subcategoria: record.subcategory,
        Cantidad: record.value,
        ExternalId: record.id
    }
}