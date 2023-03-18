import { act, renderHook } from '@testing-library/react-hooks';
import { useBoolean } from '.';

describe('useBoolean', () => {
  test('should return boolean', async () => {
    const { result, waitFor } = renderHook(() => useBoolean());
    expect(result.current[0]).toBeFalsy();

    await act(async () => {
      result.current[1].setTrue();
      await waitFor(() => {
        expect(result.current[0]).toBeTruthy();
      });

      result.current[1].setFalse();
      await waitFor(() => {
        expect(result.current[0]).toBeFalsy();
      });

      result.current[1].toggle();
      await waitFor(() => {
        expect(result.current[0]).toBeTruthy();
      });

      result.current[1].setValue(false);
      await waitFor(() => {
        expect(result.current[0]).toBeFalsy();
      });
    });
  });
  test('should return default value', async () => {
    const { result } = renderHook(() => useBoolean(true));
    expect(result.current[0]).toBeTruthy();
  });
});
