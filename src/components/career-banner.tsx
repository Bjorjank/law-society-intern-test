/* eslint-disable @next/next/no-img-element */
import { TextArrow } from "@/components/text-arrow";
import { figmaAssets } from "@/lib/figma-assets";

export function CareerBanner() {
  return (
    <section id="career" className="career-section" aria-labelledby="career-title">
      <img className="career-background" src={figmaAssets.careerBackground} alt="" aria-hidden="true" />
      <div className="career-maroon" aria-hidden="true" />
      <div className="career-copy">
        <span className="career-icon" aria-hidden="true">▣</span>
        <div>
          <h2 id="career-title">Support for your career growth</h2>
          <p>A guidance on career and work related issues</p>
          <TextArrow href="https://lawsocietycareers.com.sg/">Find career</TextArrow>
        </div>
      </div>
      <div className="career-device" aria-hidden="true">
        <img className="career-person" src={figmaAssets.careerPerson} alt="" />
        <img className="career-phone" src={figmaAssets.careerPhone} alt="" />
        <span className="career-orbit orbit-one">⌂</span>
        <span className="career-orbit orbit-two">⚖</span>
        <span className="career-orbit orbit-three">§</span>
      </div>
    </section>
  );
}
