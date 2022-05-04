
let rowColToIndex = [
  [
    8, // name: 'no name',
    0, // 'Emma Powers - store'
    1, // 'Mrs. White',
    2, // 'Mina Newell' Paula Fowler?,
    9, //'Place Holder',
  ],
  [
    3, // name: 'Charlie Freeman',
    10, //'Place Holder',
    4, // 'Olive Powers',
    11, //'Place Holder',
    5, // 'Tressa Howe', 
  ],
  [
    12, //'Place Holder',
    6, // name: 'Tom Libby',
    13, //'Place Holder',
    7, // name: 'Chief Aurthur Burns',
    14, //'Place Holder',
  ]
];

const getPersonIdx = (row, col) => {
  return rowColToIndex[row][col];
}

const setJackState = (jacks, index) => {
  jacks[indexToRowCol[index][0]][indexToRowCol[index][1]].ledState = LED_RED;
  return jacks;
}

export {setJackState}
export {rowColToIndex}
export { getPersonIdx }