import Image from "next/image";
import Link from "next/link";
import heroHouse from "../../public/images/hero-house.jpg";

export default function Hero() {
  return (
    <section className="relative flex flex-col md:min-h-screen md:flex-row">
      {/* Image */}
      <div className="relative h-[62vh] min-h-105 w-full md:h-auto md:min-h-screen md:w-1/2">
        <Image
          src={heroHouse}
          alt="A house at night showing off permanent Christmas lights installed along the roofline"
          fill
          priority
          sizes="(min-width: 768px) 50vw, 100vw"
          className="object-cover"
        />

        <Link href="/" className="absolute top-4 left-6 block w-35 sm:top-6 sm:left-8 sm:w-40">
          <Image
            src="/images/skyline-logo.svg"
            alt="Skyline Smart Lighting"
            width={178.53}
            height={47.64}
            className="h-auto w-full"
            priority
          />
        </Link>
      </div>

      {/* Content panel */}
      <div className="flex w-full flex-col justify-center bg-skyline-blue px-6 py-12 sm:px-8 md:w-1/2 md:px-16 md:py-12 lg:px-20">
        <div className="mx-auto w-full max-w-md md:mx-0">
          <h1 className="text-[32px] leading-[1.15] font-bold text-white sm:text-4xl md:text-5xl">
            Get your{" "}
            <span className="bg-skyline-navy box-decoration-clone px-1">
              free quote
            </span>{" "}
            for permanent Christmas lights
          </h1>

          <p className="mt-6 text-lg leading-relaxed text-white/90 md:text-xl">
            In around 10 minutes, our team will call you to discuss options
            and see if we&rsquo;re a good fit.
          </p>

          <a
            href="#quote"
            className="mt-8 inline-flex h-14 w-full items-center justify-center bg-skyline-navy px-8 text-lg font-bold text-white transition-colors hover:bg-skyline-navy/90 sm:w-auto"
          >
            Get your free quote
          </a>
        </div>
      </div>
    </section>
  );
}
