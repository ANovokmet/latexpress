<script>
    import FormComponent from './FormComponent.svelte';

    export let key;
    /**
     *  Schema is like:
     *  {
     *      _type: 'array',
     *      _optional: 'false',
     *      #: {
     *          _type: 'object',
     *          _optional: 'false',
     *          field1: { ... },
     *          field2: { ... }
     *      }
     *  }
     */
    export let schema;
    /**
     * Data is an array of objects
     */
    export let data;

    function addRow() {
        if(!data) {
            data = [];
        }
        data = [...data, {}];
    }

    function removeRow(row) {
        data = data.filter(r => r !== row);
    }

    
</script>

<div class="form-array">
    <div class="form-array__header">
        <h3 class="form-label m-0">{schema._label}</h3>
        <button class="btn btn-icon" on:click={() => addRow()}>
            <i class="icon icon-plus"></i>
        </button>
    </div>
    {#if data}
    <div class="form-rows">
        {#each data as row, i}
            <div class="form-row card">
                <FormComponent options={{hideLabel: true}} key={'#'} schema={schema['#']} bind:data={row} on:change></FormComponent>
                <button class="btn btn-icon card-action" on:click={() => removeRow(row)}>
                    <i class="icon icon-minus"></i>
                </button>
            </div>
        {/each}
    </div>
    {/if}
</div>

<style>

    .btn-icon {
        background: transparent;
        border-color: transparent;
        color: #6f7782;
        height: 28px;
        min-height: 28px;
        min-width: 28px;
        width: 28px;
        border-radius: 6px;
        padding: 0;

        display: inline-flex;
        align-items: center;
        justify-content: center;
    }

    .btn-icon .icon {
        font-size: 0.6rem;
    }

    .btn-icon:hover {
        background: rgba(21,27,38,.04);
        border-color: transparent;
        color: #151b26;
    }

    .btn-icon:active {
        background: rgba(21,27,38,.08);
        border-color: transparent;
        color: #151b26;
    }


    .form-array {
        margin-bottom: 0.5rem;
    }
    
    .form-array__header {
        display: flex;
        justify-content: space-between;
        /* padding: 0.5rem 1rem; */
        
        /* padding: .3rem 0; h3 */
        margin-bottom: .5em;
        align-items: center;
    }

    .form-rows {
        /* padding: 0 0.5rem; */
    }

    .form-row {
        display: flex;
        padding: 0.5rem;
        margin-bottom: 0.5rem;
        position: relative;
    }

    .card {
        border: 1px solid #e8ecee;
        border-radius: 8px;
        box-shadow: 0 1px 4px 0 rgba(21,27,38,.08);
        position: relative;
    }

    .card-action {
        display: none;
        margin: 8px;
        position: absolute;
        right: 0;
        top: 0;
    }

    .card:hover .card-action {
        display: flex;
    }
</style>