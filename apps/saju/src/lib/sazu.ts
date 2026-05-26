import 'server-only'

import { SazuClient } from '@sazuapp/client'

/**
 * 서버 전용 SAZU 클라이언트 싱글톤.
 * `import 'server-only'` 로 클라이언트 번들 포함 시 빌드 에러 발생 → API key 노출 차단.
 */
let _client: SazuClient | null = null

export function getSazuClient(): SazuClient {
  if (_client) return _client
  const apiKey = process.env.SAZU_API_KEY
  if (!apiKey) {
    throw new Error(
      'SAZU_API_KEY 환경변수가 설정되지 않았습니다. apps/saju/.env.local 에 키를 추가하세요. ' +
        '(발급: https://www.sazu.app/manse-api/dashboard/keys)'
    )
  }
  _client = new SazuClient({
    apiKey,
    ...(process.env.SAZU_API_BASE_URL ? { baseUrl: process.env.SAZU_API_BASE_URL } : {}),
  })
  return _client
}
