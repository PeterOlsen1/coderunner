import { onMount } from "svelte";

/**
 * Export this guy to determine whether or not stats are showing
 */
export let showStats = $state({state: false});

export let testData = $state({keystrokes: []});
