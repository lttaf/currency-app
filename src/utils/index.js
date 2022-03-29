const getPercentDiff = (currentNum, previousNum) => {
  const result = (currentNum - previousNum)/previousNum * 100
  return result
}

const createData = (data) => {
  return data.map(item => {
    const diff = getPercentDiff(item.Value, item.Previous)
    return {
      date: item.Date,
      currencyCode: item.CharCode,
      currencyName: item.Name,
      value: item.Value,
      diff: diff.toFixed(2)
    }
  })
}

export {
  getPercentDiff,
  createData
}
