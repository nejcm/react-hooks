import { renderHook } from '@testing-library/react-hooks';
import { useRefCallback } from '.';

describe('useRefCallback', () => {
  test('should return ref with callback', async () => {
    let onSuccess: any = () => 1;
    const onError = { type: 'ACTION', payload: 'TEST' };
    const { result, rerender } = renderHook(() => useRefCallback(onSuccess));

    expect(result.current.current).toBe(onSuccess);

    onSuccess = onError;
    rerender();

    expect(result.current.current).toBe(onError);
  });
});
