import { CONFIG } from 'src/config-global';

import {PrivacyPolicyView} from 'src/sections/pricing/view';

// ----------------------------------------------------------------------

export const metadata = { title: `Pricing - ${CONFIG.appName}` };

export default function Page() {
  return <PrivacyPolicyView />;
}
