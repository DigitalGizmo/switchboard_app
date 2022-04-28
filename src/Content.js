const conversations = [
  // Charlie calls Olive
  {
    caller: {row: 0, col: 1}, 
    callee:{row: 1, col: 2},
    helloFile: 'charlie-calls',
    convoFile: 'charlie-olive',
    helloText: "Charlie:  Hi.  72 please.",
    convoText: 
      "Olive:  Hello? <br />" +
      "Charlie:  Hi Olive, it’s Charlie Freeman.  I can’t go tonight. <br />" +
      "Olive:  Why not? <br />" +
      "Charlie:  My dad has a sick patient and he took the car. <br />",
  },  
  // Mina calls fire department
  {
    caller: {row: 1, col: 4}, 
    callee:{row: 0, col: 3},
    helloFile: 'mina-calls',
    convoFile: 'mina-burns',
    helloText: "Mina:  Fire department --",
    convoText: 
      "Chief Burns: Fire station.  Chief Burns speaking <br />" +
      "Mina:  I can smell smoke. <br />" +
      "Chief Burns:  Where are you? <br />" +
      "Mina:  Mrs. Fowlers house.  You know on Maple St. <br />",
  },  
  // Tom calls fire department
  {
    caller: {row: 0, col: 2}, 
    callee:{row: 0, col: 3},
    helloFile: 'tom-calls',
    convoFile: 'tom-burns',
    helloText: "Tom:  Fire!  Fire station. I have to talk to the fire station…Fire!",
    convoText: 
      "Chief Burns: Fire Station. Chief B… <br />" +
      "Tom:  Fire!  In the barn.  My uncle’s trying to get the cows out.  I ran…but… <br />" +
      "Chief Burns:  We’re on our way.  Stay calm, son. <br />",
  },  
];

let jacks = [
  [
    { index: 0,
      name: 'Dr. Freeman',
      number: '82',
      ledState: 0,
      // isPluggedJack: false,
    },
    { index: 1,
      name: 'Charlie',
      number: '56',
      ledState: 0,
      // isPluggedJack: false,
    },
    { index: 2,
      name: 'Tom',
      number: '84',
      ledState: 0,
      // isPluggedJack: false,
    },
    { index: 3,
      name: 'Chief Burns',
      number: '71',
      ledState: 0,
      // isPluggedJack: false,
    },
    { index: 4,
      name: 'Tressa',
      number: '32',
      ledState: 0,
      // isPluggedJack: false,
    },
  ],
  [
    { index: 5,
      name: 'Emma',
      number: '53',
      ledState: 0,
      // isPluggedJack: false,
    },
    { index: 6,
      name: 'Mrs. White',
      number: '51',
      ledState: 0,
      // isPluggedJack: false,
    },
    { index: 7,
      name: 'Olive',
      number: '72',
      ledState: 0,
      // isPluggedJack: false,
    },
    { index: 8,
      name: 'Sally',
      number: '59',
      ledState: 0,
      // isPluggedJack: false,
    },
    { index: 9,
      name: 'Mina',
      number: '24',
      ledState: 0,
      // isPluggedJack: false,
    },
  ]
]
export {conversations};
export {jacks};