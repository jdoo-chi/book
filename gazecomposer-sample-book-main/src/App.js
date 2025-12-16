import React, {
  useMemo,
  useRef,
  useState,
  useCallback,
  useEffect,
} from "react";
import {
  Grid,
  Play,
  Pause,
  Music,
  Layers,
  ArrowRight,
  Search,
  Wind,
  Zap,
  Github,
  Twitter,
} from "lucide-react";

// --- Utility Functions ---
const assetPath = (folder, filename) => {
  if (!filename) return "";
  return `/${folder}/${encodeURIComponent(filename)}`;
};

// --- Components ---
const Badge = ({ children, color = "slate" }) => {
  // Tailwind 클래스 대신 인라인 스타일로 대체 (Tailwind 설치 안 함)
  const baseStyle = {
    padding: "4px 10px",
    borderRadius: "9999px",
    fontSize: "11px",
    fontWeight: "600",
    textTransform: "uppercase",
    border: "1px solid",
    marginRight: "5px"
  };
  
  const styles = {
    slate: { backgroundColor: "#f1f5f9", color: "#475569", borderColor: "#e2e8f0" },
    blue: { backgroundColor: "#eff6ff", color: "#1d4ed8", borderColor: "#dbeafe" },
  };

  const style = { ...baseStyle, ...(styles[color] || styles.slate) };

  return <span style={style}>{children}</span>;
};

const PhraseCard = ({
  id,
  keySig,
  type,
  meta = {},
  imageSrc = "",
  audioSrc = "",
  isPlaying,
  onPlay,
}) => {
  const [imgFailed, setImgFailed] = useState(false);
  const canShowImg = Boolean(imageSrc) && !imgFailed;

  return (
    <div style={{
      border: "1px solid #e2e8f0",
      borderRadius: "16px",
      overflow: "hidden",
      backgroundColor: "white",
      boxShadow: "0 1px 2px 0 rgba(0, 0, 0, 0.05)",
      display: "flex",
      flexDirection: "column",
      position: "relative"
    }}>
      {/* 헤더 */}
      <div style={{ padding: "20px", borderBottom: "1px solid #f8fafc" }}>
        <div style={{ marginBottom: "8px" }}>
          <Badge color="blue">{keySig}</Badge>
          <Badge color="slate">{type}</Badge>
        </div>
        <h3 style={{ fontSize: "18px", fontWeight: "bold", margin: 0, color: "#1e293b" }}>{id}</h3>
      </div>

      {/* 이미지 영역 */}
      <div style={{ height: "192px", backgroundColor: "#f8fafc", position: "relative", display: "flex", alignItems: "center", justifyContent: "center" }}>
        {canShowImg ? (
          <img
            src={imageSrc}
            alt={`Score for ${id}`}
            style={{ width: "100%", height: "100%", objectFit: "contain" }}
            onError={() => setImgFailed(true)}
          />
        ) : (
          <div style={{ color: "#cbd5e1", textAlign: "center" }}>
            <Music size={32} />
            <div style={{ fontSize: "12px", marginTop: "8px" }}>NO PREVIEW</div>
          </div>
        )}

        {/* 플레이 버튼 */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            if (audioSrc) onPlay(audioSrc);
          }}
          disabled={!audioSrc}
          style={{
            position: "absolute",
            bottom: "16px",
            right: "16px",
            width: "48px",
            height: "48px",
            borderRadius: "50%",
            border: "none",
            backgroundColor: isPlaying ? "#2563eb" : "white",
            color: isPlaying ? "white" : "#1e293b",
            display: audioSrc ? "flex" : "none",
            alignItems: "center",
            justifyContent: "center",
            cursor: "pointer",
            boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)"
          }}
        >
          {isPlaying ? <Pause size={20} fill="currentColor" /> : <Play size={20} fill="currentColor" />}
        </button>
      </div>

      {/* 정보 영역 */}
      <div style={{ padding: "20px", flexGrow: 1 }}>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
          <div>
            <span style={{ fontSize: "10px", textTransform: "uppercase", color: "#94a3b8", fontWeight: "bold", display: "block", marginBottom: "4px" }}>Character</span>
            <p style={{ fontSize: "14px", fontWeight: "500", margin: 0 }}>{meta.character || "-"}</p>
          </div>
          <div>
            <span style={{ fontSize: "10px", textTransform: "uppercase", color: "#94a3b8", fontWeight: "bold", display: "block", marginBottom: "4px" }}>Suggestion</span>
            <p style={{ fontSize: "14px", fontWeight: "500", color: "#2563eb", margin: 0 }}>{meta.try || "-"}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

const App = () => {
  const [activeTab, setActiveTab] = useState("library");
  const [playingSrc, setPlayingSrc] = useState(null);
  const audioRef = useRef(null);

  const playAudio = useCallback((src) => {
    if (!src) return;
    if (playingSrc === src && audioRef.current) {
      if (!audioRef.current.paused) {
        audioRef.current.pause();
        setPlayingSrc(null);
        return;
      }
    }
    try {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.currentTime = 0;
      }
      const a = new Audio(src);
      audioRef.current = a;
      a.onended = () => setPlayingSrc(null);
      a.play().then(() => setPlayingSrc(src)).catch((e) => console.log("Audio play failed:", e));
    } catch (e) {
      console.error("Audio init failed:", e);
    }
  }, [playingSrc]);

  const motifs = useMemo(() => {
    const defs = [
      { id: "GK-CM-FREE", keySig: "C Major", type: "Free", imageFile: "CM FREE.png", audioFile: "CM FREE.mp3", meta: { character: "Open, exploratory", try: "Re-orchestrate as texture", constraint: "Keep pulse steady" } },
      { id: "GK-CM-STEP", keySig: "C Major", type: "Step", imageFile: "CM STEP.png", audioFile: "CM STEP.mp3", meta: { character: "Stepwise, lyric", try: "Sequence + register shift", constraint: "No leaps > 3rd" } },
      { id: "GK-CM-LEAP", keySig: "C Major", type: "Leap", imageFile: "CM Leap.png", audioFile: "CM LEAP.mp3", meta: { character: "Bright, wide", try: "Octave displacement", constraint: "Land on chord tones" } },
      { id: "GK-Cm-FREE", keySig: "C Minor", type: "Free", imageFile: "c minor FREE.png", audioFile: "c minor FREE.mp3", meta: { character: "Dark, flexible", try: "Change articulation", constraint: "Keep final tone stable" } },
      { id: "GK-Cm-STEP", keySig: "C Minor", type: "Step", imageFile: "c minor STEP.png", audioFile: "c minor STEP.mp3", meta: { character: "Melancholic, stepwise", try: "Retrograde + reharmonize", constraint: "Avoid large leaps" } },
      { id: "GK-Cm-LEAP", keySig: "C Minor", type: "Leap", imageFile: "c minor LEAP.png", audioFile: "c minor LEAP.mp3", meta: { character: "Tense, angular", try: "Fragment + repeat", constraint: "Return to tonic" } },
      { id: "GK-FM-FREE", keySig: "F Major", type: "Free", imageFile: "FM FREE.png", audioFile: "FM FREE.mp3", meta: { character: "Warm, open", try: "Thin to a single line", constraint: "Keep dynamics flat" } },
      { id: "GK-Fm-FREE", keySig: "F Minor", type: "Free", imageFile: "f minor FREE.png", audioFile: "f minor FREE.mp3", meta: { character: "Dense, shadowed", try: "Add pedal tone", constraint: "No ornament layer" } },
      { id: "GK-AM-FREE", keySig: "A Major", type: "Free", imageFile: "AM FREE.png", audioFile: "AM FREE.mp3", meta: { character: "Clear, bright", try: "Swap register roles", constraint: "Avoid chromaticism" } },
      { id: "GK-Am-FREE", keySig: "A Minor", type: "Free", imageFile: "a minor FREE.png", audioFile: "a minor FREE.mp3", meta: { character: "Plainchant-like", try: "Add rhythmic lattice", constraint: "No leading tone" } },
    ];
    return defs.map((d) => ({ ...d, imageSrc: assetPath("images", d.imageFile), audioSrc: assetPath("audio", d.audioFile) }));
  }, []);

  return (
    <div style={{ minHeight: "100vh", backgroundColor: "#f8fafc", padding: "20px", color: "#0f172a" }}>
      <header style={{ maxWidth: "1152px", margin: "0 auto", padding: "20px 0", borderBottom: "1px solid #e2e8f0", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "12px", fontWeight: "bold", fontSize: "20px" }}>
          <div style={{ backgroundColor: "#0f172a", color: "white", padding: "8px", borderRadius: "8px", display: "flex" }}><Grid size={20} /></div>
          GridKey
        </div>
      </header>
      <main style={{ maxWidth: "1152px", margin: "40px auto 80px" }}>
        <div style={{ textAlign: "center", marginBottom: "40px" }}>
          <h1 style={{ fontSize: "36px", fontWeight: "800", marginBottom: "16px" }}>Compositional <span style={{ color: "#2563eb" }}>Building Blocks</span></h1>
          <p style={{ color: "#64748b", fontSize: "18px" }}>A curated collection of tonal centers for rapid prototyping.</p>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", gap: "32px" }}>
          {motifs.map((motif) => (
            <PhraseCard key={motif.id} {...motif} onPlay={playAudio} isPlaying={playingSrc === motif.audioSrc} />
          ))}
        </div>
      </main>
    </div>
  );
};

export default App;