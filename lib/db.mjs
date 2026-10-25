import {DatabaseSync} from 'node:sqlite';
import {mkdirSync,chmodSync} from 'node:fs';
import path from 'node:path';
import {initialPages,initialCategories} from './site-seed.mjs';
import {defaults} from './model.mjs';
const globalKey=Symbol.for('baa.db');
export function db(){if(globalThis[globalKey])return globalThis[globalKey];const dir=path.resolve(/*turbopackIgnore: true*/ process.env.DATA_DIR||'data');mkdirSync(dir,{recursive:true,mode:0o700});const d=new DatabaseSync(path.join(dir,'academy.sqlite'));d.exec(`PRAGMA journal_mode=WAL; PRAGMA foreign_keys=ON; PRAGMA busy_timeout=5000;
CREATE TABLE IF NOT EXISTS site_content(id INTEGER PRIMARY KEY,kind TEXT NOT NULL,slug TEXT UNIQUE,title TEXT NOT NULL,description TEXT NOT NULL DEFAULT '',body TEXT NOT NULL DEFAULT '',href TEXT NOT NULL DEFAULT '',icon TEXT NOT NULL DEFAULT 'book',position INTEGER NOT NULL DEFAULT 0,status TEXT NOT NULL DEFAULT 'draft',updated TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP);
CREATE TABLE IF NOT EXISTS settings(key TEXT PRIMARY KEY,value TEXT NOT NULL);
CREATE TABLE IF NOT EXISTS users(id INTEGER PRIMARY KEY,name TEXT NOT NULL,email TEXT NOT NULL UNIQUE,password TEXT NOT NULL,role TEXT NOT NULL DEFAULT 'student' CHECK(role IN ('admin','editor','student')),active INTEGER NOT NULL DEFAULT 1,created TEXT DEFAULT CURRENT_TIMESTAMP);
CREATE TABLE IF NOT EXISTS sessions(token TEXT PRIMARY KEY,user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,expires INTEGER NOT NULL);
CREATE TABLE IF NOT EXISTS limits(key TEXT PRIMARY KEY,count INTEGER NOT NULL,expires INTEGER NOT NULL);
CREATE TABLE IF NOT EXISTS folders(id INTEGER PRIMARY KEY,parent_id INTEGER REFERENCES folders(id),name TEXT NOT NULL,kind TEXT NOT NULL DEFAULT 'subject',status TEXT NOT NULL DEFAULT 'draft',position INTEGER NOT NULL DEFAULT 0);
CREATE TABLE IF NOT EXISTS questions(id INTEGER PRIMARY KEY,hash TEXT UNIQUE,prompt TEXT NOT NULL,options TEXT NOT NULL,correct INTEGER NOT NULL,explanation TEXT NOT NULL DEFAULT '',status TEXT NOT NULL DEFAULT 'review',created TEXT DEFAULT CURRENT_TIMESTAMP);
CREATE TABLE IF NOT EXISTS mappings(folder_id INTEGER REFERENCES folders(id) ON DELETE CASCADE,question_id INTEGER REFERENCES questions(id) ON DELETE CASCADE,position INTEGER DEFAULT 0,PRIMARY KEY(folder_id,question_id));
CREATE TABLE IF NOT EXISTS articles(id INTEGER PRIMARY KEY,title TEXT NOT NULL,excerpt TEXT NOT NULL DEFAULT '',body TEXT NOT NULL,kind TEXT DEFAULT 'article',status TEXT DEFAULT 'draft',folder_id INTEGER REFERENCES folders(id),created TEXT DEFAULT CURRENT_TIMESTAMP);
CREATE TABLE IF NOT EXISTS attempts(id INTEGER PRIMARY KEY,user_id INTEGER NOT NULL REFERENCES users(id),folder_id INTEGER NOT NULL REFERENCES folders(id),snapshot TEXT NOT NULL,answers TEXT NOT NULL DEFAULT '{}',result TEXT,started INTEGER NOT NULL,deadline INTEGER NOT NULL,submitted INTEGER);
CREATE TABLE IF NOT EXISTS bookmarks(user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,article_id INTEGER REFERENCES articles(id) ON DELETE CASCADE,PRIMARY KEY(user_id,article_id));
CREATE TABLE IF NOT EXISTS imports(id INTEGER PRIMARY KEY,user_id INTEGER REFERENCES users(id),title TEXT NOT NULL,rows TEXT NOT NULL,state TEXT DEFAULT 'preview',result TEXT,created TEXT DEFAULT CURRENT_TIMESTAMP);
CREATE TABLE IF NOT EXISTS challenges(day TEXT PRIMARY KEY,folder_id INTEGER REFERENCES folders(id),question_count INTEGER NOT NULL);
CREATE TABLE IF NOT EXISTS patterns(id INTEGER PRIMARY KEY,name TEXT NOT NULL,minutes INTEGER NOT NULL,count INTEGER NOT NULL);
CREATE TABLE IF NOT EXISTS audit(id INTEGER PRIMARY KEY,user_id INTEGER REFERENCES users(id),action TEXT NOT NULL,detail TEXT NOT NULL,created TEXT DEFAULT CURRENT_TIMESTAMP);
CREATE TABLE IF NOT EXISTS media(id TEXT PRIMARY KEY,article_id INTEGER NOT NULL REFERENCES articles(id),name TEXT NOT NULL,mime TEXT NOT NULL);
CREATE INDEX IF NOT EXISTS sessions_expiry ON sessions(expires);
CREATE INDEX IF NOT EXISTS questions_status ON questions(status,id);
CREATE INDEX IF NOT EXISTS attempts_user ON attempts(user_id,id);
`);const ins=d.prepare('INSERT OR IGNORE INTO settings(key,value) VALUES(?,?)');for(const [k,v]of Object.entries(defaults))ins.run(k,v);if(!d.prepare("SELECT value FROM settings WHERE key='cmsInitialized'").get()){d.exec('BEGIN IMMEDIATE');try{if(!d.prepare("SELECT value FROM settings WHERE key='cmsInitialized'").get()){const add=d.prepare("INSERT INTO site_content(kind,slug,title,description,body,href,icon,position,status) VALUES(?,?,?,?,?,?,?,?,'published')");initialPages.forEach(([slug,title,body],i)=>add.run('page',slug,title,'',body,'','book',i));initialCategories.forEach(([title,description,href,icon],i)=>add.run('category',null,title,description,'',href,icon,i));d.prepare("INSERT INTO settings(key,value) VALUES('cmsInitialized','1')").run()}d.exec('COMMIT')}catch(e){d.exec('ROLLBACK');throw e}}try{chmodSync(path.join(dir,'academy.sqlite'),0o600)}catch{}globalThis[globalKey]=d;return d}
export function all(sql,...args){return db().prepare(sql).all(...args).map(row=>({...row}))}
export function one(sql,...args){const row=db().prepare(sql).get(...args);return row?{...row}:undefined}
export function run(sql,...args){return db().prepare(sql).run(...args)}
export function transaction(fn){db().exec('BEGIN IMMEDIATE');try{const r=fn();db().exec('COMMIT');return r}catch(e){db().exec('ROLLBACK');throw e}}
export function settings(){return {...defaults,...Object.fromEntries(all('SELECT key,value FROM settings').map(r=>[r.key,r.value]))}}
export function log(uid,action,detail=''){run('INSERT INTO audit(user_id,action,detail) VALUES(?,?,?)',uid,action,String(detail).slice(0,2000))}
