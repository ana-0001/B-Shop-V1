/**
 * app/services/api/client.ts — غلاف ofetch المركزي لكل طلبات الـ HTTP.
 * - في وضع المحاكاة (apiMock=true) الطلبات بتتنفذ من طبقة الـ Mock ولايوصل للشبكة.
 * - لما يتحول المشروع للباك إند الحقيقي نفس الغلاف بيستخدم مباشرة
 *   (راجع docs/02-api-contract.md و docs/06-backend-migration.md).
 */
import { ofetch  } from 'ofetch'
import type {FetchOptions} from 'ofetch';
import { ApiRequestError } from '@/types'

/** قراءة إعدادات التشغيل بشكل آمن خارج سياق الإعداد */
function runtimePublic(): { apiMock: boolean; apiBaseUrl: string } {
  try {
    const config = useRuntimeConfig()
    return {
      apiMock: config.public.apiMock !== false,
      apiBaseUrl: config.public.apiBaseUrl || '/api',
    }
  } catch {
    return { apiMock: true, apiBaseUrl: '/api' }
  }
}

/** هل نحن في وضع المحاكاة؟ */
export function isMockEnabled(): boolean {
  return runtimePublic().apiMock
}

/** غلاف ofetch الموحد — مع معالجة أخطاء موحدة على شكل ApiRequestError */
export const apiClient = ofetch.create({
  retry: 1,

  onRequest({ options }) {
    // هنا هيتضاف هيدر Authorization عند التحويل للباك إند الحقيقي
    options.headers = new Headers(options.headers)
  },

  onResponseError({ response }) {
    const body = response._data as { code?: string; message?: string; messageAr?: string } | undefined
    throw new ApiRequestError({
      code: body?.code ?? `HTTP_${response.status}`,
      message: body?.message ?? response.statusText,
      messageAr: body?.messageAr ?? body?.message ?? response.statusText,
    })
  },

  onRequestError({ error }) {
    throw new ApiRequestError({
      code: 'NETWORK_ERROR',
      message: error.message,
      messageAr: 'تعذر الاتصال بالخادم.',
    })
  },
})

/** تنفيذ طلب حقيقي (يُستخدم فقط عندما apiMock=false) */
export function realRequest<T>(path: string, options?: FetchOptions<'json'>): Promise<T> {
  return apiClient<T>(path, {
    baseURL: runtimePublic().apiBaseUrl,
    ...options,
  })
}
