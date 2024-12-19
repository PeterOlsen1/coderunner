<script>
	import '../app.css';
	let { children } = $props();
	export const prerender = true;
</script>

<div class="bg-neutral-800 h-screen">
	{@render children()}
</div>
