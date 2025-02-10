<script lang="ts">
	import { enhance } from '$app/forms';

    const { data } = $props();

    const { results } = data;
</script>

{#each results as {id, isVerified}}
    {@const txnId=id}
    <p>Transaction with id {id}, verified: {isVerified}</p>
    {#if !isVerified}
        <form class="flex flex-col space-y-2 my-4 max-w-md" method="post" use:enhance>
            <input type="text" name="id" id="id" readonly hidden value={txnId}>
            <label for="otp">One-time Password</label>
            <input type="text" name="otp" id="otp">
            <input class="block bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded" type="submit">
        </form>
    {/if}
{/each}