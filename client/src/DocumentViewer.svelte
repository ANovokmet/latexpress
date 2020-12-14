<script context="module">
	import * as pdfjsLib from 'pdfjs-dist/build/pdf';
	pdfjsLib.GlobalWorkerOptions.workerSrc = 'build/pdf.worker.js';
</script>

<script>
	import { onMount } from 'svelte';

	export let data;
	let canvas;
	let mounted = false;

	onMount(async() => {
		mounted = true;
	});

	$: {
		if(data && mounted) {
			load(data);
		}
	}

	let pdfDocument = null;
	let pageNum = 1;
	let pageRendering = false;
	let pageNumPending = null;
	let _scale = 1;
	let ctx;
	let _currentPage;

	async function load(data) {
		window['pdfjsLib'] = pdfjsLib
		ctx = canvas.getContext('2d');
		const loadingTask = pdfjsLib.getDocument(data);
		window['pdfDocument'] = pdfDocument = await loadingTask.promise;
		renderPage(1);
	}

	async function renderTextLayer() {
        const textContent = await page.getTextContent();
		const layer =  pdfjsLib.renderTextLayer({
			textContent: textContent,
			container: textLayer,
			viewport: viewport
		});
		layer.render();
	}

	let currentPageParams;

	async function renderPage(num) {
		// Using promise to fetch the page
		const page = _currentPage = window.page = await pdfDocument.getPage(num);
		await render(page, _scale);
		if (pageNumPending !== null) {
			// New page rendering is pending
			renderPage(pageNumPending);
			pageNumPending = null;
		}
	}

	function queueRenderPage(num) {
		if (pageRendering) {
			pageNumPending = num;
		} else {
			renderPage(num);
		}
	}

	function onPrevPage() {
		if (pageNum <= 1) {
			return;
		}
		pageNum--;
		queueRenderPage(pageNum);
	}

	function onNextPage() {
		if (pageNum >= pdfDocument.numPages) {
			return;
		}
		pageNum++;
		queueRenderPage(pageNum);
	}

	function onIncreaseScale() {
		render(_currentPage, _scale + 0.1);
	}

	function onDecreaseScale() {
		render(_currentPage, _scale - 0.1);
	}

	async function onDownload() {
		const data = await pdfDocument.getData();
		var blobUrl = pdfjsLib.createObjectURL(data, 'application/pdf');
		_download(blobUrl, 'filename.pdf');
	}

	function _download(blobUrl, filename) {
		const a = document.createElement('a');
		a.href = blobUrl;
		a.target = '_parent';
		if ('download' in a) {
			a.download = filename;
		}
		document.body.appendChild(a);
		a.click();
		a.remove();
	}

	const scaleOptions = [
		{ label: 'Automatic Zoom', value: 'auto' }, // Resize
		{ label: 'Actual Size', value: 'page-actual' },
		{ label: 'Page Fit', value: 'page-fit' },
		{ label: 'Page Width', value: 'page-width' },
		{ label: '50%', value: '0.5' },
		{ label: '75%', value: '0.75' },
		{ label: '100%', value: '1' },
		{ label: '125%', value: '1.25' },
		{ label: '150%', value: '1.5' },
		{ label: '200%', value: '2' }
	];

	let textLayer;
	let container;

	const SCROLLBAR_PADDING = 0;
	const VERTICAL_PADDING = 32;
	const MAX_AUTO_SCALE = 5;
	function onSetScale(value) {
		let scale = parseFloat(value);

		if (scale > 0) {
			_setScale(scale, value);
		} else {
			const currentPage = currentPageParams;
			if (!currentPage) {
				return;
			}
			const noPadding = false;
			let hPadding = noPadding ? 0 : SCROLLBAR_PADDING;
			let vPadding = noPadding ? 0 : VERTICAL_PADDING;

			const pageWidthScale = ((container.clientWidth - hPadding) / currentPage.width) * currentPage.scale;
			const pageHeightScale = ((container.clientHeight - vPadding) / currentPage.height) * currentPage.scale;
			switch (value) {
				case "page-actual":
					scale = 1;
					break;
				case "page-width":
					scale = pageWidthScale;
					break;
				case "page-height":
					scale = pageHeightScale;
					break;
				case "page-fit":
					scale = Math.min(pageWidthScale, pageHeightScale);
					break;
				case "auto":
					const horizontalScale = pageWidthScale;
					scale = Math.min(MAX_AUTO_SCALE, horizontalScale);
					break;
				default:
					console.error(
						`${this._name}._setScale: "${value}" is an unknown zoom value.`
					);
				return;
			}
			_setScale(scale, value);
		}
	}

	async function render(page, scale) {
		pageRendering = true;
		console.log('rendering...', {page, scale});
		var viewport = page.getViewport({scale: scale * 1.25});
		canvas.height = viewport.height;
		canvas.width = viewport.width;
		canvas.style.height = Math.round(viewport.height * 0.8) + 'px'; 
		canvas.style.width = Math.round(viewport.width * 0.8) + 'px';
		var renderContext = {
			canvasContext: ctx,
			viewport: viewport
		};
		await page.render(renderContext).promise;
		pageRendering = false;
		console.log('...rendered');
		currentPageParams = {
			height: viewport.height * 0.8,
			width: viewport.width * 0.8,
			scale
		};
		_scale = scale;
	}

	function _setScale(scale, value) {
		console.log('_setScale', {scale})
		render(page, scale);
	}

	let selectedScale;
	$: {
		onSetScale(selectedScale);	
	}
</script>

<div class="document">
	<div class="document-controls">
		<div class="controls__page">
			<button class="btn btn-action btn-sm" on:click={onPrevPage}><i class="icon icon-back"></i></button>
			<span class="label label-primary controls__page_number">
				{pageNum}/{pdfDocument ? pdfDocument.numPages : '?'}
			</span>
			<button class="btn btn-action btn-sm" on:click={onNextPage}><i class="icon icon-forward"></i></button>
		</div>
		
		<div class="controls__scale">
			<button class="btn btn-action btn-sm" on:click={onIncreaseScale}><i class="icon icon-plus"></i></button>
			<button class="btn btn-action btn-sm" on:click={onDecreaseScale}><i class="icon icon-minus"></i></button>
			<div class="form-group">
				<select class="form-select select-sm" bind:value={selectedScale}>
					{#each scaleOptions as opt}
					<option value={opt.value}>{opt.label}</option>
					{/each}
				</select>
			</div>
		</div>
	
		<button class="btn btn-action btn-sm" on:click={onDownload}><i class="icon icon-download"></i></button>
	</div>
	<div class="document-preview" bind:this={container} style="padding: 16px 0;">
		{#if pageRendering}
		<!-- <div class="placeholder page"></div> -->
		{/if}
		<canvas class="canvas page" bind:this={canvas} 
			class:hidden={pageRendering} 
			class:width-auto={selectedScale==='auto'}>
		</canvas>
		<!-- <div id="text-layer" class="textLayer"  bind:this={textLayer}></div> -->
	</div>
</div>

<style>
	.document-controls {
		display: flex;
		justify-content: space-between;

		background-color: #fff;
		border-bottom: 1px solid #e8ecee;
		border-top: 1px solid #e8ecee;
		padding: 4px 24px;
	}

	.width-auto {
		max-width: 95% !important;
    	height: auto !important;
	}

	.document {
		display: flex;
		flex-direction: column;
		height: 100%;
	}

	.document-preview {
		flex: 1;
		overflow: auto;

		background-color: #f6f8f9;
	}

	.controls__page, .controls__scale {
		display: flex;
	}

	.controls__page_number {
		display: flex;
		align-items: center;
		justify-content: center;
		min-width: 1.4rem;
	}

	.pattern-carbon {
		background:
			linear-gradient(27deg, #151515 5px, transparent 5px) 0 5px,
			linear-gradient(207deg, #151515 5px, transparent 5px) 10px 0px,
			linear-gradient(27deg, #222 5px, transparent 5px) 0px 10px,
			linear-gradient(207deg, #222 5px, transparent 5px) 10px 5px,
			linear-gradient(90deg, #1b1b1b 10px, transparent 10px),
			linear-gradient(#1d1d1d 25%, #1a1a1a 25%, #1a1a1a 50%, transparent 50%, transparent 75%, #242424 75%, #242424);
		background-color: #131313;
		background-size: 20px 20px;
	}

	.document-preview {
		/* min-width: fit-content;
		display: flex;
		align-items: center;
		flex-direction: column; */
		position: relative;
	}

	.page {    
		/* border: 1px solid #333; */
		/* box-shadow: 0px 0.5em 2em 0px rgb(0 0 0 / 60%); */
    	box-shadow: 0 1px 4px 0 rgba(21,27,38,.08);
	}

	.page, .textLayer {
		/* margin: 4em; */
		margin: 0 auto;
    	display: block;
	}

	.placeholder {
		height: 1262px; 
		width: 892px;
		background: white;
	}

	.hidden {
		display: none;
	}

</style>