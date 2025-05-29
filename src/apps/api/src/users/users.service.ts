import * as bcrypt from "bcrypt";
import { prisma } from "../lib/prisma";
import { User } from "../@types/user";
import { Users } from "../generated/prisma";

export class UserService {
  async create(createUserDto: User): Promise<Users> {
    const user = await prisma.users.findUnique({
      where: { email: createUserDto.email },
    });
    if (user) throw new Error("Email já esta sendo usado");

    const hashedPassword = await bcrypt.hash(createUserDto.password, 10);
    return await prisma.users.create({
      data: {
        email: createUserDto.email,
        name: createUserDto.name,
        password: hashedPassword,
      },
      omit:{password:true}
    });
  }

  async findAll(): Promise<Omit<Users, "password">[]> {
    return await prisma.users.findMany({ omit: { password: true } });
  }

  async findOne(id: string): Promise<Omit<Users, "password">> {
    const user = await prisma.users.findUnique({
      where: { id },
      omit: { password: true },
    });
    if (!user) throw new Error("Usuário não encontrado");
    return user;
  }

  async update(
    id: string,
    createUserDto: User
  ): Promise<Omit<Users, "password">> {
    const user = await prisma.users.findUnique({
      where: { id },
    });
    if (!user) throw new Error("Usuário não encontrado");
    return await prisma.users.update({
      where: { id },
      data: { ...createUserDto },
      omit: { password: true },
    });
  }

  async remove(id: string): Promise<Omit<Users, "password">> {
    const user = await prisma.users.findUnique({
      where: { id },
    });
    if (!user) throw new Error("Usuário não encontrado");
    return await prisma.users.delete({
      where: { id },
      omit: { password: true },
    });
  }
}
