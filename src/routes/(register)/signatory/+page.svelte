<script>
	import { validateIdNumber } from "$lib/models/signatory";

	const validationString = validateIdNumber.source;
</script>

<form class="space-y-2" method="POST">
	<label class="block" for="uid"> UID: </label>
	<input
		name="uid"
		pattern={validationString}
		required
		class="valid:text-green-500 invalid:text-gray-500"
	/>
	<label class="block" for="name"> Name: </label>
	<input name="name" type="text" required />
	<input
		class="block bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
		type="submit"
	/>
</form>
