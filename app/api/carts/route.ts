import { Prisma, PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";
const prisma = new PrismaClient();

export  async function POST(req: Request) {
  try {
    const body = await req.json();

    const cart = await prisma.cart.create({
      data: body,
    });

  // Update the customer if needed (example: set cartId or other fields)
  // Make sure to use the correct unique field, usually 'id'
  const customer = await prisma.customer.update({
    where: {
      id: cart.customerId
    },
    data: {
        cartid: cart.id
    }
  });

    return NextResponse.json({ 
      message: "Cart created successfully",
      // cart: {
      //   id: cart.id,
      //   // include any other relevant fields you want to return
      //   // productId: cart.productId, // Removed because productId does not exist on cart
      //   customerId: cart.customerId,
      // }

      cart
    }, { status: 201 });
  } catch (err: any) {
    return NextResponse.json({ err }, { status: 500 });
  }
}




export  async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const idParam = searchParams.get("id");
    const customerId=Number(searchParams.get("customerId"))


    if (idParam !== null) {
      const cartId = parseInt(idParam);

    if (cartId) {
      const cart = await prisma.cart.findUnique({
        where: {
          id: cartId,
        },
      });

      return NextResponse.json({cart},{status:200})
    }

    }else if(customerId){
      
      const cart = await prisma.cart.findMany({
        where: {
          customerId: customerId,
        },
        include: {
          items: true,
        },
      });

      return NextResponse.json({cart},{status:200})
    }
    
    else {
      
      console.log("HERE")
        const carts=await prisma.cart.findMany({

        
          include:{
            items:true,
          }

        })
        return NextResponse.json({carts},{status:200})

    }


  } catch (err: any) {
    return NextResponse.json({ message:err.message }, { status: 500 });
  }
}


export  async function PUT(req: Request) {
  try {


    const {searchParams}=new URL (req.url)
    const idParam = searchParams.get("id");
    const body=await req.json()

    const {}=body

      if (idParam !== null) {
      const cartId = parseInt(idParam);

      if(cartId){


        const cart=await prisma.cart.findUnique({
            where:{id:cartId}
        })


        if(!cart){

            return NextResponse.json({ message: "no such a cart with this id"},{status:404})
        }


        const updatedcart=await prisma.cart.update({
            where:{id:cartId},
            data:body,

        })
    return NextResponse.json({ updatedcart }, { status: 201 });



      }else{

            return NextResponse.json({ message: "cart ID is required" },
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
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json({ error: "Cart ID is required" }, { status: 400 });
    }

    const cartId = parseInt(id);

    // First delete related cart items
    await prisma.cartItem.deleteMany({
      where: { cartId },
    });

    // Then delete the cart
    const deletedCart = await prisma.cart.delete({
      where: { id: cartId },
    });

    return NextResponse.json(deletedCart, { status: 200 });
  } catch (error) {
    console.error("Error deleting cart:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
