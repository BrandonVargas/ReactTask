import React, { useEffect } from 'react';
import Card from '@material-ui/core/Card';
import Typography from '@material-ui/core/Typography';
import CardContent from '@material-ui/core/CardContent';
import { IState } from '../../store';
import { makeStyles } from '@material-ui/core/styles';
import { useDispatch, connect } from 'react-redux';
import { useQuery } from 'urql';
import { actions, Measurament } from './reducer';
import { LinearProgress } from '@material-ui/core';
import { getLastKnownMeasurementQuery } from '../../store/api/queries';
import { getMeasurament } from './selectors';

interface MetricProps {
  measuraments: Array<Measurament>;
  metricName: string;
}
const useStyles = makeStyles({
  card: {
    maxWidth: '20%',
    margin: '2%',
    flexGrow: 1,
  },
  value: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-evenly',
  },
});

const Metric: React.FC<MetricProps> = ({ measuraments, metricName }) => {
  const classes = useStyles();
  const dispatch = useDispatch();

  const measurament = measuraments.find(e => e.metric === metricName);

  const [result] = useQuery({
    query: getLastKnownMeasurementQuery,
    variables: { metricName },
    pause: !!measurament,
  });
  const { fetching, data, error } = result;

  useEffect(() => {
    if (error) {
      dispatch(actions.apiErrorReceived({ error: error.message }));
    }
    if (!data) return;

    dispatch(actions.newMeasuramentRecevied(data.getLastKnownMeasurement));
  }, [dispatch, data, error]);

  if (fetching) return <LinearProgress />;

  var value = 0;
  var unit: string | undefined = '';

  if (measurament) {
    value = measurament.value;
    unit = measurament.unit;
  }

  return (
    <Card className={classes.card}>
      <CardContent>
        <Typography variant={'h6'}>{metricName}</Typography>
        <div className={classes.value}>
          <Typography variant={'h5'}>{value}</Typography>
          <Typography variant={'h6'}>({unit})</Typography>
        </div>
      </CardContent>
    </Card>
  );
};

const mapStateToProps = (state: IState) => {
  return {
    measuraments: getMeasurament(state)
  };
};

export default connect(mapStateToProps)(Metric);
