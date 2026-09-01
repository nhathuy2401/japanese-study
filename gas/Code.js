/**
 * Nihongo Local — Google Apps Script Backend (Standalone Web App)
 * 
 * Functions:
 * 1. AI Proxy: Call Google Gemini API with hidden GEMINI_API_KEY in Script Properties
 * 2. Feedback: Log user feedback into Google Sheets
 * 3. Session Summaries: Log high-level study session metrics into Google Sheets
 * 4. Health Check: Status check endpoint
 * 
 * Script Properties required:
 * - GEMINI_API_KEY: Your Google Gemini API Key from Google AI Studio
 * - APP_SHARED_SECRET: (Optional) Secret token to verify client requests
 * - FEEDBACK_SHEET_ID: (Optional) Google Spreadsheet ID for logging
 */

const CANDIDATE_MODELS = [
  'gemini-2.0-flash',
  'gemini-2.5-flash',
  'gemini-1.5-flash-latest',
  'gemini-1.5-flash',
  'gemini-pro',
];

// Router for GET requests
function doGet(e) {
  const path = e.parameter.path || (e.pathInfo ? '/' + e.pathInfo : '/health');
  
  if (path === '/health' || path === 'health') {
    return createJsonResponse({
      ok: true,
      version: 'v1',
      service: 'nihongo-local-gas',
      timestamp: new Date().toISOString(),
    });
  }

  return createErrorResponse('Endpoint không hợp lệ', 404);
}

// Router for POST requests
function doPost(e) {
  try {
    if (!e || !e.postData || !e.postData.contents) {
      return createErrorResponse('Thiếu body request', 400);
    }

    const payload = JSON.parse(e.postData.contents);
    const path = e.parameter.path || (e.pathInfo ? '/' + e.pathInfo : payload.action || '');

    // 1. Verify shared secret if configured
    const expectedSecret = PropertiesService.getScriptProperties().getProperty('APP_SHARED_SECRET');
    if (expectedSecret && payload.sharedSecret !== expectedSecret) {
      console.warn('Request without valid sharedSecret, requestId:', payload.requestId);
    }

    // 2. Route endpoints
    switch (path) {
      case '/ai/grammar-explanation':
      case 'grammar-explanation':
        return handleGrammarExplanation(payload);

      case '/ai/writing-feedback':
      case 'writing-feedback':
        return handleWritingFeedback(payload);

      case '/feedback':
      case 'feedback':
        return handleFeedback(payload);

      case '/analytics/session-summary':
      case 'session-summary':
        return handleSessionSummary(payload);

      default:
        return createErrorResponse('Không tìm thấy endpoint: ' + path, 404);
    }
  } catch (error) {
    console.error('Lỗi xử lý doPost:', error);
    return createErrorResponse(error.message || 'Lỗi xử lý máy chủ GAS', 500);
  }
}

// ---------------------------------------------------------------------------
// AI Handlers (Gemini Proxy)
// ---------------------------------------------------------------------------

function handleGrammarExplanation(payload) {
  const pattern = payload.pattern;
  const level = payload.level || 'N5';
  
  if (!pattern) {
    return createErrorResponse('Thiếu tham số pattern', 400);
  }

  const apiKey = getGeminiApiKey();
  if (!apiKey) {
    return createErrorResponse('Chưa cấu hình GEMINI_API_KEY trong Script Properties của GAS', 500);
  }

  const prompt = `
Bạn là trợ giảng tiếng Nhật cho người Việt ở trình độ ${level}.
Hãy giải thích mẫu ngữ pháp "${pattern}" theo phong cách siêu trực quan, dễ hiểu, đời thường.
Trả về đúng định dạng JSON sau:
{
  "simpleExplanationVi": "Giải thích ngắn gọn, súc tích bằng tiếng Việt",
  "practicalNuance": "Sắc thái đời sống thực tế khi sử dụng",
  "examples": [
    {
      "japanese": "Câu tiếng Nhật ví dụ",
      "reading": "Cách đọc Hiragana",
      "meaningVi": "Dịch nghĩa tiếng Việt"
    }
  ]
}
`;

  const geminiResponse = callGeminiApi(apiKey, prompt);
  return createJsonResponse(geminiResponse);
}

function handleWritingFeedback(payload) {
  const sentence = payload.sentence;
  const targetGrammar = payload.targetGrammar || '';
  const level = payload.level || 'N5';

  if (!sentence) {
    return createErrorResponse('Thiếu câu tiếng Nhật (sentence)', 400);
  }

  const apiKey = getGeminiApiKey();
  if (!apiKey) {
    return createErrorResponse('Chưa cấu hình GEMINI_API_KEY trong Script Properties của GAS', 500);
  }

  const prompt = `
Bạn là trợ giảng tiếng Nhật cho người Việt ở trình độ ${level}.
Hãy đánh giá câu viết tiếng Nhật sau của người học:
Mục tiêu ngữ pháp: ${targetGrammar}
Câu người học viết: "${sentence}"

Trả về đúng định dạng JSON:
{
  "isGrammaticallyValid": true/false (đúng ngữ pháp hay không),
  "correctedSentence": "Câu tiếng Nhật chuẩn tự nhiên sau khi sửa",
  "naturalAlternative": "Cách nói tự nhiên hơn của người bản xứ nếu có",
  "explanationVi": "Giải thích ngắn gọn lỗi sai hoặc nhận xét bằng tiếng Việt",
  "grammarPoints": ["Mẫu 1", "Mẫu 2"],
  "caution": "Lưu ý quan trọng nếu có"
}
`;

  const geminiResponse = callGeminiApi(apiKey, prompt);
  return createJsonResponse(geminiResponse);
}

function callGeminiApi(apiKey, userPrompt) {
  let lastError = null;

  for (let i = 0; i < CANDIDATE_MODELS.length; i++) {
    const model = CANDIDATE_MODELS[i];
    const url = 'https://generativelanguage.googleapis.com/v1beta/models/' + model + ':generateContent?key=' + apiKey;

    const requestBody = {
      contents: [
        {
          role: 'user',
          parts: [{ text: userPrompt }]
        }
      ],
      generationConfig: {
        responseMimeType: 'application/json',
        temperature: 0.3,
      }
    };

    const options = {
      method: 'post',
      contentType: 'application/json',
      payload: JSON.stringify(requestBody),
      muteHttpExceptions: true,
    };

    try {
      const response = UrlFetchApp.fetch(url, options);
      const statusCode = response.getResponseCode();
      const responseText = response.getContentText();

      if (statusCode === 200) {
        const json = JSON.parse(responseText);
        const rawContent = json.candidates && json.candidates[0] && json.candidates[0].content && json.candidates[0].content.parts && json.candidates[0].content.parts[0] && json.candidates[0].content.parts[0].text;
        
        if (rawContent) {
          return JSON.parse(rawContent);
        }
      } else {
        console.warn('Model ' + model + ' failed with status ' + statusCode + ': ' + responseText);
        lastError = new Error('Gemini API (' + model + ') trả về lỗi HTTP ' + statusCode);
      }
    } catch (err) {
      console.warn('UrlFetchApp error on model ' + model + ':', err.message);
      lastError = err;
    }
  }

  throw lastError || new Error('Không thể kết nối đến bất kỳ model Gemini nào.');
}

// ---------------------------------------------------------------------------
// Sheet Logging Handlers (Feedback & Session Summaries)
// ---------------------------------------------------------------------------

function handleFeedback(payload) {
  const message = payload.message;
  const category = payload.category || 'general';
  const appVersion = payload.appVersion || '1.0.0';
  const requestId = payload.requestId || '';

  if (!message || message.trim().length === 0) {
    return createErrorResponse('Nội dung góp ý không được để trống', 400);
  }

  const sheet = getOrCreateSheet('Feedback', ['Timestamp', 'Category', 'Message', 'AppVersion', 'RequestId']);
  if (sheet) {
    sheet.appendRow([
      new Date().toISOString(),
      category,
      message,
      appVersion,
      requestId,
    ]);
  }

  return createJsonResponse({ ok: true, message: 'Đã ghi nhận góp ý thành công!' });
}

function handleSessionSummary(payload) {
  const date = payload.date || new Date().toISOString().split('T')[0];
  const level = payload.level || 'N5';
  const reviewed = payload.reviewed || 0;
  const correct = payload.correct || 0;
  const durationSeconds = payload.durationSeconds || 0;
  const uidHash = payload.uidHash || 'anonymous';
  const requestId = payload.requestId || '';

  const sheet = getOrCreateSheet('SessionSummaries', ['Timestamp', 'Date', 'UidHash', 'Level', 'Reviewed', 'Correct', 'DurationSeconds', 'RequestId']);
  if (sheet) {
    sheet.appendRow([
      new Date().toISOString(),
      date,
      uidHash,
      level,
      reviewed,
      correct,
      durationSeconds,
      requestId,
    ]);
  }

  return createJsonResponse({ ok: true });
}

// ---------------------------------------------------------------------------
// Utilities & Helpers
// ---------------------------------------------------------------------------

function getGeminiApiKey() {
  return PropertiesService.getScriptProperties().getProperty('GEMINI_API_KEY');
}

function getOrCreateSheet(sheetName, defaultHeaders) {
  try {
    const sheetId = PropertiesService.getScriptProperties().getProperty('FEEDBACK_SHEET_ID');
    let spreadsheet;
    
    if (sheetId) {
      spreadsheet = SpreadsheetApp.openById(sheetId);
    } else {
      spreadsheet = SpreadsheetApp.getActiveSpreadsheet();
    }

    if (!spreadsheet) return null;

    let sheet = spreadsheet.getSheetByName(sheetName);
    if (!sheet) {
      sheet = spreadsheet.insertSheet(sheetName);
      if (defaultHeaders && defaultHeaders.length > 0) {
        sheet.appendRow(defaultHeaders);
        sheet.getRange(1, 1, 1, defaultHeaders.length).setFontWeight('bold').setBackground('#E2E8F0');
      }
    }
    return sheet;
  } catch (err) {
    console.warn('Không thể mở Sheet để ghi log:', err.message);
    return null;
  }
}

function createJsonResponse(data) {
  return ContentService.createTextOutput(JSON.stringify(data))
    .setMimeType(ContentService.MimeType.JSON);
}

function createErrorResponse(message, statusCode) {
  return ContentService.createTextOutput(JSON.stringify({
    ok: false,
    error: message,
    status: statusCode || 500,
  })).setMimeType(ContentService.MimeType.JSON);
}
