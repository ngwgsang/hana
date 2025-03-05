import { useState, useRef, useEffect, useContext } from 'react';
import { navigate } from '@redwoodjs/router';
import { useGlobal } from 'src/context/GlobalContext';


const SimpleLoginPage = () => {
  const [code, setCode] = useState(Array(6).fill(""));
  const [error, setError] = useState("");
  const inputRefs = useRef([]);
  const global = useGlobal();

  useEffect(() => {
    // Focus vào ô input đầu tiên khi trang vừa load
    if (inputRefs.current[0]) {
      inputRefs.current[0].focus();
    }
  }, []);

  const handleChange = (index, value) => {
    if (!/^\d?$/.test(value)) return; // Chỉ cho phép nhập số 0-9
    const newCode = [...code];
    newCode[index] = value;
    setCode(newCode);

    // Chuyển focus sang ô tiếp theo nếu có giá trị nhập vào
    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index, event) => {
    if (event.key === "Backspace" && !code[index] && index > 0) {
      // Xóa ô hiện tại và chuyển focus về ô trước đó
      const newCode = [...code];
      newCode[index - 1] = "";
      setCode(newCode);
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handleSubmit = () => {
    const enteredCode = code.join(""); // Nối các số lại thành mã hoàn chỉnh
    const correctCode = process.env.REDWOOD_ENV_LOGIN_CODE; // Lấy mã từ ENV

    if (enteredCode == correctCode) {
      global.setAuth(true);
    } else {
      global.setAuth(false)
      setError("Mã không hợp lệ! Hãy thử lại.");
      setCode(Array(6).fill("")); // Xóa input nếu nhập sai
      inputRefs.current[0]?.focus(); // Quay lại ô đầu tiên
    }

  };

  useEffect(() => {
    if (global.isAuth == true) {
      navigate("/home")
    }
  }, [global.isAuth])

  return (
    <div className="flex justify-center items-center h-screen bg-gray-100">
      <div className="bg-white p-6 rounded-lg shadow-lg w-80">
        <h2 className="text-2xl font-bold text-center mb-4">Đăng nhập</h2>

        <form
          className="max-w-sm mx-auto"
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault(); // Ngăn reload trang
              handleSubmit();
            }
          }}
        >
          <div className="flex mb-2 space-x-2">
            {code.map((num, index) => (
              <input
                key={index}
                type="number"
                maxLength="1"
                value={num}
                ref={(el) => (inputRefs.current[index] = el)}
                onChange={(e) => handleChange(index, e.target.value)}
                onKeyDown={(e) => handleKeyDown(index, e)}
                className="block w-9 h-9 py-3 text-sm font-extrabold text-center text-gray-900 bg-white border border-gray-300 rounded-lg focus:ring-primary-500 focus:border-primary-500"
                required
              />
            ))}
          </div>
          {error && <p className="text-red-500 text-sm mt-2">{error}</p>}

          <button
            type="button"
            onClick={handleSubmit}
            className="w-full mt-4 px-3 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-400"
          >
            Xác nhận
          </button>
        </form>
      </div>
    </div>
  );
};

export default SimpleLoginPage;
