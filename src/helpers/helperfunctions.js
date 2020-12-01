import { ONE_GB, ONE_KB, ONE_MB } from '../constants'
const Big = require('big.js')

const removeTrailingZeros = str => {
  let numberStr = ''
  if (typeof str === 'number' && !Number.isNaN(str)) {
    numberStr = str.toString()
  } else {
    numberStr = str
  }
  const subString = numberStr.split('.00')[0]

  return subString
}

export const divide = (dividend, divisor) => {
  let result = 0
  try {
    result = new Big(dividend).div(new Big(divisor)).toFixed(2)
  } catch (err) {
    return removeTrailingZeros(result)
  }

  return removeTrailingZeros(result)
}

export const formatStorage = storage => {
  let formattedStr = storage
  const value = Math.abs(storage)

  if (value >= ONE_GB) {
    formattedStr = `${divide(storage, ONE_GB)} GB`
  } else if (value >= ONE_MB) {
    formattedStr = `${divide(storage, ONE_MB)} MB`
  } else if (value >= ONE_KB) {
    formattedStr = `${divide(storage, ONE_KB)} KB`
  } else {
    formattedStr = `${storage} Bytes`
  }
  return formattedStr
}

export const createContextFromEvent = e => {
  const left = e.clientX
  const top = e.clientY
  const right = left + 1
  const bottom = top + 1

  return {
    getBoundingClientRect: () => ({
      left,
      top,
      right,
      bottom,

      height: 0,
      width: 0
    })
  }
}
