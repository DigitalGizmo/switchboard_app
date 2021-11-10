<script>
	import HowTo from "./HowTo.svelte";
	import Panel from "./Panel.svelte";

	let audioCaption = '';
	let caller = [null, null]; // row, col
	let pluggedName = 'caller not yet identified';
	let callee = [null, null]; // row, col
	// one end engaged, other end engaged for each line
	let lineStates = [[false, false], [false, false]];

	const conversations = [
		[[0,1],[1,2]], // Charlie call Olive
		[[1,4], [0,3]] // Mina calls fire department
	];
	let currConvo = 0;
	let prevConvo = null;

	const ROW_PRAM_IDX = 0; // index for row param
	const COL_PRAM_IDX = 1; // index for column param
	const LINE_PRAM_IDX = 2; // index for which line
	const FIRST_PLUG_IDX = 0; // index for first plug of pair
	const SECOND_PLUG_IDX = 1; // index for other plug of pair
	const LED_RED = 1;
	const LED_GREEN = 2;
	const CALLER_COORD_IDX = 0; // caller is first array in convo set
	const CALLEE_COORD_IDX = 1; // caller is second array in convo set


	// $: uppercaseName = name.toUpperCase();
	// $: console.log(name);

	// $: if (name === 'Donaldo') {
	// 	age = 24;
	// }

	function startActivity() {
		audioCaption = "Charlie's line <strong>flashing</strong> <br />"
		// First conversation is first pair in first set
		caller =  conversations[currConvo][CALLER_COORD_IDX]; // [0,1];
		// Set "target", person being called
		callee 	 		 =  conversations[currConvo][CALLEE_COORD_IDX]
		console.log('caller: ' + caller);
		// Light Charlie
		setFlashing(caller)
		// Set one end of this line engaged
	}

	function setFlashing(caller) {
		// Set caller row and column
		jacks[caller[ROW_PRAM_IDX]][caller[COL_PRAM_IDX]].ledState = LED_RED;		
	}

	// --- Handle plug-in ----
	// plugged in the form of [row, col, lineNum]
	function identifyPlugged(plugged) {
		// Get name based on row and col
		pluggedName = jacks[plugged[ROW_PRAM_IDX]][plugged[COL_PRAM_IDX]].name;
		// Debug msg
		audioCaption += 'plugged into: ' + pluggedName + '<br />';
		// console.log(plugged);
		// console.log(caller);

		if (lineStates[plugged[LINE_PRAM_IDX][FIRST_PLUG_IDX]]) { // one end already plugged
			// Determing correct plugin for second end
			// if row and column of plugged matches that of callee
			if (plugged[ROW_PRAM_IDX] === callee[ROW_PRAM_IDX] && 
				plugged[COL_PRAM_IDX] === callee[COL_PRAM_IDX]) {
					console.log('got to 2nd plug equal');
					// Turn led green
					jacks[plugged[ROW_PRAM_IDX]][plugged[COL_PRAM_IDX]].ledState = LED_GREEN;
					// Set first end of this line as in-use
					// pluged[2] is the line index
					lineStates[plugged[LINE_PRAM_IDX][SECOND_PLUG_IDX]] = true;
					// Debug message
					audioCaption += pluggedName + ' on line: ' + plugged[LINE_PRAM_IDX];
			}
		} else { // this is the first plugin for this line
			// Determing correct plugin
			// if row and column of plugged matches that of caller
			if (plugged[ROW_PRAM_IDX] === caller[ROW_PRAM_IDX] && 
				plugged[COL_PRAM_IDX] === caller[COL_PRAM_IDX]) {
					// console.log('got to equal');
					// Turn led green
					jacks[plugged[ROW_PRAM_IDX]][plugged[COL_PRAM_IDX]].ledState = LED_GREEN;
					// Set first end of this line as in-use
					// pluged[2] is the line index
					lineStates[plugged[LINE_PRAM_IDX][FIRST_PLUG_IDX]] = true;
					// Debug message
					audioCaption += pluggedName + ' on line: ' + plugged[LINE_PRAM_IDX] + 
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

