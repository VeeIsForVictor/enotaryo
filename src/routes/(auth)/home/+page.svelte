<script lang="ts">
	import UserCard from "$lib/components/UserCard.svelte";
	import { Button, Tabs, TabItem } from "flowbite-svelte";
	import type { LayoutData } from "../$types";
	import { CheckCircleOutline, CirclePlusOutline, ClockOutline } from "flowbite-svelte-icons";

    const { data }: { data: LayoutData } = $props();

    const { user } = data;
</script>


<div class="flex flex-col space-y-5 w-max mx-auto">
    <UserCard {user} />
    
    <Button class="bg-purple-800 hover:bg-purple-900" href="/document"><CirclePlusOutline class="mr-2 inline"/>Add new documents for notarization</Button>

    <Tabs tabStyle="full" defaultClass="flex rounded-lg divide-x rtl:divide-x-reverse divide-gray-200 shadow-sm dark:divide-gray-700 w-auto">
        <TabItem open>
            <div class="w-max px-10" slot="title"><ClockOutline class="mr-2 inline"/> Pending Documents</div>
        </TabItem>
        <TabItem>
            <div class="w-max px-10" slot="title"><CheckCircleOutline class="mr-2 inline"/> Completed Documents</div>
        </TabItem>
    </Tabs>
</div>