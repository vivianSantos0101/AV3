import express from "express";

import type MessageResponse from "../interfaces/message-response.js";

import emojis from "./emojis.js";
import aeronaves from "./aeronaves/aeronave.routes.js"
import componentes from "./componentes/componente.routes.js"
import etapas from "./etapas/etapa.routes.js"
import testes from "./testes/testes.routes.js"
import relatorios from "./relatorio/relatorios.routes.js"
import colaboradores from "./colaboradores/colaboradores.routes.js"

const router = express.Router();

router.get<object, MessageResponse>("/", (req, res) => {
  res.json({
    message: "API - 👋🌎🌍🌏",
  });
});

router.use("/emojis", emojis);
router.use("/colaboradores", colaboradores)
router.use("/aeronaves", aeronaves);
router.use("/componentes", componentes);
router.use("/etapas", etapas);
router.use("/testes", testes);
router.use("/relatorios", relatorios);

export default router;
