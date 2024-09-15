import { CONFIG } from 'src/config-global';

import { NotFoundView } from 'src/sections/error';

// ----------------------------------------------------------------------

export const metadata = { title: `¡Página 404 no encontrada! | Error - ${CONFIG.appName}` };

export default function Page() {
  return <NotFoundView />;
}
