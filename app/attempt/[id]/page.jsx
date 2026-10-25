import {redirect,notFound} from 'next/navigation';
import {PublicShell} from '../../../components/public';
import Attempt from '../../../components/attempt';
import {currentUser} from '../../../lib/auth.mjs';
import {one} from '../../../lib/db.mjs';
export const metadata={title:'Practice session',robots:{index:false,follow:false}};
export default async function AttemptPage({params}){const u=await currentUser();if(!u)redirect('/login');const {id}=await params,a=one('SELECT a.*,f.name FROM attempts a JOIN folders f ON f.id=a.folder_id WHERE a.id=? AND a.user_id=?',Number(id)||0,u.id);if(!a)notFound();return <PublicShell><Attempt attempt={{id:a.id,name:a.name,deadline:a.deadline,answers:JSON.parse(a.answers),result:a.result?JSON.parse(a.result):null}} questions={JSON.parse(a.snapshot).map(({id,prompt,options})=>({id,prompt,options}))}/></PublicShell>}
