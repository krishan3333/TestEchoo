// import { Bot, Cpu, Gamepad2, Rocket, Video, Shield, Sparkles, BrainCircuit } from "lucide-react";
// import Link from "next/link";
// import { MotionDiv } from "./MotionDiv"; // We'll create this small client component

// export default function Home() {

//   return (
//     <main className="relative min-h-screen overflow-hidden bg-[#02010A] text-white font-sans">
//       {/* Dynamic Gradient Background */}
//       <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,#1e1b4b,transparent_40%),radial-gradient(circle_at_80%_80%,#0ea5e9,transparent_40%)] blur-3xl opacity-70"></div>

//       {/* Floating Neon Particles - Converted to CSS animations for performance */}
//       <div className="absolute inset-0 overflow-hidden">
//         {[...Array(30)].map((_, i) => (
//           <span
//             key={i}
//             className="absolute bg-cyan-400/10 rounded-full animate-pulse"
//             style={{
//               top: `${Math.random() * 100}%`,
//               left: `${Math.random() * 100}%`,
//               width: `${Math.random() * 6 + 2}px`,
//               height: `${Math.random() * 6 + 2}px`,
//               animationDuration: `${Math.random() * 6 + 4}s`,
//               animationDelay: `${Math.random() * 2}s`,
//             }}
//           />
//         ))}
//       </div>

//       {/* HERO SECTION */}
//       <section className="relative z-10 flex flex-col items-center justify-center text-center pt-40 px-6 pb-28">
//         <MotionDiv
//           initial={{ opacity: 0, y: 30 }}
//           animate={{ opacity: 1, y: 0 }}
//           transition={{ duration: 1 }}
//         >
//           <h1 className="text-6xl md:text-8xl font-extrabold tracking-tight">
//             <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 drop-shadow-[0_0_25px_rgba(168,85,247,0.5)]">
//               ECCHO
//             </span>
//           </h1>
//         </MotionDiv>
        
//         <MotionDiv
//           initial={{ opacity: 0, y: 40 }}
//           animate={{ opacity: 1, y: 0 }}
//           transition={{ duration: 1.4 }}
//         >
//           <p className="mt-8 text-gray-300 text-lg max-w-2xl">
//             🚀 A <span className="text-blue-400 font-semibold">futuristic communication universe</span>  
//             powered by AI. Built by <span className="text-purple-400">Krishan</span> &{" "}
//             <span className="text-purple-400">Mayank </span> — the next-gen Network Engineering duo from DSEU.
//           </p>
//         </MotionDiv>

//         <MotionDiv
//           initial={{ opacity: 0, scale: 0.8 }}
//           animate={{ opacity: 1, scale: 1 }}
//           transition={{ duration: 1.6 }}
//           className="flex gap-5 mt-12"
//         >
//           <Link
//             href="/dashboard"
//             className="px-10 py-3 rounded-xl text-lg font-semibold bg-gradient-to-r from-blue-600 to-purple-700 hover:scale-105 transition-transform shadow-[0_0_20px_rgba(59,130,246,0.5)]"
//           >
//             Join the Revolution
//           </Link>
//           <button className="px-10 py-3 border border-slate-600 rounded-xl text-gray-300 hover:border-white hover:text-white transition">
//             Explore Demo
//           </button>
//         </MotionDiv>
//       </section>

//       {/* FEATURE GRID */}
//       <section className="relative z-10 px-8 pb-32 text-center">
//         <h2 className="text-4xl md:text-5xl font-bold mb-16 text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-500">
//           What Makes Eccho GOD-TIER
//         </h2>
//         <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-10">
//           {[
//             { icon: <Cpu size={40} />, title: "AI Brain Boost", desc: "Calls that feel alive — our AI senses tone, clarity & emotion." },
//             { icon: <Video size={40} />, title: "HoloCall Mode", desc: "Video calls reimagined — cinematic, immersive, and buttery-smooth." },
//             { icon: <BrainCircuit size={40} />, title: "Neural Chat", desc: "AI agent that jokes, moderates, and enhances your vibe in real-time." },
//             { icon: <Shield size={40} />, title: "Quantum Security", desc: "Next-level encryption by Network Engineering nerds from DSEU 🔒" },
//           ].map((f, i) => (
//             <MotionDiv
//               key={i}
//               whileHover={{ scale: 1.08, rotate: 1 }}
//               transition={{ type: "spring", stiffness: 200 }}
//               className="p-6 rounded-2xl bg-[#0f172a]/70 border border-slate-800 hover:border-blue-500 shadow-lg hover:shadow-blue-600/30 backdrop-blur-md"
//             >
//               <div className="text-blue-400 mb-4 flex justify-center">{f.icon}</div>
//               <h3 className="text-xl font-bold mb-2">{f.title}</h3>
//               <p className="text-gray-400 text-sm">{f.desc}</p>
//             </MotionDiv>
//           ))}
//         </div>
//       </section>

//       {/* Footer */}
//       <footer className="relative z-10 py-8 border-t border-slate-800 text-center text-gray-400 bg-[#040415]/70 backdrop-blur-md">
//         Made with by <span className="text-blue-400 font-semibold">Krishan</span> &{" "}
//         <span className="text-purple-400 font-semibold">Mayank</span> — DSEU Network Engineers.  
//         <br />
//         <span className="text-sm text-gray-500">© {new Date().getFullYear()} ECCHO • Better than Discord 😎</span>
//       </footer>
//     </main>
//   );
// }

// app/page.tsx
import { redirect } from 'next/navigation';

export default function Home() {
  // Redirects the user from the root path ("/") to the "/dashboard" path
  redirect('/dashboard');

  // You can return null or an empty fragment as this component won't render anything
  // return null;
}