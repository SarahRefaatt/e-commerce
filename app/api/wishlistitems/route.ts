import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";
const prisma = new PrismaClient();

export  async function POST(req: Request) {
  try {
    const body = await req.json();

    const wishlistItem = await prisma.wishlistItem.create({
      data: body,
    });

    return NextResponse.json({ wishlistItem }, { status: 200 });
  } catch (err: any) {
    return NextResponse.json({ err }, { status: 500 });
  }
}

export  async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const idParam = searchParams.get("id");
    const wishlistId=searchParams.get("wishlistId")


    if (idParam !== null) {
      const wishlistItemId = parseInt(idParam);

    if (wishlistItemId) {
      const wishlistItem = await prisma.wishlistItem.findUnique({
        where: {
          id: wishlistItemId,
        },
      });

      return NextResponse.json({wishlistItem},{status:200})
    }

    }else if(wishlistId){

      const wishlistItem = await prisma.wishlistItem.findMany({
        where: {
          wishlistId: Number(wishlistId),
        },
      });

      return NextResponse.json({wishlistItem},{status:200})




    } else {
      
        const wishlistItems=await prisma.wishlistItem.findMany({

        
  

        })
        return NextResponse.json({wishlistItems},{status:200})

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
      const wishlistItemId = parseInt(idParam);

      if(wishlistItemId){


        const wishlistItem=await prisma.wishlistItem.findUnique({
            where:{id:wishlistItemId}
        })


        if(!wishlistItem){

            return NextResponse.json({ message: "no such a wishlistItem with this id"},{status:404})
        }


        const updatedwishlistItem=await prisma.wishlistItem.update({
            where:{id:wishlistItemId},
            data:body,

        })
    return NextResponse.json({ updatedwishlistItem }, { status: 201 });



      }else{

            return NextResponse.json({ message: "wishlistItem ID is required" },
        { status: 400 });

      }


      }
  } catch (err: any) {
    return NextResponse.json({ err }, { status: 500 });
  }
}


export async function DELETE(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const idParam = searchParams.get("id");

    if (idParam !== null) {
      const wishlistItemId = Number(idParam);

      if (wishlistItemId) {
        const wishlistItem = await prisma.wishlistItem.findUnique({
          where: { id: wishlistItemId },
        });

        if (!wishlistItem) {
          return NextResponse.json(
            { message: "No wishlist item found with this id" },
            { status: 404 }
          );
        }

        await prisma.wishlistItem.delete({
          where: { id: wishlistItemId },
        });

        return NextResponse.json(
          { message: "Wishlist item deleted successfully" },
          { status: 200 }
        );
      } else {
        return NextResponse.json(
          { message: "wishlistItem ID is required" },
          { status: 400 }
        );
      }
    } else {
      return NextResponse.json(
        { message: "wishlistItem ID is required" },
        { status: 400 }
      );
    }
  } catch (err: any) {
    return NextResponse.json({ err }, { status: 500 });
  }
}