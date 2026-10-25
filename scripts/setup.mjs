import {createInterface} from 'node:readline/promises';
import {db,one,run} from '../lib/db.mjs';
import {passwordHash} from '../lib/auth-password.mjs';
import {readSecret} from './secret.mjs';
const cli=createInterface({input:process.stdin,output:process.stdout});
try{db();if(one("SELECT id FROM users WHERE role='admin'"))throw Error('An administrator exists. Setup will not overwrite it.');const name=(await cli.question('Administrator name: ')).trim(),email=(await cli.question('Administrator email: ')).trim().toLowerCase();if(!name||!/^\S+@\S+\.\S+$/.test(email))throw Error('Valid name and email required.');cli.close();const password=await readSecret('Choose a password (12–128 characters, hidden): ');run("INSERT INTO users(name,email,password,role) VALUES(?,?,?,'admin')",name,email,passwordHash(password));console.log('Administrator created. No sample content was installed.')}catch(e){console.error(e.message);process.exitCode=1}finally{cli.close()}
