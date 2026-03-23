//  Menu Responsivo

function menuResponsivo() {
    var x = document.getElementById("myTopnav");
    if (x.className === "topnav") {
        x.className += " responsive";
    } else {
        x.className = "topnav";
    }
}

function addData() {
    const nome = document.getElementById('nomeProduto').value.trim();
    const preco = parseFloat(document.getElementById('precoProduto').value);
    const desconto = parseFloat(document.getElementById('descontoProduto').value);
    const estoque = parseInt(document.getElementById('estoqueProduto').value);

    if (!nome || isNaN(preco) || isNaN(desconto) || isNaN(estoque)) {
        alert("Preencha todas as informações corretamente.");
        return;
    }

    const produtos = JSON.parse(localStorage.getItem('produtos')) || [];
    
    const existe = produtos.some(p => p.nome.toLowerCase() === nome.toLowerCase());
    if (existe) {
        alert("Este produto já foi cadastrado!");
        return;
    }

    const precoFinal = preco - (preco * desconto / 100);
    const novoProduto = { nome, preco, desconto, precoFinal, estoque };

    produtos.push(novoProduto);
    localStorage.setItem('produtos', JSON.stringify(produtos));

    renderTabela();

    document.getElementById('nomeProduto').value = "";
    document.getElementById('precoProduto').value = "";
    document.getElementById('descontoProduto').value = "";
    document.getElementById('estoqueProduto').value = "";
}

function renderTabela() {
    const produtos = JSON.parse(localStorage.getItem('produtos')) || [];
    const tbody = document.getElementById('result');
    if (!tbody) return;

    tbody.innerHTML = "";

    produtos.forEach((prod, index) => {
        const linha = `
            <tr>
                <td>${prod.nome}</td>
                <td>R$ ${prod.preco.toFixed(2)}</td>
                <td>${prod.desconto}%</td>
                <td>R$ ${prod.precoFinal.toFixed(2)}</td>
                <td>${prod.estoque}</td>
                <td><button onclick="removerProduto(${index})">Remover</button></td>
            </tr>
        `;
        tbody.innerHTML += linha;
    });
}

function removerProduto(index) {
    const produtos = JSON.parse(localStorage.getItem('produtos')) || [];
    produtos.splice(index, 1); // remove o item da posição "index"
    localStorage.setItem('produtos', JSON.stringify(produtos)); // atualiza o armazenamento
    renderTabela(); // re-renderiza a tabela
}

// Promoções

function carregarPromocoes() {
    const produtos = JSON.parse(localStorage.getItem('produtos')) || [];
    const container = document.getElementById('produtos-container');
    container.innerHTML = "";

    produtos.forEach((produto, index) => {
        const precoFinal = (produto.preco - (produto.preco * produto.desconto / 100)).toFixed(2);
        const nomeFormatado = produto.nome.toLowerCase().replace(/\s/g, '').normalize("NFD").replace(/[\u0300-\u036f]/g, "");
        const imagemPath = `images/produtos/${nomeFormatado}.png`;

        const card = document.createElement("div");
        card.className = "produto";
        card.innerHTML = `
            <img src="${imagemPath}" alt="${produto.nome}" style="max-width: 100%; height: auto;"><br><br>
            <p><b>${produto.nome}</b></p>
            <p>R$ ${precoFinal}</p><br>     
            <input type="number" id="qtd-${index}" value="1" min="1" style="width: 60px; margin: 5px auto;">
            <button onclick="adicionarLista(${index})">Adicionar à Lista</button>
        `;
        container.appendChild(card);
    });
}

function adicionarLista(index) {
    const produtos = JSON.parse(localStorage.getItem('produtos')) || [];
    const lista = JSON.parse(localStorage.getItem('listaCompras')) || [];

    const produto = produtos[index];
    const qtd = parseInt(document.getElementById(`qtd-${index}`).value) || 1;

    const existente = lista.find(item => item.nome === produto.nome);
    if (existente) {
        existente.quantidade += qtd;
    } else {
        lista.push({
            nome: produto.nome,
            preco: (produto.preco - (produto.preco * produto.desconto / 100)),
            quantidade: qtd
        });
    }

    localStorage.setItem('listaCompras', JSON.stringify(lista));
    alert(`${produto.nome} adicionado à sua lista!`);
}


// Lista

function renderizarLista() {
    const lista = JSON.parse(localStorage.getItem('listaCompras')) || [];
    const container = document.getElementById("showLista");
    const totalEl = document.getElementById("totalGeral");
    container.innerHTML = "";

    let total = 0;

    lista.forEach((item, index) => {
        const subtotal = item.preco * item.quantidade;
        total += subtotal;

        const bloco = document.createElement("div");
        bloco.style.marginBottom = "15px";

        bloco.innerHTML = `
            <li>
                <b>${item.nome}</b><br>
                Preço: R$ ${item.preco.toFixed(2)} <br>
                Quantidade: 
                <input type="number" value="${item.quantidade}" min="1" 
                       onchange="alterarQuantidade(${index}, this.value)" 
                       style="width: 50px;"><button onclick="removerItem(${index})" style="margin-left: 20px;">Remover</button>
                <br><b>Subtotal: R$ ${subtotal.toFixed(2)}</b><br>
                
            </li>
        `;

        container.appendChild(bloco);
    });

    totalEl.innerText = `Total: R$ ${total.toFixed(2)}`;
}

function alterarQuantidade(index, novaQtd) {
    const lista = JSON.parse(localStorage.getItem('listaCompras')) || [];
    novaQtd = parseInt(novaQtd);
    if (novaQtd < 1) novaQtd = 1;
    lista[index].quantidade = novaQtd;
    localStorage.setItem('listaCompras', JSON.stringify(lista));
    renderizarLista();
}

function removerItem(index) {
    const lista = JSON.parse(localStorage.getItem('listaCompras')) || [];
    lista.splice(index, 1);
    localStorage.setItem('listaCompras', JSON.stringify(lista));
    renderizarLista();
}

// === CHAMADAS AUTOMÁTICAS ===
window.onload = function () {
    if (document.getElementById("produtos-container")) carregarPromocoes();
    if (document.getElementById("showLista")) renderizarLista();
};