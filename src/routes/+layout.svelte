<script>
    import { page } from '$app/state';
	import '../app.css';
	let { children } = $props();

    let excludeHeader = $state(page.route.id === '/');
	export const prerender = true;
</script>

<div class="bg-neutral-800 min-h-screen overflow-x-hidden">
    {#if !excludeHeader}
        <div class="pt-6"></div>
        <div class="h-10 grid grid-cols-3 text-center text-2xl relative">
            <div><a href="/upload">upload passage</a></div>
            <div><a href="/home">code-runner;</a></div>
            <div>
                <a href="/profile" class="flex w-full justify-center gap-4">
                    <span>
                        profile
                    </span>
                    <img src="/profile.png" alt="Profile" style="filter:invert(100%); width: 1em; height: 1em; position: relative; top: 0.2em;">
                </a> 
            </div>
        </div>
    {/if}
	{@render children()}
</div>
