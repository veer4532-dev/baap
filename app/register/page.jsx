import {PublicShell} from '../../components/public';
import {AuthForm} from '../../components/auth-form';
import {settings} from '../../lib/db.mjs';
export const metadata={title:'Create an account',robots:{index:false,follow:false}};
export default function Register(){return <PublicShell><section className="auth-card"><span className="eyebrow">MAKE ROOM FOR LEARNING</span><h1>Your learning space.</h1>{settings().registrationOpen==='1'?<AuthForm signup/>:<p>Registration is currently closed. Contact the academy for assistance.</p>}<p>Already have an account? <a href="/login">Sign in</a></p></section></PublicShell>}
