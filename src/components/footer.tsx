/* eslint-disable @next/next/no-img-element */
import { figmaAssets } from "@/lib/figma-assets";

const links = [
  { label: "FAQs", href: "https://www.lawsociety.org.sg/contact-us/" },
  { label: "Advertising Rates", href: "https://www.lawsociety.org.sg/advertise/" },
  { label: "Terms of Use", href: "https://www.lawsociety.org.sg/terms-conditions/" },
  { label: "Privacy Policy", href: "https://www.lawsociety.org.sg/privacy-policy/" },
];

export function Footer() {
  return (
    <footer id="footer" className="site-footer">
      <div className="footer-main">
        <img src={figmaAssets.logo} alt="The Law Society of Singapore" />
        <nav aria-label="Footer navigation">
          {links.map((link, index) => (
            <span key={link.label}>
              {index > 0 && <i aria-hidden="true">|</i>}
              <a href={link.href}>{link.label}</a>
            </span>
          ))}
        </nav>
      </div>
      <div className="footer-bottom">
        <p>© Copyright 2025 The Law Society of Singapore. All rights reserved</p>
        <p>Latest update 26 June 2025</p>
      </div>
    </footer>
  );
}
