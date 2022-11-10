const conversations = [
  // index 0, call 1  Charlie calls Olive - Audio 1,2
  {
    caller: {index: 3}, // Charlie Freeman  
    callee:{index: 4}, // Olive Powers  
    helloFile: '1-Charlie_Operator',
    convoFile: '2-Charlie_Calls_Olive',
    retryAfterWrongFile: 'Charlie_WrongNumber_Caller',
    helloText: "Charlie:  Hi.  72 please.",
    convoText: 
      "Olive:  Hello? <br />" +
      "Charlie:  Hi Olive, it’s Charlie Freeman.  I can’t go tonight. <br />" +
      "Olive:  Why not? <br />" +
      "Charlie:  My dad has a sick patient and he took the car. <br />",
  },  
  // index 1. call 2 Mina calls fire department - Audio 3 - 4
  {
    caller: {index: 2},  // Mina Newell  
    callee:{index: 7}, // Fire, Cheif Burns  
    helloFile: '3-Mina_Calls_Operator',
    convoFile: '4-Mina_Calls_ChiefBurns',
    retryAfterWrongFile: 'Mina_WrongNumber_Caller',
    helloText: "Mina:  Fire department --",
    convoText: 
      "Chief Burns: Fire station.  Chief Burns speaking <br />" +
      "Mina:  I can smell smoke. <br />" +
      "Chief Burns:  Where are you? <br />" +
      "Mina:  Mrs. Fowlers house.  You know on Maple St. <br />",
  },  
  // index 2, call 3 Tom calls fire department - audio 5 - 6
  {
    caller: {index: 6}, //  Tom
    callee:{index: 7}, // Chief Burns
    helloFile: '5-Tom_Calls_Operator_1',
    convoFile: '6-Tom_Calls_Burns',
    helloText: "Tom:  Fire!  Fire station. I have to talk to the fire station…Fire!",
    convoText: 
      "Chief Burns: Fire Station. Chief B… <br />" +
      "Tom:  Fire!  In the barn.  My uncle’s trying to get the cows out.  I ran…but… <br />" +
      "Chief Burns:  We’re on our way.  Stay calm, son. <br />",
  },  
  // index 3, call 4 Tressa calls  - Audio 7
  {
    caller: { index: 5}, // Tressa to operator 
    callee:{index: 15}, // None! , 
    helloFile: '7-Tressa_Calls_Operator',
    convoFile: '',
    helloText: "I smell smoke.  Do you know what’s going on?  Any calls with…",
    convoText: 
      "none" ,
  },  
  // index 4 call, 5 Emma calls Olive  - Audio 8-9
  {
    caller: { index: 0}, // Emma to operator 
    callee:{index: 4}, // None!  
    helloFile: '8-Emma_Calls_Operator',
    convoFile: '9-Emma_Calls_Olive',
    retryAfterWrongFile: 'Emma_WrongNumber_Caller',
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
  // index 5 , call 6 Tom to Doctor  Audio 10, 11
  {
    caller: { index: 6}, // Tom Libby
    callee:{index: 3}, //  
    helloFile: '10-Tom_Calls_Operator_2',
    convoFile: '11-Tom_Calls_Charlie',
    helloText: 'I need the doctor.  Doc Freeman.',
    convoText: 
      "Charlie Freeman:  Freeman residence.  " +
      "Tom:  I gotta talk to the Doctor." +
      "Charlie:  He went to see Mrs. White.  Who’s this?  …Hello?  Hello?",
  },  
  // index 6, call 6A  Audio 12-13
  {
    caller: { index: 6}, // Tom Libby
    callee:{index: 1}, // Mrs. White  
    helloFile: '12-Tom_Calls_Operator_3',
    convoFile: '13-Tom_Calls_Mrs.White',
    helloText: 'Operator, operator -- I need Mrs. White’s house. I don’t' + 
    'know Mrs. White.  I gotta find Dr. Freeman.',
    convoText: 'Mrs. Mildred White:  Hello.  White residence. ' +
    'Tom:  Is Dr. Freeman there?',
  },  
  // index 7, call 7 Audio 14
  {
    caller: { index: 6}, // Chief Burns, but from Libby's farm
    callee:{index: 15}, //  Operator only
    helloFile: '14-ChiefBurns_Calls_Operator',
    convoFile: '',
    helloText: 'Chief Burns:  Operator, it’s Chief Burns.  I know half the town is calling,',
    convoText: 
      "none" ,
  },  
  // index 8, call 8 Audio 16-16
  {
    caller: { index: 3}, // Dr. Freeman
    callee:{index: 0}, //  Emma, Village store
    helloFile: '15-Doctor_Calls_Operator',
    convoFile: '16-Doctor_Calls_Store',
    helloText: 'Dr. Freeman:  Village Store, please',
    convoText: 'Emma:  Village Store. ' +
    'Dr. Freeman:  Emma, wondering if you could get...' ,
  },  
 
];

let persons = [
  { // index  0,
    company: 'Village Store',
    name: 'Emma Powers.',
    number: '53',
    ledState: 0,
    wrongNumFile: 'Emma_WrongNumber_Callee',
    isPluggedJack: false, 
  },
  { // index  1,
    company: '',
    name: 'Mildred White',
    number: '51',
    ledState: 0,
    isPluggedJack: false,
  },
  { // index  2,
    company: '',
    name: 'Mina Newell', // Paula Fowler?
    number: '44',
    ledState: 0,
    isPluggedJack: false,
  },
  { // index  3,
    company: 'Dr. Robert Freeman.',
    name: 'Charlie Freeman.',
    number: '56',
    ledState: 0,
    wrongNumFile: 'Charlie_WrongNumber_Callee',
    isPluggedJack: false,
  },
  { // index  4,
    company: '',
    name: 'Olive Powers.',
    number: '72',
    ledState: 0,
    wrongNumFile: 'Olive_WrongNumber_Callee',
    isPluggedJack: false,
  },
  { // index  5,
    company: '',
    name: 'Tressa Howe',
    number: '80',
    ledState: 0,
    isPluggedJack: false,
  },
  { // index  6,
    company: 'Libby Farm',
    name: 'Tom Libby',
    number: '84',
    ledState: 0,
    isPluggedJack: false,
  },
  { // index  7,
    company: 'Fire Department',
    name: 'Chief Aurthur Burns.',
    number: '111',
    ledState: 0,
    wrongNumFile: 'ChiefBurns_WrongNumber_Callee',
  },
  { // index  8,
    company: '',
    name: 'Jane Doe',
    number: '30',
    ledState: 0,
    isPluggedJack: false,
  },
  { // index  9,
    company: '',
    name: 'Paula Fowler',
    number: '50',
    ledState: 0,
    isPluggedJack: false,
  },
  { // index  10,
    company: '',
    name: 'Jane Smith',
    number: '60',
    ledState: 0,
    isPluggedJack: false,
  },
  { // index  11,
    company: '',
    name: 'John Doe',
    number: '75',
    ledState: 0,
    isPluggedJack: false,
  },
  { // index  12,
    company: '',
    name: 'Gary Green',
    number: '82',
    ledState: 0,
    isPluggedJack: false,
  },
  { // index  13,
    company: '',
    name: 'Ruby Red',
    number: '90',
    ledState: 0,
    isPluggedJack: false,
  },
  { // index  14,
    company: '',
    name: 'Barry Black',
    number: '120',
    ledState: 0,
    isPluggedJack: false,
  },
  { // index  15,
    company: '0',
    name: 'Operator',
    number: '999',
    ledState: 0,
    isPluggedJack: false,
  },
  { // index  16,
    company: 'place holder',
    name: 'before real assignment',
    number: '16',
    ledState: 0,
    isPluggedJack: false,
  },
]

export {persons}
export {conversations};
