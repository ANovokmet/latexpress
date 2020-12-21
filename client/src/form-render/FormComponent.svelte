<script>
    import { getContext } from "svelte";
    const renderMap = getContext('renderMap');

    export let key;
    export let schema;
    export let data;
    export let options;
</script>

{#if schema}
<svelte:component this={renderMap[schema._type]} {options} {key} {schema} bind:data={data} on:change></svelte:component>
{/if}

<style>
    
</style>