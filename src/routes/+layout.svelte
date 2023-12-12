<script>
    import "../app.pcss";
    import { Button } from "$lib/components/ui/button/index";
    import { signIn, signOut } from "@auth/sveltekit/client"
    import { page } from "$app/stores"
    import { Avatar, AvatarFallback, AvatarImage } from "$lib/components/ui/avatar/index";
</script>

<div class="flex flex-col h-screen">
    <div class="flex justify-between m-2 gap-4">
        <nav class="flex items-center gap-2">
            <Button href="/">Home</Button>
            <Button href="/map">Map</Button>
            <Button href="/statistics">Statistics</Button>
        </nav>
        <div class="flex gap-2 items-center">
            {#if $page.data.session}
                <span>Signed in as</span>
                <Avatar>
                    <AvatarImage src={$page.data.session.user?.image}
                                 alt="Profile picture of {$page.data.session.user?.name}"></AvatarImage>
                    <AvatarFallback>{$page.data.session.user?.name?.split(" ").map(name => name[0]).join("")}</AvatarFallback>
                </Avatar>
                <strong>{$page.data.session.user?.name ?? "User"}</strong>
                <Button on:click={() => signOut()} class="button">Sign out</Button>
            {:else}
                <span>You are not signed in</span>
                <Button on:click={() => signIn("keycloak")}>Sign in via keycloak</Button>
            {/if}
        </div>
    </div>
    <main class="flex-1">
        <slot />
    </main>
</div>
