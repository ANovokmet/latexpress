<script>
    import { createEventDispatcher } from "svelte";

    export let key;
    export let data;
    export let schema;

    const dispatch = createEventDispatcher();
</script>

<div class="form-group input-gray">
    <label class="form-label">{schema._label}</label>
    <!-- <input class="form-input" type="text" bind:value={data}> -->
    {#if schema._type === 'upload'}
    <input type="file" accept="image/png, image/jpeg" bind:files={data} on:change>
    <!--
        first pick image, then upload (auto?), then server responds with OK, filename, and then form is resubbed
    -->
    {:else}
    <textarea class="form-input" bind:value={data} on:change></textarea>
    {/if}
</div>

<style>
    .input-gray {
        padding: 0rem;
    }

    .input-gray .form-label {
        font-weight: 600;
        font-size: 0.6rem;
        padding: 0;
    }

    .input-gray .form-input {
        background: #f2f2f2;
        padding: 0px 0.75rem;
        border-color: transparent;
        font-weight: 600;
        color: #3a3a3a;
    }

    textarea.form-input {
        min-height: 1.4rem;
        resize: vertical;
    }


</style>