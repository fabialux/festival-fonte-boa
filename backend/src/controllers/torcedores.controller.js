const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

function validarCPF(cpf) {
  cpf = cpf.replace(/\D/g, "");

  if (cpf.length !== 11) return false;
  if (/^(\d)\1+$/.test(cpf)) return false;

  let soma = 0;
  for (let i = 0; i < 9; i++) {
    soma += Number(cpf.charAt(i)) * (10 - i);
  }

  let resto = (soma * 10) % 11;
  if (resto === 10) resto = 0;
  if (resto !== Number(cpf.charAt(9))) return false;

  soma = 0;
  for (let i = 0; i < 10; i++) {
    soma += Number(cpf.charAt(i)) * (11 - i);
  }

  resto = (soma * 10) % 11;
  if (resto === 10) resto = 0;
  if (resto !== Number(cpf.charAt(10))) return false;

  return true;
}

async function criarTorcedor(req, res) {
  try {
    const { nome, cidade, cpf, boi } = req.body;

    if (!nome || !cidade || !cpf || !boi) {
      return res.status(400).json({ error: "Preencha todos os campos." });
    }

    if (!validarCPF(cpf)) {
      return res.status(400).json({ error: "CPF inválido." });
    }

    const cpfLimpo = cpf.replace(/\D/g, "");

    const cpfExistente = await prisma.torcedor.findUnique({
      where: { cpf: cpfLimpo },
    });

    if (cpfExistente) {
      return res.status(400).json({ error: "Este CPF já está cadastrado." });
    }

    const novoTorcedor = await prisma.torcedor.create({
  data: {
    nome,
    cidade,
    cpf: cpfLimpo,
    boi,
  },
});

    return res.status(201).json(novoTorcedor);
  } catch (error) {
    console.error("Erro ao criar torcedor:", error);
    return res.status(500).json({ error: "Erro interno ao cadastrar torcedor." });
  }
}

async function listarRanking(req, res) {
  try {
    const tiraProsa = await prisma.torcedor.count({
      where: { boi: "tiraprosa" },
    });

    const corajoso = await prisma.torcedor.count({
      where: { boi: "corajoso" },
    });

    return res.json({
      tiraprosa: tiraProsa,
      corajoso: corajoso,
      total: tiraProsa + corajoso,
    });
  } catch (error) {
    console.error("Erro ao buscar ranking:", error);
    return res.status(500).json({ error: "Erro interno ao buscar ranking." });
  }
}

module.exports = {
  criarTorcedor,
  listarRanking,
};