import { onMount } from "svelte";
import { Chart, LineController, CategoryScale, LinearScale, PointElement, LineElement, Tooltip, Legend, Title } from "chart.js";
import { LANGUAGES } from "../config";

Chart.register(LineController, CategoryScale, LinearScale, PointElement, LineElement, Tooltip, Legend, Title);
/**
 * Export this guy to determine whether or not stats are showing
 */
export let showStats = $state({state: true});

// export let testData = $state({keystrokes: []});


export let testData = {"keystrokes":[{"time":0,"key":"d","correct":true},{"time":30,"key":"e","correct":true},{"time":120,"key":"f","correct":true},{"time":180,"key":" ","correct":true},{"time":330,"key":"a","correct":true},{"time":340,"key":"p","correct":true},{"time":450,"key":"p","correct":true},{"time":1030,"key":"r","correct":true},{"time":1120,"key":"o","correct":true},{"time":1360,"key":"a","correct":false,"correctLetter":"v"},{"time":1810,"key":"v","correct":true},{"time":1930,"key":"a","correct":true},{"time":2000,"key":"l","correct":true},{"time":2180,"key":"(","correct":true},{"time":2280,"key":"x","correct":true},{"time":2470,"key":")","correct":true},{"time":2750,"key":":","correct":true},{"time":3380,"key":"s","correct":true},{"time":3560,"key":"t","correct":true},{"time":3630,"key":"r","correct":true},{"time":3690,"key":"i","correct":true},{"time":3770,"key":"n","correct":true},{"time":3860,"key":"g","correct":true},{"time":3910,"key":" ","correct":true},{"time":4830,"key":" ","correct":true},{"time":5430,"key":"=","correct":true},{"time":5630,"key":" ","correct":true},{"time":5900,"key":"\"","correct":true},{"time":6290,"key":"p","correct":true},{"time":6360,"key":"l","correct":true},{"time":6440,"key":"e","correct":true},{"time":6530,"key":"a","correct":true},{"time":6610,"key":"s","correct":true},{"time":6710,"key":"e","correct":true},{"time":6800,"key":" ","correct":true},{"time":6900,"key":"a","correct":true},{"time":7000,"key":"p","correct":true},{"time":7120,"key":"p","correct":true},{"time":7250,"key":"r","correct":true},{"time":7330,"key":"o","correct":true},{"time":7440,"key":"v","correct":true},{"time":7560,"key":"e","correct":true},{"time":7640,"key":" ","correct":true},{"time":7800,"key":"t","correct":true},{"time":7880,"key":"h","correct":true},{"time":8290,"key":"i","correct":true},{"time":8350,"key":"s","correct":true},{"time":8440,"key":" ","correct":true},{"time":8530,"key":"p","correct":true},{"time":8560,"key":"a","correct":true},{"time":8710,"key":"s","correct":true},{"time":8850,"key":"s","correct":true},{"time":8910,"key":"a","correct":true},{"time":9030,"key":"g","correct":true},{"time":9120,"key":"e","correct":true},{"time":9140,"key":" ","correct":true},{"time":9230,"key":"o","correct":true},{"time":9310,"key":"h","correct":true},{"time":9410,"key":" ","correct":true},{"time":9760,"key":"g","correct":true},{"time":9950,"key":"r","correct":true},{"time":10010,"key":"e","correct":true},{"time":10080,"key":"a","correct":true},{"time":10180,"key":"t","correct":true},{"time":10280,"key":" ","correct":true},{"time":10350,"key":"a","correct":true},{"time":10450,"key":"d","correct":true},{"time":10530,"key":"m","correct":true},{"time":10610,"key":"i","correct":true},{"time":10700,"key":"n","correct":true},{"time":10850,"key":" ","correct":true},{"time":10950,"key":"i","correct":true},{"time":11040,"key":" ","correct":true},{"time":11140,"key":"b","correct":true},{"time":11230,"key":"e","correct":true},{"time":11400,"key":"g","correct":true},{"time":11540,"key":" ","correct":true},{"time":11790,"key":"o","correct":true},{"time":11890,"key":"f","correct":true},{"time":11990,"key":" ","correct":true},{"time":12090,"key":"y","correct":true},{"time":12180,"key":"o","correct":true},{"time":12230,"key":"u","correct":true},{"time":12550,"key":" ","correct":true},{"time":12700,"key":"p","correct":true},{"time":12780,"key":"l","correct":true},{"time":12860,"key":"e","correct":true},{"time":12950,"key":"a","correct":true},{"time":13050,"key":"s","correct":true},{"time":13150,"key":"e","correct":true},{"time":13980,"key":"!","correct":true},{"time":14300,"key":"\"","correct":true},{"time":15210,"key":"r","correct":true},{"time":15310,"key":"e","correct":true},{"time":15530,"key":"t","correct":true},{"time":15630,"key":"u","correct":true},{"time":15660,"key":"r","correct":true},{"time":15730,"key":"n","correct":true},{"time":15880,"key":" ","correct":true},{"time":15960,"key":"s","correct":true},{"time":16110,"key":"t","correct":true},{"time":16230,"key":"r","correct":true},{"time":16300,"key":"i","correct":true},{"time":16390,"key":"n","correct":true},{"time":16450,"key":"g","correct":true}],"language":"python","passage":"def approval(x):\n    string = \"please approve this passage oh great admin i beg of you please!\"\n    return string","difficulty":"easy","time":16450}

/**
 * Make WPM data
 */
function makeTimeData() {
    let timeData = {};
    let maxTime = parseInt(testData.keystrokes[testData.keystrokes.length - 1].time / 1000);
    for (let keystroke of testData.keystrokes) {
        let time = parseInt(keystroke.time / 1000);
        if (time in timeData) {
            timeData[time] += 1;
        } else {
            timeData[time] = 1;
        }
    }

    let rawWpmArray = [];
    for (let i = 8; i <= maxTime; i++) {
        if (i in timeData) {
            //average word 5 characters, 60 seconds in minute
            rawWpmArray.push(timeData[i] * 12);
        } else {
            rawWpmArray.push(0);
        }
    }
    return rawWpmArray;
}


function movingAverage(data, windowSize) {
    let result = [];
    for (let i = 0; i < data.length; i++) {
        let start = Math.max(0, i - windowSize + 1);
        let subset = data.slice(start, i + 1);
        let average = subset.reduce((sum, value) => sum + value, 0) / subset.length;
        result.push(average);
    }
    return result;
}

function calculateWPMForEachSecond() {
    let wpm = 0;
    let out = [];
    let lastSecond = 0;
    let chars = 0;
    for (let i = 0; i < testData.keystrokes.length; i++) {
        let second = parseInt(testData.keystrokes[i].time / 1000);
        if (second !== lastSecond) {
            out.push(wpm);
            lastSecond = second;
        }

        if (testData.keystrokes[i].correct) {
            chars++;
        }

        wpm = chars * 12 / (second + 1);
    }

    return out;
}

export function createChart() {
    let rawWpmArray = movingAverage(makeTimeData(), 1);

    let ctx = document.getElementById('chart').getContext('2d');

    const config = {
        type: 'line',
        data: {
            labels: Array.from({length: rawWpmArray.length}, (_, i) => i),
            datasets: [{
                label: 'wpm',
                data: calculateWPMForEachSecond(),
                borderColor: LANGUAGES[testData.language].color,
                tension: 0.4
            },
            {
                label: 'average',
                data: rawWpmArray,
                borderColor: LANGUAGES[testData.language].secondary,
                tension: 0.4
            }
        ]
        },
        options: {
            scales: {
                x: {
                    type: 'linear',
                    label: {
                        display: true,
                        text: 'Seconds'
                    }
                },
                y: {
                    type: 'linear',
                    label: {
                        display: true,
                        text: 'WPM'
                    }
                }
            },
            plugins: {
                tooltip: {
                    callbacks: {
                        // Customize the tooltip title
                        title: function (ctx) {
                            console.log(ctx);
                            return `hello`;
                        },
                        // Customize the tooltip label for each dataset
                        label: function () {
                            return "hi"
                        },
                        // Optional: Add custom footer
                        footer: function () {
                            return 'This is a custom footer';
                        }
                    },
                },
            },
        }
    }
    
    console.log(config);
    let myChart = new Chart(ctx, config);
}