import { Router } from "express";
import * as controller from "./relatorios.controller";

const router = Router();

// GET /aeronaves/:id/relatorio
// Nota: O :id aqui representa o ID do Projeto/Unidade da aeronave
router.get(
  "/aeronaves/:id",
  controller.getRelatorio
);

export default router;