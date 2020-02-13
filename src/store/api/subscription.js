import gql from 'graphql-tag';

export const NewMeasurementSubscription = gql`
  subscription {
    newMeasurement {
      metric
      at
      value
      unit
    }
  }
`;
