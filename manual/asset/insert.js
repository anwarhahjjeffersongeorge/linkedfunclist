window.onload = function () {
  let usageEl = document.getElementById('usage_js')
  if (usageEl !== null) {
    // usageEl.innerHTML = `<embed
    //   id="inserted"
    //   width="100%" height="100%"
    //   style="border:none, scroll:none"
    //   src="manual/asset/usage.js">
    // </embed>`
    let r = new Request('manual/asset/usage.js')
    fetch(r)
      .then(function (response) {
        if (!response.ok) {
          throw new Error('HTTP error, status = ' + response.status)
        }
        return response.blob()
      })
      .then(function (response) {
        let reader = new FileReader()
        reader.onload = function (e) {
          usageEl.innerText = e.target.result
        }
        reader.readAsText(response)
      })
  }
}
