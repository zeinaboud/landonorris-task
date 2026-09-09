"use client";

const GrayPerson = () => {
  return (
    <div className="pointer-events-none absolute inset-0 z-[5] flex items-end justify-center">
      <img
        src="/assets/hero/gray-person.jpg"
        alt="Lando Norris"
        className="h-[70vh] w-auto max-w-none object-contain object-bottom grayscale md:h-[92vh]"
      />
    </div>
  );
};

export default GrayPerson;
