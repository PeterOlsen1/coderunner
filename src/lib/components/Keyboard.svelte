<script>
    import { onMount } from 'svelte';
    let { letters } = $props();
    let keyboard;
    let infoWindow;
    let keymap = {
        '`': [1, 1],
        '~': [1, 1],
        '1': [1, 2],
        '!': [1, 2],
        '2': [1, 3],
        '@': [1, 3],
        '3': [1, 4],
        '#': [1, 4],
        '4': [1, 5],
        '$': [1, 5],
        '5': [1, 6],
        '%': [1, 6],
        '6': [1, 7],
        '^': [1, 7],
        '7': [1, 8],
        '&': [1, 8],
        '8': [1, 9],
        '*': [1, 9],
        '9': [1, 10],
        '(': [1, 10],
        '0': [1, 11],
        ')': [1, 11],
        '-': [1, 12],
        '_': [1, 12],
        '=': [1, 13],
        '+': [1, 13],
        'BACKSPACE': [1, 14],
        'TAB': [2, 1],
        'Q': [2, 2],
        'W': [2, 3],
        'E': [2, 4],
        'R': [2, 5],
        'T': [2, 6],
        'Y': [2, 7],
        'U': [2, 8],
        'I': [2, 9],
        'O': [2, 10],
        'P': [2, 11],
        '[': [2, 12],
        '{': [2, 12],
        ']': [2, 13],
        '}': [2, 13],
        '\\': [2, 14],
        '|': [2, 14],
        'CAPS': [3, 1],
        'A': [3, 2],
        'S': [3, 3],
        'D': [3, 4],
        'F': [3, 5],
        'G': [3, 6],
        'H': [3, 7],
        'J': [3, 8],
        'K': [3, 9],
        'L': [3, 10],
        ';': [3, 11],
        ':': [3, 11],
        "'": [3, 12],
        '"': [3, 12],
        'ENTER': [3, 14],
        'SHIFT': [4, 1],
        'Z': [4, 2],
        'X': [4, 3],
        'C': [4, 4],
        'V': [4, 5],
        'B': [4, 6],
        'N': [4, 7],
        'M': [4, 8],
        ',': [4, 9],
        '<': [4, 9],
        '.': [4, 10],
        '>': [4, 10],
        '/': [4, 11],
        '?': [4, 11],
        'SPACE': [5, 1],
    }

    //helper function to get the document ref of a key
    /**
     * Get the coordinate of a key on the keybaord
     * 
     * @param letter letter to find
     * @param coord optional coordinate to use in place of letter
     * @returns the key element
     */
    function getKey(letter, coord=null) {
        if (!coord) {
            coord = keymap[letter.toUpperCase()];
        }
        let row = coord[0] - 1;
        let col = coord[1] - 1;
        let key = keyboard.children[row].children[col];
        return key;
    }

    //make and populate a frequency table
    let frequency = {};
    for (let letter of letters) {
        let coord = keymap[letter.correctLetter.toUpperCase()];
        frequency[coord] = frequency[coord] ? frequency[coord] + 1 : 1;
    }

    //get all of the different frequencies
    let differentFrequencies = [];
    Object.keys(frequency).forEach(coord => {
        if (!differentFrequencies.includes(frequency[coord])) {
            differentFrequencies.push(frequency[coord]);
        }
    });
    differentFrequencies.sort();
    differentFrequencies.reverse();
    
    //create a color gradient
    let colorGradient = [];
    for (let i = 0; i < differentFrequencies.length; i++) {
        let color = `rgba(255, 0, 0, ${1 - (i / differentFrequencies.length)})`;
        colorGradient.push(color);
    }


    /**
     * move the info window to the key that was hovered
     * and change the text
     * 
     * @param e
     */
    function moveInfoWindow(e) {
        console.log(infoWindow);
        console.log(e.target.getBoundingClientRect());
        let rect = e.target.getBoundingClientRect();
        let scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        let scrollLeft = window.pageXOffset || document.documentElement.scrollLeft;

        infoWindow.style.left = `calc(${rect.x + scrollLeft}px - 1em)`;
        infoWindow.style.top = `calc(${rect.top + scrollTop}px - 4.2em)`;

        let letters = e.target.innerText.split("");
        let innerText = "";
        for (let letter in letters) {   
            innerText += letter + ": " + frequency[keymap[letter.toUpperCase()]] + "\n";
        }
        infoWindow.innerText = innerText;
        infoWindow.style.opacity = 1;
    }

    function hideInfoWindow() {
        infoWindow.style.opacity = 0;
    }

    /**
     * add event listeners to all missed keys
     */
    function addEventListeners() {
        Object.keys(frequency).forEach((coord, i) => {
            let key = getKey('', JSON.parse(`[${coord}]`));
            key.addEventListener('mouseenter', moveInfoWindow);
            key.addEventListener('mouseleave', hideInfoWindow);
        });
    }

    //color keys on component mount
    onMount(() => {
        addEventListeners();

        Object.keys(frequency).forEach((coord, i) => {
            let key = getKey('', JSON.parse(`[${coord}]`));
            let freqIndex = differentFrequencies.indexOf(frequency[coord]);
            key.style.backgroundColor = colorGradient[freqIndex];
        });
    });
</script>

<style>
    .row {
        display: flex;
        justify-content: center;
        gap: 2px;
        user-select: none;
        font-size: 11pt;
    }

    .key {
        width: 2.5em;
        height: 2.5em;
        border: 1px solid white;
        text-align: center;
    }

    .key-wide {
        width: 6em;
    }

    .key-semi-wide {
        width: 4em;
    }

    .caps {
        width: 5em;
    }

    .shift {
        width: 6.9em;
    }

    .space {
        width: 20em;
    }

    .row-5 {
        justify-content: center;
    }

    .keyboard {
        margin-bottom: 2em;
    }

    .info-window {
        width: 4em;
        height: 4em;
        overflow: hidden;
        word-wrap: break-word;
        background-color: rgba(200, 200, 200, 0.443);
        border: 1px solid white;
        position: absolute;
        left: 0;
        top: 0;
        transition: top 0.2s, left 0.2s, opacity 0.2s;
        transition-delay: opacity 1s;
    }
    
    .info-window-underlay {
        width: 100%;
        height: 100%;
        background-color: rgba(0, 0, 0);
    }
</style>

<div bind:this={keyboard} class="flex flex-col justify-center keyboard">
    <div class="row-1 row">
        <div class="key">`~</div>
        <div class="key">1!</div>
        <div class="key">2@</div>
        <div class="key">3#</div>
        <div class="key">4$</div>
        <div class="key">5%</div>
        <div class="key">6^</div>
        <div class="key">7&</div>
        <div class="key">8*</div>
        <div class="key">9(</div>
        <div class="key">0)</div>
        <div class="key">-_</div>
        <div class="key">=+</div>
        <div class="key key-wide">←</div>
    </div>
    <div class="row-2 row">
        <div class="key key-semi-wide">Tab</div>
        <div class="key">Q</div>
        <div class="key">W</div>
        <div class="key">E</div>
        <div class="key">R</div>
        <div class="key">T</div>
        <div class="key">Y</div>
        <div class="key">U</div>
        <div class="key">I</div>
        <div class="key">O</div>
        <div class="key">P</div>
        <div class="key">{"[{"}</div>
        <div class="key">{"]}"}</div>
        <div class="key" style="width: 4.5em;">\|</div>
    </div>
    <div class="row-3 row">
        <div class="key caps">Caps</div>
        <div class="key">A</div>
        <div class="key">S</div>
        <div class="key">D</div>
        <div class="key">F</div>
        <div class="key">G</div>
        <div class="key">H</div>
        <div class="key">J</div>
        <div class="key">K</div>
        <div class="key">L</div>
        <div class="key">;:</div>
        <div class="key">'"</div>
        <div class="key key-wide" style="width: 6.1em">Enter</div>
    </div>
    <div class="row-4 row">
        <div class="key shift">Shift</div>
        <div class="key">Z</div>
        <div class="key">X</div>
        <div class="key">C</div>
        <div class="key">V</div>
        <div class="key">B</div>
        <div class="key">N</div>
        <div class="key">M</div>
        <div class="key">,&lt;</div>
        <div class="key">.&gt;</div>
        <div class="key">/?</div>
        <div class="key shift">Shift</div>
    </div>
    <div class="row-5 row">
        <div class="key space"></div>
    </div>
    <div bind:this={infoWindow} class="info-window">
        <div class="info-window-underlay"></div>
    </div>
</div>