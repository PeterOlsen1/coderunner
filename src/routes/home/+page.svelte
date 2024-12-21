<script>
    import Passage from "./Passage.svelte";
</script>

<svelte:head>
    <title>Home</title>
</svelte:head>

<div class="flex flex-col items-center h-screeen min-h-screen">
    <div class="pt-10"></div>
    <div class="w-screen h-10 grid grid-cols-3 text-center text-2xl">
        <div>new passage</div>
        <div>code-runner;</div>
        <div>profile</div>
    </div>
    <div class="grid items-center flex-grow">
        <div class="flex-grow flex-col items-center">
            <Passage />
        </div>
    </div>
</div>