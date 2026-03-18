const express = require("express");
const router = express.Router();

const {
  criarTorcedor,
  listarRanking,
} = require("../controllers/torcedores.controller");

router.post("/torcedores", criarTorcedor);
router.get("/ranking", listarRanking);

module.exports = router;