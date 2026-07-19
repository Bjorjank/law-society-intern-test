/* eslint-disable @next/next/no-img-element */
import { figmaAssets } from "@/lib/figma-assets";

const functions = [
  {
    number: "01",
    title: "Firm Closure Dates",
    image: figmaAssets.functionClosure,
    href: "https://www.lawsociety.org.sg/law-firm-closure-dates/",
  },
  {
    number: "02",
    title: "Pro Bono Services",
    image: figmaAssets.functionProBono,
    href: "https://www.probono.sg/",
    active: true,
  },
  {
    number: "03",
    title: "Members’ Library",
    image: figmaAssets.functionLibrary,
    href: "https://www.lawsociety.org.sg/members-library/",
  },
  {
    number: "04",
    title: "Specialists Directory",
    image: figmaAssets.functionDirectory,
    href: "https://www.lawsociety.org.sg/find-a-featured-specialist/",
  },
];

function CardArrow() {
  return <svg viewBox="0 0 45 18" aria-hidden="true"><path d="M1 9h39M33 2l7 7-7 7" /></svg>;
}

export function StatutoryFunctions() {
  return (
    <section id="functions" className="functions-section paper-section" aria-labelledby="functions-title">
      <div className="functions-intro">
        <span className="quote-mark">“</span>
        <div>
          <p className="section-kicker">What We Do</p>
          <h2 id="functions-title">We carry out various statutory functions</h2>
          <p className="section-copy">
            The mission of the Law Society is to serve its members and the public by sustaining an independent bar
            which upholds the rule of law and ensures access to justice. As part of its mission in ensuring access
            to justice for the needy, the Law Society has established Pro Bono SG...{" "}
            <a href="https://www.lawsociety.org.sg/what-we-do/">Read more</a>
          </p>
        </div>
      </div>

      <div className="function-grid">
        {functions.map((item) => (
          <article className={`function-card${item.active ? " active" : ""}`} key={item.number}>
            <img src={item.image} alt="" />
            <div className="function-card-overlay" />
            <div className="function-card-copy">
              <span>{item.number}</span>
              <h3>{item.title}</h3>
              {item.active && <p>Lorem ipsum dolor sit amet Lorem ipsum</p>}
            </div>
            <a href={item.href} className="function-card-footer" aria-label={`More detail about ${item.title}`}>
              <span>{item.active ? "More detail" : ""}</span>
              <CardArrow />
            </a>
          </article>
        ))}
      </div>
    </section>
  );
}
