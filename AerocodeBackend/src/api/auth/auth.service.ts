import { prisma } from '../../db/prisma';
import bcrypt from "bcrypt";
import jwt from 'jsonwebtoken';
import { LoginInput, RegisterInput } from '../../schemas/auth.schema';
import { env } from '../../env';

const JWT_SECRET = env.JWT_SECRET;
const JWT_EXPIRES = env.JWT_EXPIRES as jwt.SignOptions['expiresIn'];
const SALT_ROUNDS = 10;

// --- Registrar usuário ---
export const register = async (data: RegisterInput) => {
  const existing = await prisma.colaborador.findUnique({
    where: { usuario: data.usuario },
  });

  if (existing) throw new Error('Usuário já existe');

  const hashedPassword = await bcrypt.hash(data.senha, SALT_ROUNDS);

  const user = await prisma.colaborador.create({
    data: {
      nome: data.nome,
      telefone: data.telefone,
      endereco: data.endereco,
      usuario: data.usuario,
      senha: hashedPassword,
      nivelAcesso: data.nivelAcesso,
    },
  });

  const token = jwt.sign(
    {
      id: user.id,
      usuario: user.usuario,
      nivelAcesso: user.nivelAcesso,
    },
    JWT_SECRET,
    { expiresIn: JWT_EXPIRES }
  );

  return { user, token };
};

// --- Login usuário ---
export const login = async (data: LoginInput) => {
  const user = await prisma.colaborador.findUnique({
    where: { usuario: data.usuario },
  });

  if (!user) throw new Error('Usuário não encontrado');

  const isValid = await bcrypt.compare(data.senha, user.senha);
  if (!isValid) throw new Error('Senha incorreta');

  const token = jwt.sign(
    {
      id: user.id,
      usuario: user.usuario,
      nivelAcesso: user.nivelAcesso,
    },
    JWT_SECRET,
    { expiresIn: JWT_EXPIRES }
  );

  return { user, token };
};

// --- Buscar usuário por ID ---
export const findUserById = async (id: number) => {
  return prisma.colaborador.findUnique({
    where: { id }
  });
};
