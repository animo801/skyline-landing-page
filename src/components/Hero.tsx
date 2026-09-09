import Image from "next/image";
import Link from "next/link";
import heroHouse from "../../public/images/hero-house.jpg";

export default function Hero() {
  return (
    <section className="relative w-full md:flex md:min-h-screen md:flex-row">
      {/* Image */}
      <div className="relative h-[85vh] min-h-140 w-full md:h-auto md:min-h-screen md:w-1/2">
        <Image
          src={heroHouse}
          alt="A house at night showing off permanent Christmas lights installed along the roofline"
          fill
          priority
          sizes="(min-width: 768px) 50vw, 100vw"
          className="object-cover object-[center_12%] md:object-[center_25%]"
        />

        <Link href="/" className="absolute top-4 left-6 z-10 block w-35 sm:top-6 sm:left-8 sm:w-40">
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

      {/* Content panel: floating card over the image on mobile (so the image's
          top and bottom stay visible around it), full split panel beside the
          image on desktop. */}
      <div className="absolute inset-x-4 top-1/2 z-10 -translate-y-1/2 bg-skyline-blue px-6 py-8 shadow-2xl sm:inset-x-8 sm:px-8 sm:py-10 md:static md:inset-auto md:top-auto md:z-auto md:flex md:w-1/2 md:translate-y-0 md:flex-col md:justify-center md:px-16 md:py-12 md:shadow-none lg:px-20">
        <div className="mx-auto w-full max-w-md md:mx-0 md:max-w-4xl lg:max-w-6xl">
          <h1 className="text-[32px] leading-[1.15] font-black text-white sm:text-4xl md:text-5xl lg:text-[62px]">
            Get your{" "}
            <span className="bg-skyline-navy box-decoration-clone px-1">
              free quote
            </span>{" "}
            for permanent Christmas lights
          </h1>

          <p className="mt-6 text-lg leading-relaxed text-white/90 md:text-xl lg:text-[26px]">
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
