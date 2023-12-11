<script lang="ts">
import { Button } from "$lib/components/ui/button/index";
import { signIn, signOut } from "@auth/sveltekit/client"
import { page } from "$app/stores"
import { Avatar, AvatarFallback, AvatarImage } from "$lib/components/ui/avatar/index";
import type { ActionData } from "./$types"

export let form: ActionData;
</script>

<pre>
    {JSON.stringify($page.data, null, 2)}
</pre>

<p>
    {#if $page.data.session}
        <Avatar>
            <AvatarImage src={$page.data.session.user?.image} alt="Profile picture of {$page.data.session.user?.name}"></AvatarImage>
            <AvatarFallback>{$page.data.session.user?.name?.split(" ").map(name => name[0]).join("")}</AvatarFallback>
        </Avatar>
        <span class="signedInText">
      <small>Signed in as</small><br />
      <strong>{$page.data.session.user?.name ?? "User"}</strong>
    </span>
        <Button on:click={() => signOut()} class="button">Sign out</Button>
    {:else}
        <span class="notSignedInText">You are not signed in</span>
        <Button on:click={() => signIn("keycloak")}>Sign in via keycloak</Button>
    {/if}
</p>

<form method="POST">
    <Button type="submit">Hit backend</Button>
    {#if form?.success}
        <p>Success</p>
    {:else}
        <p>Womp womp</p>
    {/if}
</form>

