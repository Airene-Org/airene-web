<script lang="ts">
    import { layers } from "./layers";
    import {CollapsibleContent, Collapsible, CollapsibleTrigger} from "$lib/components/ui/collapsible";
    import { CaretSort } from "radix-icons-svelte";

    export let activeLayer: string = '';

    const legends = layers.reduce<Record<string, [number, string][]>>((acc, layer) => {
        const paint = (layer.paint?.["circle-color"] as string[]).slice(3);
        const colorList: [number, string][] = [];
        for (let i = 0; i < paint.length; i += 2) {
            colorList.push([Number(paint[i]), paint[i + 1]]);
        }
        acc[layer.id] = colorList;
        return acc;
    }, {});
</script>

<div class="absolute right-2.5 top-16 bg-foreground text-background p-4 rounded-md flex flex-col gap-2">
    <Collapsible class="w-[110px]">
       <CollapsibleTrigger class="flex items-center w-full justify-between">
           <span class="italic">Legend</span>
           <CaretSort size={16} />
       </CollapsibleTrigger>
        <CollapsibleContent class="mt-4">
            {#if activeLayer === ''}
                <h3 class="font-bold underline underline-offset-2 mb-2">Air Quality</h3>
            {:else}
                {@const header = activeLayer.replace(/-/g, ' ')
                    .replace('points', '')
                    .split(' ')
                    .map(word => `${word.slice(0,1).toUpperCase()}${word.slice(1)}`)
                    .join(' ')}
                <h3 class="font-bold underline underline-offset-2 mb-2">{header}</h3>
            {/if}
            {#each legends[activeLayer || 'air-quality-points'] as [amount, color]}
                <div class="flex gap-4 items-center">
                    <span style:background-color={color} class="rounded-full h-4 w-4" />
                    {amount}
                </div>
            {/each}
        </CollapsibleContent>
    </Collapsible>
</div>