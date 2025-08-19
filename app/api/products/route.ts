import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";
const prisma = new PrismaClient();

export async function POST(req: Request) {
  try {
    const body = await req.json();

    // Basic validation
    

const product = await prisma.product.create({
  data: {
    name: body.name,
    description: body.description,
    price: body.price,
    stock_quantity: body.stock_quantity,
    image_url: body.image_url,
    brand: body.brand,
    rating: body.rating,
  },
});


    return NextResponse.json({ product }, { status: 201 });
  } catch (err: any) {
    console.error('Product creation error:', err);
    
    // Handle Prisma specific errors
    if (err.code === 'P2002') {
      return NextResponse.json(
        { error: 'A product with this name already exists' },
        { status: 409 }
      );
    }

    return NextResponse.json(
      { error: 'Failed to create product' },
      { status: 500 }
    );
  }
}
export  async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const idParam = searchParams.get("id");


    if (idParam !== null) {
      const productId = parseInt(idParam);

    if (productId) {
      const product = await prisma.product.findUnique({
        where: {
          id: productId,
        },
           include:{
            productVariant:true,
          }

      });

      return NextResponse.json({product},{status:200})
    }

    } else {
      
        const products=await prisma.product.findMany({

          include:{
            productVariant:true,
          }


        })
        return NextResponse.json({products},{status:200})

    }


  } catch (err: any) {
    return NextResponse.json({ err }, { status: 500 });
  }
}


interface UpdateProductData {
  name?: string;
  description?: string;
  price?: string;
  stock_quantity?: string;
  image_url?: string;
  brand?: string;
  rating?: string;
}

export async function PUT(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const idParam = searchParams.get("id");
    const body = await req.json();

    // Validate ID parameter
    if (!idParam) {
      return NextResponse.json(
        { message: "Product ID is required" },
        { status: 400 }
      );
    }

    const productId = parseInt(idParam);
    if (isNaN(productId)) {
      return NextResponse.json(
        { message: "Invalid product ID" },
        { status: 400 }
      );
    }

    // Validate input data
    const updateData: UpdateProductData = {};
    const validationErrors: string[] = [];

    if (body.name !== undefined) {
      if (typeof body.name === 'string' && body.name.trim().length > 0) {
        updateData.name = body.name.trim();
      } else {
        validationErrors.push('Name must be a non-empty string');
      }
    }

    if (body.description !== undefined) {
      if (typeof body.description === 'string') {
        updateData.description = body.description.trim();
      } else {
        validationErrors.push('Description must be a string');
      }
    }

    if (body.price !== undefined) {
      if (typeof body.price === 'string' && !isNaN(parseFloat(body.price))) {
        updateData.price = body.price;
      } else {
        validationErrors.push('Price must be a valid number');
      }
    }

    // if (body.stock_quantity !== undefined) {

      const stockQuantity = await prisma.productVariant.findMany({

        where: {
          productid: productId,
        },
        select: {
          quantity: true,
        },
      });

      if (Array.isArray(stockQuantity) && stockQuantity.length > 0) {
        const totalStock = stockQuantity.reduce((sum, variant) => sum + variant.quantity, 0);
        updateData.stock_quantity = totalStock.toString();
      } else {
        validationErrors.push('Stock quantity must be a valid number');
      }
      // if (typeof body.stock_quantity === 'string' && !isNaN(parseInt(body.stock_quantity))) {
      //   updateData.stock_quantity = body.stock_quantity;
      // } else {
      //   validationErrors.push('Stock quantity must be a valid number');
      // }
    // }

    if (body.image_url !== undefined) {
      if (typeof body.image_url === 'string' && body.image_url.trim().length > 0) {
        updateData.image_url = body.image_url.trim();
      } else {
        validationErrors.push('Image URL must be a valid URL string');
      }
    }

    if (body.brand !== undefined) {
      if (typeof body.brand === 'string' && body.brand.trim().length > 0) {
        updateData.brand = body.brand.trim();
      } else {
        validationErrors.push('Brand must be a non-empty string');
      }
    }

    if (body.rating !== undefined) {
      if (typeof body.rating === 'string' && body.rating >= 0 && body.rating <= 5) {
        updateData.rating = body.rating;
      } else {
        validationErrors.push('Rating must be a number between 0 and 5');
      }
    }

    // Return validation errors if any
    if (validationErrors.length > 0) {
      return NextResponse.json(
        { message: "Validation failed", errors: validationErrors },
        { status: 400 }
      );
    }

    // Check if there's data to update
    if (Object.keys(updateData).length === 0) {
      return NextResponse.json(
        { message: "No valid fields provided for update" },
        { status: 400 }
      );
    }

    // Check if product exists
    const existingProduct = await prisma.product.findUnique({
      where: { id: productId }
    });

    if (!existingProduct) {
      return NextResponse.json(
        { message: "No product found with this ID" },
        { status: 404 }
      );
    }

    // Update the product
    const updatedProduct = await prisma.product.update({
      where: { id: productId },
      data: updateData,
    });

    return NextResponse.json({ 
      message: "Product updated successfully",
      product: updatedProduct 
    }, { status: 200 });

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