document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('registroForm');
    const dataHoraInput = document.getElementById('dataHoraEvento');
    const livroInput = document.getElementById('livro');
    const capituloInput = document.getElementById('capitulo');
    const versiculoInput = document.getElementById('versiculo');
    const responsavelInput = document.getElementById('anciaoResponsavel');
    const cidadeInput = document.getElementById('cidade');
    const casaOracaoInput = document.getElementById('casaOracao');
    const irmaoCountSpan = document.getElementById('irmaoCount');
    const irmaCountSpan = document.getElementById('irmaCount');
  
    let irmaoCount = 0;
    let irmaCount = 0;
  
    const irmaoIncrementBtn = document.getElementById('irmaoIncrement');
    const irmaoDecrementBtn = document.getElementById('irmaoDecrement');
    const irmaIncrementBtn = document.getElementById('irmaIncrement');
    const irmaDecrementBtn = document.getElementById('irmaDecrement');
  
    function atualizarContadores() {
      irmaoCountSpan.textContent = irmaoCount;
      irmaCountSpan.textContent = irmaCount;
    }
  
    irmaoIncrementBtn.addEventListener('click', () => {
      irmaoCount++;
      atualizarContadores();
    });
    irmaoDecrementBtn.addEventListener('click', () => {
      if (irmaoCount > 0) {
        irmaoCount--;
        atualizarContadores();
      }
    });
    irmaIncrementBtn.addEventListener('click', () => {
      irmaCount++;
      atualizarContadores();
    });
    irmaDecrementBtn.addEventListener('click', () => {
      if (irmaCount > 0) {
        irmaCount--;
        atualizarContadores();
      }
    });
  
    let registros = JSON.parse(localStorage.getItem('registrosSantaCeia')) || [];
  
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const dataHora = dataHoraInput.value;
      const livro = livroInput.value;
      const capitulo = capituloInput.value;
      const versiculo = versiculoInput.value.trim();
      const responsavel = responsavelInput.value.trim();
      const cidade = cidadeInput.value.trim();
      const casaOracao = casaOracaoInput.value.trim();
      if (!dataHora || livro === '' || capitulo === '' || versiculo === '' || responsavel === '' || cidade === '' || casaOracao === '') return;
  
      const novoRegistro = {
        id: Date.now(),
        data: new Date(dataHora).toISOString(),
        livro,
        capitulo,
        versiculo,
        responsavel,
        cidade,
        casaOracao,
        irmao: irmaoCount,
        irma: irmaCount
      };
  
      registros.push(novoRegistro);
      localStorage.setItem('registrosSantaCeia', JSON.stringify(registros));
      form.reset();
      irmaoCount = 0;
      irmaCount = 0;
      atualizarContadores();
      alert('Registro salvo com sucesso!');
    });
  });
  