import { useState, useEffect, useRef } from "react";
import { motion, useInView, AnimatePresence } from "motion/react";
import { Menu, X, ArrowRight } from "lucide-react";
import { asset } from "../lib/millin-visual-library";
import VisualWorldBoard from "./VisualWorldBoard";

// Hash-based board route — append #visual-world to the URL to open the board
function useHashRoute() {
  const [hash, setHash] = useState(window.location.hash);
  useEffect(() => {
    const onHash = () => setHash(window.location.hash);
    window.addEventListener("hashchange", onHash);
    return () => window.removeEventListener("hashchange", onHash);
  }, []);
  return hash;
}

// ─── Types ────────────────────────────────────────────────────────────────────

interface PrologueFrame { slot: string; fragment: string; }
interface RoomData { title: string; sentence: string; slot: string; align: "left" | "right"; }
interface CraftData { n: string; title: string; statement: string; slot: string; material: string; process: string; }
interface HumanFrame { slot: string; label: string; chapter: string; }
interface CreationData { title: string; statement: string; slot: string; }
interface JournalStory { category: string; title: string; excerpt: string; slot: string; }

// ─── Data constants ───────────────────────────────────────────────────────────
// All visual references use MILLIN semantic slot names.
// To change an image: edit millin-visual-library.ts — never edit here.

const PROLOGUE_FRAMES: PrologueFrame[] = [
  { slot: "MILLIN_PROLOGUE_HAND_001",      fragment: "A hand."      },
  { slot: "MILLIN_PROLOGUE_TOOL_001",      fragment: "A tool."      },
  { slot: "MILLIN_PROLOGUE_MECHANISM_001", fragment: "A mechanism." },
  { slot: "MILLIN_PROLOGUE_GESTURE_001",   fragment: "A gesture."   },
  { slot: "MILLIN_PROLOGUE_MATERIAL_001",  fragment: "A material."  },
];

const NAV_PRIMARY = [
  { label: "THE HOUSE",  submenu: ["Entrance Hall", "Private Salon", "Library"] },
  { label: "ATELIER",    submenu: ["Métiers d'Art", "Grand Feu Enamel", "Hand Engraving", "Guilloché", "Miniature Painting"] },
  { label: "CREATIONS",  submenu: ["Collections", "Creation Stories"] },
  { label: "BESPOKE",    submenu: [] as string[] },
  { label: "COLLECTORS", submenu: ["Private Salon", "Private Presentation", "Lifetime Care"] },
  { label: "JOURNAL",    submenu: [] as string[] },
];

const NAV_SECONDARY = ["BOUTIQUES", "SERVICE", "CORRESPONDENCE"];

const ROOMS: RoomData[] = [
  { title: "ENTRANCE HALL", sentence: "The first impression of the House.", slot: "MILLIN_HOUSE_ENTRANCE_001",     align: "right" },
  { title: "PRIVATE SALON", sentence: "Where conversations begin.",         slot: "MILLIN_HOUSE_PRIVATE_SALON_001", align: "left"  },
  { title: "LIBRARY",       sentence: "Where knowledge becomes memory.",    slot: "MILLIN_HOUSE_LIBRARY_001",      align: "right" },
  { title: "ATELIER",       sentence: "Where ideas become creations.",      slot: "MILLIN_ATELIER_WORKBENCH_001",  align: "left"  },
];

const CRAFTS: CraftData[] = [
  { n: "I",   title: "GRAND FEU ENAMEL",    statement: "Beauty, preserved through fire.",     slot: "MILLIN_CRAFT_ENAMEL_FIRE_001",        material: "Enamel powder, fire, copper base",    process: "Fired at 800°C across multiple sessions"      },
  { n: "II",  title: "HAND ENGRAVING",      statement: "Guided by the human hand.",           slot: "MILLIN_CRAFT_ENGRAVING_001",          material: "Precious metal, steel burin",          process: "Each stroke irreversible, each line deliberate" },
  { n: "III", title: "GUILLOCHÉ",           statement: "Precision transformed into rhythm.",  slot: "MILLIN_CRAFT_GUILLOCHE_001",          material: "Rose engine, hand-guided tool",        process: "Geometric patterns cut into metal by hand"    },
  { n: "IV",  title: "MINIATURE PAINTING",  statement: "Where time becomes art.",             slot: "MILLIN_CRAFT_MINIATURE_PAINTING_001", material: "Mineral pigments, single hair brush",  process: "Painted under magnification over weeks"       },
];

const HUMAN_FRAMES: HumanFrame[] = [
  { slot: "MILLIN_HUMAN_SKETCH_001",           label: "Hand opens sketchbook.", chapter: "I"   },
  { slot: "MILLIN_HUMAN_MATERIAL_001",         label: "Hand touches material.", chapter: "II"  },
  { slot: "MILLIN_HUMAN_BURIN_001",            label: "Burin meets metal.",     chapter: "III" },
  { slot: "MILLIN_HUMAN_ENAMEL_BRUSH_001",     label: "Brush meets enamel.",    chapter: "IV"  },
  { slot: "MILLIN_HUMAN_ARTISAN_OBSERVES_001", label: "The artisan observes.",  chapter: "V"   },
  { slot: "MILLIN_HUMAN_COLLECTOR_MOMENT_001", label: "The collector understands.", chapter: "VI" },
];

const CREATIONS: CreationData[] = [
  { title: "YELLOW TIGER",   statement: "A study of strength and stillness.",     slot: "MILLIN_CREATION_YELLOW_TIGER_001"  },
  { title: "GRACEFUL CRANE", statement: "A reflection on time and transience.",   slot: "MILLIN_CREATION_GRACEFUL_CRANE_001" },
  { title: "GOLDEN PEACOCK", statement: "An expression of beauty and symbolism.", slot: "MILLIN_CREATION_GOLDEN_PEACOCK_001" },
  { title: "STARRY NIGHT",   statement: "A meditation on infinity.",              slot: "MILLIN_CREATION_STARRY_NIGHT_001"  },
  { title: "ROYAL WAVE",     statement: "A study of motion and balance.",         slot: "MILLIN_CREATION_ROYAL_WAVE_001"    },
];

const JOURNAL_STORIES: JournalStory[] = [
  { category: "GRAND FEU ENAMEL", title: "On the Art of Impossibility",        excerpt: "How seven firings at 800 degrees creates something the world has almost forgotten how to make.", slot: "MILLIN_JOURNAL_ENAMEL_FIRE_001" },
  { category: "THE ATELIER",      title: "A Year in the Life of an Engraver",  excerpt: "Three hundred and forty days. One creation.",                                                    slot: "MILLIN_JOURNAL_ENGRAVER_001"   },
  { category: "HOROLOGICAL ART",  title: "When the Machine Meets the Hand",    excerpt: "On the irreplaceable quality of human imprecision.",                                             slot: "MILLIN_JOURNAL_ATELIER_001"    },
];

// Bespoke journey defined inline — close to its component for clarity
const BESPOKE_JOURNEY = [
  { label: "CONVERSATION", slot: "MILLIN_BESPOKE_SALON_001"    },
  { label: "SKETCH",       slot: "MILLIN_BESPOKE_SKETCH_001"   },
  { label: "MATERIAL",     slot: "MILLIN_BESPOKE_MATERIAL_001" },
  { label: "CRAFT",        slot: "MILLIN_BESPOKE_CRAFT_001"    },
  { label: "CREATION",     slot: "MILLIN_BESPOKE_CREATION_001" },
];

const LIFETIME_CARE_STAGES = [
  { label: "Creation",     slot: "MILLIN_SERVICE_CREATION_001"     },
  { label: "Care",         slot: "MILLIN_SERVICE_CARE_001"         },
  { label: "Preservation", slot: "MILLIN_SERVICE_PRESERVATION_001" },
];

// ─── Primitive Components ─────────────────────────────────────────────────────

function Reveal({
  children,
  delay = 0,
  y = 20,
  className = "",
  duration = 1.4,
}: {
  children: React.ReactNode;
  delay?: number;
  y?: number;
  className?: string;
  duration?: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-5% 0px" });
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration, delay, ease: [0.16, 1, 0.3, 1] }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

function HouseLabel({ children, light = false }: { children: React.ReactNode; light?: boolean }) {
  return (
    <span className={`font-sans text-[10px] tracking-[0.28em] uppercase ${light ? "text-[#F4F1EA]/45" : "text-[#9A8968]"}`}>
      {children}
    </span>
  );
}

function CTAButton({ children, light = false }: { children: React.ReactNode; light?: boolean }) {
  return (
    <button
      className={`inline-flex items-center gap-4 group transition-colors duration-500 ${
        light ? "text-[#F4F1EA]/70 hover:text-[#F4F1EA]" : "text-[#161616]/60 hover:text-[#161616]"
      }`}
    >
      <span className="font-sans text-[10px] tracking-[0.22em] uppercase">{children}</span>
      <span className={`h-px transition-all duration-500 group-hover:w-10 w-5 ${light ? "bg-[#F4F1EA]/35" : "bg-[#9A8968]"}`} />
    </button>
  );
}

// ─── HouseNavigation ──────────────────────────────────────────────────────────

function HouseNavigation() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [activeMenu, setActiveMenu] = useState<string | null>(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > window.innerHeight * 0.85);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const navDark = !scrolled && !menuOpen;

  return (
    <>
      <motion.header
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1.8, delay: 2.2 }}
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-700 ${
          navDark ? "bg-transparent" : "bg-[#F4F1EA]/96 backdrop-blur-sm border-b border-[#161616]/8"
        }`}
      >
        <div className="flex items-center justify-between px-8 md:px-14 h-[66px]">
          <a
            href="#"
            className={`font-display text-[12px] tracking-[0.4em] uppercase transition-colors duration-700 ${
              navDark ? "text-[#F4F1EA]" : "text-[#161616]"
            }`}
          >
            MILLIN
          </a>

          <nav className="hidden lg:flex items-center gap-7">
            {NAV_PRIMARY.map((item) => (
              <div
                key={item.label}
                className="relative"
                onMouseEnter={() => setActiveMenu(item.label)}
                onMouseLeave={() => setActiveMenu(null)}
              >
                <a
                  href="#"
                  className={`font-sans text-[9.5px] tracking-[0.22em] uppercase transition-colors duration-500 ${
                    navDark ? "text-[#F4F1EA]/65 hover:text-[#F4F1EA]" : "text-[#161616]/55 hover:text-[#161616]"
                  }`}
                >
                  {item.label}
                </a>
                {item.submenu.length > 0 && (
                  <AnimatePresence>
                    {activeMenu === item.label && (
                      <motion.div
                        initial={{ opacity: 0, y: 6 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 6 }}
                        transition={{ duration: 0.18, ease: "easeOut" }}
                        className="absolute top-full left-0 pt-3"
                      >
                        <div className="bg-[#F4F1EA] border border-[#161616]/10 py-4 px-5 min-w-[200px]">
                          {item.submenu.map((sub) => (
                            <a
                              key={sub}
                              href="#"
                              className="block font-sans text-[9px] tracking-[0.18em] uppercase text-[#161616]/45 hover:text-[#161616] py-1.5 transition-colors duration-300"
                            >
                              {sub}
                            </a>
                          ))}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                )}
              </div>
            ))}
          </nav>

          <div className="flex items-center gap-6">
            <div className="hidden lg:flex items-center gap-5">
              {NAV_SECONDARY.slice(0, 2).map((item) => (
                <a
                  key={item}
                  href="#"
                  className={`font-sans text-[8.5px] tracking-[0.22em] uppercase transition-colors duration-500 ${
                    navDark ? "text-[#F4F1EA]/35 hover:text-[#F4F1EA]/60" : "text-[#161616]/35 hover:text-[#161616]/60"
                  }`}
                >
                  {item}
                </a>
              ))}
            </div>
            <button
              className={`lg:hidden transition-colors duration-500 ${navDark ? "text-[#F4F1EA]" : "text-[#161616]"}`}
              onClick={() => setMenuOpen(!menuOpen)}
            >
              {menuOpen ? <X size={18} /> : <Menu size={18} />}
            </button>
          </div>
        </div>
      </motion.header>

      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.35 }}
            className="fixed inset-0 z-40 bg-[#161616] flex flex-col justify-center px-10"
          >
            <div className="flex flex-col gap-6">
              {NAV_PRIMARY.map((item, i) => (
                <motion.a
                  key={item.label}
                  href="#"
                  initial={{ opacity: 0, x: -14 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.4, delay: i * 0.055 }}
                  className="font-display text-[30px] text-[#F4F1EA]/75 hover:text-[#F4F1EA] transition-colors"
                  onClick={() => setMenuOpen(false)}
                >
                  {item.label}
                </motion.a>
              ))}
            </div>
            <div className="mt-14 flex flex-col gap-3">
              {NAV_SECONDARY.map((item) => (
                <a
                  key={item}
                  href="#"
                  className="font-sans text-[10px] tracking-[0.22em] uppercase text-[#F4F1EA]/28 hover:text-[#F4F1EA]/55 transition-colors"
                >
                  {item}
                </a>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

// ─── HousePrologue ────────────────────────────────────────────────────────────

function HousePrologue() {
  const [activeFrame, setActiveFrame] = useState(0);
  const [titleVisible, setTitleVisible] = useState(false);
  const [fragmentVisible, setFragmentVisible] = useState(false);

  useEffect(() => {
    const t1 = setTimeout(() => setFragmentVisible(true), 700);
    const t2 = setTimeout(() => setTitleVisible(true), 2600);
    const iv = setInterval(() => {
      setFragmentVisible(false);
      setTimeout(() => {
        setActiveFrame((i) => (i + 1) % PROLOGUE_FRAMES.length);
        setFragmentVisible(true);
      }, 700);
    }, 4000);
    return () => { clearTimeout(t1); clearTimeout(t2); clearInterval(iv); };
  }, []);

  return (
    <section className="relative h-screen w-full overflow-hidden bg-[#0A0A08]">
      {PROLOGUE_FRAMES.map((frame, i) => (
        <motion.div
          key={i}
          className="absolute inset-0"
          animate={{ opacity: activeFrame === i ? 1 : 0 }}
          transition={{ duration: 2, ease: "easeInOut" }}
        >
          <img
            src={asset(frame.slot, 1920, 1080)}
            alt={frame.slot}
            className="w-full h-full object-cover"
            style={{ filter: "brightness(0.36) contrast(1.08)" }}
          />
        </motion.div>
      ))}

      <div className="absolute inset-0 bg-gradient-to-b from-[#0A0A08]/55 via-transparent to-[#0A0A08]/72 pointer-events-none" />
      <div className="absolute inset-0 bg-gradient-to-r from-[#0A0A08]/18 via-transparent to-[#0A0A08]/18 pointer-events-none" />

      <div className="absolute bottom-[24%] left-0 right-0 flex justify-center pointer-events-none">
        <motion.p
          animate={{ opacity: fragmentVisible ? 1 : 0 }}
          transition={{ duration: 0.9, ease: "easeInOut" }}
          className="font-body italic text-[#F4F1EA]/20 text-[13px] tracking-wide"
        >
          {PROLOGUE_FRAMES[activeFrame].fragment}
        </motion.p>
      </div>

      <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: titleVisible ? 1 : 0 }}
          transition={{ duration: 2.8, ease: "easeOut" }}
          className="text-center"
        >
          <p className="font-sans text-[8.5px] tracking-[0.52em] uppercase text-[#9A8968] mb-7">
            HOUSE OF HOROLOGICAL ART
          </p>
          <h1 className="font-display text-[76px] md:text-[104px] lg:text-[128px] text-[#F4F1EA] tracking-[0.07em] leading-none">
            MILLIN
          </h1>
        </motion.div>
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: titleVisible ? 1 : 0 }}
        transition={{ duration: 1.4, delay: 1.2 }}
        className="absolute bottom-9 left-0 right-0 flex flex-col items-center gap-2.5 pointer-events-none"
      >
        <span className="font-sans text-[8px] tracking-[0.35em] uppercase text-[#F4F1EA]/22">ENTER</span>
        <motion.div
          animate={{ y: [0, 7, 0] }}
          transition={{ duration: 2.8, repeat: Infinity, ease: "easeInOut" }}
          className="w-px h-9 bg-gradient-to-b from-[#F4F1EA]/25 to-transparent"
        />
      </motion.div>
    </section>
  );
}

// ─── HouseHero ────────────────────────────────────────────────────────────────

function HouseHero() {
  return (
    <section className="relative h-screen w-full overflow-hidden bg-[#161616]">
      <div className="absolute inset-0">
        <img
          src={asset("MILLIN_HOUSE_HERO_001", 1920, 1080)}
          alt="MILLIN_HOUSE_HERO_001"
          className="w-full h-full object-cover"
          style={{ filter: "brightness(0.5)" }}
        />
      </div>
      <div className="absolute inset-0 bg-gradient-to-r from-[#161616]/58 via-[#161616]/18 to-transparent" />
      <div className="absolute inset-0 bg-gradient-to-t from-[#161616]/62 via-transparent to-transparent" />

      <div className="relative h-full flex flex-col justify-end px-8 md:px-20 pb-20 md:pb-28">
        <Reveal duration={1.8}>
          <HouseLabel light>THE HOUSE</HouseLabel>
          <h2 className="font-display text-[54px] md:text-[76px] lg:text-[92px] text-[#F4F1EA] mt-4 leading-[0.88] tracking-wide max-w-3xl">
            HOUSE OF<br />MILLIN
          </h2>
          <p className="font-body italic text-[#F4F1EA]/50 text-[16px] md:text-[18px] mt-6 leading-relaxed">
            A House of Horological Art.
          </p>
          <p className="font-sans text-[11px] text-[#F4F1EA]/30 mt-2 tracking-wide leading-relaxed max-w-[420px]">
            Handcrafted horological art, created for a handful of collectors.
          </p>
          <div className="mt-11 flex flex-col sm:flex-row gap-8">
            <CTAButton light>ENTER THE HOUSE</CTAButton>
            <CTAButton light>DISCOVER THE ATELIER</CTAButton>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

// ─── HousePhilosophy ─────────────────────────────────────────────────────────

function HousePhilosophy() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-12% 0px" });

  return (
    <div
      ref={ref}
      className="bg-[#161616] flex items-center justify-center text-center"
      style={{ minHeight: "100vh", padding: "22vh 2rem" }}
    >
      <div className="max-w-2xl mx-auto">
        <motion.p
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : {}}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="font-sans text-[9px] tracking-[0.45em] uppercase text-[#9A8968] mb-16"
        >
          PHILOSOPHY
        </motion.p>
        <motion.h2
          initial={{ opacity: 0, y: 28 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 2.2, delay: 0.35, ease: [0.16, 1, 0.3, 1] }}
          className="font-display text-[38px] md:text-[54px] lg:text-[68px] text-[#F4F1EA] leading-[1.08] tracking-wide"
        >
          IN AN AGE<br />DEFINED BY SPEED,<br />WE CHOOSE<br />PATIENCE.
        </motion.h2>
      </div>
    </div>
  );
}

// ─── HouseArchitecture ────────────────────────────────────────────────────────

function HouseArchitecture() {
  return (
    <section className="bg-[#F4F1EA] overflow-hidden">
      <div className="px-8 md:px-16 pt-24 pb-12">
        <Reveal>
          <HouseLabel>THE HOUSE · ARCHITECTURAL JOURNEY</HouseLabel>
          <p className="font-body italic text-[#161616]/28 text-[12px] mt-2">
            ENTRANCE HALL → PRIVATE SALON → LIBRARY → ATELIER
          </p>
        </Reveal>
      </div>

      {ROOMS.map((room, i) => (
        <Reveal key={room.title} delay={0.08}>
          <div className={`flex flex-col ${room.align === "right" ? "lg:flex-row" : "lg:flex-row-reverse"} mb-1`}>
            <div className="lg:w-8/12 overflow-hidden" style={{ aspectRatio: "16/9" }}>
              <img
                src={asset(room.slot, 1200, 680)}
                alt={room.slot}
                className="w-full h-full object-cover hover:scale-[1.02] transition-transform duration-1000"
              />
            </div>
            <div className="lg:w-4/12 flex flex-col justify-center px-10 md:px-14 lg:px-16 py-14">
              <HouseLabel>{String(i + 1).padStart(2, "0")}</HouseLabel>
              <h3 className="font-display text-[28px] md:text-[36px] text-[#161616] mt-3 leading-tight tracking-wide">
                {room.title}
              </h3>
              <p className="font-body italic text-[#8A847B] text-[15px] mt-4 leading-[1.7]">
                {room.sentence}
              </p>
            </div>
          </div>
        </Reveal>
      ))}
    </section>
  );
}

// ─── AtelierIntroduction ──────────────────────────────────────────────────────

function AtelierIntroduction() {
  return (
    <section className="bg-[#161616] overflow-hidden">
      <div className="grid lg:grid-cols-2 min-h-screen">
        <div className="relative overflow-hidden min-h-[60vw] lg:min-h-0">
          <img
            src={asset("MILLIN_ATELIER_WORKBENCH_001", 900, 1100)}
            alt="MILLIN_ATELIER_WORKBENCH_001"
            className="absolute inset-0 w-full h-full object-cover"
            style={{ filter: "brightness(0.66)" }}
          />
          <div className="absolute inset-0 bg-gradient-to-r from-transparent to-[#161616]/25" />
        </div>
        <div className="flex flex-col justify-center px-10 md:px-16 lg:px-20 py-24">
          <Reveal>
            <HouseLabel light>ATELIER · INTRODUCTION</HouseLabel>
            <h2 className="font-display text-[44px] md:text-[60px] lg:text-[72px] text-[#F4F1EA] mt-5 leading-[0.92] tracking-wide">
              INSIDE THE<br />ATELIER
            </h2>
            <p className="font-body italic text-[#F4F1EA]/46 text-[15px] mt-7 max-w-[360px] leading-[1.9]">
              Where patience becomes craft.<br />Where silence becomes creation.
            </p>
            <p className="font-sans text-[11px] text-[#F4F1EA]/26 mt-5 max-w-[380px] leading-[1.9]">
              The atelier is not a factory. It is a place of concentration — where each gesture is deliberate, each tool understood, each material respected.
            </p>
            <div className="mt-11">
              <CTAButton light>ENTER THE ATELIER</CTAButton>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}

// ─── CraftChapters ────────────────────────────────────────────────────────────

function CraftChapters() {
  return (
    <section className="bg-[#F4F1EA]">
      <div className="px-8 md:px-16 pt-24 pb-10">
        <Reveal>
          <HouseLabel>MÉTIERS D'ART · FOUR CHAPTERS</HouseLabel>
          <p className="font-body italic text-[#161616]/26 text-[12px] mt-2">
            MATERIAL → HAND → PROCESS → TRANSFORMATION → ART
          </p>
        </Reveal>
      </div>

      {CRAFTS.map((craft, i) => (
        <Reveal key={craft.title} delay={0.08}>
          <div className={`flex flex-col ${i % 2 === 0 ? "lg:flex-row" : "lg:flex-row-reverse"} border-t border-[#161616]/8`}>
            <div className="lg:w-7/12 overflow-hidden" style={{ aspectRatio: "4/3" }}>
              <img
                src={asset(craft.slot, 1100, 825)}
                alt={craft.slot}
                className="w-full h-full object-cover hover:scale-[1.02] transition-transform duration-1000"
                style={{ filter: "brightness(0.86)" }}
              />
            </div>
            <div className="lg:w-5/12 flex flex-col justify-center px-10 md:px-16 lg:px-20 py-16">
              <HouseLabel>{craft.n}</HouseLabel>
              <h3 className="font-display text-[32px] md:text-[44px] text-[#161616] mt-4 leading-tight tracking-wide">
                {craft.title}
              </h3>
              <p className="font-body italic text-[#9A8968] text-[15px] mt-5 leading-relaxed">
                {craft.statement}
              </p>
              <div className="mt-7 pt-7 border-t border-[#161616]/10 space-y-4">
                <div>
                  <p className="font-sans text-[9px] tracking-[0.2em] uppercase text-[#8A847B] mb-1">MATERIAL</p>
                  <p className="font-sans text-[12px] text-[#161616]/42 leading-relaxed">{craft.material}</p>
                </div>
                <div>
                  <p className="font-sans text-[9px] tracking-[0.2em] uppercase text-[#8A847B] mb-1">PROCESS</p>
                  <p className="font-sans text-[12px] text-[#161616]/42 leading-relaxed">{craft.process}</p>
                </div>
              </div>
            </div>
          </div>
        </Reveal>
      ))}
    </section>
  );
}

// ─── HumanPresence ────────────────────────────────────────────────────────────

function HumanPresence() {
  return (
    <section className="bg-[#161616] py-24 md:py-36">
      <div className="px-8 md:px-16 mb-14">
        <Reveal>
          <HouseLabel light>HUMAN PRESENCE · SIX FRAMES</HouseLabel>
          <h2 className="font-display text-[44px] md:text-[64px] text-[#F4F1EA] mt-4 leading-[0.9] tracking-wide">
            THE HUMAN<br />HAND
          </h2>
          <p className="font-body italic text-[#F4F1EA]/35 text-[15px] mt-4">
            Every creation begins with a gesture.
          </p>
        </Reveal>
      </div>

      <div className="px-3 md:px-6 space-y-1.5">
        {/* Row 1: wide-left (8col) + narrow-right (4col) */}
        <Reveal>
          <div className="grid grid-cols-12 gap-1.5">
            <div className="col-span-12 lg:col-span-8 relative overflow-hidden" style={{ aspectRatio: "16/9" }}>
              <img
                src={asset(HUMAN_FRAMES[0].slot, 900, 506)}
                alt={HUMAN_FRAMES[0].slot}
                className="w-full h-full object-cover"
                style={{ filter: "brightness(0.7)" }}
              />
              <div className="absolute bottom-4 left-5 flex items-baseline gap-3">
                <HouseLabel light>{HUMAN_FRAMES[0].chapter}</HouseLabel>
                <span className="font-body italic text-[#F4F1EA]/42 text-[12px]">{HUMAN_FRAMES[0].label}</span>
              </div>
            </div>
            <div className="col-span-12 lg:col-span-4 relative overflow-hidden" style={{ aspectRatio: "3/4" }}>
              <img
                src={asset(HUMAN_FRAMES[1].slot, 450, 600)}
                alt={HUMAN_FRAMES[1].slot}
                className="w-full h-full object-cover"
                style={{ filter: "brightness(0.65)" }}
              />
              <div className="absolute bottom-4 left-4 flex items-baseline gap-3">
                <HouseLabel light>{HUMAN_FRAMES[1].chapter}</HouseLabel>
                <span className="font-body italic text-[#F4F1EA]/42 text-[12px]">{HUMAN_FRAMES[1].label}</span>
              </div>
            </div>
          </div>
        </Reveal>

        {/* Row 2: narrow-left (4col) + wide-right (8col) */}
        <Reveal delay={0.1}>
          <div className="grid grid-cols-12 gap-1.5">
            <div className="col-span-12 lg:col-span-4 relative overflow-hidden" style={{ aspectRatio: "3/4" }}>
              <img
                src={asset(HUMAN_FRAMES[2].slot, 450, 600)}
                alt={HUMAN_FRAMES[2].slot}
                className="w-full h-full object-cover"
                style={{ filter: "brightness(0.64)" }}
              />
              <div className="absolute bottom-4 left-4 flex items-baseline gap-3">
                <HouseLabel light>{HUMAN_FRAMES[2].chapter}</HouseLabel>
                <span className="font-body italic text-[#F4F1EA]/42 text-[12px]">{HUMAN_FRAMES[2].label}</span>
              </div>
            </div>
            <div className="col-span-12 lg:col-span-8 relative overflow-hidden" style={{ aspectRatio: "16/9" }}>
              <img
                src={asset(HUMAN_FRAMES[3].slot, 900, 506)}
                alt={HUMAN_FRAMES[3].slot}
                className="w-full h-full object-cover"
                style={{ filter: "brightness(0.7)" }}
              />
              <div className="absolute bottom-4 left-5 flex items-baseline gap-3">
                <HouseLabel light>{HUMAN_FRAMES[3].chapter}</HouseLabel>
                <span className="font-body italic text-[#F4F1EA]/42 text-[12px]">{HUMAN_FRAMES[3].label}</span>
              </div>
            </div>
          </div>
        </Reveal>

        {/* Row 3: full-width cinematic strip */}
        <Reveal delay={0.14}>
          <div className="relative overflow-hidden w-full" style={{ aspectRatio: "32/7" }}>
            <img
              src={asset(HUMAN_FRAMES[4].slot, 1920, 420)}
              alt={HUMAN_FRAMES[4].slot}
              className="w-full h-full object-cover"
              style={{ filter: "brightness(0.6)" }}
            />
            <div className="absolute inset-0 flex items-center justify-center text-center">
              <div>
                <HouseLabel light>{HUMAN_FRAMES[4].chapter}</HouseLabel>
                <p className="font-body italic text-[#F4F1EA]/48 text-[14px] mt-2">{HUMAN_FRAMES[4].label}</p>
              </div>
            </div>
          </div>
        </Reveal>

        {/* Row 4: centered narrow */}
        <Reveal delay={0.18}>
          <div className="flex justify-center">
            <div className="w-full lg:w-5/12 relative overflow-hidden" style={{ aspectRatio: "4/3" }}>
              <img
                src={asset(HUMAN_FRAMES[5].slot, 680, 510)}
                alt={HUMAN_FRAMES[5].slot}
                className="w-full h-full object-cover"
                style={{ filter: "brightness(0.58)" }}
              />
              <div className="absolute inset-x-0 bottom-0 text-center pb-6">
                <HouseLabel light>{HUMAN_FRAMES[5].chapter}</HouseLabel>
                <p className="font-body italic text-[#F4F1EA]/46 text-[13px] mt-2">{HUMAN_FRAMES[5].label}</p>
              </div>
            </div>
          </div>
        </Reveal>
      </div>

      <div className="px-8 md:px-16 mt-16 text-center">
        <Reveal>
          <p className="font-sans text-[9px] tracking-[0.28em] uppercase text-[#F4F1EA]/16">
            HANDS THAT CREATE · HANDS THAT PRESERVE · HANDS THAT WELCOME · HANDS THAT CONTEMPLATE
          </p>
        </Reveal>
      </div>
    </section>
  );
}

// ─── HeroCreation ─────────────────────────────────────────────────────────────

function HeroCreation() {
  return (
    <section className="bg-[#0A0A08]">
      <div className="text-center py-28 md:py-40 px-8">
        <Reveal>
          <p className="font-body italic text-[#F4F1EA]/18 text-[14px] tracking-wide">
            Now I understand where this came from.
          </p>
        </Reveal>
      </div>

      <div className="relative overflow-hidden" style={{ minHeight: "100vh" }}>
        <img
          src={asset("MILLIN_CREATION_YELLOW_TIGER_001", 1920, 1080)}
          alt="MILLIN_CREATION_YELLOW_TIGER_001"
          className="absolute inset-0 w-full h-full object-cover"
          style={{ filter: "brightness(0.52) contrast(1.08)" }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-[#0A0A08]/32 via-transparent to-[#0A0A08]/68" />
        <div className="absolute inset-0 bg-gradient-to-r from-[#0A0A08]/38 via-transparent to-transparent" />

        <div className="relative h-full min-h-screen flex flex-col justify-end px-8 md:px-20 pb-20 md:pb-28">
          <Reveal duration={1.8}>
            <HouseLabel light>HERO CREATION · I</HouseLabel>
            <h2 className="font-display text-[60px] md:text-[92px] lg:text-[118px] text-[#F4F1EA] mt-4 leading-none tracking-wide">
              YELLOW<br />TIGER
            </h2>
            <p className="font-body italic text-[#F4F1EA]/52 text-[17px] mt-5">
              A study of strength and stillness.
            </p>
            <div className="mt-11">
              <CTAButton light>DISCOVER THE CREATION</CTAButton>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}

// ─── CreationArchive ──────────────────────────────────────────────────────────

function CreationArchive() {
  const [, crane, peacock, starry, wave] = CREATIONS;

  return (
    <section className="bg-[#F4F1EA]">
      <div className="px-8 md:px-16 pt-28 pb-14">
        <Reveal>
          <HouseLabel>THE CREATIONS · ARCHIVE</HouseLabel>
          <p className="font-body italic text-[#161616]/28 text-[13px] mt-2">
            Works of horological art — each a world.
          </p>
        </Reveal>
      </div>

      {/* GRACEFUL CRANE — large editorial */}
      <Reveal>
        <div className="flex flex-col lg:flex-row border-t border-[#161616]/8">
          <div className="lg:w-7/12 overflow-hidden" style={{ aspectRatio: "16/10" }}>
            <img
              src={asset(crane.slot, 1100, 688)}
              alt={crane.slot}
              className="w-full h-full object-cover hover:scale-[1.02] transition-transform duration-1000"
              style={{ filter: "brightness(0.84)" }}
            />
          </div>
          <div className="lg:w-5/12 flex flex-col justify-center px-10 md:px-16 lg:px-20 py-16">
            <HouseLabel>II</HouseLabel>
            <h3 className="font-display text-[36px] md:text-[48px] text-[#161616] mt-3 leading-tight tracking-wide">
              {crane.title}
            </h3>
            <p className="font-body italic text-[#9A8968] text-[15px] mt-5 leading-relaxed">
              {crane.statement}
            </p>
            <p className="font-sans text-[12px] text-[#161616]/34 mt-5 max-w-[320px] leading-[1.9]">
              A meditation on the fragility of time. Grand Feu enamel on midnight blue — the crane suspended mid-flight, caught between worlds.
            </p>
            <div className="mt-9">
              <CTAButton>OBSERVE THE CREATION</CTAButton>
            </div>
          </div>
        </div>
      </Reveal>

      {/* GOLDEN PEACOCK + STARRY NIGHT — two columns */}
      <Reveal delay={0.1}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-1 mt-1">
          {[peacock, starry].map((creation, i) => (
            <div key={creation.title} className="group relative overflow-hidden" style={{ aspectRatio: "3/4" }}>
              <img
                src={asset(creation.slot, 700, 933)}
                alt={creation.slot}
                className="w-full h-full object-cover group-hover:scale-[1.02] transition-transform duration-1000"
                style={{ filter: "brightness(0.66)" }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#161616]/72 via-transparent to-transparent" />
              <div className="absolute bottom-7 left-7">
                <HouseLabel light>{["III", "IV"][i]}</HouseLabel>
                <h4 className="font-display text-[28px] text-[#F4F1EA] mt-2 tracking-wide leading-tight">
                  {creation.title}
                </h4>
                <p className="font-body italic text-[#F4F1EA]/50 text-[13px] mt-2">
                  {creation.statement}
                </p>
              </div>
            </div>
          ))}
        </div>
      </Reveal>

      {/* ROYAL WAVE — text teaser */}
      <Reveal delay={0.12}>
        <div className="border-t border-[#161616]/8 py-12 px-8 md:px-16 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div>
            <HouseLabel>V</HouseLabel>
            <h4 className="font-display text-[28px] md:text-[34px] text-[#161616] mt-2 tracking-wide">
              {wave.title}
            </h4>
            <p className="font-body italic text-[#9A8968] text-[14px] mt-2">{wave.statement}</p>
          </div>
          <CTAButton>ENTER THE ARCHIVE</CTAButton>
        </div>
      </Reveal>

      <div className="border-t border-[#161616]/8 py-16 text-center">
        <Reveal>
          <p className="font-sans text-[9px] tracking-[0.28em] uppercase text-[#161616]/22 mb-7">
            FIVE WORKS · ONE HOUSE
          </p>
          <CTAButton>EXPLORE THE CREATIONS</CTAButton>
        </Reveal>
      </div>
    </section>
  );
}

// ─── RarityStatement ─────────────────────────────────────────────────────────

function RarityStatement() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-15% 0px" });

  return (
    <div
      ref={ref}
      className="bg-[#161616] flex items-center justify-center text-center"
      style={{ minHeight: "85vh", padding: "18vh 2rem" }}
    >
      <div className="max-w-md mx-auto">
        <motion.p
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : {}}
          transition={{ duration: 1, ease: "easeOut" }}
          className="font-sans text-[9px] tracking-[0.45em] uppercase text-[#9A8968] mb-14"
        >
          RARITY
        </motion.p>

        <motion.h2
          initial={{ opacity: 0, y: 22 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 2, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
          className="font-display text-[38px] md:text-[54px] text-[#F4F1EA] leading-[1.08] tracking-wide mb-12"
        >
          CRAFTED IN<br />SMALL<br />QUANTITIES.
        </motion.h2>

        <motion.div
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : {}}
          transition={{ duration: 1.4, delay: 0.9, ease: "easeOut" }}
          className="flex items-end justify-center gap-12 md:gap-16"
        >
          {[{ n: "80", label: "pieces" }, { n: "∞", label: "hours" }, { n: "01", label: "artisan" }].map(({ n, label }) => (
            <div key={label} className="text-center">
              <p className="font-display text-[44px] md:text-[60px] text-[#F4F1EA]/72 leading-none">{n}</p>
              <p className="font-sans text-[8px] tracking-[0.28em] uppercase text-[#9A8968] mt-2">{label}</p>
            </div>
          ))}
        </motion.div>

        <motion.p
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : {}}
          transition={{ duration: 1.2, delay: 1.5, ease: "easeOut" }}
          className="font-body italic text-[#F4F1EA]/16 text-[12px] mt-14 tracking-wide"
        >
          Hand finished. Not for the many.
        </motion.p>
      </div>
    </div>
  );
}

// ─── BespokeIntroduction ─────────────────────────────────────────────────────

function BespokeIntroduction() {
  return (
    <section className="bg-[#0A0A08] overflow-hidden">
      <div
        className="flex flex-col items-center justify-center text-center"
        style={{ minHeight: "80vh", padding: "18vh 2rem" }}
      >
        <Reveal duration={2}>
          <HouseLabel light>BESPOKE ATELIER</HouseLabel>
          <h2 className="font-display text-[60px] md:text-[88px] lg:text-[108px] text-[#F4F1EA] mt-6 leading-none tracking-wide">
            CREATED<br />FOR ONE.
          </h2>
          <p className="font-body italic text-[#F4F1EA]/28 text-[16px] mt-7">
            Private commissions.
          </p>
        </Reveal>
      </div>

      {/* Creation journey strip */}
      <Reveal>
        <div className="grid grid-cols-2 md:grid-cols-5 border-t border-[#F4F1EA]/6">
          {BESPOKE_JOURNEY.map((step, i) => (
            <div key={step.label} className="relative overflow-hidden group" style={{ aspectRatio: "3/4" }}>
              <img
                src={asset(step.slot, 380, 507)}
                alt={step.slot}
                className="w-full h-full object-cover group-hover:scale-[1.04] transition-transform duration-1000"
                style={{ filter: "brightness(0.38)" }}
              />
              <div className="absolute inset-0 flex flex-col items-center justify-end pb-7 text-center px-3">
                <span className="font-sans text-[8px] tracking-[0.35em] uppercase text-[#9A8968] mb-1.5">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <span className="font-sans text-[9px] tracking-[0.22em] uppercase text-[#F4F1EA]/48">
                  {step.label}
                </span>
              </div>
              {i < BESPOKE_JOURNEY.length - 1 && (
                <div className="hidden md:flex absolute top-1/2 right-0 -translate-y-1/2 translate-x-1/2 z-10 items-center justify-center">
                  <ArrowRight size={11} className="text-[#9A8968]/32" />
                </div>
              )}
            </div>
          ))}
        </div>
      </Reveal>

      {/* BESPOKE-CRA-001 — The Sketch — featured cinematic block */}
      <Reveal>
        <div className="relative overflow-hidden" style={{ height: "70vh", minHeight: "480px" }}>
          <img
            src={asset("MILLIN_BESPOKE_MASTER_002", 1600, 900)}
            alt="MILLIN_BESPOKE_MASTER_002"
            className="absolute inset-0 w-full h-full object-cover object-top"
            style={{ filter: "brightness(0.52) contrast(0.97) saturate(0.82)" }}
          />
          {/* Left-side text over the image */}
          <div className="absolute inset-0 flex flex-col justify-end px-10 md:px-20 pb-14 md:pb-20"
            style={{ background: "linear-gradient(to top, rgba(10,10,8,0.82) 0%, rgba(10,10,8,0.18) 55%, transparent 100%)" }}>
            <div className="max-w-[520px]">
              <span className="font-sans text-[8px] tracking-[0.38em] uppercase text-[#9A8968] block mb-4">
                02 — THE SKETCH
              </span>
              <p className="font-display text-[28px] md:text-[38px] text-[#F4F1EA]/85 leading-tight tracking-wide mb-4">
                The conversation<br />becomes a drawing.
              </p>
              <p className="font-sans text-[10px] text-[#F4F1EA]/32 leading-[1.9] max-w-[360px]">
                After the first meeting, the artisan returns to the table alone.
                What was spoken becomes visible. Ideas, proportions, possibilities —
                committed to paper before they can become anything else.
              </p>
            </div>
          </div>
          {/* Top-right label */}
          <div className="absolute top-7 right-8">
            <span className="font-mono text-[8px] tracking-[0.28em] uppercase text-[#F4F1EA]/18">
              BESPOKE ATELIER · MILLIN
            </span>
          </div>
        </div>
      </Reveal>

      <div className="grid lg:grid-cols-2">
        <div className="flex flex-col justify-center px-10 md:px-16 lg:px-20 py-20 order-2 lg:order-1">
          <Reveal>
            <div className="space-y-3 mb-10">
              {["ONE COLLECTOR.", "ONE ARTISAN.", "ONE CREATION."].map((line) => (
                <p key={line} className="font-display text-[24px] md:text-[30px] text-[#F4F1EA]/62 tracking-wide leading-tight">
                  {line}
                </p>
              ))}
            </div>
            <p className="font-sans text-[11px] text-[#F4F1EA]/26 max-w-[380px] leading-[1.9] mb-11">
              The creation does not exist until the relationship begins. From the first conversation to the final presentation — every decision made together. Every choice deliberate. Every element chosen for one person alone.
            </p>
            <CTAButton light>BEGIN A PRIVATE CONVERSATION</CTAButton>
          </Reveal>
        </div>
        <div className="relative overflow-hidden min-h-[55vw] lg:min-h-0 order-1 lg:order-2">
          <img
            src={asset("MILLIN_BESPOKE_PRESENTATION_001", 800, 900)}
            alt="MILLIN_BESPOKE_PRESENTATION_001"
            className="absolute inset-0 w-full h-full object-cover"
            style={{ filter: "brightness(0.46)" }}
          />
        </div>
      </div>
    </section>
  );
}

// ─── CollectorExperience ─────────────────────────────────────────────────────

function CollectorExperience() {
  return (
    <section className="bg-[#F4F1EA] overflow-hidden">
      <div className="grid lg:grid-cols-2" style={{ minHeight: "75vh" }}>
        <div className="relative overflow-hidden min-h-[55vw] lg:min-h-0">
          <img
            src={asset("MILLIN_BESPOKE_COLLECTOR_001", 900, 1000)}
            alt="MILLIN_BESPOKE_COLLECTOR_001"
            className="absolute inset-0 w-full h-full object-cover"
            style={{ filter: "brightness(0.74)" }}
          />
        </div>
        <div className="flex flex-col justify-center px-10 md:px-16 lg:px-20 py-24">
          <Reveal>
            <HouseLabel>THE COLLECTOR</HouseLabel>
            <h2 className="font-display text-[40px] md:text-[54px] lg:text-[64px] text-[#161616] mt-4 leading-[0.92] tracking-wide">
              FOR A HANDFUL<br />OF COLLECTORS.
            </h2>
            <p className="font-body italic text-[#8A847B] text-[15px] mt-6 max-w-[400px] leading-[1.9]">
              Some creations are not made for many.<br />
              They are made for those who understand.
            </p>
            <p className="font-sans text-[11px] text-[#161616]/32 mt-5 max-w-[370px] leading-[1.9]">
              The relationship between the House and the collector is not a transaction. It is a dialogue that continues across time — through creation, care, and legacy.
            </p>
            <div className="mt-11">
              <CTAButton>ENTER THE COLLECTOR EXPERIENCE</CTAButton>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}

// ─── PrivatePresentation ─────────────────────────────────────────────────────

function PrivatePresentation() {
  return (
    <section className="bg-[#161616] overflow-hidden">
      <div className="grid lg:grid-cols-2" style={{ minHeight: "70vh" }}>
        <div className="flex flex-col justify-center px-10 md:px-16 lg:px-20 py-24 order-2 lg:order-1">
          <Reveal>
            <HouseLabel light>BOUTIQUES · PRIVATE PRESENTATION</HouseLabel>
            <h2 className="font-display text-[40px] md:text-[54px] text-[#F4F1EA] mt-4 leading-[0.92] tracking-wide">
              PRIVATE<br />PRESENTATION.
            </h2>
            <p className="font-body italic text-[#F4F1EA]/36 text-[15px] mt-6">
              By appointment.
            </p>
            <p className="font-sans text-[11px] text-[#F4F1EA]/24 mt-4 max-w-[360px] leading-[1.9]">
              One table. Natural daylight. A conversation. The presentation ritual is as deliberate as the creation itself.
            </p>
            <div className="mt-11 flex flex-col sm:flex-row gap-8">
              <CTAButton light>REQUEST A PRIVATE APPOINTMENT</CTAButton>
              <CTAButton light>FIND A BOUTIQUE</CTAButton>
            </div>
          </Reveal>
        </div>
        <div className="relative overflow-hidden min-h-[55vw] lg:min-h-0 order-1 lg:order-2">
          <img
            src={asset("MILLIN_ATELIER_WORKBENCH_001", 900, 900)}
            alt="MILLIN_ATELIER_WORKBENCH_001"
            className="absolute inset-0 w-full h-full object-cover"
            style={{ filter: "brightness(0.52)" }}
          />
        </div>
      </div>
    </section>
  );
}

// ─── LifetimeCare ────────────────────────────────────────────────────────────

function LifetimeCare() {
  return (
    <section className="bg-[#F4F1EA] border-t border-[#161616]/8 py-24 md:py-36">
      <div className="px-8 md:px-16 grid lg:grid-cols-3 gap-14 lg:gap-20">
        <Reveal className="lg:col-span-1">
          <HouseLabel>SERVICE · STEWARDSHIP</HouseLabel>
          <h2 className="font-display text-[40px] md:text-[52px] text-[#161616] mt-4 leading-[0.92] tracking-wide">
            LIFETIME<br />CARE.
          </h2>
          <p className="font-body italic text-[#8A847B] text-[15px] mt-6 max-w-[340px] leading-[1.85]">
            Preservation through time.
          </p>
          <p className="font-sans text-[11px] text-[#161616]/36 mt-4 max-w-[340px] leading-[1.9]">
            The creation does not leave the House when it enters a collection. The relationship continues — across decades, across generations.
          </p>
          <div className="mt-11">
            <CTAButton>DISCOVER LIFETIME CARE</CTAButton>
          </div>
        </Reveal>

        <Reveal delay={0.1} className="lg:col-span-2">
          <div className="grid grid-cols-3 gap-2">
            {LIFETIME_CARE_STAGES.map((item) => (
              <div key={item.label} className="relative overflow-hidden" style={{ aspectRatio: "3/4" }}>
                <img
                  src={asset(item.slot, 280, 374)}
                  alt={item.slot}
                  className="w-full h-full object-cover"
                  style={{ filter: "brightness(0.66)" }}
                />
                <div className="absolute bottom-3 left-3">
                  <span className="font-sans text-[9px] tracking-[0.22em] uppercase text-[#F4F1EA]/50">{item.label}</span>
                </div>
              </div>
            ))}
          </div>
        </Reveal>
      </div>
    </section>
  );
}

// ─── JournalIntroduction ─────────────────────────────────────────────────────

function JournalIntroduction() {
  const [feature, ...supporting] = JOURNAL_STORIES;

  return (
    <section className="bg-[#F4F1EA] border-t border-[#161616]/8">
      <div className="px-8 md:px-16 pt-24 pb-12">
        <Reveal>
          <HouseLabel>THE JOURNAL</HouseLabel>
          <p className="font-body italic text-[#8A847B] text-[13px] mt-2">
            Ideas, materials, histories and the culture of horological art.
          </p>
        </Reveal>
      </div>

      {/* Feature — large editorial */}
      <Reveal>
        <div className="flex flex-col lg:flex-row border-t border-[#161616]/8">
          <div className="lg:w-6/12 overflow-hidden" style={{ aspectRatio: "16/10" }}>
            <img
              src={asset(feature.slot, 900, 562)}
              alt={feature.slot}
              className="w-full h-full object-cover hover:scale-[1.02] transition-transform duration-1000"
              style={{ filter: "brightness(0.82)" }}
            />
          </div>
          <div className="lg:w-6/12 flex flex-col justify-center px-10 md:px-16 lg:px-20 py-16">
            <HouseLabel>{feature.category}</HouseLabel>
            <h3 className="font-display text-[32px] md:text-[46px] text-[#161616] mt-4 leading-tight tracking-wide">
              {feature.title}
            </h3>
            <p className="font-body italic text-[#8A847B] text-[15px] mt-6 max-w-[400px] leading-[1.85]">
              {feature.excerpt}
            </p>
            <div className="mt-9">
              <CTAButton>READ THE STORY</CTAButton>
            </div>
          </div>
        </div>
      </Reveal>

      {/* Two supporting stories */}
      <Reveal delay={0.1}>
        <div className="grid grid-cols-1 md:grid-cols-2 border-t border-[#161616]/8">
          {supporting.map((story, i) => (
            <div key={story.title} className={`flex flex-col ${i === 0 ? "border-b md:border-b-0 md:border-r border-[#161616]/8" : ""}`}>
              <div className="overflow-hidden" style={{ aspectRatio: "16/9" }}>
                <img
                  src={asset(story.slot, 700, 394)}
                  alt={story.slot}
                  className="w-full h-full object-cover hover:scale-[1.02] transition-transform duration-1000"
                  style={{ filter: "brightness(0.78)" }}
                />
              </div>
              <div className="px-8 py-10">
                <HouseLabel>{story.category}</HouseLabel>
                <h4 className="font-display text-[22px] md:text-[28px] text-[#161616] mt-3 leading-tight tracking-wide">
                  {story.title}
                </h4>
                <p className="font-body italic text-[#8A847B] text-[13px] mt-3 leading-[1.75]">
                  {story.excerpt}
                </p>
                <div className="mt-7">
                  <CTAButton>READ</CTAButton>
                </div>
              </div>
            </div>
          ))}
        </div>
      </Reveal>

      <div className="border-t border-[#161616]/8 py-14 px-8 md:px-16 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-5">
        <p className="font-sans text-[8.5px] tracking-[0.28em] uppercase text-[#161616]/20">
          MILLIN IS CULTURE · NOT MERELY WATCHMAKING.
        </p>
        <CTAButton>ENTER THE JOURNAL</CTAButton>
      </div>
    </section>
  );
}

// ─── HouseEpilogue ────────────────────────────────────────────────────────────

function HouseEpilogue() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-20% 0px" });

  return (
    <div
      ref={ref}
      className="bg-[#0A0A08] flex items-center justify-center"
      style={{ minHeight: "100vh", padding: "20vh 2rem" }}
    >
      <div className="text-center">
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 2.8, ease: [0.16, 1, 0.3, 1] }}
        >
          <p className="font-display text-[88px] md:text-[130px] lg:text-[170px] text-[#F4F1EA] tracking-[0.07em] leading-none">
            MILLIN
          </p>
          <p className="font-body italic text-[#F4F1EA]/22 text-[14px] mt-7 tracking-wide">
            TIME, CRAFTED.
          </p>
        </motion.div>
      </div>
    </div>
  );
}

// ─── HouseFooter ─────────────────────────────────────────────────────────────

function HouseFooter() {
  const columns = [
    { title: "THE HOUSE",  links: ["Entrance Hall", "Private Salon", "Library", "Philosophy"] },
    { title: "ATELIER",    links: ["Métiers d'Art", "Grand Feu Enamel", "Hand Engraving", "Guilloché"] },
    { title: "COLLECTORS", links: ["Private Presentation", "Bespoke", "Lifetime Care", "Correspondence"] },
    { title: "HOUSE",      links: ["Journal", "Boutiques", "Service", "Contact"] },
  ];

  return (
    <footer className="bg-[#0A0A08] border-t border-[#F4F1EA]/5 py-16 px-8 md:px-16">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-10 mb-16">
        {columns.map((col) => (
          <div key={col.title}>
            <p className="font-sans text-[8.5px] tracking-[0.32em] uppercase text-[#9A8968] mb-5">
              {col.title}
            </p>
            {col.links.map((link) => (
              <a key={link} href="#" className="block font-sans text-[11px] text-[#F4F1EA]/26 hover:text-[#F4F1EA]/52 transition-colors py-1">
                {link}
              </a>
            ))}
          </div>
        ))}
      </div>

      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 pt-8 border-t border-[#F4F1EA]/5">
        <p className="font-display text-[13px] tracking-[0.32em] text-[#F4F1EA]/26">MILLIN</p>
        <p className="font-sans text-[8.5px] tracking-[0.18em] uppercase text-[#F4F1EA]/14">
          HOUSE OF HOROLOGICAL ART · MMXXIV
        </p>
        <p className="font-sans text-[9px] text-[#F4F1EA]/14">A House of Horological Art.</p>
      </div>
    </footer>
  );
}

// ─── App ─────────────────────────────────────────────────────────────────────

export default function App() {
  const hash = useHashRoute();
  if (hash === "#visual-world") return <VisualWorldBoard />;

  return (
    <div className="overflow-x-hidden">
      <HouseNavigation />
      <HousePrologue />
      <HouseHero />
      <HousePhilosophy />
      <HouseArchitecture />
      <AtelierIntroduction />
      <CraftChapters />
      <HumanPresence />
      <HeroCreation />
      <CreationArchive />
      <RarityStatement />
      <BespokeIntroduction />
      <CollectorExperience />
      <PrivatePresentation />
      <LifetimeCare />
      <JournalIntroduction />
      <HouseEpilogue />
      <HouseFooter />
    </div>
  );
}
