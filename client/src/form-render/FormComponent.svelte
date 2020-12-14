<script>
    import { getContext } from "svelte";
    const renderMap = getContext('renderMap');

    export let key;
    export let schema;
    export let data;
</script>

{#if schema}
<svelte:component this={renderMap[schema._type]} key={key} schema={schema} bind:data={data} on:change></svelte:component>
{/if}

<style>
    
</style>