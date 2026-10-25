import {randomBytes,scryptSync,timingSafeEqual} from 'node:crypto';
export function passwordHash(p){if(typeof p!=='string'||p.length<12||p.length>128)throw Error('Password must be 12–128 characters.');const salt=randomBytes(16).toString('hex');return `${salt}:${scryptSync(p,salt,64).toString('hex')}`}
export function passwordMatches(p,h){if(typeof p!=='string'||p.length>128)return false;const [salt,hash]=(h||'').split(':');if(!salt||!hash)return false;const expected=Buffer.from(hash,'hex'),actual=scryptSync(p,salt,64);return expected.length===actual.length&&timingSafeEqual(expected,actual)}
