export async function preloadFrames(prefix: string, count: number): Promise<HTMLImageElement[]> {
  const urls = Array.from({ length: count }, (_, i) =>
    `${prefix}${String(i + 1).padStart(4, '0')}.jpg`,
  );
  const imgs = urls.map((u) => {
    const im = new Image();
    im.decoding = 'async';
    im.src = u;
    return im;
  });
  await Promise.all(
    imgs.map((im) =>
      im
        .decode()
        .catch(() => new Promise<void>((res) => {
          im.onload = () => res();
          im.onerror = () => res();
        })),
    ),
  );
  return imgs;
}
