<script lang="ts">
	import { AlertTitle, AlertDescription, Alert } from "$lib/components/ui/alert";
	import { AlertTriangle, Bell } from 'lucide-svelte';
	import { fly, slide } from 'svelte/transition';

	import { dismissToast, toasts } from "$lib/toastStore";
</script>

{#if $toasts}
	<section class='fixed bottom-0 right-0 max-w-md w-[20rem] flex m-4 justify-center flex-col z-50'>
		{#each $toasts as toast (toast.id)}

			<div in:fly={{x: 200}} out:slide>
				<Alert
					variant={toast.type}
					class='mt-2 bg-background'
					on:dismiss={() => dismissToast(toast.id)}>
					{#if toast.type === 'default'}
						<Bell size={40} class="h-full -translate-y-1/4" />
					{:else}
						<AlertTriangle size={40} class="h-full -translate-y-1/4" />
					{/if}
					<AlertTitle class="ml-4">{toast.title}</AlertTitle>
					<AlertDescription class="ml-4">{toast.message}</AlertDescription>
				</Alert>
			</div>
		{/each}
	</section>
{/if}
