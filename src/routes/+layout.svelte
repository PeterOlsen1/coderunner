<script>
	import '../app.css';
	let { children } = $props();
	export const prerender = true;
</script>

<div class="bg-neutral-800 h-screen min-h-screen overflow-x-hidden">
	<div class="pt-10"></div>
    <div class="w-screen h-10 grid grid-cols-3 text-center text-2xl">
        <div>new passage</div>
        <div>code-runner;</div>
        <div>profile</div>
    </div>
	{@render children()}
</div>
