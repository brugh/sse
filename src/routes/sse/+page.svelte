<script lang="ts">
	import { onMount } from 'svelte';

	let result: string[] = [];

	async function subscribe() {
		const response = await fetch('/');
		if (!response.body) return;
		const reader = response.body.pipeThrough(new TextDecoderStream()).getReader();
		while (true) {
			const { value, done } = await reader.read();
			if (done) break;
			result = [...result, value];
		}
	}

	onMount(subscribe);
</script>

{#each result as str}
	<p>{str}</p>
{/each}
