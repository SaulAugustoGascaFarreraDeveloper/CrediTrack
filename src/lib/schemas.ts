import {z} from "zod"



export const ClientFormSchema = z.object({
    name: z.string().min(1,"Nombre es Requerido"),
    lastName: z.string().min(1,"Apellido es Requerido"),
    phone: z.string()
})

export const EditClientFormSchema = z.object({
    name: z.string().min(1,"Nombre es Requerido").optional(),
    lastName: z.string().min(1,"Apellido es Requerido").optional(),
    phone: z.string().optional()
})


export const LoanFormSchema = z.object({
    startDate: z.date().refine((sd) => sd !== undefined,{message: 'Ingresa una Fecha Valida'}),
    endDate: z.date().refine((ed) => ed !== undefined,{message: 'Ingresa una Fecha Valida'}),
    totalAmount: z.string().refine((amount) => parseFloat(amount) > 0),
    renewal: z.boolean(),
    client: z.string().min(1,"El cliente es requerido") 

})

