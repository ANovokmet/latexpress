import { writable } from 'svelte/store';

export const templateId = writable(localStorage.getItem('templateId'));

templateId.subscribe(value => {
    localStorage.setItem('templateId', value);
});

export const savedState = writable(JSON.parse(localStorage.getItem('savedState')) || {
    lastSaved: new Date(),
    formData: {},
    dirty: false,
    pdfData: null
});

savedState.subscribe(value => {
    localStorage.setItem('savedState', JSON.stringify(value));
});