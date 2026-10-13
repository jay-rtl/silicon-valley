import {readdir,readFile,stat} from 'node:fs/promises';
import path from 'node:path';
const dist=path.resolve('dist');const base=(process.env.BASE_PATH||'/').replace(/\/$/,'');
async function walk(dir){const entries=await readdir(dir,{withFileTypes:true});return (await Promise.all(entries.map(e=>e.isDirectory()?walk(path.join(dir,e.name)):path.join(dir,e.name)))).flat();}
const files=await walk(dist);let checked=0;const errors=[];
for(const file of files.filter(f=>f.endsWith('.html'))){const html=await readFile(file,'utf8');for(const match of html.matchAll(/(?:href|src)="([^"]+)"/g)){const value=match[1];if(/^(?:https?:|mailto:|tel:|data:|#)/.test(value))continue;const clean=decodeURIComponent(value.split(/[?#]/)[0]);if(base&&!clean.startsWith(base+'/')){errors.push(`Outside base: ${value}`);continue;}let target=path.join(dist,clean.slice(base.length));try{if((await stat(target)).isDirectory())target=path.join(target,'index.html');await stat(target);checked++;}catch{errors.push(`${path.relative(dist,file)} -> ${value}`);}}if(!/<title>.+<\/title>/.test(html))errors.push(`Missing title: ${file}`);}
if(errors.length){console.error(errors.join('\n'));process.exit(1);}console.log(`PASS: ${files.filter(f=>f.endsWith('.html')).length} pages; ${checked} local links/assets; base ${base||'/'}.`);
