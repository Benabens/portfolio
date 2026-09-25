import Link from "next/link";

export default function NotFound() {
  return (
    <main className="section" style={{ minHeight: "100svh", display: "grid", alignContent: "center" }}>
      <p className="lbl">Not found</p>
      <h2 style={{ marginTop: "1rem" }}>Nothing on the books at this address.</h2>
      <p style={{ marginTop: "1.5rem" }}>
        <Link className="case-link" href="/">
          Back to the statement
        </Link>
      </p>
    </main>
  );
}
