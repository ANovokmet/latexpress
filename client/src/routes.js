import Edit from './views/Edit.svelte';
import Create from './views/Create.svelte';

const routes = [
  { name: '/', component: Edit },
  { name: '/create', component: Create }
];

export { routes }