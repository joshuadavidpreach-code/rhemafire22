"use client";

import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";
import { useState } from "react";
import { signIn } from "next-auth/react";

export default function RegisterPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [err, setErr] = useState<string | null>(null);
  const [ok, setOk] = useState<string | null>(null);

  return (
    <>
      <SiteHeader />
      <main>
        <section className="rf-section rf-section--bg rf-atmosphere">
          <div className="rf-grain" />
          <div className="rf-container" style={{maxWidth:760}}>
            <h1>Create Account</h1>
            <p>Free membership gives access to full lessons and the community portal.</p>
          </div>
        </section>

        <section className="rf-section rf-section--deep">
          <div className="rf-container" style={{maxWidth:760}}>
            <div className="rf-card rf-card--roomy">
              <div className="rf-card__title">Join Free</div>

              <form
                onSubmit={async (e) => {
                  e.preventDefault();
                  setErr(null);
                  setOk(null);

                  const res = await fetch("/api/register", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ name, email, password }),
                  });

                  const data = await res.json().catch(() => ({}));
                  if (!res.ok) {
                    setErr(data?.error || "Registration failed");
                    return;
                  }

                  setOk("Account created. Signing you in…");

                  await signIn("credentials", {
                    redirect: true,
                    callbackUrl: "/member",
                    email,
                    password,
                  });
                }}
              >
                <div className="rf-field">
                  <label className="rf-label">Name</label>
                  <input className="rf-input" value={name} onChange={(e) => setName(e.target.value)} />
                </div>

                <div className="rf-field">
                  <label className="rf-label">Email</label>
                  <input className="rf-input" value={email} onChange={(e) => setEmail(e.target.value)} type="email" required />
                </div>

                <div className="rf-field">
                  <label className="rf-label">Password</label>
                  <input className="rf-input" value={password} onChange={(e) => setPassword(e.target.value)} type="password" required />
                </div>

                {err ? <p style={{color:"rgba(255,120,120,0.9)"}}>{err}</p> : null}
                {ok ? <p style={{color:"rgba(180,220,255,0.9)"}}>{ok}</p> : null}

                <button className="rf-btn rf-btn--primary" type="submit">Create Account</button>
              </form>

              <p style={{marginTop:14, color:"var(--rf-text-dim)"}}>
                Already have an account? <a href="/login">Log in</a>
              </p>
            </div>
          </div>
        </section>
      </main>
      <SiteFooter />
    </>
  );
}
