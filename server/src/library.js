import latex from 'node-latex';
import fs from 'fs';
import barhandlers from 'barhandles';
import Handlebars from 'handlebars';
import path, { dirname } from 'path';
import { fileURLToPath } from 'url';
import { sanitize as sanitizeLatex } from 'sanitize-latex';
import { extractSchema } from './generate-schema.js';

const __dirname = dirname(fileURLToPath(import.meta.url));

const LATEX_CMD = process.env.LATEX_CMD || 'C:/Program Files/MiKTeX/miktex/bin/x64/pdflatex.exe';
const LATEX_INPUTS = process.env.LATEX_INPUTS || ['../templates/cv_16'];

function resolvePaths(paths) {
    if(Array.isArray(paths)) {
        return paths.map(p => path.resolve(__dirname, p));
    }
    return path.resolve(__dirname, paths);
}


function latexToPdf(input, output, options) {
    const inputs = [...resolvePaths(LATEX_INPUTS)];
    const p = path.resolve(__dirname, '../upload', options.sessionID);
    if(options.sessionID) {
        inputs.push(p);
    }
    console.log('session id:', inputs, p)
    const outputStream = fs.createWriteStream(output);
    const pdf = latex(input, {
        cmd: LATEX_CMD,
        inputs
    });

    pdf.pipe(outputStream)
    pdf.on('error', err => console.error(err))
    pdf.on('finish', () => console.log('PDF generated!'))

    return pdf;
}

function sanitize(data) {
    for(const key in data) {
        const val = data[key];
        if(typeof val === 'string') {
            data[key] = sanitizeLatex(val);
        } else if(Array.isArray(val)) {
            val.forEach(d => sanitize(d))
        } else if (val != null && typeof val === 'object') {
            sanitize(val)
        }
    }
}

const cache = {};
function replaceDelimiters(str, source, escape) {
    var regex = cache[source] || (cache[source] = new RegExp(source, 'g'));
    var match;

    while ((match = regex.exec(str))) {
        var prefix = str.slice(0, match.index);
        var inner = (escape ? '\\' : '') + '{{' + match[1] + '}}';
        var suffix = str.slice(match.index + match[0].length);
        str = prefix + inner + suffix;
        regex.lastIndex = prefix.length + inner.length - 1;
    }
    return str;
}

function texbars2handlebars(template) {
    let escapedTex = String(template)
        .replace(/{/g, '<?')
        .replace(/}/g, '?>');

    const source = '<%=' + '([\\s\\S]+?)' + '%>'; // '{{([\\s\\S]+?)}}'
    escapedTex = replaceDelimiters(escapedTex, source, false);

    return escapedTex;
}

function handlebarOutput2Tex(template) {
    let unescapedTex = String(template)
        .replace(/<\?/g, '{')
        .replace(/\?>/g, '}');

    return unescapedTex;
}

export function getSchemaFromTexbars(texbarsTemplate) {
    let handlebars_input = texbars2handlebars(texbarsTemplate);
    const schema = extractSchema(handlebars_input); // barhandlers.
    return schema;
}

export function getPdfFromTexbars(texbarsTemplate, data, options = {}) {
    const handlebars_input = texbars2handlebars(texbarsTemplate);
    // sanitize data
    sanitize(data)
    const handlebars_output = Handlebars.compile(handlebars_input)(data);
    const tex_input = handlebarOutput2Tex(handlebars_output);
    return latexToPdf(tex_input, 'output.pdf', options);
}

export function getTexTemplate(handlebars_input, data) {
    const handlebars_output = Handlebars.compile(handlebars_input)(data);
    return handlebars_output;
}

export function generate(templateName, data) {
    // TODO
}