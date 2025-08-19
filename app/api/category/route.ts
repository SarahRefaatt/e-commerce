import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";
const prisma = new PrismaClient();

export  async function POST(req: Request) {
  try {
    const body = await req.json();

    // const product_variant = await prisma.productVariant.create({
    //   data: body,
    // });

    const category = await prisma.productVariant.createMany({
      data: body,
    });

    return NextResponse.json({ category }, { status: 200 });
  } catch (err: any) {
    return NextResponse.json({ err }, { status: 500 });
  }
}

export  async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const idParam = searchParams.get("id");

    if (idParam !== null) {
      const product_variantId = parseInt(idParam);
      

    if (product_variantId) {
      const product_variant = await prisma.productVariant.findUnique({
        where: {
          id: product_variantId,
        },
      });

      return NextResponse.json({product_variant},{status:200})
    }

    } 
    else {
      
        const category=await prisma.productVariant.findMany({


        })
        return NextResponse.json({category},{status:200})

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
      const product_variantId = parseInt(idParam);

      if(product_variantId){


        const product_variant=await prisma.productVariant.findUnique({
            where:{id:product_variantId}
        })


        if(!product_variant){

            return NextResponse.json({ message: "no such a product_variant with this id"},{status:404})
        }


        const updatedproduct_variant=await prisma.productVariant.update({
            where:{id:product_variantId},
            data:body,

        })
    return NextResponse.json({ updatedproduct_variant }, { status: 201 });



      }else{

            return NextResponse.json({ message: "product_variant ID is required" },
        { status: 400 });

      }


      }
  } catch (err: any) {
    return NextResponse.json({ err }, { status: 500 });
  }
}
