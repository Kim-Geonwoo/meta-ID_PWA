"use client";

import React, { useState } from "react";
import {
  RecaptchaVerifier,
  signInWithPhoneNumber,
  linkWithCredential,
  EmailAuthProvider,
} from "firebase/auth";
import router from "next/router";

import { auth } from "../app/lib/firebase";

declare global {
  interface Window {
    recaptchaVerifier: any;
    confirmationResult: any;
    recaptchaWidgetId: any;
    grecaptcha?: any;
  }
}

const SignUp: React.FC = () => {
  const [phoneNumber, setPhoneNumber] = useState("");
  const [verificationCode, setVerificationCode] = useState("");
  const [confirmationResult, setConfirmationResult] = useState<any>(null);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isCodeSent, setIsCodeSent] = useState(false);
  const [isVerified, setIsVerified] = useState(false);

  const handlePhoneNumberChange = (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    setPhoneNumber(event.target.value);
  };

  const handleVerificationCodeChange = (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    setVerificationCode(event.target.value);
  };

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(e.target.value);
  };

  // 리캡차 설정 (전화번호 인증시, 필수사용)
  const configureRecaptcha = () => {
    window.recaptchaVerifier = new RecaptchaVerifier(
      auth,
      "recaptcha-container",
      {
        size: "invisible",
        callback: (_response: any) => {
          handlePhoneSignIn();
        },
      },
    );
  };

  // 전화번호로 인증코드 전송
  const handlePhoneSignIn = () => {
    const appVerifier = window.recaptchaVerifier;

    signInWithPhoneNumber(auth, `+82 ${phoneNumber}`, appVerifier)
      .then((result) => {
        setConfirmationResult(result);
        setIsCodeSent(true);
      })
      .catch((error) => {
        setError("SMS 전송 중 오류가 발생했습니다: " + error.message);
      });
  };

  // 인증코드 유효성 검사
  const handleVerifyCode = () => {
    if (!confirmationResult) {
      setError("인증 결과를 찾을 수 없습니다.");

      return;
    }

    confirmationResult
      .confirm(verificationCode)
      .then((_result: { user: any }) => {
        setIsVerified(true);
        alert("전화번호 인증이 완료되었습니다.");
      })
      .catch((error: { message: string }) => {
        setError("인증 코드 확인 중 오류가 발생했습니다: " + error.message);
      });
  };

  // 전화번호 인증 후, 이메일 비밀번호 계정과 연동
  const handleLinkAccount = () => {
    const credential = EmailAuthProvider.credential(email, password);

    if (auth.currentUser) {
      linkWithCredential(auth.currentUser, credential)
        .then(() => {
          alert("계정이 성공적으로 연동되었습니다.");
          router.push("/");
        })
        .catch((error: { message: string }) => {
          setError("계정 연동 중 오류가 발생했습니다: " + error.message);
        });
    } else {
      setError("현재 사용자를 찾을 수 없습니다.");
    }
  };

  // 리캡차 설정(전화번호 인증시, 필수사용)
  React.useEffect(() => {
    configureRecaptcha();
  }, []);

  return (
    <div>
      <h1>회원가입</h1>
      {/* {error && <div style={{ color: "red" }}>{error}</div>} */}
      <input
        placeholder="전화번호를 입력하세요"
        type="tel"
        value={phoneNumber}
        onChange={handlePhoneNumberChange}
      />
      <div id="recaptcha-container" />
      <button onClick={handlePhoneSignIn}>인증 코드 받기</button>
      {/* 코드를 발송했다면, 표시 */}
      {isCodeSent && (
        <>
          <input
            placeholder="인증 코드를 입력하세요"
            type="text"
            value={verificationCode}
            onChange={handleVerificationCodeChange}
          />
          <button onClick={handleVerifyCode}>인증 확인</button>
        </>
      )}
      {/* 전화번호 인증이 완료됬다면, 표시 */}
      {isVerified && (
        <>
          <input
            placeholder="이메일을 입력하세요"
            type="email"
            value={email}
            onChange={handleEmailChange}
          />
          <input
            placeholder="비밀번호를 입력하세요"
            type="password"
            value={password}
            onChange={handlePasswordChange}
          />
          {/* 마지막, 가입완료 처리버튼 */}
          <button onClick={handleLinkAccount}>계정 연동</button>
        </>
      )}
    </div>
  );
};

export default SignUp;
