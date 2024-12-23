<script>
    import { onMount } from "svelte";
    import Page from "../+page.svelte";
    import { createPassageDataObject, createDisplayFromPassageObject } from "../../utils/passages/passage_generator.js";
    import Language from "../../lib/components/Language.svelte";
    import { getAllLanguages, getRandomPassage } from "../../utils/firebase/db";
    import { showStats, testData } from "../../utils/passages/stats.svelte";
    
    /** Text the user must type*/
    let text = $state('');
    let lines, all, words;

    /** List of selected languages*/
    let selectedLanguages = ['python'];

    /** current language */
    let language = $state('python');

    /** No languages selcted*/
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

    /** user is currently testing or not*/
    let currentlyTesting = $state(false);

    /** current test time */
    let time = $state(0);

    /** timer interval */
    let timer;

    /** time at which the last input was made*/
    let lastInput = 0;

    /** time at which the user will be unfocused*/
    let timeoutThreshhold = 1500;

    /** data for the open langauges*/
    let languageData = getAllLanguages();

    let difficulty;

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
        blurInput();
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

        let currentTextData = await getRandomPassage(language);
        difficulty = currentTextData.difficulty;
        text = currentTextData.passage;
        // text = 'type shit';
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

    function blurInput() {
        document.querySelector("textarea").blur();
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
            testData.keystrokes = [];
            testData.language = language;
            testData.passage = text;
            testData.difficulty = difficulty;
        }

        lastInput = time;

        if (e.key === 'Tab') {
            e.preventDefault();
            handleTab();
            return;
        }

        if (e.key === 'q') {
            console.log(all);
            console.log(`\ncurWordIdx: ${curWordIdx}\nword: ${word}`);
            console.log('display: ' + display);
            debugUserText();
            return;
        }

        if (e.key === 'Escape') {
            currentlyTesting = false;
            stopTimer();
            return;
        }

        if (e.key !== ' ' && e.key != 'Enter'  && e.key != 'Backspace' && curWordIdx == all[line][word].length) {
            return;
        }

        //they got the right letter or they're at the end of the line
        if (e.key == all[line][word][curWordIdx] || (e.key === ' ' && curWordIdx == all[line][word].length)
            || (e.key === 'Enter' && curWordIdx == all[line][word].length && word == all[line].length - 1)) {

            //user inputted a space. the word is done
            if (e.key === ' ' && !(word == all[line].length - 1)) {
                testData.keystrokes.push({time: time, key: ' ', correct: true});
                correctLetter(' ');
                curWordIdx = 0;
                word += 1;
            }

            //user inputted an enter. line is done
            else if (e.key === 'Enter') {
                if (line === all.length - 1) {
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

                testData.keystrokes.push({time: time, key: e.key, correct: true});
                correctLetter(e.key);

                //check if they finished the whole thing
                if (line === all.length - 1 && word === all[line].length - 1 && curWordIdx === all[line][word].length) {
                    showStats.state = true;
                    stopTimer();
                    testData.time = time;
                    currentlyTesting = false;
                    console.log(testData);

                    //fetch a new passage after 1/2s so the user doesn't see it
                    // (they will be on the stats screen)
                    setTimeout(() => getRandomText(), 500);
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
            testData.keystrokes.push({time: time, key: e.key, correct: false, correctLetter: all[line][word][curWordIdx]});
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
            line -= 1;
            word = all[line].length - 1;
            curWordIdx = all[line][word].length + 1;
        }

        curIdx--;
        curWordIdx--;
        const node = userText.childNodes[userText.childNodes.length - 1];
        if (node.innerHTML == '&nbsp;') {
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

        document.addEventListener('keyup', async (e) => {
            if (e.key === "Enter" && !noneSelected) {
                if (showStats.state) {
                    console.log('hello?')
                    showStats.state = false;
                }
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
        <div class="languages w-full flex gap-3 justify-center flex-wrap">
            {#await languageData}
                <div class="loader"></div>
            {:then languageData}
                {#each languageData as lang}
                    {#if !lang.unapproved}
                        <!-- svelte-ignore a11y_click_events_have_key_events -->
                        <!-- svelte-ignore a11y_no_static_element_interactions -->
                        <div onclick={() => addRemoveLanguage(lang.language)}>
                            <Language lang={lang.language} selectable={true} selected={selectedLanguages.find((l) => l == lang.language)}></Language>
                        </div>
                    {/if}
                {/each}
            {/await}
        </div>
        
        <small class="w-full text-center block mt-4 mb-8">
            hit 'enter' to start the test
        </small>
    </div>
</div>