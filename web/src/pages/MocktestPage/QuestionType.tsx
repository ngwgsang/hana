export const QUESTION_TYPES = {
    grammar: {
      title: "Ngữ pháp",
      prompt: `
      Câu hỏi bạn tạo ra phải thuộc dạng
      **Ngữ pháp**

      Ví dụ
      **Câu hỏi:** この仕事は＿＿＿＿がある人でなければできません。
      **Đáp án:**
      経験
      知識
      能力
      自信
      **Đáp án đúng:** 経験
      **Giải thích:** Cụm "なければできません" mang nghĩa **điều kiện bắt buộc**, vì vậy "kinh nghiệm" (経験) là lựa chọn phù hợp nhất.
      `
    },
    vocab_understand: {
      title: "Thông hiểu",
      prompt: `
      Câu hỏi bạn tạo ra phải thuộc dạng
      **Thông hiểu**

      Ví dụ
      **Câu hỏi:** 「彼の話はうそばかりだ」とはどういう意味ですか？
      **Đáp án:**
      彼は正直な人だ
      彼の話は信用できない
      彼は面白い話をする
      彼の話は本当のことばかりだ
      **Đáp án đúng:** 彼の話は信用できない
      **Giải thích:** "うそばかり" có nghĩa là "chỉ toàn nói dối", nên đáp án đúng là "彼の話は信用できない" (Câu chuyện của anh ta không đáng tin cậy).
      `
    },

    vocab_usage: {
      title: "Cách dùng từ",
      prompt: `
      Câu hỏi bạn tạo ra phải thuộc dạng
      **Cách dùng từ**

      Ví dụ
      **Câu hỏi:** 「はかどる」の正しい使い方はどれですか？
      **Đáp án:**
      勉強がはかどる
      食事がはかどる
      遊びがはかどる
      病気がはかどる
      **Đáp án đúng:**  勉強がはかどる
      **Giải thích:** Câu này có nghĩa là việc học tập được "tiến triển tốt").
      `
    },

    vocab_synonym: {
      title: "Từ đồng nghĩa",
      prompt: `
      Câu hỏi bạn tạo ra phải thuộc dạng
      **Tù đồng nghĩa**

      Ví dụ
      **Câu hỏi:** この問題はやさしい。
      **Đáp án:**
      簡単だ
      厳しい
      面倒だ
      急だ

      **Đáp án đúng:**  簡単だ
      **Giải thích:** Có nghĩa là "dễ".
      `
    },

    vocab_meaning: {
      title: "Nghĩa của từ",
      prompt: `
      Câu hỏi bạn tạo ra phải thuộc dạng
      **Nghĩa của từ**

      Ví dụ

      **Câu hỏi:** 「温暖化」の意味は何ですか？
      **Đáp án:**
      暖かくなること
      冷たくなること
      風が強くなること
      空気がきれいになること
      **Đáp án đúng:** 暖かくなること
      **Giải thích:** "温暖化" (biến đổi khí hậu) có nghĩa là "trở nên ấm hơn".
      `
    },

    kanji: {
      title: "Kanji 🔥",
      prompt: `
      Câu hỏi bạn tạo ra phải thuộc dạng
      **Cách đọc Kanji**

      Ví dụ

      **Câu hỏi:** 次の単語の読み方は何ですか？「温暖化」
      **Đáp án:**
      おんだんか
      あたたかか
      ぬくもりか
      ひだまりか
      **Đáp án đúng:** おんだんか
      **Giải thích:** "温暖化" được đọc là "おんだんか" (ondanka), có nghĩa là "Sự nóng lên toàn cầu".
      `
    },

    grammar_usage: {
      title: "Ngữ pháp phù hợp 🔥",
      prompt: `
      Câu hỏi bạn tạo ra phải thuộc dạng
      **Chọn dạng ngữ pháp phù hợp**

      Ví dụ

      **Câu hỏi:** 彼は医者（　　　）、病気についてよく知っている。
      **Đáp án:**
      にとって
      にしては
      のように
      だけあって

      **Đáp án đúng:** だけあって
      **Giải thích:** Ý nghĩa: “Chính vì là…, nên đúng là…” \n Dùng khi khen hoặc đưa ra nhận xét hợp lý dựa trên đặc điểm, vai trò, nghề nghiệp, v.v. \n → Vì anh ấy là bác sĩ, nên đương nhiên hiểu biết rõ về bệnh tật
      `
    }
}

