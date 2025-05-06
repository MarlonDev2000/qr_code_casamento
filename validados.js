const statusDiv = document.getElementById("status");

function validar(codigo) {
  const convidado = convidados.find(c => c.codigo === codigo);

  if (!convidado) {
    statusDiv.textContent = "❌ Convite inválido!";
    statusDiv.className = "status invalido";
    return;
  }

  if (convidado.validado) {
    statusDiv.textContent = `⚠️ Convite já utilizado por ${convidado.nome}.`;
    statusDiv.className = "status invalido";
    return;
  }

  convidado.validado = true;
  statusDiv.textContent = `✅ Bem-vindo(a), ${convidado.nome}!`;
  statusDiv.className = "status valido";
}

window.addEventListener("DOMContentLoaded", () => {
  const qrCodeScanner = new Html5Qrcode("reader");

  qrCodeScanner.start(
    { facingMode: "environment" },
    { fps: 10, qrbox: 250 },
    (decodedText) => {
      qrCodeScanner.stop();
      validar(decodedText.trim());

      setTimeout(() => {
        qrCodeScanner.start(
          { facingMode: "environment" },
          { fps: 10, qrbox: 250 },
          (text) => {
            qrCodeScanner.stop();
            validar(text.trim());
          },
          () => {}
        );
      }, 3000);
    },
    () => {}
  );
});
