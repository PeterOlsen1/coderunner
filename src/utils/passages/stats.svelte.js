import { onMount } from "svelte";
import { Chart, LineController, CategoryScale, LinearScale, PointElement, LineElement, Tooltip, Legend, registerables } from "chart.js";
import { LANGUAGES } from "../config";

Chart.register(LineController, CategoryScale, LinearScale, PointElement, LineElement, Tooltip, Legend);
Chart.defaults.font = {
    family: 'Source Code Pro', 
    size: 14,         
    weight: 'normal', 
    style: 'normal', 
    lineHeight: 1.2  
};
/**
 * Export this guy to determine whether or not stats are showing
 */
export let showStats = $state({state: true});

// export let testData = $state({keystrokes: []});
export let testData = $state({
    "keystrokes": [
        {
            "time": 0,
            "key": "f",
            "correct": true
        },
        {
            "time": 100,
            "key": "a",
            "correct": true
        },
        {
            "time": 220,
            "key": "c",
            "correct": true
        },
        {
            "time": 400,
            "key": "t",
            "correct": true
        },
        {
            "time": 460,
            "key": "o",
            "correct": true
        },
        {
            "time": 550,
            "key": "r",
            "correct": true
        },
        {
            "time": 650,
            "key": "i",
            "correct": true
        },
        {
            "time": 720,
            "key": "a",
            "correct": true
        },
        {
            "time": 820,
            "key": "l",
            "correct": true
        },
        {
            "time": 1100,
            "key": "R",
            "correct": true
        },
        {
            "time": 1180,
            "key": "e",
            "correct": true
        },
        {
            "time": 1350,
            "key": "c",
            "correct": true
        },
        {
            "time": 1390,
            "key": "u",
            "correct": true
        },
        {
            "time": 1540,
            "key": "s",
            "correct": false,
            "correctLetter": "r"
        },
        {
            "time": 1760,
            "key": "t",
            "correct": false,
            "correctLetter": "s"
        },
        {
            "time": 1820,
            "key": "i",
            "correct": true
        },
        {
            "time": 2700,
            "key": "r",
            "correct": false,
            "correctLetter": "u"
        },
        {
            "time": 3420,
            "key": "u",
            "correct": true
        },
        {
            "time": 3520,
            "key": "r",
            "correct": true
        },
        {
            "time": 3730,
            "key": "s",
            "correct": true
        },
        {
            "time": 3770,
            "key": "i",
            "correct": true
        },
        {
            "time": 3880,
            "key": "v",
            "correct": true
        },
        {
            "time": 3980,
            "key": "e",
            "correct": true
        },
        {
            "time": 4040,
            "key": " ",
            "correct": true
        },
        {
            "time": 4240,
            "key": ":",
            "correct": true
        },
        {
            "time": 4350,
            "key": ";",
            "correct": false,
            "correctLetter": ":"
        },
        {
            "time": 4450,
            "key": " ",
            "correct": true
        },
        {
            "time": 4640,
            "key": "i",
            "correct": false,
            "correctLetter": "I"
        },
        {
            "time": 4700,
            "key": "n",
            "correct": true
        },
        {
            "time": 4800,
            "key": "t",
            "correct": true
        },
        {
            "time": 4890,
            "key": "e",
            "correct": true
        },
        {
            "time": 5110,
            "key": "g",
            "correct": true
        },
        {
            "time": 5190,
            "key": "e",
            "correct": true
        },
        {
            "time": 5290,
            "key": "r",
            "correct": true
        },
        {
            "time": 5380,
            "key": " ",
            "correct": true
        },
        {
            "time": 5490,
            "key": "-",
            "correct": true
        },
        {
            "time": 5660,
            "key": ">",
            "correct": true
        },
        {
            "time": 5820,
            "key": " ",
            "correct": true
        },
        {
            "time": 6030,
            "key": "I",
            "correct": true
        },
        {
            "time": 6110,
            "key": "n",
            "correct": true
        },
        {
            "time": 6230,
            "key": "t",
            "correct": true
        },
        {
            "time": 6320,
            "key": "e",
            "correct": true
        },
        {
            "time": 6440,
            "key": "g",
            "correct": true
        },
        {
            "time": 6540,
            "key": "e",
            "correct": true
        },
        {
            "time": 6620,
            "key": "r",
            "correct": true
        },
        {
            "time": 6930,
            "key": "f",
            "correct": true
        },
        {
            "time": 7020,
            "key": "a",
            "correct": true
        },
        {
            "time": 7130,
            "key": "c",
            "correct": true
        },
        {
            "time": 7310,
            "key": "t",
            "correct": true
        },
        {
            "time": 7370,
            "key": "o",
            "correct": true
        },
        {
            "time": 7440,
            "key": "r",
            "correct": true
        },
        {
            "time": 7510,
            "key": "i",
            "correct": true
        },
        {
            "time": 7590,
            "key": "a",
            "correct": true
        },
        {
            "time": 7650,
            "key": "l",
            "correct": true
        },
        {
            "time": 7830,
            "key": "R",
            "correct": true
        },
        {
            "time": 7900,
            "key": "e",
            "correct": true
        },
        {
            "time": 8050,
            "key": "c",
            "correct": true
        },
        {
            "time": 8150,
            "key": "u",
            "correct": true
        },
        {
            "time": 8270,
            "key": "r",
            "correct": true
        },
        {
            "time": 8430,
            "key": "s",
            "correct": true
        },
        {
            "time": 8480,
            "key": "i",
            "correct": true
        },
        {
            "time": 8590,
            "key": "v",
            "correct": true
        },
        {
            "time": 8670,
            "key": "e",
            "correct": true
        },
        {
            "time": 8760,
            "key": " ",
            "correct": true
        },
        {
            "time": 8840,
            "key": "=",
            "correct": false,
            "correctLetter": "0"
        },
        {
            "time": 8930,
            "key": " ",
            "correct": true
        },
        {
            "time": 9080,
            "key": "1",
            "correct": false,
            "correctLetter": "="
        },
        {
            "time": 10500,
            "key": "9",
            "correct": false,
            "correctLetter": "0"
        },
        {
            "time": 11540,
            "key": " ",
            "correct": true
        },
        {
            "time": 12280,
            "key": "0",
            "correct": true
        },
        {
            "time": 12590,
            "key": " ",
            "correct": true
        },
        {
            "time": 12710,
            "key": "=",
            "correct": true
        },
        {
            "time": 12820,
            "key": " ",
            "correct": true
        },
        {
            "time": 13060,
            "key": "1",
            "correct": true
        },
        {
            "time": 13800,
            "key": "f",
            "correct": true
        },
        {
            "time": 13900,
            "key": "a",
            "correct": true
        },
        {
            "time": 14010,
            "key": "c",
            "correct": true
        },
        {
            "time": 14130,
            "key": "o",
            "correct": false,
            "correctLetter": "t"
        },
        {
            "time": 14250,
            "key": "t",
            "correct": false,
            "correctLetter": "o"
        },
        {
            "time": 14340,
            "key": "i",
            "correct": false,
            "correctLetter": "r"
        },
        {
            "time": 14410,
            "key": "r",
            "correct": false,
            "correctLetter": "i"
        },
        {
            "time": 14510,
            "key": "l",
            "correct": false,
            "correctLetter": "a"
        },
        {
            "time": 14560,
            "key": "a",
            "correct": false,
            "correctLetter": "l"
        },
        {
            "time": 15040,
            "key": "R",
            "correct": true
        },
        {
            "time": 15120,
            "key": "e",
            "correct": true
        },
        {
            "time": 15280,
            "key": "c",
            "correct": true
        },
        {
            "time": 15320,
            "key": "u",
            "correct": true
        },
        {
            "time": 15450,
            "key": "s",
            "correct": false,
            "correctLetter": "r"
        },
        {
            "time": 15590,
            "key": "t",
            "correct": false,
            "correctLetter": "s"
        },
        {
            "time": 15640,
            "key": "i",
            "correct": true
        },
        {
            "time": 15770,
            "key": "v",
            "correct": true
        },
        {
            "time": 15870,
            "key": "e",
            "correct": true
        },
        {
            "time": 16520,
            "key": " ",
            "correct": true
        },
        {
            "time": 16630,
            "key": "n",
            "correct": true
        },
        {
            "time": 16780,
            "key": " ",
            "correct": true
        },
        {
            "time": 16850,
            "key": "=",
            "correct": true
        },
        {
            "time": 16940,
            "key": " ",
            "correct": true
        },
        {
            "time": 17170,
            "key": "n",
            "correct": true
        },
        {
            "time": 17290,
            "key": " ",
            "correct": true
        },
        {
            "time": 17490,
            "key": "*",
            "correct": true
        },
        {
            "time": 17600,
            "key": " ",
            "correct": true
        },
        {
            "time": 18060,
            "key": "f",
            "correct": true
        },
        {
            "time": 18170,
            "key": "a",
            "correct": true
        },
        {
            "time": 18270,
            "key": "c",
            "correct": true
        },
        {
            "time": 18490,
            "key": "t",
            "correct": true
        },
        {
            "time": 18500,
            "key": "o",
            "correct": true
        },
        {
            "time": 18640,
            "key": "r",
            "correct": true
        },
        {
            "time": 18670,
            "key": "i",
            "correct": true
        },
        {
            "time": 18820,
            "key": "a",
            "correct": true
        },
        {
            "time": 18940,
            "key": "l",
            "correct": true
        },
        {
            "time": 18950,
            "key": ";",
            "correct": false,
            "correctLetter": "R"
        },
        {
            "time": 19140,
            "key": "R",
            "correct": false,
            "correctLetter": "e"
        },
        {
            "time": 19220,
            "key": "e",
            "correct": false,
            "correctLetter": "c"
        },
        {
            "time": 20050,
            "key": "R",
            "correct": true
        },
        {
            "time": 20120,
            "key": "e",
            "correct": true
        },
        {
            "time": 20290,
            "key": "c",
            "correct": true
        },
        {
            "time": 20330,
            "key": "u",
            "correct": true
        },
        {
            "time": 20430,
            "key": "s",
            "correct": false,
            "correctLetter": "r"
        },
        {
            "time": 20620,
            "key": "t",
            "correct": false,
            "correctLetter": "s"
        },
        {
            "time": 20670,
            "key": "i",
            "correct": true
        },
        {
            "time": 20780,
            "key": "v",
            "correct": true
        },
        {
            "time": 20870,
            "key": "e",
            "correct": true
        },
        {
            "time": 21020,
            "key": " ",
            "correct": true
        },
        {
            "time": 21290,
            "key": "(",
            "correct": true
        },
        {
            "time": 21500,
            "key": "n",
            "correct": true
        },
        {
            "time": 21860,
            "key": " ",
            "correct": true
        },
        {
            "time": 21970,
            "key": "-",
            "correct": true
        },
        {
            "time": 22060,
            "key": " ",
            "correct": true
        },
        {
            "time": 22180,
            "key": "1",
            "correct": true
        },
        {
            "time": 22530,
            "key": ")",
            "correct": true
        }
    ],
    "language": "haskell",
    "passage": "factorialRecursive :: Integer -> Integer\nfactorialRecursive 0 = 1\nfactorialRecursive n = n * factorialRecursive (n - 1)",
    "difficulty": "easy",
    "time": 22530,
    "missedWords": [
        "factorialRecursive",
        "::",
        "Integer",
        "0",
        "="
    ]
})

/**
 * Make WPM data (raw)
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
    for (let i = 0; i < maxTime; i++) {
        if (i in timeData) {
            //average word 5 characters, 60 seconds in minute
            rawWpmArray.push(timeData[i] * 12);
        } else {
            rawWpmArray.push(0);
        }
    }
    return rawWpmArray;
}


/**
 * keep a running count of the WPM for each second
 * 
 * @returns array of wpm for each second
 */
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

/**
 * make the chart to display how the user did.
 */
export function createChart() {
    let rawWpmArray = makeTimeData();

    let correct = 0;
    for (let letter of testData.keystrokes) {
        if (letter.correct) {
            correct += 1;
        }
    }
    let wpm = ((correct / 5) / (testData.time / 60000)).toFixed(2);

    let wpmLine = Array.from({length: rawWpmArray.length}, (_, i) => wpm);

    let ctx = document.getElementById('chart').getContext('2d');
    const config = {
        type: 'line',
        data: {
            labels: Array.from({length: rawWpmArray.length}, (_, i) => i),
            datasets: [{
                label: 'average wpm',
                data: calculateWPMForEachSecond(),
                borderColor: LANGUAGES[testData.language].color,
                backgroundColor: 'transparent',
                tension: 0.4,
                pointRadius: 1,
                hoverRadius: 1,
            },
            {
                label: 'raw wpm',
                data: rawWpmArray,
                borderColor: LANGUAGES[testData.language].secondary,
                tension: 0.4,
                pointRadius: 1,
                hoverRadius: 1,
            },
            {
                label: 'wpm',
                data: wpmLine,
                borderColor: 'rgba(200, 200, 200, 0.5)',
                borderDash: [5, 5],
                borderWidth: 2,
                pointRadius: 0,
                hoverRadius: 0,
            },
        ]
        },
        options: {
            scales: {
                x: {
                    grid: {
                        display: false
                    },
                    type: 'linear',
                    label: {
                        display: true,
                        text: 'Seconds'
                    }
                },
                y: {
                    grid: {
                        display: false
                    },
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
                        title: function (ctx) {
                            return 'Second: ' + ctx[0].label;
                        },
                        label: function (ctx) {
                            console.log(ctx);
                            return ctx.dataset.label + ': ' + parseInt(ctx.raw);
                        },
                        labelColor: function (ctx) {
                            return {
                                borderColor: ctx.dataset.borderColor,
                                backgroundColor: ctx.dataset.borderColor
                            }
                        }
                    },
                },
            },
        }
    }
    
    let myChart = new Chart(ctx, config);
}