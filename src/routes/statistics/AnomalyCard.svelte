<script lang="ts">
    import { Card, CardContent, CardHeader, CardDescription, CardTitle } from "$lib/components/ui/card";
    import { Table, TableCell, TableRow, TableHead, TableHeader, TableBody, TableCaption } from "$lib/components/ui/table";
    import { fly } from "svelte/transition";
    import type { Anomaly } from "./dataLabels";

    export let anomaly: Anomaly;

    $: date = new Date(anomaly.timestamp).toLocaleDateString("en-US", {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
        hour: "numeric",
        minute: "numeric"
    });
</script>

{#key anomaly.id}
<div in:fly={{y: 50, delay: 300}} out:fly={{y: -50, duration: 300}}>
    <Card class="max-w-xl mx-auto my-5">
        <CardHeader>
            <CardTitle>Anomaly</CardTitle>
            <CardDescription>
                at {date}
            </CardDescription>
        </CardHeader>
        <CardContent>
            <Table>
                <TableCaption>The details of the recorded anomaly</TableCaption>
                <TableHeader>
                    <TableRow>
                        <TableHead>Name</TableHead>
                        <TableHead>Reading</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {#each Object.entries(anomaly) as [key, value] (key)}
                        {#if key !== 'currentLastUpdated' && typeof value !== 'object'}
                            <TableRow>
                                <TableCell>{key}</TableCell>
                                <TableCell>
                                    {#if key.includes('Index') || key.includes('id')}
                                        {value}
                                    {:else if key === 'timestamp'}
                                        {date}
                                    {:else if typeof value === 'number'}
                                        {value.toFixed(2)}
                                    {:else}
                                        {value}
                                    {/if}
                                </TableCell>
                            </TableRow>
                        {/if}
                    {/each}
                </TableBody>
            </Table>
        </CardContent>
    </Card>
</div>
{/key}
