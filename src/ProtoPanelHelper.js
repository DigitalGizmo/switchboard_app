let rowColToIndex = [
  [
    {personIdx: 2, isPlugged: false}, // 44 'Mina Newell' Paula Fowler?,
    {personIdx: 9, isPlugged: false}, // 50 'Paula FowlerPlace Holder',
    {personIdx: 1, isPlugged: false}, // 51  'Mrs. White',
    {personIdx: 0, isPlugged: false}, // 53 'Emma Powers - store'
    {personIdx: 3, isPlugged: false}, // 56 'Charlie Freeman/ Doc',
    {personIdx: 10, isPlugged: false}, // 60 'Jane SmithPlace Holder',
  ],
  [
    {personIdx: 4, isPlugged: false}, // 72 'Olive Powers',
    {personIdx: 5, isPlugged: false}, // 80 'Tressa Howe', 
    {personIdx: 12, isPlugged: false}, // 82, or any # 'Gary GreenPlace Holder',
    {personIdx: 6, isPlugged: false}, // 84 'Tom Libby',
    {personIdx: 13, isPlugged: false}, // 90 or 'Ruby Red Place Holder',
    {personIdx: 7, isPlugged: false}, // 111 'Chief Aurthur Burns',
  ],
  [
    // {personIdx: 8, isPlugged: false}, // name: 'no name',
    // {personIdx: 11, isPlugged: false}, //'Place Holder',
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