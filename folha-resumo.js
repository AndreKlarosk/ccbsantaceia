document.addEventListener('DOMContentLoaded', () => {
    // Carrega os registros armazenados no Local Storage
    let registros = JSON.parse(localStorage.getItem('registrosSantaCeia')) || [];
    const registroSelect = document.getElementById('registroSelect');
    const folhaContainer = document.getElementById('folhaContainer');
    const imprimirBtn = document.getElementById('imprimirFolhaBtn');
  
    // Preenche o dropdown (selecionando data e ancião para identificação)
    registros.forEach(registro => {
      const option = document.createElement('option');
      option.value = registro.id;
      option.textContent = `${new Date(registro.data).toLocaleString()} - ${registro.responsavel}`;
      registroSelect.appendChild(option);
    });
  
    // Ao selecionar um registro, preenche os campos da folha
    registroSelect.addEventListener('change', () => {
      const id = parseInt(registroSelect.value);
      const registro = registros.find(r => r.id === id);
  
      if (registro) {
        document.getElementById('resumoData').textContent = new Date(registro.data).toLocaleString();
        document.getElementById('resumoLivro').textContent = registro.livro;
        document.getElementById('resumoCapitulo').textContent = registro.capitulo;
        document.getElementById('resumoVersiculo').textContent = registro.versiculo;
        document.getElementById('resumoAnciao').textContent = registro.responsavel;
        document.getElementById('resumoCidade').textContent = registro.cidade;
        document.getElementById('resumoCasa').textContent = registro.casaOracao;
        document.getElementById('resumoIrmao').textContent = registro.irmao;
        document.getElementById('resumoIrma').textContent = registro.irma;
  
        // Calcula o total
        const total = parseInt(registro.irmao) + parseInt(registro.irma);
        document.getElementById('resumoTotal').textContent = total;
  
        folhaContainer.style.display = 'block';
        imprimirBtn.style.display = 'inline-block';
      } else {
        folhaContainer.style.display = 'none';
        imprimirBtn.style.display = 'none';
      }
    });
  
    // Ao clicar em imprimir, abre uma nova janela maximizável com a área 70x100mm
    imprimirBtn.addEventListener('click', () => {
      const folhaHTML = `
        <html>
        <head>
          <title>Impressão Folha Resumo</title>
          <style>
            @page {
              size: 70mm 70mm;
              margin: 2mm;
            }
            body {
              margin: 0;
              padding: 0;
              box-sizing: border-box;
              display: flex;
              align-items: center;
              justify-content: center;
            }
            #folhaContainer {
              width: 70mm;
              height: 60mm;
              border: 1px solid #333;
              padding: 2mm;
              box-sizing: border-box;
              background-color: #fff;
              text-align: center;
            }
            .campo {
              font-size: 10pt;
              margin-bottom: 5px;
            }
            .campo strong {
              margin-right: 2px;
            }
          </style>
        </head>
        <body>
          ${folhaContainer.outerHTML}
        </body>
        </html>
      `;
  
      // Abre uma nova janela e injeta o HTML da folha
      const printWindow = window.open('', '', 'resizable=yes,fullscreen=yes');
      printWindow.document.open();
      printWindow.document.write(folhaHTML);
      printWindow.document.close();
  
      // Maximiza a janela
      printWindow.moveTo(0, 0);
      printWindow.resizeTo(screen.availWidth, screen.availHeight);
  
      printWindow.focus();
      printWindow.print();
      printWindow.close();
    });
  });
  