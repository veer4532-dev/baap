import {PublicShell} from '../../components/public';
import {AuthForm} from '../../components/auth-form';
import {currentUser} from '../../lib/auth.mjs';
import {redirect} from 'next/navigation';
export const metadata={title:'Sign in',robots:{index:false,follow:false}};
export default async function Login(){const u=await currentUser();if(u)redirect(u.role==='student'?'/account':'/admin');return <PublicShell><section className="auth-card"><span className="eyebrow">WELCOME BACK</span><h1>A little more learning.</h1><p>Pick up where you left off.</p><AuthForm/><p>New here? <a href="/register">Create an account</a></p><small>For a password reset, contact the academy administrator.</small></section></PublicShell>}
