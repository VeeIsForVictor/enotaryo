<script lang="ts">
	import { enhance } from "$app/forms";
</script>

<form class="space-y-2 my-4" method="post" use:enhance>
	<label class="flex flex-col">
		Session UUID
		<input class="max-w-md" type="text" name="sessionId" />
	</label>
	<input
		type="submit"
		class="block bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
	/>
</form>
