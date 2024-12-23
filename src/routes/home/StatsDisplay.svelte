<script>
    import { createChart, showStats, testData } from "../../utils/passages/stats.svelte";
    import { fade } from "svelte/transition";
    import { onMount } from "svelte";
    import Language from "$lib/components/Language.svelte";


    let text = testData.passage;
    let lines = text.split("\n");
    let chars = text.length;
    let words = text.split(' ');
    let wordCount = words.reduce((acc, word) => {
        if (word.length > 0) {
            acc += 1;
        }
        return acc;
    }, 0);
    let wpm = ((chars / 5) / (testData.time / 60000)).toFixed(2);
    

    let correct = 0;
    let incorrect = 0;
    let incorrectKeys = {};
    for (let letter of testData.keystrokes) {
        if (letter.correct) {
            correct += 1;
        } else {
            incorrect += 1;
            incorrectKeys[letter.key] = incorrectKeys[letter.key] ? incorrectKeys[letter.key] + 1 : 1;
        }
    }
    let incorrectKeysToSort = Object.keys(incorrectKeys);
    incorrectKeysToSort.sort((a, b) => incorrectKeys[b] - incorrectKeys[a]);

    onMount(() => {
        createChart();
    })
</script>

<div class="w-full flex flex-col justify-center gap-6">
    <div class="w-full text-center flex justify-center gap-4 pt-10 text-3xl">
        <Language lang={testData.language} />
    </div>
    <div class="w-screen grid place-content-center" style="grid-template-columns: 3fr 7fr">
        <div class="w-full flex flex-col justify-center text-center gap-6">
            <div>
                <span class="text-2xl">wpm: {wpm}</span>
                <br>
                correct: {correct}
                <br>
                incorrect: {incorrect}
            </div>
            <div>
                <span class="text-2xl">missed keys:</span>
                <br>
                {#each incorrectKeysToSort as key}
                    {key}: {incorrectKeys[key]}
                    <br>
                {/each}
            </div>
        </div>
        <div class="mr-20">
            <canvas id="chart"></canvas>
        </div>
    </div>
</div>