
import { useState, useEffect } from 'react';
import { supabase } from '../services/supabaseClient';
import { ActivePin, PinMetricHistory } from '../types';

/**
 * Hook personalizado para extraer la 'Verdad Histórica' y metadatos de un Pin.
 * Cumple con la filosofía de "0 Incertidumbre" consultando directamente
 * las tablas active_pins y pin_metric_history.
 */
export function usePinterestMetrics(pinId: string | null) {
  const [pinData, setPinData] = useState<ActivePin | null>(null);
  const [metrics, setMetrics] = useState<PinMetricHistory[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!pinId) {
      setPinData(null);
      setMetrics([]);
      return;
    }

    const fetchData = async () => {
      setLoading(true);
      setError(null);
      
      try {
        /**
         * Realizamos un JOIN explícito mediante la sintaxis de Supabase.
         * Traemos el Pin y sus métricas asociadas ordenadas por tiempo descendente.
         */
        const { data, error: sbError } = await supabase
          .from('active_pins')
          .select(`
            *,
            pin_metric_history (
              id,
              pin_id,
              cycle_id,
              recorded_at,
              impressions,
              saves,
              outbound_clicks,
              delta_impressions,
              delta_saves
            )
          `)
          .eq('pin_id', pinId)
          .order('recorded_at', { foreignTable: 'pin_metric_history', ascending: false })
          .single();

        if (sbError) {
          // Si el error es "JSON object requested, but no rows were returned"
          // significa que el pin_id no existe en active_pins.
          throw sbError;
        }

        if (data) {
          const { pin_metric_history, ...metadata } = data;
          
          setPinData(metadata as ActivePin);
          
          // Manejo de caso donde pin_metric_history esté vacío (provisional/nuevo)
          const history = (pin_metric_history || []) as PinMetricHistory[];
          
          // Nota técnica: Como delta_outbound_clicks no está en el esquema SQL inmutable,
          // se podría calcular aquí si fuera necesario para la UI, 
          // pero respetamos los campos del esquema SQL.
          setMetrics(history);
        }
      } catch (err: any) {
        console.error(`[usePinterestMetrics] Critical Failure for ID ${pinId}:`, err);
        setError(err.message || 'Error consultando métricas en Supabase');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [pinId]);

  return { pinData, metrics, loading, error };
}
