import { prisma } from "../../../../lib/db";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";


const SECRET_KEY = process.env.JWT_SECRET || "your-secret-key";

export async function POST(req: Request) {
    const { email, password } = await req.json();

    try {
      const hashedPassword = await bcrypt.hash(password, 10);

      const user = await prisma.user.create({
        data: { email, password: hashedPassword },
      });

      const token = jwt.sign(
        {email: user.email },
        SECRET_KEY,
        { expiresIn: "1h" }
      );

    return  Response.json({ message:"Created",token},{status:200});
    } catch (error) {
        return Response.json({error},{status:404});
    }
}