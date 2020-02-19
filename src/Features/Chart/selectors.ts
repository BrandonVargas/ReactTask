import { IState } from "../../store";

export const getSelectedMetrics = (state: IState) => {
    const { selectedMetrics } = state.metricsSelector;
    return selectedMetrics;
  };

export const getMetrics = (state: IState) => {
    const { metrics } = state.metricsSelector;
    return metrics;
  };

export const getMultipleMeasurements = (state: IState) => {
    const { multipleMeasuraments } = state.chart;
    return multipleMeasuraments;
  };