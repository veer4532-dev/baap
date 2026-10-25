import './globals.css';
import {settings} from '../lib/db.mjs';
export const dynamic='force-dynamic';
export async function generateMetadata(){const s=settings();return {title:{default:s.siteName,template:`%s | ${s.siteName}`},description:s.heroDescription,robots:{index:true,follow:true}}}
export default function RootLayout({children}){const s=settings();return <html lang="en"><body style={{'--green':s.primaryColor}}><a className="skip" href="#main">Skip to content</a>{children}</body></html>}
