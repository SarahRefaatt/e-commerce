import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";
const prisma = new PrismaClient();

export  async function POST(req: Request) {
  try {
    const body = await req.json();


  const orderItem = await prisma.orderItem.createMany({
      data: body, // directly pass the array
    });
    return NextResponse.json({ orderItem }, { status: 200 });
  } catch (err: any) {
  return NextResponse.json({ error: err.message, details: err.meta }, { status: 500 });
  }
}

export  async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const idParam = searchParams.get("id");


    if (idParam !== null) {
      const orderItemId = parseInt(idParam);

    if (orderItemId) {
      const orderItem = await prisma.orderItem.findUnique({
        where: {
          id: orderItemId,
        },
      });

      return NextResponse.json({orderItem},{status:200})
    }

    } else {
      
        const orderItems=await prisma.orderItem.findMany({

 

        })
        return NextResponse.json({orderItems},{status:200})

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
      const orderItemId = parseInt(idParam);

      if(orderItemId){


        const orderItem=await prisma.orderItem.findUnique({
            where:{id:orderItemId}
        })


        if(!orderItem){

            return NextResponse.json({ message: "no such a orderItem with this id"},{status:404})
        }


        const updatedorderItem=await prisma.orderItem.update({
            where:{id:orderItemId},
            data:body,

        })
    return NextResponse.json({ updatedorderItem }, { status: 201 });



      }else{

            return NextResponse.json({ message: "orderItem ID is required" },
        { status: 400 });

      }


      }
  } catch (err: any) {
    return NextResponse.json({ err }, { status: 500 });
  }
}
