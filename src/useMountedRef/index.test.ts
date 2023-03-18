import { act, renderHook } from '@testing-library/react-hooks';
import { useMountedRef } from '.';

describe('useMountedRef', () => {
  test('should return if mounted', async () => {
    const { result, unmount } = renderHook(() => useMountedRef());

    expect(result.current.current).toBe(true);

    act(() => {
      unmount();
    });

    expect(result.current.current).toBe(false);
  });
});
