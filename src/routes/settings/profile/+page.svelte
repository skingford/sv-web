<script lang="ts">
	import { Button, Toast } from 'flowbite-svelte';
	import { FireOutline } from 'flowbite-svelte-icons';
</script>

<h1>profile</h1>
<Button class="bg-blue-500!">Blue Button</Button>
<Button class="bg-green-500!">Green Button</Button>
<Button>Default</Button>
<Button color="alternative">Alternative</Button>
<Button color="dark">Dark</Button>
<Button color="light">Light</Button>
<Button color="blue">Blue</Button>
<Button color="green">Green</Button>
<Button color="red">Red</Button>
<Button color="yellow">Yellow</Button>
<Button color="purple">Purple</Button>
<Toast color="rose">
	{#snippet icon()}
		<FireOutline class="h-6 w-6" />
	{/snippet}
	Dismissable user notification.
</Toast>
