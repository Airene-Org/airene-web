<script>
    import "../app.pcss";
    import { Button } from "$lib/components/ui/button/index";
    import { signIn, signOut } from "@auth/sveltekit/client"
    import { page } from "$app/stores"
    import { Avatar, AvatarFallback, AvatarImage } from "$lib/components/ui/avatar/index";
    import { ModeWatcher } from "mode-watcher";
    import { Sun, Moon } from "radix-icons-svelte";
    import { toggleMode } from "mode-watcher";
    import Toasts from "$lib/components/Toasts.svelte";
</script>

<div class="flex flex-col h-screen">
    <div class="flex justify-between m-2 gap-4">
        <nav class="flex items-center gap-2">
            <Button href="/">Home</Button>
            <Button href="/map">Map</Button>
            <Button href="/statistics">Statistics</Button>
            <Button href="/subscriptions">Subscriptions</Button>
        </nav>
        <div class="flex gap-2 items-center">
            {#if $page.data.session}
                <Avatar class="h-9 w-9">
                    <AvatarImage src={$page.data.session.user?.image}
                                 alt="Profile picture of {$page.data.session.user?.name}"></AvatarImage>
                    <AvatarFallback>{$page.data.session.user?.name?.split(" ").map(name => name[0]).join("")}</AvatarFallback>
                </Avatar>
                <strong>{$page.data.session.user?.name ?? "User"}</strong>
                <Button on:click={() => signOut({callbackUrl: '/'})} class="button">Sign out</Button>
            {:else}
                <span>You are not signed in</span>
                <Button on:click={() => signIn("keycloak")}>Sign in</Button>
            {/if}
            <Button on:click={toggleMode} variant="outline" size="icon">
                <Sun
                        class="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0"
                />
                <Moon
                        class="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100"
                />
                <span class="sr-only">Toggle theme</span>
            </Button>
        </div>
    </div>
    <main class="flex-1">
        <ModeWatcher />
        <slot />
        <Toasts />
    </main>
</div>
