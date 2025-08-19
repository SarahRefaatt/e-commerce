import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";
const prisma = new PrismaClient();

export async function POST(req: Request) {
  try {
    const body = await req.json();

    // Validate required fields
    if (!body.customerId) {
      return NextResponse.json(
        { message: "Wishlist name is required" },
        { status: 400 }
      );
    }

    const customer = await prisma.customer.findUnique({
      where: {
        id: body.customerId,
      },
    });

    if (!customer) {
      return NextResponse.json(
        { message: "no such a customer with this id" },
        { status: 404 }
      );
    }
    const wishlist = await prisma.wishlist.create({
      data: {
        customerId: body.customerId,
        // Add other validated fields here
      },
    });

    const customer_update = await prisma.customer.update({
    where: {
      id: wishlist.customerId
    },
    data: {
        cartid: wishlist.id
    }
  });

    return NextResponse.json({ wishlist }, { status: 201 });
  } catch (err: any) {
    console.error("Wishlist creation error:", err);
    return NextResponse.json(
      { message: "Failed to create wishlist" },
      { status: 500 }
    );
  }
}

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const idParam = searchParams.get("id");

    const customerId = searchParams.get("customerId");
    const productId = searchParams.get("productId");

    if (idParam !== null) {
      const wishlistId = parseInt(idParam);

      if (wishlistId) {
        const wishlist = await prisma.wishlist.findUnique({
          where: {
            id: wishlistId,
          },
        });

        return NextResponse.json({ wishlist }, { status: 200 });
      }
    } 

     else if (customerId) {
        console.log("in");
        const wishlist = await prisma.wishlist.findFirst({
          where: {
            customerId: Number(customerId),
          },
          include:{
            WishlistItem:true
          }
        });

        return NextResponse.json({ wishlist }, { status: 200 });
      }
      else if(customerId && productId){

 const wishlist = await prisma.wishlist.findFirst({
          where: {
            customerId: Number(customerId),
          },
        });

         const wishlistItem = await prisma.wishlistItem.findFirst({
          where: {
            productId: Number(productId),
          },
        });
        if(wishlist && wishlistItem ){
           return NextResponse.json(true, { status: 200 });
        }

        return NextResponse.json({ wishlist ,wishlistItem}, { status: 404 });
      }
    
      
    
    
    
    else {
      console.log("down");
      const wishlists = await prisma.wishlist.findMany({
        include: {
          WishlistItem: true,
        },
      });
      return NextResponse.json({ wishlists }, { status: 200 });
    }
  } catch (err: any) {
    return NextResponse.json({ err }, { status: 500 });
  }
}

export async function PUT(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const idParam = searchParams.get("id");
    const body = await req.json();

    const {} = body;

    if (idParam !== null) {
      const wishlistId = parseInt(idParam);

      if (wishlistId) {
        const wishlist = await prisma.wishlist.findUnique({
          where: { id: wishlistId },
        });

        if (!wishlist) {
          return NextResponse.json(
            { message: "no such a wishlist with this id" },
            { status: 404 }
          );
        }

        const updatedwishlist = await prisma.wishlist.update({
          where: { id: wishlistId },
          data: body,
        });
        return NextResponse.json({ updatedwishlist }, { status: 201 });
      } else {
        return NextResponse.json(
          { message: "wishlist ID is required" },
          { status: 400 }
        );
      }
    }
  } catch (err: any) {
    return NextResponse.json({ err }, { status: 500 });
  }
}
