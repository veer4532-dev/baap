import {readFile} from 'node:fs/promises';
import path from 'node:path';
import {one} from '../../../lib/db.mjs';
import {currentUser} from '../../../lib/auth.mjs';
export const runtime='nodejs';
export async function GET(request,{params}){const {id}=await params;if(!/^[0-9a-f-]{36}$/.test(id))return new Response('File not found',{status:404});const m=one('SELECT m.*,a.status FROM media m JOIN articles a ON a.id=m.article_id WHERE m.id=?',id);if(!m)return new Response('File not found',{status:404});const u=await currentUser();if(m.status!=='published'&&!['admin','editor'].includes(u?.role))return new Response('File not found',{status:404});try{const bytes=await readFile(path.join(path.resolve(/*turbopackIgnore: true*/ process.env.DATA_DIR||'data'),'uploads',id+'.pdf'));return new Response(bytes,{headers:{'Content-Type':'application/pdf','Content-Disposition':`attachment; filename="academy-resource.pdf"; filename*=UTF-8''${encodeURIComponent(m.name).replace(/'/g,'%27')}`,'X-Content-Type-Options':'nosniff','Content-Security-Policy':"sandbox; default-src 'none'",'Cache-Control':'private, no-store'}})}catch{return new Response('File not found',{status:404})}}
