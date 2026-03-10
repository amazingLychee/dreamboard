"use client";

interface Props {
  name: string; setName: (n: string) => void;
  motto: string; setMotto: (m: string) => void;
  addLabels: boolean; setAddLabels: (v: boolean) => void;
}

export default function StepPersonal({ name, setName, motto, setMotto, addLabels, setAddLabels }: Props) {
  return (
    <div>
      <h2 className="text-xl font-bold text-db-heading mb-1.5 font-serif">Final touches</h2>
      <p className="text-sm text-db-sub mb-6">Add some personal flair to your board</p>
      <div className="mb-5">
        <label className="text-sm font-semibold text-db-warm block mb-2">Your name</label>
        <input value={name} onChange={(e) => setName(e.target.value)} placeholder="Optional — shown on the board"
          className="w-full px-3.5 py-3 rounded-xl border-[1.5px] border-db-line text-sm outline-none focus:border-db-amber bg-white transition-colors" />
      </div>
      <div className="mb-5">
        <label className="text-sm font-semibold text-db-warm block mb-2">Personal motto or quote</label>
        <textarea value={motto} onChange={(e) => setMotto(e.target.value)} placeholder="Leave blank and AI will write one for you ✨" rows={3}
          className="w-full px-3.5 py-3 rounded-xl border-[1.5px] border-db-line text-sm resize-none outline-none focus:border-db-amber bg-white transition-colors" />
      </div>
      <label className="flex items-center gap-2.5 cursor-pointer">
        <div onClick={() => setAddLabels(!addLabels)}
          className={`w-5 h-5 rounded-md flex items-center justify-center text-xs font-bold transition-all
            ${addLabels ? "border-2 border-db-amber bg-db-amber text-white" : "border-2 border-db-line-accent bg-white"}`}>
          {addLabels && "✓"}
        </div>
        <span className="text-sm text-db-warm">Add handwritten-style labels to each dream</span>
      </label>
    </div>
  );
}
