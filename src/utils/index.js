const getPercentDiff = (currentNum, previousNum) => {
  const result = (currentNum - previousNum)/previousNum * 100
  return result
}

export {
  getPercentDiff
}