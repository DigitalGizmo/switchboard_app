<script>
	import HowTo from "./HowTo.svelte";
	import Panel from "./Panel.svelte";

	let audioCaption = '';
	let caller = [null, null]; // row, col
	let pluggedName = 'caller not yet identified';
	let callee = [null, null]; // row, col
	// one end engaged, other end engaged for each line
	let lineStates = [[false, false], [false, false]];
	// ledStates are attached to each person
	// Guess we need to store who is on what connected line
	// so we can reset their states on un-plug
	// Maybe use values for lineStates [-1, -1] default then
	// store person indexes. 
	// Test for >= 0 instead of true

	const conversations = [
		[[0,1],[1,2]], // Charlie call Olive
		[[1,4], [0,3]] // Mina calls fire department
	];
	// const conversations = [
	// 	{caller: {row: 0, col: 1}, callee:{row: 1, col: 2}}, // Charlie call Olive
	// 	[[1,4], [0,3]] // Mina calls fire department
	// ];

	let currConvo = 0;
	let prevConvo = null;

	const ROW_PRAM_IDX = 0; // index for row param
	const COL_PRAM_IDX = 1; // index for column param
	const LINE_PRAM_IDX = 2; // index for which line
	const FIRST_PLUG_USED_IDX = 0; // index for plug used (left or right)
	const SECOND_PLUG_USED_IDX = 1; // index for other plug of pair
	const LED_RED = 1;
	const LED_GREEN = 2;
	const CALLER_COORD_IDX = 0; // caller is first array in convo set
	const CALLEE_COORD_IDX = 1; // caller is second array in convo set

	let lineIdxInUse = null;

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
	// plugged in the form of [row index, col index, line index]
	function identifyPlugged(pluggedInfo) {
		// Get name based on row and col
		pluggedName = jacks[pluggedInfo.row][pluggedInfo.col].name;
		// Debug msg
		audioCaption += 'plugged into: ' + pluggedName + '<br />';
		// console.log(plugged);
		// console.log(caller);

		if (!lineStates[pluggedInfo.lineIdx[FIRST_PLUG_USED_IDX]]) { 
			// First plugged used is NOT true
			// No plug has been successfully used for this line
			// Did user correctly plug into caller?
			// if row and column of plugged matches that of caller
			if (pluggedInfo.row === caller[ROW_PRAM_IDX] && 
				pluggedInfo.col === caller[COL_PRAM_IDX]) {
					// console.log('got to equal');
					// Turn led green
					jacks[pluggedInfo.row][pluggedInfo.col].ledState = LED_GREEN;
					// Set first end of this line as in-use
					lineStates[pluggedInfo.lineIdx[FIRST_PLUG_USED_IDX]] = true;
					// Set this line in use only we have gotten this success
					lineIdxInUse = pluggedInfo.lineIdx;
					console.log(' setting lineIdxInUse to: ' + lineIdxInUse);
					// Debug message
					audioCaption += pluggedName + ' on line: ' + pluggedInfo.lineIdx + 
						' asks for 72 (Olive) <br />';
			}
		} else { 
			// First line used IS TRUE, so we might be on the other plug
			// But first, is this the line in use?
				console.log(' in else,  lineIdxInUse use is: ' + lineIdxInUse);
			if (lineIdxInUse === pluggedInfo.lineIdx) {
				// one end already plugged
				// Determing correct plugin for second end
				// if row and column of plugged matches that of callee
				if (pluggedInfo.row === callee[ROW_PRAM_IDX] && 
					pluggedInfo.col === callee[COL_PRAM_IDX]) {
						console.log('got to 2nd plug equal');
						// Turn led green
						jacks[pluggedInfo.row][pluggedInfo.col].ledState = LED_GREEN;
						// Set first end of this line as in-use
						lineStates[pluggedInfo.lineIdx[SECOND_PLUG_USED_IDX]] = true;
						// Debug message
						audioCaption += pluggedName + ' on line: ' + pluggedInfo.lineIdx;
				} // end if plug match
			} // end if this is the line in use
		} // end else
	} // end identifyPlugged

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

