async function carregarRanking() {
  try {
    const resposta = await fetch("http://localhost:3000/api/ranking");
    const dados = await resposta.json();

    const tira = Number(dados.tiraprosa || 0);
    const cora = Number(dados.corajoso || 0);
    const total = tira + cora;

    const percentTira = total > 0 ? Math.round((tira / total) * 100) : 50;
    const percentCora = total > 0 ? Math.round((cora / total) * 100) : 50;
    const diferenca = Math.abs(tira - cora);

    const elTira = document.getElementById("rankingTiraProsa");
    const elCora = document.getElementById("rankingCorajoso");
    const elPercentTira = document.getElementById("percentTiraProsa");
    const elPercentCora = document.getElementById("percentCorajoso");
    const elBarTira = document.getElementById("barTiraProsa");
    const elBarCora = document.getElementById("barCorajoso");
    const elTotal = document.getElementById("rankingTotal");
    const elDiferenca = document.getElementById("rankingDiferenca");
    const elLiderNome = document.getElementById("liderNome");
    const elLiderTexto = document.getElementById("liderTexto");

    if (elTira) elTira.textContent = tira;
    if (elCora) elCora.textContent = cora;

    if (elPercentTira) elPercentTira.textContent = `${percentTira}%`;
    if (elPercentCora) elPercentCora.textContent = `${percentCora}%`;

    if (elBarTira) elBarTira.style.width = `${percentTira}%`;
    if (elBarCora) elBarCora.style.width = `${percentCora}%`;

    if (elTotal) elTotal.textContent = total;
    if (elDiferenca) elDiferenca.textContent = diferenca;

    if (elLiderNome && elLiderTexto) {
      if (tira > cora) {
        elLiderNome.textContent = "Tira-Prosa";
        elLiderTexto.textContent = `O Tira-Prosa está na frente com ${diferenca} torcedor(es) de vantagem.`;
      } else if (cora > tira) {
        elLiderNome.textContent = "Corajoso";
        elLiderTexto.textContent = `O Corajoso está liderando com ${diferenca} torcedor(es) de vantagem.`;
      } else {
        elLiderNome.textContent = "Empate";
        elLiderTexto.textContent = "As duas torcidas estão empatadas neste momento.";
      }
    }
  } catch (error) {
    console.error("Erro ao carregar ranking:", error);
  }
}

carregarRanking();
setInterval(carregarRanking, 5000);