<script>
	import '../app.css';
	let { children } = $props();
	export const prerender = true;
</script>

<div class="bg-neutral-800 h-screen min-h-screen overflow-x-hidden">
	{@render children()}
</div>
