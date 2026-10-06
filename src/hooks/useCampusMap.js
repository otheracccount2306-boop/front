import { useEffect, useMemo, useState } from 'react';
import { getPlan, getPlans } from '../api/campus.api';
import { getErrorMessage } from '../utils/error.utils';
import { loadPlanDetail, savePlanDetail } from '../utils/storage.utils';
import { matchesTerm } from '../utils/text.utils';
import useCachedResource from './useCachedResource';

const MIN_SEARCH_LENGTH = 2;
const MAX_RESULTS = 6;

const fetchPlans = () => getPlans();

export const pickCampusPlan = (plans) =>
  plans.find((plan) => plan.navegacion) ||
  plans.slice().sort((a, b) => (b.espaciosDibujados || 0) - (a.espaciosDibujados || 0))[0];

export const usePlans = () => {
  const { data, loading, error, refresh } = useCachedResource('plans', fetchPlans);
  return { plans: data, loading, error, refresh };
};

export const usePlanDetail = (planId, updatedAt) => {
  const [state, setState] = useState({ plan: null, loading: Boolean(planId), error: null });

  useEffect(() => {
    if (!planId) {
      setState({ plan: null, loading: false, error: null });
      return undefined;
    }
    let active = true;
    setState((previous) => ({
      plan: previous.plan && previous.plan.id === planId ? previous.plan : null,
      loading: true,
      error: null,
    }));

    (async () => {
      const stored = await loadPlanDetail(planId);
      if (!active) {
        return;
      }
      if (stored) {
        setState({ plan: stored, loading: false, error: null });
        if (updatedAt && stored.actualizadoEn === updatedAt) {
          return;
        }
      }
      try {
        const fresh = await getPlan(planId);
        if (!active) {
          return;
        }
        await savePlanDetail(fresh);
        setState({ plan: fresh, loading: false, error: null });
      } catch (error) {
        if (active && !stored) {
          setState({ plan: null, loading: false, error: getErrorMessage(error) });
        }
      }
    })();

    return () => {
      active = false;
    };
  }, [planId, updatedAt]);

  return state;
};

export const useMappedSpaceSearch = (spaces, query) =>
  useMemo(() => {
    if (query.trim().length < MIN_SEARCH_LENGTH) {
      return [];
    }
    return spaces
      .filter((space) => space.planoId && space.geometria && matchesTerm(space, ['nombre', 'codigo'], query))
      .slice(0, MAX_RESULTS);
  }, [spaces, query]);
