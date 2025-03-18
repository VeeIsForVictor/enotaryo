<script lang="ts">
	import type { User } from "$lib/server/db/schema";
	import { Avatar } from "flowbite-svelte";

    let { user }: { user: User } = $props();
</script>

<div class="p-5 bg-purple-200 rounded-3xl w-full text-gray-600">
    <p class="text-sm mb-4">You are logged in as:</p>
    <div class="flex flex-row items-center space-x-5">
        <Avatar src="/enotaryo-logo.png" size="lg" /> 
        <div class="flex flex-col prose prose-h2:mb-1">
            <h2>{user.signatoryId}</h2>
            <h5>User</h5>
        </div>
    </div>
</div>