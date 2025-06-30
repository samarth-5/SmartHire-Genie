import Image from "next/image";
import React from "react";

import amazon    from "@/public/logos/amazon.svg";
import google    from "@/public/logos/google.svg";
import microsoft from "@/public/logos/microsoft.svg";
import netflix   from "@/public/logos/netflix.svg";
import apple     from "@/public/logos/apple.svg";
import meta      from "@/public/logos/meta.svg";
import goldman   from "@/public/logos/goldman.svg";

const logos = [meta, amazon, google, goldman, microsoft, netflix, apple];

export default function Companies() {
  return (
    <section className="w-full overflow-hidden bg-teal-400 py-24">
      {/* ── Elegant Heading ───────────────────────────── */}
      <div className="text-center text-teal-900 mb-14 px-4">
        <h2 className="text-3xl sm:text-4xl font-bold">
          Trusted by top tech giants
        </h2>
        <p className="mt-2 text-lg sm:text-xl font-light">
          We cover real interview questions asked at these companies
        </p>
      </div>

      {/* ── Marquee Strip ────────────────────────────── */}
      <div className="relative flex">
        <div className="flex animate-marquee whitespace-nowrap">
          {[...logos, ...logos].map((src, i) => (
            <Image
              key={i}
              src={src}
              alt="Company logo"
              /* Bigger on all screens, even bigger ≥ 640 px */
              className="mx-12 inline-block h-24 w-auto sm:h-[7.5rem]" /* 30 px taller */
              priority
            />
          ))}
        </div>
      </div>
    </section>
  );
}
