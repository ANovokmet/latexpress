import Form from './form-render/Form.svelte';
import Document from './DocumentViewer.svelte';
import Edit from './views/Edit.svelte';

const routes = [
    {
      name: '/',
      component: Edit,
    },
    { name: 'login', component: Document }
  ]
  
  export { routes }