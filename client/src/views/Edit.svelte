<script>
	import DocumentViewer from '../DocumentViewer.svelte';
	import Form from '../form-render/Form.svelte';
	import NavHeader from '../NavHeader.svelte';
	import Error from '../Error.svelte';
	import api from '../api';
    import { templateId, savedState } from '../stores';

	let pdfData = $savedState.pdfData;
	let formSchema;
	let formData = $savedState.formData;
	let selectedFormSchema;
	let selectedFormData = {};

	let toast;

	(async () => {
		if(!formData) {
			formData = await api.getExampleData($templateId);
		}

		formSchema = await api.getSchema($templateId);
		selectedFormSchema = formSchema;
		selectedFormData = formData;
	})();

	let loading;
	async function generatePdf(data) {
		console.log('generating...');
		loading = true;
		try {
			const response = await api.postGenerate($templateId, data);
			pdfData = { data: response };
			console.log({pdfData})
			$savedState.pdfData = pdfData;
		} catch(error) {
			if(!error.cancelled) {
				console.log(error.message);
				toast.add(error.message);
			}
		} finally {
			loading = false;
		}
	}

	import { debounce } from 'lodash-es';

	const generatePdfDebounced = debounce(generatePdf, 200);

	$: {
		if(formData) {
		//TODO:: on:change
			generatePdfDebounced(formData);
		}
	}

	function toSectionArray(schema) {
		const keys = [];
		const sections = [];
		for(const k in schema) {
			if(k !== '_type') {
				keys.push(schema[k]._label);
				sections.push(schema[k]);
			}
		}
		return sections;
	}

    let _sections = [];
    $: {
        if(formSchema) {
            _sections = toSectionArray(formSchema);
        }
	}
	
	let selectedKey;
	function onGoToSection(section) {
		const key = selectedKey = section._key;
		selectedFormData = formData[key];
		selectedFormSchema = section;
	}

	function onFormChange() {
		console.log('form change');
		if(selectedKey) {
			formData[selectedKey] = selectedFormData;
		} else {
			formData = formData;
		}

		$savedState.formData = formData;
	}

	async function resetData() {
		formData = await api.getExampleData($templateId);
		if(selectedKey) {
			selectedFormData = formData[selectedKey];
		} else {
			selectedFormData = formData;
		}
	}
</script>
<div class="app">
	<main class="container p-0">
		<div class="sidebar">
			<div class="sidebar__header">
				KaTex
			</div>
			<ul class="sidebar__body nav">
				{#each _sections as section}
				<li class="nav-item">
					<a href="#" on:click={() => onGoToSection(section)}>{section._label}</a>
				</li>
				{/each}
				<li class="divider"></li>
				<li class="nav-item">
					<a href="/create">Templates</a>
				</li>
				<li class="nav-item">
					<a href="#" on:click="{() => resetData()}">Reset</a>
				</li>
			</ul>
		</div>
		<div class="main">
			<NavHeader></NavHeader>
			<div class="main__body">
				<div class="main__body-form" style="flex: 0 1 40%">
					<Form bind:data={selectedFormData} schema={selectedFormSchema} on:change={onFormChange}></Form>
				</div>
				<div class="main__body-preview" style="flex: 0 1 60%">
					<DocumentViewer data={pdfData}></DocumentViewer>
				</div>
			</div>
		</div>
	</main>
	<Error bind:this={toast}></Error>
</div>

<style>
	.divider {
		border-top-color: rgba(102, 117, 140, 0.5);
	}

	.sidebar__header {
		padding: 8px 24px;
		height: 36px;
	}

	.nav-item {
		margin: 0;
	}

	.nav-item a {
		display: block;
		width: 100%;
	}

	.app {
		display: flex;
		height: 100%;
		flex-direction: column;
	}

	main {
		display: flex;
		overflow: auto;
		flex: 1;
	}

	.main {
    	display: flex;
		flex-direction: column;
		flex: 1;
		overflow: auto;
	}

	.main__body {
		display: flex;
		overflow: auto;
        height: 100%;
	}

	.main__body-form {
		padding: 1em;
		width: 800px;
	}

	.main__body-form, .main__body-preview {
		overflow: auto;
	}

	.sidebar {
		width: 240px;
		color: #cbd4db;
		background: #151B26;
	}
</style>