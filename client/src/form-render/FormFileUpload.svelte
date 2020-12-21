<script>
    import { createEventDispatcher } from "svelte";

    export let key;
    export let data;
    export let schema;

    const dispatch = createEventDispatcher();

    let files;
    let fileInput;
    async function upload(file) {
        const formData = new FormData();
        formData.append('image', file);
        const response = await fetch('http://localhost:3000/api/upload', {
            method: "POST", 
            body: formData,
            credentials: 'include'
        });
        if (response.ok) {
            const result = await response.json();
            data = result.fileName;
            dispatch('change', { data });
        } else {
            const text = await response.text();
        }
    }

    $: {
        if(files && files[0]) {
            upload(files[0]);
        }
    }
</script>

<div class="form-group input-gray">
    <label class="form-label">{schema._label}</label>
    <input type="file" class="form-input" accept="image/png, image/jpeg" bind:files={files}>
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

    .form-group-upload {
        display: flex;
    }
</style>