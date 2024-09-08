import { AuthSplitLayout } from 'src/layouts/auth-split';

import { GuestGuard } from 'src/auth/guard';
import {JobList} from "../../../../sections/job/job-list";
import {JobListView} from "../../../../sections/job/view";

// ----------------------------------------------------------------------

export default function Layout({ children }) {
  return (
    <GuestGuard>
      <AuthSplitLayout section={{ title: 'Hi, Welcome back' }}>{children}</AuthSplitLayout>
      {/*<JobListView></JobListView>*/}
    </GuestGuard>
  );
}
