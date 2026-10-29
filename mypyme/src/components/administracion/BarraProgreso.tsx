import { dinero } from "../../utils/formato";

interface Props {
  etiqueta: string;
  valor: number;
  total: number;
  color?: string;
}

export default function BarraProgreso({
  etiqueta,
  valor,
  total,
  color = "bg-primary",
}: Props) {
  const porcentaje = total > 0 ? Math.round((valor / total) * 100) : 0;
  return (
    <div className="mb-3">
      <div className="d-flex justify-content-between small">
        <span>{etiqueta}</span>
        <span>
          {dinero(valor)} · {porcentaje}%
        </span>
      </div>
      <div
        className="progress"
        role="progressbar"
        aria-label={etiqueta}
        aria-valuenow={porcentaje}
        aria-valuemin={0}
        aria-valuemax={100}
        style={{ height: 8 }}
      >
        <div
          className={`progress-bar ${color}`}
          style={{ width: `${porcentaje}%` }}
        ></div>
      </div>
    </div>
  );
}
