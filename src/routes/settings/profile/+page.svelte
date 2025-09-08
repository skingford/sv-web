<script lang="ts">
	import { Button, Toast } from 'flowbite-svelte';
	import { FireOutline } from 'flowbite-svelte-icons';
</script>

<h1>profile</h1>
<Button class="bg-blue-500!">Blue Button</Button>
<Button class="bg-green-500!">Green Button</Button>
<Toast color="rose">
	{#snippet icon()}
		<FireOutline class="h-6 w-6" />
	{/snippet}
	Dismissable user notification.
</Toast>
