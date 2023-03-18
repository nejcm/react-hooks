import { act, renderHook } from '@testing-library/react-hooks';
import { useCountdown } from '.';

describe('useCountdown', () => {
  test('should return correct countdown state', async () => {
    const onEnd = jest.fn();
    const onTick = jest.fn();
    const { result, waitForNextUpdate, waitFor } = renderHook(() =>
      useCountdown({
        date: 70,
        interval: 25,
        onEnd,
        onTick,
      }),
    );

    act(() => {
      result.current[2].resume();
    });

    expect(onTick).not.toHaveBeenCalled();
    expect(onEnd).not.toHaveBeenCalled();
    expect(result.current[0]).toBeGreaterThan(0);

    await waitForNextUpdate();
    expect(result.current[0]).toBeGreaterThan(0);
    expect(onTick).toHaveBeenCalled();
    expect(onEnd).not.toHaveBeenCalled();

    await waitFor(() => {
      expect(result.current[0]).toBe(0);
      expect(onEnd).toHaveBeenCalled();
    });
  });

  test('should call countdown actions correctly', async () => {
    const props = {
      date: new Date(Date.now() + 150),
      interval: 25,
    };
    const { result, waitFor } = renderHook(() => useCountdown(props));

    const curr = result.current[0];
    expect(curr).toBeGreaterThan(0);
    act(() => result.current[2].pause());
    // wait
    await new Promise((r) => setTimeout(r, props.interval + 1));
    expect(result.current[0]).toBe(curr);

    act(() => result.current[2].resume());
    await waitFor(() => {
      expect(result.current[0]).toBe(0);
    });

    act(() => result.current[2].restart());
    expect(result.current[0]).toBeGreaterThan(0);

    act(() => result.current[2].reset());
    expect(result.current[0]).toBe(0);
  });

  test('should call end with ended time', async () => {
    const onEnd = jest.fn();
    const props = {
      date: new Date(Date.now() - 100),
    };
    const { result } = renderHook(() =>
      useCountdown({ ...props, autostart: false }),
    );
    expect(onEnd).not.toHaveBeenCalled();
    act(() => {
      result.current[2].start();
    });
    expect(onEnd).not.toHaveBeenCalled();

    renderHook(() => useCountdown({ ...props, onEnd }));
    expect(onEnd).toHaveBeenCalled();
  });
});
