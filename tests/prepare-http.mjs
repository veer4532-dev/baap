// Isolated QA fixture. Never run against a real academy database.
import {randomBytes,createHash} from 'node:crypto';
import {writeFileSync} from 'node:fs';
import path from 'node:path';
if(process.env.BAA_TEST_MODE!=='1'||!process.env.DATA_DIR?.includes('qa-'))throw Error('Use BAA_TEST_MODE=1 and an isolated qa- DATA_DIR.');
const {run,one}=await import('../lib/db.mjs');
const {passwordHash}=await import('../lib/auth-password.mjs');
const password=randomBytes(18).toString('base64url');let uid=one("SELECT id FROM users WHERE email='qa-admin@example.test'")?.id;if(!uid)uid=Number(run("INSERT INTO users(name,email,password,role) VALUES('QA administrator','qa-admin@example.test',?,'admin')",passwordHash(password)).lastInsertRowid);else run('UPDATE users SET password=? WHERE id=?',passwordHash(password),uid);
const student=Number(run("INSERT INTO users(name,email,password,role) VALUES('QA learner',?,?,'student')",'qa-'+Date.now()+'@example.test',passwordHash(password)).lastInsertRowid);
const editor=Number(run("INSERT INTO users(name,email,password,role) VALUES('QA editor',?,?,'editor')",'editor-'+Date.now()+'@example.test',passwordHash(password)).lastInsertRowid);
const fixture={password,uid,student,editor};for(const [role,id]of [['admin',uid],['student',student],['editor',editor]]){const token=randomBytes(32).toString('hex');run('INSERT INTO sessions(token,user_id,expires) VALUES(?,?,?)',createHash('sha256').update(token).digest('hex'),id,Date.now()+3600000);fixture[role+'Cookie']='baa_session='+token}writeFileSync(path.resolve(process.env.DATA_DIR,'qa-fixture.json'),JSON.stringify(fixture),{mode:0o600});console.log('Isolated QA fixture created. Credentials are stored only in the qa- data directory.');
