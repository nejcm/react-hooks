import { act, renderHook } from '@testing-library/react-hooks';
import { useNotifications } from '.';

describe('useNotifications', () => {
  test('should add and remove notifications', async () => {
    const { result, waitFor } = renderHook(() => useNotifications<string>());

    expect(result.current.notifications).toEqual({});

    act(() => {
      result.current.add('1', 'test');
    });

    expect(result.current.notifications['1'].visible).toBe(true);
    expect(result.current.notifications['1'].data).toBe('test');

    act(() => {
      result.current.remove('1');
    });
    await waitFor(() => {
      expect(result.current.notifications['1'].visible).toBe(false);
    });
    act(() => {
      result.current.add('1', 'test 2');
      result.current.add('1', 'test 3');
    });

    expect(result.current.notifications['1'].data).toBe('test 2');
  });

  test('should remove notification after the timeout', async () => {
    const { result, waitFor } = renderHook(() => useNotifications<string>());

    act(() => {
      result.current.add('1', 'test', 25);
      result.current.add('2', 'test', 0);
    });
    expect(result.current.notifications['1'].visible).toBe(true);
    expect(result.current.notifications['2'].visible).toBe(true);

    await waitFor(() => {
      expect(result.current.notifications['1'].visible).toBe(false);
      expect(result.current.notifications['2'].visible).toBe(true);
    });
  });

  test('should delete notification after the timeout', async () => {
    const { result, waitFor, unmount } = renderHook(() =>
      useNotifications<string>(true),
    );

    act(() => {
      result.current.add('1', 'test', 5);
      result.current.add('2', 'test', 0);
    });
    expect(result.current.notifications['1'].visible).toBe(true);
    expect(result.current.notifications['2'].visible).toBe(true);

    await waitFor(() => {
      expect(Object.keys(result.current.notifications).length).toBe(1);
      unmount();
      expect(Object.keys(result.current.notifications).length).toBe(1);
    });
  });

  test('should not delete notification on unmounted hook', async () => {
    const { result, unmount } = renderHook(() =>
      useNotifications<string>(true),
    );

    act(() => {
      result.current.add('1', 'test', 2);
      result.current.add('2', 'test', 1);
    });
    expect(result.current.notifications['1'].visible).toBe(true);
    expect(result.current.notifications['2'].visible).toBe(true);
    unmount();

    await act(async () => {
      await new Promise((r) => setTimeout(r, 20));
      expect(Object.keys(result.current.notifications).length).toBe(2);
    });
  });
});
