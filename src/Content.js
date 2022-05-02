const conversations = [
  // Charlie calls Olive - Call 1
  {
    caller: {row: 0, col: 1, id: 1}, // Charlie Freeman
    callee:{row: 1, col: 2, id: 7}, // Olive Powers
    audioFile: 'charlie-calls',
    convoFile: 'charlie-olive',
    helloText: "Charlie:  Hi.  72 please.",
    convoText: 
      "Olive:  Hello? <br />" +
      "Charlie:  Hi Olive, it’s Charlie Freeman.  I can’t go tonight. <br />" +
      "Olive:  Why not? <br />" +
      "Charlie:  My dad has a sick patient and he took the car. <br />",
  },  
  // Mina calls fire department - Call 2
  {
    caller: {row: 1, col: 4, id: 9},  // Mina Newell 
    callee:{row: 0, col: 3, id: 3}, // Fire, Cheif Burns
    audioFile: 'mina-calls',
    convoFile: 'mina-burns',
    helloText: "Mina:  Fire department --",
    convoText: 
      "Chief Burns: Fire station.  Chief Burns speaking <br />" +
      "Mina:  I can smell smoke. <br />" +
      "Chief Burns:  Where are you? <br />" +
      "Mina:  Mrs. Fowlers house.  You know on Maple St. <br />",
  },  
  // Tom calls fire department - Call 3
  {
    caller: {row: 0, col: 2, id: 2}, // Tom Libby
    callee:{row: 0, col: 3, id: 3}, // Fire, Burns
    audioFile: 'tom-calls',
    convoFile: 'tom-burns',
    helloText: "Tom:  Fire!  Fire station. I have to talk to the fire station…Fire!",
    convoText: 
      "Chief Burns: Fire Station. Chief B… <br />" +
      "Tom:  Fire!  In the barn.  My uncle’s trying to get the cows out.  I ran…but… <br />" +
      "Chief Burns:  We’re on our way.  Stay calm, son. <br />",
  },  
  // Tressa calls  - Call 4
  {
    caller: {row: 0, col: 2, id: 4}, // Tressa to operator
    callee:{row: 0, col: 3, id: 0}, // None!
    audioFile: '',
    convoFile: '',
    helloText: "I smell smoke.  Do you know what’s going on?  Any calls with…",
    convoText: 
      "none" ,
  },  
];

let jacks = [
  [
    { id: 0,
      company: '',
      name: 'no name',
      number: '82',
      ledState: 0,
      // isPluggedJack: false,
    },
    { id: 1,
      company: 'Dr. Robert Freeman',
      name: 'Charlie Freeman',
      number: '56',
      ledState: 0,
      // isPluggedJack: false,
    },
    { id: 2,
      company: 'Libby Farm',
      name: 'Tom Libby',
      number: '84',
      ledState: 0,
      // isPluggedJack: false,
    },
    { id: 3,
      company: 'Fire Department',
      name: 'Chief Aurthur Burns',
      number: '111',
      ledState: 0,
      // isPluggedJack: false,
    },
    { id: 4,
      company: '',
      name: 'Tressa Howe',
      number: '80',
      ledState: 0,
      // isPluggedJack: false,
    },
  ],
  [
    { id: 5,
      company: 'Village Store',
      name: 'Emma Powers',
      number: '53',
      ledState: 0,
      // isPluggedJack: false,
    },
    { id: 6,
      company: '',
      name: 'Mrs. White',
      number: '51',
      ledState: 0,
      // isPluggedJack: false,
    },
    { id: 7,
      company: '',
      name: 'Olive Powers',
      number: '72',
      ledState: 0,
      // isPluggedJack: false,
    },
    { id: 8,
      company: '',
      name: 'Place Holder',
      number: '59',
      ledState: 0,
      // isPluggedJack: false,
    },
    { id: 9,
      company: '',
      name: 'Mina Newell',
      number: '44',
      ledState: 0,
      // isPluggedJack: false,
    },
  ]
]
export {conversations};
export {jacks};