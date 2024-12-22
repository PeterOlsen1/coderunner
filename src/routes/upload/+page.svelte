<script>
    import { LANGUAGES } from "../../utils/config";
    import Language from "$lib/components/Language.svelte";
    import { addLanguage, addPassage, approvePassage, uploadForApproval } from "../../utils/firebase/db";
    import { onMount } from "svelte";
    import { ensureAuth, user } from "../../utils/firebase/auth";
    import Swal from "sweetalert2";

    let openLanguages = Object.keys(LANGUAGES);

    let lang = "python";
    let difficulty = "easy";

    let difficulties = ["easy", "medium", "hard"];

    function updateLang(l) {
        lang = l;
    }

    function updateDifficulty(d) {
        difficulty = d;
    }

    function upload() {
        if (!user) {
            Swal.fire('You must be logged in to submit a passage.');
            return;
        }
        
        const text = document.getElementById("text").value;
        const url = document.getElementById("url").value;
        uploadForApproval(lang, difficulty, text, url);
        // approvePassage('python', 1);
    }

    function handleKeypress(e) {
        if (e.key === 'Tab') {
            e.preventDefault();
            const textarea = e.target;
            textarea.value = textarea.value + '    ';
        }
    }
    onMount(async () => {
        await ensureAuth();
        if (!user) {
            Swal.fire('You must be logged in to submit a passage.');
        }
    })
</script>

<svelte:head>
    <title>Upload</title>
</svelte:head>

<style>
    .language {
        border-radius: 5px;
        padding: 10px;
        cursor: pointer;
        background-color: rgba(200, 200, 200, 0);
        transition: background-color 0.2s;
    }

    textarea {
        width: 50%;
        height: 500px;
        border: 1px solid #ccc;
        border-radius: 5px;
        background-color: rgba(200, 200, 200, 0.2);
        padding: 3px;
    }

    .difficulty {
        border-radius: 5px;
        padding: 10px;
        cursor: pointer;
        background-color: rgba(200, 200, 200, 0);
        transition: background-color 0.2s;
    }

    button {
        background-color: rgba(200, 200, 200, 0.2);
        padding: 0.4em;
        border-radius: 5px;
        cursor: pointer;
        transition: background-color 0.2s;
        border: 1px solid white;
        margin-bottom: 3em;

        &:hover {
            background-color: rgba(200, 200, 200, 0.4);
        }
    }

    input {
        width: 50%;
        border: 1px solid #ccc;
        border-radius: 5px;
        background-color: rgba(200, 200, 200, 0.2);
        padding: 3px;
        margin-top: 0.4em;
    }

    .languages {
        width: 60%;
    }
</style>

<div class="w-full h-full flex flex-col items-center justify-center">
    <h1 class="text-4xl font-bold mt-6">Upload</h1>
    <p class="text-lg">Upload a code passage</p>

    <div class="flex flex-wrap justify-center languages">
        {#each openLanguages as language}
            <div class="mt-4 language" onclick="{() => updateLang(language)}" style="cursor: pointer; background-color: {lang === language ? 'rgba(200, 200, 200, 0.2)' : 'transparent'}">
                <Language lang={language} />
            </div>
        {/each}
    </div>

    <div class="flex flex-wrap justify-center difficulties">
        {#each difficulties as diff}
            <div class="mt-4 difficulty" onclick="{() => updateDifficulty(diff)}" style="cursor: pointer; background-color: {diff === difficulty ? 'rgba(200, 200, 200, 0.2)' : 'transparent'}">
                {diff}
            </div>
        {/each}
    </div>

    <br>
    <textarea name="text" id="text" placeholder="Your text here" spellcheck="false" onkeydown={handleKeypress}></textarea>
    <br>
    Source URL (if applicable)
    <input type="text" id="url" placeholder="https://example.com">
    <br>
    <button onclick={upload}>Submit</button>
</div>