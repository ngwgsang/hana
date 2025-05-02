import exp from "node:constants";

export const QUESTION_TYPES = {
    // grammar: {
    //   title: "Ngữ pháp",
    //   prompt: `
    //   Câu hỏi bạn tạo ra phải thuộc dạng
    //   **Ngữ pháp**

    //   Ví dụ
    //   **Câu hỏi:** この仕事は＿＿＿＿がある人でなければできません。
    //   **Đáp án:**
    //   経験
    //   知識
    //   能力
    //   自信
    //   **Đáp án đúng:** 経験
    //   **Giải thích:** Cụm "なければできません" mang nghĩa **điều kiện bắt buộc**, vì vậy "kinh nghiệm" (経験) là lựa chọn phù hợp nhất.
    //   `
    // },
    // vocab_understand: {
    //   title: "Thông hiểu",
    //   prompt: `
    //   Câu hỏi bạn tạo ra phải thuộc dạng
    //   **Thông hiểu**

    //   Ví dụ
    //   **Câu hỏi:** 「彼の話はうそばかりだ」とはどういう意味ですか？
    //   **Đáp án:**
    //   彼は正直な人だ
    //   彼の話は信用できない
    //   彼は面白い話をする
    //   彼の話は本当のことばかりだ
    //   **Đáp án đúng:** 彼の話は信用できない
    //   **Giải thích:** "うそばかり" có nghĩa là "chỉ toàn nói dối", nên đáp án đúng là "彼の話は信用できない" (Câu chuyện của anh ta không đáng tin cậy).
    //   `
    // },

    // vocab_usage: {
    //   title: "Cách dùng từ",
    //   prompt: `
    //   Câu hỏi bạn tạo ra phải thuộc dạng
    //   **Cách dùng từ**

    //   Ví dụ
    //   **Câu hỏi:** 「はかどる」の正しい使い方はどれですか？
    //   **Đáp án:**
    //   勉強がはかどる
    //   食事がはかどる
    //   遊びがはかどる
    //   病気がはかどる
    //   **Đáp án đúng:**  勉強がはかどる
    //   **Giải thích:** Câu này có nghĩa là việc học tập được "tiến triển tốt").
    //   `
    // },

    // vocab_synonym: {
    //   title: "Từ đồng nghĩa",
    //   prompt: `
    //   Câu hỏi bạn tạo ra phải thuộc dạng
    //   **Tù đồng nghĩa**

    //   Ví dụ
    //   **Câu hỏi:** この問題はやさしい。
    //   **Đáp án:**
    //   簡単だ
    //   厳しい
    //   面倒だ
    //   急だ

    //   **Đáp án đúng:**  簡単だ
    //   **Giải thích:** Có nghĩa là "dễ".
    //   `
    // },

    // vocab_meaning: {
    //   title: "Nghĩa của từ",
    //   prompt: `
    //   Câu hỏi bạn tạo ra phải thuộc dạng
    //   **Nghĩa của từ**

    //   Ví dụ

    //   **Câu hỏi:** 「温暖化」の意味は何ですか？
    //   **Đáp án:**
    //   暖かくなること
    //   冷たくなること
    //   風が強くなること
    //   空気がきれいになること
    //   **Đáp án đúng:** 暖かくなること
    //   **Giải thích:** "温暖化" (biến đổi khí hậu) có nghĩa là "trở nên ấm hơn".
    //   `
    // },

    kanji: {
      title: "Kanji 🔥",
      prompt: `
      Câu hỏi bạn tạo ra phải thuộc dạng
      **Cách đọc Kanji**

      Ví dụ
      --------------------------------------------------------
      **Câu hỏi:** 彼は会社の**方針**に従って行動した。
      **Đáp án:**
      ほうじん
      ほうしん
      ほうせん
      ほうせい
      **Đáp án đúng:** ほうしん
      **Giải thích:** "方針" được đọc là "ほうしん" (houshin), có nghĩa là "chính sách, phương châm".
      ---------------------------------------------------------
      **Câu hỏi:** 新しい仕事を**依頼**された。
      **Đáp án:**
      いらい
      いらく
      いりょく
      いらん
      **Đáp án đúng:** いらい
      **Giải thích:** "依頼" được đọc là "いらい" (irai), có nghĩa là "yêu cầu, nhờ vả".
      ---------------------------------------------------------
      **Câu hỏi:** 彼は**責任**を持って仕事をしている。
      **Đáp án:**
      せきにん
      せきじん
      せっきん
      せきねん
      **Đáp án đúng:** せきにん
      **Giải thích:** "責任" được đọc là "せきにん" (sekinin), có nghĩa là "trách nhiệm".
      `,
      example: {
        question: "彼は会社の**方針**に従って行動した。",
        choices: [
          { text: "ほうじん", isCorrect: false },
          { text: "ほうしん", isCorrect: true },
          { text: "ほうせん", isCorrect: false },
          { text: "ほうせい", isCorrect: false }
        ],
        explanation: "方針 được đọc là ほうしん (houshin), có nghĩa là chính sách, phương châm."
      }
    },

    grammar_usage: {
      title: "Chọn ngữ pháp phù hợp",
      prompt: `
      Câu hỏi bạn tạo ra phải thuộc dạng
      **Chọn dạng ngữ pháp phù hợp**

      Ví dụ
      --------------------------------------------------------
      **Câu hỏi:** 彼は医者（　　　）、病気についてよく知っている。
      **Đáp án:**
      にとって
      にしては
      のように
      だけあって
      **Đáp án đúng:** だけあって
      **Giải thích:** Ý nghĩa: “Chính vì là…, nên đúng là…” \n Dùng khi khen hoặc đưa ra nhận xét hợp lý dựa trên đặc điểm, vai trò, nghề nghiệp, v.v. \n → Vì anh ấy là bác sĩ, nên đương nhiên hiểu biết rõ về bệnh tật
      --------------------------------------------------------
      Câu hỏi: 彼はアメリカに10年住んでいた（　　　）、英語がとても上手だ。
      Đáp án:
      だけに
      ところで
      くせに
      わりに
      Đáp án đúng: だけに
      Giải thích:
      Ý nghĩa: "Chính vì... nên quả đúng là..."
      → Dùng để nhấn mạnh kết quả là điều tất yếu hoặc hợp lý dựa trên lý do được nêu.
      → Vì anh ấy đã sống ở Mỹ 10 năm nên tiếng Anh giỏi là điều dễ hiểu.
      --------------------------------------------------------
      Câu hỏi: 日本に来た（　　　）、毎日が新しい発見だ。
      Đáp án:
      につれて
      にとって
      からには
      ばかりに
      Đáp án đúng: からには
      Giải thích:
      Ý nghĩa: "Một khi đã..., thì..."
      → Mẫu ngữ pháp này thể hiện việc khi đã bắt đầu hoặc quyết định làm điều gì đó thì phải thực hiện đến cùng.
      → Vì đã đến Nhật rồi nên mỗi ngày đều là những khám phá mới.
      `,
      example: {
        question: "彼は医者（　　　）、病気についてよく知っている。",
        choices: [
          { text: "にとって", isCorrect: false },
          { text: "にしては", isCorrect: false },
          { text: "のように", isCorrect: false },
          { text: "だけあって", isCorrect: true }
        ],
        explanation: "Ý nghĩa: Chính vì là…, nên đúng là… \n Dùng khi khen hoặc đưa ra nhận xét hợp lý dựa trên đặc điểm, vai trò, nghề nghiệp, v.v. \n → Vì anh ấy là bác sĩ, nên đương nhiên hiểu biết rõ về bệnh tật."
      }
    }
}

