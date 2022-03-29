class CurrencyAPI {

  baseURL = "https://www.cbr-xml-daily.ru/daily_json.js"

  async fetchCurrencyData() {
    const response = await fetch(this.baseURL)
    const data = await response.json()
    return data.Valute
  }

  async fetchPreviousUrl(url = this.baseURL) {
    const response = await fetch(url)
    const data = await response.json()
    console.log(url, data)
    return data.PreviousURL
  }

  async fetchPreviousData(name, url, currencyData = [], limit = 10) {
    const response = await fetch(url)
    const data = await response.json()
    const previousURL = data.PreviousURL
    const valute = data.Valute[name]
    valute['Date'] = Date.parse(data.Date)
    currencyData.push(valute)
    if (limit > 0) {
      await this.fetchPreviousData(name, previousURL, currencyData, limit - 1)
    }
    return currencyData
  }
  
}

export default new CurrencyAPI()