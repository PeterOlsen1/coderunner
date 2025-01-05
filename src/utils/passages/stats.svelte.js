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
export let testData = {"keystrokes":[{"time":0,"key":"l","correct":true},{"time":60,"key":"e","correct":true},{"time":160,"key":"t","correct":true},{"time":180,"key":" ","correct":true},{"time":310,"key":"r","correct":true},{"time":380,"key":"e","correct":true},{"time":530,"key":"c","correct":true},{"time":1370,"key":" ","correct":true},{"time":1510,"key":"m","correct":true},{"time":1620,"key":"a","correct":true},{"time":1710,"key":"p","correct":true},{"time":2000,"key":"_","correct":true},{"time":2320,"key":"l","correct":true},{"time":2380,"key":"t","correct":true},{"time":2540,"key":"r","correct":true},{"time":2700,"key":"e","correct":true},{"time":2820,"key":"e","correct":true},{"time":3090,"key":" ","correct":true},{"time":3410,"key":"(","correct":true},{"time":3870,"key":"f","correct":true},{"time":4340,"key":" ","correct":true},{"time":4530,"key":"'","correct":false,"correctLetter":":"},{"time":5880,"key":":","correct":true},{"time":6020,"key":" ","correct":true},{"time":6160,"key":"'","correct":true},{"time":6250,"key":"a","correct":true},{"time":6410,"key":" ","correct":true},{"time":6490,"key":"=","correct":false,"correctLetter":"-"},{"time":7370,"key":"=","correct":false,"correctLetter":"-"},{"time":7890,"key":"-","correct":true},{"time":8120,"key":">","correct":true},{"time":8380,"key":" ","correct":true},{"time":8550,"key":"'","correct":true},{"time":8660,"key":"b","correct":true},{"time":9160,"key":")","correct":true},{"time":9640,"key":" ","correct":true},{"time":9920,"key":"(","correct":true},{"time":10210,"key":"t","correct":true},{"time":10650,"key":" ","correct":true},{"time":10820,"key":":","correct":true},{"time":10940,"key":" ","correct":true},{"time":11170,"key":"'","correct":true},{"time":11250,"key":"a","correct":true},{"time":11550,"key":" ","correct":true},{"time":11820,"key":"l","correct":true},{"time":11940,"key":"t","correct":true},{"time":12090,"key":"r","correct":true},{"time":12250,"key":"e","correct":true},{"time":12370,"key":"e","correct":true},{"time":12630,"key":")","correct":true},{"time":12900,"key":" ","correct":true},{"time":13070,"key":":","correct":true},{"time":13250,"key":" ","correct":true},{"time":13400,"key":"'","correct":true},{"time":13590,"key":"b","correct":true},{"time":13990,"key":" ","correct":true},{"time":14290,"key":"l","correct":true},{"time":14400,"key":"t","correct":true},{"time":14540,"key":"r","correct":true},{"time":14670,"key":"e","correct":true},{"time":14810,"key":"e","correct":true},{"time":15020,"key":" ","correct":true},{"time":15190,"key":"=","correct":true},{"time":15910,"key":" ","correct":true},{"time":16920,"key":" ","correct":true},{"time":17060,"key":"m","correct":true},{"time":17170,"key":"a","correct":true},{"time":17270,"key":"t","correct":true},{"time":17430,"key":"c","correct":true},{"time":17510,"key":"h","correct":true},{"time":17670,"key":" ","correct":true},{"time":17810,"key":"t","correct":true},{"time":17970,"key":" ","correct":true},{"time":18140,"key":"w","correct":true},{"time":18200,"key":"i","correct":true},{"time":18270,"key":"t","correct":true},{"time":18320,"key":"h","correct":true},{"time":19380,"key":"h","correct":true},{"time":20200,"key":"|","correct":true},{"time":20450,"key":" ","correct":true},{"time":20680,"key":"L","correct":true},{"time":20900,"key":"e","correct":true},{"time":21030,"key":"a","correct":true},{"time":21140,"key":"f","correct":true},{"time":21950,"key":" ","correct":true},{"time":22140,"key":"9","correct":false,"correctLetter":"("},{"time":22390,"key":"N","correct":false,"correctLetter":"n"},{"time":23360,"key":"(","correct":true},{"time":23500,"key":"n","correct":true},{"time":23770,"key":")","correct":true},{"time":24470,"key":" ","correct":true},{"time":24630,"key":"-","correct":true},{"time":25910,"key":">","correct":true},{"time":26200,"key":" ","correct":true},{"time":26440,"key":"L","correct":true},{"time":26570,"key":"e","correct":true},{"time":26660,"key":"a","correct":true},{"time":26740,"key":"f","correct":true},{"time":26950,"key":" ","correct":true},{"time":27180,"key":"(","correct":true},{"time":27430,"key":"f","correct":true},{"time":27570,"key":" ","correct":true},{"time":27730,"key":"n","correct":true},{"time":28670,"key":")","correct":true},{"time":29470,"key":"}","correct":false,"correctLetter":"|"},{"time":30410,"key":"|","correct":true},{"time":30630,"key":" ","correct":true},{"time":30860,"key":"B","correct":true},{"time":30960,"key":"r","correct":true},{"time":31070,"key":"a","correct":true},{"time":31200,"key":"n","correct":true},{"time":31510,"key":"c","correct":true},{"time":31600,"key":"h","correct":true},{"time":31720,"key":" ","correct":true},{"time":31980,"key":"(","correct":true},{"time":32230,"key":"l","correct":true},{"time":33160,"key":",","correct":true},{"time":33250,"key":" ","correct":true},{"time":33340,"key":"r","correct":true},{"time":33670,"key":")","correct":true},{"time":33930,"key":" ","correct":true},{"time":34040,"key":"=","correct":false,"correctLetter":"-"},{"time":34840,"key":"-","correct":true},{"time":35060,"key":">","correct":true},{"time":35310,"key":" ","correct":true},{"time":35520,"key":"B","correct":true},{"time":35610,"key":"r","correct":true},{"time":35750,"key":"a","correct":true},{"time":35800,"key":"n","correct":true},{"time":35900,"key":"c","correct":true},{"time":35980,"key":"h","correct":true},{"time":36070,"key":" ","correct":true},{"time":36810,"key":" ","correct":true},{"time":37130,"key":"(","correct":true},{"time":37240,"key":"(","correct":true},{"time":37450,"key":"m","correct":true},{"time":37540,"key":"a","correct":true},{"time":37640,"key":"p","correct":true},{"time":38290,"key":"_","correct":true},{"time":38580,"key":"l","correct":true},{"time":38690,"key":"t","correct":true},{"time":38850,"key":"r","correct":true},{"time":38990,"key":"e","correct":true},{"time":39130,"key":"e","correct":true},{"time":39550,"key":" ","correct":true},{"time":39670,"key":"f","correct":true},{"time":39940,"key":" ","correct":true},{"time":40110,"key":"l","correct":true},{"time":40450,"key":")","correct":true},{"time":40760,"key":",","correct":true},{"time":40900,"key":" ","correct":true},{"time":41200,"key":"(","correct":true},{"time":41420,"key":"m","correct":true},{"time":41510,"key":"a","correct":true},{"time":41590,"key":"p","correct":true},{"time":41870,"key":"_","correct":true},{"time":42400,"key":"l","correct":true},{"time":42400,"key":";","correct":false,"correctLetter":"t"},{"time":43020,"key":"t","correct":true},{"time":43180,"key":"r","correct":true},{"time":43340,"key":"e","correct":true},{"time":43460,"key":"e","correct":true},{"time":44040,"key":" ","correct":true},{"time":44180,"key":"f","correct":true},{"time":44230,"key":" ","correct":true},{"time":44390,"key":"r","correct":true},{"time":44850,"key":")","correct":true},{"time":44940,"key":")","correct":true}],"language":"ocaml","passage":"let rec map_ltree (f : 'a -> 'b) (t : 'a ltree) : 'b ltree =\n  match t with\n  | Leaf (n) -> Leaf (f n)\n  | Branch (l, r) -> Branch ((map_ltree f l), (map_ltree f r))","difficulty":"easy","time":44940}


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