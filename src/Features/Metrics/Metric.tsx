import React, { useEffect } from 'react';
import Card from '@material-ui/core/Card';
import Typography from '@material-ui/core/Typography';
import CardContent from '@material-ui/core/CardContent';
import { IState } from '../../store';
import { createStyles, makeStyles, useTheme, Theme } from '@material-ui/core/styles';
import { useDispatch, useSelector } from 'react-redux';
import { useQuery } from 'urql';
import { actions } from './reducer';
import { LinearProgress } from '@material-ui/core';
import { getLastKnownMeasurementQuery } from '../../store/api/queries';

interface MetricProps {
  metricName: string;
}
const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    card: {
      maxWidth: '20%',
      margin: '2%',
    },
  }),
);

const getMesurament = (state: IState) => {
  const { measuraments } = state.metricsSelector;
  return { measuraments };
};

const Metric: React.FC<MetricProps> = ({ metricName }) => {
  const classes = useStyles();
  const theme = useTheme();
  const dispatch = useDispatch();
  const { measuraments } = useSelector(getMesurament);

  const [result] = useQuery({
    query: getLastKnownMeasurementQuery,
    variables: { metricName },
  });
  const { fetching, data, error } = result;

  useEffect(() => {
    if (error) {
      //TODO
    }
    if (!data) return;

    dispatch(actions.newMeasuramentRecevied(data.getLastKnownMeasurement));
  }, [dispatch, data, error]);

  if (fetching) return <LinearProgress />;

  const measurament = measuraments.find(e => e.metric === metricName);
  var value = data.getLastKnownMeasurement.value;
  var unit = data.getLastKnownMeasurement.unit;

  if (measurament) {
    value = measurament.value;
    unit = measurament.unit;
  }

  return (
    <Card className={classes.card}>
      <CardContent>
        <Typography variant={'h6'}>{metricName}</Typography>
        <Typography variant={'h3'}>{value}</Typography>
        <Typography variant={'h4'}>{unit}</Typography>
      </CardContent>
    </Card>
  );
};

export default Metric;
