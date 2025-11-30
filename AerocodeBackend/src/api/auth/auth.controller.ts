import { Request, Response } from 'express';
import * as authService from './auth.service';

export const register = async (req: Request, res: Response) => {
  try {
    const user = await authService.register(req.body);
    res.status(201).json({ message: 'Usuário criado', user });
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
};

export const login = async (req: Request, res: Response) => {
  try {
    const { user, token } = await authService.login(req.body);
    sendAuthCookie(res, token);
    res.status(200).json({ message: "Logado com sucesso", user });
  } catch (error: any) {
    res.status(401).json({ error: error.message });
  }
};

export const logout = (req: Request, res: Response) => {
  res.clearCookie("auth", {
    httpOnly: true,
    secure: false,
    sameSite: "strict",
  });
  res.json({ message: "Logout feito com sucesso" });
};

export const me = async (req: Request, res: Response) => {
  try {
    const userCookies = req.user;

    if (!userCookies) return res.status(401).json({ error: "Não autenticado" });

    const user = await authService.findUserById(userCookies.id);

    if (!user) return res.status(404).json({ error: "Usuário não encontrado" });

    res.json({ id: user.id, nome: user.nome, usuario: user.usuario, nivelAcesso: user.nivelAcesso });
  } catch {
    res.status(401).json({ error: "Token inválido ou expirado" });
  }
};

const sendAuthCookie = (res: Response, token: string) => {
  res.cookie("auth", token, {
    httpOnly: true,
    secure: false,
    sameSite: "lax",
    maxAge: 1000 * 60 * 60 * 8
  });
};
