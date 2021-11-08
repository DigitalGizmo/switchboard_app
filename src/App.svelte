<script>
	import HowTo from "./HowTo.svelte";
	import Panel from "./Panel.svelte";

	let name = 'Donaldo';
	let age = 70;

	$: uppercaseName = name.toUpperCase();
	$: console.log(name);

	$: if (name === 'Donaldo') {
		age = 68;
	}

	function incrementAge() {
		age += 1;
	}
	function changeName() {
		name = 'Walter'
	}
	function newName(event) {
		name = event.target.value;
	}
</script>

<style>
	/*none*/
</style>

<header>
  <h5><a href="index.html">Switchboard Project</a>debug: {name}</h5>
  <h1>You're the Operator!</h1>
</header>

<div id="wrapper">      
	<HowTo />
	<Panel />
</div><!-- /wrapper -->

