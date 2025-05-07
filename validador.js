const statusDiv = document.getElementById("status");
const startButton = document.getElementById("start-button");
const cameraSelect = document.getElementById("camera-select");
const readerDiv = document.getElementById("reader");

let html5QrCode;
let devices = [];

// Definindo um único QR Code para todos os convidados
const qrCode = "CONVITE123456";  // O QR Code será o mesmo para todos

function validarQRCode(codigo) {
  // Verificando se o código escaneado é o mesmo que o convite
  if (codigo.trim() !== qrCode) {
    statusDiv.textContent = "❌ Convite inválido!";
    statusDiv.className = "status invalido";
    return;
  }

  // Se for o código correto, mostrar o nome do convidado (pode ser nome genérico)
  statusDiv.textContent = `✅ Bem-vindo(a), Convidado(a)!`;
  statusDiv.className = "status valido";
}

startButton.addEventListener("click", async () => {
  statusDiv.textContent = "Solicitando acesso à câmera...";

  try {
    devices = await Html5Qrcode.getCameras();

    if (devices.length === 0) {
      statusDiv.textContent = "❌ Nenhuma câmera encontrada!";
      return;
    }

    // Popular o menu de seleção de câmera
    cameraSelect.innerHTML = "<option value=''>Selecione uma câmera</option>"; // resetar lista
    devices.forEach((device, index) => {
      const option = document.createElement("option");
      option.value = device.id;
      option.text = device.label || `Câmera ${index + 1}`;
      cameraSelect.appendChild(option);
    });

    // Mostrar o botão de start
    startButton.style.display = "none";
    cameraSelect.style.display = "block";

    statusDiv.textContent = "📷 Escolha a câmera e clique em 'Iniciar'.";
  } catch (err) {
    statusDiv.textContent = `❌ Erro ao acessar câmeras: ${err.message}`;
  }
});

cameraSelect.addEventListener("change", async () => {
  const cameraId = cameraSelect.value;
  
  if (!cameraId) {
    statusDiv.textContent = "❌ Nenhuma câmera selecionada!";
    return;
  }

  statusDiv.textContent = "📷 Iniciando scanner...";

  // Selecionar a câmera escolhida
  const selectedCamera = devices.find(device => device.id === cameraId);

  if (selectedCamera) {
    startButton.style.display = "none";
    readerDiv.style.display = "block";

    html5QrCode = new Html5Qrcode("reader");

    try {
      await html5QrCode.start(
        selectedCamera.id,
        { fps: 10, qrbox: 250 },
        decodedText => validarQRCode(decodedText),
        error => {} // ignora erros pequenos de leitura
      );

      statusDiv.textContent = "📷 Aguardando leitura...";
    } catch (err) {
      statusDiv.textContent = `❌ Erro ao iniciar o scanner: ${err.message}`;
    }
  }
});
