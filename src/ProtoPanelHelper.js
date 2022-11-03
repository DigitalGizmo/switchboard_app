let rowColToIndex = [
  [
    // {personIdx: 8, isPlugged: false}, // name: 'no name',
    {personIdx: 0, isPlugged: false}, // 'Emma Powers - store'
    {personIdx: 1, isPlugged: false}, // 'Mrs. White',
    {personIdx: 2, isPlugged: false}, // 'Mina Newell' Paula Fowler?,
    {personIdx: 9, isPlugged: false}, //'Place Holder',
  ],
  [
    {personIdx: 5, isPlugged: false}, // 'Tressa Howe', 
    {personIdx: 10, isPlugged: false}, //'Place Holder',
    {personIdx: 4, isPlugged: false}, // 'Olive Powers',
    // {personIdx: 11, isPlugged: false}, //'Place Holder',
    {personIdx: 3, isPlugged: false}, // name: 'Charlie Freeman',
  ],
  [
    {personIdx: 12, isPlugged: false},  //'Place Holder',
    {personIdx: 6, isPlugged: false}, // name: 'Tom Libby',
    {personIdx: 13, isPlugged: false}, //'Place Holder',
    {personIdx: 7, isPlugged: false}, // name: 'Chief Aurthur Burns',
    // {personIdx: 14, isPlugged: false}, //'Place Holder',
  ]
];

const getPersonIdx = (row, col) => {
  console.log('row: ' + row + ' col: ' + col);
  return rowColToIndex[row][col].personIdx;
}

// const setJackState = (jacks, index) => {
//   jacks[indexToRowCol[index][0]][indexToRowCol[index][1]].ledState = LED_RED;
//   return jacks;
// }

// export {setJackState}
export {rowColToIndex}
export { getPersonIdx }