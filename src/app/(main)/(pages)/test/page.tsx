"use client"
import { Button } from '@/components/ui/button'
import { Form, FormField, FormItem, FormLabel } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { createTestAction } from '@/lib/actions'
import { zodResolver } from '@hookform/resolvers/zod'
import { useSearchParams } from 'next/navigation'
import React, { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zfd } from "zod-form-data";

const TestPage = () => {

    const clientIdParam = useSearchParams()

    const clientId =  clientIdParam.get("clientId")


    const testSchema = z.object({
        client: z.string(),
        // amount: z.number()
        // .refine( n => !z.number().int().safeParse( n ).success, 'should not be integer' )
        amount: z.string().refine((amount) => parseInt(amount))
    })

    // const schema = z.number()
    // .refine( n => !z.number().int().safeParse( n ).success, 'should not be integer' )

    // console.log(testSchema.parse(115.50))


    const testForm = useForm<z.infer<typeof testSchema>>({
        resolver: zodResolver(testSchema),
        defaultValues:{
            client: clientId ? clientId : '',
            amount: ''
        }
    })



    const handleSubmitTests = async () => {

        try{

            const res = await createTestAction(testForm.getValues().client,testForm.getValues().amount)

            

            return res

        }catch(error)
        {
            console.log(error)
        }

    }

  return (
    <div className='flex flex-col items-center gap-6 w-full h-screen' >
        <Form {...testForm} >
            <form onSubmit={testForm.handleSubmit(handleSubmitTests)}>
                <FormField 
                    control={testForm.control}
                    name='client'
                    render={({field}) => (
                        <FormItem>
                            <FormLabel>Cliente: </FormLabel>
                            <Input className='w-[600px]' disabled={true} {...field} placeholder='agerga amount....' value={clientId ? clientId : ''}  />
                        </FormItem>
                    )}

                />
                <FormField 
                    control={testForm.control}
                    name='amount'
                    render={({field}) => (
                        <FormItem>
                            <FormLabel>Amount: </FormLabel>
                            <Input {...field} placeholder='agerga amount....'  type='number'  />
                        </FormItem>
                    )}

                />
                <Button type='submit' className='mt-8' >
                        PROBAR
                </Button>
            </form>
        </Form>
    </div>
  )
}

export default TestPage