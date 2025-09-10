<script lang="ts">
	import { Button, Toast, Datepicker, P } from 'flowbite-svelte';
	import { FireOutline } from 'flowbite-svelte-icons';
	let selectedDate = $state<Date | undefined>(undefined);
</script>

<h1>profile</h1>
<div class="mb-64 md:w-1/2">
	<Datepicker locale="en-US" translationLocale="zh-CN" bind:value={selectedDate} />
	<P class="mt-4">Selected date: {selectedDate ? selectedDate.toLocaleDateString() : 'None'}</P>
</div>
<Button class="bg-blue-500!">Blue Button</Button>
<Button class="bg-green-500!">Green Button</Button>
<Toast color="rose">
	{#snippet icon()}
		<FireOutline class="h-6 w-6" />
	{/snippet}
	Dismissable user notification.
</Toast>
