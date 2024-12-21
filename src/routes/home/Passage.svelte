<script>
    import { onMount } from "svelte";
    import Page from "../+page.svelte";
    import { createPassageDataObject, createDisplayFromPassageObject, getText } from "../../utils/passages/passage_generator.js";
    import Language from "../../lib/components/Language.svelte";
    import { LANGUAGES } from "../../utils/config";


    let offeredLanguages = Object.keys(LANGUAGES);

    let text = $state('');
    let lines, all, words;

    let selectedLanguages = ['python'];
    let language = $state('javascript');
    let noneSelected = $state(false);

    
    /** Container referring to where the user's text is displayed */
    let userText;

    /** Current typing index. used to run the 'derived.by' function */
    let curIdx = $state(0);

    /** The user's position within the current WORD */
    let curWordIdx = 0;

    /** The index of the current word the user is typing within the line */
    let word = 0;

    /** The index of the current line the user is typing on within 'all' */
    let line = 0;
    let tabLength = 4;

    /** Auto tab will only work if user is at the start of a line */
    let autoTab = true;

    let currentlyTesting = $state(false);
    let timeSinceLastInput = 0;
    let time = $state(0);
    let timer;
    let lastInput = 0;
    let timeoutThreshhold = 800; //in ms

    function startTimer() {
        timer = setInterval(() => {
            if (time - lastInput > timeoutThreshhold) {
                stopTimer();
                currentlyTesting = false;
            }

            time += 10;
        }, 10);
    }

    function stopTimer() {
        clearInterval(timer);
        timer = '';
    }

    //derive the time display
    let timeDisplay = $derived.by(() => {
        let out = "";
        let tempTime = time;
        if (time > 60000) {
            let minutes = Math.floor(tempTime / 60000);
            if (minutes < 10) {
                out += '0';
            }
            out += `${Math.floor(tempTime / 60000)}:`;
            tempTime %= 60000;
        }

        let seconds = Math.floor(tempTime / 1000);
        if (seconds < 10) {
            out += '0';
        }

        out += (tempTime / 1000).toFixed(2);
        return out;
    });

    /**
     * Get a random text from the selected languages
     */
    async function getRandomText() {
        if (selectedLanguages.length === 0) {
            return;
        }

        time = 0;
        lastInput = 0;

        language = selectedLanguages[Math.floor(Math.random() * selectedLanguages.length)];
        // return await getText(language);
        languageSelection();
    }

    async function languageSelection() {
        text = await getText(language);
        lines = text.split('\n');
        all = lines.map((line) => line.split(' '));
        words = text.split(' ');

        userText.innerHTML = '';
        curWordIdx = 0;
        word = 0;
        line = 0;
        curIdx = 0;
    }

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
        if (!currentlyTesting) {
            currentlyTesting = true;
            startTimer();
        }

        lastInput = time;

        if (e.key === 'Tab') {
            e.preventDefault();
            handleTab();
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
                    console.log('congrats! you did it');
                    return;
                }
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
                    stopTimer();
                    currentlyTesting = false;
                }
            }
        }

        //handle backspace
        else if (e.key === 'Backspace') {
            if (e.ctrlKey) {
                handleCtrlBackspace();
            }
            else {
                handleBackspace();
            }
        }
        
        //user inputted a correct key but it's not right
        else if (validLetter(e.key)) {
            console.log(`incorrect!\nwords: ${all[line]}\ncurWordIdx: ${curWordIdx}\nword: ${word}\nyou need to type: ${all[line][word]}`)
            incorrectLetter(e.key);
        }
    }   

    
    /**
     * Handle Tab input
     */
    function handleTab() {
        //auto tab is on, automatically do all the spaces for them
        if (autoTab && word == 0 && curWordIdx == 0) {
            while (word < all[line].length - 1 && (all[line][word] === '' || all[line][word] === ' ')) {
                correctLetter(' ');
                word++;
                curWordIdx = 0;
            }

            return;
        }

        //treat a tab as {tabLength} spaces
        for (let i = 0; i < tabLength; i++) {
            if (word != all[line].length - 1 && (curWordIdx == all[line][word].length || all[line][word] === '' || all[line][word] === ' ')) {
                correctLetter(' ');
                word++;
                curWordIdx = 0;
                console.log('Space valid'); 
            }
            else {
                if (curWordIdx + i >= lines[line].length) {
                    return;
                }

                // if (curWordIdx)
                console.log('Space not valid');
                incorrectLetter(' ');
            }
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
        //don't let the user go past the end of the line
        if (word == all[line].length - 1 && curWordIdx == all[line][word].length) {
            return;
        }

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
        span.style.color = 'rgb(223, 66, 66)';

        let correct = all[line][word][curWordIdx - 1];
        if (correct == ' ' || !correct) {
            span.innerHTML = '_';
            word++;
            curWordIdx = 0;
        }
        else {
            span.innerHTML = correct;
        }

        userText.appendChild(span);
    }

    function debugUserText() {
        let out = '';
        for (let node of userText.childNodes) {
            out += node.innerText;
        }
        console.log('user text: ' + out);
    }

    function addRemoveLanguage(lang) {
        if (selectedLanguages.includes(lang)) {
            selectedLanguages = selectedLanguages.filter((l) => l != lang);

            if (!selectedLanguages.length) {
                noneSelected = true;
                language = "None";
                text = "";
            }

            if (language === lang) {
                getRandomText();
                noneSelected = false;
            }
        }
        else {
            selectedLanguages = [...selectedLanguages, lang];
            noneSelected = false;

            if (selectedLanguages.length === 1) {
                console.log(selectedLanguages);
                getRandomText();
            }
        }
    }


    /**
     * When the user hits enter focus the text area
    */
    onMount(async () => {
        getRandomText(language);

        document.addEventListener('keyup', (e) => {
            if (e.key === "Enter" && !noneSelected) {
                // currentlyTesting = true;
                focusInput();
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

    .language-container {
        /* background-color: #1f1f1f; */
        border-radius: 0.5rem;
        margin-top: 3rem;
        opacity: 1;
        transition: opacity 0.3s;
    }
</style>


<div>
    <textarea type="text" onkeydown={handleInput}></textarea>

    {#if noneSelected}
        <div class="text-center text-xl">
            Please select a language
        </div>
    {:else} 
        <div class="text-left text-xl mb-2 flex gap-3">
            <img src="https://www.svgrepo.com/show/23258/timer.svg" alt="timer" class="w-4" style="filter: invert(1);">
            <span>{timeDisplay}</span>
        </div>
        <!-- svelte-ignore a11y_click_events_have_key_events -->
        <!-- svelte-ignore a11y_no_static_element_interactions -->
        <div class="text-container text-xl relative" onclick={focusInput}>
            <span bind:this={userText}></span><span class="cursor">|</span><span class="passage-text">{@html display}</span>
        </div>
    {/if}
    
    <div class="language-container" style="opacity: {!currentlyTesting ? 1 : 0}">
        <div class="w-full grid grid-cols-3">
            <div>
                Language: {language}
            </div>
            <div></div>
            {#if !noneSelected}
                <!-- svelte-ignore a11y_click_events_have_key_events -->
                <!-- svelte-ignore a11y_no_static_element_interactions -->
                <div class="flex justify-end gap-2 cursor-pointer" onclick={getRandomText}>
                    <img class="w-4" src="https://www.svgrepo.com/show/110727/redo-arrow-symbol.svg" alt="redo" style="filter: invert(1);"> New Passage
                </div>
            {/if}
        </div>
        <br>
        <div class="languages w-full flex gap-3 justify-center flex-wrap max-w-screen-md">
            {#each offeredLanguages as lang}
                <!-- svelte-ignore a11y_click_events_have_key_events -->
                <!-- svelte-ignore a11y_no_static_element_interactions -->
                <div onclick={() => addRemoveLanguage(lang)}>
                    <Language lang={lang} selectable={true} selected={selectedLanguages.find((l) => l == lang)}></Language>
                </div>
            {/each}
        </div>
        
        <small class="w-full text-center block mt-4 mb-8">
            hit 'enter' to start the test
        </small>
    </div>
</div>