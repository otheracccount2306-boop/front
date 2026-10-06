import { useMemo } from 'react';
import { getDepartments } from '../api/services.api';
import useRemoteResource from './useRemoteResource';
import { matchesTerm } from '../utils/text.utils';

const fetchAllDepartments = () => getDepartments();

const useDirectory = (search) => {
  const { data, loading, error, refresh } = useRemoteResource(fetchAllDepartments, []);

  const departments = useMemo(
    () => data.filter((department) => matchesTerm(department, ['nombre', 'descripcion'], search)),
    [data, search],
  );

  return { departments, loading, error, refresh };
};

export default useDirectory;
