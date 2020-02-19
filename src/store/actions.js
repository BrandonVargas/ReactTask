import { actions as weatherActions } from '../Features/Weather/reducer';
import { actions as metricSelectorActions } from '../Features/Metrics/reducer';
import { actions as chartActions } from '../Features/Chart/reducer';

export default {
  weather: weatherActions,
  metricsActions: metricSelectorActions,
  chartActions: chartActions
};
