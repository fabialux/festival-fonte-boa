const form = document.getElementById("cadastroForm");
const mensagem = document.getElementById("mensagemCadastro");
const cpfInput = document.getElementById("cpf");

function formatarCPF(valor) {
  return valor
    .replace(/\D/g, "")
    .replace(/(\d{3})(\d)/, "$1.$2")
    .replace(/(\d{3})(\d)/, "$1.$2")
    .replace(/(\d{3})(\d{1,2})$/, "$1-$2");
}

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

if (cpfInput) {
  cpfInput.addEventListener("input", (e) => {
    e.target.value = formatarCPF(e.target.value);
  });
}

if (form) {
  form.addEventListener("submit", async function (event) {
    event.preventDefault();

    const nome = document.getElementById("nome").value.trim();
    const cidade = document.getElementById("cidade").value.trim();
    const cpf = document.getElementById("cpf").value.trim();
    const boi = document.getElementById("boi").value;

    console.log({ nome, cidade, cpf, boi });

    if (!nome || !cidade || !cpf || !boi) {
      mensagem.textContent = "Preencha todos os campos.";
      mensagem.style.color = "#ffcc00";
      return;
    }

    if (!validarCPF(cpf)) {
      mensagem.textContent = "CPF inválido.";
      mensagem.style.color = "#ff4d4f";
      return;
    }

    try {
      const resposta = await fetch("http://localhost:3000/api/torcedores", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ nome, cidade, cpf, boi }),
      });

      const dados = await resposta.json();
      console.log("Resposta do backend:", dados);

      if (!resposta.ok) {
        mensagem.textContent = dados.error || "Erro ao cadastrar.";
        mensagem.style.color = "#ff4d4f";
        return;
      }

      mensagem.textContent = `Cadastro realizado com sucesso! Torcedor do ${
        boi === "tiraprosa" ? "Tira-Prosa" : "Corajoso"
      }.`;
      mensagem.style.color = "#22c55e";

      form.reset();
    } catch (error) {
      console.error("Erro ao enviar cadastro:", error);
      mensagem.textContent = "Não foi possível conectar ao servidor.";
      mensagem.style.color = "#ff4d4f";
    }
  });
}