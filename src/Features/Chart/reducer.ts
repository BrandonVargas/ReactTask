import { createSlice, PayloadAction } from 'redux-starter-kit';
import { Measurament } from '../Metrics/reducer';

export type ChartDataType = { [key: string]: number };

const initialState = {
  multipleMeasuraments: new Array<ChartDataType>(),
};

const slice = createSlice({
  name: 'chart',
  initialState,
  reducers: {
    addNewMeasuramentRecevied: (state, action: PayloadAction<Measurament>) => {
      const newMeasurament = action.payload;
      const itemExists = !!state.multipleMeasuraments[state.multipleMeasuraments.length - 1]
      if (itemExists) {
        const lastItemMeasurementValue =
        state.multipleMeasuraments[state.multipleMeasuraments.length - 1][newMeasurament.metric];
        const lastItemMeasurementAt = state.multipleMeasuraments[state.multipleMeasuraments.length - 1]['at'];
        if (newMeasurament.at === lastItemMeasurementAt && newMeasurament.value !== lastItemMeasurementValue) {
          state.multipleMeasuraments[state.multipleMeasuraments.length - 1][newMeasurament.metric] = newMeasurament.value;
        } else if (newMeasurament.at !== lastItemMeasurementAt && newMeasurament.value !== lastItemMeasurementValue) {
          const newValue = Object.assign({}, state.multipleMeasuraments[state.multipleMeasuraments.length - 1], {
            at: newMeasurament.at,
            [newMeasurament.metric]: newMeasurament.value,
          });
          state.multipleMeasuraments.push(newValue);
          state.multipleMeasuraments.shift();
        }
      }
    },
    multipleMeasuramentReceived: (state, action: PayloadAction<Array<ChartDataType>>) => {
      state.multipleMeasuraments = action.payload;
    },
  },
});

export const reducer = slice.reducer;
export const actions = slice.actions;