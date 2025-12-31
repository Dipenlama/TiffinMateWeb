import Link from "next/link";

export default function HomePage() {
  return (
    <div className="relative min-h-screen flex items-center justify-center overflow-hidden bg-black px-4">

      {/* Main Card */}
      <div className="relative bg-white/10 backdrop-blur-md px-14 py-16 rounded-[2.5rem] shadow-2xl text-center w-full max-w-lg z-10">

        {/* Title */}
        <h1 className="text-5xl font-extrabold text-teal-400 mb-4 tracking-tight">
          Tiffin Mate
        </h1>

        {/* Subtitle */}
        <p className="text-gray-300 mb-12 leading-relaxed text-lg max-w-sm mx-auto">
          Trusted food provider for a healthier, happier space.
        </p>

        {/* Buttons */}
        <div className="justify-center">
          
          <Link href="/login" className="w-1/2">
            <button className="w-full h-14 rounded-full bg-linear-to-r from-teal-500 to-blue-500 text-white text-lg font-semibold hover:opacity-90 transition shadow-lg">
              Get Started
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
}
