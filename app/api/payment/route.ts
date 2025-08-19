import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";
const prisma = new PrismaClient();

export  async function POST(req: Request) {
  try {
    const body = await req.json();

    const payment = await prisma.payment.createMany({
      data: body,
    });

    return NextResponse.json({ payment }, { status: 200 });
  } catch (err: any) {
    return NextResponse.json({ err }, { status: 500 });
  }
}

export  async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const idParam = searchParams.get("id");


    if (idParam !== null) {
      const paymentId = parseInt(idParam);

    if (paymentId) {
      const payment = await prisma.payment.findUnique({
        where: {
          id: paymentId,
        },
      });

      return NextResponse.json({payment},{status:200})
    }

    } else {
      
        const payments=await prisma.payment.findMany({

   
        })
        return NextResponse.json({payments},{status:200})

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
      const paymentId = parseInt(idParam);

      if(paymentId){


        const payment=await prisma.payment.findUnique({
            where:{id:paymentId}
        })


        if(!payment){

            return NextResponse.json({ message: "no such a payment with this id"},{status:404})
        }


        const updatedpayment=await prisma.payment.update({
            where:{id:paymentId},
            data:body,

        })
    return NextResponse.json({ updatedpayment }, { status: 201 });



      }else{

            return NextResponse.json({ message: "payment ID is required" },
        { status: 400 });

      }


      }
  } catch (err: any) {
    return NextResponse.json({ err }, { status: 500 });
  }
}
