import Image from 'next/image';
import Link from 'next/link';

export default function AboutPage() {
  return (
    <section className="min-h-screen w-full bg-teal-100 px-4 sm:px-6 pt-22 pb-8">
      <div className="mx-auto max-w-3xl rounded-2xl border border-teal-800 bg-teal-200/80 p-7 sm:p-9 shadow-md">
        <div className="flex flex-col items-center">
          <Image
            src="/Samarth.jpg"
            alt="Samarth Narayan profile"
            width={180}
            height={180}
            priority
            className="mb-6 rounded-full outline outline-teal-900"
          />

          {/* ‑‑‑ Heading with mobile line‑break ‑‑‑ */}
          <h1 className="mb-6 text-center text-3xl sm:text-4xl font-extrabold text-teal-900">
            About
            <br className="sm:hidden" />  {/* line‑break only on mobile */}
            <Link
              href="https://smart-hire-genie.vercel.app/"
              className="underline decoration-teal-900 hover:text-teal-800"
            >
              Smart‑Hire Genie
            </Link>
          </h1>
        </div>

        <article className="space-y-4 text-[17px] sm:text-lg leading-relaxed text-teal-900">
          <p>
            <strong>Smart‑Hire Genie</strong> is an AI‑powered platform that helps job seekers
            prepare with personalised, interactive, and data‑driven tools—so you can focus on
            presenting your best self.
          </p>
          <p>
            <strong>Interview Generation</strong> offers mock interviews tailored to your chosen
            company, role, and preferences. It simulates realistic conversations, evaluates your
            responses, and provides detailed feedback with strengths and improvement areas.
          </p>
          <p>
            <strong>Resume Review</strong> uses ATS-based analysis to scan your resume for keyword
            alignment, formatting, and language use, returning actionable tips to help improve your
            job prospects.
          </p>
        </article>

        <div className="mt-5 overflow-x-auto">
          <div className="flex flex-nowrap justify-center gap-4">
            <IconLink
              href="https://github.com/samarth-5"
              label="GitHub"
              bg="bg-slate-800"
              svg={<GitHubSVG />}
            />
            <IconLink
              href="https://www.linkedin.com/in/samarth-narayan-4a4998250/"
              label="LinkedIn"
              bg="bg-[#0A66C2]"
              svg={<LinkedInSVG />}
            />
            <IconLink
              href="https://www.instagram.com/samarth123_/"
              label="Instagram"
              bg="bg-pink-600"
              svg={<InstagramSVG />}
            />
            <IconLink
              href="https://leetcode.com/u/samarth_123_/"
              label="LeetCode"
              bg="bg-orange-500"
              svg={<LeetCodeSVG />}
            />
            <IconLink
              href="https://samarth-dev.onrender.com"
              label="Portfolio"
              bg="bg-purple-600"
              svg={<GlobeSVG />}
            />
          </div>
        </div>
      </div>
    </section>
  );
}

function IconLink({
  href,
  label,
  svg,
  bg,
}: {
  href: string;
  label: string;
  svg: React.ReactNode;
  bg: string;
}) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={label}
      className={`flex h-10 w-10 items-center justify-center rounded-full ${bg} ring-2 ring-white shadow-md transition hover:-translate-y-1 hover:shadow-lg`}
    >
      <div className="h-5 w-5">{svg}</div>
    </a>
  );
}

const GitHubSVG = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" className="h-full w-full text-white">
    <path d="M12 .5C5.7.5.5 5.7.5 12.1c0 5.1 3.3 9.4 7.9 10.9.6.1.8-.3.8-.6v-2c-3.2.7-3.8-1.4-3.8-1.4-.5-1.1-1.2-1.3-1.2-1.3-1-.7.1-.7.1-.7 1.1.1 1.7 1.1 1.7 1.1 1 .1 1.4-.6 1.6-1 .1-.7.4-1.2.7-1.4-2.5-.3-5.2-1.3-5.2-5.9 0-1.3.5-2.3 1.2-3.1-.1-.3-.5-1.5.1-3.1 0 0 1-.3 3.3 1.2a11.4 11.4 0 0 1 6 0C17.6 5.5 18.6 5.8 18.6 5.8c.6 1.6.2 2.8.1 3.1.8.8 1.2 1.9 1.2 3.1 0 4.6-2.7 5.6-5.3 5.9.4.3.8 1 .8 2v3c0 .3.2.7.8.6a10.7 10.7 0 0 0 7.9-10.9C23.5 5.7 18.3.5 12 .5Z" />
  </svg>
);

const LinkedInSVG = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" className="h-full w-full text-white">
    <path d="M20.45 20.45h-3.55v-5.57c0-1.33-.47-2.24-1.66-2.24-.91 0-1.45.61-1.69 1.2-.09.22-.11.53-.11.84v5.77h-3.55V10.15h3.55v1.46c.47-.72 1.31-1.74 3.19-1.74 2.33 0 4.08 1.53 4.08 4.82v5.76ZM5.34 8.56a2.06 2.06 0 1 1 0-4.12 2.06 2.06 0 0 1 0 4.12ZM3.56 20.45h3.55V10.15H3.56v10.3Z" />
  </svg>
);

const InstagramSVG = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" className="h-full w-full text-white">
    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 1.366.062 2.633.334 3.608 1.31.975.975 1.246 2.242 1.309 3.608.058 1.266.07 1.645.07 4.849 0 3.205-.012 3.584-.07 4.85-.063 1.367-.334 2.633-1.309 3.608-.975.975-2.242 1.246-3.608 1.31-1.266.058-1.645.07-4.85.07s-3.584-.012-4.85-.07c-1.367-.063-2.633-.334-3.608-1.31-.975-.975-1.246-2.242-1.309-3.608C2.175 15.647 2.163 15.268 2.163 12c0-3.204.012-3.583.07-4.849.063-1.367.334-2.633 1.309-3.608.975-.975 2.242-1.246 3.608-1.31C8.416 2.175 8.796 2.163 12 2.163zm0 1.837c-3.123 0-3.49.012-4.718.07-1.007.046-1.55.215-1.91.359-.48.188-.823.414-1.186.776-.363.363-.588.706-.776 1.186-.144.36-.313.903-.359 1.91-.058 1.228-.07 1.595-.07 4.718s.012 3.49.07 4.718c.046 1.007.215 1.55.359 1.91.188.48.414.823.776 1.186.363.363.706.588 1.186.776.36.144.903.313 1.91.359 1.228.058 1.595.07 4.718.07s3.49-.012 4.718-.07c1.007-.046 1.55-.215 1.91-.359a3.59 3.59 0 001.186-.776 3.591 3.591 0 00.776-1.186c.144-.36.313-.903.359-1.91.058-1.228.07-1.595.07-4.718s-.012-3.49-.07-4.718c-.046-1.007-.215-1.55-.359-1.91a3.592 3.592 0 00-.776-1.186 3.593 3.593 0 00-1.186-.776c-.36-.144-.903-.313-1.91-.359-1.228-.058-1.595-.07-4.718-.07zm0 3.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zm0 10.162a3.999 3.999 0 110-7.998 3.999 3.999 0 010 7.998zm6.406-11.845a1.44 1.44 0 11-2.881 0 1.44 1.44 0 012.881 0z" />
  </svg>
);

const LeetCodeSVG = () => (
  <svg
    viewBox="0 0 24 24"
    className="h-full w-full stroke-white"
    fill="none"
    strokeWidth={2}
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M12 13h7.5" />
    <path d="M9.424 7.268l5-5" />
    <path d="M16.633 16.644l-2.402 2.415a3.19 3.19 0 0 1-4.524 0l-3.77-3.787a3.22 3.22 0 0 1 0-4.544l3.77-3.787a3.19 3.19 0 0 1 4.524 0l2.302 2.313" />
  </svg>
);

const GlobeSVG = () => (
  <svg
    viewBox="0 0 24 24"
    className="h-full w-full stroke-white"
    fill="none"
    strokeWidth={2}
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <circle cx="12" cy="12" r="10" />
    <path d="M2 12h20M12 2a15.3 15.3 0 0 1 0 20M12 2a15.3 15.3 0 0 0 0 20" />
  </svg>
);
