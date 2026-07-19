import { TextArrow } from "@/components/text-arrow";

const rows = [
  { audience: "Lawyer", label: "Feedback on Law Reforms", href: "https://www.lawsociety.org.sg/what-we-do/" },
  { audience: "Public", label: "Alternative Dispute Resolution Schemes", href: "https://www.lawsociety.org.sg/alternative-dispute-resolution/", active: true },
  { audience: "Lawyer", label: "Members’ Support Schemes", href: "https://www.lawsociety.org.sg/support-schemes/" },
  { audience: "Lawyer", label: "Future Lawyering Research Portal", href: "https://www.lawsociety.org.sg/knowledge-management-hub/" },
];

export function LegalSupport() {
  return (
    <section id="legal-support" className="legal-section paper-section" aria-labelledby="legal-title">
      <div className="legal-heading">
        <p className="section-kicker">Legal Support</p>
        <h2 id="legal-title">Guiding you through every steps</h2>
      </div>
      <div className="legal-list">
        {rows.map((row) => (
          <a href={row.href} className={`legal-row${row.active ? " active" : ""}`} key={row.label}>
            <span className="legal-audience">{row.audience}</span>
            <span className="legal-label">{row.label}</span>
            {row.active && <span className="legal-arrow" aria-hidden="true">→</span>}
          </a>
        ))}
      </div>
      <TextArrow className="legal-more" href="https://www.lawsociety.org.sg/support-schemes/">Explore more support</TextArrow>
      <div className="torn-edge legal-torn" aria-hidden="true" />
    </section>
  );
}
