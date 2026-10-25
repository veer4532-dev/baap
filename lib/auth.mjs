import {randomBytes,createHash} from 'node:crypto';
import {cookies,headers} from 'next/headers';
import {one,run} from './db.mjs';
export const hashToken=t=>createHash('sha256').update(t).digest('hex');
export {passwordHash,passwordMatches} from './auth-password.mjs';
export async function currentUser(){const token=(await cookies()).get('baa_session')?.value;if(!token)return null;return one('SELECT u.id,u.name,u.email,u.role FROM sessions s JOIN users u ON u.id=s.user_id WHERE s.token=? AND s.expires>? AND u.active=1',hashToken(token),Date.now())||null}
export async function needUser(roles){const u=await currentUser();if(!u)throw Error('Please sign in.');if(roles&&!roles.includes(u.role))throw Error('You do not have permission for this action.');return u}
export async function originCheck(){const h=await headers();const origin=h.get('origin');const configured=process.env.APP_ORIGIN||'http://localhost:3000';if(!origin||origin!==new URL(configured).origin)throw Error('Invalid request origin. Reload and try again.')}
export function limit(key,max=10,window=900000){const now=Date.now();run('DELETE FROM limits WHERE expires<?',now);run('INSERT INTO limits(key,count,expires) VALUES(?,1,?) ON CONFLICT(key) DO UPDATE SET count=count+1',hashToken(key),now+window);if(one('SELECT count FROM limits WHERE key=?',hashToken(key)).count>max)throw Error('Too many requests. Please try again later.')}
export async function session(uid){const token=randomBytes(32).toString('hex');run('DELETE FROM sessions WHERE expires<?',Date.now());run('INSERT INTO sessions(token,user_id,expires) VALUES(?,?,?)',hashToken(token),uid,Date.now()+12*3600000);(await cookies()).set('baa_session',token,{httpOnly:true,secure:new URL(process.env.APP_ORIGIN||'http://localhost:3000').protocol==='https:',sameSite:'lax',path:'/',maxAge:43200})}
