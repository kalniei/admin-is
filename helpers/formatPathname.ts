export function getNavArr() {
  return [
    {
      text: 'Główna',
      path: '/'
    },
    {
      text: 'Zarządzanie tabelami użytkowników',
      path: '/tables-manager'
    },
    {
      text: 'Zarządzanie szablonami email',
      path: '/email-manager'
    },
    {
      text: 'Wysyłka email',
      path: '/mail-sender'
    },
    {
      text: 'Kreator podstawowych warsztatów',
      path: '/basic-creator'
    },
    {
      text: 'Zarządzanie podstawowymi warsztatami',
      path: '/basic-manager'
    },
    {
      text: 'Zarządzanie rozrszerzonymi warsztatami',
      path: '/advanced-manager'
    }
  ];
}
export default function formatPathname(pathname: string): string {
  return getNavArr().find((x) => x.path === pathname)?.text || 'not found';
}
