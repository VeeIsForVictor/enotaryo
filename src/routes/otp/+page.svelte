<script lang="ts">
    const { data } = $props();

    const { results } = data;
</script>

{#each results as {id, isVerified}}
    <p>Transaction with id {id}, verified: {isVerified}</p>
{/each}