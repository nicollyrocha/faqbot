import { Request, Response } from "express";
import {
  createAdminToken,
  extractBearerToken,
  isValidAccessKey,
  verifyAdminToken,
} from "../services/adminAuth.service";

type LoginBody = {
  accessKey: string;
};

export async function loginAdmin(
  req: Request<unknown, unknown, LoginBody>,
  res: Response,
) {
  const { accessKey } = req.body;

  if (typeof accessKey !== "string" || !accessKey.trim()) {
    return res.status(400).json({ message: "accessKey é obrigatório" });
  }

  if (!isValidAccessKey(accessKey.trim())) {
    return res.status(401).json({ message: "Acesso de administrador inválido" });
  }

  const token = createAdminToken();

  return res.json({
    token,
  });
}

export async function getAdminSession(req: Request, res: Response) {
  const token = extractBearerToken(req.headers.authorization);

  if (!token || !verifyAdminToken(token)) {
    return res.status(401).json({ message: "Sessão de administrador inválida" });
  }

  return res.json({
    authenticated: true,
  });
}