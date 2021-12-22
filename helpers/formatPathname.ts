export default function formatPathname(pathname: string): string {
  return pathname.replace('-', ' ').replace('/', '');
}
