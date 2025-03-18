<script lang="ts">
	import UserCard from "$lib/components/UserCard.svelte";
	import type { LayoutData } from "../$types";

    const { data }: { data: LayoutData } = $props();

    const { user } = data;
</script>


<UserCard {user}>

</UserCard>