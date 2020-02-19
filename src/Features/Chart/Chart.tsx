import React, { useEffect } from 'react';
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, Legend, Tooltip, CartesianGrid } from 'recharts';
import { IState } from '../../store';
import { makeStyles } from '@material-ui/core/styles';
import { useDispatch, connect } from 'react-redux';
import { useQuery, useSubscription } from 'urql';
import { actions, ChartDataType } from './reducer';
import { actions as metricActions } from '../../Features/Metrics/reducer';
import { getMultipleMeasurementsQuery } from '../../store/api/queries';
import { NewMeasurementSubscription } from '../../store/api/subscription';
import { getSelectedMetrics, getMultipleMeasurements, getMetrics } from './selectors';

interface ChartProps {
  metrics: string[];
  selectedMetrics: string[];
  multipleMeasuraments: Array<ChartDataType>;
};

const shouldRender = (prevProps: ChartProps, nextProps: ChartProps) => {
  let shouldNotRender = false;
  if (prevProps.multipleMeasuraments.length && nextProps.multipleMeasuraments.length) {
    const timeBefore = prevProps.multipleMeasuraments[prevProps.multipleMeasuraments.length - 1].at;
    const timeAfter = nextProps.multipleMeasuraments[prevProps.multipleMeasuraments.length - 1].at;
    shouldNotRender = timeBefore === timeAfter;
  }

  return shouldNotRender;
};

const useStyles = makeStyles({
  container: {
    minWidth: '50%',
    width: '75%',
    alignSelf: 'center',
  },
});

const colors: string[] = ['blue', 'red', 'yellow', 'black', 'orange', 'gray', 'green'];

const Chart = React.memo(function Chart({ metrics, selectedMetrics, multipleMeasuraments }: ChartProps) {
  const classes = useStyles();
  const dispatch = useDispatch();
  const chartHeight = window && window.innerHeight/2;

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

  const [resultSub] = useSubscription({
    query: NewMeasurementSubscription,
  });

  useEffect(() => {
    if (resultSub.data !== undefined) {
      dispatch(actions.addNewMeasuramentRecevied(resultSub.data.newMeasurement));
    }

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
  }, [dispatch, resultSub, data, error, multipleMeasuraments.length]);

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
}, shouldRender);

const mapStateToProps = (state: IState) => {
  return {
    metrics: getMetrics(state),
    selectedMetrics: getSelectedMetrics(state),
    multipleMeasuraments: getMultipleMeasurements(state),
  };
};

export default connect(mapStateToProps)(Chart);
