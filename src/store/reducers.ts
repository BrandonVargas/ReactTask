import { reducer as weatherReducer } from '../Features/Weather/reducer';
import { reducer as metricSelectorReducer } from '../Features/Metrics/reducer';

export default {
  weather: weatherReducer,
  metricsSelector: metricSelectorReducer
};
