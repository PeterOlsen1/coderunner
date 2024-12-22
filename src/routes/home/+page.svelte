<script>
    import Passage from "./Passage.svelte";
    import StatsDisplay from "./StatsDisplay.svelte";
    import { showStats } from "../../utils/passages/stats.svelte";
    import { fade } from "svelte/transition";
    import { onMount } from "svelte";

    onMount(() => {
        // document.addEventListener('keypress', (e) => {
        //     if (e.key === 'Enter' && showStats.state) {
        //         showStats.state = false;
        //         // document.querySelector('textarea').focus();
        //     }
        // });
    });
</script>

<style>
    .passage-container {
        opacity: 1;
        transition: opacity 0.5s;
    }
</style>
<svelte:head>
    <title>Home</title>
</svelte:head>

<div class="h-full flex-grow flex">
    <div class="grid place-content-center h-full">
        <div class="flex justify-center w-screen">
            {#if showStats.state}
                <div transition:fade class="w-screen h-screen fixed grid top-0 left-0 place-content-center">
                    <div>
                        show stats now
                        <StatsDisplay />
                        <br>
                        <button onclick={() => showStats.state = false}>Test again</button>
                    </div>
                </div>
            {/if}

            <!-- don't use transitions on this guy since i guess it adds an extra letter -->
            <div class="w-screen h-screen fixed grid top-0 left-0 place-content-center 
            passage-container" style="opacity: {showStats.state ? 0 : 1}">
                <Passage />
            </div>
        </div>
    </div>
</div>