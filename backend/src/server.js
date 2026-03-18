const express = require("express");
const cors = require("cors");
require("dotenv").config();

const torcedoresRoutes = require("./routes/torcedores.routes");

const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Backend do Festival de Fonte Boa rodando!");
});

app.use("/api", torcedoresRoutes);

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});