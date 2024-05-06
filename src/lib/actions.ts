"use server"
import prisma from "@/db/db"
import { auth, currentUser } from "@clerk/nextjs";
import { Loan } from "@prisma/client";
import { error } from "console";
import { addDays } from "date-fns";
import { redirect } from "next/navigation";
import { NextResponse } from "next/server";
import { use } from "react";


interface MyResponseInit extends ResponseInit{
    maxPaymentsReached?: boolean
}

const responseInit: MyResponseInit = { status: 400, maxPaymentsReached: true };


export const getCurrentUser = async () => {

    const user = await currentUser()

    if(!user)  return new Response("Unauthorized", { status: 401 });

    return user
}



export const createClient = async (name: string,lastName: string,phone: string) => {
    const user = await currentUser()

    if(!user)  return new Response("Unauthorized", { status: 401 });

    const findUser = await prisma.user.findUnique({
        where:{
            clerkUserId: user.id
        }
    })

    if(!findUser) return new Response("Unauthorized", { status: 401 });

    const client = await prisma.client.create({
        data:{
            name: name,
            lastName: lastName,
            userId: findUser.id,
            phone: phone
        }
    })

    return client.id
}


export const getClientIdData = async (clientId: string) => {

    try{

        const client = await prisma.client.findUnique({
            where:{
              id: clientId
            }
          })
        
          console.log(client)
        
        
          if(!client)
          {
            return redirect("/addClient")
          }


          return client


    }catch(error)
    {
        console.log(error)

        return redirect('/addClient')
    }

}


// export const getCurrentClientData = async (clientId: string) => {


//     try{
//         const findClient = await prisma.client.findFirst({
//             where:{
//                 id: clientId
//             }
//         })
    
   
         
//          return findClient ?? null
//     }catch(error)
//     {
//         console.log(error)
//     }
    
   
    

// }

export const updateCurrentClientData = async (clientId: string,name?: string,lastName?: string,phone?: string) => {

    const updateData = await prisma.client.update({
        where:{
            id: clientId
        },
        data:{
            name: name,
            lastName: lastName,
            phone: phone
        }
    })


    return updateData

}


export const deleteCurrentClient = async (clientId: string) => {

    try{

        await prisma.client.delete({
            where:{
              id: clientId
            }
        })

    }catch(error)
    {
        console.log("Delte Client Error -->",error)
    }

}



export const getAllClientData = async () => {

    try{

        const user = await currentUser()

        if(!user) return new Response("Unauthorized", { status: 401 });



        const findUser = await prisma.user.findUnique({
            where:{
                clerkUserId: user.id
            }
        })


        if(!findUser) return new Response("Unauthorized", { status: 401 });

        // Encuentra todos los clientes que no tienen préstamos asociados
        const clientsWithoutLoans = await prisma.client.findMany({
            where: {
                userId: findUser.id,
                loans: {
                    none: {} // Busca clientes que no tengan ningún préstamo asociado
                }
            }
        });

        // Elimina los clientes encontrados
        const deletePromises = clientsWithoutLoans.map(client => {
            return prisma.client.delete({
                where: {
                    id: client.id
                }
            });
        });

        // Espera a que todas las eliminaciones se completen
        await Promise.all(deletePromises);


        const getClients = await prisma.client.findMany({
            where:{
                userId: findUser.id,
                
            },
            include:{
                loans: true
            }
        })


        return getClients

    }catch(error)
    {
        console.log("Get All Client Data Error --> ",error)
    }

}


//LOAN DATA ACTIONS

export const getAllLoanData = async () => {

    try{

        await getCurrentUser()

        const findClient = await prisma.loan.findMany({
            include:{
                client: {
                    select:{
                        id: true,
                        name: true,
                        lastName: true,
                        phone: true,
                        userId: true,
                        createdAt: true,
                        updatedAt: true
                    }
                }
            }
        })

        return findClient

    }catch(error)
    {
        console.log("Get All Loan Data Error --> ",error)

    }

}

export const getCurrentLoanData = async (loanId: string) =>{
    try{
        const findLoan = await prisma.loan.findFirst({
            where:{
                id: loanId
            }
        })
    
   
         
         return findLoan ?? null
    }catch(error)
    {
        console.log(error)
    }
}


export const createLoan = async (clientId: string,startDate: Date,endDate: Date,totalAmount: string) => {

    const findClient = await prisma.client.findFirst({
        where:{
            id: clientId
        }
    })

    if(!findClient) return new Response("Unauthorized", { status: 401 });

    // Obtener el valor predeterminado de interestRate
    const defaultInterestRate = 20; // Este valor debe coincidir con el valor predeterminado en tu modelo

    const totalAmountFloat = parseFloat(totalAmount)
    const interestRateDecimal = defaultInterestRate / 100
    const greatTotalAmount = totalAmountFloat * (1 + interestRateDecimal)
   

    const loan = await prisma.loan.create({
        data:{
            clientId: findClient.id,
            startDate: startDate,
            endDate: endDate,
            totalAmount: totalAmountFloat,
            interestRate: defaultInterestRate,
            greatTotalAmount: greatTotalAmount,
            remainingBalance: greatTotalAmount,
            renewal: false
        }
    })


    return loan

}


export const deleteCurrentLoan = async (loanId: string) => {

    try{

        await prisma.loan.delete({
            where:{
              id: loanId
            }
        })

    }catch(error)
    {
        console.log("Delete Loan Error -->",error)
    }

}


export const updateCurrentLoanData = async (loanId: string,renewal?: boolean,totalAmount?: string,remainingBalance?: number,startDate?: Date,endDate?: Date) => {

    let transaction
    let updateLoanData: any = {}

    try{

        
        if(renewal !== undefined){
            updateLoanData.renewal = renewal

            // Si renewal es true, actualiza totalAmount a un nuevo valor
            if (renewal && typeof totalAmount === "string") {

                const interestRateDecimal = 20 / 100
                const greatTotalAmount = parseFloat(totalAmount) * (1 + interestRateDecimal)

                // Convertir totalAmount a un número de punto flotante
                const totalAmountFloat = parseFloat(totalAmount);

               
                // if(!isNaN(totalAmountFloat)){
                       
                //         console.log(totalAmountFloat)
                // }
                
                updateLoanData.remainingBalance = greatTotalAmount
                updateLoanData.totalAmount = totalAmountFloat;
                updateLoanData.moneyNotReceived = remainingBalance
                updateLoanData.greatTotalAmount = greatTotalAmount
                updateLoanData.startDate = startDate

                if(startDate)
                updateLoanData.endDate = addDays(startDate,12)
            }
        }

        transaction = await prisma.$transaction([
            

        

    
            prisma.loan.update({
                where:{
                    id: loanId
                },
                data: updateLoanData
                
            }),

            prisma.payment.deleteMany({
                where:{
                    loanId: loanId
                }
            })
    
            
        ])

       
        return transaction[0]

    }catch(error)
    {
        console.log("UPDATE CURRENT LOAN ERROR --> ",error)
        return {error: error,status: 500}
    }

}

//PAYMENT DATA ACTIONS


export const createPayment = async (hasPay: any,loanId: string,paymentAmount?: string) => {

    const prismTransaction = await prisma.$transaction

    try{


        const user = await currentUser()

        if(!user) return new Response("Unauthorized", { status: 401 });


        const findLoan = await prisma.loan.findUnique({
            where:{
                id: loanId
            }
        })

        if(!findLoan) return redirect('/getLoans')
            // Contar el número de pagos existentes para este préstamo
        const paymentCount = await prisma.payment.count({
            where: {
                loanId: loanId
            }
        });

        // Si ya hay 3 pagos, retornar un mensaje de error
        if (paymentCount >= 2) {
            
            //console.log(responseInit)
            //return JSON.stringify("NO ENTROOOOOO")
            //return NextResponse.json({message: "No hfhhfghfhgfhfhhfghfghfgh"}, {status: 400});
            const errorMessage = "No se pueden agregar más pagos";
            return {error: errorMessage,status: 400}
        }


        if(!hasPay){
            const updateLoanEndDate = await prisma.loan.update({
                where:{
                    id: loanId
                },
                data:{
                    endDate: addDays(findLoan.endDate,1)
                }
            })

            return updateLoanEndDate
        }

        if(hasPay && paymentAmount == undefined || paymentAmount == '' || paymentAmount == '0'){
            
            return new NextResponse("Payment amount is required when hasPay is true", { status: 400 });
            
        }


        const latestPayment = await prisma.payment.findFirst({
            where:{
                loanId: loanId
            },
            orderBy:{
                paymentNumber: 'desc'
            }
        })

         

        // Calcular el nuevo número de pago
        let newPaymentNumber = 1;

        

        if(latestPayment){

            if(latestPayment.paymentNumber){
                newPaymentNumber = latestPayment.paymentNumber   + 1

                // Asegurarse de que el número de pago no exceda 12
                newPaymentNumber = Math.min(newPaymentNumber,2)

                console.log(newPaymentNumber)
            }
            

        }

        
       

        const payment =  await prisma.payment.create({
            data:{
                hasPay: hasPay,
                loanId: findLoan.id,
                paymentAmount: parseFloat(paymentAmount ?? ''),
                paymentDate: new Date(),
                paymentNumber:  newPaymentNumber
            }

            
        })

        if(findLoan.remainingBalance){

             await prisma.loan.update({
                where:{
                    id: loanId
                },
                data:{
                    remainingBalance: findLoan.remainingBalance  - parseFloat(paymentAmount ?? '')
                }
            })

            
        }

       
        return payment


    }catch(error)
    {
        console.log("Create Payment Data error --> ",error)

        return redirect('/getLoans')
    }

}


export const getCurrentPaymentData = async (loanId: string) => {
    try {
        // const user = await currentUser();

        // if (!user) return new Response("Unauthorized", { status: 401 });

        // const findLoan = await prisma.loan.findUnique({
        //     where: {
        //         id: loanId
        //     }
        // });

        // if (!findLoan) return []

        const foundPayments = await prisma.payment.findMany({
            where: {
                loanId: loanId
            },
            include: {
                loan: true
            }
        });

        return foundPayments;
    } catch (error) {
        console.error("Get Payment Data Error --> ", error);
        return []; // Devolver un array vacío en caso de error
    }
};


export const getTotalClients = async () => {

    const count = await prisma?.client.count()

    return{amount: count}

  }

  export const getTotalLoans = async () => {
    
    const count = await prisma?.loan.count()

    return{amount: count}
  }

