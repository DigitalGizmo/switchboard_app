<script>
	import HowTo from "./HowTo.svelte";
	import Panel from "./Panel.svelte";

	let audioCaption = '';
	let caller = [null, null]; // row, col
	let callersName = 'caller not yet identified';
	let callee = [null, null]; // row, col
	// one end engaged, other end engaged for each line
	let lineStates = [[false, false], [false, false]];

	const conversations = [
		[[0,1],[1,2]], // Charlie call Olive
		[[1,4], [0,3]] // Mina calls fire department
	];
	let currConvo = 0;
	let prevConvo = null;

	// $: uppercaseName = name.toUpperCase();
	// $: console.log(name);

	// $: if (name === 'Donaldo') {
	// 	age = 24;
	// }

	function startActivity() {
		audioCaption = "Charlie's line <strong>flashing</strong> <br />"
		// First conversation is first pair in first set
		caller =  conversations[currConvo][0]; // [0,1];
		// Set "target", person being called
		callee 	 		 =  conversations[currConvo][1]
		console.log('caller: ' + caller);
		// Light Charlie
		setFlashing(caller)
		// Set one end of this line engaged
	}

	function setFlashing(caller) {
		// Set caller row and column
		jacks[caller[0]][caller[1]].ledState = 1;		
	}

	// --- Handle plug-in ----
	// plugged in the form of [row, col, lineNum]
	function identifyPlugged(plugged) {
		// Get name based on row and col
		callersName = jacks[plugged[0]][plugged[1]].name;
		// Debug msg
		audioCaption += 'plugged into: ' + callersName + '<br />';
		// console.log(plugged);
		// console.log(caller);

		if (lineStates[plugged[2][0]]) { // one end already plugged
			// Determing correct plugin for second end
			// if row and column of plugged matches that of callee
			if (plugged[0] === callee[0] && plugged[1] === callee[1]) {
				console.log('got to 2nd plug equal');
				// Turn led green
				jacks[plugged[0]][plugged[1]].ledState = 2;
				// Set first end of this line as in-use
				// pluged[2] is the line index
				lineStates[plugged[2][1]] = true;
				// Debug message
				audioCaption += callersName + ' on line: ' + plugged[2];
			}
		} else { // this is the first plugin for this line
			// Determing correct plugin
			// if row and column of plugged matches that of caller
			if (plugged[0] === caller[0] && plugged[1] === caller[1]) {
				// console.log('got to equal');
				// Turn led green
				jacks[plugged[0]][plugged[1]].ledState = 2;
				// Set first end of this line as in-use
				// pluged[2] is the line index
				lineStates[plugged[2][0]] = true;
				// Debug message
				audioCaption += callersName + ' on line: ' + plugged[2] + 
					' asks for 72 (Olive) <br />';
			}
		}
	}

	// setInterval(myTimer, 1000);

	// function myTimer() {
	//   const d = new Date();
	//   document.getElementById("demo").innerHTML = d.toLocaleTimeString();
	// }	
	// function newName(event) {
	// 	name = event.target.value;
	// }

  // Jacks
  let jacks = [
    [
      { index: 0,
        name: 'Dr. Freeman',
        number: '82',
        ledState: 0, 
      },
      { index: 1,
        name: 'Charlie',
        number: '56',
        ledState: 0, 
      },
      { index: 2,
        name: 'Tom',
        number: '94',
        ledState: 0, 
      },
      { index: 3,
        name: 'Chief Burns',
        number: '71',
        ledState: 0, 
      },
      { index: 4,
        name: 'Tressa',
        number: '32',
        ledState: 0, 
      },
    ],
    [
      { index: 5,
        name: 'Emma',
        number: '53',
        ledState: 0, 
      },
      { index: 6,
        name: 'Mrs. White',
        number: '51',
        ledState: 0, 
      },
      { index: 7,
        name: 'Olive',
        number: '72',
        ledState: 0, 
      },
      { index: 8,
        name: 'Sally',
        number: '59',
        ledState: 0, 
      },
      { index: 9,
        name: 'Mina',
        number: '24',
        ledState: 0, 
      },
    ]
  ]

</script>

<style>
	/*none*/
</style>

<header>
  <h5>Switchboard Project 
  	<button on:click="{startActivity}">Start</button>
	</h5>
  <h1>You're the Operator!</h1>
</header>

<div id="wrapper">      
	<HowTo 
		{audioCaption}
	/>
	<Panel 
		{jacks}
		{identifyPlugged}
	/>
</div><!-- /wrapper -->

