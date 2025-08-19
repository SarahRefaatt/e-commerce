import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";
const prisma = new PrismaClient();

export  async function POST(req: Request) {
  try {
    const body = await req.json();

    const customer = await prisma.customer.create({
      data: body,
    });

    return NextResponse.json({ customer }, { status: 200 });
  } catch (err: any) {
    return NextResponse.json({ err }, { status: 500 });
  }
}

export  async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const idParam = searchParams.get("id");
    const email = searchParams.get("email");


    if (idParam !== null) {
      const customerId = parseInt(idParam);

    if (customerId) {
      const customer = await prisma.customer.findUnique({
        where: {
          id: customerId,
        },
      });

      return NextResponse.json({customer},{status:200})
    }

    }else if(email){

     
      const customer = await prisma.customer.findUnique({
        where: {
          email: email,
        },
      });

      return NextResponse.json({customer},{status:200})




    } else {
      
        const customers=await prisma.customer.findMany({


        })
        return NextResponse.json({customers},{status:200})

    }


  } catch (err: any) {
    return NextResponse.json({ err }, { status: 500 });
  }
}


export  async function PUT(req: Request) {
  try {


    const {searchParams}=new URL (req.url)
    const idParam = searchParams.get("id");
    const body=await req.json()

    const {}=body

      if (idParam !== null) {
      const customerId = parseInt(idParam);

      if(customerId){


        const customer=await prisma.customer.findUnique({
            where:{id:customerId}
        })


        if(!customer){

            return NextResponse.json({ message: "no such a customer with this id"},{status:404})
        }


        const updatedCustomer=await prisma.customer.update({
            where:{id:customerId},
            data:body,

        })
    return NextResponse.json({ updatedCustomer }, { status: 201 });



      }else{

            return NextResponse.json({ message: "Customer ID is required" },
        { status: 400 });

      }


      }
  } catch (err: any) {
    return NextResponse.json({ err }, { status: 500 });
  }
}
