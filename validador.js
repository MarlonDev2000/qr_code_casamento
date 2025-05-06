const statusDiv = document.getElementById("status");
const startButton = document.getElementById("start-button");
const readerDiv = document.getElementById("reader");

let html5QrCode;

function validarQRCode(codigo) {
  const convidado = convidados.find(c => c.codigo === codigo.trim());

  if (!convidado) {
    statusDiv.textContent = "❌ Convite inválido!";
    statusDiv.className = "status invalido";
    return;
  }

  if (convidado.validado) {
    statusDiv.textContent = `⚠️ ${convidado.nome} já fez check-in.`;
    statusDiv.className = "status invalido";
    return;
  }

  convidado.validado = true;
  statusDiv.textContent = `✅ Bem-vindo(a), ${convidado.nome}!`;
  statusDiv.className = "status valido";
}

startButton.addEventListener("click", async () => {
  statusDiv.textContent = "Solicitando acesso à câmera...";

  try {
    const devices = await Html5Qrcode.getCameras();

    if (devices.length === 0) {
      statusDiv.textContent = "❌ Nenhuma câmera encontrada!";
      return;
    }

    // Procurar pela câmera traseira
    const rearCamera = devices.find(device => device.facing === "environment");

    if (!rearCamera) {
      statusDiv.textContent = "❌ Não foi possível encontrar a câmera traseira.";
      return;
    }

    startButton.style.display = "none";
    readerDiv.style.display = "block";

    html5QrCode = new Html5Qrcode("reader");

    await html5QrCode.start(
      rearCamera.id,
      { fps: 10, qrbox: 250 },
      decodedText => validarQRCode(decodedText),
      error => {} // ignora erros pequenos de leitura
    );

    statusDiv.textContent = "📷 Aguardando leitura...";
  } catch (err) {
    statusDiv.textContent = `❌ Erro ao acessar câmera: ${err.message}`;
  }
});
