/* eslint-disable @next/next/no-img-element */
import { figmaAssets } from "@/lib/figma-assets";

export function RoadTo2027() {
  return (
    <section id="road-to-2027" className="road-section paper-section" aria-labelledby="road-title">
      <div className="road-heading">
        <div>
          <p className="section-kicker">Road to 2027</p>
          <h2 id="road-title">Celebrating a Legacy,<br />Journeying to the Future</h2>
        </div>
        <div className="road-years" aria-label="Roadmap years">
          <strong>2025</strong><span>•</span><em>2026</em><span>•</span><em>2027</em>
        </div>
      </div>
      <div className="road-rule" />
      <div className="road-content">
        <img src={figmaAssets.road} alt="Legal professionals meeting around a desk" />
        <div>
          <h3>A new beginning - Laying the groundwork for our future</h3>
          <p>
            As we embark on our journey towards LawSoc’s 60th anniversary, 2025 marks the beginning of our refreshed
            digital presence. This year, we’re reimagining how we connect with members — through new digital tools,
            enhanced services, and stories from the legal community.
          </p>
        </div>
      </div>
    </section>
  );
}
