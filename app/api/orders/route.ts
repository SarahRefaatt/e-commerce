import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";
const prisma = new PrismaClient();


export async function POST(req: Request) {
  try {
    const body = await req.json();

      const newOrder = await prisma.order.create({
        data: {
          customerId: body.customerId,
          shipping_address: body.shipping_address,
          billing_address: body.billing_address,
          status: 'PENDING',
          total_amount: body.total_amount,
          paymentStatus: 'WAITING', // Ensure this matches your enum in Prisma
        
        },
        
      });

   

    return NextResponse.json({ newOrder }, { status: 201 });
  } catch (err: any) {
    console.error('Order creation error:', err);
    return NextResponse.json(
      { error: 'Failed to create order', details: err.message },
      { status: 500 }
    );
  }
}

export  async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const idParam = searchParams.get("id");


    if (idParam !== null) {
      const orderId = parseInt(idParam);

    if (orderId) {
      const order = await prisma.order.findUnique({
        
        where: {
          id: orderId,
        },

      
  include:{
        items:true,}

      });

      return NextResponse.json({order},{status:200})
    }

    } else {
      
        const orders=await prisma.order.findMany({

        
  include:{
        items:true,
  }

        })
        return NextResponse.json({orders},{status:200})

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
      const orderId = parseInt(idParam);

      if(orderId){


        const order=await prisma.order.findUnique({
            where:{id:orderId}
        })


        if(!order){

            return NextResponse.json({ message: "no such a order with this id"},{status:404})
        }


        const updatedorder=await prisma.order.update({
            where:{id:orderId},
            data:body,

        })
    return NextResponse.json({ updatedorder }, { status: 201 });



      }else{

            return NextResponse.json({ message: "order ID is required" },
        { status: 400 });

      }


      }
  } catch (err: any) {
    return NextResponse.json({ err }, { status: 500 });
  }
}
