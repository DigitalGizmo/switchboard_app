<script>
	// import HowTo from "./HowTo.svelte";
	import Panel from "./Panel.svelte";
	import { conversations, persons } from './Content.js';
    import { fcumsum } from "d3";
	import Transcript from "./Transcript.svelte";

	let currConvo = 0;
	let currCallerIndex = 0;
	let currCalleeIndex = 0;
	let whichLineInUse = -1;
	let prevLineInUse = -1;

	let callInitTimer = undefined;
	let reconnectTimer = undefined;
	let audioCaption = " ";

	const LED_OFF = 0;
	const LED_BLINKING = 1;
	const LED_SOLID = 2;

	const NO_UNPLUG_STATUS = 0;
	const AWAITING_INTERRUPT = 1;
	const DURING_INTERRUPT_SILENCE = 2;
	const REPLUG_IN_PROGRESS = 3;
	const CALLER_UNPLUGGED = 5;
	// let audioTrack = null;
	// let audioTrack = new Audio("https://dev.digitalgizmo.com/msm-ed/ed-assets/audio/charlie-calls.mp3");
	let buzzTrack = new Audio("https://dev.digitalgizmo.com/msm-ed/ed-assets/audio/buzzer.mp3");

	const phoneLines = [
		{
			isEngaged: false,
			unPlugStatus: NO_UNPLUG_STATUS,
			caller: {index: null, isPlugged: false},
			callee: {index: null, isPlugged: false},
			audioTrack: new Audio("https://dev.digitalgizmo.com/msm-ed/ed-assets/audio/1-Charlie_Operator.mp3"),
		}, 
		{
			isEngaged: false,
			unPlugStatus: NO_UNPLUG_STATUS,
			caller: {index: null, isPlugged: false},
			callee: {index: null, isPlugged: false},
			audioTrack: new Audio("https://dev.digitalgizmo.com/msm-ed/ed-assets/audio/1-Charlie_Operator.mp3"),
		}, 
	];

	const initiateCall = () => {
		if (currConvo < 9) {
			currCallerIndex =  conversations[currConvo].caller.index;
			// Set "target", person being called
			currCalleeIndex = conversations[currConvo].callee.index
			// This just rings the buzzer. Next action will
			// be when user plugs in a plug - in Panel.svelte drag end: handlePlugIn
			buzzTrack.play();
			buzzTrack.volume = .6;    
			persons[conversations[currConvo].caller.index].ledState = LED_BLINKING;
			console.log('-- New call being initiated by: ' + 
				persons[conversations[currConvo].caller.index].name);
		} else {
			// Play congratulations
			phoneLines[0].audioTrack =
				new Audio("https://dev.digitalgizmo.com/msm-ed/ed-assets/audio/FinishedActivity.mp3");
				phoneLines[0].audioTrack.play();
		}
	}

	const playHello = (_currConvo, lineIndex) => {
		phoneLines[lineIndex].audioTrack =
     new Audio("https://dev.digitalgizmo.com/msm-ed/ed-assets/audio/" + 
		 conversations[currConvo].helloFile +  ".mp3");
    phoneLines[lineIndex].audioTrack.play();
		// Set Transcript
		audioCaption = conversations[currConvo].helloText;
		// For convo idxs 3 and 7 there is no full convo, so end after hello.
		if (_currConvo === 3 || _currConvo === 7) {
			phoneLines[lineIndex].audioTrack.addEventListener("ended", function(){
				phoneLines[lineIndex].audioTrack.currentTime = 0;
				console.log(" - Hello-only ended on lineIdx: " + lineIndex);
				// setHelloOnlyCompleted(lineIndex)
				// Prob calling currConvo here since it's also a param
				clearTheLine(lineIndex);
				currConvo += 1;
				setTimeToNext(2000);		
			});    	
		} 
	}	

	const playConvo = (currConvo, lineIndex) => {
		phoneLines[lineIndex].audioTrack =
     new Audio("https://dev.digitalgizmo.com/msm-ed/ed-assets/audio/outgoing-ring.mp3");
    phoneLines[lineIndex].audioTrack.play();
		// Handle call end
		phoneLines[lineIndex].audioTrack.addEventListener("ended", function(){
					phoneLines[lineIndex].audioTrack.currentTime = 0;
					playFullConvo(currConvo, lineIndex);
		});    	
	}	

	const playFullConvo = (currConvo, lineIndex) => {
		phoneLines[lineIndex].audioTrack =
     new Audio("https://dev.digitalgizmo.com/msm-ed/ed-assets/audio/" + 
		 conversations[currConvo].convoFile +  ".mp3");
    phoneLines[lineIndex].audioTrack.play();
		// Set Transcript 
		audioCaption = conversations[currConvo].convoText;
		// Handle call end
		phoneLines[lineIndex].audioTrack.addEventListener("ended", function(){
					phoneLines[lineIndex].audioTrack.currentTime = 0;
					console.log(" -- conversation ended on lineIdx: " + lineIndex);
					setCallCompleted(lineIndex);
		});    	
	}	

	const playWrongNum = (currConvo, lineIndex) => {
		phoneLines[lineIndex].audioTrack =
     new Audio("https://dev.digitalgizmo.com/msm-ed/ed-assets/audio/single-ring.mp3");
    phoneLines[lineIndex].audioTrack.play();
		// Handle call end
		phoneLines[lineIndex].audioTrack.addEventListener("ended", function(){
					phoneLines[lineIndex].audioTrack.currentTime = 0;
					playFullWrongNum(currConvo, lineIndex);
		});    	
	}	

	// refactor: maybe use this after all: function playWrongNum(wrongCalleeIdx, lineIndex){
	const playFullWrongNum = (pluggedPersonIdx, lineIndex) => {
		let wrongNumFile = persons[pluggedPersonIdx].wrongNumFile;

		phoneLines[lineIndex].audioTrack =
     new Audio("https://dev.digitalgizmo.com/msm-ed/ed-assets/audio/" + 
		 persons[pluggedPersonIdx].wrongNumFile +  ".mp3");
    phoneLines[lineIndex].audioTrack.play();
		// Set Transcript 
		audioCaption = persons[pluggedPersonIdx].wrongNumText;		
		// Reply from caller saying who caller really wants
		phoneLines[lineIndex].audioTrack.addEventListener("ended", function(){
					phoneLines[lineIndex].audioTrack.currentTime = 0;
					console.log("   - wrong num answer ended on lineIdx: " + lineIndex);
					playRequestCorrect(lineIndex);
		});    		  		
	}	

	// Reply from caller saying who caller really wants
	const playRequestCorrect = (lineIndex) => {
		phoneLines[lineIndex].audioTrack =
     new Audio("https://dev.digitalgizmo.com/msm-ed/ed-assets/audio/" + 
		 conversations[currConvo].retryAfterWrongFile +  ".mp3");
    phoneLines[lineIndex].audioTrack.play();
		// Transcript for correction
		audioCaption = conversations[currConvo].retryAfterWrongText;
		// At this point we hope user unplugs wrong number
		// Will be handled by "unPlug"
	}	

	const setTimeToNext = (timeToWait) => {
	  // callInitTimer = setTimeout(startNextCall, timeToWait);
	  callInitTimer = setTimeout(initiateCall, timeToWait);
	}

	const setTimeReCall = (currConvo, lineIdx) => {
	  reconnectTimer = setTimeout(function() {
			playHello(currConvo, lineIdx);
		}, 2000);
	}
	
	// So far, just for Tressa's one-way call
	const setTimeToHangUp = (timeToWait, lineIndex) => {
		clearTimeout();
		console.log('got to setTimeToHangUp, time to wait: ' + timeToWait);
	  // setTimeout(setCallCompleted(lineIndex), timeToWait);
	  // setTimeout(alert('time is up'), timeToWait);
		callInitTimer = setTimeout(() => {
			setCallCompleted(lineIndex)
		}, timeToWait)
	}

	/***********
	  --- Handle plug-in ----
	**********/
	const handlePlugIn = ({lineIdx, personIdx}) => {
		// pluggedIdxInfo has [person index, line index]

		/********
		* Fresh plug-in -- aka caller not plugged
		*******/
		// Is this new use of line -- caller has not been plugged in.
		if (!phoneLines[lineIdx].caller.isPlugged) { 
			// Did user plug into caller?
			if (personIdx === currCallerIndex) {
				persons[personIdx].ledState = LED_SOLID;
				// Set this person's jack to plugged
				persons[personIdx].isPluggedJack = true;
				// Set this line as having caller plugged
				phoneLines[lineIdx].caller.isPlugged = true;
				// Set identity of caller on this line
				phoneLines[lineIdx].caller.index = personIdx;				
				// Set this line in use only we have gotten this success
				whichLineInUse = lineIdx;
				
				// Debug message
				console.log('  Operator connects to: ' + 
					persons[personIdx].name + ' on line: ' + 
					lineIdx + ' asking for ' + 
					persons[conversations[currConvo].callee.index].name +
					' convo: ' + currConvo);
				// Stop buzzer 
				buzzTrack.pause();
				// Handle case where caller was unplugged
				if (phoneLines[lineIdx].unPlugStatus === CALLER_UNPLUGGED) {
					console.log("  - Caller was unplugged: " + lineIdx);
					if (phoneLines[lineIdx].callee.isPlugged) {
						// if (correct callee??)
						// Stop Hello/Request
						console.log("  - trying to stop audio on : " + lineIdx);
						// silence request	
						phoneLines[lineIdx].audioTrack.pause();		
						// set line engaged
						phoneLines[lineIdx].unPlugStatus = NO_UNPLUG_STATUS;
						phoneLines[lineIdx].isEngaged = true;
						phoneLines[lineIdx].caller.isPlugged = true;
						// Start conversation without the ring
						playFullConvo(currConvo,	lineIdx);

						// If this is redo of call to be interrupted then restar timer
						if (currConvo === 0 || currConvo === 4) {
							console.log('    (starting timer for call that will interrupt)')
							// Move que to next call
							currConvo += 1;
							// Set awaitingInterrupt = true;
							phoneLines[lineIdx].unPlugStatus = AWAITING_INTERRUPT;
							// clearTimeout(callInitTimer)
							setTimeToNext(11000); // less than reg 15 secs bcz no ring
						}
					} else {
						console.log('   We should not get here');
					}
				} else if (prevLineInUse >= 0) { // Silence other conversation, if there is one
					console.log('    (silencing call on line:) ' + prevLineInUse);
					phoneLines[prevLineInUse].audioTrack.volume = 0;
					// Set unplug status so that unplugging this silenced call will
					// handled correctly by..
					phoneLines[prevLineInUse].unPlugStatus = DURING_INTERRUPT_SILENCE;
					playHello(currConvo, lineIdx);
				} else { // Regular, just play incoming Hello/Request
					playHello(currConvo, lineIdx);
				}
				// Set prev for use in next call. Here??
				prevLineInUse = whichLineInUse;
				// console.log(' setting whichLineInUse to: ' + whichLineInUse);
			} else {  // end if successful plug in to correct caller -
				// Didn't plug into correc calling person
				audioCaption = "That's not the jack for the person who is asking you to connect!";
			}
		} else { // caller is plugged
			/********
		  * Other end of the line -- caller is plugged, so this must be the other plug
			********/
			// But first, make sure this is the line in use
			if (whichLineInUse === lineIdx) {
				// Whether or not this is correct callee -- turn LED on.
				persons[personIdx].ledState = LED_SOLID;
				// // Set jack to plugged
				persons[personIdx].isPluggedJack = true;
				// Stop the hello operator track
				phoneLines[lineIdx].audioTrack.volume = 0;
				// Set callee -- used by unPlug even if it's the wrong number
				phoneLines[lineIdx].callee.index = personIdx;
				if (personIdx === currCalleeIndex) { // Correct callee
					console.log('   Plugging into correct callee');
					// Set this line as engaged
					phoneLines[lineIdx].isEngaged = true;
					// Also set line callee plugged
					phoneLines[lineIdx].callee.isPlugged = true;
					// Silence incoming Hello/Request, if necessary
					phoneLines[lineIdx].audioTrack.volume = 0;
					playConvo(currConvo,	lineIdx);
					// Transcript set by playConvo
					// audioCaption = conversations[currConvo].convoText;
					// Set timer for next call
					// Temp hard-wire to interrupt two calls
					if (currConvo === 0 || currConvo === 4) {
						console.log('    (starting timer for call that will interrupt)')
						// Move que to next call
						currConvo += 1;
						// Set awaitingInterrupt = true;
						phoneLines[lineIdx].unPlugStatus = AWAITING_INTERRUPT;
						setTimeToNext(14000);
					}
				} else { // Wong Number!
					console.log('   Plugged into wrong jack. Person: ' + 
						persons[personIdx].name);
					playWrongNum(
						personIdx, 
						lineIdx
					);
				} // End plugged into wrong number
			} // end if this is the line in use
		} // end (else) this is "other" end of line in use
	} // end handlePlugIn

	// Handle unplug with an engaged call or otherwise 
	const handleUnPlug = ({lineIdx, personIdx}) => { // pluggedIdxInfo {lineIdx, personIdx}
		// console.log('  Unplug on person idx: ' + personIdx +
		// ' line index: ' + lineIdx);
		console.log('  Unplug line ' + lineIdx + ' with status of: ' + 
			phoneLines[lineIdx].unPlugStatus +
		 ' while line isEngaged = ' + phoneLines[lineIdx].isEngaged);

		// If conversation is in progress -- engaged (implies correct callee)
		if (phoneLines[lineIdx].isEngaged) {
			console.log('  - Unplugging a call in progress person id: ' + 
				persons[personIdx].name);
			// Stop the audio
			phoneLines[lineIdx].audioTrack.pause();
			// Clear Transcript 
			audioCaption = " ";		
			// First, handle case here this a sileced call that's being unplugged		
			if (phoneLines[lineIdx].unPlugStatus === DURING_INTERRUPT_SILENCE) {
				console.log('    Unplugging silenced call');
				phoneLines[lineIdx].unPlugStatus = NO_UNPLUG_STATUS;
				stopSilentCall(lineIdx);
			} else { // this is a regular unplug
				// Handle the three cases of unplugging engaged call
				// 1) call will be interrupted 2) call is silenced, 3) regular calls 		
				if (phoneLines[lineIdx].unPlugStatus === AWAITING_INTERRUPT) {
					// Disconnecting a call that had already started a timer
					// for an interruption
					console.log('    Unplug while awaiting interrupt')
					currConvo -= 1; // Undo the increment that was set
					clearTimeout(callInitTimer); // bcz we're starting over
					// setCallUnplugged(lineIdx); 
					// phoneLines[lineIdx].unPlugStatus = REPLUG_IN_PROGRESS;
				}
				// Try setting this so that if the other silenced call ends
				// it know this has been unplugged
				phoneLines[lineIdx].unPlugStatus = REPLUG_IN_PROGRESS; // CALLEE_UNPLUGGED?
				// setCallUnplugged(lineIdx); 
					// stopCall(lineIndex);
					// setTimeToNext(2000);		
				if (phoneLines[lineIdx].callee.index === personIdx) { // callee unplugged
					console.log('   Unplugging callee');
					// Turn off callee LED
					persons[phoneLines[lineIdx].callee.index].ledState = LED_OFF;
					// Mark callee unplugged
					phoneLines[lineIdx].callee.isPlugged = false;
					phoneLines[lineIdx].isEngaged = false;
					phoneLines[lineIdx].audioTrack.pause();				
					// Leave caller plugged in, replay hello
					// reconnectTimer = setTimeout(playHello(currConvo, lineIdx), 3000);
					setTimeReCall(currConvo, lineIdx);
					// playHello(currConvo, lineIdx);
				} else if (phoneLines[lineIdx].caller.index === personIdx) { // caller unplugged
					// stopCall(lineIndex);
					// setTimeToNext(2000);							
					phoneLines[lineIdx].caller.isPlugged = false;
					phoneLines[lineIdx].isEngaged = false;
					// Also
					phoneLines[lineIdx].unPlugStatus = CALLER_UNPLUGGED;
					// ? prevLineInUse = -1;
					// Turn off caller LED
					persons[phoneLines[lineIdx].caller.index].ledState = LED_OFF;
					setTimeToNext(2000);							

				} else { 
					console.log('    This should not happen');
				}

			}

		} else if (phoneLines[lineIdx].unPlugStatus === REPLUG_IN_PROGRESS) {
			// Don't do anything about unplug if one end of the line
			// has already been unplugged.
			console.log('  Re-plug in progress - unplugging the other end ')
			// This is the remaining end unplugged, so clear the REPLUG
			phoneLines[lineIdx].unPlugStatus = NO_UNPLUG_STATUS;
			
			// Somewher in here condition for if CALLER_UNPLUGGED then
			// 		don't unplug the callee
		} else if (phoneLines[lineIdx].unPlugStatus === CALLER_UNPLUGGED) {
			// Also test for whether this unplug was an erroneous attempt
			// at re-plugging the caller??
			console.log('   Unplugg on the wrong jack during caller unplug')
		} else  { // Line was not fully engaged
			
			if (phoneLines[lineIdx].callee.index) { // callee jack was unplugged
				console.log('  ** Unplug on callee thats not engaged')
				persons[phoneLines[lineIdx].callee.index].ledState = LED_OFF;
				// Clear transcript?
				audioCaption = " ";
			} else {
				// Wasn't callee that was unplugged (& line wasn't engaged),
				// so might have been wrong num that was unplugged
				// Need to turn off LED
				console.log('  Unplug was prob on wrong number, personIdx: ' +
				personIdx)
				// Cover for before personidx defined
				// if (personIdx) {
					persons[personIdx].ledState = LED_OFF;
				// }
			}

			// phoneLines[lineIdx].audioTrack.volume = 0;
			phoneLines[lineIdx].audioTrack.pause();
			//  and if was during isWrongNumInProgress
			// then 
				// (just) turn off this led
				// which allows another plugin?

    }
	}

	// Handle completed call. (completed HelloOnly handled separately)
	const setCallCompleted = (lineIndex) => {
		let otherLineIdx = (lineIndex === 0) ? 1 : 0;
		console.log('   setCallCompleted() - line ' + lineIndex + 
			' stopping, other line has unplug stat of ' + 
			phoneLines[otherLineIdx].unPlugStatus);

		// Reset call -- should this come later, after forensics?
		stopCall(lineIndex);
		
		// Don't start next call on finish if other line has callee or caller plugged
		if (phoneLines[otherLineIdx].caller.isPlugged ||
			phoneLines[otherLineIdx].callee.isPlugged) {
			console.log('   Completing call with caller or callee plugged on other line')
			// This is a behind the scenes conversation that was interrupted
			// and is ending.
			// Dont increment currConvo
			// Call has been stopped, so:

			// phoneLines[lineIndex].unPlugStatus = REPLUG_IN_PROGRESS;
			phoneLines[lineIndex].unPlugStatus = NO_UNPLUG_STATUS;


		} else { // It's a regular call ending
			console.log('   other line has neither caller nor callee plugged, ');
			if (phoneLines[otherLineIdx].unPlugStatus === REPLUG_IN_PROGRESS) {
				// Handle case where this is a silenced call ending automatically
				// while the interrupting call has been unplugged
				// Here "other line" is the interrupting call that was unplugged
				console.log('   we think this is auto end of silenced call during 2nd call unplug');


				// Reset the unplug status
				phoneLines[otherLineIdx].unPlugStatus = NO_UNPLUG_STATUS;


			} else { // Regular ending
				console.log('  increment and start regular timer for next call');
				// Uptick currConvo here, when call is comlete
				currConvo += 1;
				setTimeToNext(2000);							
			}

		};
	}

	const setCallUnplugged = (lineIndex) => { 
		// Stop this call and start next 
		stopCall(lineIndex);
		setTimeToNext(2000);							
	}

	const stopCall = (lineIndex) => {
		// Clear the line settings
		clearTheLine(lineIndex);
		// Reset the volume -- incase it was silenced by interrupting call
		phoneLines[lineIndex].audioTrack.volume = 1;
	}

	const stopSilentCall = (lineIndex) => {
		console.log('  Trying to stop silent call on line: ' + lineIndex);
		phoneLines[lineIndex].unPlugStatus = NO_UNPLUG_STATUS;
		// Clear the line settings
		clearTheLine(lineIndex);
	}

	const clearTheLine = (lineIdx) => {
		// Clear the line settings
		phoneLines[lineIdx].caller.isPlugged = false;
		phoneLines[lineIdx].callee.isPlugged = false;
		phoneLines[lineIdx].isEngaged = false;
		// Also
		phoneLines[lineIdx].unPlugStatus = NO_UNPLUG_STATUS;
		prevLineInUse = -1;

		// Turn of the leds
		persons[phoneLines[lineIdx].caller.index].ledState = LED_OFF;
		// Can't turn off callee led if callee index hasn't been defined
		// console.log('phoneLines[lineIdx].callee.index: '+ phoneLines[lineIdx].callee.index);
		if (phoneLines[lineIdx].callee.index !== null) {
			// console.log('got into callee index not null');
			persons[phoneLines[lineIdx].callee.index].ledState = LED_OFF;
		}
	}

</script>

<style>
	/*none*/
</style>


<div id="wrapper">      
	<!-- <HowTo /> -->
	<Transcript 
		{audioCaption}
	/>
	<Panel 

		{persons}
		{handlePlugIn}
		{handleUnPlug}
		{initiateCall}
	/>

	<!-- <p>Debug: {@html debugCaption}</p> -->
</div><!-- /wrapper --> 	
