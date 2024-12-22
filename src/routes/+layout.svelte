<script>
    import { page } from '$app/state';
	import '../app.css';
	let { children } = $props();

    let excludeHeader = $state(page.route.id === '/');
	export const prerender = true;
</script>

<div class="bg-neutral-800 h-screen min-h-screen overflow-x-hidden">
    {#if !excludeHeader}
        <div class="pt-10"></div>
        <div class="w-screen h-10 grid grid-cols-3 text-center text-2xl">
            <div><a href="/upload">upload passage</a></div>
            <div><a href="/home">code-runner;</a></div>
            <div>profile</div>
        </div>
    {/if}
	{@render children()}
</div>
