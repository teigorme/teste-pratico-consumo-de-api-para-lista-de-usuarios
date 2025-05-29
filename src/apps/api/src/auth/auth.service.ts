import * as bcrypt from "bcrypt";
import { prisma } from "../lib/prisma";
import { Auth } from "../@types/auth";
import { User } from "../@types/user";
import { sign } from "jsonwebtoken";
import { UserService } from "../users/users.service";
import { JWT } from "../@types/token";
import { Users } from "../generated/prisma";

export class AuthService {
  private readonly jwtSecret: string;

  constructor() {
    this.jwtSecret = process.env.JWT_SECRET || "defaultSecret";
  }
  async login(createAuthDto: Auth): Promise<JWT> {
    const user = await prisma.users.findUnique({
      where: { email: createAuthDto.email },
    });

    if (!user || !(await bcrypt.compare(createAuthDto.password, user.password)))
      throw new Error("Credencias inválidas");
    return {
      token: sign({ id: user.id }, this.jwtSecret),
    };
  }
  async register(createUserDto: User): Promise<Omit<Users, "password">> {
    const data = new UserService().create(createUserDto);
    return data;
  }
  async profile(id: string): Promise<Omit<Users, "password">> {
    const data = new UserService().findOne(id);
    return data;
  }
}
