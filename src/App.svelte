<script>
	import HowTo from "./HowTo.svelte";
	import Panel from "./Panel.svelte";

	let audioCaption = 'ipsum dolor';

	// $: uppercaseName = name.toUpperCase();
	// $: console.log(name);

	// $: if (name === 'Donaldo') {
	// 	age = 24;
	// }

	// function incrementAge() {
	// 	age += 1;
	// }
	function startActivity() {
		audioCaption = "Charlie's line <strong>flashing</strong>"
	}
	// function newName(event) {
	// 	name = event.target.value;
	// }
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
	<Panel />
</div><!-- /wrapper -->

