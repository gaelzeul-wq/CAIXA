let produtos =
JSON.parse(localStorage.getItem("produtos")) || [];

let carrinho = [];

let historico =
JSON.parse(localStorage.getItem("historico")) || [];

function salvarDados(){

    localStorage.setItem(
        "produtos",
        JSON.stringify(produtos)
    );

    localStorage.setItem(
        "historico",
        JSON.stringify(historico)
    );
}

function adicionarProduto(){

    const nome =
    document.getElementById("nome").value;

    const preco =
    parseFloat(
        document.getElementById("preco").value
    );

    const quantidade =
    parseInt(
        document.getElementById("quantidade").value
    );

    const foto =
    document.getElementById("foto").files[0];

    if(!nome || !preco || !quantidade){
        alert("Preencha todos os campos");
        return;
    }

    const leitor = new FileReader();

    leitor.onload = function(e){

        produtos.push({
            id: Date.now(),
            nome,
            preco,
            quantidade,
            foto:e.target.result
        });

        salvarDados();

        listarProdutos();

        limparCampos();
    };

    if(foto){
        leitor.readAsDataURL(foto);
    }else{

        produtos.push({
            id: Date.now(),
            nome,
            preco,
            quantidade,
            foto:""
        });

        salvarDados();

        listarProdutos();

        limparCampos();
    }
}

function limparCampos(){

    document.getElementById("nome").value = "";
    document.getElementById("preco").value = "";
    document.getElementById("quantidade").value = "";
    document.getElementById("foto").value = "";
}

function listarProdutos(){

    const estoque =
    document.getElementById("estoque");

    const pesquisa =
    document.getElementById("pesquisa")
    .value.toLowerCase();

    estoque.innerHTML = "";

    produtos
    .filter(produto =>
        produto.nome
        .toLowerCase()
        .includes(pesquisa)
    )
    .forEach(produto => {

        estoque.innerHTML += `
        <div class="produto">

            ${
                produto.foto
                ?
                `<img src="${produto.foto}">`
                :
                ""
            }

            <h3>${produto.nome}</h3>

            <p>Preço:
            R$ ${produto.preco.toFixed(2)}</p>

            <p>Quantidade:
            ${produto.quantidade}</p>

            <button onclick="excluirProduto(${produto.id})">
                Excluir
            </button>

        </div>
        `;
    });

    atualizarSelect();
    mostrarHistorico();
}

function excluirProduto(id){

    produtos =
    produtos.filter(
        produto => produto.id !== id
    );

    salvarDados();
    listarProdutos();
}

function atualizarSelect(){

    const select =
    document.getElementById("produtoCaixa");

    select.innerHTML = "";

    produtos.forEach(produto => {

        select.innerHTML += `
        <option value="${produto.id}">
            ${produto.nome}
        </option>
        `;
    });
}

function adicionarCarrinho(){

    const id =
    Number(
        document.getElementById("produtoCaixa")
        .value
    );

    const quantidade =
    Number(
        document.getElementById("quantidadeVenda")
        .value
    );

    const produto =
    produtos.find(
        p => p.id === id
    );

    if(!produto){
        return;
    }

    if(quantidade > produto.quantidade){

        alert("Estoque insuficiente");

        return;
    }

    carrinho.push({
        id:produto.id,
        nome:produto.nome,
        preco:produto.preco,
        quantidade
    });

    atualizarCarrinho();
}

function atualizarCarrinho(){

    const carrinhoDiv =
    document.getElementById("carrinho");

    carrinhoDiv.innerHTML = "";

    let total = 0;

    carrinho.forEach(item => {

        const subtotal =
        item.preco * item.quantidade;

        total += subtotal;

        carrinhoDiv.innerHTML += `
        <div class="carrinho-item">

            ${item.nome}
            x ${item.quantidade}

            =

            R$ ${subtotal.toFixed(2)}

        </div>
        `;
    });

    document.getElementById("total")
    .innerText = total.toFixed(2);
}

function finalizarVenda(){

    if(carrinho.length === 0){

        alert("Carrinho vazio");

        return;
    }

    let total = 0;

    carrinho.forEach(item => {

        const produto =
        produtos.find(
            p => p.id === item.id
        );

        produto.quantidade -=
        item.quantidade;

        total +=
        item.preco * item.quantidade;
    });

    historico.push({
        data:new Date().toLocaleString(),
        total
    });

    carrinho = [];

    salvarDados();

    atualizarCarrinho();

    listarProdutos();

    alert(
        "Venda finalizada!\nTotal: R$ " +
        total.toFixed(2)
    );
}

function mostrarHistorico(){

    const div =
    document.getElementById("historico");

    div.innerHTML = "";

    historico.forEach(venda => {

        div.innerHTML += `
        <p>
            ${venda.data}
            -
            R$ ${venda.total.toFixed(2)}
        </p>
        `;
    });
}

listarProdutos();