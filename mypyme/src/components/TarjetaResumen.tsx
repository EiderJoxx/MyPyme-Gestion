import React from "react";
import "./TarjetaResumen.css";
export interface TarjetaResumenProps {
  titulo: string;
  valor: string | number;
  subtexto?: string;
  tendencia?: string; // Ej: "+12% este mes"
  esPositivo?: boolean; // Para cambiar el color de la tendencia (verde / rojo)
  icono?: React.ReactNode;
}

export const TarjetaResumen: React.FC<TarjetaResumenProps> = ({
  titulo,
  valor,
  subtexto,
  tendencia,
  esPositivo = true,
  icono,
}) => {
  return (
    <div className="tarjeta-resumen">
      <div className="tarjeta-header">
        <span className="tarjeta-titulo">{titulo}</span>
        {icono && <div className="tarjeta-icono">{icono}</div>}
      </div>

      <div className="tarjeta-cuerpo">
        <h3 className="tarjeta-valor">{valor}</h3>
      </div>

      {(subtexto || tendencia) && (
        <div className="tarjeta-footer">
          {tendencia && (
            <span
              className={`tarjeta-tendencia ${esPositivo ? "positivo" : "negativo"}`}
            >
              {tendencia}
            </span>
          )}
          {subtexto && <span className="tarjeta-subtexto">{subtexto}</span>}
        </div>
      )}
    </div>
  );
};

// Exportación por defecto para evitar problemas de compatibilidad en las importaciones
export default TarjetaResumen;
