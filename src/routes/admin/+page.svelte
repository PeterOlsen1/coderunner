<script>
    import { ensureAuth, user } from "../../utils/firebase/auth";
    import { onMount } from "svelte";
    import { getAllUnapprovedPassages, approvePassage, denyPassage } from "../../utils/firebase/db";
    import Language from "$lib/components/Language.svelte";

    let unapproved = $state([]);
    let unapprovedLanguages = $state([]);

    function filterPassages(lang, id) {
        unapproved[lang] = unapproved[lang].filter(p => p.id !== id);
        if (unapproved[lang].length === 0) {
            unapprovedLanguages = unapprovedLanguages.filter(l => l !== lang);
        }
    }

    onMount(async () => {
        await ensureAuth();
        if (!user) {
            window.location.href = "/";
        }

        if (user.uid != 'HftX7OrOzqhFFRwqSaHuRSgDELZ2') {
            window.location.href = '/home';
        }

        unapproved = await getAllUnapprovedPassages();
        unapprovedLanguages = Object.keys(unapproved);
        unapprovedLanguages.sort((a, b) => {
            return unapproved[b].length - unapproved[a].length;
        });
    });
</script>

<style>
    textarea {
        width: 70%;
        border: 1px solid #ccc;
        border-radius: 5px;
        background-color: rgba(200, 200, 200, 0.2);
        padding: 3px;
    }
</style>

<div class="w-full flex flex-col items-center">
    <div class="text-4xl mt-6">Admin Page</div>
    <div class="mt-6">Passages Awaiting Approval</div>

    <br><br>
    <div class="w-full flex flex-col items-center">
        {#each unapprovedLanguages as lang}
            <Language lang={lang}></Language>
            {#each unapproved[lang] as passage}
                <div class="mt-2 w-full flex flex-col items-center">
                    <div>
                        Difficulty: {passage.difficulty} |
                        Lines: {passage.lines}
                    </div>
                    <textarea value={passage.passage} class="overflow-hidden"></textarea>
                    <div>
                        <button class="bg-green-500 text-white p-2 rounded mt-3 mb-7" onclick={() => {filterPassages(lang, passage.id); approvePassage(lang, passage.id)}}>Approve</button>
                        <button class="bg-red-500 text-white p-2 rounded mt-3 mb-7" onclick={() => {filterPassages(lang, passage.id); denyPassage(lang, passage.id)}}>Deny</button>    
                    </div>
                </div>
            {/each}
        {/each}
        {#if !unapprovedLanguages}
            <div>Loading...</div>
        {:else}
            {#if unapprovedLanguages.length === 0}
                <div>No passages awaiting approval</div>
            {/if}
        {/if}
    </div>
</div>