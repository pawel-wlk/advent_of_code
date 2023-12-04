const snafuDigitsToValues: Record<string, number> = {
  '2': 2,
  '1': 1,
  '0': 0,
  '-': -1,
  '=': -2,
}

const decimalToSnafuDigits: Record<number, string> = {
  2: '2',
  1: '1',
  0: '0',
  [-1]: '-',
  [-2]: '=',
}

function parseSnafu(snafu: string) {
  return [...snafu]
    .map(digit => snafuDigitsToValues[digit])
    .map((val, i, {length}) => val * Math.pow(5, length - 1 - i))
    .reduce((a,b) => a+b, 0)
}

function findClosestPowerOfFive(num: number) {
  const basePower = Math.floor(Math.log(num) / Math.log(5))

  return num > basePower*2 ? num+1: num
}

const digitValues = [-2, -1, 0, 1, 2]

function toSnafu(num: number) {
  let currentPower = findClosestPowerOfFive(num)
  let whatsLeft = num
  let result = ''
  
  while (whatsLeft !== 0) {
    const {digit, newValue} = digitValues.map(digit => {
      const newValue = whatsLeft - digit * Math.pow(5, currentPower)
      
      return {
        newValue,
        digit,
      }
    }).reduce((a, b) => Math.abs(a.newValue) < Math.abs(b.newValue) ? a : b, {newValue: whatsLeft, digit: 0})

    whatsLeft = newValue
    currentPower--
    result += decimalToSnafuDigits[digit]
  }

  return result
}

const tests = `1              1
        2              2
        3             1=
        4             1-
        5             10
        6             11
        7             12
        8             2=
        9             2-
       10             20
       15            1=0
       20            1-0
     2022         1=11-2
    12345        1-0---0
314159265  1121-1110-1=0`

tests.split('\n').forEach(line => {
  const [decimal, snafu] = line.trim().split(/\s+/)
  console.log(parseSnafu(snafu) === parseInt(decimal))
  console.log(snafu === toSnafu(parseInt(decimal)))
})