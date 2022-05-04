
let rowColToIndex = [
  [
    8, // name: 'no name',
    3, // name: 'Charlie Freeman',
    6, // name: 'Tom Libby',
    7, // name: 'Chief Aurthur Burns',
    5, // 'Tressa Howe', 
  ],
  [
    9, // 'Emma Powers'/ place holder?,
    1, // 'Mrs. White',
    4, // 'Olive Powers',
    10, //'Place Holder',
    2, // 'Mina Newell' Paula Fowler?,
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