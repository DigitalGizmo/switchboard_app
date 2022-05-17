const conversations = [
  // 0 Charlie calls Olive - Call 1
  {
    caller: {index: 3}, // Charlie Freeman row: 0, col: 1, 
    callee:{index: 4}, // Olive Powers row: 1, col: 2, 
    audioFile: 'charlie-calls',
    convoFile: 'charlie-olive',
    helloText: "Charlie:  Hi.  72 please.",
    convoText: 
      "Olive:  Hello? <br />" +
      "Charlie:  Hi Olive, it’s Charlie Freeman.  I can’t go tonight. <br />" +
      "Olive:  Why not? <br />" +
      "Charlie:  My dad has a sick patient and he took the car. <br />",
  },  
  // 1 Mina calls fire department - Call 3 - 4
  {
    caller: {index: 2},  // Mina Newell row: 1, col: 4, 
    callee:{index: 7}, // Fire, Cheif Burns row: 0, col: 3, 
    audioFile: '3-Mina_Calls_Operator',
    convoFile: '4-Mina_Calls_ChiefBurns',
    helloText: "Mina:  Fire department --",
    convoText: 
      "Chief Burns: Fire station.  Chief Burns speaking <br />" +
      "Mina:  I can smell smoke. <br />" +
      "Chief Burns:  Where are you? <br />" +
      "Mina:  Mrs. Fowlers house.  You know on Maple St. <br />",
  },  
  // 2 Tom calls fire department - Call 5 - 6
  {
    caller: {index: 6}, // Tom Libby row: 0, col: 2, 
    callee:{index: 7}, // Fire, Burns row: 0, col: 3, 
    audioFile: '5-Tom_Calls_Operator_1',
    convoFile: '6-Tom_Calls_Burns',
    helloText: "Tom:  Fire!  Fire station. I have to talk to the fire station…Fire!",
    convoText: 
      "Chief Burns: Fire Station. Chief B… <br />" +
      "Tom:  Fire!  In the barn.  My uncle’s trying to get the cows out.  I ran…but… <br />" +
      "Chief Burns:  We’re on our way.  Stay calm, son. <br />",
  },  
  // 3 Tressa calls  - Call 7
  {
    caller: { index: 5}, // Tressa to operator row: 0, col: 2,
    callee:{index: 15}, // None! row: 0, col: 3, 
    audioFile: '7-Tressa_Calls_Operator',
    convoFile: '',
    helloText: "I smell smoke.  Do you know what’s going on?  Any calls with…",
    convoText: 
      "none" ,
  },  
  // 4 Emma calls Olive  - Call 8-9
  {
    caller: { index: 0}, // Emma to operator 
    callee:{index: 4}, // None! row: 0, col: 3, 
    audioFile: '8-Emma_Calls_Operator',
    convoFile: '9-Emma_Calls_Olive',
    helloText: "72, please",
    convoText: 
      "Olive: Hello? " +
      "Emma:  Honey, are you OK?   " +
      "Olive:  There’s a fire at the Libbey’s barn! " +
      "Emma:  I heard the fire truck.  You stay inside.  " + 
      "Olive:  I can see the flames and Tom was running  " +
      "Emma: Olive, do you hear me?  You stay there.  I can’t leave the store yet, but I’ll be home soon and.  " +
      "Olive:  Ooo the truck just got there.  " +
      "Emma:  Honey, I don’t like you home alone.  Stay there. " +
      "Olive:  Oh, mom. " +
      "Emma:  Sit tight.  Bye" ,
  },  
];

let persons = [
  { // index  0,
    company: 'Village Store',
    name: 'Emma Powers',
    number: '53',
    ledState: 0,
    // isPluggedJack: false,
  },
  { // index  1,
    company: '',
    name: 'Mildred White',
    number: '51',
    ledState: 0,
    // isPluggedJack: false,
  },
  { // index  2,
    company: '(Paula Fowler?)',
    name: 'Mina Newell',
    number: '44',
    ledState: 0,
    // isPluggedJack: false,
  },
  { // index  3,
    company: 'Dr. Robert Freeman',
    name: 'Charlie Freeman',
    number: '56',
    ledState: 0,
    // isPluggedJack: false,
  },
  { // index  4,
    company: '',
    name: 'Olive Powers',
    number: '72',
    ledState: 0,
    // isPluggedJack: false,
  },
  { // index  5,
    company: '',
    name: 'Tressa Howe',
    number: '80',
    ledState: 0,
    // isPluggedJack: false,
  },
  { // index  6,
    company: 'Libby Farm',
    name: 'Tom Libby',
    number: '84',
    ledState: 0,
    // isPluggedJack: false,
  },
  { // index  7,
    company: 'Fire Department',
    name: 'Chief Aurthur Burns',
    number: '111',
    ledState: 0,
    // isPluggedJack: false,
  },
  { // index  8,
    company: '',
    name: 'Place Holder 1',
    number: '18',
    ledState: 0,
    // isPluggedJack: false,
  },
  { // index  9,
    company: '',
    name: 'Place Holder 2',
    number: '50',
    ledState: 0,
    // isPluggedJack: false,
  },
  { // index  10,
    company: '',
    name: 'Place Holder 3',
    number: '59',
    ledState: 0,
    // isPluggedJack: false,
  },
  { // index  11,
    company: '',
    name: 'Place Holder 4',
    number: '77',
    ledState: 0,
    // isPluggedJack: false,
  },
  { // index  12,
    company: '',
    name: 'Place Holder 5',
    number: '81',
    ledState: 0,
    // isPluggedJack: false,
  },
  { // index  13,
    company: '',
    name: 'Place Holder 6',
    number: '90',
    ledState: 0,
    // isPluggedJack: false,
  },
  { // index  14,
    company: '',
    name: 'Place Holder 7',
    number: '120',
    ledState: 0,
    // isPluggedJack: false,
  },
  { // index  15,
    company: '0',
    name: 'Operator',
    number: '999',
    ledState: 0,
    // isPluggedJack: false,
  },
]

export {persons}
export {conversations};
