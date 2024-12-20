<script>
    import Test from "./Test.svelte";
</script>

<svelte:head>
    <title>Home</title>
</svelte:head>

<div class="flex flex-col items-center h-screeen min-h-screen">
    <div class="pt-10"></div>
    <div class="w-screen h-10 grid grid-cols-3 text-center text-2xl">
        <div>new test</div>
        <div>code-runner;</div>
        <div>profile</div>
    </div>
    <div class="grid items-center flex-grow">
        <div class="flex-grow flex-col items-center">
            <Test />
            <small class="w-full text-center block mt-4 mb-8">
                hit 'enter' to start the test
            </small>
        </div>
    </div>
</div>