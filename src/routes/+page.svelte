<script lang="ts">
    import { Button } from "$lib/components/ui/button/index";
    import landingPage from "$lib/landingPage.gif";

    const CONFIG = {
        proximity: 40,
        spread: 80,
        blur: 20,
        gap: 32,
        vertical: false,
        opacity: 0,
    }

    let CARDS: HTMLDivElement;

    const UPDATE = (event: MouseEvent) => {
        // get the angle based on the center point of the card and pointer position
        for (const CARD of CARDS.children) {
            // Check the card against the proximity and then start updating
            const CARD_BOUNDS = CARD.getBoundingClientRect()
            // Get distance between pointer and outerbounds of card
            if (
                event?.x > CARD_BOUNDS.left - CONFIG.proximity &&
                event?.x < CARD_BOUNDS.left + CARD_BOUNDS.width + CONFIG.proximity &&
                event?.y > CARD_BOUNDS.top - CONFIG.proximity &&
                event?.y < CARD_BOUNDS.top + CARD_BOUNDS.height + CONFIG.proximity) {
                // If within proximity set the active opacity
                (CARD as HTMLElement).style.setProperty('--active', '1')
            } else {
                (CARD as HTMLElement).style.setProperty('--active', `${CONFIG.opacity}`)
            }
            const CARD_CENTER = [
                CARD_BOUNDS.left + CARD_BOUNDS.width * 0.5,
                CARD_BOUNDS.top + CARD_BOUNDS.height * 0.5
            ]
            let ANGLE = Math.atan2(event?.y - CARD_CENTER[1], event?.x - CARD_CENTER[0]) * 180 / Math.PI
            ANGLE = ANGLE < 0 ? ANGLE + 360 : ANGLE;
            (CARD as HTMLElement).style.setProperty('--start', `${ANGLE + 90}`)
        }
    }
</script>

<svelte:body on:mousemove={UPDATE}/>

<!--
// v0 by Vercel.
// https://v0.dev/t/mLt0oVDvFdt
-->
<main>
    <section class="w-full py-12 md:py-24 lg:py-32 xl:py-48 bg-cover bg-center shadow-[inset_0_0_8px_2px_background]" style="background-image:url({landingPage})">
        <div class="container px-4 md:px-6">
            <div class="grid gap-6 lg:grid-cols-[1fr_400px] lg:gap-12 xl:grid-cols-[1fr_600px]">
                <div class="flex flex-col justify-center space-y-4 backdrop-blur p-4 rounded-2xl bg-black/60">
                    <div class="space-y-2">
                        <h1 class="text-3xl font-bold tracking-tighter sm:text-5xl xl:text-6xl/none bg-gradient-to-r from-yellow-500 to-yellow-100 bg-clip-text text-transparent">
                            Air Quality Tracker
                        </h1>
                        <p class="max-w-[600px] text-white md:text-xl">
                            Empowering you with real-time air quality data to make healthier decisions.
                        </p>
                    </div>
                    <ul class="list-disc list-inside space-y-2 text-base text-white">
                        <li>Real-time tracking of air quality</li>
                        <li>Helps in planning outdoor workouts</li>
                        <li>Manages respiratory health</li>
                        <li>Ensures optimal comfort</li>
                        <li>Uses cutting-edge technology</li>
                        <li>Promotes healthier living</li>
                    </ul>
                    <div>
                        <Button href="/map" class="animate-bounce mt-4 bg-white text-black">Check out the Map</Button>
                    </div>
                </div>
            </div>
        </div>
    </section>
    <section class="container px-4 md:px-6 py-6 md:py-8 lg:py-16 xl:py-24">
        <div bind:this={CARDS} class="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            <article class="flex flex-col space-y-4 shadow-lg p-6 rounded-lg relative border-secondary border-2">
                <div class="glow" />
                <h2 class="text-2xl font-bold">Real-time tracking</h2>
                <p class="text-base text-muted-foreground">
                    Our platform provides real-time tracking of air quality, enabling you to adjust your daily activities accordingly.
                </p>
            </article>
            <article class="flex flex-col space-y-4 shadow-lg p-6 rounded-lg relative border-secondary border-2">
                <div class="glow" />
                <h2 class="text-2xl font-bold">Outdoor workouts</h2>
                <p class="text-base text-muted-foreground">
                    Plan your outdoor workouts by knowing the air quality in advance.
                </p>
            </article>
            <article class="flex flex-col space-y-4 shadow-lg p-6 rounded-lg relative border-secondary border-2">
                <div class="glow" />
                <h2 class="text-2xl font-bold">Respiratory health</h2>
                <p class="text-base text-muted-foreground">
                    Manage your respiratory health by avoiding areas with poor air quality.
                </p>
            </article>
            <article class="flex flex-col space-y-4 shadow-lg p-6 rounded-lg relative border-secondary border-2">
                <div class="glow" />
                <h2 class="text-2xl font-bold">Optimal comfort</h2>
                <p class="text-base text-muted-foreground">
                    Ensure your comfort by staying informed about the air you breathe.
                </p>
            </article>
            <article class="flex flex-col space-y-4 shadow-lg p-6 rounded-lg relative border-secondary border-2">
                <div class="glow" />
                <h2 class="text-2xl font-bold">Cutting-edge technology</h2>
                <p class="text-base text-muted-foreground">
                    We use the latest technology to provide accurate and timely information.
                </p>
            </article>
            <article class="flex flex-col space-y-4 shadow-lg p-6 rounded-lg relative border-secondary border-2">
                <div class="glow" />
                <h2 class="text-2xl font-bold">Healthier living</h2>
                <p class="text-base text-muted-foreground">
                    Join us in our mission to promote healthier living by understanding the air we breathe.
                </p>
            </article>
        </div>
    </section>
</main>

<style>
    :root {
        --bg: hsl(246 44% 7%);
        --border: hsl(280 10% 50% / 1);
        --card: hsl(237 36% 10%);
        --color: hsl(240 18% 80%);
        --border-width: 2px;
        --border-radius: var(--radius);
        --gradient: conic-gradient(from 180deg at 50% 70%,hsla(0,0%,98%,1) 0deg,#eec32d 72.0000010728836deg,#ec4b4b 144.0000021457672deg,#709ab9 216.00000858306885deg,#4dffbf 288.0000042915344deg,hsla(0,0%,98%,1) 1turn);
        --spread: 60;
        --active: 0.15;
        --start: 0;
        --blur: 10;
    }
    .glow {
        pointer-events: none;
        position: absolute;
        inset: 0;
        filter: blur(calc(var(--blur) * 1px));
    }
    .glow::after,
    .glow::before {
        --alpha: 0;
        content: "";
        background: var(--gradient);
        background-attachment: fixed;
        position: absolute;
        inset: -5px;
        border: 10px solid transparent;
        border-radius: var(--border-radius);
        mask:
                linear-gradient(#0000, #0000),
                conic-gradient(from calc((var(--start) - (var(--spread) * 0.5)) * 1deg), #000 0deg, #fff, #0000 calc(var(--spread) * 1deg));
        mask-composite: intersect;
        mask-clip: padding-box, border-box;
        opacity: var(--active);
        transition: opacity 1s;
    }
    article::before {
        position: absolute;
        inset: 0;
        border: var(--border-width) solid transparent;
        content: "";
        pointer-events: none;
        background: var(--border);
        background-attachment: fixed;
        border-radius: var(--border-radius);
        mask:
                linear-gradient(#0000, #0000),
                conic-gradient(
                        from calc(((var(--start) + (var(--spread) * 0.25)) - (var(--spread) * 1.5)) * 1deg),
                        hsl(0 0% 100% / 0.15) 0deg,
                        white,
                        hsl(0 0% 100% / 0.15) calc(var(--spread) * 2.5deg));
        mask-clip: padding-box, border-box;
        mask-composite: intersect;
        opacity: var(--active);
        transition: opacity 1s;
    }
    article::after {
        --bg-size: 100%;
        content: "";
        pointer-events: none;
        position: absolute;
        background: var(--gradient);
        background-attachment: fixed;
        border-radius: var(--border-radius);
        opacity: var(--active, 0);
        transition: opacity 1s;
        --alpha: 0;
        inset: 0;
        border: var(--border-width) solid transparent;
        mask:
                linear-gradient(#0000, #0000),
                conic-gradient(from calc(((var(--start) + (var(--spread) * 0.25)) - (var(--spread) * 0.5)) * 1deg), #0000 0deg, #fff, #0000 calc(var(--spread) * 0.5deg));
        filter: brightness(1.5);
        mask-clip: padding-box, border-box;
        mask-composite: intersect;
    }
</style>