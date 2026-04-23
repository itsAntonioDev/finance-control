const formTransacao = document.getElementById('formTransacao')
const lista = document.getElementById('listaTransacoes')
const txt = document.getElementById('descricao')
const nb = document.getElementById('valor')

const btnEntrada = document.getElementById('entrada')
const btnSaida = document.getElementById('saida')

const entradasTot = document.getElementById('entradas')
const saidasTot = document.getElementById('saidas')
const saldoTot = document.getElementById('saldo')

const ctx = document.getElementById('grafico')

let entradas = 0
let saidas = 0
let guardarLista = []

btnEntrada.addEventListener('click', () => {
    btnEntrada.classList.add('btn-tipo-ativo')
    btnSaida.classList.remove('btn-tipo-ativo')
})

btnSaida.addEventListener('click', () => {
    btnSaida.classList.add('btn-tipo-ativo')
    btnEntrada.classList.remove('btn-tipo-ativo')
})

formTransacao.addEventListener('submit', function (event) {
    event.preventDefault()

    const btnAtivo = document.querySelector('.btn-tipo-ativo')

    const transacao = {
        descricao: txt.value,
        valor: Number(nb.value),
        tipo: btnAtivo.id
    }

    guardarLista.push(transacao)

    entradas = 0
    saidas = 0

    guardarLista.forEach(transacao => {
        if (transacao.tipo === 'entrada') {
            entradas += transacao.valor
        } else {
            saidas += transacao.valor
        }
    })

    entradasTot.textContent = `R$ ${fmt(entradas)}`
    saidasTot.textContent = `R$ ${fmt(saidas)}`
    saldoTot.textContent = `R$ ${fmt(entradas - saidas)}`

    
    const item = document.createElement('div')
    item.classList.add('tx-item')

    const info = document.createElement('div')

    const desc = document.createElement('div')
    desc.classList.add('tx-desc')
    desc.textContent = transacao.descricao

    const tipo = document.createElement('div')
    tipo.classList.add('tx-tipo')
    tipo.textContent = transacao.tipo === 'entrada' ? 'Entrada' : 'Saída'

    info.appendChild(desc)
    info.appendChild(tipo)

    const valor = document.createElement('span')
    valor.classList.add('tx-valor', transacao.tipo)
    valor.textContent = `${transacao.tipo === 'entrada' ? '+' : '-'} R$ ${fmt(transacao.valor)}`

    const btnExcluir = document.createElement('button')
    btnExcluir.textContent = '×'

    btnExcluir.addEventListener('click', function () {
        guardarLista = guardarLista.filter(t => t !== transacao)
        item.remove()
        recalcular()
        grafico.data.datasets[0].data = [entradas, saidas]
        grafico.update()
    })

    item.appendChild(info)
    item.appendChild(valor)
    item.appendChild(btnExcluir)

    lista.appendChild(item)
    

    txt.value = ''
    nb.value = ''

    grafico.data.datasets[0].data = [entradas, saidas]
    grafico.update()
})

function fmt(valor) {
    return valor.toLocaleString('pt-BR', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
    })
}

function recalcular() {
    entradas = 0
    saidas = 0

    guardarLista.forEach(transacao => {
        if (transacao.tipo === 'entrada') {
            entradas += transacao.valor
        } else {
            saidas += transacao.valor
        }
    })

    entradasTot.textContent = `R$ ${fmt(entradas)}`
    saidasTot.textContent = `R$ ${fmt(saidas)}`
    saldoTot.textContent = `R$ ${fmt(entradas - saidas)}`
}

const grafico = new Chart(ctx, {
    type: 'bar',
    data: {
        labels: ['Entrada', 'Saída'],
        datasets: [{
            label: 'Movimentação',
            data: [0, 0],
            backgroundColor: ['#dcfce7', '#fee2e2'],
            borderColor: ['#16a34a', '#dc2626'],
            borderWidth: 2,
            borderRadius: 8,
        }]
    },
    options: {
        responsive: true,
        plugins: {
            legend: { display: false }
        },
        scales: {
            x: {
                grid: { display: false },
                ticks: { color: '#9ca3af' }
            },
            y: {
                display: false
            }
        }
    }
})