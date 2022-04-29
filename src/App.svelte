<script>
	import HowTo from "./HowTo.svelte";
	import Panel from "./Panel.svelte";
	import { conversations, jacks } from './Content.js';

	let audioCaption = "Transcript: ";
	let debugCaption = "Press Start";
	let caller = [null, null]; // row, col
	let pluggedName = 'caller not yet identified';
	let callee = [null, null]; // row, col
	// let convoTrack = null;
	// let convoTrack = new Audio("https://dev.digitalgizmo.com/msm-ed/ed-assets/audio/charlie-calls.mp3");
	let buzzTrack = new Audio("https://dev.digitalgizmo.com/msm-ed/ed-assets/audio/buzzer.mp3");

	const phoneLines = [
		{
			onePlugIsIn: false, 
			isEngaged: false,
			caller: {row: null, col: null, isPlugged: false},
			callee: {row: null, col: null, isPlugged: false},
			convoTrack: new Audio("https://dev.digitalgizmo.com/msm-ed/ed-assets/audio/charlie-calls.mp3"),
		}, 
		{
			onePlugIsIn: false, 
			isEngaged: false,
			caller: {row: null, col: null, isPlugged: false},
			callee: {row: null, col: null, isPlugged: false},
			convoTrack: new Audio("https://dev.digitalgizmo.com/msm-ed/ed-assets/audio/charlie-calls.mp3"),
		}, 
	];

	// phoneLines could be attached to each person
	// Guess we need to store who is on what connected line
	// so we can reset their states on un-plug
	// Maybe use values for phoneLines [-1, -1] default then
	// store person indexes. 
	// Test for >= 0 instead of true


	let currConvo = 0;
	let prevConvo = null;


	const LED_OFF = 0;
	const LED_RED = 1;
	const LED_GREEN = 2;

	let lineIdxInUse = -1;
	let lineIdxPrev = -1;

	// $: uppercaseName = name.toUpperCase();
	// $: console.log(name);

	// $: if (name === 'Donaldo') {
	// 	age = 24;
	// }

	function initiateCall() {
		// Stop any converstaion that might be in progress
		// convoTrack.pause();
		// First conversation is first pair in first set
		caller =  conversations[currConvo].caller; // [0,1];
		// Set "target", person being called
		callee =  conversations[currConvo].callee;

		// console.log('caller: ' + caller);
		// audioCaption = "in init: Charlie:  Hi.  72 please."

		// Light Charlie
		setIncoming(caller)
		// Set one end of this line engaged
	}


	function setIncoming(caller) {
    // playBuzzer();
    buzzTrack.play();
    buzzTrack.volume = .2;    
		// Set caller row and column
		jacks[caller.row][caller.col].ledState = LED_RED;		
	}

	// isFullConvo is false for initiation , true for convo
	function playConvo(audioName, isFullConvo, lineIndex){
		phoneLines[lineIndex].convoTrack =
     new Audio("https://dev.digitalgizmo.com/msm-ed/ed-assets/audio/" + audioName + ".mp3");
    phoneLines[lineIndex].convoTrack.play();
    if (isFullConvo) {
			phoneLines[lineIndex].convoTrack.addEventListener("ended", function(){
			     phoneLines[lineIndex].convoTrack.currentTime = 0;
			     console.log(" -- Audio ended on lineIdx: " + lineIndex);
			     setCallFinished(lineIndex);
			});    	
    } // end if
	}	

	// function playBuzzer(){
 //    buzzTrack.play();
	// }	

	function setTimeToNext(timeToWait) {
	  setTimeout(startNextCall, timeToWait);
	}

	function startNextCall() {
		currConvo += 1;
		prevConvo += 1;
  	initiateCall(); 
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

		// Fresh plugged
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

					// Set jack to plugged
					// jacks[pluggedInfo.row][pluggedInfo.col].isPluggedJack = true;

					// Set first end of this line as in-use
					// and Record caller for later unplug
					setPhoneLineCaller(pluggedInfo);

					// User message
					audioCaption = conversations[currConvo].helloText;

					// Debug message
					debugCaption += pluggedName + ' on line: ' + pluggedInfo.lineIdx + 
						' asks for 72 (Olive) <br />';
					// Stop buzzer and other convo
					buzzTrack.pause();

					// Stop previous conversation, if there is one
					// phoneLines[pluggedInfo.lineIdx].convoTrack.pause();
					console.log(' - lineIdxPrev: ' + lineIdxPrev);
					if (lineIdxPrev >= 0) {
						phoneLines[lineIdxPrev].convoTrack.volume = 0;
					}

					// phoneLines[lineIdxPrev].convoTrack.volume = 0.1;

					// Set this line in use only we have gotten this success
					lineIdxInUse = pluggedInfo.lineIdx;
					// Set prev for use in next call.
					lineIdxPrev = lineIdxInUse;
					// console.log(' setting lineIdxInUse to: ' + lineIdxInUse);


					// false is for isConvo -- don't detect end
					playConvo(conversations[currConvo].helloFile, false, 
						pluggedInfo.lineIdx);
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

						// // Set jack to plugged
						// jacks[pluggedInfo.row][pluggedInfo.col].isPluggedJack = true;
						
						// Set this line as engaged
						phoneLines[pluggedInfo.lineIdx].isEngaged = true;
						// Record callee for later unplug
						setPhoneLineCallee(pluggedInfo);
						// convoTrack.pause();
						playConvo(conversations[currConvo].convoFile, true, 
							pluggedInfo.lineIdx);

						// User messag message
						audioCaption = conversations[currConvo].convoText;

						// Set timer for next call

						// Temp hard-wire to interrupt first only
						if (currConvo === 0) {
							console.log(' currConvo = 0, 15000 to next')
							setTimeToNext(15000);							
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


	function unPlug(plugIdx, lineIndex) {

		// Set isPluggedJack to false
		// how to get coords of unplug???
		// Maybe store in person what jack
		// index is ingaged
		// wait until I have single person/jack id
		// before I tackle this.
		// It's just so you can't plug into an
		// already plugged jack.

    // If conversation is in progress
    // (Or even wrong number)

    if (phoneLines[lineIndex].isEngaged) {
			// Stop the audio
			phoneLines[lineIndex].convoTrack.pause();
			setCallFinished(lineIndex);
    }
	}

	function setCallFinished(lineIndex) {
		// Clear the line settings
		phoneLines[lineIndex].onePlugIsIn = false;
		phoneLines[lineIndex].isEngaged = false;
		// Turn of the leds
		jacks[phoneLines[lineIndex].caller.row][phoneLines[lineIndex].caller.col].ledState = LED_OFF;
		jacks[phoneLines[lineIndex].callee.row][phoneLines[lineIndex].callee.col].ledState = LED_OFF;

		// Reset the volume
		// phoneLines[lineIdxPrev].convoTrack.volume = 0;
		phoneLines[lineIndex].convoTrack.volume = 1;

		// Pause and start next call
		// console.log('setCallFinished, currConvo: ' + currConvo);
		// Don't start next call on finish if other line is engaged
		let otherLineIdx = (lineIndex === 0) ? 1 : 0;
		if (!phoneLines[otherLineIdx].isEngaged) {
			setTimeToNext(2000);							
		}
	}

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
	/>

	<p>Debug: {@html debugCaption}</p>
</div><!-- /wrapper --> 		<!-- phoneLines -->


