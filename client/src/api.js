class PdfService {
    constructor(baseUrl) {
        this.baseUrl = baseUrl;
    }

    async getSchema(template) {
        const response = await fetch(`${this.baseUrl}/schema?t=${template}`);
        return response.json();
    }

    async getExampleData(template) {
        const response = await fetch(`${this.baseUrl}/example-data?t=${template}`);
        return response.json();
    }

    postGenerate = cancellable(async (template, data, signal) => {
        const response = await fetch(`${this.baseUrl}/generate?t=${template}`, {
            method: "POST",
            headers: {
                'Accept': 'application/pdf, application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data),
            signal
        });
        if(response.ok) {
            return response.arrayBuffer();
        } else {
            const error = await response.json();
            throw new Error(error.message);
        }
    });
}

function cancellable(fn) {
    let controller;
    return function(...args) {
        try {
            if(controller) {
                controller.abort();
            }
            controller = new AbortController();
            return fn(...args, controller.signal);
        } catch(error) {
            if (error.code !== 20) { 
                // abort occurred
            }
            console.log('caught', {error})
            throw error;
        }
    }
}

const BASE_URL = 'http://localhost:3000/api';

const service = new PdfService(BASE_URL);
export default service;