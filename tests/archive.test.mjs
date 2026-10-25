import test from 'node:test';
import assert from 'node:assert/strict';
import {zipSync,strToU8} from 'fflate';
import {importArchive} from '../lib/archive.mjs';
const csv='prompt,option_a,option_b,correct\nQuestion,A,B,A';
test('ZIP imports CSV from nested folders and ignores unrelated files',()=>{const rows=importArchive(zipSync({'subject/chapter.csv':strToU8(csv),'ignore.txt':strToU8('ignored')}));assert.equal(rows.length,1);assert.equal(rows[0].source,'subject/chapter.csv')});
test('ZIP rejects path traversal and no-CSV archives',()=>{assert.throws(()=>importArchive(zipSync({'../escape.csv':strToU8(csv)})));assert.throws(()=>importArchive(zipSync({'readme.txt':strToU8('empty')})))});
test('ZIP rejects too many CSV files',()=>{const files=Object.fromEntries(Array.from({length:101},(_,i)=>[i+'.csv',strToU8(csv)]));assert.throws(()=>importArchive(zipSync(files)))});
