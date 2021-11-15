<script>
	import HowTo from "./HowTo.svelte";
	import Panel from "./Panel.svelte";

	let audioCaption = "Your're the operator!";
	let debugCaption = "Press Start";
	let caller = [null, null]; // row, col
	let pluggedName = 'caller not yet identified';
	let callee = [null, null]; // row, col
	// let audioTrack = null;
	let audioTrack = new Audio("https://dev.digitalgizmo.com/msm-ed/ed-assets/audio/charlie-calls.mp3");

	const phoneLines = [
		{
			onePlugIsIn: false, 
			isEngaged: false,
			caller: {row: null, col: null, isPlugged: false},
			callee: {row: null, col: null, isPlugged: false},
		}, 
		{
			onePlugIsIn: false, 
			isEngaged: false,
			caller: {row: null, col: null, isPlugged: false},
			callee: {row: null, col: null, isPlugged: false},
		}, 
	];

	// phoneLines could be attached to each person
	// Guess we need to store who is on what connected line
	// so we can reset their states on un-plug
	// Maybe use values for phoneLines [-1, -1] default then
	// store person indexes. 
	// Test for >= 0 instead of true

	const conversations = [
		// Charlie calls Olive
		{
			caller: {row: 0, col: 1}, 
			callee:{row: 1, col: 2},
			helloTrack: 'charlie-calls',
			convoTrack: 'charlie-olive',
		},  
		// // Mina calls fire department
		{
			caller: {row: 1, col: 4}, 
			callee:{row: 0, col: 3},
			helloTrack: 'mina-calls',
			convoTrack: 'mina-burns',
		},  
	];

	let currConvo = 0;
	let prevConvo = null;

	const LED_OFF = 0;
	const LED_RED = 1;
	const LED_GREEN = 2;

	let lineIdxInUse = null;

	// $: uppercaseName = name.toUpperCase();
	// $: console.log(name);

	// $: if (name === 'Donaldo') {
	// 	age = 24;
	// }

	function initiateCall() {
		// Stop any converstaion that might be in progress
		// audioTrack.pause();
		// First conversation is first pair in first set
		caller =  conversations[currConvo].caller; // [0,1];
		// Set "target", person being called
		callee 	 		 =  conversations[currConvo].callee;
		// console.log('caller: ' + caller);
		// Light Charlie
		audioCaption = "You need to plug into " +
		" ..." +
		"'s line. <br />"

		setIncoming(caller)
		// Set one end of this line engaged
	}


	function setIncoming(caller) {
    playAudio('buzzer');
		// Set caller row and column
		jacks[caller.row][caller.col].ledState = LED_RED;		
	}

	function playAudio(audioName){
		// Cuts off on ring if here
		// audioTrack.pause();

    audioTrack = new Audio("https://dev.digitalgizmo.com/msm-ed/ed-assets/audio/" + audioName + ".mp3");
    audioTrack.play();
	}	

	function setTimer(timeToWait) {
	  // myVar = 
	  setTimeout(function(){ 
			currConvo = 1;
			prevConvo = 0;
	  	initiateCall(); 
	  }, timeToWait);
	}


	// --- Handle plug-in ----
	// plugged in the form of [row index, col index, line index]
	function identifyPlugged(pluggedInfo) {
		// Params sent in plugged info- all indexes -- row: col: lineIdx
		// Get name based on row and col
		pluggedName = jacks[pluggedInfo.row][pluggedInfo.col].name;
		// Debug msg
		debugCaption += 'plugged into: ' + pluggedName + '<br />';
		// console.log(plugged);
		// console.log(caller);

		if (!phoneLines[pluggedInfo.lineIdx].onePlugIsIn) { 
			// phoneLines for line in question, test onePlugIsIn value
			// New use of line --First plugged used is NOT true, aka false
			// Did user correctly plug into caller?
			// if row and column of plugged matches that of caller
			if (pluggedInfo.row === caller.row && 
				pluggedInfo.col === caller.col) {
					// console.log('got to equal');
					// Turn led green
					jacks[pluggedInfo.row][pluggedInfo.col].ledState = LED_GREEN;
					// Set this line in use only we have gotten this success
					lineIdxInUse = pluggedInfo.lineIdx;
					// console.log(' setting lineIdxInUse to: ' + lineIdxInUse);
					// Set first end of this line as in-use
					// and Record caller for later unplug
					setPhoneLineCaller(pluggedInfo);
					// User message
					audioCaption = "You'll need to plug into the jack for the" + 
					"person the caller is askig for"
					// Debug message
					debugCaption += pluggedName + ' on line: ' + pluggedInfo.lineIdx + 
						' asks for 72 (Olive) <br />';
					// Stop buzzer
					audioTrack.pause();
					
					playAudio(conversations[currConvo].helloTrack);
			}
		} else { 
			// First line used IS TRUE, so we might be on the other plug
			// But first, is this the line in use?
				// console.log(' in else,  lineIdxInUse use is: ' + lineIdxInUse);
			if (lineIdxInUse === pluggedInfo.lineIdx) {
				// one end already plugged
				// Determing correct plugin for second end
				// if row and column of plugged matches that of callee
				if (pluggedInfo.row === callee.row && 
					pluggedInfo.col === callee.col) {
						// console.log('got to 2nd plug equal');
						// Turn led green
						jacks[pluggedInfo.row][pluggedInfo.col].ledState = LED_GREEN;
						// Set this line as engaged
						phoneLines[pluggedInfo.lineIdx].isEngaged = true;
						// Record callee for later unplug
						setPhoneLineCallee(pluggedInfo);
						audioTrack.pause();
						playAudio(conversations[currConvo].convoTrack);
						// User messag message
						audioCaption = 'Good job, conversation under way';
						// Set timer for next call
						// Temp hard-wire to interrupt first only
						if (currConvo === 0) {
							setTimer(9000);							
						}
						// Debug message
						debugCaption += pluggedName + ' on line: ' + pluggedInfo.lineIdx;
				} // end if plug match
			} // end if this is the line in use
		} // end else
	} // end identifyPlugged

	function setPhoneLineCaller(pluggedInfo) {
		phoneLines[pluggedInfo.lineIdx].onePlugIsIn = true;
		// Set caller 
		phoneLines[pluggedInfo.lineIdx].caller.row = 
			pluggedInfo.row;
		phoneLines[pluggedInfo.lineIdx].caller.col = 
			pluggedInfo.col;
	}

	function setPhoneLineCallee(pluggedInfo) {
		// Set callee 
		phoneLines[pluggedInfo.lineIdx].callee.row = 
			pluggedInfo.row;
		phoneLines[pluggedInfo.lineIdx].callee.col = 
			pluggedInfo.col;
	}

	function unPlug(lineIndex) {
		// console.log('ready to unplug line: ' + lineIndex);
		// console.log('-- unplug: ' + phoneLines[lineIndex]);
		// console.log('-- unplug caller row: ' + 
			// phoneLines[lineIndex].caller.row);
		// Clear the line settings
		phoneLines[lineIndex].onePlugIsIn = false;
		phoneLines[lineIndex].isEngaged = false;
		// Turn of the leds
		jacks[phoneLines[lineIndex].caller.row][phoneLines[lineIndex].caller.col].ledState = LED_OFF;
		jacks[phoneLines[lineIndex].callee.row][phoneLines[lineIndex].callee.col].ledState = LED_OFF;
		// jacks[pluggedInfo.row][pluggedInfo.col].ledState = LED_GREEN
		// Stop the audio
		audioTrack.pause();
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
  	<button on:click="{initiateCall}">Start</button>
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
		{unPlug}
		{phoneLines}
	/>

	<p>Debug: {debugCaption}</p>
</div><!-- /wrapper -->

