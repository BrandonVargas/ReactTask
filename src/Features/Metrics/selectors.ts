import { IState } from "../../store";

export const getMeasuraments = (state: IState) => {
    const { measuraments } = state.metricsSelector;
    return measuraments;
  };