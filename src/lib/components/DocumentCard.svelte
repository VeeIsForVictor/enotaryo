<script lang="ts">
	import type { Document } from "$lib/models/document";
	import { object, pick } from "valibot";

    type DisplayDocument = {
        id: string;
        title: string;
        signatureCount: number;
        signatoryCount: number;
    }

    type DisplaySignature = {
        id: string;
        documentTitle: string;
        isVerified: boolean;
    }

    const { item }: { item: DisplayDocument | DisplaySignature } = $props();
</script>

<div class="flex flex-col">
    {#if "title" in item}
        <div class="flex flex-col border-slate-800 border-solid border-2 p-1">
            <p>Document with id {item.id} titled <strong>"{item.title}"</strong> has {item.signatureCount} signature(s) from {item.signatoryCount} signatory(ies).</p>
        </div>
    {:else}
        <div class="flex flex-col border-slate-800 border-solid border-2 p-1">
            <p>Signature with id {item.id} for <strong>"{item.documentTitle}"</strong>, verified: {item.isVerified}</p>
        </div>
        
    {/if}
</div>