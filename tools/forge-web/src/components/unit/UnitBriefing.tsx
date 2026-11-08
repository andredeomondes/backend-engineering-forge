import ReactMarkdown from "react-markdown";

type Props = {
  markdown: string;
  /** "briefing" = intro + free sections; "before" = the "Antes de começar" questions. */
  section: "briefing" | "before";
};

type Section = { heading: string | null; body: string };

// Sections rendered elsewhere (missions tab, close tab) or not useful in the UI.
const ELSEWHERE = [
  "exercícios",
  "debugging",
  "refatoração",
  "desafio integrador",
  "como trabalhar",
  "critérios de aceitação",
  "dicas",
];
const BEFORE_START = "antes de começar";

/** Splits markdown at `## ` headings (ignoring fenced code). */
function splitSections(markdown: string): Section[] {
  const sections: Section[] = [{ heading: null, body: "" }];
  let fenced = false;
  for (const line of markdown.replace(/\r\n?/g, "\n").split("\n")) {
    if (/^\s*(```|~~~)/.test(line)) fenced = !fenced;
    const heading = !fenced && /^##\s+(.+?)\s*#*\s*$/.exec(line);
    if (heading) sections.push({ heading: heading[1], body: "" });
    else {
      const current = sections[sections.length - 1];
      current.body += `${line}\n`;
    }
  }
  return sections;
}

const normalized = (heading: string) => heading.trim().toLowerCase();

function briefingMarkdown(sections: Section[]) {
  return sections
    .filter(({ heading }) => {
      if (heading === null) return true;
      const name = normalized(heading);
      return (
        name !== BEFORE_START && !ELSEWHERE.some((prefix) => name.startsWith(prefix))
      );
    })
    .map(({ heading, body }) =>
      heading === null
        ? // The unit title already sits in the page header.
          body.replace(/^\s*#\s+.*\n/, "")
        : `## ${heading}\n${body}`,
    )
    .join("\n")
    .trim();
}

/** "Antes de começar" → intro text, one block per list item, and the note after the list. */
function beforeStart(sections: Section[]) {
  const section = sections.find(
    ({ heading }) => heading !== null && normalized(heading) === BEFORE_START,
  );
  if (!section) return null;
  const intro: string[] = [];
  const questions: string[][] = [];
  const note: string[] = [];
  let phase: "intro" | "list" | "note" = "intro";
  for (const line of section.body.split("\n")) {
    const item = /^(\d+[.)]|[-*+])\s+(.*)$/.exec(line);
    if (item && phase !== "note") {
      phase = "list";
      questions.push([item[2]]);
    } else if (phase === "list" && (line.trim() === "" || /^\s+\S/.test(line))) {
      questions[questions.length - 1].push(line.replace(/^\s{1,4}/, ""));
    } else if (phase === "list") {
      phase = "note";
      note.push(line);
    } else (phase === "intro" ? intro : note).push(line);
  }
  return {
    intro: intro.join("\n").trim(),
    questions: questions.map((lines) => lines.join("\n").trim()).filter(Boolean),
    note: note.join("\n").trim(),
  };
}

export function UnitBriefing({ markdown, section }: Props) {
  const sections = splitSections(markdown);

  if (section === "briefing") {
    const text = briefingMarkdown(sections);
    return (
      <article className="unit-panel">
        {text ? (
          <div className="unit-read unit-markdown">
            <ReactMarkdown>{text}</ReactMarkdown>
          </div>
        ) : (
          <p className="unit-empty">Esta unidade não tem briefing além das missões.</p>
        )}
      </article>
    );
  }

  const before = beforeStart(sections);
  if (!before || (!before.questions.length && !before.intro)) {
    return (
      <article className="unit-panel">
        <p className="unit-empty">
          Esta unidade não tem perguntas de "Antes de começar". Vá direto para as missões.
        </p>
      </article>
    );
  }

  return (
    <article className="unit-panel is-bare">
      {before.intro && (
        <div className="unit-read unit-markdown before-intro">
          <ReactMarkdown>{before.intro}</ReactMarkdown>
        </div>
      )}
      <ol className="before-list">
        {before.questions.map((question, index) => (
          <li key={index} className="before-q">
            <span className="unit-k">Pergunta {index + 1}</span>
            <div className="unit-read unit-markdown">
              <ReactMarkdown>{question}</ReactMarkdown>
            </div>
          </li>
        ))}
      </ol>
      {before.note && (
        <div className="unit-read unit-markdown before-note" role="note">
          <ReactMarkdown>{before.note}</ReactMarkdown>
        </div>
      )}
    </article>
  );
}
