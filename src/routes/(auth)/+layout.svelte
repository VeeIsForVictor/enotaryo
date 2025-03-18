<script lang="ts">
	import { page } from '$app/state';
	import { BottomNav, BottomNavItem } from 'flowbite-svelte';
	import {
		HomeSolid,
		ExclamationCircleOutline,
		ArchiveOutline,
		UserSettingsOutline
	} from 'flowbite-svelte-icons';

	let { children } = $props();
	let activeUrl = $state(page.url.pathname);
</script>

<div class="flex justify-between w-auto my-1 mx-1">
	<p><a href="/">ENotaryo</a></p>
	{#if user}
		<a href="/auth">You are logged in as: {user}</a>
	{:else}
		<a href="/auth">You are not currently logged in</a>
	{/if}
</div>

<div>
	{@render children()}

	<BottomNav position="fixed" classInner="grid-cols-4" {activeUrl}>
		<BottomNavItem btnName="Home">
			<HomeSolid
				class="w-6 h-6 mb-1 text-gray-500 dark:text-gray-400 group-hover:text-primary-600 dark:group-hover:text-primary-500"
			/>
		</BottomNavItem>
		<BottomNavItem btnName="Notarization">
			<ExclamationCircleOutline
				class="w-6 h-6 mb-1 text-gray-500 dark:text-gray-400 group-hover:text-primary-600 dark:group-hover:text-primary-500"
			/>
		</BottomNavItem>
		<BottomNavItem btnName="Documents">
			<ArchiveOutline
				class="w-6 h-6 mb-1 text-gray-500 dark:text-gray-400 group-hover:text-primary-600 dark:group-hover:text-primary-500"
			/>
		</BottomNavItem>
		<BottomNavItem btnName="Settings">
			<UserSettingsOutline
				class="w-6 h-6 mb-1 text-gray-500 dark:text-gray-400 group-hover:text-primary-600 dark:group-hover:text-primary-500"
			/>
		</BottomNavItem>
	</BottomNav>
</div>
