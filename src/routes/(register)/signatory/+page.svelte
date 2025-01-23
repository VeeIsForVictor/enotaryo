<form class="space-y-2" method="POST">
	<label class="block" for="uid"> UID: </label>
	<input name="uid" pattern="\d{4}-\d{4}-\d{4}-\d{4}" required />
	<label class="block" for="name"> Name: </label>
	<input name="name" type="text" required />
	<input class="block bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded" type="submit" />
</form>
