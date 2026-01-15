"use client";

import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";
import { signIn } from "next-auth/react";
import { useSearchParams } from "next/navigation";
import { useState } from "react";

export default function LoginPage() {
  const sp = useSearchParams();
  const next = sp.get("next") || "/admin";
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [err, setErr] = useState<string | null>(null);

  return (
    <>
      <SiteHeader />
      <main>
        <section className="rf-section rf-section--bg rf-atmosphere">
          <div className="rf-grain" />
          <div className="rf-container" style={{maxWidth:760}}>
            <h1>Login</h1>
            <p>Use your member account. Admin access requires ADMIN role.</p>
          </div>
        </section>

        <section className="rf-section rf-section--deep">
          <div className="rf-container" style={{maxWidth:760}}>
            <div className="rf-card rf-card--roomy">
              <div className="rf-card__title">Sign in</div>
              <form
                onSubmit={async (e) => {
                  e.preventDefault();
                  setErr(null);
                  const res = await signIn("credentials", {
                    redirect: true,
                    callbackUrl: next,
                    email,
                    password,
                  });
                  if ((res as any)?.error) setErr("Invalid credentials");
                }}
              >
                <div className="rf-field">
                  <label className="rf-label">Email</label>
                  <input className="rf-input" value={email} onChange={(e) => setEmail(e.target.value)} type="email" required />
                </div>
                <div className="rf-field">
                  <label className="rf-label">Password</label>
                  <input className="rf-input" value={password} onChange={(e) => setPassword(e.target.value)} type="password" required />
                </div>
                {err ? <p style={{color:"rgba(255,120,120,0.9)"}}>{err}</p> : null}
                <button className="rf-btn rf-btn--primary" type="submit">Sign In</button>
              </form>
              <p style={{marginTop:14, color:"var(--rf-text-dim)"}}>
                Seeded admin (after db seed): <strong>admin@rhemafire.local</strong> / <strong>ChangeMeNow!</strong>
              </p>
            </div>
          </div>
        </section>
      </main>
      <SiteFooter />
    </>
  );
}
