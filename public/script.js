$(document).ready((() => {
    console.log('DOM is ready!')
    $('.add').on("click", (evt) => stockUpdate(evt, 1))
    $('.remove').on("click", (evt) => stockUpdate(evt, -1))
}))



async function stockUpdate(evt, change) {
    evt.preventDefault()
    console.log(evt)
    console.log(evt.currentTarget.dataset.name)
    console.log(evt.currentTarget.dataset.amount)
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

}