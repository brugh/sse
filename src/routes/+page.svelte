<script lang="ts">
	import { onMount } from 'svelte';
	import type { PageData } from './$types';
	import { Realtime, type Types } from 'ably';
	import { enhance } from '$app/forms';
  
  export let data: PageData;
  let { name, token } = data ?? {};

  interface Msg {
    name: string;
    msg: string;
  }
	let msg: string;
	let msgs: Msg[] = [];
	let gameId = '1234';
	let uName = '';
	let cForm: HTMLFormElement;
	const channelName = 'test123';
	let channel: Types.RealtimeChannelPromise | null = null;

	$: serviceStatus = channel ? 'Connected to Ably' : 'Offline';

	onMount(async () => {
		const ably = new Realtime.Promise({
			...token,
			authCallback: async (tokenParams, callback) => {}
		});
		await ably.connection.once('connected');

		channel = ably.channels.get(channelName);
		if (!channel) return;
		await channel.attach();
		await channel.presence.enter({ name });
		channel.subscribe(({ name, data }) => {
			if (name === 'msg') msgs = [...msgs, data];
			console.log(msgs);
		});
	});

	const submit = () => {
		if (uName.length > 3) cForm.submit();
	};

	const handleKey = async (event: KeyboardEvent) => {
		if (event.code !== 'Enter') return;
		await sendMsg();
	};

	const sendMsg = async () => {
		if (msg.length < 1) return;
		await channel?.publish('msg', { name: name, msg: msg });
		msg = '';
	};
</script>

<p>
	{#if channel}
		<form action="?/disconnect" method="POST">
			{serviceStatus} as {name}
			<button class="btn btn-sm variant-ghost" type="submit">Disconnect</button>
		</form>
	{:else}
		<form use:enhance action="?/connect" method="POST" bind:this={cForm}>
			<label for="name">Name</label>
			<input name="name" bind:value={uName} />
			<button class="btn btn-sm variant-ghost" on:click|preventDefault={submit}>Connect</button>
		</form>
	{/if}
</p>
<label for="gameId">Game ID</label>
<input name="gameId" disabled={!!channel} bind:value={gameId} /><br />
<input type="text" class="text-gray-900" name="msg" bind:value={msg} on:keypress={handleKey} />
<button class="btn btn-sm variant-ghost" on:click={sendMsg}>Send</button>
<br />
{#each msgs as m}
	<pre>{m.name}: {m.msg}</pre>
{/each}

<style lang="postcss">
	input {
		@apply text-gray-900;
	}
</style>
