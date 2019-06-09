$(document).ready((() => {
    console.log('DOM is ready!')
    $('.add').on("click", evt => stockUpdate(evt, 1))
    $('.remove').on("click", evt => stockUpdate(evt, -1))
    $('.btn-recipe').on('click', evt => openRecipe(evt))
}))

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
    console.log(data)
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
    for(key in jsObj){
        const row = table.insertRow(i)
        row.insertCell(0).textContent = key
        row.insertCell(1).textContent = jsObj[key]
        row.insertCell(2).textContent = "Gramm"
        i = i+1
    }
    i=0
}

function updateRow(data, newAmount) {
    const row = document.getElementById(data.name).childNodes
    row[3].textContent = newAmount
    row[5].childNodes[0].dataset.amount = newAmount
    row[7].childNodes[0].dataset.amount = newAmount
}

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
        console.log(data)
        updateRow(evt.currentTarget.dataset, data.amount)
    }
}