<script lang="ts">
import { Button } from "$lib/components/ui/button/index";
import type { ActionData } from "./$types"
import { env } from "$env/dynamic/public";

export let form: ActionData;
</script>

<div class="m-2">
    <form method="POST">
        <Button type="submit">Hit backend</Button>
        {#if !form}
            <p>Go on, hit it</p>
        {:else if form.success}
            <p>Success</p>
        {:else}
            <p>Womp womp</p>
        {/if}
    </form>
</div>

