<script>
    import FormComponent from './FormComponent.svelte';

    export let key;
    export let schema;
    export let data;
    export let options = {};

    function getKeys(schema) {
        const _private = {
            '_type': true,
            '_optional': true
        }
        const _keys = Object.keys(schema).filter(key => !_private[key]);
        return _keys;
    }

    let keys;
    $: {
        if(schema) {
            keys = getKeys(schema);
        }
    }

    $: {
        if(data == null) {
            data = {};
        }
    }
</script>

    {#if schema && data}
        <div class="form-object">
            {#if !options.hideLabel}
            <h3 class="form-label">{schema._label || key}</h3>
            {/if}
            {#each keys as key}
            <FormComponent key={key} schema={schema[key]} bind:data={data[key]} on:change></FormComponent>
            {/each}
        </div>
    {/if}

<style>
    
</style>