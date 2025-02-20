export function generateRandomId(
  length: number = 16,
  chars: string = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789_-'
): string {
  let id = '';
  const charLength = chars.length;
  const timestamp = Date.now().toString(36);

  for (let i = 0; i < length - timestamp.length; i++) {
    id += chars.charAt(Math.floor(Math.random() * charLength));
  }

  // Combine timestamp prefix with random string and ensure it's exactly the requested length
  return (timestamp + id).slice(0, length);
}

export const truncateAddr = (address: string) =>
  address.slice(0, 6) + '...' + address.slice(-4);
