/**
 * @param timeout The amount of time, in milliseconds, to delay.
 */
export async function delay(timeout: number): Promise<void> {
  return new Promise((resolve) => {
    setTimeout(resolve, timeout);
  });
}
