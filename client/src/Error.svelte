<script>
	export function add(message) {
		errors = [...errors, { message }];
	}

	function remove(item) {
		errors = errors.filter(i => i !== item);
	}

	let errors = [];
</script>

<div class="error-container">
	<div class="error-center">
		{#each errors as item}
		<div class="error toast toast-error">
			<button class="btn btn-clear float-right" on:click={() => remove(item)}></button>
			{item.message}
		</div>
		{/each}
	</div>
</div>

<style>
	.error {
		margin-bottom: 0.5rem;
	}

	.error-center {
  		margin-left: auto; 
  		margin-right: auto;
		width: 280px;
	}

	.error-container {
		position: absolute;
		bottom: 0;
		width: 100%;
	}
</style>