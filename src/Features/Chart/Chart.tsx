import React, { useEffect } from 'react';
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, Legend, Tooltip, CartesianGrid } from 'recharts';
import { makeStyles } from '@material-ui/core/styles';
import { useDispatch, useSelector } from 'react-redux';
import { useQuery } from 'urql';
import { actions, ChartDataType } from './reducer';
import { actions as metricActions } from '../../Features/Metrics/reducer';
import { getMultipleMeasurementsQuery } from '../../store/api/queries';
import { getSelectedMetrics, getMultipleMeasurements, getMetrics } from './selectors';
import { getMeasuraments } from '../Metrics/selectors';

const useStyles = makeStyles({
  container: {
    minWidth: '50%',
    width: '75%',
    alignSelf: 'center',
  },
});

const colors: string[] = ['blue', 'red', 'yellow', 'black', 'orange', 'gray', 'green'];

const Chart = () => {
  const classes = useStyles();
  const dispatch = useDispatch();
  const chartHeight = window && window.innerHeight/2;

  const metrics = useSelector(getMetrics);
  const selectedMetrics = useSelector(getSelectedMetrics);
  const latestMeasuraments = useSelector(getMeasuraments)
  const multipleMeasuraments =  useSelector(getMultipleMeasurements);

  const getThirtyMinutesAgo = () => {
    const now = new Date();
    now.setMinutes(now.getMinutes() - 30);
    return now.getTime();
  };

  const formatDateToTime = (time: number) => {
    return new Date(time).toLocaleTimeString();
  };

  const after = getThirtyMinutesAgo();

  const multipleMeasuramentQuery = metrics.map(metricName => ({
    metricName,
    after,
  }));

  const pause = multipleMeasuraments.length !== 0;

  const [result] = useQuery({
    query: getMultipleMeasurementsQuery,
    variables: { input: multipleMeasuramentQuery },
    pause,
  });

  const { data, error } = result;

  useEffect(() => {
    metrics.forEach((metric: string, index) => {
      if (multipleMeasuraments[multipleMeasuraments.length - 1]) {
        const newMeasurament = latestMeasuraments.find( measurament => measurament.metric === metric)
        if (newMeasurament) {
          const lastMeasurament = multipleMeasuraments[multipleMeasuraments.length - 1][metric]
          const lastUpdate = multipleMeasuraments[multipleMeasuraments.length - 1]['at']
          if (lastUpdate === newMeasurament.at && lastMeasurament !== newMeasurament.value) {
            dispatch(actions.updateLastMeasurement(newMeasurament));
          } else if (lastUpdate !== newMeasurament.at && lastMeasurament !== newMeasurament.value) {
            dispatch(actions.addNewMeasuramentRecevied(newMeasurament));
          }
        }
      }
    })

    if (multipleMeasuraments.length === 0) {
      if (error) {
        dispatch(metricActions.apiErrorReceived({ error: error.message }));
      }
      if (!data) return;

      const formattedData: Array<ChartDataType> = [];
      const { getMultipleMeasurements } = data;

      for (let metric of getMultipleMeasurements) {
        metric.measurements.forEach((measurement: { value: number; at: number }, i: number) => {
          if (!formattedData[i]) {
            formattedData[i] = {};
          }
          formattedData[i][metric.metric] = measurement.value;
          if (!formattedData[i].at) {
            formattedData[i].at = measurement.at;
          }
        });
      }
      dispatch(actions.multipleMeasuramentReceived(formattedData));
    }
  }, [dispatch, data, error, multipleMeasuraments, multipleMeasuraments.length, metrics, latestMeasuraments]);

  if (selectedMetrics.length === 0) {
    return null;
  }

  return (
    <div className={classes.container}>
      <ResponsiveContainer width="100%" height={chartHeight}>
        <LineChart data={multipleMeasuraments}>
          <YAxis />
          <XAxis dataKey="at" interval="preserveStartEnd" minTickGap={20} tickFormatter={formatDateToTime} />
          <Tooltip />
          <CartesianGrid stroke="#ccc" />
          <Legend />
          {selectedMetrics.map((metric: string, index: number) => {
            return (
              <Line
                type="monotone"
                key={metric}
                name={metric}
                dataKey={metric}
                stroke={colors[index] || 'black'}
                dot={false}
                activeDot={{ r: 8 }}
              />
            );
          })}
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}

export default Chart;
