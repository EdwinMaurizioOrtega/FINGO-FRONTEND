import { CONFIG } from 'src/config-global';

import { JwtResetPasswordView } from 'src/auth/view/jwt';

// ----------------------------------------------------------------------

export const metadata = { title: `Restablecer contraseña - ${CONFIG.appName}` };

export default function Page() {
  return <JwtResetPasswordView />;
}
