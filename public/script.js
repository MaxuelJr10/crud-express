
const form = document.getElementById("formProduto");
const campoId = document.getElementById("id");
const campoNome = document.getElementById("nome");
const campoValor = document.getElementById("valor");
const campoQuantidade = document.getElementById("quantidade");
const campoCor = document.getElementById("cor");
const lista = document.getElementById("listaProdutos");
const mensagem = document.getElementById("mensagem");
const btnSalvar = document.getElementById("btnSalvar");
const btnCancelar = document.getElementById("btnCancelar");

// Mostra mensagens para o usuário
function mostrarMensagem(texto) {
  mensagem.textContent = texto;
}

// Faz uma requisição à API e trata respostas JSON
async function requisitar(url, opcoes = {}) {
  const resposta = await fetch(url, opcoes);
  const dados = await resposta.json();

  if (!resposta.ok) {
    throw new Error(dados.erro || dados.mensagem || "Ocorreu um erro");
  }

  return dados;
}

// READ: lista os produtos cadastrados
async function carregarProdutos() {
  try {
    const produtos = await requisitar("/produtos");

    lista.replaceChildren();

    if (produtos.length === 0) {
      lista.textContent = "Nenhum produto cadastrado.";
      return;
    }

    produtos.forEach((produto) => {
      const card = document.createElement("article");
      card.className = "produto";

      const titulo = document.createElement("h3");
      titulo.textContent = produto.nome;

      const detalhes = document.createElement("p");
      detalhes.textContent =
        `ID: ${produto.id} | Valor: R$ ${Number(produto.valor).toFixed(2)} | ` +
        `Quantidade: ${produto.quantidade} | Cor: ${produto.cor || "Não informada"}`;

      const btnEditar = document.createElement("button");
      btnEditar.type = "button";
      btnEditar.textContent = "Editar";

      btnEditar.addEventListener("click", () => {
        campoId.value = produto.id;
        campoNome.value = produto.nome;
        campoValor.value = produto.valor;
        campoQuantidade.value = produto.quantidade;
        campoCor.value = produto.cor || "";

        btnSalvar.textContent = "Salvar alterações";
        btnCancelar.hidden = false;
        mostrarMensagem("Editando produto " + produto.id);
        form.scrollIntoView({ behavior: "smooth" });
      });

      const btnExcluir = document.createElement("button");
      btnExcluir.type = "button";
      btnExcluir.textContent = "Excluir";

      btnExcluir.addEventListener("click", async () => {
        if (!confirm(`Deseja excluir "${produto.nome}"?`)) {
          return;
        }

        try {
          await requisitar(`/produtos/${produto.id}`, {
            method: "DELETE"
          });

          mostrarMensagem("Produto excluído com sucesso.");
          await carregarProdutos();
        } catch (erro) {
          mostrarMensagem(erro.message);
        }
      });

      card.append(titulo, detalhes, btnEditar, btnExcluir);
      lista.appendChild(card);
    });
  } catch (erro) {
    mostrarMensagem("Não foi possível carregar os produtos: " + erro.message);
  }
}

// CREATE e UPDATE: processa o formulário
form.addEventListener("submit", async (evento) => {
  evento.preventDefault();

  const id = campoId.value;

  const produto = {
    nome: campoNome.value.trim(),
    valor: Number(campoValor.value),
    quantidade: Number(campoQuantidade.value),
    cor: campoCor.value.trim()
  };

  if (
    !produto.nome ||
    campoValor.value.trim() === "" ||
    campoQuantidade.value.trim() === "" ||
    !Number.isFinite(produto.valor) ||
    !Number.isInteger(produto.quantidade) ||
    produto.valor < 0 ||
    produto.quantidade < 0
  ) {
    mostrarMensagem("Preencha os campos com valores válidos.");
    return;
  }

  try {
    await requisitar(
      id ? `/produtos/${id}` : "/produtos",
      {
        method: id ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(produto)
      }
    );

    mostrarMensagem(
      id ? "Produto atualizado com sucesso." : "Produto cadastrado com sucesso."
    );

    form.reset();
    campoId.value = "";
    btnSalvar.textContent = "Cadastrar produto";
    btnCancelar.hidden = true;

    await carregarProdutos();
  } catch (erro) {
    mostrarMensagem(erro.message);
  }
});

// Cancela a edição
btnCancelar.addEventListener("click", () => {
  form.reset();
  campoId.value = "";
  btnSalvar.textContent = "Cadastrar produto";
  btnCancelar.hidden = true;
  mostrarMensagem("Edição cancelada.");
});

// Carrega a lista ao abrir a página
carregarProdutos();
