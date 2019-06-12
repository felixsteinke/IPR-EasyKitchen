$(document).ready((() => {
    console.log('DOM is ready!')
    $('.add').on("click", evt => stockUpdate(evt, 1))
    $('.remove').on("click", evt => stockUpdate(evt, -1))
    $('.btn-recipe').on('click', evt => openRecipe(evt))
    $('.btn-list').on('click', evt => addList(evt))
    //$('.add-stock').on('click', evt => addBestand(evt))
    //$('.decrease').on('click', evt => decreaseList(evt))
}))
//list
function decreaseList(evt){
    evt.preventDefault()
    console.log("called decreaseList()")
}
function addBestand(evt){
    evt.preventDefault()
    console.log("called addBestand()")
}
function addList(evt) {
    evt.preventDefault()
    const table = document.getElementById('body-shopping-list')
    if (table.childElementCount != 0) {
        for(i = 1; i<=table.childElementCount; i++){
            const children = table.childNodes[i].childNodes
            if (children[0].textContent == evt.currentTarget.dataset.name) {
                children[2].textContent = parseInt(children[2].textContent)+1
                return
            }
        }
    }

    addRow(table, evt.currentTarget.dataset)
}
function addRow(table, dataset){
    const row = table.insertRow()
    row.insertCell(0).textContent = dataset.name
    row.insertCell(1).textContent = dataset.amount
    row.insertCell(2).textContent = "0"

    const test = '<a href="/list?special=data" type="button" id=dataset.name class="btn-size decrease btn btn-outline-secondary" data-name=dataset.name>-</a>'

    const cell = row.insertCell(3)
    cell.class = "decrease-cells"
    $('.decrease-cells').append(test)

    //const btn = document.createElement('a')
    //btn.type = 'button'
    //btn.href = '/list?special=data'
    //btn.dataset.name = dataset.name
    //btn.id = dataset.name
    //btn.class = 'btn-size decrease btn btn-outline-secondary'
    //btn.textContent = '-'
    //row.insertCell(3).appendChild(btn)

    const btn2 = document.createElement('a')
    btn2.type = 'button'
    btn2.href = '/list?special=data'
    btn2.dataset.name = dataset.name
    btn2.dataset.change = 1
    btn2.id = dataset.name
    btn2.class = 'btn-size add-stock btn btn-outline-secondary'
    btn2.textContent = 'eingekauft'
    row.insertCell(4).appendChild(btn2)
}
//recipe
async function openRecipe(evt) {
    evt.preventDefault()
    const div = document.getElementById('displayRecipe')
    const response = await fetch('/api/recipe', {
        method: "post",
        headers: {
            "Content-type": "application/json; charset=UTF-8"
        },
        body: JSON.stringify({
            name: evt.currentTarget.dataset.name
        })
    })
    const data = await response.json();
    div.style.display = (div.style.display != 'none') ? 'none' : 'block'
    displayRecipe(evt, data)
}
function displayRecipe(evt, data) {
    document.getElementById('headline').textContent = data.name
    document.getElementById('description').textContent = data.desc
    const comp = data.components
    const table = document.getElementById('components')
    $("#components tr").remove()
    const jsObj = JSON.parse(comp)
    var i = 0
    for (key in jsObj) {
        const row = table.insertRow(i)
        row.insertCell(0).textContent = key
        row.insertCell(1).textContent = jsObj[key]
        row.insertCell(2).textContent = "Gramm"
        i = i + 1
    }
    i = 0
}
//stock
async function stockUpdate(evt, change) {
    evt.preventDefault()
    if (evt.currentTarget.dataset.amount == 0 && change == -1) {
        console.log("amount is 0 and called -1")
    } else {
        const response = await fetch('/api/stock', {
            method: "post",
            headers: {
                "Content-type": "application/json; charset=UTF-8"
            },
            body: JSON.stringify({
                name: evt.currentTarget.dataset.name,
                amountStock: change
            })
        })
        const data = await response.json()
        updateRow(evt.currentTarget.dataset, data.amount)
    }
}
function updateRow(data, newAmount) {
    const row = document.getElementById(data.name).childNodes
    row[3].textContent = newAmount
    row[5].childNodes[0].dataset.amount = newAmount
    row[7].childNodes[0].dataset.amount = newAmount
}
