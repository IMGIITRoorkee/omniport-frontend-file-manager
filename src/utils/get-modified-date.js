const monthData = [
  'Jan',
  'Feb',
  'Mar',
  'Apr',
  'May',
  'Jun',
  'Jul',
  'Aug',
  'Sept',
  'Oct',
  'Nov',
  'Dec'
]

export function getModifiedDate(date) {
  let newDate = new Date(date)
  return (
    monthData[newDate.getMonth()] +
    ' ' +
    newDate.getDate() +
    ', ' +
    newDate.getFullYear()
  )
}
