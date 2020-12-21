<script>
    import { setContext } from 'svelte';
    import FormComponent from './FormComponent.svelte';
    import FormInput from './FormInput.svelte';
    import FormList from './FormList.svelte';
    import FormObject from './FormObject.svelte';
    import FormFileUpload from './FormFileUpload.svelte';

    setContext('renderMap', {
        'object': FormObject,
        'array': FormList,
        'any': FormInput,
        'upload': FormFileUpload
    });

    let key = 'Data';
    export let schema;
    export let data = {};

    let keys = [];

    $: {
        console.log(data)
    }
</script>

<div>
    <FormComponent key={key} schema={schema} bind:data={data} on:change></FormComponent>
</div>

<style>
    
</style>