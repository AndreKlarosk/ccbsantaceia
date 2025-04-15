document.addEventListener('DOMContentLoaded', () => {
    let registros = JSON.parse(localStorage.getItem('registrosSantaCeia')) || [];
  
    // Função para ordenar registros por data (cronológica)
    function ordenarRegistros(arr) {
      return arr.sort((a, b) => new Date(a.data) - new Date(b.data));
    }
  
    // Lista de cores pastel para os registros (alternando por linha)
    const pastelColors = ["#FFB3BA", "#FFDFBA", "#FFFFBA", "#BAFFC9", "#BAE1FF"];
  
    // Atualiza a tabela de relatório
    function atualizarRelatorio(registrosFiltrados = registros) {
      const tbody = document.querySelector('#relatorioTable tbody');
      tbody.innerHTML = '';
      const registrosOrdenados = ordenarRegistros(registrosFiltrados);
      registrosOrdenados.forEach((registro, index) => {
        const bgColor = pastelColors[index % pastelColors.length];
        const tr = document.createElement('tr');
        tr.style.backgroundColor = bgColor;
        tr.innerHTML = `
          <td>${new Date(registro.data).toLocaleString()}</td>
          <td>${registro.livro}</td>
          <td>${registro.capitulo}</td>
          <td>${registro.versiculo}</td>
          <td>${registro.responsavel}</td>
          <td>${registro.cidade}</td>
          <td>${registro.casaOracao}</td>
          <td>${registro.irmao}</td>
          <td>${registro.irma}</td>
          <td>
            <button class="btn btn-sm btn-primary editar-btn" data-id="${registro.id}">Editar</button>
            <button class="btn btn-sm btn-danger excluir-btn" data-id="${registro.id}">Excluir</button>
          </td>
        `;
        tbody.appendChild(tr);
      });
  
      // Configura os eventos de exclusão
      document.querySelectorAll('.excluir-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
          const id = parseInt(e.target.getAttribute('data-id'));
          registros = registros.filter(r => r.id !== id);
          localStorage.setItem('registrosSantaCeia', JSON.stringify(registros));
          atualizarRelatorio();
        });
      });
  
      // Configura os eventos de edição
      document.querySelectorAll('.editar-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
          const id = parseInt(e.target.getAttribute('data-id'));
          const registro = registros.find(r => r.id === id);
          if (registro) {
            document.getElementById('editId').value = registro.id;
            const dt = new Date(registro.data);
            const localDt = dt.toISOString().slice(0,16);
            document.getElementById('editDataHora').value = localDt;
            document.getElementById('editLivro').value = registro.livro;
            document.getElementById('editCapitulo').value = registro.capitulo;
            document.getElementById('editVersiculo').value = registro.versiculo;
            document.getElementById('editAnciaoResponsavel').value = registro.responsavel;
            document.getElementById('editCidade').value = registro.cidade;
            document.getElementById('editCasaOracao').value = registro.casaOracao;
            editIrmaoCount = registro.irmao;
            editIrmaCount = registro.irma;
            document.getElementById('editIrmaoCount').textContent = editIrmaoCount;
            document.getElementById('editIrmaCount').textContent = editIrmaCount;
            editModal.show();
          }
        });
      });
    }
  
    atualizarRelatorio();
  
    // Filtro por data
    document.getElementById('filtroData').addEventListener('input', (e) => {
      const dataFiltro = e.target.value;
      if (dataFiltro) {
        const registrosFiltrados = registros.filter(registro => {
          const dataRegistro = new Date(registro.data).toISOString().split('T')[0];
          return dataRegistro === dataFiltro;
        });
        atualizarRelatorio(registrosFiltrados);
      } else {
        atualizarRelatorio();
      }
    });
  
    // Edição via modal
    const editModalEl = document.getElementById('editModal');
    const editModal = new bootstrap.Modal(editModalEl);
    let editIrmaoCount = 0;
    let editIrmaCount = 0;
  
    const editIrmaoIncrementBtn = document.getElementById('editIrmaoIncrement');
    const editIrmaoDecrementBtn = document.getElementById('editIrmaoDecrement');
    const editIrmaIncrementBtn = document.getElementById('editIrmaIncrement');
    const editIrmaDecrementBtn = document.getElementById('editIrmaDecrement');
  
    editIrmaoIncrementBtn.addEventListener('click', () => {
      editIrmaoCount++;
      document.getElementById('editIrmaoCount').textContent = editIrmaoCount;
    });
    editIrmaoDecrementBtn.addEventListener('click', () => {
      if (editIrmaoCount > 0) {
        editIrmaoCount--;
        document.getElementById('editIrmaoCount').textContent = editIrmaoCount;
      }
    });
    editIrmaIncrementBtn.addEventListener('click', () => {
      editIrmaCount++;
      document.getElementById('editIrmaCount').textContent = editIrmaCount;
    });
    editIrmaDecrementBtn.addEventListener('click', () => {
      if (editIrmaCount > 0) {
        editIrmaCount--;
        document.getElementById('editIrmaCount').textContent = editIrmaCount;
      }
    });
  
    document.getElementById('editForm').addEventListener('submit', (e) => {
      e.preventDefault();
      const id = parseInt(document.getElementById('editId').value);
      const dataHoraEdit = document.getElementById('editDataHora').value;
      const livroEdit = document.getElementById('editLivro').value;
      const capituloEdit = document.getElementById('editCapitulo').value;
      const versiculoEdit = document.getElementById('editVersiculo').value.trim();
      const responsavelEdit = document.getElementById('editAnciaoResponsavel').value.trim();
      const cidadeEdit = document.getElementById('editCidade').value.trim();
      const casaOracaoEdit = document.getElementById('editCasaOracao').value.trim();
      if (!dataHoraEdit || livroEdit === '' || capituloEdit === '' || versiculoEdit === '' || responsavelEdit === '' || cidadeEdit === '' || casaOracaoEdit === '') return;
  
      registros = registros.map(registro => {
        if (registro.id === id) {
          return {
            ...registro,
            data: new Date(dataHoraEdit).toISOString(),
            livro: livroEdit,
            capitulo: capituloEdit,
            versiculo: versiculoEdit,
            responsavel: responsavelEdit,
            cidade: cidadeEdit,
            casaOracao: casaOracaoEdit,
            irmao: editIrmaoCount,
            irma: editIrmaCount
          };
        }
        return registro;
      });
      localStorage.setItem('registrosSantaCeia', JSON.stringify(registros));
      atualizarRelatorio();
      editModal.hide();
    });
  
    // Geração do relatório PDF com cores claras e tom pastel para cada registro
    document.getElementById('gerarPdfBtn').addEventListener('click', () => {
      registros = JSON.parse(localStorage.getItem('registrosSantaCeia')) || [];
      const pdfContainer = document.getElementById('pdfReport');
      pdfContainer.style.display = 'block';
      pdfContainer.innerHTML = `
        <div class="pdf-header" style="background-color: #f7f7f7; color: #333; padding: 20px; border-radius: 8px; text-align: center; margin-bottom: 30px;">
          <h2 style="margin: 0; font-size: 24px;">Relatório da Santa Ceia</h2>
          <p style="margin: 5px 0 0; font-size: 14px;">${new Date().toLocaleString()}</p>
        </div>
        <table style="width: 100%; border-collapse: collapse; font-size: 0.9rem;">
          <thead>
            <tr style="background-color: #e8f4f8;">
              <th style="border: 1px solid #ddd; padding: 8px;">Data</th>
              <th style="border: 1px solid #ddd; padding: 8px;">Livro</th>
              <th style="border: 1px solid #ddd; padding: 8px;">Capítulo</th>
              <th style="border: 1px solid #ddd; padding: 8px;">Versículo</th>
              <th style="border: 1px solid #ddd; padding: 8px;">Ancião</th>
              <th style="border: 1px solid #ddd; padding: 8px;">Cidade</th>
              <th style="border: 1px solid #ddd; padding: 8px;">Casa de Oração</th>
              <th style="border: 1px solid #ddd; padding: 8px;">Irmão</th>
              <th style="border: 1px solid #ddd; padding: 8px;">Irmã</th>
            </tr>
          </thead>
          <tbody>
            ${ordenarRegistros(registros).map((registro, index) => {
              const bg = pastelColors[index % pastelColors.length];
              return `
                <tr style="background-color: ${bg};">
                  <td style="border: 1px solid #ddd; padding: 8px;">${new Date(registro.data).toLocaleString()}</td>
                  <td style="border: 1px solid #ddd; padding: 8px;">${registro.livro}</td>
                  <td style="border: 1px solid #ddd; padding: 8px;">${registro.capitulo}</td>
                  <td style="border: 1px solid #ddd; padding: 8px;">${registro.versiculo}</td>
                  <td style="border: 1px solid #ddd; padding: 8px;">${registro.responsavel}</td>
                  <td style="border: 1px solid #ddd; padding: 8px;">${registro.cidade}</td>
                  <td style="border: 1px solid #ddd; padding: 8px;">${registro.casaOracao}</td>
                  <td style="border: 1px solid #ddd; padding: 8px;">${registro.irmao}</td>
                  <td style="border: 1px solid #ddd; padding: 8px;">${registro.irma}</td>
                </tr>
              `;
            }).join('')}
          </tbody>
        </table>
      `;
      
      const opt = {
        margin: 10,
        filename: 'Relatorio_Santa_Ceia.pdf',
        image: { type: 'jpeg', quality: 0.98 },
        html2canvas: { scale: 2 },
        jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
      };
      
      html2pdf().set(opt).from(pdfContainer).save().then(() => {
        pdfContainer.style.display = 'none';
      });
    });
  });
  