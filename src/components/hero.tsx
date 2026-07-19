/* eslint-disable @next/next/no-img-element */
import { TextArrow } from "@/components/text-arrow";
import { figmaAssets } from "@/lib/figma-assets";

export function Hero() {
  return (
    <section id="affiliate" className="hero-section" aria-labelledby="hero-title">
      <img className="hero-city" src={figmaAssets.heroCity} alt="Singapore skyline" />
      <div className="hero-wash" />
      <img className="hero-maroon-shape" src={figmaAssets.heroMaroonShape} alt="" aria-hidden="true" />
      <img className="hero-justice" src={figmaAssets.ladyJustice} alt="Lady Justice statue" />

      <div className="hero-copy">
        <h1 id="hero-title">
          <span>Become an</span>
          <span><strong>Affiliate</strong> of the</span>
          <span>Law Society</span>
        </h1>
        <p>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Etiam eu turpis molestie, dictum est a,
          mattis tellus. Sed dignissim, metus nec fringilla accumsan, risus sem sollicitudin lacus.
        </p>
        <TextArrow href="https://www.lawsociety.org.sg/find-a-lawyer/">Find Lawyer</TextArrow>
      </div>

      <div className="torn-edge torn-edge-bottom" aria-hidden="true" />
    </section>
  );
}
