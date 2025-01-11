<script>
    import { createChart, showStats, testData } from "../../utils/passages/stats.svelte";
    import { fade } from "svelte/transition";
    import { onMount } from "svelte";
    import Keyboard from "$lib/components/Keyboard.svelte";
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
    
    //extract data from testData
    let correct = 0;
    let incorrect = 0;
    let incorrectKeys = {};
    let incorrectList = [];
    for (let letter of testData.keystrokes) {
        if (letter.correct) {
            correct += 1;
        } else {
            incorrect += 1;
            incorrectKeys[letter.correctLetter] = incorrectKeys[letter.correctLetter] ? incorrectKeys[letter.correctLetter] + 1 : 1;
            incorrectList.push(letter);
        }
    }
    let incorrectKeysToSort = Object.keys(incorrectKeys);
    incorrectKeysToSort.sort((a, b) => incorrectKeys[b] - incorrectKeys[a]);

    let accuracy = ((correct / (correct + incorrect)) * 100).toFixed(2);

    let wpm  = ((correct / 5) / (testData.time / 60000)).toFixed(2);
    let rawWpm = ((testData.keystrokes.length / 5) / (testData.time / 60000)).toFixed(2);
    
    //create an array that displays the time since the last keystroke
    //we can use this to figure out the slowest keys
    let timeSinceLastArray = testData.keystrokes.map((keystroke, i) => {
        if (i === 0) {
            return {
                key: keystroke.key,
                time: keystroke.time
            };
        }

        return {
            key: keystroke.key,
            time: keystroke.time - testData.keystrokes[i - 1].time
        };
    });
    timeSinceLastArray.sort((a, b) => b.time - a.time);
    let timeSinceLastTopTen = timeSinceLastArray.slice(0, 10);

    onMount(() => {
        createChart();
    })
</script>

<style>
    .subtext {
        color: rgba(200, 200, 200, 0.8);
    }
</style>

<div class="w-full flex flex-col justify-center gap-6">
    <div class="relative right-9 text-center flex justify-center gap-4 pt-10 text-3xl">
        <Language lang={testData.language} /><div class="pt-2">| {testData.difficulty}</div>
    </div>
    <div class="w-screen grid place-content-center" style="grid-template-columns: 3fr 7fr">
        <div class="w-full flex flex-col justify-center text-center gap-6">
            <div class="text-2xl flex justify-center gap-4">
                <img src="https://www.svgrepo.com/show/23258/timer.svg" alt="timer" class="w-4" style="filter: invert(1);">
                <span>time: {testData.time / 1000} s</span>
            </div>
            <div>
                <span class="text-2xl">wpm: {wpm}</span>
                <br>
                <span class="subtext">raw: {rawWpm}</span>
            </div>
            <div>
                <span class="text-2xl">accuracy: {accuracy}%</span>
                <br>
                <span class="subtext">correct: {correct}</span>
                <br>
                <span class="subtext">incorrect: {incorrect}</span>
            </div>
        </div>
        <div class="mr-10 h-full max-h-[400px]">
            <canvas height="100%" id="chart"></canvas>
        </div>
    </div>
    <div class="w-full flex justify-center">
        <button onclick={() => showStats.state = false} class="flex gap-2"><img class="w-4 relative top-1" src="https://www.svgrepo.com/show/110727/redo-arrow-symbol.svg" alt="redo" style="filter: invert(1);"> Test again</button>
    </div>
    <div class="w-full grid grid-cols-2 place-items-center text-center">
        <div class="flex flex-col align-top h-full">

            <!-- display missed keys -->
            <span class="text-2xl">missed keys:</span>
            <br>
            {#each incorrectKeysToSort.slice(0, 9) as key}
                {key} : {incorrectKeys[key]}
                <br>
            {/each}
            {#if incorrectKeysToSort.length > 9}
                <span>and {incorrectKeysToSort.length - 9} more...</span>
            {/if}
            {#if !incorrectKeysToSort.length}
                <span>none! nice job 😎</span>
            {/if}
        </div>
        <div>

            <!-- display slowest keys -->
            <span class="text-2xl">slowest keys:</span>
            <br>
            {#each timeSinceLastTopTen as timeSinceLastArray}
                {timeSinceLastArray.key} : {timeSinceLastArray.time}ms
                <br>
            {/each}
        </div>
    </div>
    <div class="w-full flex justify-center flex-col text-center">
        <span class="text-2xl">missed key heatmap</span>
        <br>
        <Keyboard letters={incorrectList}/>
    </div>
</div>