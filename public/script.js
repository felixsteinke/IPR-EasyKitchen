$(document).ready((() => {
    console.log('DOM is ready!')
    $('.add').on("click", (evt) => stockUpdate(evt, 1))
    $('.remove').on("click", (evt) => stockUpdate(evt, -1))
}))

function updateRow(data, newAmount) {
    const row = document.getElementById(data.name).childNodes
    row[3].textContent = newAmount
    row[5].childNodes[0].dataset.amount = newAmount
    row[7].childNodes[0].dataset.amount = newAmount
}

async function stockUpdate(evt, change) {
    evt.preventDefault()
    console.log(evt)
    console.log(evt.currentTarget.dataset.name)
    console.log(evt.currentTarget.dataset.amount)
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