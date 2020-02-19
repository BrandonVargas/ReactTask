import { IState } from "../../store";

export const getMeasurament = (state: IState) => {
    const { measuraments } = state.metricsSelector;
    return measuraments;
  };