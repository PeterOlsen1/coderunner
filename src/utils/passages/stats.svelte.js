import { onMount } from "svelte";
import { Chart, LineController, CategoryScale, LinearScale, PointElement, LineElement } from "chart.js";

Chart.register(LineController, CategoryScale, LinearScale, PointElement, LineElement);
/**
 * Export this guy to determine whether or not stats are showing
 */
export let showStats = $state({state: true});

// export let testData = $state({keystrokes: []});


export let testData = {difficulty: 'easy', "keystrokes":[{"time":8520,"key":"0","correct":true},{"time":9150,"key":" ","correct":true},{"time":9780,"key":"=","correct":true},{"time":10110,"key":" ","correct":true},{"time":10440,"key":"1","correct":true},{"time":10960,"key":"f","correct":true},
    {"time":11050,"key":"a","correct":true},{"time":11170,"key":"c","correct":true},{"time":11330,"key":"t","correct":true},{"time":11410,"key":"o","correct":true},{"time":11500,"key":"r","correct":true},{"time":11580,"key":"i","correct":true},{"time":11620,"key":"a","correct":true},
    {"time":11720,"key":"l","correct":true},{"time":11950,"key":"R","correct":true},{"time":12040,"key":"e","correct":true},{"time":12260,"key":"v","correct":false,"correctLetter":"c"},{"time":12400,"key":"u","correct":true},{"time":13110,"key":"c","correct":true},{"time":13210,"key":"u","correct":true},
    {"time":13300,"key":"r","correct":true},{"time":13480,"key":"s","correct":true},{"time":13570,"key":"i","correct":true},{"time":13660,"key":"v","correct":true},{"time":13720,"key":"e","correct":true},{"time":13850,"key":" ","correct":true},{"time":13970,"key":"n","correct":true},{"time":14110,"key":" ","correct":true},
    {"time":14190,"key":"=","correct":true},{"time":14270,"key":" ","correct":true},{"time":14480,"key":"n","correct":true},{"time":14620,"key":" ","correct":true},{"time":16290,"key":" ","correct":true},{"time":16500,"key":"*","correct":true},{"time":16620,"key":" ","correct":true},{"time":16760,"key":"f","correct":true},{"time":16850,"key":"a","correct":true},{"time":16970,"key":"c","correct":true},{"time":17150,"key":"t","correct":true},{"time":17230,"key":"u","correct":false,"correctLetter":"o"},{"time":17290,"key":"r","correct":true},{"time":17440,"key":"i","correct":true},{"time":18220,"key":"o","correct":true},{"time":18310,"key":"r","correct":true},{"time":18390,"key":"i","correct":true},{"time":18450,"key":"a","correct":true},{"time":18510,"key":"l","correct":true},{"time":18710,"key":"R","correct":true},{"time":18810,"key":"e","correct":true},{"time":18950,"key":"c","correct":true},{"time":19100,"key":"u","correct":true},{"time":19140,"key":"r","correct":true},{"time":19300,"key":"s","correct":true},{"time":19400,"key":"i","correct":true},{"time":19470,"key":"v","correct":true},{"time":19540,"key":"e","correct":true},{"time":19690,"key":" ","correct":true},{"time":20200,"key":"(","correct":true},{"time":20500,"key":"n","correct":true},{"time":20830,"key":" ","correct":true},{"time":21710,"key":"0","correct":false,"correctLetter":"-"},{"time":21830,"key":" ","correct":true},{"time":22660,"key":"-","correct":true},{"time":22770,"key":" ","correct":true},{"time":22860,"key":"1","correct":true},{"time":23190,"key":")","correct":true}],"language":"haskell","passage":"factorialRecursive :: Integer -> Integer\nfactorialRecursive 0 = 1\nfactorialRecursive n = n * factorialRecursive (n - 1)","time":23190}


/**
 * Make WPM data
 */
function makeTimeData() {
    let timeData = {};
    let maxTime = parseInt(testData.keystrokes[testData.keystrokes.length - 1].time / 1000);
    for (let keystroke of testData.keystrokes) {
        console.log(keystroke)
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

export function createChart() {
    let rawWpmArray = movingAverage(makeTimeData(), 1);
    console.log(rawWpmArray);

    let ctx = document.getElementById('chart').getContext('2d');
    let myChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: Array.from({length: rawWpmArray.length}, (_, i) => i),
            datasets: [{
                label: 'wpm',
                data: rawWpmArray,
                borderColor: 'rgb(75, 192, 192)',
                tension: 0.4
            },
            // {
            //     label: 'average',
            //     data: movingAverage(rawWpmArray, 3),
            //     borderColor: 'rgb(192, 75, 192)',
            //     tension: 0.4
            // }
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
            legend: {
                display: true
            }
        }
    });
}