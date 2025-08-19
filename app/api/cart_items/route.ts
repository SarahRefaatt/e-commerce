import { Prisma, PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";
const prisma = new PrismaClient();

export async function POST(req: Request) {
  const { searchParams } = new URL(req.url);
  const cartId = Number(searchParams.get("cartId"));

  if (!cartId || isNaN(cartId)) {
    return NextResponse.json(
      { error: "Valid cartId is required as query parameter" },
      { status: 400 }
    );
  }

  try {
    const { productId, variantId, quantity } = await req.json();

    if (!productId || !quantity) {
      return NextResponse.json(
        { error: "productId and quantity are required" },
        { status: 400 }
      );
    }

    const numProductId = Number(productId);
    const numVariantId = variantId ? Number(variantId) : null;
    const numQuantity = Number(quantity);

    // Check if cart exists
    const cartExists = await prisma.cart.findUnique({
      where: { id: cartId },
    });
    if (!cartExists) {
      return NextResponse.json({ error: "Cart not found" }, { status: 404 });
    }

    // Check if product exists
    const product = await prisma.product.findUnique({
      where: { id: numProductId },
      include: { productVariant: true },
    });
    if (!product) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }

    // Variant validation
    if (product.productVariant.length > 0 && !variantId) {
      return NextResponse.json(
        {
          error: "Variant selection required",
          variants: product.productVariant,
        },
        { status: 400 }
      );
    }

    if (variantId) {
      const variant = await prisma.productVariant.findFirst({
        where: {
          id: numVariantId as number,
          productid: numProductId,
        },
      });
      if (!variant) {
        return NextResponse.json(
          { error: "Invalid variant for this product" },
          { status: 400 }
        );
      }
      if (variant.quantity < numQuantity) {
        return NextResponse.json(
          { error: "Insufficient stock", available: variant.quantity },
          { status: 400 }
        );
      }
    }

    // Upsert cart item
    const upsertData = {
      cartId,
      productId: numProductId,
      quantity: numQuantity,
      ...(numVariantId !== null ? { variantId: numVariantId } : {}),
    };

    const cartItem = await prisma.cartItem.upsert({
      where: {
        cart_product_variant_unique: {
          cartId,
          productId: numProductId,
          variantId: numVariantId !== null ? numVariantId : 0, // Use a default value (e.g., 0) for non-variant items
        },
      },
      update: {
        quantity: { increment: numQuantity },
      },
      create: upsertData,
    });

    // Update stock if variant exists
    if (numVariantId !== null) {
      await prisma.productVariant.update({
        where: { id: numVariantId },
        data: { quantity: { decrement: numQuantity } },
      });
    }

    return NextResponse.json(cartItem);
  } catch (error) {
    console.error("Detailed error:", error);
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      return NextResponse.json(
        { error: "Database error", details: error.meta },
        { status: 400 }
      );
    }
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const idParam = searchParams.get("id");

    if (idParam !== null) {
      const cartItemsId = parseInt(idParam);

      if (cartItemsId) {
        const cartItems = await prisma.cartItem.findUnique({
          where: {
            id: cartItemsId,
          },
        });

        return NextResponse.json({ cartItems }, { status: 200 });
      }
    } else {
      const cartItemss = await prisma.cartItem.findMany({});
      return NextResponse.json({ cartItemss }, { status: 200 });
    }
  } catch (err: any) {
    return NextResponse.json({ err }, { status: 500 });
  }
}

// export async function PUT(req: Request) {
//   try {
//     const { searchParams } = new URL(req.url);
//     const idParam = searchParams.get("id");
//     const productId = searchParams.get("productId");
//     const variantId = searchParams.get("variantId");

//     const body = await req.json();

//     const {  } = body;

//     if (idParam !== null) {
//       const cartItemsId = parseInt(idParam);

//       const cartItems = await prisma.cartItem.findUnique({
//         where: { id: cartItemsId },
//       });

//       if (productId && variantId && cartItems) {
//         // Check if another item with same product and variant exists

//         const updatedCartItem = await prisma.cartItem.update({
//           where: {
//             id: cartItemsId,
//             productId: parseInt(productId),
//             variantId: parseInt(variantId),
//           },
//           data: {
//             ...body,
//             // Specific handling for quantity decrement
//             // ...(quantity !== undefined && {
//             //   quantity: cartItems.quantity - 1,
//             // }),
//               quantity: cartItems.quantity - 1,

//           },

//         });

//           return NextResponse.json(
//           { updatedCartItem },
//           { status: 200 })
//       } else if (cartItemsId) {
//         const cartItems = await prisma.cartItem.findUnique({
//           where: { id: cartItemsId },
//         });

//         if (!cartItems) {
//           return NextResponse.json(
//             { message: "no such a cartItems with this id" },
//             { status: 404 }
//           );
//         }

//         const updatedcartItems = await prisma.cartItem.update({
//           where: { id: cartItemsId },
//           data: body,
//         });
//         return NextResponse.json({ updatedcartItems }, { status: 201 });
//       } else {
//         return NextResponse.json(
//           { message: "cartItems ID is required" },
//           { status: 400 }
//         );
//       }
//     }
//   } catch (err: any) {
//     return NextResponse.json({ err }, { status: 500 });
//   }
// }
export async function PUT(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const idParam = searchParams.get("cartId");
    const productId = searchParams.get("productId");
    const variantId = searchParams.get("variantId");
    const id = searchParams.get("id");
    const add_remove = searchParams.get("add_remove");

    // Validate required parameters
    if (!idParam || !productId || !id) {
      return NextResponse.json(
        { error: "Missing required parameters (cartId, productId, or id)" },
        { status: 400 }
      );
    }

    const cartId = Number(idParam);
    const itemId = Number(id);

    // Check if cart exists
    const cart = await prisma.cart.findUnique({
      where: {
        id: cartId,
      },
    });

    if (!cart) {
      return NextResponse.json({ error: "Cart not found" }, { status: 404 });
    }

    // Find the cart item
    const cartItem = await prisma.cartItem.findFirst({
      where: {
        id: itemId,
        cartId: cartId,
        productId: Number(productId),
        variantId: variantId ? Number(variantId) : null,
      },
    });

    if (!cartItem) {
      return NextResponse.json(
        { error: "Cart item not found" },
        { status: 404 }
      );
    }

    const product = await prisma.product.findUnique({
      where: {
        id: Number(productId),
      },
    });

    if (add_remove === "remove") {
      const newQuantity = Math.max(0, cartItem.quantity - 1);

      // If quantity is 0, we should probably delete the item instead
      if (newQuantity === 0) {
        await prisma.cartItem.delete({
          where: {
            id: itemId,
          },
        });
        return NextResponse.json(
          { msg: "Item removed from cart" },
          { status: 200 }
        );
      }

      // Update the cart item
      const updatedCartItem = await prisma.cartItem.update({
        where: {
          id: itemId,
        },
        data: {
          quantity: newQuantity,
        },
      });

      return NextResponse.json(
        { msg: "Cart item updated", data: updatedCartItem },
        { status: 200 }
      );
    }
 if (add_remove === "add") {
  // Check if we have enough stock
  if (!product?.stock_quantity || cartItem.quantity >= Number(product.stock_quantity)) {
    return NextResponse.json(
      { 
        error: "Cannot add more items - insufficient stock",
        available: product?.stock_quantity 
      },
      { status: 400 }
    );
  }

  // Increment quantity by 1, but don't exceed stock quantity
  const newQuantity = Math.min(
    cartItem.quantity + 1,
    Number(product.stock_quantity)
  );

  // Update the cart item
  const updatedCartItem = await prisma.cartItem.update({
    where: {
      id: itemId,
    },
    data: {
      quantity: newQuantity,
    },
  });

  return NextResponse.json(
    { msg: "Cart item updated", data: updatedCartItem },
    { status: 200 }
  );
}
    // Don't allow quantity to go below 0
  } catch (err: any) {
    console.error("Error updating cart item:", err);
    return NextResponse.json(
      { error: err.message || "Failed to update cart item" },
      { status: 500 }
    );
  }
}
