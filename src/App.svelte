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
	let audioCaption = " ";

	const LED_OFF = 0;
	const LED_BLINKING = 1;
	const LED_SOLID = 2;

	const NO_UNPLUG_STATUS = 0;
	const AWAITING_INTERRUPT = 1;
	const DURING_INTERRUPT_SILENCE = 2;
	const REPLUG_IN_PROGRESS = 3;
	const JUST_UNPLUGGED = 4;
	// let audioTrack = null;
	// let audioTrack = new Audio("https://dev.digitalgizmo.com/msm-ed/ed-assets/audio/charlie-calls.mp3");
	let buzzTrack = new Audio("https://dev.digitalgizmo.com/msm-ed/ed-assets/audio/buzzer.mp3");

	const phoneLines = [
		{
			// onePlugIsIn: false, 
			// isAtLeastInitiated: false,
			isEngaged: false,
			unPlugStatus: NO_UNPLUG_STATUS,
			caller: {index: null, isPlugged: false},
			callee: {index: null, isPlugged: false},
			audioTrack: new Audio("https://dev.digitalgizmo.com/msm-ed/ed-assets/audio/1-Charlie_Operator.mp3"),
		}, 
		{
			// onePlugIsIn: false, 
			// isAtLeastInitiated: false,
			isEngaged: false,
			unPlugStatus: NO_UNPLUG_STATUS,
			caller: {index: null, isPlugged: false},
			callee: {index: null, isPlugged: false},
			audioTrack: new Audio("https://dev.digitalgizmo.com/msm-ed/ed-assets/audio/1-Charlie_Operator.mp3"),
		}, 
	];

	const initiateCall = () => {
		// Set up for ending audio
		if (currConvo < 9) {
			currCallerIndex =  conversations[currConvo].caller.index; // [0,1];
			// Set "target", person being called
			currCalleeIndex = conversations[currConvo].callee.index
			setIncoming(conversations[currConvo].caller.index)
		} else {
			// Play congratulations
			phoneLines[0].audioTrack =
				new Audio("https://dev.digitalgizmo.com/msm-ed/ed-assets/audio/FinishedActivity.mp3");
				phoneLines[0].audioTrack.play();
		}
	}

	// This just rings the buzzer. Next action will
	// be when user plugs in a plug - in Panel.svelte drag end: handlePlugIn
	const setIncoming = (callerIndex) => {
    // playBuzzer();
		// console.log('hoping to play buzzer');
    buzzTrack.play();
    buzzTrack.volume = .6;    
		persons[callerIndex].ledState = LED_BLINKING;
		console.log('-- New call being initiated by: ' + persons[callerIndex].name);
	}

	const playHello = (currConvo, lineIndex) => {
		phoneLines[lineIndex].audioTrack =
     new Audio("https://dev.digitalgizmo.com/msm-ed/ed-assets/audio/" + 
		 conversations[currConvo].helloFile +  ".mp3");
    phoneLines[lineIndex].audioTrack.play();
		// Only is only the hello track if this is converation index 3 or 7
		if (currConvo === 3 || currConvo === 7) {
			phoneLines[lineIndex].audioTrack.addEventListener("ended", function(){
				phoneLines[lineIndex].audioTrack.currentTime = 0;
				console.log(" - Hello ended on lineIdx: " + lineIndex);
				setCallCompleted(lineIndex);
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

		// Handle call end
		phoneLines[lineIndex].audioTrack.addEventListener("ended", function(){
					phoneLines[lineIndex].audioTrack.currentTime = 0;
					console.log(" -- conversation ended on lineIdx: " + lineIndex);
					setCallCompleted(lineIndex);
		});    	
	}	

	const playWrongNum = (currConvo, lineIndex) => {
		phoneLines[lineIndex].audioTrack =
     new Audio("https://dev.digitalgizmo.com/msm-ed/ed-assets/audio/outgoing-ring.mp3");
    phoneLines[lineIndex].audioTrack.play();

		// Handle call end
		phoneLines[lineIndex].audioTrack.addEventListener("ended", function(){
					phoneLines[lineIndex].audioTrack.currentTime = 0;
					playFullWrongNum(currConvo, lineIndex);
		});    	
	}	


	// refactor: maybe use this after all: function playWrongNum(wrongCalleeIdx, lineIndex){
	const playFullWrongNum = (pluggedPersonIdx, lineIndex) => {
		// persons[pluggedIdxInfo.personIdx], 
		// 				pluggedIdxInfo.lineIdx
		// persons[pluggedIdxInfo.personIdx].wrongNumFile,
		let wrongNumFile = persons[pluggedPersonIdx].wrongNumFile;
		// console.log('pluggedPersonIdx: ' + pluggedPersonIdx +
		// ' wrongNumFile: ' + wrongNumFile);
		// let lineIndex = pluggedIdxInfo.lineIdx;
		phoneLines[lineIndex].audioTrack =
     new Audio("https://dev.digitalgizmo.com/msm-ed/ed-assets/audio/" + 
		 wrongNumFile +  ".mp3");
    phoneLines[lineIndex].audioTrack.play();

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
		// At this point we hope user unplugs wrong number
		// Will be handled by "unPlug"
	}	

	const setTimeToNext = (timeToWait) => {
	  // callInitTimer = setTimeout(startNextCall, timeToWait);
	  callInitTimer = setTimeout(initiateCall, timeToWait);
	}

	// const startNextCall = () => {

	// 	// currConvo += 1;
	// 	// uptick currConvo when call complete

	// 	// prevConvo += 1;
  // 	initiateCall(); 
	// }

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
	const handlePlugIn = (pluggedIdxInfo) => {
		// pluggedIdxInfo has [person index, line index]
		// Get name based on index
		// pluggedName = persons[pluggedIdxInfo.personIdx].name;
		// Debug msg
		// debugCaption += '<br />------- <br />New plug into: ' + pluggedName + '<br />';
		// console.log(plugged);
		// console.log(caller);
		// console.log('identify plugged, t or f? ' + phoneLines[pluggedIdxInfo.lineIdx].caller.isPlugged);

		/********
		* Fresh plug-in
		*******/
		if (!phoneLines[pluggedIdxInfo.lineIdx].caller.isPlugged) { 
			// phoneLines for line in question, test caller.isPlugged value
			// New use of line --First plugged NOT already plugged in.
			// Did user correctly plug into caller?
			// If person index plugged matches that of caller
			if (pluggedIdxInfo.personIdx === currCallerIndex) {
				// Turn led green
				persons[pluggedIdxInfo.personIdx].ledState = LED_SOLID;
				// Set this person's jack to plugged
				persons[pluggedIdxInfo.personIdx].isPluggedJack = true;
				// Set first end of this line as in-use
				// and Record caller for later unplug
				setPhoneLineCaller(pluggedIdxInfo);
				// "atLeastInitiated" prevents an interrupted
				// call end from spawning a new call
				// isEngaged doesn't cover the case where the call hassn't
				// yet been fully connected

				// The following is redunant with caller.isPlugged
				// phoneLines[pluggedIdxInfo.lineIdx].isAtLeastInitiated = true;

				// Start Debug messages
				audioCaption = conversations[currConvo].helloText;
				// console.log('plugged name: ' + pluggedName);
				// Debug message
				//debugCaption += pluggedName + ' new call on line: ' + pluggedIdxInfo.lineIdx + 
					' asks for ' + 
					persons[conversations[currConvo].callee.index].name + ' <br />';
				console.log('  Operator connects to: ' + 
					persons[pluggedIdxInfo.personIdx].name + ' on line: ' + 
					pluggedIdxInfo.lineIdx + ' asking for ' + 
					persons[conversations[currConvo].callee.index].name +
					' convo: ' + currConvo);
				// Stop buzzer and other convo
				buzzTrack.pause();
				// Silence other conversation, if there is one
				if (prevLineInUse >= 0) {
					console.log('    (silencing call on line:) ' + prevLineInUse);
					phoneLines[prevLineInUse].audioTrack.volume = 0;
					// Set unplug status so that unplugging this silenced call will
					// handled correctly by..
					phoneLines[prevLineInUse].unPlugStatus = DURING_INTERRUPT_SILENCE;
				}
				// Set this line in use only we have gotten this success
				whichLineInUse = pluggedIdxInfo.lineIdx;
				// Set prev for use in next call.
				prevLineInUse = whichLineInUse;
				// console.log(' setting whichLineInUse to: ' + whichLineInUse);
				playHello(currConvo, pluggedIdxInfo.lineIdx);
			} else {  // end if successful plug in to correct caller -
				// Didn't plug into correc calling person
				audioCaption = "That's not the jack for the person who is asking you to connect!";

			}
		} else { 
			/********
		  * Other end of the line
			********/
			
			// First line used IS TRUE, so we must be on the other plug
			// But first, is this the line in use?
			// console.log(' in else,  whichLineInUse use is: ' + whichLineInUse);
			if (whichLineInUse === pluggedIdxInfo.lineIdx) {
				// Other end already plugged in
				// Determing correct plugin for second end
				// if person index matches that of callee

				// Whether or not this is correct callee
				// if (pluggedIdxInfo.personIdx === calleeIndex) {
				// Turn led green
				persons[pluggedIdxInfo.personIdx].ledState = LED_SOLID;
				// // Set jack to plugged
				persons[pluggedIdxInfo.personIdx].isPluggedJack = true;
				// Stop the hello operator track
				phoneLines[pluggedIdxInfo.lineIdx].audioTrack.volume = 0;
				// Set this line as engaged // Only if correct
				// phoneLines[pluggedIdxInfo.lineIdx].isEngaged = true;

				// Record callee for later unplug
				setPhoneLineCallee(pluggedIdxInfo);

				if (pluggedIdxInfo.personIdx === currCalleeIndex) { // Correct callee
					// Set this line as engaged
					phoneLines[pluggedIdxInfo.lineIdx].isEngaged = true;
					// audioTrack.pause();
					playConvo(currConvo,	pluggedIdxInfo.lineIdx);
					// User messag message
					audioCaption = conversations[currConvo].convoText;
					// Set timer for next call
					// Temp hard-wire to interrupt two calls
					if (currConvo === 0 || currConvo === 4) {
						console.log('    (starting timer for call that will interrupt)')
						// Move que to next call
						currConvo += 1;
						// awaitingInterrupt = true;
						phoneLines[pluggedIdxInfo.lineIdx].unPlugStatus = AWAITING_INTERRUPT;
						setTimeToNext(15000);
					}
					// Debug message
					// debugCaption += pluggedName + ' on line: ' + pluggedIdxInfo.lineIdx;
				} else { // end plugged into to correct callee
					// Wong Number!
					console.log('   Plugged into wrong jack. Person: ' + 
						persons[pluggedIdxInfo.personIdx].name);
					// debugCaption += 'Plugged into wrong jack. Person: ' + persons[pluggedIdxInfo.personIdx].name + 
					'  <br /> ';
					// already LED_SOLID;
					// playConvo(currConvo,	pluggedIdxInfo.lineIdx);					
					playWrongNum(
						pluggedIdxInfo.personIdx, 
						pluggedIdxInfo.lineIdx
					);
				} // End plugged into wrong number
			} // end if this is the line in use
		} // end (else) this is "other" end of line in use
	} // end handlePlugIn

	const setPhoneLineCaller = (pluggedIdxInfo) => {
		phoneLines[pluggedIdxInfo.lineIdx].caller.isPlugged = true;
		// Set caller 
		phoneLines[pluggedIdxInfo.lineIdx].caller.index = pluggedIdxInfo.personIdx;
	}

	const setPhoneLineCallee = (pluggedIdxInfo) => {
		// Set callee 
		phoneLines[pluggedIdxInfo.lineIdx].callee.index = pluggedIdxInfo.personIdx;
	}

	const handleUnPlug = (pluggedIdxInfo) => {
		// console.log('  Unplug on person idx: ' + pluggedIdxInfo.personIdx +
		// ' line index: ' + pluggedIdxInfo.lineIdx);
		console.log('  Unplug line ' + pluggedIdxInfo.lineIdx + ' with status of: ' + 
		phoneLines[pluggedIdxInfo.lineIdx].unPlugStatus +
		 ' while line isEngaged = ' + phoneLines[pluggedIdxInfo.lineIdx].isEngaged);

		// If conversation is in progress
		// (Or even wrong number)
		if (phoneLines[pluggedIdxInfo.lineIdx].isEngaged) {
			console.log('  - Unplugging a call in progress person id: ' + 
				persons[pluggedIdxInfo.personIdx].name);
			// Stop the audio
			phoneLines[pluggedIdxInfo.lineIdx].audioTrack.pause();

			if (phoneLines[pluggedIdxInfo.lineIdx].unPlugStatus === AWAITING_INTERRUPT) {
				// Disconnecting a call that had already started a timer
				// for an interruption
				console.log('    Unplug while awaiting interrupt')
				currConvo -= 1; // Undo the increment that was set
				clearTimeout(callInitTimer); // bcz we're starting over
				setCallUnplugged(pluggedIdxInfo.lineIdx); 
				phoneLines[pluggedIdxInfo.lineIdx].unPlugStatus = REPLUG_IN_PROGRESS;
			} else if (phoneLines[pluggedIdxInfo.lineIdx].unPlugStatus === DURING_INTERRUPT_SILENCE) {
				console.log('    Unplugging silenced call');
				phoneLines[pluggedIdxInfo.lineIdx].unPlugStatus = NO_UNPLUG_STATUS;
				stopSilentCall(pluggedIdxInfo.lineIdx);
			} else { // this is a regular unplug
				// Try setting this so that if the other silenced call ends
				// it know this has been unplugged
				phoneLines[pluggedIdxInfo.lineIdx].unPlugStatus = JUST_UNPLUGGED;
				setCallUnplugged(pluggedIdxInfo.lineIdx); 
			}

		} else if (phoneLines[pluggedIdxInfo.lineIdx].unPlugStatus === REPLUG_IN_PROGRESS) {
			// Don't do anything about unplug if one end of the line
			// has already been unplugged.
			console.log('  Re-plug in progress - unplugging the other end ')
			// This is the remaining end unplugged, so clear the REPLUG
			phoneLines[pluggedIdxInfo.lineIdx].unPlugStatus = NO_UNPLUG_STATUS;
			
			
			/* Have to know if this was a wrong number, in which case only
			* turn off the callee light and don't setCallUnplugged
			*/
		} else  { 
			// Line was not fully engaged
			// and unPlugStatus != REPLUG_IN_PROGRESS

			if (phoneLines[pluggedIdxInfo.lineIdx].callee.index) {
				// if it's callee jack that was unplugged
				console.log('  Unplug on callee thats not engaged')
				persons[phoneLines[pluggedIdxInfo.lineIdx].callee.index].ledState = LED_OFF;
			} else {
				// Wasn't callee that was unplugged (& line wasn't engaged),
				// so might have been wrong num that was unplugged
				// Need to turn off LED
				console.log('  Unplug was prob on wrong number, personIdx: ' +
				pluggedIdxInfo.personIdx)
				// Cover for before personidx defined
				// if (pluggedIdxInfo.personIdx) {
					persons[pluggedIdxInfo.personIdx].ledState = LED_OFF;
				// }
			}

			phoneLines[pluggedIdxInfo.lineIdx].audioTrack.volume = 0;
			//  and if was during isWrongNumInProgress
			// then 
				// (just) turn off this led
				// which allows another plugin?

    }
	}

	const setCallCompleted = (lineIndex) => {
		let otherLineIdx = (lineIndex === 0) ? 1 : 0;
		console.log('   line ' + lineIndex + ' stopping, other line has unplug stat of ' + 
		phoneLines[otherLineIdx].unPlugStatus);
		stopCall(lineIndex);
		// Pause and start next call
		// Don't start next call on finish if other line is engaged
		// console.log(' currConvo: ' + currConvo);
		// console.log('other line enaged: ' + phoneLines[otherLineIdx].isAtLeastInitiated)
		
		// if (phoneLines[otherLineIdx].unPlugStatus === REPLUG_IN_PROGRESS) {
		// 	// Handle case where this is a silenced call ending automatically
		// 	// while the interrupting call has been unplugged
		// 	// Here "other line" is the interrupting call that was unplugged
		// 	console.log('   we think this is auto end of silenced call during 2nd call unplug');

		// if (phoneLines[otherLineIdx].isAtLeastInitiated) {
		if (phoneLines[pluggedIdxInfo.lineIdx].caller.isPlugged) {
			// This seems wrong: should be testing engaged? or _either_ line plugged?
			// This is a behind the scens conversation that was interrupted 
			// Dont increment currConvo
			// Call has been stopped, so:
			phoneLines[lineIndex].unPlugStatus = REPLUG_IN_PROGRESS;
			// awaitingInterrupt = false;

		} else { // It's a regular call ending
			console.log('   other line not atLeastInitiated, ');
			
			if (phoneLines[otherLineIdx].unPlugStatus === JUST_UNPLUGGED) {
				// Handle case where this is a silenced call ending automatically
				// while the interrupting call has been unplugged
				// Here "other line" is the interrupting call that was unplugged
				console.log('   we think this is auto end of silenced call during 2nd call unplug');
			} else {
				console.log('  increment and start regular timer for next call');

				// ? Set other line to no unplug stats
				// (This might be a silenced call ending, the other line needs to lose
				// its DURING INTERRUPTIN status)
				// phoneLines[otherLineIdx].unPlugStatus = NO_UNPLUG_STATUS;	


				// phoneLines[lineIndex].unPlugStatus = NO_UNPLUG_STATUS;	

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

	const clearTheLine = (lineIndex) => {
		// Clear the line settings
		phoneLines[lineIndex].caller.isPlugged = false;
		// phoneLines[lineIndex].isAtLeastInitiated = false;
		phoneLines[lineIndex].isEngaged = false;
		// Also
		phoneLines[lineIndex].unPlugStatus = NO_UNPLUG_STATUS;
		prevLineInUse = -1;

		// Turn of the leds
		persons[phoneLines[lineIndex].caller.index].ledState = LED_OFF;
		// Can't turn off callee led if callee index hasn't been defined
		// console.log('phoneLines[lineIndex].callee.index: '+ phoneLines[lineIndex].callee.index);
		if (phoneLines[lineIndex].callee.index !== null) {
			// console.log('got into callee index not null');
			persons[phoneLines[lineIndex].callee.index].ledState = LED_OFF;
		}
	}

	// const retryAfterWrongNum = (lineIndex) => {
	// 	//
	// }

</script>

<style>
	/*none*/
</style>

<!-- <header>
  <h1>You're the Operator! <button on:click="{initiateCall}">Start</button></h1>
</header> -->

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
