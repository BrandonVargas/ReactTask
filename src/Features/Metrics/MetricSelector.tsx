import React, { useEffect } from 'react';
import { useSubscription } from 'urql';
import { createStyles, makeStyles, useTheme, Theme } from '@material-ui/core/styles';
import { IState } from '../../store';
import { actions } from './reducer';
import { useDispatch, useSelector } from 'react-redux';
import Input from '@material-ui/core/Input';
import Select from '@material-ui/core/Select';
import Chip from '@material-ui/core/Chip';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl';
import Metric from './Metric';
import { NewMeasurementSubscription } from '../../store/api/subscription';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    card: {
      width: '100vw',
      display: 'flex',
      flexDirection: 'column',
    },
    formControl: {
      margin: theme.spacing(1),
      minWidth: '30%',
      maxWidth: '50%',
      alignSelf: 'center',
    },
    chips: {
      display: 'flex',
      flexWrap: 'wrap',
    },
    chip: {
      margin: 1,
    },
    metricCards: {
      display: 'flex',
      flexWrap: 'nowrap',
      justifyContent: 'center',
    },
  }),
);

function getStyles(metric: string, selectedMetrics: string[], theme: Theme) {
  return {
    fontWeight:
      selectedMetrics.indexOf(metric) === -1 ? theme.typography.fontWeightRegular : theme.typography.fontWeightMedium,
  };
}

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 0;
const MenuProps = {
  PaperProps: {
    style: {
      height: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      width: 35,
    },
  },
};

const getMetrics = (state: IState) => {
  const { metrics, selectedMetrics } = state.metricsSelector;
  return {
    metrics,
    selectedMetrics,
  };
};

const MetricSelector = () => {
  const classes = useStyles();
  const theme = useTheme();
  const dispatch = useDispatch();
  const { metrics, selectedMetrics } = useSelector(getMetrics);

  const handleChange = (event: React.ChangeEvent<{ value: unknown }>) => {
    dispatch(actions.metricSelected(event.target.value as string[]));
  };

  const [resultSub] = useSubscription({
    query: NewMeasurementSubscription,
  });

  useEffect(() => {
    if (resultSub.data !== undefined) {
      dispatch(actions.newMeasuramentRecevied(resultSub.data.newMeasurement));
    }
  }, [dispatch, resultSub]);

  return (
    <div className={classes.card}>
      <FormControl className={classes.formControl}>
        <InputLabel id="metric-mutiple-label">Metrics</InputLabel>
        <Select
          displayEmpty={true}
          labelId="metric-mutiple-label"
          id="metric-mutiple-chip"
          multiple
          value={selectedMetrics}
          onChange={handleChange}
          input={<Input id="metric-multiple-chip" />}
          renderValue={selected => (
            <div className={classes.chips}>
              {(selected as string[]).map(value => (
                <Chip key={value} label={value} className={classes.chip} />
              ))}
            </div>
          )}
          MenuProps={MenuProps}
        >
          {metrics.map(metric => (
            <MenuItem key={metric} value={metric} style={getStyles(metric, selectedMetrics, theme)}>
              {metric}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
      <div className={classes.chips}>
        {selectedMetrics.map(metric => (
          <Metric key={metric} metricName={metric} />
        ))}
      </div>
    </div>
  );
};

export default MetricSelector;
