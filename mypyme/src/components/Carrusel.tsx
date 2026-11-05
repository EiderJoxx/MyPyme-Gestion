import { useEffect, useState } from "react";
import { GALERIA } from "../data/galeria";

type Props = { intervaloMs?: number };

const flecha: React.CSSProperties = {
  position: "absolute",
  top: "50%",
  transform: "translateY(-50%)",
  background: "rgba(0,0,0,.35)",
  color: "#fff",
  border: 0,
  borderRadius: "50%",
  width: 44,
  height: 44,
  fontSize: 26,
  lineHeight: 1,
  cursor: "pointer",
  zIndex: 10,
};

export default function Carrusel2({ intervaloMs = 5000 }: Props) {
  const total = GALERIA.length;
  const [i, setI] = useState(0);
  const [pausa, setPausa] = useState(false);

  useEffect(() => {
    if (pausa || total < 2) return;
    const t = setInterval(() => setI((p) => (p + 1) % total), intervaloMs);
    return () => clearInterval(t);
  }, [pausa, total, intervaloMs]);

  const ir = (n: number) => setI((n + total) % total);
  if (total === 0) return null;

  return (
    <section
      aria-roledescription="carrusel"
      aria-label="Fotos del hospedaje"
      onMouseEnter={() => setPausa(true)}
      onMouseLeave={() => setPausa(false)}
      style={{
        position: "relative",
        height: "clamp(400px, 70vh, 650px)",
        overflow: "hidden",
        background: "#1c1c24",
      }}
    >
      {GALERIA.map((f, n) => (
        <div
          key={f.src}
          aria-hidden={n !== i}
          style={{
            position: "absolute",
            inset: 0,
            opacity: n === i ? 1 : 0,
            transition: "opacity .8s ease",
          }}
        >
          <img
            src={f.src}
            alt={f.alt}
            loading={n === 0 ? "eager" : "lazy"}
            style={{ width: "100%", height: "100%", objectFit: "cover" }}
          />
          <div
            style={{
              position: "absolute",
              inset: 0,
              background:
                "linear-gradient(to top, rgba(0,0,0,.75), rgba(0,0,0,.1) 60%)",
            }}
          />
          <div
            style={{
              position: "absolute",
              left: 0,
              right: 0,
              bottom: 60,
              textAlign: "center",
              color: "#fff",
              padding: "0 20px",
              zIndex: 5,
            }}
          >
            {f.titulo && (
              <h2
                style={{
                  fontWeight: 800,
                  margin: 0,
                  fontSize: "clamp(28px, 5vw, 52px)",
                  textShadow: "2px 2px 4px rgba(0,0,0,0.5)",
                }}
              >
                {f.titulo}
              </h2>
            )}
            {f.subtitulo && (
              <p
                style={{
                  margin: "12px 0 24px",
                  fontSize: "clamp(16px, 2.5vw, 22px)",
                  textShadow: "1px 1px 3px rgba(0,0,0,0.5)",
                }}
              >
                {f.subtitulo}
              </p>
            )}
            <button
              onClick={() => {
                const el = document.getElementById("reservar");
                if (el) el.scrollIntoView({ behavior: "smooth" });
              }}
              className="btn btn-light btn-lg fw-bold px-4 py-2"
              style={{ borderRadius: "30px" }}
            >
              Reservar por WhatsApp
            </button>
          </div>
        </div>
      ))}

      {total > 1 && (
        <>
          <button
            type="button"
            aria-label="Foto anterior"
            onClick={() => ir(i - 1)}
            style={{ ...flecha, left: 16 }}
          >
            ‹
          </button>
          <button
            type="button"
            aria-label="Foto siguiente"
            onClick={() => ir(i + 1)}
            style={{ ...flecha, right: 16 }}
          >
            ›
          </button>

          <div
            style={{
              position: "absolute",
              bottom: 20,
              left: 0,
              right: 0,
              display: "flex",
              justifyContent: "center",
              gap: 10,
              zIndex: 10,
            }}
          >
            {GALERIA.map((f, n) => (
              <button
                key={f.src}
                type="button"
                aria-label={`Ir a la foto ${n + 1}`}
                onClick={() => ir(n)}
                style={{
                  width: 40,
                  height: 5,
                  border: 0,
                  borderRadius: "3px",
                  padding: 0,
                  cursor: "pointer",
                  background: n === i ? "#fff" : "rgba(255,255,255,.4)",
                  transition: "background 0.3s",
                }}
              />
            ))}
          </div>
        </>
      )}
    </section>
  );
}
