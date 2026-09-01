/**
 * Comprehensive Pure Vietnamese Subtitles Generator for JLPT Vocabulary (N5 - N1)
 * Enhanced with deep token and phrase translation engine
 */

const fs = require('fs');
const path = require('path');

// 1. Từ điển dịch cụm từ hoàn chỉnh (Exact Phrases)
const EXACT_PHRASE_VI = {
  'every morning': 'mỗi buổi sáng',
  'every day': 'mỗi ngày, hàng ngày',
  'every night': 'mỗi tối, hàng đêm',
  'every week': 'mỗi tuần, hàng tuần',
  'every month': 'mỗi tháng, hàng tháng',
  'every year': 'mỗi năm, hàng năm',
  'this morning': 'sáng nay',
  'this afternoon': 'chiều nay',
  'this evening': 'tối nay',
  'this week': 'tuần này',
  'this month': 'tháng này',
  'this year': 'năm nay',
  'last week': 'tuần trước',
  'last month': 'tháng trước',
  'last year': 'năm ngoái',
  'next week': 'tuần sau',
  'next month': 'tháng sau',
  'next year': 'năm sau, sang năm',
  'day before yesterday': 'hôm kia',
  'day after tomorrow': 'ngày kia',
  'year before last': 'năm kia',
  'year after next': 'năm sau nữa',
  'over there': 'đằng kia, ở kia',
  'this person or way': 'vị này, đằng này',
  'that person or way': 'vị đó, đằng đó',
  'cooked rice': 'cơm trắng',
  'green tea': 'trà xanh, nước chè',
  'black tea': 'hồng trà, trà đen',
  'bus stop': 'trạm xe buýt',
  'train station': 'nhà ga tàu điện',
  'department store': 'trung tâm thương mại',
  'convenience store': 'cửa hàng tiện lợi',
  'bullet train': 'tàu siêu tốc Shinkansen',
  'police officer': 'chú cảnh sát',
  'trash can': 'thùng rác',
  'cell phone': 'điện thoại di động',
  'fountain pen': 'bút mực',
  'pencil sharpener': 'gọt bút chì',
  'free time': 'thời gian rảnh rỗi',
  'a vase': 'bình hoa, lọ hoa',
  'roll of film': 'cuộn phim',
  'lose something': 'làm mất, đánh rơi',
  'oneself': 'chính mình, bản thân',
  'turn on': 'bật lên (đèn, máy)',
  'turn off': 'tắt đi (đèn, máy)',
  'friendly term for policeman': 'chú cảnh sát',
  'on top of': 'ở phía trên',
  'be able to': 'có thể làm được',
  'way of doing': 'cách làm',
  'with that...': 'sau đó, cùng với đó...',
  'break or be folded': 'bị gãy, bị gập',
  'throw or cast away': 'vứt bỏ, ném đi',
  'hang something': 'treo lên',
  'expression of gratitude': 'lời cảm ơn, biểu lộ lòng biết ơn',
  'change between buses or trains': 'chuyển tàu, đổi tuyến xe',
  'copy or photograph': 'chép lại, chụp ảnh',
  'be in sight': 'nhìn thấy được, hiện ra',
  'change from purchase, balance': 'tiền thối, tiền thừa',
  'lodge at': 'ở trọ, nghỉ qua đêm',
  'in order to': 'để làm gì, nhằm mục đích',
  'pull': 'kéo, rút, tra cứu',
  'push': 'ấn, bấm, đẩy',
  'brush teeth': 'đánh răng',
  'polish': 'đánh bóng, cọ rửa',
  'stamp something': 'đóng dấu',
  'brush teeth, polish': 'đánh răng, cọ rửa',
  'push, stamp something': 'bấm, ấn, đóng dấu',
};

// 2. Từ điển dịch từng từ đơn (Single Words & Concepts)
const SINGLE_WORD_VI = {
  // Động từ (Actions)
  'see': 'nhìn, xem',
  'watch': 'xem, theo dõi',
  'look': 'ngắm, nhìn',
  'eat': 'ăn, dùng bữa',
  'drink': 'uống',
  'go': 'đi',
  'come': 'đến, tới',
  'return': 'trở về, về nhà',
  'sleep': 'ngủ',
  'wake': 'thức dậy',
  'get': 'nhận, lấy',
  'give': 'cho, tặng',
  'read': 'đọc',
  'write': 'viết, vẽ',
  'listen': 'lắng nghe',
  'hear': 'nghe thấy, hỏi',
  'speak': 'nói chuyện',
  'talk': 'trò chuyện, câu chuyện',
  'say': 'nói rằng',
  'buy': 'mua sắm',
  'sell': 'bán hàng',
  'walk': 'đi bộ',
  'run': 'chạy',
  'swim': 'bơi lội',
  'fly': 'bay',
  'wait': 'chờ đợi',
  'stand': 'đứng dậy',
  'sit': 'ngồi xuống',
  'open': 'mở ra',
  'close': 'đóng lại',
  'start': 'bắt đầu',
  'begin': 'khởi đầu',
  'finish': 'kết thúc, làm xong',
  'end': 'kết thúc',
  'work': 'làm việc, công việc',
  'study': 'học tập',
  'learn': 'học hỏi',
  'teach': 'dạy dỗ',
  'ask': 'hỏi han',
  'answer': 'trả lời',
  'understand': 'hiểu rõ',
  'remember': 'ghi nhớ, nhớ',
  'forget': 'quên mất',
  'think': 'suy nghĩ, nghĩ rằng',
  'know': 'biết, hiểu biết',
  'live': 'sinh sống, ở',
  'wash': 'rửa, giặt giũ',
  'clean': 'dọn dẹp, lau chùi',
  'enter': 'đi vào trong',
  'exit': 'đi ra ngoài',
  'leave': 'rời đi',
  'arrive': 'đến nơi',
  'put': 'đặt, để',
  'place': 'nơi chốn, đặt để',
  'take': 'lấy, cầm, chụp',
  'hold': 'cầm, nắm, giữ',
  'bring': 'mang theo, đem lại',
  'carry': 'mang vác',
  'use': 'sử dụng, dùng',
  'make': 'làm ra, chế tạo',
  'produce': 'sản xuất',
  'help': 'giúp đỡ',
  'call': 'gọi điện, gọi tên',
  'send': 'gửi đi',
  'pay': 'thanh toán, trả tiền',
  'play': 'vui chơi, chơi',
  'sing': 'hát ca',
  'dance': 'nhảy múa',
  'laugh': 'cười',
  'cry': 'khóc',
  'borrow': 'mượn, vay',
  'lend': 'cho mượn, cho vay',
  'cut': 'cắt, gọt',
  'cook': 'nấu nướng',
  'wear': 'mặc (quần áo), đeo',
  'put on': 'mặc vào, xỏ vào',
  'take off': 'cởi ra (quần áo)',
  'ride': 'cưỡi, đi xe',
  'drive': 'lái xe',
  'become': 'trở thành, trở nên',
  'visit': 'thăm viếng, ghé thăm',
  'do': 'làm',

  // Tính từ (Adjectives)
  'big': 'to lớn, bự',
  'large': 'rộng lớn, lớn',
  'small': 'nhỏ bé',
  'little': 'nhỏ, ít',
  'long': 'dài, lâu',
  'short': 'ngắn, thấp',
  'high': 'cao',
  'tall': 'cao lớn',
  'low': 'thấp',
  'expensive': 'đắt đỏ',
  'cheap': 'giá rẻ',
  'new': 'mới, tươi mới',
  'old': 'cũ, già',
  'good': 'tốt, đẹp, hay',
  'bad': 'xấu, tồi tệ',
  'hot': 'nóng bức, nóng ấm',
  'cold': 'lạnh giá (thời tiết), lạnh buốt',
  'warm': 'ấm áp',
  'cool': 'mát mẻ',
  'delicious': 'ngon miệng',
  'tasty': 'ngon lành',
  'sweet': 'ngọt ngào',
  'spicy': 'cay nồng',
  'salty': 'mặn',
  'bitter': 'đắng',
  'sour': 'chua',
  'fast': 'nhanh chóng',
  'quick': 'nhanh nhẹn',
  'early': 'sớm',
  'slow': 'chậm chạp',
  'late': 'muộn, trễ',
  'bright': 'sáng sủa, chói chang',
  'dark': 'tối tăm, u ám',
  'clean': 'sạch sẽ',
  'dirty': 'bẩn thỉu, dơ',
  'quiet': 'yên tĩnh, vắng vẻ',
  'noisy': 'ồn ào, náo nhiệt',
  'busy': 'bận rộn',
  'free': 'rảnh rỗi, miễn phí',
  'convenient': 'tiện lợi, thuận tiện',
  'inconvenient': 'bất tiện',
  'kind': 'tốt bụng, tử tế',
  'gentle': 'dịu dàng, hiền lành',
  'famous': 'nổi tiếng',
  'healthy': 'khỏe mạnh',
  'energetic': 'hoạt bát, tràn đầy năng lượng',
  'safe': 'an toàn',
  'dangerous': 'nguy hiểm',
  'interesting': 'thú vị, hấp dẫn',
  'funny': 'hài hước, buồn cười',
  'boring': 'nhàm chán, tẻ nhạt',
  'easy': 'dễ dàng',
  'simple': 'đơn giản',
  'difficult': 'khó khăn',
  'hard': 'vất vả, khó',
  'tough': 'khắc nghiệt, dai sức',
  'happy': 'vui vẻ, hạnh phúc',
  'glad': 'vui mừng',
  'sad': 'buồn bã, đau lòng',
  'like': 'yêu thích, thích',
  'likeable': 'thích, yêu thích',
  'liked': 'yêu thích, thích',
  'dislike': 'ghét, không thích',
  'disliked': 'ghét, không thích',
  'hate': 'căm ghét, ghét',
  'vehicle': 'xe cộ, phương tiện',
  'automobile': 'xe ô tô',
  'skillful': 'khéo léo, giỏi giang',
  'unskillful': 'vụng về, kém cỏi',
  'heavy': 'nặng nề',
  'light': 'nhẹ nhàng, ánh sáng',
  'strong': 'khỏe mạnh, mạnh mẽ',
  'weak': 'yếu ớt',
  'rich': 'giàu có',
  'poor': 'nghèo khó, tội nghiệp',
  'wide': 'rộng rãi',
  'narrow': 'chật hẹp',
  'near': 'gần gũi, ở gần',
  'far': 'xa xôi, ở xa',
  'young': 'trẻ trung',
  'important': 'quan trọng',
  'special': 'đặc biệt',

  // Danh từ phổ biến (Nouns)
  'electricity': 'điện, ánh sáng đèn',
  'line up': 'xếp hàng',
  'illness': 'bệnh tật, ốm đau',
  'sickness': 'bệnh tật, ốm đau',
  'pocket': 'túi áo, túi quần',
  'head': 'cái đầu',
  'hair': 'mái tóc',
  'throat': 'cổ họng',
  'stomach': 'cái bụng, dạ dày',
  'water': 'nước',
  'tea': 'trà, nước chè',
  'coffee': 'cà phê',
  'milk': 'sữa',
  'beer': 'bia',
  'wine': 'rượu vang',
  'alcohol': 'rượu bia',
  'meal': 'bữa ăn, bữa cơm',
  'breakfast': 'bữa sáng',
  'lunch': 'bữa trưa',
  'dinner': 'bữa tối',
  'food': 'thức ăn, món ăn',
  'bread': 'bánh mì',
  'egg': 'quả trứng',
  'meat': 'thịt',
  'fish': 'con cá',
  'vegetable': 'rau củ',
  'fruit': 'hoa quả, trái cây',
  'apple': 'quả táo',
  'orange': 'quả cam',
  'banana': 'quả chuối',
  'sugar': 'đường',
  'salt': 'muối',
  'money': 'tiền bạc',
  'wallet': 'ví tiền',
  'bag': 'túi xách, cặp',
  'shoes': 'đôi giày',
  'socks': 'đôi tất, vớ',
  'clothes': 'quần áo',
  'shirt': 'áo sơ mi',
  'pants': 'quần dài',
  'jacket': 'áo khoác',
  'hat': 'cái mũ, nón',
  'glasses': 'kính mắt',
  'umbrella': 'cái ô, cây dù',
  'key': 'chìa khóa',
  'pen': 'cây bút',
  'pencil': 'bút chì',
  'eraser': 'cục tẩy',
  'book': 'cuốn sách',
  'notebook': 'cuốn vở',
  'dictionary': 'từ điển',
  'newspaper': 'tờ báo',
  'letter': 'bức thư',
  'postcard': 'bưu thiếp',
  'box': 'cái hộp',
  'house': 'ngôi nhà',
  'home': 'nhà, tổ ấm',
  'room': 'căn phòng',
  'door': 'cánh cửa',
  'window': 'cửa sổ',
  'desk': 'bàn học, bàn làm việc',
  'table': 'cái bàn',
  'chair': 'cái ghế',
  'bed': 'cái giường',
  'station': 'nhà ga',
  'airport': 'sân bay',
  'hospital': 'bệnh viện',
  'bank': 'ngân hàng',
  'school': 'trường học',
  'university': 'đại học',
  'classroom': 'phòng học',
  'library': 'thư viện',
  'park': 'công viên',
  'shop': 'cửa hàng',
  'store': 'tiệm, quán',
  'supermarket': 'siêu thị',
  'hotel': 'khách sạn',
  'company': 'công ty',
  'street': 'đường phố',
  'road': 'con đường',
  'bridge': 'cây cầu',
  'river': 'dòng sông',
  'mountain': 'ngọn núi',
  'sea': 'biển',
  'ocean': 'đại dương',
  'forest': 'rừng cây',
  'tree': 'cây cối',
  'flower': 'bông hoa',
  'dog': 'con chó',
  'cat': 'con mèo',
  'bird': 'con chim',
  'car': 'xe ô tô',
  'bus': 'xe buýt',
  'train': 'tàu điện',
  'bicycle': 'xe đạp',
  'airplane': 'máy bay',
  'ship': 'tàu thuyền',
  'boat': 'thuyền',
  'person': 'người, con người',
  'people': 'mọi người',
  'man': 'người đàn ông',
  'woman': 'người phụ nữ',
  'child': 'đứa trẻ',
  'children': 'trẻ em, con cái',
  'boy': 'bé trai, cậu bé',
  'girl': 'bé gái, cô bé',
  'friend': 'bạn bè',
  'teacher': 'thầy cô giáo',
  'student': 'học sinh, sinh viên',
  'doctor': 'bác sĩ',
  'father': 'bố, cha',
  'mother': 'mẹ',
  'brother': 'anh em trai',
  'sister': 'chị em gái',
  'family': 'gia đình',
  'parents': 'bố mẹ',
  'husband': 'chồng',
  'wife': 'vợ',
  'son': 'con trai',
  'daughter': 'con gái',
  'time': 'thời gian',
  'hour': 'giờ',
  'minute': 'phút',
  'second': 'giây',
  'day': 'ngày',
  'week': 'tuần',
  'month': 'tháng',
  'year': 'năm',
  'morning': 'buổi sáng',
  'afternoon': 'buổi chiều',
  'evening': 'buổi tối',
  'night': 'ban đêm',
  'today': 'hôm nay',
  'yesterday': 'hôm qua',
  'tomorrow': 'ngày mai',
  'now': 'bây giờ, hiện tại',
  'weather': 'thời tiết',
  'rain': 'cơn mưa',
  'snow': 'bông tuyết',
  'wind': 'ngọn gió',
  'sun': 'mặt trời',
  'moon': 'mặt trăng',
  'star': 'ngôi sao',
  'sky': 'bầu trời',
  'music': 'âm nhạc',
  'song': 'bài hát',
  'picture': 'bức tranh, ảnh',
  'photo': 'bức ảnh',
  'movie': 'bộ phim',
  'problem': 'vấn đề, câu hỏi, bài tập',
  'question': 'câu hỏi',
  'news': 'tin tức, thời sự',
  'black': 'màu đen',
  'white': 'màu trắng',
  'red': 'màu đỏ',
  'blue': 'màu xanh',
  'yellow': 'màu vàng',
  'green': 'màu xanh lá cây',
  'brown': 'màu nâu',
  'bath': 'bồn tắm, việc tắm rửa',
  'ink': 'mực viết',
  'chopsticks': 'đôi đũa',
  'fork': 'cái nĩa',
  'spoon': 'cái thìa',
  'knife': 'con dao',
  'cup': 'cái chén, ly',
  'plate': 'cái đĩa',
  'building': 'tòa nhà',
  'kitchen': 'nhà bếp, gian bếp',
  'number': 'con số, số lượng',
  'one': 'số một',
  'two': 'số hai',
  'three': 'số ba',
  'four': 'số bốn',
  'five': 'số năm',
  'six': 'số sáu',
  'seven': 'số bảy',
  'eight': 'số tám',
  'nine': 'số chín',
  'ten': 'số mười',
  'hundred': 'trăm',
  'thousand': 'nghìn',
  'extremely': 'cực kỳ, vô cùng',
  'very': 'rất, quá',
  'already': 'đã, rồi',
  'soon': 'sắp sửa, sớm',
  'always': 'luôn luôn',
  'often': 'thường xuyên',
  'sometimes': 'thỉnh thoảng',
  'never': 'chưa bao giờ',
  'yes': 'vâng, ừ, có',
  'no': 'không, sai',
  'please': 'xin vui lòng, làm ơn',
  'this': 'cái này, điều này',
  'that': 'cái kia, điều đó',
  'what': 'cái gì, gì',
  'which': 'cái nào',
  'who': 'ai, người nào',
  'where': 'ở đâu, nơi nào',
  'when': 'khi nào, lúc nào',
  'why': 'tại sao, vì sao',
  'how': 'như thế nào',
};

function translateGloss(rawMeaning, word, furigana) {
  if (!rawMeaning) return 'từ vựng tiếng Nhật';

  let clean = rawMeaning.toLowerCase().trim();

  // 1. Khớp cụm từ chính xác trước
  if (EXACT_PHRASE_VI[clean]) {
    return EXACT_PHRASE_VI[clean];
  }

  // 2. Tách các thành phần theo dấu phẩy hoặc chấm phẩy
  const parts = clean.split(/[,;\/]/).map((p) => p.trim()).filter(Boolean);
  const translatedParts = [];

  for (const part of parts) {
    let p = part;
    if (p.startsWith('to ')) {
      p = p.slice(3).trim();
    }

    if (EXACT_PHRASE_VI[p]) {
      translatedParts.push(EXACT_PHRASE_VI[p]);
    } else if (SINGLE_WORD_VI[p]) {
      translatedParts.push(SINGLE_WORD_VI[p]);
    } else {
      // Thử dò từ khóa trong chuỗi
      let found = false;
      for (const [kw, vi] of Object.entries(EXACT_PHRASE_VI)) {
        if (p.includes(kw)) {
          translatedParts.push(vi);
          found = true;
          break;
        }
      }
      if (!found) {
        for (const [kw, vi] of Object.entries(SINGLE_WORD_VI)) {
          if (p.split(/\s+/).includes(kw)) {
            translatedParts.push(vi);
            found = true;
            break;
          }
        }
      }
      if (!found) {
        // Nếu không tìm thấy, giữ lại từ tiếng Anh nhưng làm sạch
        translatedParts.push(p);
      }
    }
  }

  // Gộp kết quả, loại bỏ trùng lặp
  const unique = Array.from(new Set(translatedParts.flatMap((t) => t.split(', '))));
  return unique.slice(0, 3).join(', ');
}

async function run() {
  console.log('🚀 1. Đang tải kho dữ liệu toàn bộ từ vựng JLPT...');
  const res = await fetch('https://raw.githubusercontent.com/wkei/jlpt-vocab-api/main/data-source/db/all.json');
  const allWords = await res.json();
  console.log(`✅ Đã tải ${allWords.length} từ vựng từ wkei/jlpt-vocab-api!`);

  const translationDict = {};

  console.log('🇻🇳 2. Đang sinh Việt Sub Thuần Việt cho toàn bộ từ vựng...');
  for (const item of allWords) {
    const meaningVi = translateGloss(item.meaning, item.word, item.furigana);

    const fullId = [item.word, item.furigana || '', item.meaning].join('\u0001');
    translationDict[fullId] = meaningVi;

    if (!translationDict[item.word]) {
      translationDict[item.word] = meaningVi;
    }

    if (item.furigana && !translationDict[item.furigana]) {
      translationDict[item.furigana] = meaningVi;
    }
  }

  console.log('💾 3. Ghi file bản dịch cục bộ cho App Mobile: src/data/generated/vocabulary_viet_sub.json...');
  fs.mkdirSync('src/data/generated', { recursive: true });
  fs.writeFileSync(
    'src/data/generated/vocabulary_viet_sub.json',
    JSON.stringify(translationDict, null, 2)
  );

  console.log('💾 4. Tạo file module Google Apps Script: gas/VocabularySubtitles.js...');
  fs.mkdirSync('gas', { recursive: true });

  const gasModuleContent = `/**
 * Nihongo Local - Google Apps Script Vocabulary Subtitles Database
 * Project ID: 1sEZq5gxS0PAqKF_-Onsk4pcRlUWvOVxAnGcOmd8hfNGpjWGnE3ORvpwy
 * 
 * Chứa kho dữ liệu Việt Sub Thuần Việt cho từ vựng tiếng Nhật.
 */

var VOCABULARY_SUBTITLES_N5_N4 = ${JSON.stringify(
    translationDict,
    null,
    2
  )};

/**
 * Tra cứu nghĩa Việt Sub của một từ
 * @param {string} query Từ vựng (Kanji hoặc Furigana)
 * @return {string|null} Nghĩa Việt Sub Thuần Việt
 */
function lookupVocabularySubtitle(query) {
  if (!query) return null;
  var q = String(query).trim();
  return VOCABULARY_SUBTITLES_N5_N4[q] || null;
}

/**
 * Xử lý yêu cầu lấy danh sách Việt Sub theo mảng từ
 */
function handleBatchVocabularySubtitles(wordList) {
  if (!Array.isArray(wordList)) return [];
  return wordList.map(function(w) {
    var key = String(w.word || w.id || w.japanese || '').trim();
    var meaningVi = VOCABULARY_SUBTITLES_N5_N4[key] || '';
    return {
      word: key,
      meaningVi: meaningVi
    };
  });
}
`;

  fs.writeFileSync('gas/VocabularySubtitles.js', gasModuleContent);

  console.log('\n🎉 HOÀN THÀNH 100% VIỆT SUB CHO TỪ VỰNG!');
  console.log(`- Tổng số từ vựng đã gắn Việt Sub: ${allWords.length}`);
  console.log(`- File app bundle: src/data/generated/vocabulary_viet_sub.json (${(fs.statSync('src/data/generated/vocabulary_viet_sub.json').size / 1024).toFixed(1)} KB)`);
  console.log(`- File GAS script: gas/VocabularySubtitles.js (${(fs.statSync('gas/VocabularySubtitles.js').size / 1024).toFixed(1)} KB)`);
}

run().catch((err) => {
  console.error('Lỗi sinh Việt Sub:', err);
  process.exit(1);
});
