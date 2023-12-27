<script lang="ts">
    import { page } from '$app/stores'
</script>

<h1 class="text-3xl text-muted-foreground">{$page.error?.message}</h1>
