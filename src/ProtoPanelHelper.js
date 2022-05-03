import { persons } from './Content.js';

const indexToRowCol = [
  [1,0], // 0 Village store
  [1,1],  // 1 M White
  [1,4],  // 2 Mina / Paula
  [0,1],  // 3 Charlie Freeman
  [1,2],  // 4 Olive
  [0,4],  // 5 Tressa Howe
  [0,2],  // 6 Tom Libby
  [0,3],  // 7 Fire Burns
]

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

const getPerson = (row, col) => {
  personIndex = rowColToIndex[row][col];
  console.log('person index: ' + personIndex);
  // return persons[personIndex];
  // return personIndex;
  return persons[personIndex].number;
}

// const getPerson = (row, col) => {
//   for (let i = 0; i < rowColToIndex.length; i++) {

//   }
// }

const setJackState = (jacks, index) => {
  jacks[indexToRowCol[index][0]][indexToRowCol[index][1]].ledState = LED_RED;
  return jacks;
}

// Maybe jacks array in here instead of in Content
// And this verions get sent as a prop to Panel

export {setJackState}
export {rowColToIndex}
export { getPerson }