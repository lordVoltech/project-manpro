import { Navigate, createBrowserRouter } from 'react-router-dom'
import { AppLayout } from '../layouts/AppLayout'
import { CustomersPage } from '../pages/CustomersPage'
import { DashboardPage } from '../pages/DashboardPage'
import { DesignBoardPage } from '../pages/DesignBoardPage'
import { LoginPage } from '../pages/LoginPage'
import { NotFoundPage } from '../pages/NotFoundPage'
import { ReportsPage } from '../pages/ReportsPage'
import { SettingsPage } from '../pages/SettingsPage'
import { ShowroomPage } from '../pages/ShowroomPage'
import { StockPage } from '../pages/StockPage'
import { TransactionsPage } from '../pages/TransactionsPage'
import { WorkshopPage } from '../pages/WorkshopPage'

export const router = createBrowserRouter([
  {
    path: '/login',
    element: <LoginPage />,
  },
  {
    path: '/',
    element: <AppLayout />,
    children: [
      { index: true, element: <Navigate to="/dashboard" replace /> },
      { path: 'dashboard', element: <DashboardPage /> },
      { path: 'workshop', element: <WorkshopPage /> },
      { path: 'showroom', element: <ShowroomPage /> },
      { path: 'stock', element: <StockPage /> },
      { path: 'transactions', element: <TransactionsPage /> },
      { path: 'customers', element: <CustomersPage /> },
      { path: 'reports', element: <ReportsPage /> },
      { path: 'settings', element: <SettingsPage /> },
      { path: 'design-board', element: <DesignBoardPage /> },
      { path: '*', element: <NotFoundPage /> },
    ],
  },
])
