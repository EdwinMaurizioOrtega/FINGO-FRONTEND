'use client';

import { useEffect } from 'react';

import { useRouter } from 'src/routes/hooks';

import { CONFIG } from 'src/config-global';
import {NotFoundView} from "../sections/error";
import {JobListView} from "../sections/job/view";

// ----------------------------------------------------------------------

export default function Page() {
  // const router = useRouter();
  //
  // useEffect(() => {
  //   router.push(CONFIG.auth.redirectPath);
  // }, [router]);

  return  <JobListView />;
}
