<script>
    import { onMount } from "svelte";
    import Page from "../+page.svelte";

    let text = `def funny:
    return n * 2`;
    
    let lines = text.split('\n');
    let all = lines.map((line) => line.split(' '));
    let words = text.split(' ');

    let userText;
    let curIdx = $state(0);
    let curWordIdx = 0;
    let word = 0;
    let line = 0;
    let curLineIdx = 0;
    let newLine = false;
    let tabLength = 4;

    function focusInput() {
        document.querySelector("textarea").focus();
    }

    // set up the function that displays the snippet
    let display = $derived.by(() => {
        let slicedText = text.slice(curIdx);
        let linesDerived = slicedText.split('\n');
        let allDerived = linesDerived.map((line) => line.split(' '));

        let out = "";
        for (let line of allDerived) {
            let lineOut = "";
            for (let word of line) {
                if (word == '') {
                    if (line.length > 1) {
                        lineOut += '&nbsp;';
                    }
                    else {
                        newLine = true;
                    }
                }
                else {
                    lineOut += word +  ' ';
                }
            }
            lineOut = lineOut.slice(0, -1);
            lineOut += '<br>';
            out += lineOut;
        }

        console.log(out);
        return out;
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
        console.log(e);
        if (e.key === 'Tab') {
            e.preventDefault();

            console.log('hello')
            console.log(all[line][0])
            if (curWordIdx == 0 && all[line][0] === '') {
                word += tabLength - 1;
                curIdx += tabLength;
                const span = document.createElement('span');
                span.innerHTML = '&nbsp;&nbsp;&nbsp;&nbsp;';
                userText.appendChild(span);
            }
        }

        if (e.key === 'q') {
            console.log(all);
            console.log(`\ncurWordIdx: ${curWordIdx}\nword: ${word}`);
        }

        //they got the right letter or they're at the end of the line
        if (e.key == all[line][word][curWordIdx] || (e.key === ' ' && curWordIdx == all[line][word].length)
            || (e.key === 'Enter' && newLine)) {

            console.log('correct!');

            //user inputted a space. the word is done
            if (e.key === ' ') {
                correctLetter(' ');
                curWordIdx = 0;
                word += 1;
            }

            //user inputted an enter. line is done
            else if (e.key === 'Enter') {
                curLineIdx++;
                curWordIdx = 0;
                curIdx++;
                line++;
                const br = document.createElement('br');
                userText.appendChild(br);
                newLine = false;
            }

            //regular key that's correct
            else {
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
     * Reset the user's progress on the given word
     */
    function handleCtrlBackspace() {
        let currentWord = all[line][word];
        curIdx -= curWordIdx;

        for (let i = 0; i < curWordIdx; i++) {
            userText.childNodes[userText.childNodes.length - 1].remove();
        }
        curWordIdx = 0;
    }
    

    /**
     * Go back one character
     */
    function handleBackspace() {
        if (curIdx === 0) {
            return;
        }

        if (word === 0 && curWordIdx === 0) {
            console.log('hello?')
            line -= 1;
            console.log(all[line]);
            word = all[line].length;
            curWordIdx = all[line][word].length;
        }

        curIdx--;
        curWordIdx--;
        const node = userText.childNodes[userText.childNodes.length - 1];
        if (node.innerText == ' ') {
            word--;
            curWordIdx = all[line][word].length;
        }
        node.remove();

        debugUserText();
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
        userText.appendChild(span);
    }


    /**
     * Letter incorrect. Create span but also send them forward
     * @param l letter
     */
    function incorrectLetter(l) {
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
        console.log(out);
    }


    /**
     * When the user hits enter focus the text area
    */
    onMount(() => {
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
</style>


<div>
    <!-- svelte-ignore a11y_click_events_have_key_events -->
    <!-- svelte-ignore a11y_no_static_element_interactions -->
    <div class="text-container text-xl" onclick={focusInput}>
        <span bind:this={userText}></span><span class="passage-text">{@html display}</span>
    </div>
    <br>
    <textarea type="text" onkeydown={handleInput}></textarea>
</div>