const DIGITS = /\D/g;

/** 서버 `backend/src/lib/address.js` 의 PHONE_PATTERN 과 같다. */
const KOREAN_MOBILE = /^01[016789]\d{7,8}$/;

const PHONE_FORMAT_MESSAGE =
  "휴대폰 번호를 확인해 주세요. 예: 010-1234-5678";

export function digitsOnly(value) {
  return String(value ?? "").replace(DIGITS, "");
}

/**
 * 숫자만 남긴 뒤 하이픈을 끼운다.
 * 010은 11자리(3-4-4)가 대부분이어서 처음부터 가운데 4칸으로 나눈다.
 * 011·016·017·018·019는 10자리(3-3-4)와 11자리(3-4-4)가 둘 다 있다.
 * 11번째 숫자가 들어오기 전에는 3-3-4로 두고, 11자리가 되면 3-4-4로 바꾼다.
 */
export function formatKoreanPhone(value) {
  const digits = digitsOnly(value).slice(0, 11);
  if (digits.length <= 3) return digits;

  const head = digits.slice(0, 3);
  const rest = digits.slice(3);
  const middleIsFour = head === "010" || digits.length === 11;

  if (middleIsFour) {
    if (rest.length <= 4) return `${head}-${rest}`;
    return `${head}-${rest.slice(0, 4)}-${rest.slice(4)}`;
  }

  if (rest.length <= 3) return `${head}-${rest}`;
  return `${head}-${rest.slice(0, 3)}-${rest.slice(3)}`;
}

/**
 * 입력창 onChange 용.
 * 하이픈만 지운 경우에는 그 앞 숫자도 같이 지운다.
 * 그렇지 않으면 포맷 함수가 하이픈을 바로 다시 넣어서 백스페이스가 안 먹는다.
 * cursor 는 포맷된 문자열에서 커서가 갈 위치다.
 */
export function applyKoreanPhoneInput(previous, next, selectionStart) {
  const prevDigits = digitsOnly(previous);
  let nextDigits = digitsOnly(next);
  let digitsBeforeCursor = digitsOnly(String(next).slice(0, selectionStart)).length;

  if (nextDigits === prevDigits && String(next).length < String(previous).length) {
    const removedAt = firstDifferentIndex(previous, next);
    const dropAt = digitsOnly(String(previous).slice(0, removedAt)).length - 1;
    if (dropAt >= 0) {
      nextDigits = prevDigits.slice(0, dropAt) + prevDigits.slice(dropAt + 1);
      if (dropAt < digitsBeforeCursor) digitsBeforeCursor -= 1;
    }
  }

  const phone = formatKoreanPhone(nextDigits);
  return { phone, cursor: indexAfterDigitCount(phone, digitsBeforeCursor) };
}

export function isValidKoreanPhone(value) {
  return KOREAN_MOBILE.test(digitsOnly(value));
}

/** 비어 있으면 빈 문자열. 숫자가 있는데 형식이 아니면 안내 문구. */
export function koreanPhoneError(value) {
  const digits = digitsOnly(value);
  if (!digits || isValidKoreanPhone(digits)) return "";
  return PHONE_FORMAT_MESSAGE;
}

function indexAfterDigitCount(formatted, count) {
  if (count <= 0) return 0;
  let seen = 0;
  for (let index = 0; index < formatted.length; index += 1) {
    if (/\d/.test(formatted[index])) {
      seen += 1;
      if (seen === count) return index + 1;
    }
  }
  return formatted.length;
}

function firstDifferentIndex(previous, next) {
  const prev = String(previous);
  const curr = String(next);
  const limit = Math.min(prev.length, curr.length);
  for (let index = 0; index < limit; index += 1) {
    if (prev[index] !== curr[index]) return index;
  }
  return curr.length;
}
