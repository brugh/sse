<script lang="ts">
	import { onMount } from 'svelte';
	import type { PageData } from './$types';
	import { Realtime, type Types } from 'ably';
	import { enhance } from '$app/forms';

	let msg = '';
	let msgs: string[] = [];
	let gameId = '1234';
	let uName = '';
	let cForm: HTMLFormElement;
	const channelName = 'test123';
	export let data: PageData;
	let { name, token } = data ?? {};
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
			if (name === 'msg') msgs = [...msgs, data.msg];
		});
	});

	const submit = () => {
		if (uName.length > 3) cForm.submit();
	};

	const handleKey = async (event: KeyboardEvent) => {
		console.log(event.code);
		if (event.code !== 'Enter') return;
		await sendMsg();
	};

	const sendMsg = async () => {
		if (msg.length < 1) return;
		await channel?.publish('msg', { msg: msg });
		msg = '';
	};
</script>

<p>
	{serviceStatus}
	{#if channel}
		<form action="?/disconnect" method="POST">
			<input type="submit" value="Disconnect" />
		</form>
	{:else}
		<form use:enhance action="?/connect" method="POST" bind:this={cForm}>
			<label for="name">Name</label>
			<input name="name" bind:value={uName} /><br />
			<button on:click|preventDefault={submit}>Connect</button>
		</form>
	{/if}
</p>
<label for="gameId">Game ID</label>
<input name="gameId" disabled={!!channel} bind:value={gameId} /><br />
<input name="msg" bind:value={msg} on:keypress={handleKey} /><button on:click={sendMsg}>Send</button
>
<br />
{#each msgs as msg}
	<pre>{msg}</pre>
{/each}
