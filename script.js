let itens = [];
let idCounter = 0;
let id;
let sectionAtiva = 'livros';

// Variáveis para armazenar valores temporários
let tempLivro = {
  nome: '',
  autor: '',
  paginas: ''
};

let tempAutor = {
  nome: '',
  email: ''
};

document.addEventListener('DOMContentLoaded', () => {
  const modalLivro = document.querySelector('.modal-container');
  const modalAutor = document.querySelector('#modalAutor');
  const sNomeLivro = document.querySelector('#m-nome');
  const sAutorLivro = document.querySelector('#m-autor');
  const sPaginasLivro = document.querySelector('#m-paginas');
  const sNomeAutor = document.querySelector('#m-nome-autor');
  const sEmailAutor = document.querySelector('#m-email');
  const btnSalvarLivro = document.querySelector('#btnSalvarLivro');
  const btnSalvarAutor = document.querySelector('#btnSalvarAutor');

  loadItens();

  if (btnSalvarLivro) {
    btnSalvarLivro.onclick = e => {
      e.preventDefault();

      if (sNomeLivro.value == '' || sAutorLivro.value == '' || sPaginasLivro.value == '') {
        console.log('Campos vazios, não salvando');
        return;
      }

      if (id !== undefined) {
        console.log('Editando item existente');
        itens[id].nome = sNomeLivro.value;
        itens[id].autor = sAutorLivro.value;
        itens[id].paginas = sPaginasLivro.value;
      } else {
        console.log('Adicionando novo item');
        const newItem = {
          id: idCounter,
          nome: sNomeLivro.value,
          autor: sAutorLivro.value,
          paginas: sPaginasLivro.value
        };
        itens.push(newItem);
        idCounter++;
      }

      setItensBD();
      displaySuccessMessage();

      modalLivro.classList.remove('active');
      loadItens();
      id = undefined;

      // Limpa os valores temporários após salvar
      tempLivro = { nome: '', autor: '', paginas: '' };
    };
  }

  if (btnSalvarAutor) {
    btnSalvarAutor.onclick = e => {
      e.preventDefault();

      if (sNomeAutor.value == '' || sEmailAutor.value == '') {
        console.log('Campos vazios, não salvando');
        return;
      }

      console.log('Adicionando novo autor');
      const newAuthor = {
        id: idCounter,
        nome: sNomeAutor.value,
        email: sEmailAutor.value
      };

      itens.push(newAuthor);
      idCounter++;
      setItensBD();
      displaySuccessMessage();

      modalAutor.classList.remove('active');
      loadItens();

      // Limpa os valores temporários após salvar
      tempAutor = { nome: '', email: '' };
    };
  }

  document.getElementById('btnLivros').addEventListener('click', showLivros);
  document.getElementById('btnAutores').addEventListener('click', showAutores);

  document.getElementById('addL').onclick = () => {
    if (sectionAtiva === 'livros') {
      openModal();
    } else if (sectionAtiva === 'autores') {
      openModalAutor();
    }
  };

  document.getElementById('searchBook').addEventListener('input', filterBooks);
});

function openModal(edit = false, index = 0) {
  const modal = document.querySelector('.modal-container');
  const sNomeLivro = document.querySelector('#m-nome');
  const sAutorLivro = document.querySelector('#m-autor');
  const sPaginasLivro = document.querySelector('#m-paginas');

  modal.classList.add('active');

  modal.onclick = e => {
    if (e.target.className.indexOf('modal-container') !== -1) {
      modal.classList.remove('active');
    }
  };

  if (edit) {
    sNomeLivro.value = itens[index].nome;
    sAutorLivro.value = itens[index].autor;
    sPaginasLivro.value = itens[index].paginas;
    id = index;

    // Atualiza os valores temporários
    tempLivro = {
      nome: itens[index].nome,
      autor: itens[index].autor,
      paginas: itens[index].paginas
    };
  } else {
    // Restaura os valores temporários se existirem
    sNomeLivro.value = tempLivro.nome;
    sAutorLivro.value = tempLivro.autor;
    sPaginasLivro.value = tempLivro.paginas;
  }
}

function openModalAutor() {
  const modalAutor = document.querySelector('#modalAutor');
  const sNomeAutor = document.querySelector('#m-nome-autor');
  const sEmailAutor = document.querySelector('#m-email');

  modalAutor.classList.add('active');

  modalAutor.onclick = e => {
    if (e.target.className.indexOf('modal-container') !== -1) {
      modalAutor.classList.remove('active');
    }
  };

  // Restaura os valores temporários se existirem
  sNomeAutor.value = tempAutor.nome;
  sEmailAutor.value = tempAutor.email;
}

function updateAddButtonText() {
  const addButton = document.getElementById('addL');
  const searchInput = document.getElementById('searchBook');

  if (sectionAtiva === 'livros') {
    addButton.textContent = 'Adicionar Livro';
    searchInput.placeholder = 'Pesquisar por título ou autor do livro';
  } else if (sectionAtiva === 'autores') {
    addButton.textContent = 'Adicionar Autor';
    searchInput.placeholder = 'Pesquisar por nome ou email do autor';
  }
}

function showLivros() {
  document.getElementById('livrosSection').style.display = 'block';
  document.getElementById('autoresSection').style.display = 'none';
  sectionAtiva = 'livros';
  updateAddButtonText();

  document.getElementById('headerTitle').textContent = 'Livros';
}

function showAutores() {
  document.getElementById('livrosSection').style.display = 'none';
  document.getElementById('autoresSection').style.display = 'block';
  sectionAtiva = 'autores';
  updateAddButtonText();

  document.getElementById('headerTitle').textContent = 'Autores';
}

function filterBooks() {
  const searchValue = document.getElementById('searchBook').value.toLowerCase();

  const tbodyLivros = document.querySelector('#livroTable tbody');
  const tbodyAutores = document.querySelector('#autorTable tbody');

  tbodyLivros.innerHTML = '';
  tbodyAutores.innerHTML = '';

  const filteredItems = itens.filter(item => {
    if (sectionAtiva === 'livros') {
      return item.nome.toLowerCase().includes(searchValue) ||
        (item.autor && item.autor.toLowerCase().includes(searchValue));
    } else if (sectionAtiva === 'autores') {
      return item.nome.toLowerCase().includes(searchValue) ||
        (item.email && item.email.toLowerCase().includes(searchValue));
    }
    return false;
  });

  filteredItems.forEach((item, index) => {
    if (sectionAtiva === 'livros' && item.paginas !== undefined) {
      insertItem(item, index, tbodyLivros);
    } else if (sectionAtiva === 'autores') {
      insertItem(item, index, tbodyAutores);
    }
  });
}

function editItem(index) {
  const item = itens[index];
  openModal(true, index);
}

function deleteItem(index) {
  const confirmDelete = confirm('Tem certeza que deseja excluir este item?');
  if (confirmDelete) {
    itens.splice(index, 1);
    setItensBD();
    loadItens();
  }
}

function insertItem(item, index, tableBody) {
  const tr = document.createElement('tr');
  if (item.paginas !== undefined) {
    tr.innerHTML = `
      <td>${item.id}</td>
      <td>${item.nome}</td>
      <td>${item.autor}</td>
      <td>${item.paginas}</td>
      <td class="acao">
        <button onclick="editItem(${index})"><i class='bx bx-edit'></i></button>
      </td>
      <td class="acao">
        <button onclick="deleteItem(${index})"><i class='bx bx-trash'></i></button>
      </td>`;
    tableBody.appendChild(tr);
  } else if (item.email !== undefined) {
    tr.innerHTML = `
      <td>${item.id}</td>
      <td>${item.nome}</td>
      <td>${item.email}</td>
      <td class="acao">
        <button onclick="editItem(${index})"><i class='bx bx-edit'></i></button>
      </td>
      <td class="acao">
        <button onclick="deleteItem(${index})"><i class='bx bx-trash'></i></button>
      </td>`;
    tableBody.appendChild(tr);
  }
}


function loadItens() {
  itens = getItensBD();
  const tbodyLivros = document.querySelector('#livroTable tbody');
  const tbodyAutores = document.querySelector('#autorTable tbody');

  tbodyLivros.innerHTML = '';
  tbodyAutores.innerHTML = '';

  itens.forEach((item, index) => {
    if (item.paginas !== undefined) {
      insertItem(item, index, tbodyLivros);
    } else if (item.email !== undefined) {
      insertItem(item, index, tbodyAutores);
    }
  });

  idCounter = itens.length > 0 ? Math.max(...itens.map(item => item.id)) + 1 : 0;
}


const getItensBD = () => JSON.parse(localStorage.getItem('dbfunc')) ?? [];
const setItensBD = () => localStorage.setItem('dbfunc', JSON.stringify(itens));

function displaySuccessMessage() {
  const successMessage = document.querySelector('#successMessage');
  if (successMessage) {
    successMessage.textContent = 'Item salvo com sucesso!';
    successMessage.style.display = 'block';
    setTimeout(() => {
      successMessage.style.display = 'none';
    }, 2000);
  }
}
