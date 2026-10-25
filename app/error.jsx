'use client';
export default function ErrorPage({reset}){return <main id="main" className="container section"><h1>We couldn’t load this page.</h1><p>Please try again. If the problem continues, contact the academy.</p><button onClick={reset}>Try again</button><a href="/">Back to home</a></main>}
