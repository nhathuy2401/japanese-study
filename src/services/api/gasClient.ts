import Constants from 'expo-constants';

export class GasApiError extends Error {
  constructor(message: string, public readonly status?: number, public readonly cause?: unknown) {
    super(message);
    this.name = 'GasApiError';
  }
}

// Lấy Base URL từ biến môi trường EXPO_PUBLIC_GAS_API_URL hoặc config
export function getGasBaseUrl(): string {
  return (
    process.env.EXPO_PUBLIC_GAS_API_URL ||
    Constants.expoConfig?.extra?.gasApiUrl ||
    ''
  );
}

export interface GasRequestOptions {
  timeoutMs?: number;
  retries?: number;
}

export async function callGasApi<T>(
  action: string,
  payload: Record<string, any> = {},
  options: GasRequestOptions = {}
): Promise<T> {
  const baseUrl = getGasBaseUrl();
  if (!baseUrl || baseUrl.trim().length === 0) {
    throw new GasApiError(
      'Chưa cấu hình URL Google Apps Script (EXPO_PUBLIC_GAS_API_URL). Vui lòng kiểm tra lại file cấu hình.',
      400
    );
  }

  const timeoutMs = options.timeoutMs ?? 20_000;
  const maxRetries = options.retries ?? 1;
  const requestId = `req_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;

  const bodyData = {
    ...payload,
    action,
    requestId,
    appVersion: Constants.expoConfig?.version || '1.0.0',
    sharedSecret: process.env.EXPO_PUBLIC_APP_SHARED_SECRET || undefined,
  };

  let lastError: unknown = null;

  for (let attempt = 0; attempt <= maxRetries; attempt += 1) {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), timeoutMs);

    try {
      // GAS Web App thường yêu cầu chuyển hướng (redirect) 302 sang script.googleusercontent.com
      const response = await fetch(`${baseUrl}?path=${encodeURIComponent(action)}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'text/plain;charset=utf-8', // GAS doPost parse dễ nhất với text/plain hoặc application/json
        },
        body: JSON.stringify(bodyData),
        signal: controller.signal,
      });

      if (!response.ok) {
        throw new GasApiError(`Google Apps Script trả về lỗi HTTP ${response.status}`, response.status);
      }

      const text = await response.text();
      let data: any;
      try {
        data = JSON.parse(text);
      } catch (e) {
        throw new GasApiError('Không thể phân tích dữ liệu JSON trả về từ máy chủ GAS', 500, e);
      }

      if (data && data.ok === false) {
        throw new GasApiError(data.error || 'Yêu cầu không thành công', data.status || 400);
      }

      return data as T;
    } catch (error: any) {
      lastError = error;
      if (error instanceof GasApiError && error.status && error.status >= 400 && error.status < 500) {
        // Không retry các lỗi 4xx client
        throw error;
      }
      if (error.name === 'AbortError') {
        lastError = new GasApiError('Yêu cầu tới Google Apps Script quá thời gian (Timeout 20s). Vui lòng thử lại.');
      }
      if (attempt === maxRetries) {
        break;
      }
      // Đợi ngắn 800ms trước khi retry
      await new Promise((r) => setTimeout(r, 800));
    } finally {
      clearTimeout(timeoutId);
    }
  }

  if (lastError instanceof GasApiError) {
    throw lastError;
  }
  throw new GasApiError('Không thể kết nối tới Google Apps Script. Vui lòng kiểm tra kết nối mạng.', 0, lastError);
}

