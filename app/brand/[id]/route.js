import {readFileSync} from 'node:fs';
import path from 'node:path';
import {settings} from '../../../lib/db.mjs';
export async function GET(_, {params}){const {id}=await params;if(!/^[0-9a-f-]{36}$/.test(id)||settings().logoId!==id)return new Response('Not found',{status:404});try{return new Response(readFileSync(path.resolve(/*turbopackIgnore: true*/ process.env.DATA_DIR||'data','uploads',id+'.webp')),{headers:{'Content-Type':'image/webp','X-Content-Type-Options':'nosniff','Cache-Control':'public, max-age=3600'}})}catch{return new Response('Not found',{status:404})}}
