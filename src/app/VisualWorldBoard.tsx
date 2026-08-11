import { useState } from "react";
import { asset, MILLIN_META, MILLIN_SLOTS, type AssetStatus } from "../lib/millin-visual-library";

// Local imports for the Architecture v1.0 images
import houseArc001    from "../imports/HOUSE-ARC-001.png";
import salonArc001    from "../imports/SALON-ARC-001.png";
import libraryArc001  from "../imports/LIBRARY-ARC-001.png";
import atelierArc001  from "../imports/ATELIER-ARC-001.png"; // superseded
import atelierArc002  from "../imports/ATELIER-ARC-002.png"; // approved ARC v1.1
import masterArc001   from "../imports/MASTER.png";           // CRAFT v1.0 — approved MASTER-005
import humanRef001    from "../imports/image_1785173326221_mqd4fi.png"; // ARTISAN-001 CHARACTER LOCK
import humanAct001    from "../imports/image_1785428218359_2nzr1a.png"; // MASTER-006 HERO HUMAN
import enamelCra001   from "../imports/ENAMEL-CRA-001.png";             // ENAMEL-CRA-001
import engravingCra001 from "../imports/ENGRAVING-CRA-001.png";         // ENGRAVING-CRA-001
import bespokeM001     from "../imports/image_1785511697495_4bbb6k.png"; // MASTER-010 HERO COLLECTOR
import bespokeCol001   from "../imports/BESPOKE-COL-001.png";           // BESPOKE-COL-001 production asset
import bespokeCra001   from "../imports/BESPOKE-CRA-001.png";           // MASTER-011 THE BESPOKE SKETCH
import creationYt001   from "../imports/CREATION-YT-001.png";           // CREATION-YT-001 YELLOW TIGER
import guillocheCra001 from "../imports/GUILLOCHE-CRA-001.png";         // GUILLOCHE-CRA-001

// ─── Types ────────────────────────────────────────────────────────────────────

type Grade = "A+" | "A" | "B" | "C" | "—";

interface ContinuityParam {
  id: string;
  label: string;
  description: string;
  grades: { house: Grade; salon: Grade; library: Grade; atelier: Grade };
  notes: string;
}

// ─── Architectural Continuity Data ───────────────────────────────────────────

const CONTINUITY_PARAMS: ContinuityParam[] = [
  {
    id: "01",
    label: "ARCHITECTURE",
    description: "Один ли это Дом?",
    grades: { house: "A", salon: "A", library: "A", atelier: "B" },
    notes: "ATELIER: голая штукатурка вместо деревянных панелей — архитектурный язык SALON и LIBRARY не продолжен.",
  },
  {
    id: "02",
    label: "MATERIALS",
    description: "Совпадают ли камень, дерево, металл?",
    grades: { house: "A", salon: "A", library: "B", atelier: "B" },
    notes: "Дерево в пределах одного семейства (дуб→орех→красное дерево). ATELIER: более светлая порода, нет панельной отделки.",
  },
  {
    id: "03",
    label: "LIGHT",
    description: "Одинаково ли ведёт себя дневной свет?",
    grades: { house: "A", salon: "B", library: "B", atelier: "C" },
    notes: "ATELIER ⚠ Критично: настольная лампа доминирует над оконным светом. В HOUSE/SALON/LIBRARY дневной свет ведёт — лампа поддерживает. В ATELIER наоборот.",
  },
  {
    id: "04",
    label: "COLOUR",
    description: "Одинакова ли цветовая температура?",
    grades: { house: "A", salon: "B", library: "B", atelier: "C" },
    notes: "ATELIER ⚠ Критично: лампа создаёт очень тёплый янтарный оттенок (~2800K). Остальные пространства — нейтральный или умеренно тёплый дневной свет (~4500–5000K).",
  },
  {
    id: "05",
    label: "WINDOWS",
    description: "Есть ли единая логика окон?",
    grades: { house: "A", salon: "A", library: "A", atelier: "A" },
    notes: "Сильнейший элемент единства. Все четыре пространства: французские окна, тёмная деревянная рама, много переплётов, сад за стеклом.",
  },
  {
    id: "06",
    label: "DOORS",
    description: "Одинаковы ли пропорции дверей?",
    grades: { house: "A", salon: "—", library: "—", atelier: "—" },
    notes: "Двери видны только в HOUSE. Деревянные рамы окон во всех остальных пространствах соответствуют дверному языку HOUSE.",
  },
  {
    id: "07",
    label: "FLOORING",
    description: "Один ли тип пола?",
    grades: { house: "A", salon: "A", library: "A", atelier: "A" },
    notes: "Переход камень (вход) → паркет ёлочка (приватные комнаты) — архитектурно корректен. Паркет идентичен в SALON, LIBRARY, ATELIER.",
  },
  {
    id: "08",
    label: "FURNITURE",
    description: "Один ли язык мебели?",
    grades: { house: "—", salon: "A", library: "A", atelier: "A" },
    notes: "Тёмное дерево + кожа через SALON и LIBRARY. Простой деревянный стул в ATELIER — оправдан функционально, не нарушает мир.",
  },
  {
    id: "09",
    label: "CAMERA",
    description: "Одинаковая ли фотографическая реальность?",
    grades: { house: "A", salon: "A", library: "A", atelier: "A" },
    notes: "Одинаковое качество рендера, близкие фокусные расстояния, единый редакционный стиль. Нет артефактов или сдвига стиля.",
  },
  {
    id: "10",
    label: "ATMOSPHERE",
    description: "Ощущается ли единая эмоциональная среда?",
    grades: { house: "A", salon: "A", library: "A", atelier: "A" },
    notes: "Нарратив: порог → разговор → знание → создание. Каждое пространство держит свой характер и при этом — один мир.",
  },
];

// ─── Per-image verdict ────────────────────────────────────────────────────────

const IMAGE_VERDICTS = [
  {
    slot: "MILLIN_HOUSE_ENTRANCE_001",
    label: "HOUSE",
    file: "HOUSE-ARC-001.png",
    src: houseArc001,
    verdict: "A" as Grade,
    action: "KEEP",
    color: "#4ADE80",
    summary: "Эталон. Известняк, дуб, прохладный дневной свет. Держит весь набор.",
    issues: [] as string[],
  },
  {
    slot: "MILLIN_HOUSE_PRIVATE_SALON_001",
    label: "SALON",
    file: "SALON-ARC-001.png",
    src: salonArc001,
    verdict: "A" as Grade,
    action: "KEEP",
    color: "#4ADE80",
    summary: "Сильно. Тёплое дерево, кожа, боковой свет. Температурный сдвиг оправдан приватным характером пространства.",
    issues: [] as string[],
  },
  {
    slot: "MILLIN_HOUSE_LIBRARY_001",
    label: "LIBRARY",
    file: "LIBRARY-ARC-001.png",
    src: libraryArc001,
    verdict: "B" as Grade,
    action: "ACCEPTABLE",
    color: "#F59E0B",
    summary: "Хорошо. Зелёная лампа вносит лёгкую чужеродную ноту, но не разрывает мир.",
    issues: ["Зелёная лампа создаёт небольшой цветовой диссонанс — нейтрализуется CSS-фильтром"],
  },
  {
    slot: "MILLIN_ATELIER_WORKBENCH_001",
    label: "ATELIER",
    file: "ATELIER-ARC-002.png",
    src: atelierArc002,
    verdict: "A" as Grade,
    action: "APPROVED · v1.1",
    color: "#4ADE80",
    summary: "ARC-002 одобрен. Оба критичных разрыва устранены. Деревянные панели, оконный свет ведёт.",
    issues: [],
    previousSrc: atelierArc001,
    previousVerdict: "C" as Grade,
    previousFile: "ATELIER-ARC-001.png",
  },
] as Array<{
  slot: string; label: string; file: string; src: string;
  verdict: Grade; action: string; color: string; summary: string; issues: string[];
  previousSrc?: string; previousVerdict?: Grade; previousFile?: string;
}>;

// ─── Grade components ─────────────────────────────────────────────────────────

const GRADE_STYLES: Record<Grade, string> = {
  "A+": "text-[#A78BFA] border-[#A78BFA]/30 bg-[#A78BFA]/5",
  A: "text-[#4ADE80] border-[#4ADE80]/30 bg-[#4ADE80]/5",
  B: "text-[#F59E0B] border-[#F59E0B]/30 bg-[#F59E0B]/5",
  C: "text-[#F87171] border-[#F87171]/30 bg-[#F87171]/5",
  "—": "text-[#F4F1EA]/18 border-[#F4F1EA]/10 bg-transparent",
};

function GradeCell({ grade }: { grade: Grade }) {
  return (
    <span className={`inline-flex items-center justify-center w-7 h-7 font-mono text-[11px] border ${GRADE_STYLES[grade]}`}>
      {grade}
    </span>
  );
}

function StatusBadge({ status }: { status: AssetStatus }) {
  return status === "MILLIN_ORIGINAL" ? (
    <span className="inline-flex items-center gap-1.5 font-mono text-[9px] tracking-[0.15em] uppercase text-[#4ADE80] border border-[#4ADE80]/30 px-2 py-0.5">
      <span className="w-1.5 h-1.5 rounded-full bg-[#4ADE80] inline-block" />
      MILLIN ORIGINAL
    </span>
  ) : (
    <span className="inline-flex items-center gap-1.5 font-mono text-[9px] tracking-[0.15em] uppercase text-[#9A8968] border border-[#9A8968]/30 px-2 py-0.5">
      <span className="w-1.5 h-1.5 rounded-full bg-[#9A8968]/60 inline-block" />
      PLACEHOLDER
    </span>
  );
}

// ─── Continuity Review block ─────────────────────────────────────────────────

function ContinuityReview() {
  const columns = ["HOUSE", "SALON", "LIBRARY", "ATELIER"];
  const verdicts = { house: "A", salon: "A", library: "B", atelier: "A" } as Record<string, Grade>;
  const verdictColors: Record<Grade, string> = {
    A: "#4ADE80", B: "#F59E0B", C: "#F87171", "—": "#F4F1EA",
  };

  return (
    <section className="mb-20">

      {/* Section header */}
      <div className="flex items-baseline justify-between mb-8 border-b border-[#F4F1EA]/8 pb-5">
        <div>
          <p className="font-mono text-[9px] tracking-[0.35em] uppercase text-[#9A8968] mb-2">
            ARCHITECTURAL CONTINUITY CHECK · v1.0
          </p>
          <h2 className="font-sans text-[20px] text-[#F4F1EA]/80 font-light tracking-wide">
            Один ли это Дом?
          </h2>
        </div>
        <div className="flex items-center gap-3">
          {(["A", "B", "C"] as Grade[]).map(g => (
            <div key={g} className="flex items-center gap-2">
              <GradeCell grade={g} />
              <span className="font-mono text-[8px] tracking-widest uppercase" style={{ color: verdictColors[g] }}>
                {g === "A" ? "PERFECT" : g === "B" ? "MINOR ADJ" : "REGEN"}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Four image previews with verdicts */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-2 mb-10">
        {IMAGE_VERDICTS.map((img) => (
          <div key={img.slot} className="flex flex-col border border-[#F4F1EA]/8">
            <div className="relative overflow-hidden" style={{ aspectRatio: "4/3" }}>
              <img
                src={img.src}
                alt={img.slot}
                className="w-full h-full object-cover"
                style={{ filter: "brightness(0.82) contrast(0.97) saturate(0.88)" }}
              />
              {/* Verdict badge */}
              <div className="absolute top-3 right-3">
                <span
                  className="font-mono text-[13px] w-8 h-8 flex items-center justify-center border"
                  style={{
                    color: img.color,
                    borderColor: `${img.color}44`,
                    backgroundColor: `${img.color}12`,
                  }}
                >
                  {img.verdict}
                </span>
              </div>
              {/* Action */}
              <div className="absolute bottom-0 left-0 right-0 p-3 bg-gradient-to-t from-[#0A0A08]/90 via-[#0A0A08]/40 to-transparent">
                <p className="font-mono text-[8px] tracking-[0.25em] uppercase mb-0.5" style={{ color: img.color }}>
                  {img.action}
                </p>
                <p className="font-mono text-[10px] text-[#F4F1EA]/70">{img.label}</p>
              </div>
            </div>
            {/* Issues */}
            <div className="p-3 flex-1 bg-[#0D0D0B]">
              <p className="font-sans text-[9px] text-[#F4F1EA]/35 leading-relaxed">
                {img.summary}
              </p>
              {img.issues.length > 0 && (
                <ul className="mt-2 space-y-1">
                  {img.issues.map((issue, i) => (
                    <li key={i} className="flex gap-1.5">
                      <span className="text-[#F87171]/60 text-[9px] flex-shrink-0 mt-0.5">⚠</span>
                      <span className="font-sans text-[9px] text-[#F87171]/60 leading-relaxed">{issue}</span>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* 10-parameter table */}
      <div className="overflow-x-auto">
        <table className="w-full border-collapse">
          <thead>
            <tr className="border-b border-[#F4F1EA]/10">
              <th className="font-mono text-[8px] tracking-widest uppercase text-[#F4F1EA]/25 text-left py-3 pr-6 w-6">#</th>
              <th className="font-mono text-[8px] tracking-widest uppercase text-[#F4F1EA]/25 text-left py-3 pr-10 w-36">ПАРАМЕТР</th>
              <th className="font-mono text-[8px] tracking-widest uppercase text-[#F4F1EA]/25 text-left py-3 pr-10">ЧТО ПРОВЕРЯЕМ</th>
              {columns.map(col => (
                <th key={col} className="font-mono text-[8px] tracking-widest uppercase text-[#F4F1EA]/25 text-center py-3 px-4 w-20">
                  {col}
                </th>
              ))}
              <th className="font-mono text-[8px] tracking-widest uppercase text-[#F4F1EA]/25 text-left py-3 pl-6">NOTES</th>
            </tr>
          </thead>
          <tbody>
            {CONTINUITY_PARAMS.map((param, i) => {
              const rowGrades = [param.grades.house, param.grades.salon, param.grades.library, param.grades.atelier];
              const hasC = rowGrades.includes("C");
              return (
                <tr
                  key={param.id}
                  className={`border-b border-[#F4F1EA]/5 ${hasC ? "bg-[#F87171]/3" : i % 2 === 0 ? "bg-transparent" : "bg-[#F4F1EA]/2"}`}
                >
                  <td className="font-mono text-[9px] text-[#F4F1EA]/18 py-4 pr-6 align-top">{param.id}</td>
                  <td className="font-mono text-[10px] text-[#F4F1EA]/65 py-4 pr-10 align-top tracking-wider">
                    {param.label}
                  </td>
                  <td className="font-sans text-[10px] text-[#F4F1EA]/35 py-4 pr-10 align-top leading-relaxed">
                    {param.description}
                  </td>
                  <td className="py-4 px-4 text-center align-top"><GradeCell grade={param.grades.house} /></td>
                  <td className="py-4 px-4 text-center align-top"><GradeCell grade={param.grades.salon} /></td>
                  <td className="py-4 px-4 text-center align-top"><GradeCell grade={param.grades.library} /></td>
                  <td className="py-4 px-4 text-center align-top"><GradeCell grade={param.grades.atelier} /></td>
                  <td className="font-sans text-[9px] text-[#F4F1EA]/28 py-4 pl-6 align-top leading-relaxed max-w-xs">
                    {param.notes}
                  </td>
                </tr>
              );
            })}

            {/* Verdict row */}
            <tr className="border-t-2 border-[#F4F1EA]/14">
              <td colSpan={3} className="font-mono text-[9px] tracking-[0.25em] uppercase text-[#F4F1EA]/35 py-5 pr-10">
                VERDICT
              </td>
              {(["house", "salon", "library", "atelier"] as const).map((key) => (
                <td key={key} className="py-5 px-4 text-center">
                  <GradeCell grade={verdicts[key] as Grade} />
                </td>
              ))}
              <td className="font-sans text-[9px] text-[#F4F1EA]/22 py-5 pl-6 leading-relaxed">
                HOUSE, SALON → продолжить. LIBRARY → допустимо. ATELIER → регенерация обязательна.
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* ATELIER v1.0 → v1.1 comparison */}
      <div className="mt-8 border border-[#4ADE80]/20 bg-[#4ADE80]/3 p-6">
        <div className="flex items-center gap-3 mb-5">
          <span className="font-mono text-[10px] tracking-widest uppercase text-[#4ADE80]">
            ATELIER · APPROVED — ARC-002 (v1.1)
          </span>
          <span className="font-mono text-[9px] text-[#4ADE80]/40">C → A</span>
        </div>

        {/* Side-by-side */}
        <div className="grid grid-cols-2 gap-3 mb-5">
          {/* v1.0 — superseded */}
          <div className="flex flex-col">
            <div className="relative overflow-hidden mb-2" style={{ aspectRatio: "4/3" }}>
              <img
                src={atelierArc001}
                alt="ATELIER-ARC-001"
                className="w-full h-full object-cover"
                style={{ filter: "brightness(0.65) saturate(0.7)" }}
              />
              <div className="absolute inset-0 border-2 border-[#F87171]/30" />
              <div className="absolute top-2 left-2">
                <span className="font-mono text-[9px] bg-[#F87171]/20 border border-[#F87171]/40 text-[#F87171] px-2 py-0.5">
                  C · SUPERSEDED
                </span>
              </div>
            </div>
            <p className="font-mono text-[9px] text-[#F4F1EA]/25">ATELIER-ARC-001.png</p>
            <div className="mt-2 space-y-1">
              <p className="font-sans text-[9px] text-[#F87171]/55 flex gap-1.5">
                <span>⚠</span> Голая штукатурка — другой материал
              </p>
              <p className="font-sans text-[9px] text-[#F87171]/55 flex gap-1.5">
                <span>⚠</span> Лампа доминирует над окном
              </p>
            </div>
          </div>

          {/* v1.1 — approved */}
          <div className="flex flex-col">
            <div className="relative overflow-hidden mb-2" style={{ aspectRatio: "4/3" }}>
              <img
                src={atelierArc002}
                alt="ATELIER-ARC-002"
                className="w-full h-full object-cover"
                style={{ filter: "brightness(0.88) contrast(0.97) saturate(0.88)" }}
              />
              <div className="absolute inset-0 border-2 border-[#4ADE80]/30" />
              <div className="absolute top-2 left-2">
                <span className="font-mono text-[9px] bg-[#4ADE80]/15 border border-[#4ADE80]/40 text-[#4ADE80] px-2 py-0.5">
                  A · APPROVED
                </span>
              </div>
            </div>
            <p className="font-mono text-[9px] text-[#F4F1EA]/25">ATELIER-ARC-002.png</p>
            <div className="mt-2 space-y-1">
              <p className="font-sans text-[9px] text-[#4ADE80]/60 flex gap-1.5">
                <span>✓</span> Деревянные панели с молдингами — как в SALON
              </p>
              <p className="font-sans text-[9px] text-[#4ADE80]/60 flex gap-1.5">
                <span>✓</span> Оконный свет ведёт — лампа дополняет
              </p>
              <p className="font-sans text-[9px] text-[#4ADE80]/60 flex gap-1.5">
                <span>✓</span> Дверь слева — язык HOUSE confirmed
              </p>
              <p className="font-sans text-[9px] text-[#F59E0B]/50 flex gap-1.5">
                <span>~</span> Пол — каменная плитка (не паркет). Допустимо.
              </p>
            </div>
          </div>
        </div>

        {/* Per-parameter delta */}
        <div className="border-t border-[#4ADE80]/10 pt-4 grid grid-cols-5 gap-2">
          {[
            { param: "ARCH", v1: "B", v2: "A" },
            { param: "MATERIALS", v1: "B", v2: "A" },
            { param: "LIGHT", v1: "C", v2: "A" },
            { param: "COLOUR", v1: "C", v2: "A" },
            { param: "FLOOR", v1: "A", v2: "B" },
          ].map(({ param, v1, v2 }) => (
            <div key={param} className="text-center">
              <p className="font-mono text-[7px] tracking-widest uppercase text-[#F4F1EA]/20 mb-2">{param}</p>
              <div className="flex items-center justify-center gap-1.5">
                <GradeCell grade={v1 as Grade} />
                <span className="text-[#F4F1EA]/18 text-[8px]">→</span>
                <GradeCell grade={v2 as Grade} />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* All-clear */}
      <div className="mt-4 border border-[#4ADE80]/20 bg-[#4ADE80]/4 p-5">
        <div className="flex items-center justify-between">
          <p className="font-sans text-[10px] text-[#4ADE80]/70 leading-relaxed">
            <strong className="text-[#4ADE80]/90">Все четыре пространства — A или B.</strong> Архитектурный набор одобрен. Можно переходить к следующему этапу.
          </p>
          <span className="font-mono text-[9px] tracking-widest uppercase text-[#4ADE80]/40 ml-6 flex-shrink-0">
            ARCHITECTURE v1.0 · COMPLETE
          </span>
        </div>
      </div>
    </section>
  );
}

// ─── MASTER-005 Craft Continuity Check ───────────────────────────────────────

const CRAFT_PARAMS: Array<{ id: string; label: string; description: string; grade: Grade; note: string }> = [
  { id: "01", label: "SAME ATELIER",     description: "Одно и то же пространство Ателье?",       grade: "A", note: "Тёмный орех, панели, молдинги, пропорции — идентичны ATELIER-ARC-002." },
  { id: "02", label: "SAME WINDOW",      description: "Та же французская дверь?",                grade: "A", note: "Французская дверь, деревянная рама, множество переплётов — точное совпадение." },
  { id: "03", label: "SAME GARDEN",      description: "Тот же формальный сад за стеклом?",       grade: "A", note: "Стриженные живые изгороди, французский регулярный сад — идентичен." },
  { id: "04", label: "SAME WALL PANELS", description: "Те же деревянные панели с молдингами?",   grade: "A", note: "Тёмный орех, поднятые филёнки — точное совпадение с SALON и ATELIER." },
  { id: "05", label: "SAME MOULDINGS",   description: "Те же молдинги?",                          grade: "A", note: "Профиль молдингов идентичен — архитектурный язык Дома сохранён." },
  { id: "06", label: "SAME LIMESTONE",   description: "Тот же каменный пол?",                    grade: "A", note: "Светлая известняковая плитка видна — as in ARC-002." },
  { id: "07", label: "SAME DAYLIGHT",    description: "Тот же дневной свет из окна?",            grade: "A", note: "Окно — главный источник. Малая латунная лампа — дополнение. Correct." },
  { id: "08", label: "SAME COLOUR TEMP", description: "Та же цветовая температура?",             grade: "A", note: "Нейтрально-прохладный дневной свет ~4500K. Лампа добавляет тепло без доминирования." },
  { id: "09", label: "WORKBENCH AUTH.",  description: "Аутентичность верстака?",                 grade: "A", note: "Тёмный ореховый верстак с ящиком, правильная компоновка инструментов." },
  { id: "10", label: "TOOL AUTH.",       description: "Аутентичность инструментов?",             grade: "A", note: "Пинцет, отвёртки, деревянный лоток, ролл с инструментами, циферблат — watchmaker-correct." },
  { id: "11", label: "HUMAN TRACE",      description: "След человека?",                          grade: "A", note: "Блокнот со sketch циферблата, карандаш — человек только вышел." },
  { id: "12", label: "NO PRODUCT FOCUS", description: "Нет фокуса на готовом продукте?",         grade: "A", note: "Циферблат — рабочий элемент, не hero-shot готового изделия. Correct." },
  { id: "13", label: "PHOTO CONTINUITY", description: "Фотографическая непрерывность?",          grade: "A", note: "Идентичный render-стиль, угол съёмки, глубина резкости — full match." },
];

function CraftContinuityCheck() {
  return (
    <section className="mb-20">

      {/* Section header */}
      <div className="flex items-baseline justify-between mb-8 border-b border-[#F4F1EA]/8 pb-5">
        <div>
          <p className="font-mono text-[9px] tracking-[0.35em] uppercase text-[#9A8968] mb-2">
            MASTER-005 · CRAFT CONTINUITY CHECK · v1.0
          </p>
          <h2 className="font-sans text-[20px] text-[#F4F1EA]/80 font-light tracking-wide">
            Мастерское пространство
          </h2>
        </div>
        <div className="flex items-center gap-3">
          <span className="font-mono text-[9px] tracking-[0.2em] uppercase text-[#F4F1EA]/22">13 PARAMETERS</span>
          <span className="w-px h-4 bg-[#F4F1EA]/10" />
          <div className="flex items-center gap-2">
            <GradeCell grade="A" />
            <span className="font-mono text-[8px] tracking-widest uppercase text-[#4ADE80]/70">ALL CLEAR</span>
          </div>
        </div>
      </div>

      {/* Image + summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
        {/* Image */}
        <div className="md:col-span-1">
          <div className="relative overflow-hidden border border-[#4ADE80]/20" style={{ aspectRatio: "1/1" }}>
            <img
              src={masterArc001}
              alt="MILLIN_CRAFT_MASTER_001"
              className="w-full h-full object-cover"
              style={{ filter: "brightness(0.88) contrast(0.97) saturate(0.88)" }}
            />
            {/* Grade badge */}
            <div className="absolute top-3 right-3">
              <span className="font-mono text-[13px] w-8 h-8 flex items-center justify-center border text-[#4ADE80] border-[#4ADE80]/40 bg-[#4ADE80]/12">
                A
              </span>
            </div>
            {/* Bottom label */}
            <div className="absolute bottom-0 left-0 right-0 p-3 bg-gradient-to-t from-[#0A0A08]/90 via-[#0A0A08]/40 to-transparent">
              <p className="font-mono text-[8px] tracking-[0.25em] uppercase text-[#4ADE80] mb-0.5">KEEP · APPROVED</p>
              <p className="font-mono text-[10px] text-[#F4F1EA]/70">MASTER.png</p>
            </div>
          </div>
          {/* Slot info */}
          <div className="mt-3 border border-[#F4F1EA]/8 p-3 bg-[#0D0D0B]">
            <p className="font-mono text-[8px] tracking-widest uppercase text-[#9A8968]/60 mb-1.5">SLOT</p>
            <p className="font-mono text-[10px] text-[#F4F1EA]/65 mb-2">MILLIN_CRAFT_MASTER_001</p>
            <p className="font-sans text-[9px] text-[#F4F1EA]/30 leading-relaxed mb-2">
              Craft workbench — walnut panels, French window, precision tools, watch sketch
            </p>
            <span className="inline-flex items-center gap-1.5 font-mono text-[9px] tracking-[0.15em] uppercase text-[#4ADE80] border border-[#4ADE80]/30 px-2 py-0.5">
              <span className="w-1.5 h-1.5 rounded-full bg-[#4ADE80] inline-block" />
              MILLIN ORIGINAL
            </span>
          </div>
        </div>

        {/* Reference comparison */}
        <div className="md:col-span-2 flex flex-col">
          <p className="font-mono text-[8px] tracking-[0.28em] uppercase text-[#F4F1EA]/22 mb-3">
            REFERENCE · ATELIER-ARC-002 (APPROVED)
          </p>
          <div className="relative overflow-hidden flex-1 min-h-[200px]">
            <img
              src={atelierArc002}
              alt="ATELIER-ARC-002 reference"
              className="w-full h-full object-cover"
              style={{ filter: "brightness(0.82) contrast(0.97) saturate(0.85)" }}
            />
            <div className="absolute inset-0 border border-[#F4F1EA]/10" />
            <div className="absolute top-3 left-3">
              <span className="font-mono text-[8px] bg-[#F4F1EA]/8 border border-[#F4F1EA]/20 text-[#F4F1EA]/45 px-2 py-0.5 tracking-widest uppercase">
                REF · ARC v1.1
              </span>
            </div>
          </div>
          <p className="font-sans text-[9px] text-[#F4F1EA]/25 leading-relaxed mt-3">
            MASTER.png был проверен по всем 13 параметрам относительно одобренного ATELIER-ARC-002.
            Архитектурный язык, световая логика, материалы и фотографическая реальность — полное совпадение.
          </p>
        </div>
      </div>

      {/* 13-parameter table */}
      <div className="overflow-x-auto">
        <table className="w-full border-collapse">
          <thead>
            <tr className="border-b border-[#F4F1EA]/10">
              <th className="font-mono text-[8px] tracking-widest uppercase text-[#F4F1EA]/25 text-left py-3 pr-4 w-6">#</th>
              <th className="font-mono text-[8px] tracking-widest uppercase text-[#F4F1EA]/25 text-left py-3 pr-8 w-36">ПАРАМЕТР</th>
              <th className="font-mono text-[8px] tracking-widest uppercase text-[#F4F1EA]/25 text-left py-3 pr-8">ЧТО ПРОВЕРЯЕМ</th>
              <th className="font-mono text-[8px] tracking-widest uppercase text-[#F4F1EA]/25 text-center py-3 px-4 w-16">MASTER</th>
              <th className="font-mono text-[8px] tracking-widest uppercase text-[#F4F1EA]/25 text-left py-3 pl-6">NOTES</th>
            </tr>
          </thead>
          <tbody>
            {CRAFT_PARAMS.map((param, i) => (
              <tr
                key={param.id}
                className={`border-b border-[#F4F1EA]/5 ${i % 2 === 0 ? "bg-transparent" : "bg-[#F4F1EA]/2"}`}
              >
                <td className="font-mono text-[9px] text-[#F4F1EA]/18 py-3.5 pr-4 align-top">{param.id}</td>
                <td className="font-mono text-[10px] text-[#F4F1EA]/65 py-3.5 pr-8 align-top tracking-wider">
                  {param.label}
                </td>
                <td className="font-sans text-[10px] text-[#F4F1EA]/35 py-3.5 pr-8 align-top leading-relaxed">
                  {param.description}
                </td>
                <td className="py-3.5 px-4 text-center align-top">
                  <GradeCell grade={param.grade} />
                </td>
                <td className="font-sans text-[9px] text-[#F4F1EA]/28 py-3.5 pl-6 align-top leading-relaxed max-w-xs">
                  {param.note}
                </td>
              </tr>
            ))}

            {/* Verdict row */}
            <tr className="border-t-2 border-[#F4F1EA]/14">
              <td colSpan={3} className="font-mono text-[9px] tracking-[0.25em] uppercase text-[#F4F1EA]/35 py-5 pr-8">
                VERDICT
              </td>
              <td className="py-5 px-4 text-center">
                <GradeCell grade="A" />
              </td>
              <td className="font-sans text-[9px] text-[#F4F1EA]/28 py-5 pl-6 leading-relaxed">
                Все 13 параметров — A. Пространство идентично одобренному Ателье. Инструменты аутентичны. Человеческий след присутствует. Продукт не доминирует.
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* All-clear */}
      <div className="mt-4 border border-[#4ADE80]/20 bg-[#4ADE80]/4 p-5">
        <div className="flex items-center justify-between">
          <p className="font-sans text-[10px] text-[#4ADE80]/70 leading-relaxed">
            <strong className="text-[#4ADE80]/90">MASTER-005 · Все 13 параметров → A.</strong>{" "}
            Изображение добавлено в MILLIN Visual Library как{" "}
            <span className="font-mono text-[9px]">MILLIN_CRAFT_MASTER_001</span>.
          </p>
          <span className="font-mono text-[9px] tracking-widest uppercase text-[#4ADE80]/40 ml-6 flex-shrink-0">
            CRAFT v1.0 · KEEP
          </span>
        </div>
      </div>
    </section>
  );
}

// ─── ARTISAN-001 Character Lock ───────────────────────────────────────────────

const IDENTITY_LOCK_PARAMS: Array<{
  label: string;
  value: string;
  isPrimary?: boolean;
}> = [
  { label: "Face Structure",      value: "Angular jaw, high cheekbones, defined bone structure" },
  { label: "Age",                 value: "Mid-40s" },
  { label: "Hair",                value: "Dark brown / salt-and-pepper, short cut" },
  { label: "Facial Hair",         value: "Short trimmed beard, salt-and-pepper" },
  { label: "Eye Colour",          value: "Dark brown" },
  { label: "Skin Tone",           value: "Medium-warm" },
  { label: "Body Proportions",    value: "Lean, medium build, precise posture" },
  { label: "Hands",               value: "Strong, craftsman hands — recognisable knuckles" },
  { label: "Wardrobe",            value: "Dark charcoal / brown, artisanal, subdued" },
  { label: "Presence",            value: "Quiet, absorbed, unperforming — never performs for camera", isPrimary: true },
];

const SIX_VIEWS = [
  { id: "01", label: "FRONT PORTRAIT" },
  { id: "02", label: "THREE-QUARTER LEFT" },
  { id: "03", label: "THREE-QUARTER RIGHT" },
  { id: "04", label: "PROFILE" },
  { id: "05", label: "HANDS DETAIL" },
  { id: "06", label: "FULL FIGURE" },
];

function Artisan001CharacterLock() {
  return (
    <section className="mb-20">

      {/* Section header */}
      <div className="flex items-baseline justify-between mb-10 border-b border-[#F4F1EA]/8 pb-5">
        <div>
          <p className="font-mono text-[9px] tracking-[0.35em] uppercase text-[#9A8968] mb-2">
            CHARACTER LOCK · ARTISAN-001
          </p>
          <h2 className="font-sans text-[20px] text-[#F4F1EA]/80 font-light tracking-wide">
            The Master Artisan of House MILLIN
          </h2>
        </div>
        {/* LOCKED badge */}
        <div className="flex items-center gap-2 border border-[#4ADE80]/30 bg-[#4ADE80]/6 px-4 py-2">
          <span className="w-2 h-2 rounded-full bg-[#4ADE80] animate-pulse" />
          <span className="font-mono text-[10px] tracking-[0.3em] uppercase text-[#4ADE80]">
            ARTISAN-001 · LOCKED
          </span>
        </div>
      </div>

      {/* Main layout: reference sheet + table */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-10">

        {/* LEFT — reference sheet image */}
        <div className="flex flex-col">
          <p className="font-mono text-[8px] tracking-[0.32em] uppercase text-[#F4F1EA]/22 mb-3">
            REFERENCE SHEET · 6 VIEWS · DO NOT EDIT
          </p>
          <div className="relative border border-[#F4F1EA]/10 overflow-hidden flex-1">
            <img
              src={humanRef001}
              alt="ARTISAN-001 — 6-view character reference"
              className="w-full h-full object-cover object-top"
              style={{ filter: "brightness(0.92) contrast(0.98) saturate(0.85)" }}
            />
            <div className="absolute inset-0 border border-[#4ADE80]/10 pointer-events-none" />
            {/* Corner lock mark */}
            <div className="absolute top-3 right-3">
              <span className="font-mono text-[8px] bg-[#4ADE80]/15 border border-[#4ADE80]/40 text-[#4ADE80] px-2 py-0.5 tracking-widest uppercase">
                LOCK v1.0
              </span>
            </div>
          </div>

          {/* 6-view labels */}
          <div className="grid grid-cols-3 gap-px bg-[#F4F1EA]/5 mt-px">
            {SIX_VIEWS.map((view) => (
              <div key={view.id} className="bg-[#0D0D0B] px-3 py-2">
                <p className="font-mono text-[7px] tracking-widest uppercase text-[#F4F1EA]/18">{view.id}</p>
                <p className="font-mono text-[8px] tracking-wide text-[#F4F1EA]/40 mt-0.5">{view.label}</p>
              </div>
            ))}
          </div>
        </div>

        {/* RIGHT — identity lock table + criterion */}
        <div className="flex flex-col">

          {/* Identity lock table */}
          <p className="font-mono text-[8px] tracking-[0.32em] uppercase text-[#F4F1EA]/22 mb-3">
            IDENTITY LOCK
          </p>
          <div className="border border-[#F4F1EA]/8 flex-1">
            <table className="w-full border-collapse">
              <thead>
                <tr className="border-b border-[#F4F1EA]/8">
                  <th className="font-mono text-[7px] tracking-widest uppercase text-[#F4F1EA]/20 text-left py-2.5 px-4 w-32">PARAMETER</th>
                  <th className="font-mono text-[7px] tracking-widest uppercase text-[#F4F1EA]/20 text-left py-2.5 px-4">DOCUMENTED VALUE</th>
                  <th className="font-mono text-[7px] tracking-widest uppercase text-[#F4F1EA]/20 text-center py-2.5 px-4 w-16">STATUS</th>
                </tr>
              </thead>
              <tbody>
                {IDENTITY_LOCK_PARAMS.map((param, i) => (
                  <tr
                    key={param.label}
                    className={`border-b border-[#F4F1EA]/5 ${
                      param.isPrimary
                        ? "bg-[#9A8968]/6"
                        : i % 2 === 0 ? "bg-transparent" : "bg-[#F4F1EA]/2"
                    }`}
                  >
                    <td className={`font-mono text-[9px] py-3 px-4 align-top tracking-wider ${param.isPrimary ? "text-[#9A8968]/80" : "text-[#F4F1EA]/55"}`}>
                      {param.label}
                      {param.isPrimary && (
                        <span className="ml-2 font-mono text-[6px] tracking-widest uppercase text-[#9A8968]/50">
                          PRIMARY
                        </span>
                      )}
                    </td>
                    <td className={`font-sans text-[9px] py-3 px-4 align-top leading-relaxed ${param.isPrimary ? "text-[#F4F1EA]/50 italic" : "text-[#F4F1EA]/32"}`}>
                      {param.value}
                    </td>
                    <td className="py-3 px-4 text-center align-top">
                      <span className="font-mono text-[9px] text-[#4ADE80]/70">☑</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Locking criterion */}
          <div className="mt-4 border border-[#F4F1EA]/8 bg-[#0D0D0B] p-5">
            <p className="font-mono text-[7px] tracking-[0.32em] uppercase text-[#F4F1EA]/20 mb-3">
              КРИТЕРИЙ УТВЕРЖДЕНИЯ
            </p>
            <p className="font-sans text-[10px] text-[#F4F1EA]/35 leading-relaxed mb-3 italic">
              «Смогу ли я через 6 месяцев создать его снова в другом помещении, с другим ракурсом, в процессе гравировки — и зритель сразу поймёт, что это тот же человек?»
            </p>
            <div className="flex items-center gap-3 pt-3 border-t border-[#F4F1EA]/8">
              <span className="font-mono text-[9px] text-[#4ADE80]/55">Ответ:</span>
              <span className="font-sans text-[11px] text-[#4ADE80]/80 font-light tracking-wide">Да.</span>
              <span className="ml-auto font-mono text-[8px] tracking-[0.3em] uppercase text-[#4ADE80]/50">
                ARTISAN-001 — LOCKED
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Instruction strip */}
      <div className="border-t border-b border-[#F4F1EA]/6 py-4 flex flex-col md:flex-row items-start md:items-center justify-between gap-3">
        <p className="font-sans text-[9px] text-[#F4F1EA]/25 leading-relaxed max-w-2xl">
          This reference sheet is the single source of truth for all HUMAN category assets.
          Every image featuring the Master Artisan must be checked against these 6 views before approval.
          Slot:{" "}
          <span className="font-mono text-[8px] text-[#9A8968]/55">MILLIN_HUMAN_REFERENCE_001</span>
        </p>
        <span className="font-mono text-[8px] tracking-widest uppercase text-[#F4F1EA]/14 flex-shrink-0">
          DO NOT REPLACE WITHOUT HOUSE APPROVAL
        </span>
      </div>
    </section>
  );
}

// ─── ENAMEL-CRA-001 Craft Check ──────────────────────────────────────────────

const ENAMEL_PARAMS: Array<{ id: string; label: string; grade: Grade; note: string; isPrimary?: boolean }> = [
  { id: "01", label: "CRAFT TECHNIQUE",     grade: "A", note: "Enamel spatula applying pigment — correct grand feu technique gesture." },
  { id: "02", label: "KILN / FIRE",         grade: "A", note: "Working muffle kiln, orange firing glow — authentic enamel environment.", isPrimary: true },
  { id: "03", label: "HAND AUTHENTICITY",   grade: "A", note: "Experienced craftsman's hand — aged, precise — consistent with ARTISAN register." },
  { id: "04", label: "TOOL AUTHENTICITY",   grade: "A", note: "Fine enamel spatula, small pigment bowl, brush — watchmaker-correct toolset." },
  { id: "05", label: "SUBJECT MATTER",      grade: "A", note: "Miniature dial — animal scene in progress. Consistent with CREATION / YELLOW TIGER narrative." },
  { id: "06", label: "FIREPROOF SURFACE",   grade: "A", note: "Stone kiln shelf as work surface — correct. Authentic firing setup." },
  { id: "07", label: "WINDOW PRESENCE",     grade: "B", note: "Window visible top-left — different frame from Atelier. Acceptable: enamel room is a distinct House space." },
  { id: "08", label: "NO PRODUCT FOCUS",    grade: "A", note: "Work in progress — pigment being applied. Not a finished hero product." },
  { id: "09", label: "HUMAN TRACE",         grade: "A", note: "Hand is present and active. The act of craft is the subject." },
  { id: "10", label: "PHOTO CONTINUITY",    grade: "A", note: "Same editorial depth and render quality. Warm fire light creates a distinct but coherent register." },
];

function EnamelCraftCheck() {
  return (
    <section className="mb-20">

      {/* Section header */}
      <div className="flex items-baseline justify-between mb-8 border-b border-[#F4F1EA]/8 pb-5">
        <div>
          <p className="font-mono text-[9px] tracking-[0.35em] uppercase text-[#9A8968] mb-2">
            ENAMEL-CRA-001 · CRAFT CONTINUITY CHECK
          </p>
          <h2 className="font-sans text-[20px] text-[#F4F1EA]/80 font-light tracking-wide">
            The Fire — Grand Feu Enamel
          </h2>
        </div>
        <div className="flex items-center gap-2 border border-[#4ADE80]/30 bg-[#4ADE80]/6 px-4 py-2">
          <span className="w-2 h-2 rounded-full bg-[#4ADE80]" />
          <span className="font-mono text-[10px] tracking-[0.3em] uppercase text-[#4ADE80]">
            CRA v1.0 · APPROVED
          </span>
        </div>
      </div>

      {/* Image + parameters */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-px bg-[#F4F1EA]/5 mb-8">

        {/* Image — left */}
        <div className="md:col-span-2 bg-[#0A0A08] flex flex-col">
          <div className="relative overflow-hidden flex-1" style={{ minHeight: "300px" }}>
            <img
              src={enamelCra001}
              alt="ENAMEL-CRA-001"
              className="w-full h-full object-cover"
              style={{ filter: "brightness(0.90) contrast(1.02) saturate(0.88)" }}
            />
            {/* Grade badge */}
            <div className="absolute top-3 right-3">
              <span className="font-mono text-[13px] w-8 h-8 flex items-center justify-center border text-[#4ADE80] border-[#4ADE80]/40 bg-[#4ADE80]/12">
                A
              </span>
            </div>
            {/* Bottom */}
            <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-[#0A0A08]/95 via-[#0A0A08]/50 to-transparent">
              <p className="font-mono text-[8px] tracking-[0.25em] uppercase text-[#4ADE80] mb-1">KEEP · MILLIN ORIGINAL</p>
              <p className="font-mono text-[9px] text-[#F4F1EA]/50">MILLIN_CRAFT_ENAMEL_FIRE_001</p>
            </div>
          </div>

          {/* Context note */}
          <div className="p-5 bg-[#0D0D0B] flex flex-col gap-3">
            <div>
              <p className="font-mono text-[7px] tracking-[0.32em] uppercase text-[#F4F1EA]/20 mb-2">NOTE</p>
              <p className="font-sans text-[9px] text-[#F4F1EA]/30 leading-relaxed">
                The enamel firing room is a distinct space within the House — not the main Atelier.
                The kiln requires a dedicated environment. Architectural variance is expected and correct.
              </p>
            </div>
            <div className="border-t border-[#F4F1EA]/8 pt-3">
              <p className="font-mono text-[7px] tracking-[0.32em] uppercase text-[#F4F1EA]/20 mb-2">SUBJECT</p>
              <p className="font-sans text-[9px] text-[#F4F1EA]/30 leading-relaxed">
                Miniature dial visible — animal scene. Connects to CREATION / YELLOW TIGER narrative thread.
                The craftsman is applying the painting, not posing.
              </p>
            </div>
          </div>
        </div>

        {/* Parameters table — right */}
        <div className="md:col-span-3 bg-[#0A0A08] overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="border-b border-[#F4F1EA]/10">
                <th className="font-mono text-[8px] tracking-widest uppercase text-[#F4F1EA]/25 text-left py-3 pr-3 pl-5 w-6">#</th>
                <th className="font-mono text-[8px] tracking-widest uppercase text-[#F4F1EA]/25 text-left py-3 pr-6 w-36">PARAMETER</th>
                <th className="font-mono text-[8px] tracking-widest uppercase text-[#F4F1EA]/25 text-center py-3 px-3 w-14">GRADE</th>
                <th className="font-mono text-[8px] tracking-widest uppercase text-[#F4F1EA]/25 text-left py-3 pl-4 pr-5">READING</th>
              </tr>
            </thead>
            <tbody>
              {ENAMEL_PARAMS.map((param, i) => (
                <tr
                  key={param.id}
                  className={`border-b border-[#F4F1EA]/5 ${
                    param.isPrimary
                      ? "bg-[#9A8968]/5"
                      : i % 2 === 0 ? "bg-transparent" : "bg-[#F4F1EA]/2"
                  }`}
                >
                  <td className="font-mono text-[8px] text-[#F4F1EA]/18 py-3.5 pr-3 pl-5 align-top">{param.id}</td>
                  <td className={`font-mono text-[9px] py-3.5 pr-6 align-top tracking-wider ${param.isPrimary ? "text-[#9A8968]/75" : "text-[#F4F1EA]/55"}`}>
                    {param.label}
                    {param.isPrimary && (
                      <span className="block font-mono text-[6px] tracking-widest uppercase text-[#9A8968]/40 mt-0.5">KEY</span>
                    )}
                  </td>
                  <td className="py-3.5 px-3 text-center align-top">
                    <GradeCell grade={param.grade} />
                  </td>
                  <td className="font-sans text-[9px] py-3.5 pl-4 pr-5 align-top leading-relaxed text-[#F4F1EA]/28">
                    {param.note}
                  </td>
                </tr>
              ))}

              {/* Verdict */}
              <tr className="border-t-2 border-[#F4F1EA]/14">
                <td colSpan={2} className="font-mono text-[9px] tracking-[0.25em] uppercase text-[#F4F1EA]/35 py-5 pl-5">
                  VERDICT
                </td>
                <td className="py-5 px-3 text-center">
                  <GradeCell grade="A" />
                </td>
                <td className="font-sans text-[9px] text-[#F4F1EA]/28 py-5 pl-4 pr-5 leading-relaxed">
                  9 × A, 1 × B. The B is architectural — expected and contextually correct for a kiln space.
                  Craft authenticity, hand, tools, fire, and subject matter all read true.
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* All-clear */}
      <div className="border border-[#4ADE80]/20 bg-[#4ADE80]/4 p-5 flex items-center justify-between">
        <p className="font-sans text-[10px] text-[#4ADE80]/70 leading-relaxed">
          <strong className="text-[#4ADE80]/90">ENAMEL-CRA-001 approved.</strong>{" "}
          The grand feu enamel firing scene establishes the fire register — a new visual dimension within the MILLIN Craft World.
          Slot: <span className="font-mono text-[9px]">MILLIN_CRAFT_ENAMEL_FIRE_001</span>
        </p>
        <span className="font-mono text-[9px] tracking-widest uppercase text-[#4ADE80]/40 ml-6 flex-shrink-0">
          CRA v1.0 · APPROVED
        </span>
      </div>
    </section>
  );
}

// ─── ENGRAVING-CRA-001 Craft Check ───────────────────────────────────────────

const ENGRAVING_PARAMS: Array<{ id: string; label: string; grade: Grade; note: string; isPrimary?: boolean }> = [
  { id: "01", label: "CRAFT TECHNIQUE",   grade: "A", note: "Burin held at correct engraving angle. Gold shavings prove active cutting — not staged.", isPrimary: true },
  { id: "02", label: "HAND AUTHENTICITY", grade: "A", note: "Strong, defined knuckles. Precise three-finger grip. Consistent with ARTISAN-001 register." },
  { id: "03", label: "TOOL AUTHENTICITY", grade: "A", note: "Traditional burin with wooden handle — watchmaker-engraver correct toolset." },
  { id: "04", label: "SUBJECT MATTER",    grade: "A", note: "Gold watch case bezel — intricate scrollwork in progress. Directly MILLIN-relevant." },
  { id: "05", label: "ENGRAVING EVIDENCE",grade: "A", note: "Gold shavings scattered on bench — irrefutable evidence of the act, not a prop." },
  { id: "06", label: "BENCH / SURFACE",   grade: "B", note: "Engraver's bench pin — specialized tool, different from Atelier walnut bench. Technically correct for close engraving work. Acceptable." },
  { id: "07", label: "WINDOW PRESENCE",   grade: "A", note: "Multi-pane window in background bokeh — cool daylight consistent with House window language." },
  { id: "08", label: "NO PRODUCT FOCUS",  grade: "A", note: "Case is a work in progress. Engraving is incomplete — the work is the subject." },
  { id: "09", label: "HUMAN TRACE",       grade: "A", note: "Hand is present, active, committed to the material." },
  { id: "10", label: "PHOTO CONTINUITY",  grade: "A", note: "Shallow depth of field, same editorial quality. Warm metal + cool window — coherent with Craft World register." },
];

function EngravingCraftCheck() {
  return (
    <section className="mb-20">

      <div className="flex items-baseline justify-between mb-8 border-b border-[#F4F1EA]/8 pb-5">
        <div>
          <p className="font-mono text-[9px] tracking-[0.35em] uppercase text-[#9A8968] mb-2">
            ENGRAVING-CRA-001 · CRAFT CONTINUITY CHECK
          </p>
          <h2 className="font-sans text-[20px] text-[#F4F1EA]/80 font-light tracking-wide">
            The Burin — Hand Engraving
          </h2>
        </div>
        <div className="flex items-center gap-2 border border-[#4ADE80]/30 bg-[#4ADE80]/6 px-4 py-2">
          <span className="w-2 h-2 rounded-full bg-[#4ADE80]" />
          <span className="font-mono text-[10px] tracking-[0.3em] uppercase text-[#4ADE80]">
            CRA v1.0 · APPROVED
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-5 gap-px bg-[#F4F1EA]/5 mb-8">

        {/* Image */}
        <div className="md:col-span-2 bg-[#0A0A08] flex flex-col">
          <div className="relative overflow-hidden flex-1" style={{ minHeight: "300px" }}>
            <img
              src={engravingCra001}
              alt="ENGRAVING-CRA-001"
              className="w-full h-full object-cover"
              style={{ filter: "brightness(0.90) contrast(1.01) saturate(0.87)" }}
            />
            <div className="absolute top-3 right-3">
              <span className="font-mono text-[13px] w-8 h-8 flex items-center justify-center border text-[#4ADE80] border-[#4ADE80]/40 bg-[#4ADE80]/12">
                A
              </span>
            </div>
            <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-[#0A0A08]/95 via-[#0A0A08]/50 to-transparent">
              <p className="font-mono text-[8px] tracking-[0.25em] uppercase text-[#4ADE80] mb-1">KEEP · MILLIN ORIGINAL</p>
              <p className="font-mono text-[9px] text-[#F4F1EA]/50">MILLIN_CRAFT_ENGRAVING_001</p>
            </div>
          </div>
          <div className="p-5 bg-[#0D0D0B] flex flex-col gap-3">
            <div>
              <p className="font-mono text-[7px] tracking-[0.32em] uppercase text-[#F4F1EA]/20 mb-2">NOTE</p>
              <p className="font-sans text-[9px] text-[#F4F1EA]/30 leading-relaxed">
                The engraver's bench pin is a specialized workholding tool — not the main Atelier bench.
                Required for precise case engraving. The architectural context shifts to close-craft register.
                Window behind confirms House light logic.
              </p>
            </div>
            <div className="border-t border-[#F4F1EA]/8 pt-3">
              <p className="font-mono text-[7px] tracking-[0.32em] uppercase text-[#F4F1EA]/20 mb-2">SUBJECT</p>
              <p className="font-sans text-[9px] text-[#F4F1EA]/30 leading-relaxed">
                Gold watch case bezel — scrollwork engraving. The shavings are irrefutable:
                the craftsman is cutting, not posing.
              </p>
            </div>
          </div>
        </div>

        {/* Parameters */}
        <div className="md:col-span-3 bg-[#0A0A08] overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="border-b border-[#F4F1EA]/10">
                <th className="font-mono text-[8px] tracking-widest uppercase text-[#F4F1EA]/25 text-left py-3 pr-3 pl-5 w-6">#</th>
                <th className="font-mono text-[8px] tracking-widest uppercase text-[#F4F1EA]/25 text-left py-3 pr-6 w-36">PARAMETER</th>
                <th className="font-mono text-[8px] tracking-widest uppercase text-[#F4F1EA]/25 text-center py-3 px-3 w-14">GRADE</th>
                <th className="font-mono text-[8px] tracking-widest uppercase text-[#F4F1EA]/25 text-left py-3 pl-4 pr-5">READING</th>
              </tr>
            </thead>
            <tbody>
              {ENGRAVING_PARAMS.map((param, i) => (
                <tr
                  key={param.id}
                  className={`border-b border-[#F4F1EA]/5 ${
                    param.isPrimary ? "bg-[#9A8968]/5" : i % 2 === 0 ? "bg-transparent" : "bg-[#F4F1EA]/2"
                  }`}
                >
                  <td className="font-mono text-[8px] text-[#F4F1EA]/18 py-3.5 pr-3 pl-5 align-top">{param.id}</td>
                  <td className={`font-mono text-[9px] py-3.5 pr-6 align-top tracking-wider ${param.isPrimary ? "text-[#9A8968]/75" : "text-[#F4F1EA]/55"}`}>
                    {param.label}
                    {param.isPrimary && (
                      <span className="block font-mono text-[6px] tracking-widest uppercase text-[#9A8968]/40 mt-0.5">KEY</span>
                    )}
                  </td>
                  <td className="py-3.5 px-3 text-center align-top">
                    <GradeCell grade={param.grade} />
                  </td>
                  <td className="font-sans text-[9px] py-3.5 pl-4 pr-5 align-top leading-relaxed text-[#F4F1EA]/28">
                    {param.note}
                  </td>
                </tr>
              ))}
              <tr className="border-t-2 border-[#F4F1EA]/14">
                <td colSpan={2} className="font-mono text-[9px] tracking-[0.25em] uppercase text-[#F4F1EA]/35 py-5 pl-5">
                  VERDICT
                </td>
                <td className="py-5 px-3 text-center">
                  <GradeCell grade="A" />
                </td>
                <td className="font-sans text-[9px] text-[#F4F1EA]/28 py-5 pl-4 pr-5 leading-relaxed">
                  9 × A, 1 × B. The B is the bench pin — a technical necessity, not a continuity failure.
                  Craft gesture, hand, shavings, and subject all read as unambiguously true.
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <div className="border border-[#4ADE80]/20 bg-[#4ADE80]/4 p-5 flex items-center justify-between">
        <p className="font-sans text-[10px] text-[#4ADE80]/70 leading-relaxed">
          <strong className="text-[#4ADE80]/90">ENGRAVING-CRA-001 approved.</strong>{" "}
          The engraving scene establishes the burin register — metal being cut by hand, gold shavings as proof.
          Slot: <span className="font-mono text-[9px]">MILLIN_CRAFT_ENGRAVING_001</span>
        </p>
        <span className="font-mono text-[9px] tracking-widest uppercase text-[#4ADE80]/40 ml-6 flex-shrink-0">
          CRA v1.0 · APPROVED
        </span>
      </div>
    </section>
  );
}

// ─── Human Continuity Rule ────────────────────────────────────────────────────

const HUMAN_CONTINUITY_ATTRIBUTES = [
  { id: "01", label: "PERSON",    rule: "Same person. One individual — the Master Artisan of MILLIN." },
  { id: "02", label: "AGE",       rule: "Same age. No visible age variance across images." },
  { id: "03", label: "FACE",      rule: "Same facial structure. Bone structure, proportions, skin tone." },
  { id: "04", label: "HAIR",      rule: "Same hair. Colour, cut, texture — unchanged across all craft situations." },
  { id: "05", label: "BEARD",     rule: "Same beard or clean-shaven state. No variation between sessions." },
  { id: "06", label: "HANDS",     rule: "Same hands. Recognisable knuckles, skin, veins — the hands of a craftsman." },
  { id: "07", label: "CLOTHING",  rule: "Same clothing language. Consistent fabric, palette, tailoring register." },
  { id: "08", label: "PRESENCE",  rule: "Same quiet presence. No performance. No expression for camera. Absorbed in the work." },
];

const HUMAN_CONTINUITY_ALLOWED = [
  "Different lighting conditions and intensities",
  "Different camera distances — close detail to wide atelier",
  "Different craft moments — sketching, engraving, observing, assembling",
  "Different compositions within the Atelier",
];

function HumanContinuityRule() {
  return (
    <section className="mb-20">

      {/* Document header */}
      <div className="flex items-baseline justify-between mb-12 border-b border-[#F4F1EA]/8 pb-5">
        <div>
          <p className="font-mono text-[9px] tracking-[0.35em] uppercase text-[#9A8968] mb-2">
            PRODUCTION RULE · RULE-001
          </p>
          <h2 className="font-sans text-[20px] text-[#F4F1EA]/80 font-light tracking-wide">
            Human Continuity Rule
          </h2>
        </div>
        <span className="font-mono text-[9px] tracking-[0.2em] uppercase text-[#F4F1EA]/18 border border-[#F4F1EA]/10 px-3 py-1.5">
          MANDATORY
        </span>
      </div>

      {/* Main manifesto card */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-px bg-[#F4F1EA]/5 mb-12">

        {/* Left — rule statement */}
        <div className="md:col-span-3 bg-[#0A0A08] p-10 flex flex-col justify-between">
          <div>
            <p className="font-mono text-[9px] tracking-[0.35em] uppercase text-[#9A8968]/60 mb-8">
              THE RULE
            </p>
            <div className="space-y-5">
              {[
                "The Master Artisan must remain visually consistent",
                "across the entire MILLIN Craft World.",
              ].map((line, i) => (
                <p key={i} className="font-sans text-[17px] md:text-[19px] text-[#F4F1EA]/80 font-light leading-relaxed tracking-wide">
                  {line}
                </p>
              ))}
            </div>
          </div>

          {/* The eight same-lines — typeset as verse */}
          <div className="mt-12 space-y-2 border-l-2 border-[#9A8968]/25 pl-6">
            {["Same person.", "Same age.", "Same facial structure.", "Same hair.", "Same beard or clean-shaven state.", "Same hands.", "Same clothing language.", "Same quiet presence."].map((line, i) => (
              <p
                key={i}
                className="font-sans text-[13px] text-[#F4F1EA]/55 italic leading-snug tracking-wide"
              >
                {line}
              </p>
            ))}
          </div>
        </div>

        {/* Right — conclusion */}
        <div className="md:col-span-2 bg-[#0D0D0B] p-10 flex flex-col justify-between">
          <div>
            <p className="font-mono text-[9px] tracking-[0.35em] uppercase text-[#9A8968]/60 mb-8">
              THE INTENTION
            </p>
            <p className="font-sans text-[13px] text-[#F4F1EA]/45 leading-loose tracking-wide">
              The artisan may appear in different lighting,
              different camera distances,
              and different craft situations.
            </p>
            <p className="font-sans text-[13px] text-[#F4F1EA]/45 leading-loose tracking-wide mt-5">
              But the viewer must always feel:
            </p>
          </div>

          {/* The three conclusions */}
          <div className="mt-8 space-y-4 border border-[#9A8968]/20 p-6 bg-[#9A8968]/4">
            {[
              "This is the same Master.",
              "This is the same Atelier.",
              "This is the same House.",
            ].map((line, i) => (
              <p key={i} className="font-sans text-[15px] text-[#F4F1EA]/80 font-light tracking-wide leading-snug">
                {line}
              </p>
            ))}
          </div>
        </div>
      </div>

      {/* 8-attribute table */}
      <div className="mb-10">
        <p className="font-mono text-[8px] tracking-[0.32em] uppercase text-[#F4F1EA]/22 mb-5">
          CONTINUITY ATTRIBUTES — ALL MANDATORY
        </p>
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="border-b border-[#F4F1EA]/10">
                <th className="font-mono text-[8px] tracking-widest uppercase text-[#F4F1EA]/25 text-left py-3 pr-4 w-6">#</th>
                <th className="font-mono text-[8px] tracking-widest uppercase text-[#F4F1EA]/25 text-left py-3 pr-10 w-28">ATTRIBUTE</th>
                <th className="font-mono text-[8px] tracking-widest uppercase text-[#F4F1EA]/25 text-left py-3">PRODUCTION INSTRUCTION</th>
                <th className="font-mono text-[8px] tracking-widest uppercase text-[#F4F1EA]/25 text-center py-3 px-6 w-20">STATUS</th>
              </tr>
            </thead>
            <tbody>
              {HUMAN_CONTINUITY_ATTRIBUTES.map((attr, i) => (
                <tr
                  key={attr.id}
                  className={`border-b border-[#F4F1EA]/5 ${i % 2 === 0 ? "bg-transparent" : "bg-[#F4F1EA]/2"}`}
                >
                  <td className="font-mono text-[9px] text-[#F4F1EA]/18 py-4 pr-4 align-top">{attr.id}</td>
                  <td className="font-mono text-[10px] text-[#F4F1EA]/65 py-4 pr-10 align-top tracking-wider">
                    {attr.label}
                  </td>
                  <td className="font-sans text-[10px] text-[#F4F1EA]/38 py-4 align-top leading-relaxed">
                    {attr.rule}
                  </td>
                  <td className="py-4 px-6 text-center align-top">
                    <span className="font-mono text-[8px] tracking-widest uppercase text-[#F59E0B]/70 border border-[#F59E0B]/20 px-2 py-0.5">
                      PENDING
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Permitted variations */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-px bg-[#F4F1EA]/5">

        <div className="bg-[#0D0D0B] p-6">
          <p className="font-mono text-[8px] tracking-[0.32em] uppercase text-[#4ADE80]/50 mb-5">
            PERMITTED VARIATION
          </p>
          <ul className="space-y-3">
            {HUMAN_CONTINUITY_ALLOWED.map((item, i) => (
              <li key={i} className="flex gap-3 items-start">
                <span className="text-[#4ADE80]/50 text-[10px] flex-shrink-0 mt-0.5">✓</span>
                <span className="font-sans text-[10px] text-[#F4F1EA]/38 leading-relaxed">{item}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="bg-[#0D0D0B] p-6">
          <p className="font-mono text-[8px] tracking-[0.32em] uppercase text-[#F87171]/50 mb-5">
            NEVER PERMITTED
          </p>
          <ul className="space-y-3">
            {[
              "Different person presenting as the same artisan",
              "Visible age difference between sessions",
              "Different facial hair state (bearded vs clean-shaven)",
              "Stylistic costume change (formal vs casual)",
              "Two different hands in the same craft series",
            ].map((item, i) => (
              <li key={i} className="flex gap-3 items-start">
                <span className="text-[#F87171]/50 text-[10px] flex-shrink-0 mt-0.5">✗</span>
                <span className="font-sans text-[10px] text-[#F4F1EA]/38 leading-relaxed">{item}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Active brief note */}
      <div className="mt-4 border-l-2 border-[#9A8968]/30 pl-5 py-3">
        <p className="font-mono text-[8px] tracking-[0.28em] uppercase text-[#9A8968]/45 mb-2">
          BEFORE FIRST HUMAN SHOOT
        </p>
        <p className="font-sans text-[10px] text-[#F4F1EA]/28 leading-relaxed">
          Define the Master Artisan — one reference image approved by the House.
          All subsequent HUMAN category assets must be generated or photographed against that reference.
          The reference image will be stored as{" "}
          <span className="font-mono text-[9px] text-[#9A8968]/60">MILLIN_HUMAN_REFERENCE_001</span>.
        </p>
      </div>
    </section>
  );
}

// ─── Rule 002 — Human Reference Hierarchy ────────────────────────────────────

const HIERARCHY_LEVELS = [
  { id: "01", label: "Identity Continuity",      description: "Face, age, hair, beard, skin — the person is unmistakably the same." },
  { id: "02", label: "Presence Continuity",       description: "Quiet, absorbed, unperforming. The internal state is consistent." },
  { id: "03", label: "Hand Continuity",           description: "The craftsman's hands are recognisable across all distances and angles." },
  { id: "04", label: "Wardrobe Continuity",       description: "Dark, artisanal register. No stylistic deviation between sessions." },
  { id: "05", label: "Architectural Continuity",  description: "The Atelier is the same Atelier. Space, panels, window, garden." },
  { id: "06", label: "Craft Continuity",          description: "Tools, materials, and work gestures belong to the same craft world." },
  { id: "07", label: "Cinematic Composition",     description: "Angle, depth, framing — serve the character, never override it." },
];

const PERMITTED_CHANGES = [
  "The environment may change",
  "The camera may change",
  "The distance may change",
  "The lighting may change",
  "The craft activity may change",
];

const IMMUTABLE = [
  "THE SAME MASTER.",
  "THE SAME HANDS.",
  "THE SAME PRESENCE.",
];

function HumanReferenceHierarchy() {
  return (
    <section className="mb-20">

      {/* Section header */}
      <div className="flex items-baseline justify-between mb-10 border-b border-[#F4F1EA]/8 pb-5">
        <div>
          <p className="font-mono text-[9px] tracking-[0.35em] uppercase text-[#9A8968] mb-2">
            PRODUCTION RULE · RULE-002
          </p>
          <h2 className="font-sans text-[20px] text-[#F4F1EA]/80 font-light tracking-wide">
            Human Reference Hierarchy
          </h2>
        </div>
        <div className="flex items-center gap-3">
          <span className="font-mono text-[8px] tracking-widest uppercase text-[#F4F1EA]/18 border border-[#F4F1EA]/10 px-3 py-1.5">
            MANDATORY
          </span>
          <span className="font-mono text-[8px] tracking-widest uppercase text-[#F4F1EA]/18 border border-[#F4F1EA]/10 px-3 py-1.5">
            SUPERSEDES AESTHETICS
          </span>
        </div>
      </div>

      {/* Canonical reference strip */}
      <div className="border border-[#9A8968]/25 bg-[#9A8968]/5 px-6 py-4 mb-10 flex items-center justify-between">
        <div>
          <p className="font-mono text-[7px] tracking-[0.35em] uppercase text-[#9A8968]/55 mb-1">
            CANONICAL REFERENCE
          </p>
          <p className="font-mono text-[11px] text-[#9A8968]/90 tracking-widest">
            MILLIN_HUMAN_REFERENCE_001 · LOCK v1.0
          </p>
        </div>
        <p className="font-sans text-[10px] text-[#F4F1EA]/30 leading-relaxed max-w-sm text-right">
          The single canonical identity reference for ARTISAN-001. All HUMAN category assets are measured against it.
        </p>
      </div>

      {/* Main layout */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-px bg-[#F4F1EA]/5 mb-10">

        {/* LEFT — hierarchy table */}
        <div className="md:col-span-2 bg-[#0A0A08] p-8">
          <p className="font-mono text-[8px] tracking-[0.32em] uppercase text-[#F4F1EA]/22 mb-6">
            PRIORITY HIERARCHY — WHEN GENERATING A NEW HUMAN ASSET
          </p>
          <div className="space-y-px">
            {HIERARCHY_LEVELS.map((level, i) => {
              const isTop3 = i < 3;
              const isLast = i === HIERARCHY_LEVELS.length - 1;
              return (
                <div
                  key={level.id}
                  className={`flex gap-5 items-start p-4 ${
                    isTop3
                      ? "bg-[#F4F1EA]/4 border-l-2 border-[#9A8968]/40"
                      : "bg-[#F4F1EA]/2 border-l-2 border-[#F4F1EA]/8"
                  } ${isLast ? "border-l-2 border-[#F4F1EA]/6 opacity-55" : ""}`}
                >
                  {/* Priority number */}
                  <div className="flex-shrink-0 w-7 h-7 flex items-center justify-center border border-[#F4F1EA]/12">
                    <span className={`font-mono text-[11px] ${isTop3 ? "text-[#9A8968]/80" : "text-[#F4F1EA]/28"}`}>
                      {level.id}
                    </span>
                  </div>
                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <p className={`font-mono text-[10px] tracking-wider mb-1 ${isTop3 ? "text-[#F4F1EA]/75" : "text-[#F4F1EA]/45"}`}>
                      {level.label}
                    </p>
                    <p className={`font-sans text-[9px] leading-relaxed ${isTop3 ? "text-[#F4F1EA]/38" : "text-[#F4F1EA]/22"}`}>
                      {level.description}
                    </p>
                  </div>
                  {/* Top-3 mark */}
                  {isTop3 && (
                    <span className="flex-shrink-0 font-mono text-[7px] tracking-widest uppercase text-[#9A8968]/40 mt-1">
                      IMMUTABLE
                    </span>
                  )}
                </div>
              );
            })}
          </div>

          {/* The core principle */}
          <div className="mt-6 border-t border-[#F4F1EA]/8 pt-5">
            <p className="font-sans text-[11px] text-[#F4F1EA]/40 leading-loose italic">
              A new scene must never alter the identity of ARTISAN-001
              for the sake of improving composition, aesthetics or cinematic effect.
            </p>
          </div>
        </div>

        {/* RIGHT — what may change / what must not */}
        <div className="bg-[#0D0D0B] p-8 flex flex-col gap-8">

          {/* Permitted */}
          <div>
            <p className="font-mono text-[8px] tracking-[0.32em] uppercase text-[#4ADE80]/45 mb-4">
              MAY CHANGE
            </p>
            <ul className="space-y-3">
              {PERMITTED_CHANGES.map((item, i) => (
                <li key={i} className="flex gap-3 items-start">
                  <span className="text-[#4ADE80]/40 text-[10px] flex-shrink-0 mt-0.5">↕</span>
                  <span className="font-sans text-[10px] text-[#F4F1EA]/35 leading-relaxed">{item}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Divider */}
          <div className="border-t border-[#F4F1EA]/8" />

          {/* Immutable — the three axioms */}
          <div>
            <p className="font-mono text-[8px] tracking-[0.32em] uppercase text-[#F87171]/40 mb-5">
              MUST NOT CHANGE
            </p>
            <div className="space-y-4">
              {IMMUTABLE.map((line, i) => (
                <p
                  key={i}
                  className="font-sans text-[16px] text-[#F4F1EA]/70 font-light tracking-[0.08em] leading-snug"
                >
                  {line}
                </p>
              ))}
            </div>
          </div>

          {/* Divider */}
          <div className="border-t border-[#F4F1EA]/8 mt-auto" />

          {/* Rejection condition */}
          <div className="border border-[#F87171]/20 bg-[#F87171]/4 p-4">
            <p className="font-mono text-[7px] tracking-[0.3em] uppercase text-[#F87171]/50 mb-2">
              REJECTION CONDITION
            </p>
            <p className="font-sans text-[9px] text-[#F4F1EA]/35 leading-relaxed">
              If identity continuity cannot be maintained,
              the asset must not be approved as a{" "}
              <span className="font-mono text-[8px] text-[#9A8968]/55">MILLIN ORIGINAL</span>.
            </p>
          </div>
        </div>
      </div>

      {/* Decision flowchart — simplified */}
      <div className="border border-[#F4F1EA]/8 p-6">
        <p className="font-mono text-[8px] tracking-[0.32em] uppercase text-[#F4F1EA]/22 mb-5">
          APPROVAL DECISION — HUMAN ASSET CHECKLIST
        </p>
        <div className="flex flex-col md:flex-row items-stretch gap-px bg-[#F4F1EA]/5">
          {[
            { q: "Is the person the same?",     pass: "Proceed →",     fail: "Reject" },
            { q: "Is the presence the same?",   pass: "Proceed →",     fail: "Reject" },
            { q: "Are the hands the same?",     pass: "Proceed →",     fail: "Reject" },
            { q: "Is the wardrobe consistent?", pass: "Proceed →",     fail: "Flag" },
            { q: "Is the Atelier recognisable?", pass: "Proceed →",    fail: "Flag" },
            { q: "Does craft feel authentic?",  pass: "APPROVE →",     fail: "Flag" },
          ].map((step, i) => (
            <div key={i} className="flex-1 bg-[#0D0D0B] p-4 flex flex-col gap-3">
              <p className="font-mono text-[7px] tracking-widest uppercase text-[#F4F1EA]/18">{String(i + 1).padStart(2, "0")}</p>
              <p className="font-sans text-[9px] text-[#F4F1EA]/45 leading-relaxed flex-1">{step.q}</p>
              <div className="flex gap-2 mt-auto">
                <span className="font-mono text-[7px] tracking-widest text-[#4ADE80]/55">{step.pass}</span>
                <span className="font-mono text-[7px] tracking-widest text-[#F87171]/45 ml-auto">{step.fail}</span>
              </div>
            </div>
          ))}
          {/* Final verdict */}
          <div className="flex-shrink-0 bg-[#4ADE80]/6 border-l border-[#4ADE80]/20 p-4 flex flex-col justify-center items-center w-28">
            <span className="font-mono text-[7px] tracking-widest uppercase text-[#4ADE80]/50 mb-2 text-center">APPROVED</span>
            <span className="font-mono text-[9px] text-[#4ADE80]/70">MILLIN</span>
            <span className="font-mono text-[9px] text-[#4ADE80]/70">ORIGINAL</span>
          </div>
        </div>
      </div>
    </section>
  );
}

// ─── Rule 003 — Presence Over Portrait ───────────────────────────────────────

const THE_WAY_HE = [
  "the way he stands,",
  "the way he sits,",
  "the way he holds a tool,",
  "the way he concentrates,",
  "the way his hands move,",
  "the way he occupies the Atelier,",
  "the way he interacts with materials,",
  "the silence surrounding his work.",
];

const HISTORY_LINES = [
  "the sense that he has a history,",
  "a practice,",
  "and a relationship with the Atelier.",
];

function PresenceOverPortrait() {
  return (
    <section className="mb-20">

      {/* Section header */}
      <div className="flex items-baseline justify-between mb-12 border-b border-[#F4F1EA]/8 pb-5">
        <div>
          <p className="font-mono text-[9px] tracking-[0.35em] uppercase text-[#9A8968] mb-2">
            PRODUCTION RULE · RULE-003
          </p>
          <h2 className="font-sans text-[20px] text-[#F4F1EA]/80 font-light tracking-wide">
            Presence Over Portrait
          </h2>
        </div>
        <span className="font-mono text-[9px] tracking-[0.2em] uppercase text-[#F4F1EA]/18 border border-[#F4F1EA]/10 px-3 py-1.5">
          MANDATORY
        </span>
      </div>

      {/* Full-width manifesto layout */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-px bg-[#F4F1EA]/5 mb-px">

        {/* LEFT MARGIN — rule number as giant watermark */}
        <div className="hidden md:flex md:col-span-1 bg-[#0A0A08] items-end p-6 pb-8">
          <p
            className="font-mono text-[#F4F1EA]/5 leading-none select-none"
            style={{ fontSize: "72px", writingMode: "vertical-rl", transform: "rotate(180deg)" }}
          >
            003
          </p>
        </div>

        {/* CENTRE — the doctrine */}
        <div className="md:col-span-7 bg-[#0A0A08] px-8 md:px-12 py-12 flex flex-col gap-10">

          {/* Opening statement */}
          <div>
            <p className="font-sans text-[14px] text-[#F4F1EA]/45 leading-loose tracking-wide">
              The identity of the MILLIN Master Artisan
            </p>
            <p className="font-sans text-[14px] text-[#F4F1EA]/45 leading-loose tracking-wide">
              is not defined only by facial resemblance.
            </p>
          </div>

          {/* Bridge */}
          <div>
            <p className="font-sans text-[13px] text-[#F4F1EA]/30 leading-loose tracking-wide italic mb-5">
              His identity is defined by:
            </p>
            {/* The anaphora — typeset as verse */}
            <div className="border-l-2 border-[#9A8968]/30 pl-7 space-y-2.5">
              {THE_WAY_HE.map((line, i) => (
                <p
                  key={i}
                  className="font-sans leading-snug tracking-wide"
                  style={{
                    fontSize: "13px",
                    color: `rgba(244, 241, 234, ${0.55 - i * 0.018})`,
                    paddingLeft: `${i * 2}px`,
                  }}
                >
                  {line}
                </p>
              ))}
            </div>
          </div>

          {/* The two truths */}
          <div className="space-y-5 border-t border-[#F4F1EA]/8 pt-8">
            <p className="font-sans text-[15px] text-[#F4F1EA]/60 leading-relaxed tracking-wide">
              Facial similarity is necessary.
            </p>
            <p className="font-sans text-[16px] text-[#F4F1EA]/80 font-light leading-relaxed tracking-wide">
              Presence continuity is essential.
            </p>
          </div>

          {/* Warning line */}
          <div className="border-l-2 border-[#F87171]/25 pl-5">
            <p className="font-sans text-[12px] text-[#F4F1EA]/35 leading-loose tracking-wide">
              The character must never become
            </p>
            <p className="font-sans text-[12px] text-[#F4F1EA]/35 leading-loose tracking-wide">
              a recurring AI-generated face without a recognizable human presence.
            </p>
          </div>
        </div>

        {/* RIGHT — the person statements + history */}
        <div className="md:col-span-4 bg-[#0D0D0B] px-8 py-12 flex flex-col justify-between gap-12">

          {/* ARTISAN-001 declarations */}
          <div className="space-y-6">
            <div className="space-y-1">
              <p className="font-mono text-[9px] tracking-[0.35em] uppercase text-[#F4F1EA]/18 mb-4">
                THE DISTINCTION
              </p>
              <div className="space-y-4">
                <div className="border-b border-[#F87171]/15 pb-4">
                  <p className="font-mono text-[11px] tracking-[0.12em] text-[#F87171]/50 leading-relaxed">
                    ARTISAN-001 is not a model.
                  </p>
                </div>
                <div>
                  <p className="font-mono text-[11px] tracking-[0.12em] text-[#4ADE80]/60 leading-relaxed">
                    ARTISAN-001 is a person within the House.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* History / practice / relationship */}
          <div>
            <p className="font-mono text-[9px] tracking-[0.35em] uppercase text-[#F4F1EA]/18 mb-5">
              EVERY FUTURE DEPICTION
            </p>
            <p className="font-sans text-[11px] text-[#F4F1EA]/30 leading-loose tracking-wide mb-4">
              Every future depiction must preserve
            </p>
            <div className="border-l border-[#9A8968]/25 pl-5 space-y-2">
              {HISTORY_LINES.map((line, i) => (
                <p key={i} className="font-sans text-[12px] text-[#F4F1EA]/50 leading-snug tracking-wide italic">
                  {line}
                </p>
              ))}
            </div>
          </div>

          {/* Summary axiom */}
          <div className="border-t border-[#F4F1EA]/8 pt-6 space-y-3">
            <p className="font-mono text-[7px] tracking-[0.35em] uppercase text-[#9A8968]/40">
              CORE AXIOM
            </p>
            <p className="font-sans text-[13px] text-[#F4F1EA]/55 leading-relaxed font-light">
              A face without presence is casting.
            </p>
            <p className="font-sans text-[13px] text-[#9A8968]/70 leading-relaxed font-light">
              Presence without a face is atmosphere.
            </p>
            <p className="font-sans text-[14px] text-[#F4F1EA]/80 leading-relaxed font-light">
              Both together — that is ARTISAN-001.
            </p>
          </div>
        </div>
      </div>

      {/* Bottom bar — the test */}
      <div className="bg-[#0D0D0B] border border-[#F4F1EA]/6 p-6 flex flex-col md:flex-row items-start md:items-center gap-6 justify-between">
        <div>
          <p className="font-mono text-[7px] tracking-[0.35em] uppercase text-[#9A8968]/45 mb-2">
            THE PRESENCE TEST — BEFORE APPROVING ANY HUMAN ASSET
          </p>
          <p className="font-sans text-[10px] text-[#F4F1EA]/32 leading-relaxed italic max-w-xl">
            "If I removed the face from this image, would a viewer who knows this Atelier
            still feel the same person was present?"
          </p>
        </div>
        <div className="flex flex-col gap-2 flex-shrink-0">
          <div className="flex items-center gap-2">
            <span className="font-mono text-[9px] text-[#4ADE80]/55">YES</span>
            <span className="font-sans text-[9px] text-[#F4F1EA]/25">→ Presence confirmed. Proceed.</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="font-mono text-[9px] text-[#F87171]/45">NO</span>
            <span className="font-sans text-[9px] text-[#F4F1EA]/25">→ Regenerate with stronger presence direction.</span>
          </div>
        </div>
      </div>
    </section>
  );
}

// ─── Visual World Evolution ───────────────────────────────────────────────────

interface EvolutionStage {
  number: string;
  name: string;
  subtitle: string;
  established: string[];
  locked: string;
  images: Array<{ src: string; label: string }>;
  accent: string;
}

function VisualWorldEvolution() {
  const STAGES: EvolutionStage[] = [
    {
      number: "I",
      name: "THE HOUSE",
      subtitle: "The architectural world is defined",
      established: [
        "Limestone corridor — the threshold",
        "Private salon — conversation, trust",
        "Library — knowledge, archive",
        "One House, one material language",
      ],
      locked: "ARCHITECTURE v1.0 · 4 SPACES",
      images: [
        { src: houseArc001,   label: "ENTRANCE · HOUSE-ARC-001" },
        { src: salonArc001,   label: "SALON · SALON-ARC-001" },
        { src: libraryArc001, label: "LIBRARY · LIBRARY-ARC-001" },
      ],
      accent: "#9A8968",
    },
    {
      number: "II",
      name: "THE PLACE",
      subtitle: "The Atelier is isolated and approved",
      established: [
        "Dark walnut paneling — the craft register",
        "French window as primary light source",
        "Formal garden — the world beyond",
        "v1.0 rejected · v1.1 approved",
      ],
      locked: "ATELIER-ARC-002 · ARC v1.1",
      images: [
        { src: atelierArc002, label: "ATELIER · ATELIER-ARC-002" },
      ],
      accent: "#9A8968",
    },
    {
      number: "III",
      name: "THE WORKBENCH",
      subtitle: "The craft surface speaks before the Master arrives",
      established: [
        "Walnut bench — the field of work",
        "Tools laid out — anticipation of gesture",
        "Sketch of a dial — human trace without person",
        "Same space · same light · no artisan yet",
      ],
      locked: "MASTER-005 · CRAFT v1.0",
      images: [
        { src: masterArc001, label: "WORKBENCH · MASTER-005" },
      ],
      accent: "#9A8968",
    },
    {
      number: "IV",
      name: "THE MASTER",
      subtitle: "ARTISAN-001 — identity locked across 6 views",
      established: [
        "Face, age, hair, beard — documented",
        "Hands — the craftsman's hands",
        "Wardrobe — dark, artisanal, subdued",
        "Presence — quiet, absorbed, unperforming",
      ],
      locked: "ARTISAN-001 · LOCK v1.0",
      images: [
        { src: humanRef001, label: "CHARACTER LOCK · 6 VIEWS" },
      ],
      accent: "#F4F1EA",
    },
    {
      number: "V",
      name: "THE CRAFT",
      subtitle: "The Master enters the Atelier — the world is complete",
      established: [
        "ARTISAN-001 + Atelier = one living scene",
        "Engraving — the first craft act witnessed",
        "All 13 continuity parameters → A",
        "The viewer sees: the same Master, the same House",
      ],
      locked: "MASTER-006 · HUMAN v1.0",
      images: [
        { src: humanAct001, label: "ACTIVE · MASTER-006" },
      ],
      accent: "#4ADE80",
    },
  ];

  return (
    <section className="mb-20">

      {/* Header */}
      <div className="flex items-baseline justify-between mb-12 border-b border-[#F4F1EA]/8 pb-5">
        <div>
          <p className="font-mono text-[9px] tracking-[0.35em] uppercase text-[#9A8968] mb-2">
            MILLIN MASTER VISUAL WORLD
          </p>
          <h2 className="font-sans text-[20px] text-[#F4F1EA]/80 font-light tracking-wide">
            Visual World Evolution
          </h2>
        </div>
        <div className="text-right">
          <p className="font-mono text-[9px] tracking-[0.22em] uppercase text-[#F4F1EA]/20">5 STAGES · COMPLETE</p>
          <p className="font-mono text-[8px] tracking-widest text-[#4ADE80]/40 mt-1">THE CRAFT WORLD IS LIVE</p>
        </div>
      </div>

      {/* Evolution column */}
      <div className="max-w-4xl mx-auto">
        {STAGES.map((stage, idx) => (
          <div key={stage.number}>

            {/* Stage block */}
            <div className="grid grid-cols-12 gap-px bg-[#F4F1EA]/5">

              {/* Left — number column */}
              <div className="col-span-1 bg-[#0A0A08] flex flex-col items-center pt-8 pb-6">
                <span
                  className="font-sans text-[28px] font-light leading-none"
                  style={{ color: `${stage.accent}60` }}
                >
                  {stage.number}
                </span>
              </div>

              {/* Centre — content */}
              <div className="col-span-7 bg-[#0A0A08] px-7 py-8 flex flex-col gap-5">
                {/* Name + subtitle */}
                <div>
                  <p
                    className="font-mono text-[13px] tracking-[0.18em] mb-1.5"
                    style={{ color: `${stage.accent}CC` }}
                  >
                    {stage.name}
                  </p>
                  <p className="font-sans text-[11px] text-[#F4F1EA]/35 leading-relaxed italic">
                    {stage.subtitle}
                  </p>
                </div>

                {/* What was established */}
                <ul className="space-y-1.5">
                  {stage.established.map((item, i) => (
                    <li key={i} className="flex gap-3 items-start">
                      <span className="font-mono text-[8px] text-[#F4F1EA]/18 flex-shrink-0 mt-1">—</span>
                      <span className="font-sans text-[10px] text-[#F4F1EA]/38 leading-relaxed">{item}</span>
                    </li>
                  ))}
                </ul>

                {/* Locked badge */}
                <div className="flex items-center gap-2 pt-1">
                  <span
                    className="font-mono text-[8px] tracking-[0.25em] uppercase px-3 py-1 border"
                    style={{
                      color: `${stage.accent}90`,
                      borderColor: `${stage.accent}30`,
                      backgroundColor: `${stage.accent}08`,
                    }}
                  >
                    {stage.locked}
                  </span>
                </div>
              </div>

              {/* Right — images */}
              <div className="col-span-4 bg-[#0D0D0B] p-3 flex flex-col gap-2 justify-center">
                {stage.images.map((img) => (
                  <div key={img.label} className="flex flex-col gap-1">
                    <div className="relative overflow-hidden" style={{ aspectRatio: stage.images.length > 1 ? "16/9" : "4/3" }}>
                      <img
                        src={img.src}
                        alt={img.label}
                        className="w-full h-full object-cover object-top"
                        style={{ filter: "brightness(0.82) contrast(0.97) saturate(0.82)" }}
                      />
                    </div>
                    <p className="font-mono text-[7px] tracking-widest text-[#F4F1EA]/18 truncate">
                      {img.label}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* Arrow connector — between stages */}
            {idx < STAGES.length - 1 && (
              <div className="flex items-center justify-center py-3 bg-[#0A0A08]">
                <div className="flex flex-col items-center gap-1">
                  <div className="w-px h-5 bg-[#F4F1EA]/10" />
                  <span className="font-mono text-[10px] text-[#F4F1EA]/14">↓</span>
                </div>
              </div>
            )}
          </div>
        ))}

        {/* Final completion bar */}
        <div className="mt-px border border-[#4ADE80]/20 bg-[#4ADE80]/4 p-6 flex items-center justify-between">
          <div>
            <p className="font-mono text-[8px] tracking-[0.35em] uppercase text-[#4ADE80]/50 mb-2">
              THE CRAFT WORLD IS COMPLETE
            </p>
            <p className="font-sans text-[12px] text-[#F4F1EA]/55 leading-relaxed font-light">
              The House has been built. The Place has been found. The Workbench has been laid.
              The Master has arrived. The Craft has begun.
            </p>
          </div>
          <div className="ml-8 flex-shrink-0 flex flex-col items-end gap-1">
            <span className="font-mono text-[28px] text-[#4ADE80]/70 leading-none">V</span>
            <span className="font-mono text-[8px] tracking-widest uppercase text-[#4ADE80]/35">STAGES</span>
          </div>
        </div>
      </div>
    </section>
  );
}

// ─── MASTER-006 Hero Human Continuity Check ───────────────────────────────────

const HERO_HUMAN_PARAMS: Array<{
  id: string;
  label: string;
  target: string;
  grade: Grade;
  reading: string;
  isPrimary?: boolean;
}> = [
  { id: "01", label: "Same Face",              target: "A", grade: "A", reading: "Angular jaw, strong bone structure, same 3/4 profile as CHARACTER LOCK — match." },
  { id: "02", label: "Same Age",               target: "A", grade: "A", reading: "Mid-40s, salt-and-pepper colouring, consistent skin — match." },
  { id: "03", label: "Same Hair",              target: "A", grade: "A", reading: "Dark salt-and-pepper, short cut, same grey at temples — match." },
  { id: "04", label: "Same Beard",             target: "A", grade: "A", reading: "Short trimmed beard, salt-and-pepper — consistent with LOCK v1.0." },
  { id: "05", label: "Same Hands",             target: "A", grade: "A", reading: "Right hand on burin — strong, craftsman hands — match." },
  { id: "06", label: "Same Wardrobe",          target: "A", grade: "A", reading: "Dark brown jacket, artisanal register — consistent with CHARACTER LOCK wardrobe." },
  { id: "07", label: "Same Atelier",           target: "A", grade: "A", reading: "Dark walnut paneling, raised mouldings — identical to ATELIER-ARC-002 and MASTER-005." },
  { id: "08", label: "Same Workbench",         target: "A", grade: "A", reading: "Same dark walnut bench, same proportions, same tool arrangement logic — match." },
  { id: "09", label: "Same Window",            target: "A", grade: "A", reading: "French window, wooden frames, formal garden — same as MASTER-005." },
  { id: "10", label: "Same Daylight",          target: "A", grade: "A", reading: "Window as primary source, brass lamp supplementary — correct light hierarchy." },
  { id: "11", label: "Same Craft Language",    target: "A", grade: "A", reading: "Burin on paper, tools in tray, leather roll — authentic watchmaker gesture." },
  { id: "12", label: "Human Presence",         target: "PRIMARY", grade: "A", reading: "Head down, absorbed, not performing. Quiet concentration. PRIMARY CRITERION MET.", isPrimary: true },
  { id: "13", label: "Photography Continuity", target: "A", grade: "A", reading: "Same editorial style, colour temperature, depth of field — full match with MASTER-005." },
];

function HeroHumanCheck() {
  return (
    <section className="mb-20">

      {/* Section header */}
      <div className="flex items-baseline justify-between mb-10 border-b border-[#F4F1EA]/8 pb-5">
        <div>
          <p className="font-mono text-[9px] tracking-[0.35em] uppercase text-[#9A8968] mb-2">
            MASTER-006 · HERO HUMAN CONTINUITY CHECK
          </p>
          <h2 className="font-sans text-[20px] text-[#F4F1EA]/80 font-light tracking-wide">
            ARTISAN-001 · Active in the Atelier
          </h2>
        </div>
        <div className="flex items-center gap-2 border border-[#4ADE80]/30 bg-[#4ADE80]/6 px-4 py-2">
          <span className="w-2 h-2 rounded-full bg-[#4ADE80] animate-pulse" />
          <span className="font-mono text-[10px] tracking-[0.3em] uppercase text-[#4ADE80]">
            MASTER-006 · LOCKED
          </span>
        </div>
      </div>

      {/* Image panels — new asset + reference + character lock */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-px bg-[#F4F1EA]/5 mb-10">

        {/* MASTER-006 — the submitted asset */}
        <div className="md:col-span-2 bg-[#0A0A08] flex flex-col">
          <p className="font-mono text-[8px] tracking-[0.32em] uppercase text-[#F4F1EA]/22 px-6 pt-6 pb-3">
            SUBMITTED · MASTER-006
          </p>
          <div className="relative overflow-hidden flex-1" style={{ minHeight: "340px" }}>
            <img
              src={humanAct001}
              alt="MASTER-006 — ARTISAN-001 active"
              className="w-full h-full object-cover"
              style={{ filter: "brightness(0.92) contrast(0.98) saturate(0.86)" }}
            />
            {/* Grade overlay */}
            <div className="absolute top-3 right-3">
              <span className="font-mono text-[13px] w-8 h-8 flex items-center justify-center border text-[#4ADE80] border-[#4ADE80]/40 bg-[#4ADE80]/12">
                A
              </span>
            </div>
            {/* Bottom label */}
            <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-[#0A0A08]/95 via-[#0A0A08]/50 to-transparent">
              <p className="font-mono text-[8px] tracking-[0.25em] uppercase text-[#4ADE80] mb-1">
                KEEP · MILLIN ORIGINAL
              </p>
              <p className="font-mono text-[10px] text-[#F4F1EA]/55">
                MILLIN_HUMAN_ATELIER_ACTIVE_001
              </p>
            </div>
          </div>
          <div className="px-6 py-4 bg-[#0D0D0B]">
            <p className="font-sans text-[9px] text-[#F4F1EA]/28 leading-relaxed">
              ARTISAN-001 at the workbench — engraving, absorbed, full scene with tools and window.
              First HUMAN category MILLIN ORIGINAL with artisan present and active.
            </p>
          </div>
        </div>

        {/* Right column — two reference thumbnails */}
        <div className="flex flex-col gap-px bg-[#F4F1EA]/5">

          {/* MASTER-005 reference */}
          <div className="bg-[#0A0A08] flex flex-col flex-1">
            <p className="font-mono text-[8px] tracking-[0.32em] uppercase text-[#F4F1EA]/18 px-4 pt-4 pb-2">
              REF · MASTER-005
            </p>
            <div className="relative overflow-hidden flex-1" style={{ minHeight: "140px" }}>
              <img
                src={masterArc001}
                alt="MASTER-005 reference"
                className="w-full h-full object-cover"
                style={{ filter: "brightness(0.75) contrast(0.96) saturate(0.80)" }}
              />
              <div className="absolute inset-0 border border-[#F4F1EA]/8" />
              <div className="absolute top-2 left-2">
                <span className="font-mono text-[7px] bg-[#F4F1EA]/8 border border-[#F4F1EA]/15 text-[#F4F1EA]/40 px-2 py-0.5 tracking-widest">
                  CRAFT · APPROVED
                </span>
              </div>
            </div>
            <p className="font-sans text-[8px] text-[#F4F1EA]/20 px-4 py-2 leading-relaxed">
              Same atelier, same bench, same tools — no artisan present. MASTER-006 is the same scene, five minutes later.
            </p>
          </div>

          {/* CHARACTER LOCK reference */}
          <div className="bg-[#0A0A08] flex flex-col flex-1">
            <p className="font-mono text-[8px] tracking-[0.32em] uppercase text-[#F4F1EA]/18 px-4 pt-4 pb-2">
              REF · CHARACTER LOCK
            </p>
            <div className="relative overflow-hidden flex-1" style={{ minHeight: "140px" }}>
              <img
                src={humanRef001}
                alt="ARTISAN-001 character lock"
                className="w-full h-full object-cover object-top"
                style={{ filter: "brightness(0.78) contrast(0.97) saturate(0.80)" }}
              />
              <div className="absolute inset-0 border border-[#F4F1EA]/8" />
              <div className="absolute top-2 left-2">
                <span className="font-mono text-[7px] bg-[#9A8968]/12 border border-[#9A8968]/30 text-[#9A8968]/60 px-2 py-0.5 tracking-widest">
                  LOCK v1.0
                </span>
              </div>
            </div>
            <p className="font-sans text-[8px] text-[#F4F1EA]/20 px-4 py-2 leading-relaxed">
              Identity reference. Face, hair, beard, hands, wardrobe — all checked against this sheet.
            </p>
          </div>
        </div>
      </div>

      {/* 13-parameter table */}
      <div className="overflow-x-auto mb-8">
        <table className="w-full border-collapse">
          <thead>
            <tr className="border-b border-[#F4F1EA]/10">
              <th className="font-mono text-[8px] tracking-widest uppercase text-[#F4F1EA]/25 text-left py-3 pr-4 w-6">#</th>
              <th className="font-mono text-[8px] tracking-widest uppercase text-[#F4F1EA]/25 text-left py-3 pr-8 w-36">PARAMETER</th>
              <th className="font-mono text-[8px] tracking-widest uppercase text-[#F4F1EA]/25 text-center py-3 px-4 w-16">TARGET</th>
              <th className="font-mono text-[8px] tracking-widest uppercase text-[#F4F1EA]/25 text-center py-3 px-4 w-16">GRADE</th>
              <th className="font-mono text-[8px] tracking-widest uppercase text-[#F4F1EA]/25 text-left py-3 pl-6">READING</th>
            </tr>
          </thead>
          <tbody>
            {HERO_HUMAN_PARAMS.map((param, i) => (
              <tr
                key={param.id}
                className={`border-b border-[#F4F1EA]/5 ${
                  param.isPrimary
                    ? "bg-[#9A8968]/6"
                    : i % 2 === 0 ? "bg-transparent" : "bg-[#F4F1EA]/2"
                }`}
              >
                <td className="font-mono text-[9px] text-[#F4F1EA]/18 py-4 pr-4 align-top">{param.id}</td>
                <td className={`font-mono text-[10px] py-4 pr-8 align-top tracking-wider ${param.isPrimary ? "text-[#9A8968]/80" : "text-[#F4F1EA]/60"}`}>
                  {param.label}
                  {param.isPrimary && (
                    <span className="ml-2 font-mono text-[6px] tracking-widest uppercase text-[#9A8968]/50">
                      PRIMARY
                    </span>
                  )}
                </td>
                <td className="py-4 px-4 text-center align-top">
                  <span className={`font-mono text-[9px] tracking-widest ${param.target === "PRIMARY" ? "text-[#9A8968]/60" : "text-[#F4F1EA]/25"}`}>
                    {param.target}
                  </span>
                </td>
                <td className="py-4 px-4 text-center align-top">
                  <GradeCell grade={param.grade} />
                </td>
                <td className={`font-sans text-[9px] py-4 pl-6 align-top leading-relaxed max-w-sm ${param.isPrimary ? "text-[#F4F1EA]/45 italic" : "text-[#F4F1EA]/28"}`}>
                  {param.reading}
                </td>
              </tr>
            ))}

            {/* Verdict row */}
            <tr className="border-t-2 border-[#F4F1EA]/14">
              <td colSpan={3} className="font-mono text-[9px] tracking-[0.25em] uppercase text-[#F4F1EA]/35 py-5">
                VERDICT
              </td>
              <td className="py-5 px-4 text-center">
                <GradeCell grade="A" />
              </td>
              <td className="font-sans text-[9px] text-[#F4F1EA]/28 py-5 pl-6 leading-relaxed">
                All 13 parameters → A. Identity, presence, and architectural continuity confirmed. PRIMARY criterion met.
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* Locking criterion + final verdict */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-px bg-[#F4F1EA]/5">
        <div className="bg-[#0D0D0B] p-6">
          <p className="font-mono text-[7px] tracking-[0.35em] uppercase text-[#F4F1EA]/20 mb-4">
            КРИТЕРИЙ УТВЕРЖДЕНИЯ
          </p>
          <p className="font-sans text-[11px] text-[#F4F1EA]/38 leading-loose italic mb-4">
            "Could this image plausibly have been photographed five minutes after MASTER-005,
            in the same Atelier, with the same Master?"
          </p>
          <div className="flex items-center gap-3 pt-3 border-t border-[#F4F1EA]/8">
            <span className="font-sans text-[13px] text-[#F4F1EA]/55 font-light">Ответ:</span>
            <span className="font-sans text-[16px] text-[#4ADE80]/80 font-light tracking-wide">Да.</span>
          </div>
        </div>

        <div className="bg-[#4ADE80]/5 border border-[#4ADE80]/20 p-6 flex flex-col justify-between">
          <div>
            <p className="font-mono text-[7px] tracking-[0.35em] uppercase text-[#4ADE80]/45 mb-4">
              SLOT APPROVED
            </p>
            <p className="font-mono text-[11px] text-[#F4F1EA]/65 mb-1 tracking-wider">
              MILLIN_HUMAN_ATELIER_ACTIVE_001
            </p>
            <p className="font-sans text-[9px] text-[#F4F1EA]/28 leading-relaxed">
              First HUMAN category MILLIN ORIGINAL with ARTISAN-001 present and active.
              This image establishes the Hero Human visual tone for all future craft scenes.
            </p>
          </div>
          <div className="flex items-center justify-between mt-5 pt-4 border-t border-[#4ADE80]/15">
            <span className="font-mono text-[8px] tracking-widest uppercase text-[#4ADE80]/55">
              MASTER-006 · LOCKED
            </span>
            <span className="font-mono text-[8px] text-[#4ADE80]/35">HUMAN v1.0</span>
          </div>
        </div>
      </div>
    </section>
  );
}

// ─── MASTER-010 Hero Collector Check ─────────────────────────────────────────

interface CollectorParam {
  id: string;
  label: string;
  grade: Grade;
  verdict: string;
  analysis: string[];
}

const COLLECTOR_PARAMS: CollectorParam[] = [
  {
    id: "01", label: "ARCHITECTURE", grade: "A",
    verdict: "HOUSE CONTINUITY PRESERVED",
    analysis: [
      "The Private Salon immediately belongs to the House of MILLIN.",
      "Dark walnut. Natural limestone. Quiet European daylight.",
      "No decorative luxury. No hospitality staging.",
      "The room feels lived in rather than displayed.",
    ],
  },
  {
    id: "02", label: "HUMAN", grade: "A+",
    verdict: "ARTISAN CONTINUITY MAINTAINED",
    analysis: [
      "The artisan remains exactly the same person established in ARTISAN-001.",
      "He does not perform. He listens.",
      "His body language communicates attention rather than authority.",
      "No eye contact with the camera. No theatrical gesture. No performance.",
    ],
  },
  {
    id: "03", label: "COLLECTOR PRESENCE", grade: "A+",
    verdict: "HERO COLLECTOR ESTABLISHED",
    analysis: [
      "The collector is not shown as a client.",
      "He is shown as an intellectual participant.",
      "His posture expresses curiosity. Not acquisition. Not negotiation. Not status.",
      "No visible luxury signalling. No watch inspection. No catalogue. No contract. No sales behaviour.",
      "The collector belongs to the House. He has entered a conversation.",
    ],
  },
  {
    id: "04", label: "ATMOSPHERE", grade: "A",
    verdict: "EMOTIONAL TEMPERATURE CORRECT",
    analysis: [
      "Silence dominates the image. Nothing appears hurried.",
      "No presentation. No demonstration. No commercial energy.",
      "The room feels almost library-like.",
      "The viewer should imagine hearing only quiet voices and turning paper.",
    ],
  },
  {
    id: "05", label: "NARRATIVE", grade: "A+",
    verdict: "DIGITAL MAISON PHILOSOPHY COMMUNICATED",
    analysis: [
      "The image successfully communicates: Every creation begins long before the first drawing.",
      "This is not a design meeting. It is the beginning of trust.",
      "Nothing is being sold. Something is being understood.",
      "The emotional message: The first bespoke component is conversation.",
    ],
  },
  {
    id: "06", label: "PHOTOGRAPHY", grade: "A",
    verdict: "EDITORIAL LANGUAGE PRESERVED",
    analysis: [
      "Editorial observation. Never portrait photography.",
      "Camera behaves like a respectful guest.",
      "Eye-level perspective. Comfortable distance. Natural gestures.",
      "No cinematic exaggeration. No dramatic compression. No fashion posing.",
    ],
  },
  {
    id: "07", label: "LIGHTING", grade: "A",
    verdict: "MILLIN LIGHT CONSTITUTION PRESERVED",
    analysis: [
      "Soft daylight remains dominant.",
      "The light separates faces gently without theatrical contrast.",
      "Warm reflected tones from walnut surfaces create intimacy.",
      "No artificial key light. No luxury showroom atmosphere.",
    ],
  },
  {
    id: "08", label: "ORIGINALITY", grade: "A+",
    verdict: "MILLIN ORIGINAL",
    analysis: [
      "Almost every luxury brand photographs a client receiving a product.",
      "This image shows something much earlier: conversation, listening, shared imagination.",
      "It therefore becomes unmistakably House of MILLIN.",
    ],
  },
];

const BESPOKE_CHAIN = [
  { id: "MASTER-005", label: "Workbench",    img: masterArc001,   locked: true },
  { id: "MASTER-006", label: "Artisan",      img: humanAct001,    locked: true },
  { id: "MASTER-007", label: "Fire",         img: enamelCra001,   locked: true },
  { id: "MASTER-008", label: "Hand",         img: engravingCra001,locked: true },
  { id: "MASTER-009", label: "Geometry",     img: null,           locked: false },
  { id: "MASTER-010", label: "Conversation", img: bespokeM001,    locked: true },
];

function HeroCollectorCheck() {
  const aPlus = "#A78BFA";

  return (
    <section className="mb-20">

      {/* Header */}
      <div className="flex items-start justify-between mb-10 border-b border-[#F4F1EA]/8 pb-5 gap-6">
        <div>
          <p className="font-mono text-[9px] tracking-[0.35em] uppercase text-[#9A8968] mb-2">
            MASTER-010 · HERO COLLECTOR · PASS 02.9
          </p>
          <h2 className="font-sans text-[20px] text-[#F4F1EA]/80 font-light tracking-wide">
            The Collector Conversation
          </h2>
        </div>
        <div className="flex-shrink-0 text-right">
          <div className="inline-flex items-center gap-2 border px-4 py-2 mb-1"
            style={{ borderColor: `${aPlus}44`, backgroundColor: `${aPlus}08` }}>
            <span className="w-2 h-2 rounded-full animate-pulse" style={{ backgroundColor: aPlus }} />
            <span className="font-mono text-[10px] tracking-[0.3em] uppercase" style={{ color: aPlus }}>
              MASTER-010 · LOCKED
            </span>
          </div>
          <p className="font-mono text-[8px] tracking-widest uppercase text-[#F4F1EA]/20">
            HERO COLLECTOR v1.0
          </p>
        </div>
      </div>

      {/* Visual continuity summary scores */}
      <div className="grid grid-cols-4 md:grid-cols-8 gap-px bg-[#F4F1EA]/5 mb-10">
        {COLLECTOR_PARAMS.map((p) => (
          <div key={p.id} className="bg-[#0D0D0B] p-3 flex flex-col items-center gap-2">
            <p className="font-mono text-[7px] tracking-widest uppercase text-[#F4F1EA]/20 text-center leading-tight">
              {p.label}
            </p>
            <GradeCell grade={p.grade} />
          </div>
        ))}
      </div>

      {/* Hero image + bespoke chain */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-px bg-[#F4F1EA]/5 mb-10">

        {/* Image — large */}
        <div className="md:col-span-2 bg-[#0A0A08] flex flex-col">
          <div className="relative overflow-hidden flex-1" style={{ minHeight: "360px" }}>
            <img
              src={bespokeM001}
              alt="MASTER-010 — The Collector Conversation"
              className="w-full h-full object-cover"
              style={{ filter: "brightness(0.90) contrast(0.98) saturate(0.84)" }}
            />
            <div className="absolute top-3 right-3">
              <span
                className="font-mono text-[12px] w-9 h-9 flex items-center justify-center border"
                style={{ color: aPlus, borderColor: `${aPlus}44`, backgroundColor: `${aPlus}12` }}
              >
                A+
              </span>
            </div>
            <div className="absolute bottom-0 left-0 right-0 p-5 bg-gradient-to-t from-[#0A0A08]/95 via-[#0A0A08]/50 to-transparent">
              <p className="font-mono text-[8px] tracking-[0.25em] uppercase mb-1" style={{ color: aPlus }}>
                KEEP · MILLIN ORIGINAL · READY FOR LOCK
              </p>
              <p className="font-mono text-[10px] text-[#F4F1EA]/55">MILLIN_BESPOKE_MASTER_001</p>
            </div>
          </div>
          <div className="p-5 bg-[#0D0D0B]">
            <p className="font-sans text-[10px] text-[#F4F1EA]/28 leading-loose italic">
              "Could this photograph exist without showing a watch?"
            </p>
            <p className="font-sans text-[11px] text-[#F4F1EA]/55 mt-2 font-light">
              Yes. The House itself has become the subject.
            </p>
          </div>
        </div>

        {/* Bespoke chain */}
        <div className="bg-[#0D0D0B] p-5 flex flex-col">
          <p className="font-mono text-[8px] tracking-[0.32em] uppercase text-[#F4F1EA]/22 mb-5">
            BESPOKE CONTINUITY CHAIN
          </p>
          <div className="flex flex-col gap-1 flex-1">
            {BESPOKE_CHAIN.map((step, i) => (
              <div key={step.id}>
                <div className={`flex gap-3 items-center p-2 ${step.id === "MASTER-010" ? "border" : "border border-transparent"}`}
                  style={step.id === "MASTER-010" ? { borderColor: `${aPlus}30`, backgroundColor: `${aPlus}06` } : {}}>
                  {/* Thumbnail */}
                  <div className="w-12 h-9 flex-shrink-0 overflow-hidden bg-[#161612]">
                    {step.img ? (
                      <img
                        src={step.img}
                        alt={step.id}
                        className="w-full h-full object-cover"
                        style={{ filter: "brightness(0.75) saturate(0.75)" }}
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <span className="font-mono text-[7px] text-[#F4F1EA]/14">—</span>
                      </div>
                    )}
                  </div>
                  {/* Label */}
                  <div className="flex-1 min-w-0">
                    <p className={`font-mono text-[8px] tracking-widest ${step.id === "MASTER-010" ? "" : "text-[#F4F1EA]/30"}`}
                      style={step.id === "MASTER-010" ? { color: aPlus } : {}}>
                      {step.id}
                    </p>
                    <p className="font-sans text-[9px] text-[#F4F1EA]/35 capitalize">{step.label}</p>
                  </div>
                  {/* Lock status */}
                  {step.locked ? (
                    <span className="font-mono text-[7px] tracking-widest text-[#4ADE80]/50 flex-shrink-0">LOCKED</span>
                  ) : (
                    <span className="font-mono text-[7px] tracking-widest text-[#F4F1EA]/18 flex-shrink-0">PENDING</span>
                  )}
                </div>
                {i < BESPOKE_CHAIN.length - 1 && (
                  <div className="flex justify-center py-0.5">
                    <span className="font-mono text-[8px] text-[#F4F1EA]/12">↓</span>
                  </div>
                )}
              </div>
            ))}
          </div>
          <p className="font-sans text-[9px] text-[#F4F1EA]/22 leading-relaxed mt-4 pt-4 border-t border-[#F4F1EA]/8 italic">
            The House first introduced the craft. Only then does it introduce the collector.
            The emotional progression remains uninterrupted.
          </p>
        </div>
      </div>

      {/* Production file comparison */}
      <div className="mb-10">
        <p className="font-mono text-[8px] tracking-[0.32em] uppercase text-[#F4F1EA]/22 mb-4">
          PRODUCTION FILE · BESPOKE-COL-001
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-px bg-[#F4F1EA]/5">
          {/* Review master */}
          <div className="bg-[#0A0A08] flex flex-col">
            <p className="font-mono text-[7px] tracking-[0.28em] uppercase text-[#F4F1EA]/18 px-5 pt-4 pb-2">
              REVIEW FILE · MASTER-010
            </p>
            <div className="relative overflow-hidden flex-1" style={{ aspectRatio: "4/3" }}>
              <img src={bespokeM001} alt="MASTER-010" className="w-full h-full object-cover"
                style={{ filter: "brightness(0.82) saturate(0.82)" }} />
              <div className="absolute top-2 left-2">
                <span className="font-mono text-[7px] bg-[#F4F1EA]/8 border border-[#F4F1EA]/18 text-[#F4F1EA]/40 px-2 py-0.5 tracking-widest">
                  MILLIN_BESPOKE_MASTER_001
                </span>
              </div>
            </div>
            <p className="font-sans text-[8px] text-[#F4F1EA]/20 px-5 py-3 leading-relaxed">
              Used for the continuity review and lock. Source of the HERO COLLECTOR ANALYSIS.
            </p>
          </div>
          {/* Production file */}
          <div className="bg-[#0A0A08] flex flex-col">
            <div className="flex items-center gap-3 px-5 pt-4 pb-2">
              <p className="font-mono text-[7px] tracking-[0.28em] uppercase text-[#F4F1EA]/18">
                PRODUCTION FILE · BESPOKE-COL-001
              </p>
              <span className="font-mono text-[7px] tracking-widest uppercase text-[#4ADE80]/55 border border-[#4ADE80]/25 px-1.5 py-0.5">
                ACTIVE
              </span>
            </div>
            <div className="relative overflow-hidden flex-1" style={{ aspectRatio: "4/3" }}>
              <img src={bespokeCol001} alt="BESPOKE-COL-001" className="w-full h-full object-cover"
                style={{ filter: "brightness(0.88) saturate(0.84)" }} />
              <div className="absolute top-2 left-2">
                <span className="font-mono text-[7px] bg-[#4ADE80]/10 border border-[#4ADE80]/30 text-[#4ADE80]/65 px-2 py-0.5 tracking-widest">
                  MILLIN_BESPOKE_COLLECTOR_001
                </span>
              </div>
            </div>
            <p className="font-sans text-[8px] text-[#F4F1EA]/20 px-5 py-3 leading-relaxed">
              Production-named asset. Same scene, same approval. This slot is used by components across the Digital Maison.
            </p>
          </div>
        </div>
        <div className="border border-[#F4F1EA]/6 bg-[#0D0D0B] px-5 py-3 flex items-center justify-between">
          <p className="font-sans text-[9px] text-[#F4F1EA]/25 leading-relaxed">
            Both files reference the same approved scene. Review locked under MASTER-010. Production slot: <span className="font-mono text-[8px] text-[#9A8968]/55">MILLIN_BESPOKE_COLLECTOR_001</span>
          </p>
          <span className="font-mono text-[8px] tracking-widest uppercase text-[#4ADE80]/35 ml-6 flex-shrink-0">
            BESPOKE v1.0 · APPROVED
          </span>
        </div>
      </div>

      {/* 8-parameter analysis */}
      <div className="mb-8">
        <p className="font-mono text-[8px] tracking-[0.32em] uppercase text-[#F4F1EA]/22 mb-5">
          HERO COLLECTOR ANALYSIS · 8 PARAMETERS
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-px bg-[#F4F1EA]/5">
          {COLLECTOR_PARAMS.map((param) => (
            <div key={param.id} className="bg-[#0A0A08] p-6 flex gap-5">
              {/* Grade + number */}
              <div className="flex flex-col items-center gap-2 flex-shrink-0 pt-0.5">
                <span className="font-mono text-[9px] text-[#F4F1EA]/18">{param.id}</span>
                <GradeCell grade={param.grade} />
              </div>
              {/* Content */}
              <div className="flex-1 min-w-0">
                <p className="font-mono text-[10px] tracking-wider text-[#F4F1EA]/65 mb-3">{param.label}</p>
                <div className="space-y-1.5 mb-3">
                  {param.analysis.map((line, i) => (
                    <p key={i} className="font-sans text-[9px] text-[#F4F1EA]/35 leading-relaxed">{line}</p>
                  ))}
                </div>
                <p className="font-mono text-[7px] tracking-[0.28em] uppercase text-[#4ADE80]/50">
                  ✓ {param.verdict}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Bespoke Constitution Check */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-px bg-[#F4F1EA]/5 mb-8">
        <div className="bg-[#0D0D0B] p-6">
          <p className="font-mono text-[8px] tracking-[0.32em] uppercase text-[#F87171]/40 mb-5">
            BESPOKE CONVERSATION — MUST NOT RESEMBLE
          </p>
          <ul className="space-y-3">
            {["Sales consultation", "Product presentation", "Watch selection", "Luxury retail", "Business negotiation"].map((item) => (
              <li key={item} className="flex gap-3 items-center">
                <span className="font-mono text-[10px] text-[#F87171]/45">✗</span>
                <span className="font-sans text-[10px] text-[#F4F1EA]/32 leading-relaxed">{item}</span>
              </li>
            ))}
          </ul>
        </div>
        <div className="bg-[#0D0D0B] p-6">
          <p className="font-mono text-[8px] tracking-[0.32em] uppercase text-[#4ADE80]/40 mb-5">
            BESPOKE CONVERSATION — MUST RESEMBLE
          </p>
          <ul className="space-y-3">
            {["Architect meeting future owner", "Master discussing commission", "Artist understanding a collector", "Curator explaining a future acquisition"].map((item) => (
              <li key={item} className="flex gap-3 items-center">
                <span className="font-mono text-[10px] text-[#4ADE80]/50">✓</span>
                <span className="font-sans text-[10px] text-[#F4F1EA]/38 leading-relaxed">{item}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Final verdict */}
      <div
        className="p-6 border flex flex-col md:flex-row items-start md:items-center justify-between gap-5"
        style={{ borderColor: `${aPlus}30`, backgroundColor: `${aPlus}05` }}
      >
        <div>
          <p className="font-mono text-[7px] tracking-[0.35em] uppercase mb-3" style={{ color: `${aPlus}60` }}>
            HERO COLLECTOR VERDICT · MASTER-010
          </p>
          <div className="flex flex-wrap gap-4 items-baseline mb-3">
            {COLLECTOR_PARAMS.map((p) => (
              <span key={p.id} className="font-sans text-[9px] text-[#F4F1EA]/30">
                {p.label.split(" ").slice(-1)[0]}{" "}
                <span
                  className="font-mono text-[9px]"
                  style={{ color: p.grade === "A+" ? aPlus : "#4ADE80" }}
                >
                  {p.grade}
                </span>
              </span>
            ))}
          </div>
          <p className="font-sans text-[10px] text-[#F4F1EA]/35 leading-relaxed">
            <strong className="text-[#F4F1EA]/60 font-light">MILLIN_BESPOKE_MASTER_001</strong>{" "}
            — The first bespoke encounter in the Visual World. The collector has entered the House.
            The conversation has begun. Nothing is being sold. Something is being understood.
          </p>
        </div>
        <div className="flex-shrink-0 flex flex-col items-end gap-2">
          <span
            className="font-mono text-[32px] leading-none"
            style={{ color: `${aPlus}80` }}
          >
            A+
          </span>
          <span className="font-mono text-[8px] tracking-[0.3em] uppercase" style={{ color: `${aPlus}50` }}>
            KEEP · LOCKED
          </span>
        </div>
      </div>
    </section>
  );
}

// ─── MASTER-011 Bespoke Sketch Check ─────────────────────────────────────────

const SKETCH_PARAMS: CollectorParam[] = [
  {
    id: "01", label: "ARCHITECTURE", grade: "A",
    verdict: "HOUSE CONTINUITY PRESERVED",
    analysis: [
      "The sketch is created inside the same Private Salon established in MASTER-010.",
      "Dark walnut table. Natural limestone. Soft European daylight. Handmade paper.",
      "Nothing resembles a design office. Nothing resembles a studio.",
      "The room itself remains part of the narrative.",
    ],
  },
  {
    id: "02", label: "HUMAN", grade: "A+",
    verdict: "HUMAN LANGUAGE PRESERVED",
    analysis: [
      "ARTISAN-001 confirmed — same face, same dark brown jacket, dark apron for craft work.",
      "He does not perform. He draws. Head down, pencil moving.",
      "No eye contact with camera. No theatrical gesture. No performance.",
      "The image communicates absorption — thought made visible through gesture.",
    ],
  },
  {
    id: "03", label: "CRAFT AUTHENTICITY", grade: "A+",
    verdict: "BESPOKE PROCESS AUTHENTIC",
    analysis: [
      "Handmade paper with deckled edges. Visible graphite construction lines.",
      "Multiple watch views on one sheet. Handwritten annotations. Ruler present.",
      "Leather material sample and engraved metal plates on table — craft continuity with previous assets.",
      "No perfectly clean rendering. No CAD aesthetics. This is thinking made visible.",
    ],
  },
  {
    id: "04", label: "NARRATIVE", grade: "A+",
    verdict: "BESPOKE STORY CONTINUES",
    analysis: [
      "This image answers: What happens after the conversation?",
      "Ideas begin taking physical form. Not a finished design. Not a product.",
      "Only the first visible trace of imagination becoming intention.",
      "Conversation becomes drawing.",
    ],
  },
  {
    id: "05", label: "PHOTOGRAPHY", grade: "A",
    verdict: "EDITORIAL LANGUAGE PRESERVED",
    analysis: [
      "Observed rather than staged. Camera slightly above table level.",
      "Natural perspective. No flat lay. No top-down product styling.",
      "Shallow depth of field. Respectful distance.",
    ],
  },
  {
    id: "06", label: "LIGHTING", grade: "A",
    verdict: "MILLIN LIGHT CONSTITUTION PRESERVED",
    analysis: [
      "French window as primary source — same garden, same frame as Atelier.",
      "Graphite reflects softly. Paper remains matte. Walnut introduces warm tones.",
      "No dramatic spotlight. No luxury advertisement lighting.",
    ],
  },
  {
    id: "07", label: "ORIGINALITY", grade: "A+",
    verdict: "MILLIN ORIGINAL",
    analysis: [
      "Luxury brands show finished design renderings.",
      "This image shows uncertainty. Experiment. Iteration. Human thought.",
      "Multiple exploratory views. Corrections. Working process — not a result.",
      "That makes it unmistakably House of MILLIN.",
    ],
  },
  {
    id: "08", label: "EDITORIAL LANGUAGE", grade: "A",
    verdict: "EDITORIAL CONSISTENCY MAINTAINED",
    analysis: [
      "The composition feels closer to an architect's notebook than a luxury campaign.",
      "Nothing is centred for effect. Nothing appears manufactured.",
      "The viewer becomes an observer of a private creative moment.",
    ],
  },
];

const SKETCH_CHAIN = [
  { id: "MASTER-010", label: "Conversation",       img: bespokeM001,  locked: true,  current: false },
  { id: "MASTER-011", label: "Sketch",              img: bespokeCra001,locked: true,  current: true  },
  { id: "MASTER-012", label: "Material Selection",  img: null,         locked: false, current: false },
  { id: "MASTER-013", label: "First Prototype",     img: null,         locked: false, current: false },
  { id: "MASTER-014", label: "Creation",            img: null,         locked: false, current: false },
];

function BespokeSketchCheck() {
  const aPlus = "#A78BFA";

  return (
    <section className="mb-20">

      {/* Header */}
      <div className="flex items-start justify-between mb-10 border-b border-[#F4F1EA]/8 pb-5 gap-6">
        <div>
          <p className="font-mono text-[9px] tracking-[0.35em] uppercase text-[#9A8968] mb-2">
            MASTER-011 · THE BESPOKE SKETCH · PASS 02.10
          </p>
          <h2 className="font-sans text-[20px] text-[#F4F1EA]/80 font-light tracking-wide">
            Conversation becomes a drawing.
          </h2>
          <p className="font-sans text-[11px] text-[#F4F1EA]/30 italic mt-1">
            The drawing becomes a promise. The promise will one day become a creation.
          </p>
        </div>
        <div className="flex-shrink-0 text-right">
          <div className="inline-flex items-center gap-2 border px-4 py-2 mb-1"
            style={{ borderColor: `${aPlus}44`, backgroundColor: `${aPlus}08` }}>
            <span className="w-2 h-2 rounded-full" style={{ backgroundColor: aPlus }} />
            <span className="font-mono text-[10px] tracking-[0.3em] uppercase" style={{ color: aPlus }}>
              MASTER-011 · LOCKED
            </span>
          </div>
          <p className="font-mono text-[8px] tracking-widest uppercase text-[#F4F1EA]/20">
            MILLIN_BESPOKE_MASTER_002
          </p>
        </div>
      </div>

      {/* Score strip */}
      <div className="grid grid-cols-4 md:grid-cols-8 gap-px bg-[#F4F1EA]/5 mb-10">
        {SKETCH_PARAMS.map((p) => (
          <div key={p.id} className="bg-[#0D0D0B] p-3 flex flex-col items-center gap-2">
            <p className="font-mono text-[7px] tracking-widest uppercase text-[#F4F1EA]/20 text-center leading-tight">
              {p.label.split(" ").slice(-1)[0]}
            </p>
            <GradeCell grade={p.grade} />
          </div>
        ))}
      </div>

      {/* Hero image + chain */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-px bg-[#F4F1EA]/5 mb-10">

        {/* Image */}
        <div className="md:col-span-2 bg-[#0A0A08] flex flex-col">
          <div className="relative overflow-hidden flex-1" style={{ minHeight: "340px" }}>
            <img
              src={bespokeCra001}
              alt="MASTER-011 — The Bespoke Sketch"
              className="w-full h-full object-cover"
              style={{ filter: "brightness(0.90) contrast(0.98) saturate(0.84)" }}
            />
            <div className="absolute top-3 right-3">
              <span className="font-mono text-[12px] w-9 h-9 flex items-center justify-center border"
                style={{ color: aPlus, borderColor: `${aPlus}44`, backgroundColor: `${aPlus}12` }}>
                A+
              </span>
            </div>
            <div className="absolute bottom-0 left-0 right-0 p-5 bg-gradient-to-t from-[#0A0A08]/95 via-[#0A0A08]/50 to-transparent">
              <p className="font-mono text-[8px] tracking-[0.25em] uppercase mb-1" style={{ color: aPlus }}>
                KEEP · MILLIN ORIGINAL · READY FOR LOCK
              </p>
              <p className="font-mono text-[10px] text-[#F4F1EA]/55">MILLIN_BESPOKE_MASTER_002 · BESPOKE-CRA-001</p>
            </div>
          </div>
          {/* Bespoke constitution check */}
          <div className="grid grid-cols-2 gap-px bg-[#F4F1EA]/5">
            <div className="bg-[#0D0D0B] p-4">
              <p className="font-mono text-[7px] tracking-widest uppercase text-[#F87171]/40 mb-3">MUST NOT RESEMBLE</p>
              <ul className="space-y-1.5">
                {["Product concept rendering", "Marketing illustration", "Technical blueprint", "CAD interface", "Luxury catalogue artwork"].map((item) => (
                  <li key={item} className="flex gap-2 items-start">
                    <span className="font-mono text-[9px] text-[#F87171]/40 flex-shrink-0">✗</span>
                    <span className="font-sans text-[8px] text-[#F4F1EA]/28 leading-relaxed">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="bg-[#0D0D0B] p-4">
              <p className="font-mono text-[7px] tracking-widest uppercase text-[#4ADE80]/40 mb-3">MUST RESEMBLE</p>
              <ul className="space-y-1.5">
                {["Architect's first notebook", "Artist's exploratory drawing", "Watchmaker's personal study", "Commission notes", "Living creative process"].map((item) => (
                  <li key={item} className="flex gap-2 items-start">
                    <span className="font-mono text-[9px] text-[#4ADE80]/45 flex-shrink-0">✓</span>
                    <span className="font-sans text-[8px] text-[#F4F1EA]/35 leading-relaxed">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* Continuity chain + digital maison check */}
        <div className="bg-[#0D0D0B] p-5 flex flex-col gap-6">
          <div>
            <p className="font-mono text-[8px] tracking-[0.32em] uppercase text-[#F4F1EA]/22 mb-4">
              BESPOKE CONTINUITY
            </p>
            <div className="flex flex-col gap-1">
              {SKETCH_CHAIN.map((step, i) => (
                <div key={step.id}>
                  <div className={`flex gap-3 items-center p-2 border ${step.current ? "" : "border-transparent"}`}
                    style={step.current ? { borderColor: `${aPlus}30`, backgroundColor: `${aPlus}06` } : {}}>
                    <div className="w-10 h-8 flex-shrink-0 overflow-hidden bg-[#161612]">
                      {step.img ? (
                        <img src={step.img} alt={step.id} className="w-full h-full object-cover"
                          style={{ filter: "brightness(0.70) saturate(0.70)" }} />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <span className="font-mono text-[6px] text-[#F4F1EA]/14">—</span>
                        </div>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-mono text-[8px] tracking-widest"
                        style={{ color: step.current ? aPlus : "rgba(244,241,234,0.28)" }}>
                        {step.id}
                      </p>
                      <p className="font-sans text-[9px] text-[#F4F1EA]/35">{step.label}</p>
                    </div>
                    <span className={`font-mono text-[7px] tracking-widest flex-shrink-0 ${step.locked ? "text-[#4ADE80]/50" : "text-[#F4F1EA]/14"}`}>
                      {step.locked ? "LOCKED" : "PENDING"}
                    </span>
                  </div>
                  {i < SKETCH_CHAIN.length - 1 && (
                    <div className="flex justify-center py-0.5">
                      <span className="font-mono text-[8px] text-[#F4F1EA]/12">↓</span>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Digital Maison check */}
          <div className="border-t border-[#F4F1EA]/8 pt-5 flex flex-col gap-3">
            <p className="font-mono text-[7px] tracking-[0.32em] uppercase text-[#F4F1EA]/20">
              DIGITAL MAISON CHECK
            </p>
            <p className="font-sans text-[9px] text-[#F4F1EA]/30 leading-loose italic">
              "Could this drawing exist even if the watch were never built?"
            </p>
            <div className="flex items-baseline gap-2">
              <span className="font-sans text-[10px] text-[#F4F1EA]/40">Answer:</span>
              <span className="font-sans text-[14px] font-light" style={{ color: `${aPlus}90` }}>Yes.</span>
            </div>
            <p className="font-sans text-[9px] text-[#F4F1EA]/22 leading-relaxed">
              The sketch documents imagination, not production. The philosophy is correct.
            </p>
          </div>

          {/* Bridge note */}
          <div className="border border-[#F4F1EA]/8 p-4 mt-auto">
            <p className="font-mono text-[7px] tracking-[0.28em] uppercase text-[#F4F1EA]/18 mb-2">
              HERO CREATION TRANSITION
            </p>
            <p className="font-sans text-[9px] text-[#F4F1EA]/28 leading-relaxed">
              MASTER-011 is the bridge between Hero Collector and Hero Creation.
              The collector's vision and the artisan's expertise occupy the same sheet of paper.
              Nothing is final. Everything is possible.
            </p>
          </div>
        </div>
      </div>

      {/* 8-parameter analysis */}
      <div className="mb-8">
        <p className="font-mono text-[8px] tracking-[0.32em] uppercase text-[#F4F1EA]/22 mb-5">
          BESPOKE SKETCH ANALYSIS · 8 PARAMETERS
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-px bg-[#F4F1EA]/5">
          {SKETCH_PARAMS.map((param) => (
            <div key={param.id} className="bg-[#0A0A08] p-6 flex gap-5">
              <div className="flex flex-col items-center gap-2 flex-shrink-0 pt-0.5">
                <span className="font-mono text-[9px] text-[#F4F1EA]/18">{param.id}</span>
                <GradeCell grade={param.grade} />
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-mono text-[10px] tracking-wider text-[#F4F1EA]/65 mb-3">{param.label}</p>
                <div className="space-y-1.5 mb-3">
                  {param.analysis.map((line, i) => (
                    <p key={i} className="font-sans text-[9px] text-[#F4F1EA]/35 leading-relaxed">{line}</p>
                  ))}
                </div>
                <p className="font-mono text-[7px] tracking-[0.28em] uppercase text-[#4ADE80]/50">
                  ✓ {param.verdict}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Final verdict */}
      <div className="p-6 border flex flex-col md:flex-row items-start md:items-center justify-between gap-5"
        style={{ borderColor: `${aPlus}30`, backgroundColor: `${aPlus}05` }}>
        <div>
          <p className="font-mono text-[7px] tracking-[0.35em] uppercase mb-3" style={{ color: `${aPlus}60` }}>
            VERDICT · MASTER-011 · THE BESPOKE SKETCH
          </p>
          <p className="font-sans text-[13px] text-[#F4F1EA]/55 leading-relaxed font-light italic mb-2">
            "The conversation becomes a drawing.
            The drawing becomes a promise.
            The promise will one day become a creation."
          </p>
          <p className="font-sans text-[10px] text-[#F4F1EA]/28 leading-relaxed">
            <span className="font-mono text-[9px] text-[#F4F1EA]/45">MILLIN_BESPOKE_MASTER_002</span>
            {" · "}MILLIN_BESPOKE_SKETCH_001 · BESPOKE-CRA-001 production file approved.
          </p>
        </div>
        <div className="flex-shrink-0 flex flex-col items-end gap-2">
          <span className="font-mono text-[32px] leading-none" style={{ color: `${aPlus}80` }}>A+</span>
          <span className="font-mono text-[8px] tracking-[0.3em] uppercase" style={{ color: `${aPlus}50` }}>
            KEEP · LOCKED
          </span>
        </div>
      </div>
    </section>
  );
}

// ─── MILLIN MOTION BIBLE v1.0 ────────────────────────────────────────────────

interface MotionRule { rule: string; note?: string; }
interface MotionChapter { number: string; title: string; doctrine: string; rules: MotionRule[]; }
interface MotionScene {
  master: string;
  scene: string;
  directive: string;
  camera: string;
  duration: string;
  motion: string;
  img: string | null;
  status: "LOCKED" | "PENDING" | "REFERENCE";
}

const MOTION_CHAPTERS: MotionChapter[] = [
  {
    number: "01",
    title: "MOTION CONSTITUTION",
    doctrine: "All motion in the MILLIN world is deliberate. Stillness is the default state. Motion is permitted only when it reveals something that stillness cannot.",
    rules: [
      { rule: "Stillness is primary. Motion is the exception.", note: "Every moving element must justify its movement." },
      { rule: "No motion faster than a natural human gesture." },
      { rule: "Motion reveals character, not spectacle." },
      { rule: "Slow is honest. Fast is theatrical. MILLIN does not perform." },
      { rule: "Frame rate: 24fps cinematic. Never 60fps. Never slow-motion unless the craft demands it." },
      { rule: "Transitions: cuts, dissolves, and very slow fades only. No wipes. No slides. No kinetic transitions." },
      { rule: "Minimum shot duration: 4 seconds. No edit shorter than 3 seconds." },
      { rule: "The House does not rush. Neither does the film." },
    ],
  },
  {
    number: "02",
    title: "CAMERA LANGUAGE",
    doctrine: "The camera is a respectful guest inside the House of MILLIN. It observes. It never intrudes. It never performs.",
    rules: [
      { rule: "Primary camera movement: none. Static observation is the default." },
      { rule: "When the camera moves: only very slow push-ins at 0.2–0.5% per second. Never pull-outs.", note: "The camera moves toward the subject, as trust deepens." },
      { rule: "No handheld. No drone. No action camera. No stabiliser rigs visible in aesthetic." },
      { rule: "No zoom lens movements. Prime lens language only." },
      { rule: "Camera height: subject-level for human scenes. Slightly below eye-level for architecture." },
      { rule: "The camera always moves slower than the subject." },
      { rule: "The frame never tilts. Horizon is always level." },
      { rule: "Rack focus: permitted only once per scene, to reveal — not to display technique." },
    ],
  },
  {
    number: "03",
    title: "LIGHT MOVEMENT",
    doctrine: "Natural light is the only light that has authority in the House. Light does not perform. It arrives, it crosses surfaces, and it leaves.",
    rules: [
      { rule: "Light changes only when the scene changes: a new hour, a new location, a new season." },
      { rule: "No artificial light sweeps, rotations, or colour shifts." },
      { rule: "Light never calls attention to itself. It reveals — it does not announce." },
      { rule: "The passage of time: shown only through subtle light shift across walnut, limestone, and paper." },
      { rule: "The enamel kiln flame is the only light source permitted to move rapidly.", note: "Fire is the sole exception to the stillness doctrine." },
      { rule: "Shadow movement: permitted only when caused by natural change — passing cloud, turning page, moving hand." },
      { rule: "Golden hour is permitted for exterior House shots. Never for interior craft scenes." },
    ],
  },
  {
    number: "04",
    title: "MATERIAL MOTION",
    doctrine: "Each material in the MILLIN world has its own motion vocabulary. The material dictates the speed and character of its movement — never the director.",
    rules: [
      { rule: "Paper: slow turn, weighted, the deckled edge catching light as it moves.", note: "Handmade paper never snaps or flutters. It breathes." },
      { rule: "Metal: essentially still. Revealed only by moving light or a very slow camera rotation." },
      { rule: "Leather: natural fall only. No theatrical drape. No commercial styling." },
      { rule: "Fire: the only truly kinetic material. The flame moves freely — this is the craft's heartbeat." },
      { rule: "Pencil on paper: slow, deliberate strokes. The pressure and pace of the artisan's thought." },
      { rule: "Tool meeting metal: a single decisive gesture. Not repeated for effect." },
      { rule: "Graphite shavings: fall naturally. Never blown or placed." },
      { rule: "Enamel powder: poured slowly. The colour lands before the fire transforms it." },
    ],
  },
  {
    number: "05",
    title: "HUMAN MOTION RULES",
    doctrine: "ARTISAN-001 and the Collector move as people, not as subjects. The camera does not choreograph them. They choreograph themselves.",
    rules: [
      { rule: "ARTISAN-001 never poses. He moves as if the camera is not present." },
      { rule: "Only purposeful gestures: reaching for a tool, turning a page, lifting a pencil, examining a surface." },
      { rule: "Walking is not permitted in craft scenes. Reserved for architectural transitions between spaces only." },
      { rule: "All human motion is slightly slower than instinctive — the weight of deliberation.", note: "The artisan takes his time. The film takes its time with him." },
      { rule: "The Collector enters the frame naturally — never dramatically. Sits, leans, listens." },
      { rule: "Hands are the most expressive element. Close-ups of hands in motion are the primary human image." },
      { rule: "Eye contact with camera: never. The artisan's eyes follow his work. The collector's eyes follow the artisan." },
      { rule: "No performance of emotion. The material elicits feeling. The person simply works." },
    ],
  },
  {
    number: "06",
    title: "MASTER MOTION MAP",
    doctrine: "The twelve scenes of the MILLIN film — each with its own motion directive, camera instruction, and duration guidance. The sequence is the House telling its own story.",
    rules: [],
  },
];

const MOTION_SCENES: MotionScene[] = [
  {
    master: "MASTER-001", scene: "HOUSE FILM",
    directive: "Static wide. The exterior of the House at dawn — before anyone arrives.",
    camera: "Fixed. No motion. Let the light do the work.",
    duration: "10–14 s", motion: "Leaves in the garden. Nothing else.",
    img: houseArc001, status: "REFERENCE",
  },
  {
    master: "MASTER-002", scene: "PRIVATE SALON",
    directive: "Slow push-in on the empty round walnut table. The chairs await.",
    camera: "Imperceptibly slow push-in. 0.3% per second.",
    duration: "8–12 s", motion: "Daylight crossing the table surface as time passes.",
    img: salonArc001, status: "REFERENCE",
  },
  {
    master: "MASTER-003", scene: "LIBRARY",
    directive: "Static. Books. Lamp. Open window. One page turns, alone.",
    camera: "Fixed. Eye-level to the desk.",
    duration: "8 s", motion: "Single page turn. Wind through the window. Nothing else.",
    img: libraryArc001, status: "REFERENCE",
  },
  {
    master: "MASTER-004", scene: "ATELIER",
    directive: "The workbench before the artisan arrives. Tools wait.",
    camera: "Very slow dolly left-to-right across the bench surface.",
    duration: "8–10 s", motion: "Camera only. No subject movement.",
    img: atelierArc002, status: "REFERENCE",
  },
  {
    master: "MASTER-005", scene: "WORKBENCH",
    directive: "The bench after the artisan has left his trace. Sketch pad, pencil resting, tools arranged.",
    camera: "Static. Slightly above bench level.",
    duration: "6–8 s", motion: "None. Stillness is the statement.",
    img: masterArc001, status: "LOCKED",
  },
  {
    master: "MASTER-006", scene: "ARTISAN",
    directive: "Cut to ARTISAN-001 mid-gesture. Already working. Camera finds him — he doesn't find it.",
    camera: "Static, or imperceptible push-in over 8 seconds.",
    duration: "8–12 s", motion: "The artisan. The pencil. The paper.",
    img: humanAct001, status: "LOCKED",
  },
  {
    master: "MASTER-007", scene: "FIRE",
    directive: "The enamel kiln. The only moment of unrestrained movement in the film.",
    camera: "Fixed macro. Let the fire fill the frame.",
    duration: "6–8 s", motion: "Flame only. The spatula enters slowly.",
    img: enamelCra001, status: "LOCKED",
  },
  {
    master: "MASTER-008", scene: "HAND",
    directive: "Extreme close-up. Burin meeting metal. Gold shavings falling in real time.",
    camera: "Absolutely static. Macro prime. No autofocus.",
    duration: "4–6 s per stroke", motion: "Only the burin and the shavings. The hand is still between cuts.",
    img: engravingCra001, status: "LOCKED",
  },
  {
    master: "MASTER-009", scene: "GEOMETRY",
    directive: "The guilloché pattern emerging stroke by stroke. The machine as instrument of the hand.",
    camera: "Static overhead macro, or static side profile.",
    duration: "8–10 s", motion: "Tool and pattern only. The geometry grows.",
    img: null, status: "PENDING",
  },
  {
    master: "MASTER-010", scene: "CONVERSATION",
    directive: "The artisan and collector at the round table. One long take. No cut within the shot.",
    camera: "Static at respectful distance. Never closer than 2 metres.",
    duration: "12–16 s minimum", motion: "The people. The papers. The light from the window.",
    img: bespokeM001, status: "LOCKED",
  },
  {
    master: "MASTER-011", scene: "SKETCH",
    directive: "ARTISAN-001 drawing. The pencil commits. Ideas become lines.",
    camera: "Imperceptibly slow push-in over 8 seconds. Stop before the hands fill the frame.",
    duration: "10–14 s", motion: "Pencil on paper. Camera breathing toward the sketch.",
    img: bespokeCra001, status: "LOCKED",
  },
  {
    master: "MASTER-012", scene: "THE REVEAL",
    directive: "The finished creation. Placed, not displayed. The artisan steps back. The camera stays.",
    camera: "Static. Let the object and the silence fill the frame.",
    duration: "12–18 s", motion: "None. The object is still. The film is still. This is the end.",
    img: null, status: "PENDING",
  },
];

const STATUS_STYLE: Record<MotionScene["status"], { text: string; border: string; label: string }> = {
  LOCKED:    { text: "#4ADE80", border: "#4ADE80", label: "LOCKED" },
  PENDING:   { text: "#F4F1EA", border: "#F4F1EA", label: "PENDING" },
  REFERENCE: { text: "#9A8968", border: "#9A8968", label: "REFERENCE" },
};

function MotionBible() {
  const [activeChapter, setActiveChapter] = useState("01");

  const chapter = MOTION_CHAPTERS.find(c => c.number === activeChapter)!;

  return (
    <section className="mb-20">

      {/* Header */}
      <div className="flex items-start justify-between mb-10 border-b border-[#F4F1EA]/8 pb-5 gap-6">
        <div>
          <p className="font-mono text-[9px] tracking-[0.35em] uppercase text-[#9A8968] mb-2">
            INTERNAL PRODUCTION DOCUMENT
          </p>
          <h2 className="font-sans text-[22px] text-[#F4F1EA]/80 font-light tracking-wide">
            MILLIN MOTION BIBLE
          </h2>
          <p className="font-mono text-[11px] text-[#9A8968] tracking-[0.22em] mt-1">v1.0</p>
        </div>
        <div className="text-right flex-shrink-0">
          <p className="font-mono text-[8px] tracking-widest uppercase text-[#F4F1EA]/18">6 CHAPTERS</p>
          <p className="font-mono text-[8px] tracking-widest uppercase text-[#F4F1EA]/18 mt-1">12 SCENES</p>
        </div>
      </div>

      {/* Chapter navigation */}
      <div className="flex flex-wrap gap-1 mb-10">
        {MOTION_CHAPTERS.map((ch) => (
          <button
            key={ch.number}
            onClick={() => setActiveChapter(ch.number)}
            className={`font-mono text-[8px] tracking-[0.2em] uppercase px-4 py-2 border transition-all duration-200 ${
              activeChapter === ch.number
                ? "border-[#9A8968] text-[#9A8968] bg-[#9A8968]/8"
                : "border-[#F4F1EA]/10 text-[#F4F1EA]/28 hover:border-[#F4F1EA]/22 hover:text-[#F4F1EA]/45"
            }`}
          >
            {ch.number} — {ch.title}
          </button>
        ))}
      </div>

      {/* Chapters 01–05 — doctrine + rules */}
      {activeChapter !== "06" && (
        <div className="grid grid-cols-1 md:grid-cols-12 gap-px bg-[#F4F1EA]/5">

          {/* Large chapter number */}
          <div className="hidden md:flex md:col-span-1 bg-[#0A0A08] items-end p-6 pb-10">
            <p className="font-mono text-[#F4F1EA]/5 leading-none select-none"
              style={{ fontSize: "72px", writingMode: "vertical-rl", transform: "rotate(180deg)" }}>
              {chapter.number}
            </p>
          </div>

          {/* Doctrine + rules */}
          <div className="md:col-span-7 bg-[#0A0A08] px-8 md:px-12 py-12 flex flex-col gap-10">
            <div>
              <p className="font-mono text-[9px] tracking-[0.35em] uppercase text-[#9A8968]/60 mb-5">
                {chapter.title}
              </p>
              <p className="font-sans text-[13px] text-[#F4F1EA]/50 leading-loose tracking-wide italic">
                {chapter.doctrine}
              </p>
            </div>

            <div className="space-y-px">
              {chapter.rules.map((item, i) => (
                <div key={i} className={`flex gap-5 p-4 border-l-2 ${i === 0 ? "border-[#9A8968]/40 bg-[#F4F1EA]/4" : "border-[#F4F1EA]/8 bg-[#F4F1EA]/2"}`}>
                  <span className="font-mono text-[9px] text-[#F4F1EA]/18 flex-shrink-0 mt-0.5 w-5">{String(i + 1).padStart(2, "0")}</span>
                  <div className="flex-1">
                    <p className={`font-sans text-[10px] leading-relaxed ${i === 0 ? "text-[#F4F1EA]/65" : "text-[#F4F1EA]/42"}`}>
                      {item.rule}
                    </p>
                    {item.note && (
                      <p className="font-sans text-[9px] text-[#9A8968]/50 italic mt-1 leading-relaxed">
                        {item.note}
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right margin — chapter annotation */}
          <div className="md:col-span-4 bg-[#0D0D0B] p-8 flex flex-col gap-8">
            <div>
              <p className="font-mono text-[7px] tracking-[0.35em] uppercase text-[#F4F1EA]/18 mb-4">
                PRINCIPLE
              </p>
              <p className="font-sans text-[22px] md:text-[26px] text-[#F4F1EA]/30 font-light leading-tight tracking-wide">
                {chapter.number === "01" && <>Stillness<br />is the<br />default.</>}
                {chapter.number === "02" && <>The camera<br />is a<br />guest.</>}
                {chapter.number === "03" && <>Natural<br />light<br />has authority.</>}
                {chapter.number === "04" && <>The material<br />dictates<br />its motion.</>}
                {chapter.number === "05" && <>They move<br />as people,<br />not subjects.</>}
              </p>
            </div>

            <div className="border-t border-[#F4F1EA]/8 pt-6">
              <p className="font-mono text-[7px] tracking-[0.32em] uppercase text-[#F4F1EA]/18 mb-3">
                CHAPTER {chapter.number} OF 06
              </p>
              <p className="font-sans text-[9px] text-[#F4F1EA]/22 leading-relaxed">
                {chapter.number === "01" && "The laws that govern all motion across every scene, every chapter, every frame of MILLIN film."}
                {chapter.number === "02" && "How the camera positions itself in relation to the House, the artisan, and the collector."}
                {chapter.number === "03" && "Light transitions and the behaviour of natural light across surfaces and time."}
                {chapter.number === "04" && "How paper, metal, leather, fire, and pigment move — each at their own pace, in their own character."}
                {chapter.number === "05" && "The motion vocabulary of ARTISAN-001 and the Collector — purposeful, unperforming, honest."}
              </p>
            </div>

            {/* Quick reference summary */}
            <div className="border border-[#F4F1EA]/8 p-4 mt-auto">
              <p className="font-mono text-[7px] tracking-[0.28em] uppercase text-[#F4F1EA]/20 mb-3">
                QUICK REFERENCE
              </p>
              <div className="space-y-2">
                {chapter.rules.slice(0, 3).map((item, i) => (
                  <p key={i} className="font-sans text-[8px] text-[#F4F1EA]/25 leading-relaxed">
                    — {item.rule.length > 55 ? item.rule.slice(0, 55) + "…" : item.rule}
                  </p>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Chapter 06 — Master Motion Map */}
      {activeChapter === "06" && (
        <div>
          <div className="mb-8">
            <p className="font-sans text-[13px] text-[#F4F1EA]/40 italic leading-relaxed max-w-2xl">
              {MOTION_CHAPTERS[5].doctrine}
            </p>
          </div>

          {/* Scene table */}
          <div className="overflow-x-auto mb-8">
            <table className="w-full border-collapse">
              <thead>
                <tr className="border-b border-[#F4F1EA]/10">
                  <th className="font-mono text-[7px] tracking-widest uppercase text-[#F4F1EA]/25 text-left py-3 px-3 w-24">MASTER</th>
                  <th className="font-mono text-[7px] tracking-widest uppercase text-[#F4F1EA]/25 text-left py-3 px-3 w-10">IMG</th>
                  <th className="font-mono text-[7px] tracking-widest uppercase text-[#F4F1EA]/25 text-left py-3 px-3 w-28">SCENE</th>
                  <th className="font-mono text-[7px] tracking-widest uppercase text-[#F4F1EA]/25 text-left py-3 px-3">MOTION DIRECTIVE</th>
                  <th className="font-mono text-[7px] tracking-widest uppercase text-[#F4F1EA]/25 text-left py-3 px-3 w-40">CAMERA</th>
                  <th className="font-mono text-[7px] tracking-widest uppercase text-[#F4F1EA]/25 text-center py-3 px-3 w-20">DURATION</th>
                  <th className="font-mono text-[7px] tracking-widest uppercase text-[#F4F1EA]/25 text-center py-3 px-3 w-20">STATUS</th>
                </tr>
              </thead>
              <tbody>
                {MOTION_SCENES.map((scene, i) => {
                  const st = STATUS_STYLE[scene.status];
                  return (
                    <tr key={scene.master}
                      className={`border-b border-[#F4F1EA]/5 ${i % 2 === 0 ? "bg-transparent" : "bg-[#F4F1EA]/2"}`}>
                      <td className="py-4 px-3 align-top">
                        <p className="font-mono text-[8px] text-[#F4F1EA]/40 tracking-widest">{scene.master}</p>
                      </td>
                      <td className="py-4 px-3 align-top">
                        {scene.img ? (
                          <div className="w-10 h-8 overflow-hidden flex-shrink-0">
                            <img src={scene.img} alt={scene.master}
                              className="w-full h-full object-cover"
                              style={{ filter: "brightness(0.65) saturate(0.7)" }} />
                          </div>
                        ) : (
                          <div className="w-10 h-8 bg-[#161612] flex items-center justify-center">
                            <span className="font-mono text-[6px] text-[#F4F1EA]/14">—</span>
                          </div>
                        )}
                      </td>
                      <td className="py-4 px-3 align-top">
                        <p className="font-mono text-[9px] text-[#F4F1EA]/60 tracking-wide">{scene.scene}</p>
                      </td>
                      <td className="py-4 px-3 align-top">
                        <p className="font-sans text-[9px] text-[#F4F1EA]/35 leading-relaxed">{scene.directive}</p>
                        <p className="font-sans text-[8px] text-[#F4F1EA]/18 leading-relaxed mt-1 italic">{scene.motion}</p>
                      </td>
                      <td className="py-4 px-3 align-top">
                        <p className="font-sans text-[8px] text-[#F4F1EA]/28 leading-relaxed">{scene.camera}</p>
                      </td>
                      <td className="py-4 px-3 text-center align-top">
                        <span className="font-mono text-[8px] text-[#F4F1EA]/30 whitespace-nowrap">{scene.duration}</span>
                      </td>
                      <td className="py-4 px-3 text-center align-top">
                        <span className="font-mono text-[7px] tracking-widest uppercase px-2 py-0.5 border"
                          style={{ color: `${st.text}80`, borderColor: `${st.border}30` }}>
                          {st.label}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Sequence note */}
          <div className="border border-[#F4F1EA]/8 bg-[#0D0D0B] p-6">
            <p className="font-mono text-[7px] tracking-[0.32em] uppercase text-[#F4F1EA]/20 mb-4">
              THE SEQUENCE AS NARRATIVE
            </p>
            <div className="flex flex-wrap gap-2 items-center">
              {MOTION_SCENES.map((scene, i) => (
                <div key={scene.master} className="flex items-center gap-2">
                  <span className="font-sans text-[9px] text-[#F4F1EA]/35">{scene.scene}</span>
                  {i < MOTION_SCENES.length - 1 && (
                    <span className="font-mono text-[8px] text-[#F4F1EA]/14">→</span>
                  )}
                </div>
              ))}
            </div>
            <p className="font-sans text-[9px] text-[#F4F1EA]/22 italic leading-relaxed mt-5">
              The House introduces itself. Then the Place. Then the Workbench. Then the Master.
              Then the Craft in all its registers — Fire, Hand, Geometry.
              Then the Relationship — Conversation, Sketch.
              Then the promise: The Reveal.
            </p>
          </div>
        </div>
      )}
    </section>
  );
}

// ─── GUILLOCHE-CRA-001 Craft Check ───────────────────────────────────────────

const GUILLOCHE_PARAMS: Array<{ id: string; label: string; grade: Grade; note: string; isPrimary?: boolean }> = [
  { id: "01", label: "CRAFT TECHNIQUE",     grade: "A+", note: "Fan wave engine-turning — classic barleycorn variant. Pattern radiates from a vanishing point. Genuinely hand-guided, not CNC.", isPrimary: true },
  { id: "02", label: "PATTERN AUTHENTICITY",grade: "A+", note: "Fine parallel ridges with natural variation in spacing and curve. Mathematical regularity with organic character — the signature of the rose engine." },
  { id: "03", label: "MATERIAL",            grade: "A",  note: "Gold or brass dial blank — warm tone, appropriate metal for guilloché dial work." },
  { id: "04", label: "RAKING LIGHT",        grade: "A+", note: "Light enters at a low angle, catching every ridge. This is the definitive way to reveal guilloché depth. No other lighting would communicate the work." },
  { id: "05", label: "MACHINERY CONTEXT",   grade: "A",  note: "Rose engine visible in background bokeh. The machine is present — the craft context is established without dominating the frame." },
  { id: "06", label: "NO HUMAN FOCUS",      grade: "A",  note: "No hand visible. The pattern is the subject. The craftsman's presence is implied by the precision, not shown." },
  { id: "07", label: "NO PRODUCT FOCUS",    grade: "A",  note: "Raw blank in process — not a finished dial, not a finished watch. Pure craft stage." },
  { id: "08", label: "MACRO QUALITY",       grade: "A+", note: "Every groove sharp across the full frame. Depth of field is controlled to reveal maximum pattern detail. Technically exceptional." },
  { id: "09", label: "GEOMETRIC PRECISION", grade: "A+", note: "The mathematical beauty of the fan wave speaks to the MILLIN craft philosophy — precision as a form of art." },
  { id: "10", label: "PHOTO CONTINUITY",    grade: "A",  note: "Warm craft tones, same editorial restraint. Consistent with ENAMEL-CRA-001 and ENGRAVING-CRA-001 in the CRAFT register." },
];

function GuillocheCheck() {
  return (
    <section className="mb-20">

      <div className="flex items-baseline justify-between mb-8 border-b border-[#F4F1EA]/8 pb-5">
        <div>
          <p className="font-mono text-[9px] tracking-[0.35em] uppercase text-[#9A8968] mb-2">
            GUILLOCHE-CRA-001 · CRAFT CONTINUITY CHECK
          </p>
          <h2 className="font-sans text-[20px] text-[#F4F1EA]/80 font-light tracking-wide">
            The Engine — Guilloché
          </h2>
        </div>
        <div className="flex items-center gap-2 border border-[#4ADE80]/30 bg-[#4ADE80]/6 px-4 py-2">
          <span className="w-2 h-2 rounded-full bg-[#4ADE80]" />
          <span className="font-mono text-[10px] tracking-[0.3em] uppercase text-[#4ADE80]">
            CRA v1.0 · APPROVED
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-5 gap-px bg-[#F4F1EA]/5 mb-8">

        {/* Image */}
        <div className="md:col-span-2 bg-[#0A0A08] flex flex-col">
          <div className="relative overflow-hidden flex-1" style={{ minHeight: "320px" }}>
            <img
              src={guillocheCra001}
              alt="GUILLOCHE-CRA-001"
              className="w-full h-full object-cover"
              style={{ filter: "brightness(0.92) contrast(1.02) saturate(0.86)" }}
            />
            <div className="absolute top-3 right-3">
              <span className="font-mono text-[12px] w-9 h-9 flex items-center justify-center border text-[#A78BFA] border-[#A78BFA]/40 bg-[#A78BFA]/12">
                A+
              </span>
            </div>
            <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-[#0A0A08]/95 via-[#0A0A08]/50 to-transparent">
              <p className="font-mono text-[8px] tracking-[0.25em] uppercase text-[#4ADE80] mb-1">KEEP · MILLIN ORIGINAL</p>
              <p className="font-mono text-[9px] text-[#F4F1EA]/50">MILLIN_CRAFT_GUILLOCHE_001</p>
            </div>
          </div>
          <div className="p-5 bg-[#0D0D0B] flex flex-col gap-3">
            <div>
              <p className="font-mono text-[7px] tracking-[0.32em] uppercase text-[#F4F1EA]/20 mb-2">PATTERN TYPE</p>
              <p className="font-sans text-[9px] text-[#F4F1EA]/35 leading-relaxed">
                Fan wave — barleycorn variant. Radiating from a vanishing point, each ridge following the curvature of the rose engine's rotation.
              </p>
            </div>
            <div className="border-t border-[#F4F1EA]/8 pt-3">
              <p className="font-mono text-[7px] tracking-[0.32em] uppercase text-[#F4F1EA]/20 mb-2">CRAFT POSITION</p>
              <p className="font-sans text-[9px] text-[#F4F1EA]/28 leading-relaxed">
                Guilloché is the foundation beneath all MILLIN dial work — applied before enamel, before painting, before the dial becomes a creation.
              </p>
            </div>
            <div className="border-t border-[#F4F1EA]/8 pt-3">
              <p className="font-mono text-[7px] tracking-[0.32em] uppercase text-[#F4F1EA]/20 mb-2">MASTER MOTION MAP</p>
              <p className="font-sans text-[9px] text-[#F4F1EA]/28 leading-relaxed">
                This image is the reference frame for <span className="font-mono text-[8px] text-[#9A8968]/60">MASTER-009 · GEOMETRY</span> — currently PENDING in the Motion Bible.
              </p>
            </div>
          </div>
        </div>

        {/* Parameters */}
        <div className="md:col-span-3 bg-[#0A0A08]">
          <table className="w-full border-collapse">
            <thead>
              <tr className="border-b border-[#F4F1EA]/10">
                <th className="font-mono text-[8px] tracking-widest uppercase text-[#F4F1EA]/25 text-left py-3 pr-3 pl-5 w-6">#</th>
                <th className="font-mono text-[8px] tracking-widest uppercase text-[#F4F1EA]/25 text-left py-3 pr-6 w-36">PARAMETER</th>
                <th className="font-mono text-[8px] tracking-widest uppercase text-[#F4F1EA]/25 text-center py-3 px-3 w-14">GRADE</th>
                <th className="font-mono text-[8px] tracking-widest uppercase text-[#F4F1EA]/25 text-left py-3 pl-4 pr-5">READING</th>
              </tr>
            </thead>
            <tbody>
              {GUILLOCHE_PARAMS.map((param, i) => (
                <tr key={param.id}
                  className={`border-b border-[#F4F1EA]/5 ${param.isPrimary ? "bg-[#9A8968]/5" : i % 2 === 0 ? "bg-transparent" : "bg-[#F4F1EA]/2"}`}>
                  <td className="font-mono text-[8px] text-[#F4F1EA]/18 py-3.5 pr-3 pl-5 align-top">{param.id}</td>
                  <td className={`font-mono text-[9px] py-3.5 pr-6 align-top tracking-wider ${param.isPrimary ? "text-[#9A8968]/75" : "text-[#F4F1EA]/55"}`}>
                    {param.label}
                    {param.isPrimary && (
                      <span className="block font-mono text-[6px] tracking-widest uppercase text-[#9A8968]/40 mt-0.5">KEY</span>
                    )}
                  </td>
                  <td className="py-3.5 px-3 text-center align-top">
                    <GradeCell grade={param.grade} />
                  </td>
                  <td className="font-sans text-[9px] py-3.5 pl-4 pr-5 align-top leading-relaxed text-[#F4F1EA]/28">
                    {param.note}
                  </td>
                </tr>
              ))}
              <tr className="border-t-2 border-[#F4F1EA]/14">
                <td colSpan={2} className="font-mono text-[9px] tracking-[0.25em] uppercase text-[#F4F1EA]/35 py-5 pl-5">VERDICT</td>
                <td className="py-5 px-3 text-center"><GradeCell grade="A+" /></td>
                <td className="font-sans text-[9px] text-[#F4F1EA]/28 py-5 pl-4 pr-5 leading-relaxed">
                  5 × A+, 5 × A. The guilloché image is technically and photographically exceptional. Raking light reveals the work completely. This is the definitive MILLIN guilloché reference frame. MASTER-009 · GEOMETRY — now resolved.
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* MASTER-009 update notice */}
      <div className="border border-[#4ADE80]/20 bg-[#4ADE80]/4 p-5 flex items-center justify-between">
        <div>
          <p className="font-sans text-[10px] text-[#4ADE80]/70 leading-relaxed">
            <strong className="text-[#4ADE80]/90">GUILLOCHE-CRA-001 approved.</strong>{" "}
            Guilloché register established. Slot: <span className="font-mono text-[9px]">MILLIN_CRAFT_GUILLOCHE_001</span>
          </p>
          <p className="font-sans text-[9px] text-[#4ADE80]/45 mt-1 leading-relaxed">
            Motion Bible update: <span className="font-mono text-[8px]">MASTER-009 · GEOMETRY</span> now has its reference frame. Status should be updated from PENDING → REFERENCE.
          </p>
        </div>
        <span className="font-mono text-[9px] tracking-widest uppercase text-[#4ADE80]/40 ml-6 flex-shrink-0">
          CRA v1.0 · APPROVED
        </span>
      </div>
    </section>
  );
}

// ─── CREATION-YT-001 Check ───────────────────────────────────────────────────

const CREATION_YT_PARAMS: Array<{ id: string; label: string; grade: Grade; note: string; isPrimary?: boolean }> = [
  { id: "01", label: "CRAFT VISIBILITY",    grade: "A+", note: "Hand engraving on bezel scrollwork and gold relief tiger on dial — both métiers clearly visible and celebrated.", isPrimary: true },
  { id: "02", label: "CASE ENGRAVING",      grade: "A+", note: "Rose gold bezel fully engraved with intricate scrollwork. Continuous pattern, no interruption. Burin work recognisable from ENGRAVING-CRA-001." },
  { id: "03", label: "MINIATURE PAINTING",  grade: "A+", note: "Gold relief tiger, landscape, mountains, foliage on mother-of-pearl base. Grand feu enamel and miniature painting visible. Connects to ENAMEL-CRA-001." },
  { id: "04", label: "PHOTOGRAPHY",         grade: "A",  note: "Editorial observation. Not a flat-surface commercial shot. The watch is present, not displayed. Bokeh background gives depth." },
  { id: "05", label: "ARCHITECTURAL CONTEXT", grade: "A", note: "Warm limestone columns in background bokeh — unmistakably the House of MILLIN. Architecture frames the creation without staging it." },
  { id: "06", label: "DISPLAY PLATFORM",    grade: "A",  note: "Patinated bronze pedestal — restrained, contextual, appropriate. Not a retail plinth. Not a velvet box." },
  { id: "07", label: "NO RETAIL AESTHETIC", grade: "A",  note: "No boutique lighting. No white background. No price-point signalling. The watch lives inside the House narrative." },
  { id: "08", label: "PHOTO CONTINUITY",    grade: "A",  note: "Shallow depth of field, same warm limestone palette, same editorial restraint as all MILLIN ORIGINAL assets." },
];

function CreationYellowTigerCheck() {
  return (
    <section className="mb-20">

      <div className="flex items-baseline justify-between mb-8 border-b border-[#F4F1EA]/8 pb-5">
        <div>
          <p className="font-mono text-[9px] tracking-[0.35em] uppercase text-[#9A8968] mb-2">
            CREATION-YT-001 · CREATION CONTINUITY CHECK
          </p>
          <h2 className="font-sans text-[20px] text-[#F4F1EA]/80 font-light tracking-wide">
            Yellow Tiger
          </h2>
        </div>
        <div className="flex items-center gap-2 border border-[#A78BFA]/30 bg-[#A78BFA]/6 px-4 py-2">
          <span className="w-2 h-2 rounded-full bg-[#A78BFA]" />
          <span className="font-mono text-[10px] tracking-[0.3em] uppercase text-[#A78BFA]">
            CREATION v1.0 · APPROVED
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-5 gap-px bg-[#F4F1EA]/5 mb-8">

        {/* Image */}
        <div className="md:col-span-2 bg-[#0A0A08] flex flex-col">
          <div className="relative overflow-hidden flex-1" style={{ minHeight: "340px" }}>
            <img
              src={creationYt001}
              alt="CREATION-YT-001 — Yellow Tiger"
              className="w-full h-full object-cover object-center"
              style={{ filter: "brightness(0.94) contrast(0.98) saturate(0.88)" }}
            />
            <div className="absolute top-3 right-3">
              <span className="font-mono text-[12px] w-9 h-9 flex items-center justify-center border text-[#A78BFA] border-[#A78BFA]/40 bg-[#A78BFA]/12">
                A+
              </span>
            </div>
            <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-[#0A0A08]/95 via-[#0A0A08]/50 to-transparent">
              <p className="font-mono text-[8px] tracking-[0.25em] uppercase text-[#A78BFA] mb-1">KEEP · MILLIN ORIGINAL</p>
              <p className="font-mono text-[9px] text-[#F4F1EA]/50">MILLIN_CREATION_YELLOW_TIGER_001</p>
            </div>
          </div>

          <div className="p-5 bg-[#0D0D0B] flex flex-col gap-3">
            <div>
              <p className="font-mono text-[7px] tracking-[0.32em] uppercase text-[#F4F1EA]/20 mb-2">CRAFT CONNECTION</p>
              <div className="space-y-2">
                {[
                  { label: "Bezel engraving", ref: "ENGRAVING-CRA-001", color: "#4ADE80" },
                  { label: "Dial painting", ref: "ENAMEL-CRA-001", color: "#4ADE80" },
                  { label: "House backdrop", ref: "HOUSE-ARC-001 (limestone)", color: "#9A8968" },
                ].map((link) => (
                  <div key={link.label} className="flex items-center justify-between gap-3">
                    <span className="font-sans text-[9px] text-[#F4F1EA]/30">{link.label}</span>
                    <span className="font-mono text-[7px] tracking-widest px-1.5 py-0.5 border"
                      style={{ color: `${link.color}70`, borderColor: `${link.color}25` }}>
                      {link.ref}
                    </span>
                  </div>
                ))}
              </div>
            </div>
            <div className="border-t border-[#F4F1EA]/8 pt-3">
              <p className="font-mono text-[7px] tracking-[0.32em] uppercase text-[#F4F1EA]/20 mb-1.5">MÉTIERS VISIBLE</p>
              <p className="font-sans text-[9px] text-[#F4F1EA]/28 leading-relaxed">
                Grand Feu Enamel · Hand Engraving · Miniature Painting · Gold Relief
              </p>
            </div>
          </div>
        </div>

        {/* Parameters */}
        <div className="md:col-span-3 bg-[#0A0A08]">
          <table className="w-full border-collapse">
            <thead>
              <tr className="border-b border-[#F4F1EA]/10">
                <th className="font-mono text-[8px] tracking-widest uppercase text-[#F4F1EA]/25 text-left py-3 pr-3 pl-5 w-6">#</th>
                <th className="font-mono text-[8px] tracking-widest uppercase text-[#F4F1EA]/25 text-left py-3 pr-6 w-36">PARAMETER</th>
                <th className="font-mono text-[8px] tracking-widest uppercase text-[#F4F1EA]/25 text-center py-3 px-3 w-14">GRADE</th>
                <th className="font-mono text-[8px] tracking-widest uppercase text-[#F4F1EA]/25 text-left py-3 pl-4 pr-5">READING</th>
              </tr>
            </thead>
            <tbody>
              {CREATION_YT_PARAMS.map((param, i) => (
                <tr key={param.id}
                  className={`border-b border-[#F4F1EA]/5 ${param.isPrimary ? "bg-[#A78BFA]/5" : i % 2 === 0 ? "bg-transparent" : "bg-[#F4F1EA]/2"}`}>
                  <td className="font-mono text-[8px] text-[#F4F1EA]/18 py-4 pr-3 pl-5 align-top">{param.id}</td>
                  <td className={`font-mono text-[9px] py-4 pr-6 align-top tracking-wider ${param.isPrimary ? "text-[#A78BFA]/80" : "text-[#F4F1EA]/55"}`}>
                    {param.label}
                    {param.isPrimary && (
                      <span className="block font-mono text-[6px] tracking-widest uppercase text-[#A78BFA]/40 mt-0.5">PRIMARY</span>
                    )}
                  </td>
                  <td className="py-4 px-3 text-center align-top">
                    <GradeCell grade={param.grade} />
                  </td>
                  <td className="font-sans text-[9px] py-4 pl-4 pr-5 align-top leading-relaxed text-[#F4F1EA]/28">
                    {param.note}
                  </td>
                </tr>
              ))}
              <tr className="border-t-2 border-[#F4F1EA]/14">
                <td colSpan={2} className="font-mono text-[9px] tracking-[0.25em] uppercase text-[#F4F1EA]/35 py-5 pl-5">VERDICT</td>
                <td className="py-5 px-3 text-center"><GradeCell grade="A+" /></td>
                <td className="font-sans text-[9px] text-[#F4F1EA]/28 py-5 pl-4 pr-5 leading-relaxed">
                  3 × A+, 5 × A. The creation is fully visible in its making — engraving and painting readable in a single frame. The House is present in the background. Nothing about this image resembles a commercial watch photograph.
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <div className="border border-[#A78BFA]/20 bg-[#A78BFA]/4 p-5 flex items-center justify-between">
        <p className="font-sans text-[10px] text-[#A78BFA]/70 leading-relaxed">
          <strong className="text-[#A78BFA]/90">CREATION-YT-001 approved.</strong>{" "}
          The Yellow Tiger establishes the CREATION visual register — craft visible, House present, no retail aesthetic.
          Slot: <span className="font-mono text-[9px]">MILLIN_CREATION_YELLOW_TIGER_001</span>
        </p>
        <span className="font-mono text-[9px] tracking-widest uppercase text-[#A78BFA]/40 ml-6 flex-shrink-0">
          CREATION v1.0 · APPROVED
        </span>
      </div>
    </section>
  );
}

// ─── Slot card ────────────────────────────────────────────────────────────────

function SlotCard({ slot }: { slot: string }) {
  const meta = MILLIN_META[slot];
  const imgSrc = asset(slot, 600, 450);
  const [imgError, setImgError] = useState(false);

  return (
    <div className="border border-[#F4F1EA]/8 bg-[#0D0D0B] flex flex-col">
      <div className="relative overflow-hidden" style={{ aspectRatio: "4/3" }}>
        {!imgError ? (
          <img
            src={imgSrc}
            alt={slot}
            className="w-full h-full object-cover"
            style={{ filter: "brightness(0.9) contrast(0.97) saturate(0.88)" }}
            onError={() => setImgError(true)}
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-[#161612]">
            <span className="font-mono text-[10px] text-[#F4F1EA]/14 tracking-widest">NO IMAGE</span>
          </div>
        )}
        <div className="absolute top-3 left-3">
          <StatusBadge status={meta?.status ?? "PLACEHOLDER"} />
        </div>
        {meta?.version && (
          <div className="absolute top-3 right-3">
            <span className="font-mono text-[8px] tracking-widest text-[#F4F1EA]/28 bg-[#0A0A08]/70 px-2 py-0.5">
              {meta.version}
            </span>
          </div>
        )}
      </div>
      <div className="p-4 flex flex-col gap-2 flex-1">
        <p className="font-mono text-[9px] tracking-[0.12em] text-[#F4F1EA]/32 uppercase">
          {meta?.category ?? "—"}
        </p>
        <p className="font-mono text-[11px] text-[#F4F1EA]/75 leading-snug break-all">{slot}</p>
        {meta?.description && (
          <p className="font-sans text-[10px] text-[#F4F1EA]/28 leading-relaxed mt-0.5">{meta.description}</p>
        )}
        {meta?.file && (
          <p className="font-mono text-[9px] text-[#9A8968]/60 mt-auto pt-2 border-t border-[#F4F1EA]/5">
            {meta.file}
          </p>
        )}
      </div>
    </div>
  );
}

// ─── Board ────────────────────────────────────────────────────────────────────

const CATEGORIES = ["ALL", "HOUSE", "ATELIER", "CRAFT", "HUMAN", "CREATION", "BESPOKE", "SERVICE", "JOURNAL", "PROLOGUE"];

const STATS = {
  total: MILLIN_SLOTS.length,
  original: MILLIN_SLOTS.filter(s => MILLIN_META[s]?.status === "MILLIN_ORIGINAL").length,
  placeholder: MILLIN_SLOTS.filter(s => MILLIN_META[s]?.status === "PLACEHOLDER").length,
};

type ActiveTab = "continuity" | "all-slots" | "rules" | "human-check" | "evolution" | "bespoke-check" | "motion-bible";

export default function VisualWorldBoard() {
  const [activeCategory, setActiveCategory] = useState("ALL");
  const [activeTab, setActiveTab] = useState<ActiveTab>("continuity");

  const filteredSlots = MILLIN_SLOTS.filter((s) => {
    if (activeCategory === "ALL") return true;
    return MILLIN_META[s]?.category === activeCategory;
  });

  return (
    <div className="min-h-screen bg-[#0A0A08] text-[#F4F1EA]">

      {/* ── Header ── */}
      <header className="border-b border-[#F4F1EA]/8 px-8 md:px-12 py-7">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div>
            <div className="flex items-center gap-4 mb-3">
              <span className="font-mono text-[9px] tracking-[0.35em] uppercase text-[#9A8968]">INTERNAL</span>
              <span className="w-px h-3 bg-[#F4F1EA]/14" />
              <span className="font-mono text-[9px] tracking-[0.35em] uppercase text-[#F4F1EA]/25">NOT FOR PUBLICATION</span>
            </div>
            <h1 className="font-sans text-[22px] md:text-[28px] text-[#F4F1EA] tracking-[0.06em] font-light">
              MILLIN MASTER VISUAL WORLD
            </h1>
            <p className="font-mono text-[11px] text-[#9A8968] tracking-[0.22em] mt-1">
              ARCHITECTURE v1.0
            </p>
          </div>

          <div className="flex gap-6">
            <div className="text-center">
              <p className="font-mono text-[28px] text-[#F4F1EA]/80 leading-none">{STATS.total}</p>
              <p className="font-mono text-[8px] tracking-[0.28em] uppercase text-[#F4F1EA]/22 mt-1">TOTAL SLOTS</p>
            </div>
            <div className="w-px bg-[#F4F1EA]/8" />
            <div className="text-center">
              <p className="font-mono text-[28px] text-[#4ADE80] leading-none">{STATS.original}</p>
              <p className="font-mono text-[8px] tracking-[0.28em] uppercase text-[#4ADE80]/50 mt-1">ORIGINAL</p>
            </div>
            <div className="w-px bg-[#F4F1EA]/8" />
            <div className="text-center">
              <p className="font-mono text-[28px] text-[#9A8968] leading-none">{STATS.placeholder}</p>
              <p className="font-mono text-[8px] tracking-[0.28em] uppercase text-[#9A8968]/60 mt-1">PLACEHOLDER</p>
            </div>
          </div>
        </div>

        {/* Progress bar */}
        <div className="mt-6">
          <div className="flex justify-between mb-1.5">
            <span className="font-mono text-[8px] tracking-widest uppercase text-[#F4F1EA]/22">PRODUCTION PROGRESS</span>
            <span className="font-mono text-[8px] text-[#F4F1EA]/30">
              {Math.round((STATS.original / STATS.total) * 100)}%
            </span>
          </div>
          <div className="h-px bg-[#F4F1EA]/8 relative">
            <div
              className="absolute left-0 top-0 h-px bg-[#4ADE80]/60 transition-all duration-700"
              style={{ width: `${(STATS.original / STATS.total) * 100}%` }}
            />
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-1 mt-6">
          {([["evolution", "VISUAL EVOLUTION"], ["continuity", "CONTINUITY CHECKS"], ["human-check", "HERO HUMAN CHECK"], ["bespoke-check", "HERO COLLECTOR"], ["motion-bible", "MOTION BIBLE"], ["rules", "PRODUCTION RULES"], ["all-slots", "ALL VISUAL SLOTS"]] as const).map(([id, label]) => (
            <button
              key={id}
              onClick={() => setActiveTab(id)}
              className={`font-mono text-[9px] tracking-[0.2em] uppercase px-4 py-2 border transition-all duration-200 ${
                activeTab === id
                  ? "border-[#9A8968] text-[#9A8968] bg-[#9A8968]/8"
                  : "border-[#F4F1EA]/10 text-[#F4F1EA]/28 hover:border-[#F4F1EA]/22"
              }`}
            >
              {label}
            </button>
          ))}
        </div>
      </header>

      <main className="px-8 md:px-12 py-12">

        {/* ── Tab: Visual Evolution ── */}
        {activeTab === "evolution" && <VisualWorldEvolution />}

        {/* ── Tab: Continuity ── */}
        {activeTab === "continuity" && (
          <>
            <ContinuityReview />
            <CraftContinuityCheck />
            <EnamelCraftCheck />
            <EngravingCraftCheck />
            <GuillocheCheck />
            <CreationYellowTigerCheck />
          </>
        )}

        {/* ── Tab: Hero Human Check ── */}
        {activeTab === "human-check" && <HeroHumanCheck />}

        {/* ── Tab: Hero Collector ── */}
        {activeTab === "bespoke-check" && (
          <>
            <HeroCollectorCheck />
            <BespokeSketchCheck />
          </>
        )}

        {/* ── Tab: Motion Bible ── */}
        {activeTab === "motion-bible" && <MotionBible />}

        {/* ── Tab: Production Rules ── */}
        {activeTab === "rules" && (
          <>
            <Artisan001CharacterLock />
            <HumanContinuityRule />
            <HumanReferenceHierarchy />
            <PresenceOverPortrait />
          </>
        )}

        {/* ── Tab: All Slots ── */}
        {activeTab === "all-slots" && (
          <>
            <div className="flex flex-wrap gap-1.5 mb-10">
              {CATEGORIES.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  className={`font-mono text-[9px] tracking-[0.2em] uppercase px-3 py-1.5 border transition-all duration-200 ${
                    activeCategory === cat
                      ? "border-[#9A8968] text-[#9A8968] bg-[#9A8968]/8"
                      : "border-[#F4F1EA]/10 text-[#F4F1EA]/28 hover:border-[#F4F1EA]/22 hover:text-[#F4F1EA]/45"
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-px bg-[#F4F1EA]/5">
              {filteredSlots.map((slot) => <SlotCard key={slot} slot={slot} />)}
            </div>
          </>
        )}

      </main>

      {/* ── Footer ── */}
      <footer className="border-t border-[#F4F1EA]/6 px-8 md:px-12 py-6 mt-16">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
          <div className="flex items-center gap-6">
            <span className="font-mono text-[9px] tracking-widest uppercase text-[#F4F1EA]/20">MILLIN</span>
            <span className="font-mono text-[9px] text-[#F4F1EA]/12">MASTER VISUAL WORLD · ARCHITECTURE v1.0</span>
          </div>
          <div className="flex items-center gap-6">
            <span className="font-mono text-[8px] tracking-widest text-[#F4F1EA]/14">
              PREPARED FOR: NANABANA PRO · KLING 3.0 · MILLIN PHOTOGRAPHY
            </span>
            <a
              href="#"
              className="font-mono text-[8px] tracking-widest uppercase text-[#9A8968]/40 hover:text-[#9A8968] transition-colors"
              onClick={(e) => { e.preventDefault(); window.location.hash = ""; window.location.reload(); }}
            >
              ← RETURN TO MAISON
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}
