<script>
  import { onMount } from 'svelte';
  import * as d3 from 'd3';
  import {rowColToIndex, getPersonIdx} from './ProtoPanelHelper.js'

  export let persons;
  export let handlePlugIn;
  export let handleUnPlug;

  let name = 'Testing';

  // Plugs
  const PLUG_START_X = 200; // Top left plub body
  const PLUG_START_Y = 950;
  const INTRA_PLUG_DELTA = 100; // Space between plugs
  const INTER_PLUG_DELTA = 500; // Space between setsw
  const BODY_LINE_OFFSET_X = 42; // From plug left to line
  const BODY_LINE_OFFSET_Y = 160; // From plug top to line
  const PLUG_SNAP_FUDG_Y = -80;
  let plugIdx = 0;
  let pluggedRow = 0;
  let pluggedCol = 0;
  // New
  const pluggedIdxInfo = {personIdx: null, lineIdx: null};

  /*
  * I think (for the hardware version) I need to go by what
  * jacks are plugged and whether two jacks are connected 
  * by the "same" line.
  * Lines won't have ids as such, just 1st line in use
  * and 2nd line in use.
  * But here I can use line ids to test "continuity"
  */


  let plugs = [
    { index: 0,
      lineIndex: 0,
      xStart: PLUG_START_X, 
      x: PLUG_START_X, 
      y: PLUG_START_Y,
      sleeveLength: -20, // to shorten on plug-in
    },
    { index: 1, 
      lineIndex: 0,
      xStart: PLUG_START_X + INTRA_PLUG_DELTA, 
      x: PLUG_START_X + INTRA_PLUG_DELTA, 
      y: PLUG_START_Y, 
      sleeveLength: -20,
    },
    { index: 2, 
      lineIndex: 1,
      xStart: PLUG_START_X + INTER_PLUG_DELTA, 
      x: PLUG_START_X + INTER_PLUG_DELTA, 
      y: PLUG_START_Y,
      sleeveLength: -20,
    },
    { index: 3, 
      lineIndex: 1,
      xStart: PLUG_START_X + INTER_PLUG_DELTA + INTRA_PLUG_DELTA, 
      x: PLUG_START_X + INTER_PLUG_DELTA + INTRA_PLUG_DELTA, 
      y: PLUG_START_Y,
      sleeveLength: -20,
    },
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
  const PANEL_WIDTH = 1420;
  const PANEL_HEIGHT = 1200;
  const NUM_COLS = 6;
  const NUM_ROWS = 4;
  const JACK_DELTA_X = PANEL_WIDTH/NUM_COLS;
  const SPACE_BETWEEN_X = 25;
  const CELL_WIDTH = JACK_DELTA_X - SPACE_BETWEEN_X;
  const CELL_HEIGHT = PANEL_HEIGHT/NUM_ROWS;
  // Take 2 Calculated
  // Starting y for each row
  const ROW_OFFSETS = [0, 300]; // , 600
  const JACK_TOP_OFFSET = 202 + 28;

  const handlePlugAction = (dx, dy, plugIdx, isPlugIn) => {
    // Calculate closest row
    let proportion_of_total_height = (dy + PLUG_SNAP_FUDG_Y)/PANEL_HEIGHT;
    pluggedRow = Math.trunc(proportion_of_total_height * NUM_ROWS);
    // Calculate closest column
    let proportion_of_total = dx/PANEL_WIDTH;
    pluggedCol = Math.trunc(proportion_of_total * NUM_COLS);

    // Set line index param
    pluggedIdxInfo.lineIdx = plugs[plugIdx].lineIndex;
    // Get person index from row, col (if in the grid)
    if (pluggedRow < 2) {
      pluggedIdxInfo.personIdx = getPersonIdx(pluggedRow, pluggedCol);
    } else {
      pluggedIdxInfo.personIdx = 99;
    }

    if (isPlugIn) {
      // Test whether there's already a plug in this jack?
  
      console.log(' plug in, pluggeRow: ' + pluggedRow)
      // Snap plug to calculated x and row (unless putting it away)
      if (pluggedRow < 2) { // on the grid
        plugs[plugIdx].y = (pluggedRow * CELL_HEIGHT) + JACK_TOP_OFFSET;
        plugs[plugIdx].x = (pluggedCol * JACK_DELTA_X) + (CELL_WIDTH/2) - 42; // 1/2 plug width
        plugs[plugIdx].sleeveLength = -5;
      // Register this jack as plugged
      // This won't be of any use unless/until I'm able to
      // translate an unPlug to a specific jack
      rowColToIndex[pluggedRow][pluggedCol].isPlugged = true;
      // Send action to App.svelte
      handlePlugIn(pluggedIdxInfo);

      } else { // Bottom -- putting it away
        plugs[plugIdx].y = PLUG_START_Y;
        plugs[plugIdx].x = plugs[plugIdx].xStart;
        plugs[plugIdx].sleeveLength = -20;     
      }

      // how to get coords of unplug???
      // It's just so you can't plug into an
      // already plugged jack.
      // Hope to leave this in Panel only
      // persons[pluggedIdxInfo.personIdx].isPluggedJack = true;
    } else { // This is unPlug
      handleUnPlug(pluggedIdxInfo);
      // Re-lengthen the sleeve
      plugs[plugIdx].sleeveLength = -20;
    }
  }

  onMount(() => {
    d3.selectAll('.plug').style('cursor', 'move')
    .call(d3.drag()
      .on("start", function(d) {
          plugIdx = d3.select(this).attr("id");
          // Don do anything if this start is below the grid
          if (d.y < 930) {
            handlePlugAction(d.x, d.y, plugIdx, false); // isPlugIn = false          
          }
        }).on("drag", function(d) {
          plugIdx = d3.select(this).attr("id");
          plugs[plugIdx].x = d.x -40;
          plugs[plugIdx].y = d.y -80;

       }).on("end", function (d){
          // May want to separate out this as a function to be called by unplug
          plugIdx = d3.select(this).attr("id");
          if (d.y < 930) {
            handlePlugAction(d.x, d.y, plugIdx, true); // isPlugIn = true
          }
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
    /*stroke:#EE4A4A;*/
    stroke:darkorange;
  }
  .line2 {
    stroke:#4A4AEE;
  }
  .label {
    fill:#FFFFFF;
    font-family:'PTSans-Bold';
  }
  /* don made this */
  .jack-name {
    font-size: 1.6em;
    /* font-family:'PTSans-Bold'; */
  }

  .jack-number {
    font-size: 1.8em;
    font-weight: bold;
    /* font-family:'PTSans-Bold'; */
  }

  /* from global css*/
  .led-light {
    fill:gray;
    stroke:#919090;
    stroke-width:3;
    stroke-miterlimit:10;
  }

  .led-solid {
    fill:#fc9d03;
    stroke:#919090;
  }

  .led-blinking {
    stroke:#919090;
    stroke-width:3;
    stroke-miterlimit:10;
    animation: blinkingLED 1.75s infinite;
  }

  @keyframes blinkingLED {
      0% { fill: #fc9d03; }
      49% { fill: white; }
      60% { fill: #fc9d03; }
      99% { fill: white; }
      100% { fill: #fc9d03; }
  }

</style>

<div id="panel">
  <!-- sockets -->
  <svg id="switchboard-grid" class="sockets" version="1.1" xmlns="http://www.w3.org/2000/svg" 
    xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px"
    viewBox="0 0 {PANEL_WIDTH} 1200" xml:space="preserve">

    <!-- The following yields the person index nubmer
    rowColToIndex[rowIndex][colIndex] -->
    {#each ROW_OFFSETS as rowY, rowIndex}
      {#each rowColToIndex[rowIndex] as jack, colIndex}
        <g transform="translate({ colIndex * JACK_DELTA_X }, { rowY })" class="socket-plate">
          <rect width="{CELL_WIDTH}" height="275"/>
          <text x="{CELL_WIDTH/2}" y="35" class="jack-name" text-anchor="middle">
            {persons[rowColToIndex[rowIndex][colIndex].personIdx].company}
          </text>
          <text x="{CELL_WIDTH/2}" y="70" class="jack-name" text-anchor="middle">
            {persons[rowColToIndex[rowIndex][colIndex].personIdx].name}
          </text>
          <text x="{CELL_WIDTH/2}" y="103" class="jack-number" text-anchor="middle">
            {persons[rowColToIndex[rowIndex][colIndex].personIdx].number}
          </text>
          <circle 
            class="led-light"
            class:led-solid="{persons[rowColToIndex[rowIndex][colIndex].personIdx].ledState === 2}"
            class:led-blinking="{persons[rowColToIndex[rowIndex][colIndex].personIdx].ledState === 1}"
            cx="{CELL_WIDTH/2}" 
            cy="150" 
            r="32"/>
          <rect x="{(CELL_WIDTH/2-25) }" y="200" width="50" height="50" stroke="#919090"/>
          <circle cx="{CELL_WIDTH/2}" cy="225.5" r="7.5" fill="black"/>
        </g>
      {/each}
    {/each}

    {#each plugs as d}
      <g 
        transform="translate({d.x}, {d.y})" 
        class="{d.lineIndex === 0 ? 'plug line1' : 'plug line2'}" 
        id="{d.index}">
        <line 
          class="{d.index < 2 ? 'rounded-line line1' : 'rounded-line line2'}"  
          x1="42" y1="{d.sleeveLength}" x2="42" y2="160"/>
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

    <!-- plug base -->
    <g transform="translate(0, 1090)">
      <rect width="1080" height="90" fill="#919090"/>
    </g>

  </svg>
</div>
