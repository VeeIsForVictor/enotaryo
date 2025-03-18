<script lang="ts">
	import UserCard from "$lib/components/UserCard.svelte";
	import { Button } from "flowbite-svelte";
	import type { LayoutData } from "../$types";
	import { CirclePlusOutline } from "flowbite-svelte-icons";

    const { data }: { data: LayoutData } = $props();

    const { user } = data;
</script>


<div class="flex flex-col space-y-5">
    <UserCard {user} />
    
    <Button class="bg-purple-800 hover:bg-purple-900" href="/document"><CirclePlusOutline class="mr-2"/>Add new documents for notarization</Button>
</div>