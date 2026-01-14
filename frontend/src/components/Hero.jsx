
export default function Home() {
  return (
    <section
      className="py-24 px-6 text-center min-h-screen flex flex-col justify-center"
      style={{
        backgroundImage: `
          linear-gradient(
            to bottom,
            rgba(2,6,23,0.65),
            rgba(2,6,23,0.9)
          ),
          url('/Realisticbg.png')
        `,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
      }}
    >
      {/* CONTENT */}
      <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight text-white">
        <span className="bg-gradient-to-r from-blue-400 to-cyan-300 bg-clip-text text-transparent">
          Auto Vera
        </span>
        <br />
        Smart Vehicle Intelligence
      </h1>

      <p className="mt-6 text-lg text-gray-300 max-w-xl mx-auto">
        Verify any vehicle instantly using number or VIN.
      </p>
    </section>
  );
}

