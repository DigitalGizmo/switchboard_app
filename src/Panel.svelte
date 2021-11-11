<script>
  import { onMount } from 'svelte';
  import * as d3 from 'd3';

  export let jacks;
  export let identifyPlugged;
  export let unPlug;

  let name = 'Testing';

  // Plugs
  const PLUG_START_X = 200; // Top left plub body
  const PLUG_START_Y = 950;
  const INTRA_PLUG_DELTA = 100; // Space between plugs
  const INTER_PLUG_DELTA = 500; // Space between setsw
  const BODY_LINE_OFFSET_X = 42; // From plug left to line
  const BODY_LINE_OFFSET_Y = 160; // From plug top to line
  let plugIdx = 0;
  const pluggedInfo = {row: null, col: null, lineIdx: null};

  let plugs = [
    { index: 0,
      lineIndex: 0,
      x: PLUG_START_X, 
      y: PLUG_START_Y },
    { index: 1, 
      lineIndex: 0,
      x: PLUG_START_X + INTRA_PLUG_DELTA, 
      y: PLUG_START_Y },
    { index: 2, 
      lineIndex: 1,
      x: PLUG_START_X + INTER_PLUG_DELTA, 
      y: PLUG_START_Y },
    { index: 3, 
      lineIndex: 1,
      x: PLUG_START_X + INTER_PLUG_DELTA + INTRA_PLUG_DELTA, 
      y: PLUG_START_Y},
  ]

  const plugLineClases = ['line1', 'line1', 'line2', 'line2'];

  // Phone Lines
  // For 1st line 1st plug
  $: x11 = plugs[0].x + BODY_LINE_OFFSET_X;
  $: y11 = plugs[0].y + BODY_LINE_OFFSET_Y;
  const x12 = PLUG_START_X + BODY_LINE_OFFSET_X;
  const y2  = PLUG_START_Y + BODY_LINE_OFFSET_Y;
  // For 1st line 2nd plug
  $: x21 = plugs[1].x + BODY_LINE_OFFSET_X;
  $: y21 = plugs[1].y + BODY_LINE_OFFSET_Y;
  const x22 = PLUG_START_X + INTRA_PLUG_DELTA + BODY_LINE_OFFSET_X;
  // y2 samae as 1st plug


  // For 2nd line 1st plug
  $: x31 = plugs[2].x + BODY_LINE_OFFSET_X;
  $: y31 = plugs[2].y + BODY_LINE_OFFSET_Y;
  const x32 = PLUG_START_X + INTER_PLUG_DELTA + BODY_LINE_OFFSET_X;
  // y2 samae for all
  // For 2nd line 2nd plug
  $: x41 = plugs[3].x + BODY_LINE_OFFSET_X;
  $: y41 = plugs[3].y + BODY_LINE_OFFSET_Y;
  const x42 = PLUG_START_X + INTER_PLUG_DELTA + INTRA_PLUG_DELTA + BODY_LINE_OFFSET_X;

  // Panel jacks
  const PANEL_WIDTH = 1380;
  const PANEL_HEIGHT = 1200;
  const NUM_COLS = 5;
  const NUM_ROWS = 4;
  const CELL_WIDTH = PANEL_WIDTH/NUM_COLS;
  const CELL_HEIGHT = PANEL_HEIGHT/NUM_ROWS;
  // Take 2 Calculated
  const JACK_DELTA_X = 275;
  const ROW_OFFSETS = [0, 300];
  const JACK_TOP_OFFSET = 191 + 20;



  onMount(() => {
    d3.selectAll('.plug').style('cursor', 'move')
    .call(d3.drag()
      .on("start", function(d) {
          plugIdx = d3.select(this).attr("id");

          // Which line is this
          plugs[plugIdx].lineIndex

          unPlug();

          // Check whether this one is plugged
          // Unplug if relevant

       }).on("drag", function(d) {
          plugIdx = d3.select(this).attr("id");
          plugs[plugIdx].x = d.x -40;
          plugs[plugIdx].y = d.y -80;
          // Unplug if relevant
          // Check whether this one is plugged

       }).on("end", function (d){
          // Calculate closest row
          let proportion_of_total_height = d.y/PANEL_HEIGHT;
          pluggedInfo.row = Math.trunc(proportion_of_total_height * NUM_ROWS);
          // Snap plug to calculated row
          plugs[plugIdx].y = (pluggedInfo.row * CELL_HEIGHT) + JACK_TOP_OFFSET;

          // Calculate closeest column
          let proportion_of_total = d.x/PANEL_WIDTH;
          pluggedInfo.col = Math.trunc(proportion_of_total * NUM_COLS);
          // Snap plug to calcuated x
          plugs[plugIdx].x = (pluggedInfo.col * CELL_WIDTH) + (CELL_WIDTH/2) - 55;
          // Set col param

          // Set line index param
          pluggedInfo.lineIdx = plugs[plugIdx].lineIndex;

          // console.log('-- row: ' + pluggedInfo.row +
          //   ' obj -col: ' + pluggedInfo.col +
          //    ' lineIdx: ' + pluggedInfo.lineIdx);

          identifyPlugged(pluggedInfo);

       }) // end on end
    ); // end call drag
  });

</script>

<style>
  .plug-body {
    fill:#4D4D4D;
  }

  /*//PLUGS//*/

  .rounded-line {
    /*stroke:#4D4D4D;*/
    /*stroke:red;*/
    stroke-width:14;
    stroke-linecap:round;
    stroke-miterlimit:10;
  }

  .line1 {
    stroke:#EE4A4A;
  }

  .line2 {
    stroke:#4A4AEE;
  }

/*  .plug-line {
    stroke:#4D4D4D;
  }

*/      
  .label {
    fill:#FFFFFF;
    font-family:'PTSans-Bold';
  }

  /* from global css*/

  .led-light {
    fill:gray;
    stroke:#919090;
    stroke-width:3;
    stroke-miterlimit:10;
  }

  .led-green {
    fill:#64BC46;
    stroke:#919090;
  }

  .led-red {
    fill:red;
    stroke:#919090;
  }

</style>

<div id="panel">
  <!-- sockets -->
  <svg id="switchboard-grid" class="sockets" version="1.1" xmlns="http://www.w3.org/2000/svg" 
    xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px"
    viewBox="0 0 1420 1200" xml:space="preserve">


    {#each ROW_OFFSETS as r, ri}
      {#each jacks[ri] as k, i}
        <g transform="translate({ i * JACK_DELTA_X }, { r })" class="socket-plate">
          <rect width="250" height="275"/>
          <text x="50" y="50" fill="black">{k.name} <tspan>-</tspan>{k.number}</text>
          <circle 
            class="led-light"
            class:led-green="{k.ledState === 2}"
            class:led-red="{k.ledState === 1}"
            cx="127" 
            cy="105.9" 
            r="33.5"/>
          <rect x="102" y="166" width="50" height="50" stroke="#919090"/>
          <circle cx="126.5" cy="191.5" r="7.5" fill="black"/>
        </g>
      {/each}
    {/each}

    <!-- hard coded jacks -->
      <g transform="translate(0, 600)" class="unavailable">
        <rect width="250" height="275"/>
        <text x="100" y="50" fill="black">Ben</text>
        <text x="100" y="75" fill="black">476</text>
       <rect x="102" y="116" width="50" height="50" fill="#919090"/>
        <circle cx="126.5" cy="141.5" r="7.5" fill="black"/>
      </g>

      <g transform="translate(275, 600)" class="available">
        <rect width="250" height="275"/>
        <text x="100" y="50" fill="black">Sue</text>
        <text x="100" y="75" fill="black">989</text>
        <rect x="102" y="116" width="50" height="50" fill="#919090"/>
        <circle cx="126.5" cy="141.5" r="7.5" fill="black"/>
      </g>

      <g transform="translate(550, 600)" class="available">
        <rect width="250" height="275"/>
        <text x="100" y="50" fill="black">Ann</text>
        <text x="100" y="75" fill="black">977</text>
        <rect x="102" y="116" width="50" height="50" fill="#919090"/>
        <circle cx="126.5" cy="141.5" r="7.5" fill="black"/>
      </g>

      <g transform="translate(825, 600)" class="available">
        <rect width="250" height="275"/>
        <text x="100" y="50" fill="black">Sue</text>
        <text x="100" y="75" fill="black">989</text>
        <rect x="102" y="116" width="50" height="50" fill="#919090"/>
        <circle cx="126.5" cy="141.5" r="7.5" fill="black"/>
      </g>

      <g transform="translate(1100, 600)" class="available">
        <rect width="250" height="275"/>
        <text x="100" y="50" fill="black">Ann</text>
        <text x="100" y="75" fill="black">977</text>
        <rect x="102" y="116" width="50" height="50" fill="#919090"/>
        <circle cx="126.5" cy="141.5" r="7.5" fill="black"/>
      </g>    

    <!-- plug base -->
    <g transform="translate(0, 1090)">
      <rect width="1380" height="90" fill="#919090"/>
    </g>

    {#each plugs as d}
      <g 
        transform="translate({d.x}, {d.y})" 
        class="{d.lineIndex === 0 ? 'plug line1' : 'plug line2'}" 
        id="{d.index}">
        <line 
          class="{d.index < 2 ? 'rounded-line line1' : 'rounded-line line2'}"  
          x1="42" y1="-20" x2="42" y2="160"/>
        <rect width="84" height="120" class="plug-body"/>
        <text class="label" x="42" y="60" text-anchor="middle">PLUG IN</text> 
      </g> 
    {/each}
    <g class="line1"> <!-- first set of lines -->
      <line class="rounded-line" x1="{x11}" y1="{y11}" x2="{x12}" y2="{y2}"/>
      <line class="rounded-line" x1="{x21}" y1="{y21}" x2="{x22}" y2="{y2}"/>
      <line class="rounded-line" x1="{x12}" y1="{y2}" x2="{x22}" y2="{y2}" />
    </g>
    <g class="line2"> <!-- second set of lines -->
      <line class="rounded-line" x1="{x31}" y1="{y31}" x2="{x32}" y2="{y2}"/>
      <line class="rounded-line" x1="{x41}" y1="{y41}" x2="{x42}" y2="{y2}"/>
      <line class="rounded-line" x1="{x32}" y1="{y2}" x2="{x42}" y2="{y2}" />
    </g>


  </svg>
</div>
