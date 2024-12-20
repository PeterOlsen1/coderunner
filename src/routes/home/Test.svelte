<script>
    import { onMount } from "svelte";
    import Page from "../+page.svelte";
    import { createPassageDataObject, createDisplayFromPassageObject, getText } from "../../utils/passages/passage_generator.js";

    let text = $state('');
    let lines, all, words;

    onMount(async () => {
        text = await getText(language);
        lines = text.split('\n');
        all = lines.map((line) => line.split(' '));
        words = text.split(' ');
    });

    let language = $state('javascript');

    async function languageSelection() {
        text = await getText(language);
        lines = text.split('\n');
        all = lines.map((line) => line.split(' '));
        words = text.split(' ');

        userText.innerHTML = '';
        curWordIdx = 0;
        word = 0;
        line = 0;
        curLineIdx = 0;
        curIdx = 0;
    }


    let userText;
    let curIdx = $state(0);
    let curWordIdx = 0;
    let word = 0;
    let line = 0;
    let curLineIdx = 0;
    let tabLength = 4;

    function focusInput() {
        document.querySelector("textarea").focus();
    }

    // set up the function that displays the snippet
    let display = $derived.by(() => {
        let slicedText = text.slice(curIdx);
        return createDisplayFromPassageObject(
            createPassageDataObject(slicedText)
        );
    }); 


    /**
     * Check if l is a valid letter or punctuation mark
     * @param l letter
     */
    function validLetter(l) {
        const letters = 'eariotnslcudpmhgbfywkvxzjq';
        const punct = '{}1234567890!@#$%^&*()`~-=_+[]{}\\|;\'",./<>?';
        
        for (let letter of letters) {
            if (l === letter || l === letter.toUpperCase()) {
                return true;
            }
        }

        for (let letter of punct) {
            if (l === letter) {
                return true;
            }
        }
        return false;
    }

    /**
     * This is the big one. decide what we do based on user input
     * @param e event
     */
    function handleInput(e) {
        if (e.key === 'Tab') {
            e.preventDefault();

            if (curWordIdx == 0 && all[line][0] === '') {
                word += tabLength;
                curIdx += tabLength;
                for (let i = 0; i < 4; i++) {
                    const span = document.createElement('span');
                    span.innerHTML = '&nbsp;';
                    userText.appendChild(span);
                }
            }
        }

        if (e.key === 'q') {
            console.log(all);
            console.log(`\ncurWordIdx: ${curWordIdx}\nword: ${word}`);
            console.log('display: ' + display);
            debugUserText();
            return;
        }
        
        //they got the right letter or they're at the end of the line
        if (e.key == all[line][word][curWordIdx] || (e.key === ' ' && curWordIdx == all[line][word].length)
            || (e.key === 'Enter' && curWordIdx == all[line][word].length && word == all[line].length - 1)) {

            //user inputted a space. the word is done
            if (e.key === ' ' && !(word == all[line].length - 1)) {
                correctLetter(' ');
                curWordIdx = 0;
                word += 1;
            }

            //user inputted an enter. line is done
            else if (e.key === 'Enter') {
                if (line === all.length - 1) {
                    return;
                }
                curLineIdx++;
                curWordIdx = 0;
                word = 0;
                curIdx++;
                line++;
                const br = document.createElement('br');
                userText.appendChild(br);
            }

            //regular key that's correct
            else {
                if (word == all[line].length - 1 && curWordIdx == all[line][word].length) {
                    return;
                }

                correctLetter(e.key);

                //check if they finished the whole thing
                if (line === all.length - 1 && word === all[line].length - 1 && curWordIdx === all[line][word].length) {
                    console.log('you did it!');
                }
            }
        }

        else if (e.key === 'Backspace') {
            if (e.ctrlKey) {
                handleCtrlBackspace();
            }
            else {
                handleBackspace();
            }
        }
        
        else if (validLetter(e.key)) {
            console.log(`incorrect!\nwords: ${all[line]}\ncurWordIdx: ${curWordIdx}\nword: ${word}\nyou need to type: ${all[line][word]}`)
            incorrectLetter(e.key);
        }
    }   

    /**
     * Go back one character
     */
     function handleBackspace() {
        if (curIdx === 0) {
            return;
        }

        if (word === 0 && curWordIdx === 0) {
            console.log('backspace line')
            line -= 1;
            word = all[line].length - 1;
            curWordIdx = all[line][word].length + 1;
        }

        curIdx--;
        curWordIdx--;
        const node = userText.childNodes[userText.childNodes.length - 1];
        console.log(node.innerHTML);
        if (node.innerHTML == '&nbsp;') {
            console.log('hello')
            word--;
            curWordIdx = all[line][word].length;
        }
        node.remove();

        debugUserText();
    }


    /**
     * Reset the user's progress on the given word
     */
    function handleCtrlBackspace() {
        let currentWord = all[line][word];
        curIdx -= curWordIdx;

        if (!curWordIdx) {
            return;
        }

        for (let i = 0; i < curWordIdx; i++) {
            userText.childNodes[userText.childNodes.length - 1].remove();
        }
        curWordIdx = 0;
    }


    /**
     * Letter is correct. Create span and send them forward one
     * @param l letter
     */
    function correctLetter(l) {
        curIdx++;
        curWordIdx++;
        const span = document.createElement('span');
        span.innerText = l;
        if (l === ' ') {
            span.innerHTML = '&nbsp;';
        }
        userText.appendChild(span);
    }


    /**
     * Letter incorrect. Create span but also send them forward
     * @param l letter
     */
    function incorrectLetter(l) {
        //user is at the end of a line. don't let them go any further
        if (word == all[line].length - 1 && curWordIdx == all[line][word].length) {
            return;
        }

        curIdx++;
        curWordIdx++;
        const span = document.createElement('span');
        // span.className = 'red';
        span.style.color = 'rgb(223, 66, 66)';
        span.innerText = l;
        userText.appendChild(span);
    }

    function debugUserText() {
        let out = '';
        for (let node of userText.childNodes) {
            out += node.innerText;
        }
        console.log('user text: ' + out);
    }


    /**
     * When the user hits enter focus the text area
    */
    onMount(async () => {
        document.addEventListener('keyup', (e) => {
            if (e.key === "Enter") {
                document.querySelector("textarea").focus();
            }
        });
    });
</script>

<style>
    textarea {
        opacity: 0;
        height: 0px;
        width: 0px;
    }

    .passage-text {
        color: rgba(255, 255, 255, 0.377)
    }

    .cursor {
        position: absolute;
        width: 0;
        animation: blink 0.75s infinite;
    }

    @keyframes blink {
        0%, 100% {
            color: white;
        }
        50% {
            color: transparent;
        }
    }

    select {
        color: black;
    }
</style>


<div>
    <!-- svelte-ignore a11y_click_events_have_key_events -->
    <!-- svelte-ignore a11y_no_static_element_interactions -->
    <div class="text-container text-xl relative" onclick={focusInput}>
        <span bind:this={userText}></span><span class="cursor">|</span><span class="passage-text">{@html display}</span>
    </div>
    <br>
    <textarea type="text" onkeydown={handleInput}></textarea>
    Language: <select name="" id="" bind:value={language} onchange={languageSelection}>
        <option value="python">python</option>
        <option value="javascript">javascript</option>
        <option value="css">css</option>
        <option value="c++">c++</option>
    </select>
</div>