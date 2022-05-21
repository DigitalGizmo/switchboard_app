<script>
	import HowTo from "./HowTo.svelte";
	import Panel from "./Panel.svelte";
	import { conversations, persons } from './Content.js';
	//  
	// import {setJackState} from './ProtoPanelHelper.js';

	let audioCaption = "Transcript: ";
	let debugCaption = "Press Start <br />";
	let caller = [null, null]; // row, col
	let callerIndex = 0;
	let pluggedName = 'caller not yet identified';
	let callee = [null, null]; // row, col
	let calleeIndex = 0;
	// let audioTrack = null;
	// let audioTrack = new Audio("https://dev.digitalgizmo.com/msm-ed/ed-assets/audio/charlie-calls.mp3");
	let buzzTrack = new Audio("https://dev.digitalgizmo.com/msm-ed/ed-assets/audio/buzzer.mp3");

	const phoneLines = [
		{
			onePlugIsIn: false, 
			isAtLeastInitiated: false,
			isEngaged: false,
			caller: {row: null, col: null, index: null, isPlugged: false},
			callee: {row: null, col: null, index: null, isPlugged: false},
			audioTrack: new Audio("https://dev.digitalgizmo.com/msm-ed/ed-assets/audio/charlie-calls.mp3"),
		}, 
		{
			onePlugIsIn: false, 
			isAtLeastInitiated: false,
			isEngaged: false,
			caller: {row: null, col: null, index: null,  isPlugged: false},
			callee: {row: null, col: null, index: null, isPlugged: false},
			audioTrack: new Audio("https://dev.digitalgizmo.com/msm-ed/ed-assets/audio/charlie-calls.mp3"),
		}, 
	];

	let currConvo = 4;
	// let prevConvo = null;

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
		// console.log('got to init call ');
		// Stop any converstaion that might be in progress
		// audioTrack.pause();
		// First conversation is first pair in first set
		caller =  conversations[currConvo].caller; // [0,1];
		callerIndex =  conversations[currConvo].caller.index; // [0,1];
		// console.log('callerIndex: ' + callerIndex);
		// Set "target", person being called
		callee =  conversations[currConvo].callee;
		calleeIndex = conversations[currConvo].callee.index
		setIncoming(callerIndex)
	}

	// This just rings the buzzer. Next action will
	// be when user plugs in a plug
	function setIncoming(callerIndex) {
    // playBuzzer();
		// console.log('hoping to play buzzer');
    buzzTrack.play();
    buzzTrack.volume = .8;    
		persons[callerIndex].ledState = LED_RED;
	}

	function playHello(currConvo, lineIndex){
		phoneLines[lineIndex].audioTrack =
     new Audio("https://dev.digitalgizmo.com/msm-ed/ed-assets/audio/" + 
		 conversations[currConvo].helloFile +  ".mp3");
    phoneLines[lineIndex].audioTrack.play();
		// Only track if this is converation index 3
		if (currConvo === 3 || currConvo === 7) {
			phoneLines[lineIndex].audioTrack.addEventListener("ended", function(){
						phoneLines[lineIndex].audioTrack.currentTime = 0;
						console.log(" -- Hello ended on lineIdx: " + lineIndex);
						setCallFinished(lineIndex);
			});    	
		}
	}	

	function playWrongNum(wrongNumFileName, lineIndex){
		phoneLines[lineIndex].audioTrack =
     new Audio("https://dev.digitalgizmo.com/msm-ed/ed-assets/audio/" + 
		 wrongNumFileName +  ".mp3");
    phoneLines[lineIndex].audioTrack.play();
	}	

	function playConvo(currConvo, lineIndex){
		phoneLines[lineIndex].audioTrack =
     new Audio("https://dev.digitalgizmo.com/msm-ed/ed-assets/audio/" + 
		 conversations[currConvo].convoFile +  ".mp3");
    phoneLines[lineIndex].audioTrack.play();

		// Handle call end
		phoneLines[lineIndex].audioTrack.addEventListener("ended", function(){
					phoneLines[lineIndex].audioTrack.currentTime = 0;
					console.log(" -- conversation ended on lineIdx: " + lineIndex);
					setCallFinished(lineIndex);
		});    	
	}	

	function setTimeToNext(timeToWait) {
	  setTimeout(startNextCall, timeToWait);
	}
	// So far, just for Tressa's one-way call
	function setTimeToHangUp(timeToWait, lineIndex) {
		clearTimeout();
		console.log('got to setTimeToHangUp, time to wait: ' + timeToWait);
	  // setTimeout(setCallFinished(lineIndex), timeToWait);
	  // setTimeout(alert('time is up'), timeToWait);
		setTimeout(() => {
			setCallFinished(lineIndex)
		}, timeToWait)
	}

	function startNextCall() {
		currConvo += 1;
		// prevConvo += 1;
  	initiateCall(); 
	}

	// --- Handle plug-in ----
	// plugged in the form of [person index, line index]
	function identifyPlugged(pluggedIdxInfo) {
		// Get name based on index
		pluggedName = persons[pluggedIdxInfo.personIdx].name;
		// Debug msg
		debugCaption += '<br />------- <br />New plug into: ' + pluggedName + '<br />';
		// console.log(plugged);
		// console.log(caller);
		// console.log('identify plugged, t or f? ' + phoneLines[pluggedIdxInfo.lineIdx].onePlugIsIn);

		// If Fresh plugged
		if (!phoneLines[pluggedIdxInfo.lineIdx].onePlugIsIn) { 
			// phoneLines for line in question, test onePlugIsIn value
			// New use of line --First plugged NOT already plugged in.
			// Did user correctly plug into caller?
			// if person index plugged matches that of caller
			if (pluggedIdxInfo.personIdx === callerIndex) {
					// Turn led green
					persons[pluggedIdxInfo.personIdx].ledState = LED_GREEN;
					// Set jack to plugged
					// Hopeully handle in Panel ony
					// persons[pluggedIdxInfo.personIdx].isPluggedJack = true;
					// Set first end of this line as in-use
					// and Record caller for later unplug
					setPhoneLineCaller(pluggedIdxInfo);
					// atLeastInitiated, prevents an interrupted
					// call end from spawning a new call
					// isEngaged doesn't cover the case where the call hassn't
					// yet been fully connected
					phoneLines[pluggedIdxInfo.lineIdx].isAtLeastInitiated = true;
					// Start Debug messages
					audioCaption = conversations[currConvo].helloText;
					// console.log('plugged name: ' + pluggedName);
					// Debug message
					debugCaption += pluggedName + ' on line: ' + pluggedIdxInfo.lineIdx + 
						' asks for ' + 
						persons[conversations[currConvo].callee.index].name + ' <br />';
					// Stop buzzer and other convo
					buzzTrack.pause();
					// Stop previous conversation, if there is one
					// phoneLines[pluggedInfo.lineIdx].audioTrack.pause();
					console.log(' - lineIdxPrev: ' + lineIdxPrev);
					if (lineIdxPrev >= 0) {
						phoneLines[lineIdxPrev].audioTrack.volume = 0;
					}
					// Set this line in use only we have gotten this success
					lineIdxInUse = pluggedIdxInfo.lineIdx;
					// Set prev for use in next call.
					lineIdxPrev = lineIdxInUse;
					// console.log(' setting lineIdxInUse to: ' + lineIdxInUse);
					playHello(currConvo, pluggedIdxInfo.lineIdx);
			}   // end if successful plug in to correct caller
		} else { 
			// First line used IS TRUE, so we might be on the other plug
			// But first, is this the line in use?
			// console.log(' in else,  lineIdxInUse use is: ' + lineIdxInUse);
			if (lineIdxInUse === pluggedIdxInfo.lineIdx) {
				// Other end already plugged in
				// Determing correct plugin for second end
				// if person index matches that of callee
				if (pluggedIdxInfo.personIdx === calleeIndex) {
						// Turn led green
						persons[pluggedIdxInfo.personIdx].ledState = LED_GREEN;
						// // Set jack to plugged
						// Hopeully handle in Panel ony
						// persons[pluggedIdxInfo.personIdx].isPluggedJack = true;
						// Set this line as engaged
						phoneLines[pluggedIdxInfo.lineIdx].isEngaged = true;
						// Record callee for later unplug
						setPhoneLineCallee(pluggedIdxInfo);
						// audioTrack.pause();
						playConvo(currConvo,	pluggedIdxInfo.lineIdx);
						// User messag message
						audioCaption = conversations[currConvo].convoText;
						// Set timer for next call
						// Temp hard-wire to interrupt two calls
						if (currConvo === 0 || currConvo === 4) {
							console.log(' currConvo = 0 or 4, 15000 to next')
							setTimeToNext(15000);
						}
						// Debug message
						debugCaption += pluggedName + ' on line: ' + pluggedIdxInfo.lineIdx;
				} else { // end plugged into to correct callee
					console.log('Plugged into wrong jack. Person: ' + persons[pluggedIdxInfo.personIdx].name);
					// persons[pluggedIdxInfo.personIdx].ledState = LED_GREEN;
					// playWrongNum(
					// 	persons[pluggedIdxInfo.personIdx].wrongNumAnswer, 
					// 	pluggedIdxInfo.lineIdx
					// );
				} // End plugged into wrong jack.
			} // end if this is the line in use
		} // end (else) this is "other" end of line in use
	} // end identifyPlugged

	function setPhoneLineCaller(pluggedIdxInfo) {
		phoneLines[pluggedIdxInfo.lineIdx].onePlugIsIn = true;
		// Set caller 
		phoneLines[pluggedIdxInfo.lineIdx].caller.index = pluggedIdxInfo.personIdx;
	}

	function setPhoneLineCallee(pluggedIdxInfo) {
		// Set callee 
		phoneLines[pluggedIdxInfo.lineIdx].callee.index = pluggedIdxInfo.personIdx;
	}

	function unPlug(plugIdx, lineIndex) {

		// Set isPluggedJack to false
		// how to get coords of unplug???
		// It's just so you can't plug into an
		// already plugged jack.
		// Hope to leave this in Panel only
		// persons[pluggedIdxInfo.personIdx].isPluggedJack = true;

    // If conversation is in progress
    // (Or even wrong number)
    if (phoneLines[lineIndex].isEngaged) {
			console.log(' -- calling this an unplug')
			// Stop the audio
			phoneLines[lineIndex].audioTrack.pause();
			setCallFinished(lineIndex);
    }
	}

	function setCallFinished(lineIndex) {
		// Clear the line settings
		phoneLines[lineIndex].onePlugIsIn = false;
		phoneLines[lineIndex].isAtLeastInitiated = false;
		phoneLines[lineIndex].isEngaged = false;
		// Turn of the leds
		persons[phoneLines[lineIndex].caller.index].ledState = LED_OFF;
		// Can't turn off callee led if callee index hasn't been defined
		console.log('phoneLines[lineIndex].callee.index: '+ phoneLines[lineIndex].callee.index);
		if (phoneLines[lineIndex].callee.index !== null) {
			// console.log('got into callee index not null');
			persons[phoneLines[lineIndex].callee.index].ledState = LED_OFF;
		}
		console.log('got past turn callee off');

		// Reset the volume -- incase it was silenced by interrupting call
		phoneLines[lineIndex].audioTrack.volume = 1;

		// Pause and start next call
		// Don't start next call on finish if other line is engaged
		console.log(' currConvo: ' + currConvo);
		let otherLineIdx = (lineIndex === 0) ? 1 : 0;
		console.log('other line enaged: ' + phoneLines[otherLineIdx].isAtLeastInitiated)
		if (!phoneLines[otherLineIdx].isAtLeastInitiated) {
			console.log('inside not not interruption')
			setTimeToNext(2000);							
		};
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

		{persons}
		{identifyPlugged}
		{unPlug}
	/>

	<p>Debug: {@html debugCaption}</p>
</div><!-- /wrapper --> 	
