<script>
    import { LANGUAGES } from "../../utils/config";
    let { lang, selectable, selected } = $props();
    let node;

    if (selectable) {
        $effect(() => {
            node.addEventListener("click", () => {
                selected = !selected;
            });
        });
    }
</script>

<style>
    .language {
        background-color: transparent;
        transition: background-color 0.2s ease;
        user-select: none;
    }

    .selected {
        background-color: #77777769;
    }
</style>
<div class="language flex flex-start gap-1 p-2 rounded-md {selectable ? 'cursor-pointer' : ''} {selected ? 'selected' : ''}" bind:this={node}>
    <img class="max-h-6" src={LANGUAGES[lang].link} alt={lang} />{ lang }
</div>