import { extract } from 'barhandles';
import { head, has, isEmpty, tail } from 'lodash-es';

export function extractSchema(template, opts) {
    const obj = {};
    function callback(path, optional) {
        function augment(obj, path, key) {
            let segment;
            // obj._optional = has(obj, '_optional') ? optional && obj._optional : optional;
            
            if(!isEmpty(key)) {
                obj._key = key;
                obj._label = toLabelCase(key);
            }
            
            if (!(isEmpty(path) || (path.length === 1 && path[0] === 'length'))) {
                obj._type = 'object';
                segment = head(path);
                if (segment === '#') {
                    obj._type = 'array';
                }
                obj[segment] = obj[segment] || {};
    
                return augment(obj[segment], tail(path), segment);
            } else if (!isEmpty(key) && key.includes('picture')) { 
                obj._type = 'upload';
                return obj;
            } else {
                obj._type = 'any';
                return obj;
            }
        };
        return augment(obj, path);
    };
    extract(template, callback, opts);
    delete obj._optional;
    return obj;
};


function capitalizeFirstLetter(value) {
    return value.charAt(0).toUpperCase() + value.slice(1);
}

function toLabelCase(value) {
    let result = '';
    let parts = value.split(/(?=[A-Z])/);
    for (let i = 0; i < parts.length; i++) {
        const p = parts[i];
        if (i === 0) {
            result += capitalizeFirstLetter(p);
        } else {
            result += p.toLowerCase();
        }
        if (i !== parts.length - 1) {
            result += ' ';
        }
    }

    return result;
}