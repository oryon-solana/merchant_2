import Image from "next/image";

export function HeroImage() {
  return (
    <section
      data-aos="fade-up"
      className="relative overflow-hidden border-b-2 border-[#f00] bg-[#dc2626] p-2"
    >
      <div className="h-52 border border-[#f00] bg-[#1f2937] md:h-72">
        <Image
          src="/images/food.jpg"
          alt="Sizzle restaurant interior with customers enjoying meals"
          fill
          className="object-cover object-[50%_75%]"
          loading="eager"
        />
      </div>
      <div className="absolute inset-0 bg-black/60"></div>
      <div className="bg-blue-600/20 inset-0 absolute flex justify-center items-center px-4 text-center">
        <p className="font-bold text-4xl uppercase text-[#fef3d8] md:text-9xl font-(family-name:--font-bebas)">
          Fresh, Flavorful, and Always Delicious!
        </p>
      </div>
    </section>
  );
}
