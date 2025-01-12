import { prisma } from "../../../../lib/db";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const SECRET_KEY = process.env.JWT_SECRET || "your-secret-key";

export async function POST(req: Request) {
  const { email, password } = await req.json();

  try {
    const user = await prisma.user.findUnique({
      where: {
        email: email,
      },
    });

    if (!user || !(await bcrypt.compare(password, user.password))) {
      return Response.json({ error: "Invalid email or password" },{status: 420});
    }

    const token = jwt.sign({email: user.email }, SECRET_KEY, {
      expiresIn: "1h",
    });

    return Response.json({ message: "Loggedin", token }, { status: 200 });
  } catch (error) {
    return Response.json({ error }, { status: 404 });
  }
}
