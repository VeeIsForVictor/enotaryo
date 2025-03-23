<script lang="ts">
	import { page } from '$app/state';
	import { BottomNav, BottomNavItem } from 'flowbite-svelte';
	import {
		HomeSolid,
		ExclamationCircleSolid,
		ArchiveSolid,
		UserSettingsSolid
	} from 'flowbite-svelte-icons';

	let { children } = $props();
	let activeUrl = $state(page.url.pathname);
</script>

<div class="my-auto">
	{@render children()}

	<BottomNav position="fixed" classInner="grid-cols-4" {activeUrl} activeClass="font-bold text-primary-600 dark:text-primary-500">
		<BottomNavItem btnName="Home" href="/home">
			<HomeSolid
				class="w-6 h-6 mb-1 text-gray-500 dark:text-gray-400 group-hover:text-primary-600 dark:group-hover:text-primary-500"
			/>
		</BottomNavItem>
		<BottomNavItem btnName="Notarization">
			<ExclamationCircleSolid
				class="w-6 h-6 mb-1 text-gray-500 dark:text-gray-400 group-hover:text-primary-600 dark:group-hover:text-primary-500"
			/>
		</BottomNavItem>
		<BottomNavItem btnName="Documents">
			<ArchiveSolid
				class="w-6 h-6 mb-1 text-gray-500 dark:text-gray-400 group-hover:text-primary-600 dark:group-hover:text-primary-500"
			/>
		</BottomNavItem>
		<BottomNavItem btnName="Settings">
			<UserSettingsSolid
				class="w-6 h-6 mb-1 text-gray-500 dark:text-gray-400 group-hover:text-primary-600 dark:group-hover:text-primary-500"
			/>
		</BottomNavItem>
	</BottomNav>
</div>
