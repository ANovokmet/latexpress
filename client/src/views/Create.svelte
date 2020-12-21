<script>
    import { Navigate } from 'svelte-router-spa';
    import { navigateTo } from 'svelte-router-spa';
    import { templateId } from '../stores';

    const templates = [
        { 
            name: 'cv_5', 
            tags: 'Curriculum vitae',
            description: 'test', 
            previewImg: 'http://localhost:3000/static/template/cv_16/preview.png' 
        },
        { 
            name: 'cv_16', 
            tags: 'Curriculum vitae',
            description: 'test', 
            previewImg: 'http://localhost:3000/static/template/cv_16/preview.png' 
        },
        { 
            name: 'cv_16', 
            tags: 'Curriculum vitae',
            description: 'test', 
            previewImg: 'http://localhost:3000/static/template/cv_16/preview.png' 
        },
        { 
            name: 'cv_16', 
            tags: 'Curriculum vitae',
            description: 'test', 
            previewImg: 'http://localhost:3000/static/template/cv_16/preview.png' 
        },
        { 
            name: 'cv_16', 
            tags: 'Curriculum vitae',
            description: 'test', 
            previewImg: 'http://localhost:3000/static/template/cv_16/preview.png' 
        }
    ];

    function onUseTemplate(template) {
        $templateId = template.name;
        navigateTo('/');
    }

    export let currentRoute;
    $: {
        console.log({currentRoute});
    }
</script>

<div class="container">
    <h2 class="text-center py-2">Choose a template</h2>
    <div class="columns">
        {#each templates as template}
        <div class="column col-6 col-xs-12">
            <div class="card">
                <div class="card-image">
                  <img src="{template.previewImg}" class="img-responsive">
                </div>
                <div class="card-header">
                  <div class="card-title h5">{template.name}</div>
                  <div class="card-subtitle text-gray">{template.tags}</div>
                </div>
                <div class="card-body">
                    {template.description}
                </div>
                <div class="card-footer">
                  <button class="btn btn-primary" on:click={() => onUseTemplate(template)}>Use</button>
                </div>
            </div>
        </div>
        {/each}
    </div>
</div>

<style>
    .container {
        max-width: 800px;
        padding-bottom: 1.5rem;
    }

    .card {
        box-shadow: 0 0.25rem 1rem rgba(48,55,66,.15);
    }

    .column {
        padding: .4rem;
    }
</style>