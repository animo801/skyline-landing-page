import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Privacy Policy | Skyline Smart Lighting",
  description:
    "How Skyline Smart Lighting collects, uses, and protects your personal information.",
};

export default function PrivacyPolicy() {
  return (
    <main className="mx-auto max-w-3xl px-6 py-16 sm:px-8 md:py-24">
      <Link
        href="/"
        className="text-sm font-medium text-skyline-blue hover:underline"
      >
        ← Back to home
      </Link>

      <h1 className="mt-6 text-3xl font-black text-black sm:text-4xl">
        Privacy Policy
      </h1>
      <p className="mt-2 text-sm text-black/50">Skyline Smart Lighting</p>

      <div className="mt-10 space-y-8 text-base leading-relaxed text-black/80">
        <p>
          This Privacy Policy is prepared by Skyline Smart Lighting and whose
          registered address is 6636 WT Harris BLVD Suite J Charlotte NC
          28215 (&ldquo;We&rdquo;) are committed to protecting and preserving
          the privacy of our visitors when visiting our site or
          communicating electronically with us.
        </p>

        <p>
          This policy sets out how we process any personal data we collect
          from you or that you provide to us through our website and social
          media sites. We confirm that we will keep your information secure
          and that we will comply fully with all applicable United States of
          America Data Protection legislation and regulations. Please read
          the following carefully to understand what happens to personal
          data that you choose to provide to us, or that we collect from you
          when you visit our sites. By submitting information you are
          accepting and consenting to the practices described in this
          policy.
        </p>

        <section>
          <h2 className="text-xl font-bold text-black">
            Types of information we may collect from you
          </h2>
          <p className="mt-3">
            We may collect, store and use the following kinds of personal
            information about individuals who visit and use our website and
            social media sites:
          </p>
          <p className="mt-3">
            <span className="font-semibold">
              Information you supply to us.
            </span>{" "}
            You may supply us with information about you by filling in forms
            on our website or social media. This includes information you
            provide when you submit a contact/enquiry form. The information
            you give us may include, but not limited to, your name, address,
            e-mail address and phone number.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-bold text-black">
            How we may use the information we collect
          </h2>
          <p className="mt-3">We use the information in the following ways:</p>
          <p className="mt-3">
            <span className="font-semibold">
              Information you supply to us.
            </span>{" "}
            We will use this information:
          </p>
          <ul className="mt-3 list-disc space-y-2 pl-6">
            <li>
              to provide you with information and/or services that you
              request from us;
            </li>
            <li>To contact you to provide the information requested.</li>
          </ul>
        </section>

        <section>
          <h2 className="text-xl font-bold text-black">
            Disclosure of your information
          </h2>
          <p className="mt-3">
            Any information you provide to us will either be emailed
            directly to us or may be stored on a secure server.
          </p>
          <p className="mt-3">
            We do not rent, sell or share personal information about you
            with other people or non-affiliated companies.
          </p>
          <p className="mt-3">
            We will use all reasonable efforts to ensure that your personal
            data is not disclosed to regional/national institutions and
            authorities, unless required by law or other regulations.
          </p>
          <p className="mt-3">
            Unfortunately, the transmission of information via the internet
            is not completely secure. Although we will do our best to
            protect your personal data, we cannot guarantee the security of
            your data transmitted to our site; any transmission is at your
            own risk. Once we have received your information, we will use
            strict procedures and security features to try to prevent
            unauthorised access.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-bold text-black">
            Your rights – access to your personal data
          </h2>
          <p className="mt-3">
            You have the right to ensure that your personal data is being
            processed lawfully (&ldquo;Subject Access Right&rdquo;). Your
            subject access right can be exercised in accordance with data
            protection laws and regulations. Any subject access request must
            be made in writing to 6636 E WT Harris BLVD Suite J Charlotte NC
            28215. We will provide your personal data to you within the
            statutory time frames. To enable us to trace any of your
            personal data that we may be holding, we may need to request
            further information from you. If you have a complaint about how
            we have used your information, you have the right to complain to
            the Information Commissioner&rsquo;s Office (ICO).
          </p>
        </section>

        <section>
          <h2 className="text-xl font-bold text-black">
            Changes to our privacy policy
          </h2>
          <p className="mt-3">
            Any changes we may make to our privacy policy in the future will
            be posted on this page and, where appropriate, notified to you
            by e-mail. Please check back frequently to see any updates or
            changes to our privacy policy.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-bold text-black">Contact</h2>
          <p className="mt-3">
            Questions, comments and requests regarding this privacy policy
            are welcomed and should be addressed to Shane Clark, 6636 E WT
            Harris BLVD Suite J Charlotte NC 28215.
          </p>
        </section>
      </div>
    </main>
  );
}
