import { createSlice, PayloadAction } from 'redux-starter-kit';

export type MetricData = {
  getMetrics: string[];
};

export type Measurament = {
  metric: string;
  at: string;
  value: number;
  unit: string;
};

export type ApiErrorAction = {
  error: string;
};

const initialState = {
  metrics: new Array<string>(),
  selectedMetrics: new Array<string>(),
  measuraments: Array<Measurament>(),
};
const slice = createSlice({
  name: 'metricsSelector',
  initialState,
  reducers: {
    metricsDataRecevied: (state, action: PayloadAction<MetricData>) => {
      const metrics = action.payload;
      state.metrics = metrics.getMetrics;
    },
    metricSelected: (state, action: PayloadAction<string[]>) => {
      const selectedMetric = action.payload;
      state.selectedMetrics = selectedMetric;
    },
    newMeasuramentRecevied: (state, action: PayloadAction<Measurament>) => {
      const newMeasurament = action.payload;
      const measurament = state.measuraments.find(element => element.metric === newMeasurament.metric);
      if (measurament) {
        const index = state.measuraments.indexOf(measurament);
        state.measuraments[index] = newMeasurament;
      } else {
        state.measuraments.push(newMeasurament);
      }
    },
    metricsErrorReceived: (state, action: PayloadAction<ApiErrorAction>) => state,
  },
});

export const reducer = slice.reducer;
export const actions = slice.actions;
