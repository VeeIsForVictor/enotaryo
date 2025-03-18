<script lang="ts">
	import { page } from '$app/state';
	import { BottomNav, BottomNavItem } from 'flowbite-svelte';
	import {
		HomeSolid,
		WalletSolid,
		AdjustmentsVerticalOutline,
		UserCircleSolid
	} from 'flowbite-svelte-icons';

	let { children } = $props();
	let activeUrl = $state(page.url.pathname);
</script>

<div>
	{@render children()}

	<BottomNav position="fixed" classInner="grid-cols-4" {activeUrl}>
		<BottomNavItem btnName="Home">
			<HomeSolid
				class="w-6 h-6 mb-1 text-gray-500 dark:text-gray-400 group-hover:text-primary-600 dark:group-hover:text-primary-500"
			/>
		</BottomNavItem>
		<BottomNavItem btnName="Wallet">
			<WalletSolid
				class="w-6 h-6 mb-1 text-gray-500 dark:text-gray-400 group-hover:text-primary-600 dark:group-hover:text-primary-500"
			/>
		</BottomNavItem>
		<BottomNavItem btnName="Settings">
			<AdjustmentsVerticalOutline
				class="w-6 h-6 mb-1 text-gray-500 dark:text-gray-400 group-hover:text-primary-600 dark:group-hover:text-primary-500"
			/>
		</BottomNavItem>
		<BottomNavItem btnName="Profile">
			<UserCircleSolid
				class="w-6 h-6 mb-1 text-gray-500 dark:text-gray-400 group-hover:text-primary-600 dark:group-hover:text-primary-500"
			/>
		</BottomNavItem>
	</BottomNav>
</div>
