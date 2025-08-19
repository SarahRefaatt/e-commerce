import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";
import { number } from "zod";
const prisma = new PrismaClient();


export  async function POST(req: Request) {
  try {
    const body = await req.json();

    // const product_variant = await prisma.productVariant.create({
    //   data: body,
    // });

    const product_variants = await prisma.productVariant.createMany({
      data: body,
    });

    return NextResponse.json({ product_variants }, { status: 200 });
  } catch (err: any) {
    return NextResponse.json({ err }, { status: 500 });
  }
}

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const idParam = searchParams.get("id");
    const productIdParam = searchParams.get("productId") || searchParams.get("productid"); // Handle both cases
    const colorParam = searchParams.get("color");
    const sizeParam = searchParams.get("size");

    if (idParam !== null) {
      const product_variantId = parseInt(idParam);
      
      if (product_variantId) {
        const product_variant = await prisma.productVariant.findUnique({
          where: {
            id: product_variantId,
          },
        });
        return NextResponse.json({product_variant},{status:200});
      }
    } 
    else if (productIdParam !== null && colorParam !== null && sizeParam !== null) {
      const productId = parseInt(productIdParam);

      if (productId && colorParam && sizeParam) {
        const product_variants = await prisma.productVariant.findMany({
          where: {
            productid: productId,
            color: colorParam,
            size: sizeParam,
          },
        });
        return NextResponse.json({ product_variants }, { status: 200 });
      }
    }
    else if (productIdParam !== null) {
      const productId = parseInt(productIdParam);

      if (productId) {
        const product_variants = await prisma.productVariant.findMany({
          where: {
            productid: productId,
          },
        });
        return NextResponse.json({ product_variants }, { status: 200 });
      }
    }
    else {
      const product_variants = await prisma.productVariant.findMany();
      return NextResponse.json({product_variants},{status:200});
    }

    return NextResponse.json({ error: "Invalid parameters" }, { status: 400 });

  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}


export async function PUT(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const idParam = searchParams.get("id");
    const parameter = searchParams.get("param")


    const body = await req.json();

    // Validate all required parameters
    if (!idParam) {
      return NextResponse.json(
        { message: "Product ID is required" },
        { status: 400 }
      );
    }

    if (!parameter) {
      return NextResponse.json(
        { message: "Parameter is required (either '+' or '-')" ,parameter},
        { status: 400 }
      );
    }

    const productVariantId = parseInt(idParam);
    if (isNaN(productVariantId)) {
      return NextResponse.json(
        { message: "Invalid productVariant ID" },
        { status: 400 }
      );
    }

    if (!body.quantity || isNaN(body.quantity)) {
      return NextResponse.json(
        { message: "Valid quantity is required in the request body" },
        { status: 400 }
      );
    }

    const existingProductVariant = await prisma.productVariant.findUnique({
      where: { id: productVariantId },
    });

    if (!existingProductVariant) {
      return NextResponse.json(
        { message: "Product variant not found" },
        { status: 404 }
      );
    }

    let newQuantity;
    if (parameter === "add") {
      newQuantity = existingProductVariant.quantity + body.quantity;
    } else if (parameter === "sub") {
      // Prevent negative quantities

      if(existingProductVariant.quantity>= body.quantity){
        newQuantity = existingProductVariant.quantity - body.quantity;
      }
      // newQuantity = Math.max(0, existingProductVariant.quantity - body.quantity);
    } else {
      return NextResponse.json(
        { message: "Invalid parameter - must be either '+' or '-'" ,parameter},
        { status: 400 }
      );
    }

    const updatedProduct = await prisma.productVariant.update({
      where: { id: productVariantId },
      data: { quantity: newQuantity },
    });

    const existingProduct = await prisma.product.findUnique({
      where: { id: existingProductVariant.productid },
    });
      let newProductQuantity;
    if (parameter === "add") {
      newProductQuantity = Number(existingProduct?.stock_quantity)+ body.quantity;
    } else if (parameter === "sub") {
      // Prevent negative quantities

      if (
        existingProduct &&
       Number(existingProduct?.stock_quantity ) >= body.quantity
      ) {
        newProductQuantity = Number(existingProduct?.stock_quantity)- body.quantity;
      }
    } else {
      return NextResponse.json(
        { message: "Invalid parameter - must be either '+' or '-'" ,parameter},
        { status: 400 }
      );
    }
    const updatedProductVariant = await prisma.product.update({
      where: { id: existingProduct?.id },
      data: {
        stock_quantity:String (newProductQuantity),
      }
    });

    return NextResponse.json({ updatedProduct,updatedProductVariant }, { status: 200 });

  } catch (err: any) {
    console.error("Update error:", err);
    return NextResponse.json(
      { 
        error: "Failed to update product", 
        details: err.message 
      },
      { status: 500 }
    );
  }
}

