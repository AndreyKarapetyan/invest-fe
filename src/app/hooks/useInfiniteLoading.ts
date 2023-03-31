import { debounce } from '@mui/material';
import { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react';

interface UseInfiniteLoadingProps {
  hasMore: boolean;
  isLoading: boolean;
  loadMore: () => void;
}

export function useInfiniteLoading({
  hasMore,
  isLoading,
  loadMore,
}: UseInfiniteLoadingProps) {
  const containerRef = useRef<any>();
  const [distanceBottom, setDistanceBottom] = useState(0);

  const scrollListener = useCallback(
    debounce(() => {
      const bottom = containerRef.current.scrollHeight - containerRef.current.clientHeight;
      if (!distanceBottom) {
        setDistanceBottom(Math.round(bottom * 0.2));
      }
      if (
        containerRef.current.scrollTop > bottom - distanceBottom &&
        hasMore &&
        !isLoading &&
        loadMore
      ) {
        loadMore();
      }
    }, 10),
    [hasMore, loadMore, isLoading, distanceBottom]
  );

  useEffect(() => {
    const container = containerRef.current;
    container.addEventListener('scroll', scrollListener);
    if (!distanceBottom) {
      const bottom = container.scrollHeight - container.clientHeight;
      setDistanceBottom(Math.round(bottom * 0.2));
    }
    return () => {
      container.removeEventListener('scroll', scrollListener);
    };
  }, [scrollListener]);

  return containerRef;
}
