<script lang="ts">
    import { Button } from "$lib/components/ui/button/index";
    import landingPage from "$lib/landingPage.gif";
</script>

<!--
// v0 by Vercel.
// https://v0.dev/t/mLt0oVDvFdt
-->
<main>
    <section class="w-full py-12 md:py-24 lg:py-32 xl:py-48 bg-cover bg-center shadow-[inset_0_0_8px_2px_black]" style="background-image:url({landingPage})">
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
                        <Button href="/map" class="animate-bounce mt-4">Check out the Map</Button>
                    </div>
                </div>
            </div>
        </div>
    </section>
    <section class="container px-4 md:px-6 py-6 md:py-8 lg:py-16 xl:py-24">
        <div class="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            <div class="flex flex-col space-y-4 bg-foreground shadow-lg p-6 rounded-lg">
                <h2 class="text-2xl font-bold text-background">Real-time tracking</h2>
                <p class="text-base text-muted-foreground">
                    Our platform provides real-time tracking of air quality, enabling you to adjust your daily activities accordingly.
                </p>
            </div>
            <div class="flex flex-col space-y-4 bg-foreground shadow-lg p-6 rounded-lg">
                <h2 class="text-2xl font-bold text-background">Outdoor workouts</h2>
                <p class="text-base text-muted-foreground">
                    Plan your outdoor workouts by knowing the air quality in advance.
                </p>
            </div>
            <div class="flex flex-col space-y-4 bg-foreground shadow-lg p-6 rounded-lg">
                <h2 class="text-2xl font-bold text-background">Respiratory health</h2>
                <p class="text-base text-muted-foreground">
                    Manage your respiratory health by avoiding areas with poor air quality.
                </p>
            </div>
            <div class="flex flex-col space-y-4 bg-foreground shadow-lg p-6 rounded-lg">
                <h2 class="text-2xl font-bold text-background">Optimal comfort</h2>
                <p class="text-base text-muted-foreground">
                    Ensure your comfort by staying informed about the air you breathe.
                </p>
            </div>
            <div class="flex flex-col space-y-4 bg-foreground shadow-lg p-6 rounded-lg">
                <h2 class="text-2xl font-bold text-background">Cutting-edge technology</h2>
                <p class="text-base text-muted-foreground">
                    We use the latest technology to provide accurate and timely information.
                </p>
            </div>
            <div class="flex flex-col space-y-4 bg-foreground shadow-lg p-6 rounded-lg">
                <h2 class="text-2xl font-bold text-background">Healthier living</h2>
                <p class="text-base text-muted-foreground">
                    Join us in our mission to promote healthier living by understanding the air we breathe.
                </p>
            </div>
        </div>
    </section>
</main>

