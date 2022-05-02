// import { jacks } from './Content.js';

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

const setJackState = (jacks, index) => {
  jacks[indexToRowCol[index][0]][indexToRowCol[index][1]].ledState = LED_RED;
  return jacks;
}

// Maybe jacks array in here instead of in Content
// And this verions get sent as a prop to Panel

export {setJackState}