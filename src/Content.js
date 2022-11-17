const conversations = [
  // index 0, call 1  Charlie calls Olive - Audio 1,2
  {
    caller: {index: 3}, // Charlie Freeman  
    callee:{index: 4}, // Olive Powers  
    helloFile: '1-Charlie_Operator',
    convoFile: '2-Charlie_Calls_Olive',
    retryAfterWrongFile: 'Charlie_WrongNumber_Olive',
    helloText: "Charlie:  Hi.  72 please.",
    convoText: 
      "Olive:  Hello? <br />" +
      "Charlie:  Hi Olive, it’s Charlie.  Bowling's off. <br />" +
      "Olive:  What's wrong? <br />" +
      "Charlie:  My dad has a sick patient and he took the car. <br/>" +
      "Olive:  I suppose that’s what it’s like when your dad’s a doctor. <br/>" +
      "Charlie: Yeh.  He said I can’t hang out if he’s not here. <br/>" +
      "Olive: That’s OK.  Maybe my mom can take us tomorrow. <br/>" +
      "Charlie: That’d be cool.  But I gotta go.  Bye. <br/>" +
      "Olive: Bye, bye."
  },  
  // index 1. call 2 Mina calls fire department - Audio 3 - 4
  {
    caller: {index: 2},  // Mina Newell  
    callee:{index: 7}, // Fire, Cheif Burns  
    helloFile: '3-Mina_Calls_Operator',
    convoFile: '4-Mina_Calls_Burns',
    retryAfterWrongFile: 'Mina_WrongNumber_FireStation',
    helloText: "Mina:  Fire department --",
    convoText: 
      "Chief Burns: Fire station.  Chief Burns here. <br/>" +
      "Mina:  I can smell smoke. <br />" +
      "Chief Burns:  Where are you? <br />" +
      "Mina:  Mrs. Fowlers house.  You know on Maple St. <br/>" +
      "Chief Burns: Is there smoke in the house? <br/>" +
      "Mina:  No, I was like outside riding my bike and she said to ring you.<br/>" +
      "Chief Burns:  OK. Thanks, we’ll check it out."
  },  
  // index 2, call 3 Tom calls fire department - audio 5 - 6
  {
    caller: {index: 6}, //  Tom
    callee:{index: 7}, // Chief Burns
    helloFile: '5-Tom_Calls_Operator_1',
    convoFile: '6-Tom_Calls_Burns',
    retryAfterWrongFile: 'Tom_WrongNumber_FireStation',
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
    retryAfterWrongFile: '',
    helloText: "Tressa:  I smell smoke.  Do you know what’s going on?  Any calls with… <br/>" +
    "Background: Hey Tressa, did you hear? There’s a fire at Libby’s Farm. <br/>" +
    "Tressa:  Never mind",
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
      "Olive: Hello? <br/>" +
      "Emma:  Honey, are you OK?  <br/> " +
      "Olive:  There’s a fire at the Libbey’s barn! <br/>" +
      "Emma:  I heard the fire truck.  You stay inside. <br/> " + 
      "Olive:  I can see the flames and Tom was running <br/> " +
      "Emma: Olive, do you hear me?  You stay there.  I can’t leave the store yet, but I’ll be home soon and.  <br/>" +
      "Olive:  Ooo the truck just got there.  <br/>" +
      "Emma:  Honey, I don’t like you home alone.  Stay there. <br/>" +
      "Olive:  Oh, mom. <br/>" +
      "Emma:  Sit tight.  Bye" ,
  },  
  // index 5 , call 6 Tom to Doctor  Audio 10, 11
  {
    caller: { index: 6}, // Tom Libby
    callee:{index: 3}, //  
    helloFile: '10-Tom_Calls_Operator_2',
    convoFile: '11-Tom_Calls_Charlie',
    retryAfterWrongFile: 'Tom_WrongNumber_Dr',
    helloText: 'I need the doctor.  Doc Freeman.',
    convoText: 
      "Charlie Freeman:  Freeman residence.  <br/>" +
      "Tom:  I gotta talk to the Doctor. <br/>" +
      "Charlie:  He went to see Mrs. White.  Who’s this?  …Hello?  Hello?",
  },  
  // index 6, call 6A Tom to Mrs White Audio 12-13
  {
    caller: { index: 6}, // Tom Libby
    callee:{index: 1}, // Mrs. White  
    helloFile: '12-Tom_Calls_Operator_3',
    convoFile: '13-Tom_Calls_Mrs.White',
    retryAfterWrongFile: 'Tom_WrongNumber_MrsWhite',
    helloText: 'Operator, operator -- I need Mrs. White’s house. I don’t' + 
    'know Mrs. White.  I gotta find Dr. Freeman.',
    convoText: 'Mrs. Mildred White:  Hello.  White residence. <br/>' +
    "Tom:  Is Dr. Freeman there? <br/>" +
    "Mrs. Mildred White:  Why yes, how did you know?  He’s right <br/>" +
    "Tom:  I gotta talk to him.  <br/>" +
    "Mrs.  Mildred White:  O dear all right…(off phone) It’s for you, Doctor.  <br/>" +
    "Dr. Freeman:  Yes? <br/>" +
    "Tom:  We got a fire, Doctor, and Mikey’s coughing and coughing.  You know the smoke… <br/>" +
    "Dr. Freeman:  Who is this? <br/>" +
    "Tom:   Tom Libby.  The barn’s burned, we’re Ok, but you better see Mikey. <br/>" +
    "Dr. Freeman:  All right, Tom.  Keep him sitting up and give him some water, if he’ll take it.  And why don’t you sit down and have a glass of water, too.  I’m glad you found me.  I’ll be right over."

  },  
  // index 7, call 7 Audio 14
  {
    caller: { index: 6}, // Chief Burns, but from Libby's farm
    callee:{index: 15}, //  Operator only
    helloFile: '14-ChiefBurns_Calls_Operator',
    convoFile: '',
    retryAfterWrongFile: '',
    helloText: "Chief Burns:  Operator, it’s Chief Burns.  I know half the town is calling, so please reassure people; no people or animals were harmed, but the barn burned to the ground.  No one will be at the station for a bit until we get cleaned up here, so any emergencies, ring me here at the Libby’s, please.  Thanks, Bye",
    convoText: 
      "none" ,
  },  
  // index 8, call 8 Dr. Freeman calls Village Store, Audio 16-16
  {
    caller: { index: 3}, // Dr. Freeman
    callee:{index: 0}, //  Emma, Village store
    helloFile: '15-Doctor_Calls_Operator',
    convoFile: '16-Doctor_Calls_Store',
    retryAfterWrongFile: '',
    helloText: 'Dr. Freeman:  Village Store, please',
    convoText: 'Emma:  Village Store. <br/>' +
    "Dr. Freeman:  Emma, wondering if you could get some supplies over here to the Libby’s.  They’re in a bit of shock with the fire aftermath and all. <br/>" +
    "Emma:  O my yes.  We can do that.  And don’t you worry about the charge. <br/>" +
    "Dr. Freeman:  That’s good of you Emma.  And in case, you were looking for Olive, she’s right here. <br/>" +
    "Emma:  That girl!  I told her to stay home…she’s… <br/>" +
    "Dr. Freeman:  it’s OK.  She’s fine.  I think she just likes to be in the center of the action. <br/>" +
    "Emma:  Well, thank you, Doctor.  I’ll bring the things myself.  Just hold her there. <br/>" +
    "Dr. Freeman:  Thanks, bye. <br/>" +
    "Emma: Bye.",
  },  
 
];

let persons = [
  { // index  0,
    company: 'Village Store',
    name: 'Emma Powers',
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
    wrongNumFile: 'MrsWhite_WrongNumber_Callee',
    isPluggedJack: false,
  },
  { // index  2,
    company: '',
    name: 'Mina Newell', // Paula Fowler?
    number: '44',
    ledState: 0,
    wrongNumFile: 'Mina_WrongNumber_Callee',
    isPluggedJack: false,
  },
  { // index  3,
    company: 'Dr. Freeman',
    name: 'Charlie Freeman',
    number: '56',
    ledState: 0,
    wrongNumFile: 'Charlie_WrongNumber_Callee',
    isPluggedJack: false,
  },
  { // index  4,
    company: '',
    name: 'Olive Powers',
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
    wrongNumFile: '',
    isPluggedJack: false,
  },
  { // index  6,
    company: 'Libby Farm',
    name: 'Tom Libby',
    number: '84',
    ledState: 0,
    wrongNumFile: 'Tom_WrongNumber_Callee',
    isPluggedJack: false,
  },
  { // index  7,
    company: 'Fire Department',
    name: 'Chief Burns',
    number: '111',
    ledState: 0,
    wrongNumFile: 'ChiefBurns_WrongNumber_Callee',
    isPluggedJack: false,
  },
  { // index  8,
    company: '',
    name: 'Ruby Red',
    number: '30',
    ledState: 0,
    wrongNumFile: 'Cleo_WrongNumber_Callee',
    isPluggedJack: false,
  },
  { // index  9,
    company: '',
    name: 'Stella Felt', // Paula Fowler
    number: '50',
    ledState: 0,
    wrongNumFile: 'Felt_WrongNumber_Callee',
    isPluggedJack: false,
  },
  { // index  10,
    company: '',
    name: 'Luther Whitman',
    number: '60',
    ledState: 0,
    wrongNumFile: 'Luther_WrongNumber_Callee',
    isPluggedJack: false,
  },
  { // index  11,
    company: '',
    name: 'Gary Green',
    number: '75',
    ledState: 0,
    wrongNumFile: 'TroyBacon_WrongNumber_Callee',
    isPluggedJack: false,
  },
  { // index  12,
    company: '',
    name: 'Troy Bacon',
    number: '82',
    ledState: 0,
    wrongNumFile: 'TroyBacon_WrongNumber_Callee',
    isPluggedJack: false,
  },
  { // index  13,
    company: '',
    name: 'Cleo Bryant',
    number: '90',
    ledState: 0,
    wrongNumFile: 'Cleo_WrongNumber_Callee',
    isPluggedJack: false,
  },
  { // index  14,
    company: '',
    name: 'Barry Black',
    number: '120',
    ledState: 0,
    wrongNumFile: '',
    isPluggedJack: false,
  },
  { // index  15,
    company: '0',
    name: 'Operator',
    number: '999',
    ledState: 0,
    wrongNumFile: '',
    isPluggedJack: false,
  },
  { // index  16,
    company: 'place holder',
    name: 'before real assignment',
    number: '16',
    ledState: 0,
    wrongNumFile: '',
    isPluggedJack: false,
  },
]

export {persons}
export {conversations};
