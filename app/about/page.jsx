import {redirect} from 'next/navigation';
export default async function About({searchParams}){const p=await searchParams;redirect('/pages/'+(['privacy','terms'].includes(p.tab)?p.tab:'about'))}
