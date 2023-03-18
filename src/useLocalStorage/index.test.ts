import { act, renderHook } from '@testing-library/react-hooks';
import { useLocalStorage } from '.';

const key = 'test';
describe('useLocalStorage', () => {
  afterEach(() => localStorage.removeItem(key));

  test('should return correct state', async () => {
    const value = { test: 1, test2: 'John Doe' };
    const { result: r1, waitFor } = renderHook(() =>
      useLocalStorage({
        key,
      }),
    );

    expect(r1.current.state).toBeUndefined();

    await act(async () => {
      r1.current.set(value);
      await waitFor(() => {
        expect(r1.current.state).toEqual(value);
      });
    });

    const finalResult = {
      test: 1,
      test2: 'Mike',
      test3: true,
    };
    await act(async () => {
      r1.current.merge({ test2: 'Mike', test3: true });
      await waitFor(() => {
        expect(r1.current.state).toEqual(finalResult);
      });
    });

    const { result: r2 } = renderHook(() =>
      useLocalStorage({
        key,
      }),
    );

    expect(r2.current.state).toEqual(finalResult);

    await act(async () => {
      r1.current.clear();
      await waitFor(() => {
        expect(r1.current.state).toBeUndefined();
      });
    });
  });

  test('should return default state', async () => {
    const defaultValue = 'hello';
    const { result, waitFor } = renderHook(() =>
      useLocalStorage({
        key,
        defaultValue: 'hello',
      }),
    );

    expect(result.current.state).toBe(defaultValue);

    await act(async () => {
      result.current.set('new');
      await waitFor(() => {
        expect(result.current.state).toBe('new');
      });
    });
  });

  test('should debouce writing value to local storage', async () => {
    const value = 'debounce';
    const { result, waitFor, waitForNextUpdate } = renderHook(() =>
      useLocalStorage({
        key,
        debounce: 150,
      }),
    );

    await act(async () => {
      result.current.set(value);
      await waitForNextUpdate();
      expect(localStorage.getItem(key)).toBe(null);
      await waitFor(() => {
        expect(localStorage.getItem(key)).toContain(value);
      });
    });
  });

  test('should correctly cache the value', async () => {
    const value = 'cached value';
    const cacheTime = 0.2;
    const { result, waitForNextUpdate } = renderHook(() =>
      useLocalStorage({
        key,
        cacheTime,
      }),
    );

    await act(async () => {
      result.current.set(value);
      await waitForNextUpdate();
      expect(result.current.state).toBe(value);
      expect(localStorage.getItem(key)).toContain('cacheTime');
    });

    await new Promise((resolve) =>
      setTimeout(() => resolve(true), cacheTime * 1000 + 10),
    );

    const { result: r2 } = renderHook(() =>
      useLocalStorage({
        key,
        cacheTime,
      }),
    );
    expect(r2.current.state).toBeUndefined();
  });
});
