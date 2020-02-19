import React, { useEffect } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import MetricSelector from '../Features/Metrics/MetricSelector';
import Chart from '../Features/Chart/Chart';
import rootActions from '../store/actions'
import { useDispatch } from 'react-redux';
import { getMetricsQuery } from '../store/api/queries';
import { useQuery } from 'urql';

const useStyles = makeStyles({
  card: {
    width: '100vw',
    display: 'flex',
    flexDirection: 'column'
  },
});

function Dashboard() {
  const classes = useStyles();
  const dispatch = useDispatch();

  const [result] = useQuery({ query: getMetricsQuery });
  const { data, error } = result;

  useEffect(() => {
    if (error) {
      dispatch(rootActions.metricsActions.apiErrorReceived({ error: error.message }));
      return;
    }
    if (!data) return;

    const metrics = data;
    dispatch(rootActions.metricsActions.metricsDataRecevied(metrics));
  }, [dispatch, data, error]);

  return (
    <div className={classes.card}>
      <MetricSelector />
      <Chart />
    </div>
  );
}

export default Dashboard;
