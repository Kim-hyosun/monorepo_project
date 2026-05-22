import { AlarmNotifyDialog } from '@/features/pms/components/AlarmNotifyDialog'
import Sidebar from '@/shared/components/Sidebar'

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className='flex min-h-screen'>
      <Sidebar />
      <main className='flex-1 p-6'>{children}</main>
      {/* 글로벌 알람 dialog — 한 번만 마운트 */}
      <AlarmNotifyDialog />
    </div>
  )
}
