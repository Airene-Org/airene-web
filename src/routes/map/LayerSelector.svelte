<script lang="ts">
    import { Check, CaretSort } from "radix-icons-svelte";
    import * as Command from "$lib/components/ui/command";
    import * as Popover from "$lib/components/ui/popover";
    import { Button } from "$lib/components/ui/button";
    import { cn } from "$lib/utils";
    import { tick } from "svelte";
    import { type LayerId, layerIds } from "./layers";

    type $$Props = HTMLFormElement['$$props'];
    let className: $$Props["class"] = undefined;
    export {className as class};

    type Layer = LayerId | '';

    const layers = layerIds.map((layerId) => {
        const layer = layerId as Layer;
        return {
            value: layer,
            label: layer.slice(0, 1).toUpperCase() + layer.slice(1).replace(/-/g, ' ').replace(/points/g, '')
        }
    });

    let open = false;
    export let activeLayer = "";

    $: selectedValue =
        layers.find((f) => f.value === activeLayer)?.label ?? "Select layer...";

    // We want to refocus the trigger button when the user selects
    // an item from the list so users can continue navigating the
    // rest of the form with the keyboard.
    function closeAndFocusTrigger(triggerId: string) {
        open = false;
        tick().then(() => {
            document.getElementById(triggerId)?.focus();
        });
    }
</script>

<Popover.Root bind:open let:ids>
    <Popover.Trigger asChild let:builder>
        <Button
                builders={[builder]}
                variant="default"
                role="combobox"
                aria-expanded={open}
                class={cn(className, "sm:w-[240px] justify-between w-[296px] transition-all")}
        >
            {selectedValue}
            <CaretSort class="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
    </Popover.Trigger>
    <Popover.Content class="sm:w-[240px] p-0 w-[296px] transition-all">
        <Command.Root>
            <Command.Input placeholder="Search layer..." class="h-9" />
            <Command.Empty>No layer found.</Command.Empty>
            <Command.Group>
                {#each layers as layer}
                    <Command.Item value={layer.value}
                                  onSelect={(currentValue) => {
                                    activeLayer = currentValue;
                                    closeAndFocusTrigger(ids.trigger);
                    }}>
                        <Check class={cn( "mr-2 h-4 w-4", activeLayer !== layer.value && "text-transparent" )}/>
                        {layer.label}
                    </Command.Item>
                {/each}
            </Command.Group>
        </Command.Root>
    </Popover.Content>
</Popover.Root>