/**
 * app/services/api/endpoints.ts — عقود الـ API الموحدة (Mock / حقيقي).
 * كل endpoint هنا له توثيق مطابق في docs/02-api-contract.md.
 * في وضع المحاكاة الاستدعاء بيروح لطبقة handlers، ولما يوصل الباك إند
 * الحقيقي نفس الدوال بتعمل HTTP calls عبر apiClient بدون تغيير أي صفحة.
 */
import type {
  AccountTotals,
  AuthResponse,
  DashboardSummary,
  InventoryRow,
  Invoice,
  LocaleCode,
  ReportSummary,
} from '@/types'
import { isMockEnabled, realRequest } from '@/services/api/client'
import * as mock from '@/services/mock/handlers'

/* ================= Auth ================= */
export const authApi = {
  /** POST /auth/login — { identifier, password } → AuthResponse */
  signIn(payload: { identifier: string; password: string }): Promise<AuthResponse> {
    if (isMockEnabled()) return mock.mockSignIn(payload.identifier, payload.password)
    return realRequest<AuthResponse>('/auth/login', { method: 'POST', body: payload })
  },

  /** POST /auth/logout */
  async signOut(): Promise<void> {
    if (isMockEnabled()) {
      await mock.mockSignOut()
      return
    }
    await realRequest<null>('/auth/logout', { method: 'POST' })
  },

  /** POST /auth/accept-terms — قبول الشروط (بيتخزن على المستخدم في الباك إند) */
  acceptTerms(userId: string): Promise<{ termsAcceptedAt: string }> {
    if (isMockEnabled()) return mock.mockAcceptTerms(userId)
    return realRequest<{ termsAcceptedAt: string }>('/auth/accept-terms', { method: 'POST', body: { userId } })
  },

  /** POST /auth/onboarding — حفظ الإعداد الأولي وإنهاء البوابة */
  completeOnboarding(userId: string, profile: { jobTitle: string; avatarIcon: string }): Promise<{ onboardingCompleted: boolean }> {
    if (isMockEnabled()) return mock.mockCompleteOnboarding(userId, profile)
    return realRequest<{ onboardingCompleted: boolean }>('/auth/onboarding', { method: 'POST', body: { userId, profile } })
  },
}

/* ================= Invoices ================= */
export const invoicesApi = {
  /** POST /invoices/next-id → { id } */
  nextInvoiceId(): Promise<string> {
    if (isMockEnabled()) return mock.mockNextInvoiceId()
    return realRequest<{ id: string }>('/invoices/next-id', { method: 'POST' }).then(res => res.id)
  },

  /** POST /invoices/hold — تعليق فاتورة مفتوحة */
  hold(invoice: Invoice): Promise<Invoice> {
    if (isMockEnabled()) return mock.mockHoldInvoice(invoice)
    return realRequest<Invoice>('/invoices/hold', { method: 'POST', body: invoice })
  },

  /** POST /invoices/post — ترحيل فاتورة */
  post(invoice: Invoice): Promise<Invoice> {
    if (isMockEnabled()) return mock.mockPostInvoice(invoice)
    return realRequest<Invoice>('/invoices/post', { method: 'POST', body: invoice })
  },

  /** GET /invoices/held — قائمة المعلّقين */
  listHeld(): Promise<Invoice[]> {
    if (isMockEnabled()) return mock.mockListHeld()
    return realRequest<Invoice[]>('/invoices/held', { method: 'GET' })
  },

  /** POST /invoices/held/:id/restore */
  restoreHeld(id: string): Promise<Invoice | null> {
    if (isMockEnabled()) return mock.mockRestoreHeld(id)
    return realRequest<Invoice | null>(`/invoices/held/${id}/restore`, { method: 'POST' })
  },

  /** DELETE /invoices/held/:id */
  deleteHeld(id: string): Promise<boolean> {
    if (isMockEnabled()) return mock.mockDeleteHeld(id)
    return realRequest<boolean>(`/invoices/held/${id}`, { method: 'DELETE' })
  },
}

/* ================= Dashboard ================= */
export const dashboardApi = {
  /** GET /dashboard/summary — openDrafts بتتمرر عشان الاتساق بين الشاشات */
  summary(openDrafts: Invoice[], locale: LocaleCode): Promise<DashboardSummary> {
    if (isMockEnabled()) return mock.mockDashboardSummary(openDrafts, locale)
    return realRequest<DashboardSummary>(`/dashboard/summary?locale=${locale}`, { method: 'GET' })
  },
}

/* ================= Accounts ================= */
export const accountsApi = {
  /** GET /accounts/totals */
  totals(openDrafts: Invoice[]): Promise<AccountTotals> {
    if (isMockEnabled()) return mock.mockAccountTotals(openDrafts)
    return realRequest<AccountTotals>('/accounts/totals', { method: 'GET', body: { openDrafts } })
  },
}

/* ================= Inventory ================= */
export const inventoryApi = {
  /** GET /inventory?branchId=... */
  list(openDrafts: Invoice[], branchId?: string): Promise<InventoryRow[]> {
    if (isMockEnabled()) return mock.mockInventoryList(openDrafts, branchId)
    return realRequest<InventoryRow[]>(`/inventory?branchId=${branchId ?? 'ALL'}`, { method: 'GET' })
  },
}

/* ================= Reports ================= */
export const reportsApi = {
  /** GET /reports/summary */
  summary(openDrafts: Invoice[]): Promise<ReportSummary> {
    if (isMockEnabled()) return mock.mockReportSummary(openDrafts)
    return realRequest<ReportSummary>('/reports/summary', { method: 'GET', body: { openDrafts } })
  },
}

/* ================= System meta ================= */
export const systemApi = {
  /** GET /meta — الفروع والفئات والكتالوج وإعدادات الضريبة */
  meta() {
    if (isMockEnabled()) return mock.mockSystemMeta()
    return realRequest<Awaited<ReturnType<typeof mock.mockSystemMeta>>>('/meta', { method: 'GET' })
  },
}
