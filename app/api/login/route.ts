import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

export  async function POST(req: Request) {
  try {
  
    const body =await req.json();
    const { email, password } = body; 
    
    if (!email || !password) {
      return new Response("Email and password are required", { status: 400 });
    }
    const customer = await prisma.customer.findUnique({
      where: {
        email: email,
        password_hash: password,
      },
    });

    
    if (!customer) {
      return new Response("Invalid email or password", { status: 401 });
    }
    return new Response(JSON.stringify(customer), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
      },
    });
        

  } catch (err: any) {
    console.error("Error during login:", err);
    return new Response("Internal Server Error", { status: 500 });
  }
}
