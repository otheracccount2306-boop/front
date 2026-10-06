import { useMemo } from 'react';
import { getWellbeing } from '../api/services.api';
import useRemoteResource from './useRemoteResource';
import { ALL_VALUE } from '../utils/category.utils';

const fetchAllWellbeing = () => getWellbeing();

const useServices = (category) => {
  const { data, loading, error, refresh } = useRemoteResource(fetchAllWellbeing, []);

  const services = useMemo(
    () => data.filter((service) => category === ALL_VALUE || service.categoria === category),
    [data, category],
  );

  return { services, loading, error, refresh };
};

export default useServices;
