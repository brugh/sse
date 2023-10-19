<script lang="ts">
	import '../app.postcss';
	import { AppBar } from '@skeletonlabs/skeleton';
</script>

<AppBar class="text-2xl" gridColumns="grid-cols-3" slotDefault="place-self-center" slotTrail="place-content-end">
	<svelte:fragment slot="lead">
		<button type="button" class="btn-icon bg-initial text-2xl">&#x2630;</button>
	</svelte:fragment>
	Realtime test
	<svelte:fragment slot="trail">
		<button type="button" class="btn-icon bg-initial text-3xl">&#x263A;</button>
	</svelte:fragment>
</AppBar>
<slot />

<style>
</style>
