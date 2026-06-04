async function entrar() {
  const usuario = document.getElementById("nome").value.trim();
  const senha = document.getElementById("senha").value.trim();

  if (usuario === "" || senha === "") {
    alert("Preencha o usuário e a senha!");
    return;
  }

  const usuariosCadastrados =
    JSON.parse(localStorage.getItem("usuariosCadastrados")) || [];

  const usuarioLocal = usuariosCadastrados.find(function(user) {
    return user.usuario === usuario && user.senha === senha;
  });

  if (usuarioLocal) {
    localStorage.setItem("usuarioLogado", JSON.stringify(usuarioLocal));
    window.location.href = "menu.html";
    return;
  }

  try {
    const resposta = await fetch("https://dummyjson.com/auth/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        username: usuario,
        password: senha
      })
    });

    if (!resposta.ok) {
      alert("Não foi possível fazer login. Usuário ou senha incorretos.");
      return;
    }

    const dados = await resposta.json();

    localStorage.setItem("usuarioLogado", JSON.stringify(dados));
    window.location.href = "menu.html";

  } catch (erro) {
    alert("Erro ao conectar com a API. Verifique sua internet.");
  }
}

function cadastrar() {
  const nome = document.getElementById("cadNome").value.trim();
  const email = document.getElementById("cadEmail").value.trim();
  const senha = document.getElementById("cadSenha").value.trim();

  if (nome === "" || email === "" || senha === "") {
    alert("Preencha todos os campos!");
    return;
  }

  const usuariosCadastrados =
    JSON.parse(localStorage.getItem("usuariosCadastrados")) || [];

  const usuarioExiste = usuariosCadastrados.some(function(user) {
    return user.usuario === nome || user.email === email;
  });

  if (usuarioExiste) {
    alert("Essa conta já existe!");
    return;
  }

  const novoUsuario = {
    usuario: nome,
    email: email,
    senha: senha
  };

  usuariosCadastrados.push(novoUsuario);

  localStorage.setItem(
    "usuariosCadastrados",
    JSON.stringify(usuariosCadastrados)
  );

  alert("Conta criada com sucesso!");

  window.location.href = "login.html";
}

function sair() {
  localStorage.removeItem("usuarioLogado");
  window.location.href = "index.html";
}

function protegerPagina() {
  const usuarioLogado = localStorage.getItem("usuarioLogado");

  if (!usuarioLogado) {
    window.location.href = "login.html";
  }
}

function pegarUsuarioAtual() {
  return JSON.parse(localStorage.getItem("usuarioLogado"));
}

function nomeDoUsuario() {
  const usuario = pegarUsuarioAtual();

  return usuario.usuario || usuario.username || usuario.firstName || "Estudante";
}

function mostrarNotas() {
  const nome = nomeDoUsuario();

  const nota1 = (nome.length % 3) + 7;
  const nota2 = (nome.length % 4) + 6;
  const nota3 = (nome.length % 5) + 5;

  document.getElementById("resultado").innerHTML = `
    <h2>Notas de ${nome}</h2>
    <ul>
      <li>Português: ${nota1.toFixed(1)}</li>
      <li>Matemática: ${nota2.toFixed(1)}</li>
      <li>História: ${nota3.toFixed(1)}</li>
    </ul>
  `;
}

function mostrarExercicios() {
  const nome = nomeDoUsuario();

  document.getElementById("resultado").innerHTML = `
    <h2>Exercícios de ${nome}</h2>
    <ul>
      <li>Português: interpretação de texto</li>
      <li>Matemática: equações simples</li>
      <li>História: Brasil República</li>
    </ul>
  `;
}

function mostrarMedia() {
  const nome = nomeDoUsuario();

  const nota1 = (nome.length % 3) + 7;
  const nota2 = (nome.length % 4) + 6;
  const nota3 = (nome.length % 5) + 5;

  const media = (nota1 + nota2 + nota3) / 3;

  document.getElementById("resultado").innerHTML = `
    <h2>Média de ${nome}</h2>
    <p>Sua média geral é:</p>
    <h1>${media.toFixed(1)}</h1>
  `;
}
function carregarNotas() {
  protegerPagina();

  const nome = nomeDoUsuario();

  const materias = [
    { nome: "Matemática", nota: 8.5 },
    { nome: "Química", nota: 7.8 },
    { nome: "Física", nota: 8.0 },
    { nome: "Português", nota: 9.2 },
    { nome: "Espanhol", nota: 8.7 },
    { nome: "Biologia", nota: 7.5 },
    { nome: "Filosofia", nota: 9.0 },
    { nome: "História", nota: 8.3 }
  ];

  let lista = "";

  materias.forEach(function(materia) {
    lista += `
      <li>
        <strong>${materia.nome}</strong>
        <span>${materia.nota.toFixed(1)}</span>
      </li>
    `;
  });

  document.getElementById("conteudoNotas").innerHTML = `
    <h2>Notas de ${nome}</h2>
    <ul>
      ${lista}
    </ul>
  `;
}

function carregarExercicios() {
  protegerPagina();

  const nome = nomeDoUsuario();

  const exercicios = [
    "Matemática - Equações e porcentagem",
    "Química - Tabela periódica",
    "Física - Leis de Newton",
    "Português - Interpretação de texto",
    "Espanhol - Verbos no presente",
    "Biologia - Células e genética",
    "Filosofia - Ética e sociedade",
    "História - Brasil República"
  ];

  let lista = "";

  exercicios.forEach(function(exercicio) {
    lista += `<li>${exercicio}</li>`;
  });

  document.getElementById("conteudoExercicios").innerHTML = `
    <h2>Exercícios de ${nome}</h2>
    <ul>
      ${lista}
    </ul>
  `;
}

function carregarMedia() {
  protegerPagina();

  const conteudo = document.getElementById("conteudoMedia");

  let html = `
    <h2>Média por matéria</h2>
    <ul>
  `;

  notasPorSemestre.forEach(function(item) {
    const media = (item.primeiroSemestre + item.segundoSemestre) / 2;

    html += `
      <li>
        <strong>${item.materia}</strong>
        <span class="${classeNota(media)}">
          ${media.toFixed(1)}
        </span>
      </li>
    `;
  });

  html += `
    </ul>
  `;

  conteudo.innerHTML = html;
}
function carregarMenu() {
  protegerPagina();

  const dificuldades = materiasAluno
    .filter(materia => materia.nota < 7.5)
    .sort((a, b) => a.nota - b.nota);

  let html = "";

  dificuldades.forEach(function(materia) {
    html += `
      <div class="dificuldade-card">
        <h3>${materia.nome}</h3>
        <p>Nota atual: ${materia.nota.toFixed(1)}</p>

        <button onclick="abrirExerciciosMateria('${materia.nome}', ${materia.categoriaApi})">
          Praticar exercícios
        </button>
      </div>
    `;
  });

  document.getElementById("listaDificuldades").innerHTML = html;
}

function abrirExerciciosMateria(nomeMateria, categoriaApi) {
  localStorage.setItem("materiaSelecionada", nomeMateria);
  localStorage.setItem("categoriaSelecionada", categoriaApi);
  window.location.href = "pesquisar.html";
}
function carregarPesquisaMateria() {
  protegerPagina();

  const categoria = localStorage.getItem("categoriaSelecionada");

  if (categoria) {
    document.getElementById("materiaPesquisa").value = categoria;
  }
}
function carregarPesquisaMateria() {
  protegerPagina();

  const categoria = localStorage.getItem("categoriaSelecionada");

  if (categoria) {
    document.getElementById("materiaPesquisa").value = categoria;
  }
}

function embaralhar(array) {
  return array.sort(() => Math.random() - 0.5);
}

function limparTexto(texto) {
  const txt = document.createElement("textarea");
  txt.innerHTML = texto;
  return txt.value;
}
async function buscarExerciciosAPI() {
  protegerPagina();

  const categoria = document.getElementById("materiaPesquisa").value;
  const dificuldade = document.getElementById("dificuldade").value;
  const resultado = document.getElementById("resultadoApi");

  resultado.innerHTML = "<p>Carregando exercícios...</p>";

  try {
    const url = `https://opentdb.com/api.php?amount=5&category=${categoria}&difficulty=${dificuldade}&type=multiple`;

    const resposta = await fetch(url);
    const dados = await resposta.json();

    let html = "<h2>Exercícios encontrados</h2>";

    dados.results.forEach(function(questao, index) {
      const correta = limparTexto(questao.correct_answer);

      const alternativas = embaralhar([
        questao.correct_answer,
        ...questao.incorrect_answers
      ]);

      html += `
        <div class="questao-card">
          <h3>${index + 1}. ${limparTexto(questao.question)}</h3>

          <div class="alternativas">
            ${alternativas.map(function(alt) {
              const alternativaLimpa = limparTexto(alt);

              return `
                <button class="alternativa" onclick="verificarResposta(this, '${correta.replace(/'/g, "\\'")}')">
                  ${alternativaLimpa}
                </button>
              `;
            }).join("")}
          </div>
        </div>
      `;
    });

    resultado.innerHTML = html;

  } catch (erro) {
    resultado.innerHTML = "<p>Erro ao conectar com a API.</p>";
  }
}

function verificarResposta(botao, respostaCorreta) {
  const card = botao.parentElement;
  const alternativas = card.querySelectorAll(".alternativa");

  alternativas.forEach(function(alternativa) {
    alternativa.disabled = true;

    if (alternativa.innerText.trim() === respostaCorreta.trim()) {
      alternativa.classList.add("correta");
    }
  });

  if (botao.innerText.trim() !== respostaCorreta.trim()) {
    botao.classList.add("errada");
  }
}

const notasPorSemestre = [
  {
    materia: "Matemática",
    primeiroSemestre: 6.2,
    segundoSemestre: 7.4
  },
  {
    materia: "Química",
    primeiroSemestre: 6.8,
    segundoSemestre: 7.1
  },
  {
    materia: "Física",
    primeiroSemestre: 7.0,
    segundoSemestre: 6.5
  },
  {
    materia: "Português",
    primeiroSemestre: 8.5,
    segundoSemestre: 9.0
  },
  {
    materia: "Espanhol",
    primeiroSemestre: 7.9,
    segundoSemestre: 8.3
  },
  {
    materia: "Biologia",
    primeiroSemestre: 6.5,
    segundoSemestre: 7.0
  },
  {
    materia: "Filosofia",
    primeiroSemestre: 8.0,
    segundoSemestre: 8.4
  },
  {
    materia: "História",
    primeiroSemestre: 7.2,
    segundoSemestre: 8.1
  }
];

function carregarPaginaNotas() {
  protegerPagina();
  mostrarMateriasDisponiveis();
  exibirNotas(notasPorSemestre);
}

function mostrarMateriasDisponiveis() {
  const lista = document.getElementById("listaMaterias");

  let html = "";

  notasPorSemestre.forEach(function(item) {
    html += `
      <span class="chip-materia" onclick="selecionarMateria('${item.materia}')">
        ${item.materia}
      </span>
    `;
  });

  lista.innerHTML = html;
}

function selecionarMateria(materia) {
  document.getElementById("pesquisaMateria").value = materia;
  filtrarNotas();
}

function filtrarNotas() {
  const textoBusca = document
    .getElementById("pesquisaMateria")
    .value
    .toLowerCase()
    .trim();

  const semestre = document.getElementById("filtroSemestre").value;

  const resultado = notasPorSemestre.filter(function(item) {
    return item.materia.toLowerCase().includes(textoBusca);
  });

  exibirNotas(resultado, semestre);
}

function classeNota(nota) {
  if (nota >= 8) {
    return "nota-boa";
  }

  if (nota >= 7) {
    return "nota-media";
  }

  return "nota-baixa";
}

function exibirNotas(lista, semestre = "todos") {
  const conteudo = document.getElementById("conteudoNotas");

  if (lista.length === 0) {
    conteudo.innerHTML = `
      <div class="mensagem-vazia">
        <h2>Nenhuma matéria encontrada</h2>
        <p>Verifique o nome digitado e tente novamente.</p>
      </div>
    `;
    return;
  }

  let html = "";

  lista.forEach(function(item) {
    let linhas = "";

    if (semestre === "todos" || semestre === "1") {
      linhas += `
        <div class="nota-linha">
          <span>1º semestre</span>
          <span class="${classeNota(item.primeiroSemestre)}">
            ${item.primeiroSemestre.toFixed(1)}
          </span>
        </div>
      `;
    }

    if (semestre === "todos" || semestre === "2") {
      linhas += `
        <div class="nota-linha">
          <span>2º semestre</span>
          <span class="${classeNota(item.segundoSemestre)}">
            ${item.segundoSemestre.toFixed(1)}
          </span>
        </div>
      `;
    }

    html += `
      <div class="nota-card">
        <h3>${item.materia}</h3>
        ${linhas}
      </div>
    `;
  });

  conteudo.innerHTML = html;
}
function carregarPerfil() {
  protegerPagina();

  const usuario = JSON.parse(localStorage.getItem("usuarioLogado"));

  document.getElementById("perfilNome").value =
    usuario.usuario || usuario.username || usuario.firstName || "";

  document.getElementById("perfilEmail").value =
    usuario.email || "";
    
    document.getElementById("cursoResumo").innerText =
  usuario.curso || "ADS";

document.getElementById("turmaResumo").innerText =
  usuario.turma || "2026.1";
}

async function atualizarPerfil() {
  protegerPagina();

  const nome = document.getElementById("perfilNome").value.trim();
  const email = document.getElementById("perfilEmail").value.trim();
  const mensagem = document.getElementById("mensagemPerfil");

  if (nome === "" || email === "") {
    mensagem.innerText = "Preencha todos os campos.";
    return;
  }

  mensagem.innerText = "Atualizando perfil...";

  try {
    const resposta = await fetch("https://jsonplaceholder.typicode.com/users/1", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        name: nome,
        email: email
      })
    });

    if (!resposta.ok) {
      throw new Error("Erro ao atualizar perfil.");
    }

    const dados = await resposta.json();

    localStorage.setItem("usuarioLogado", JSON.stringify({
      usuario: nome,
      email: email,
      senha: "senhaLocal"
    }));

    mensagem.innerText = "Perfil atualizado com sucesso!";
    console.log("PUT realizado:", dados);

  } catch (erro) {
    mensagem.innerText = "Erro ao atualizar perfil.";
    console.error(erro);
  }
}
function carregarPerfil() {

    protegerPagina();

    const usuario =
        JSON.parse(
            localStorage.getItem("usuarioLogado")
        );

    document.getElementById("nomePerfil").innerText =
        usuario.usuario ||
        usuario.username ||
        "Estudante";

    document.getElementById("perfilNome").value =
        usuario.usuario ||
        usuario.username ||
        "";

    document.getElementById("perfilEmail").value =
        usuario.email || "";

    document.getElementById("perfilCurso").value =
        usuario.curso || "Análise e Desenvolvimento de Sistemas";

    document.getElementById("perfilTurma").value =
        usuario.turma || "2026.1";
}

async function atualizarPerfil() {

    const nome =
        document.getElementById("perfilNome").value;

    const email =
        document.getElementById("perfilEmail").value;

    const curso =
        document.getElementById("perfilCurso").value;

    const turma =
        document.getElementById("perfilTurma").value;

    const mensagem =
        document.getElementById("mensagemPerfil");

    mensagem.innerText = "Atualizando perfil...";

    try {

        const resposta =
            await fetch(
                "https://jsonplaceholder.typicode.com/users/1",
                {
                    method:"PUT",
                    headers:{
                        "Content-Type":"application/json"
                    },
                    body:JSON.stringify({
                        nome,
                        email,
                        curso,
                        turma
                    })
                }
            );

        if(!resposta.ok){
            throw new Error();
        }

        localStorage.setItem(
            "usuarioLogado",
            JSON.stringify({
                usuario:nome,
                email:email,
                curso:curso,
                turma:turma
            })
        );

        mensagem.innerText =
            "Perfil atualizado com sucesso.";

    }
    catch(erro){

        mensagem.innerText =
            "Erro ao atualizar perfil.";

    }
}