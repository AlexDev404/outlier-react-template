/**
 * Authentication System with 2FA Support
 *
 * Features: Login/Register/Password Reset, Two-Factor Authentication (mock),
 * Social login (Zoodle/TrickRub), Real-time password validation,
 * Responsive glassmorphism UI, Accessible form controls
 */

import React, { useCallback, useEffect, useMemo, useState } from "react";

// Type Definitions
interface User {
  email: string;
  name: string;
  requires2FA?: boolean;
  avatar?: string;
  has2FA?: boolean;
}

interface AuthResponse {
  token: string;
  user: User;
}

interface FormData {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
  twoFactorCode: string;
  rememberMe: boolean;
  enable2FA: boolean;
  resetToken: string;
}

interface PasswordStrength {
  score: number;
  feedback: string[];
}

interface ApiError extends Error {
  code?: string;
}

// Authentication System with 2FA, Social Login, Password Reset
const Icons = {
  Eye: () => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
      <circle cx="12" cy="12" r="3"></circle>
    </svg>
  ),
  EyeOff: () => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path>
      <line x1="1" y1="1" x2="23" y2="23"></line>
    </svg>
  ),
  Check: () => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <polyline points="20 6 9 17 4 12"></polyline>
    </svg>
  ),
  Alert: () => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="12" cy="12" r="10"></circle>
      <line x1="12" y1="8" x2="12" y2="12"></line>
      <line x1="12" y1="16" x2="12.01" y2="16"></line>
    </svg>
  ),
  X: () => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <line x1="18" y1="6" x2="6" y2="18"></line>
      <line x1="6" y1="6" x2="18" y2="18"></line>
    </svg>
  ),
  User: () => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
      <circle cx="12" cy="7" r="4"></circle>
    </svg>
  ),
  Mail: () => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
      <polyline points="22,6 12,13 2,6"></polyline>
    </svg>
  ),
  Lock: () => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
      <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
    </svg>
  ),
  Globe: () => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="12" cy="12" r="10"></circle>
      <line x1="2" y1="12" x2="22" y2="12"></line>
      <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"></path>
    </svg>
  ),
  Code: () => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <polyline points="16 18 22 12 16 6"></polyline>
      <polyline points="8 6 2 12 8 18"></polyline>
    </svg>
  ),
  Shield: () => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>
    </svg>
  ),
  Zap: () => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"></polygon>
    </svg>
  ),
  Heart: () => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
    </svg>
  ),
  Star: () => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="currentColor"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
    </svg>
  ),
  ArrowRight: () => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <line x1="5" y1="12" x2="19" y2="12"></line>
      <polyline points="12 5 19 12 12 19"></polyline>
    </svg>
  ),
  Key: () => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M21 2l-2 2m-7.61 7.61a5.5 5.5 0 1 1-7.778 7.778 5.5 5.5 0 0 1 7.777-7.777zm0 0L15.5 7.5m0 0l3 3L22 7l-3-3m-3.5 3.5L19 4"></path>
    </svg>
  ),
};

// Mock database to store user data
const mockDatabase = {
  users: new Map<
    string,
    {
      email: string;
      name: string;
      password: string;
      has2FA: boolean;
      avatar: string;
      twoFactorSecret?: string;
    }
  >(),

  resetTokens: new Map<string, { email: string; expires: number }>(),
};

// Initialize demo user
mockDatabase.users.set("demo@example.com", {
  email: "demo@example.com",
  name: "Demo User",
  password: "Demo123!",
  has2FA: true,
  avatar: "https://i.pravatar.cc/150?img=1",
  twoFactorSecret: "MOCK_SECRET_123",
});

// Mock API for demo purposes
const mockApi = {
  login: async (
    email: string,
    password: string,
    twoFactorCode?: string
  ): Promise<AuthResponse> => {
    await new Promise((resolve) => setTimeout(resolve, 1200));

    const user = mockDatabase.users.get(email);
    if (!user || user.password !== password) {
      const error = new Error("Invalid credentials") as ApiError;
      error.code = "INVALID_CREDENTIALS";
      throw error;
    }

    // Check if user has 2FA enabled and code is required
    if (user.has2FA && !twoFactorCode) {
      return {
        token: "temp-token",
        user: {
          email: user.email,
          name: user.name,
          requires2FA: true,
          avatar: user.avatar,
          has2FA: user.has2FA,
        },
      };
    }

    // Validate 2FA code if provided
    if (user.has2FA && twoFactorCode && twoFactorCode !== "123456") {
      const error = new Error("Invalid 2FA code") as ApiError;
      error.code = "INVALID_2FA";
      throw error;
    }

    return {
      token: "mock-jwt-token",
      user: {
        email: user.email,
        name: user.name,
        requires2FA: false,
        avatar: user.avatar,
        has2FA: user.has2FA,
      },
    };
  },

  register: async (
    name: string,
    email: string,
    password: string,
    enable2FA: boolean = false
  ): Promise<AuthResponse> => {
    await new Promise((resolve) => setTimeout(resolve, 1200));

    if (mockDatabase.users.has(email)) {
      const error = new Error("Email already registered") as ApiError;
      error.code = "EMAIL_EXISTS";
      throw error;
    }

    const newUser = {
      email,
      name,
      password,
      has2FA: enable2FA,
      avatar: "https://i.pravatar.cc/150?img=2",
      twoFactorSecret: enable2FA ? "MOCK_SECRET_" + Date.now() : undefined,
    };

    mockDatabase.users.set(email, newUser);

    return {
      token: "mock-jwt-token",
      user: {
        email: newUser.email,
        name: newUser.name,
        avatar: newUser.avatar,
        has2FA: newUser.has2FA,
      },
    };
  },

  socialLogin: async (provider: string): Promise<AuthResponse> => {
    await new Promise((resolve) => setTimeout(resolve, 1000));
    return {
      token: "mock-jwt-token",
      user: {
        email: `user@${provider.toLowerCase()}-sso.example.com`,
        name: `${provider} User`,
        avatar:
          provider === "Zoodle"
            ? "https://i.pravatar.cc/150?img=12"
            : "https://i.pravatar.cc/150?img=8",
        has2FA: false,
      },
    };
  },

  sendResetEmail: async (
    email: string
  ): Promise<{ success: boolean; resetToken: string }> => {
    await new Promise((resolve) => setTimeout(resolve, 1000));

    if (!email.includes("@")) {
      throw new Error("Invalid email address");
    }

    // Check if user exists
    if (!mockDatabase.users.has(email)) {
      throw new Error("No account found with that email address");
    }

    const resetToken = "reset_" + Math.random().toString(36).substring(2, 11);
    const expires = Date.now() + 15 * 60 * 1000; // 15 minutes

    mockDatabase.resetTokens.set(resetToken, { email, expires });

    return { success: true, resetToken };
  },
  resetPassword: async (
    token: string,
    password: string
  ): Promise<{ success: boolean; email: string }> => {
    await new Promise((resolve) => setTimeout(resolve, 1000));

    const resetData = mockDatabase.resetTokens.get(token);
    if (!resetData || resetData.expires < Date.now()) {
      throw new Error("Invalid or expired reset token");
    }

    const user = mockDatabase.users.get(resetData.email);
    if (user) {
      user.password = password;
      mockDatabase.users.set(resetData.email, user);
    }

    mockDatabase.resetTokens.delete(token);
    return { success: true, email: resetData.email };
  },
};

// Password strength calculator (0-100 score)
const calculatePasswordStrength = (password: string): PasswordStrength => {
  const feedback: string[] = [];
  let score = 0;

  if (password.length >= 8) score += 20;
  else feedback.push("At least 8 characters");

  if (/[a-z]/.test(password)) score += 20;
  else feedback.push("Add lowercase letters");

  if (/[A-Z]/.test(password)) score += 20;
  else feedback.push("Add uppercase letters");

  if (/[0-9]/.test(password)) score += 20;
  else feedback.push("Add numbers");

  if (/[^A-Za-z0-9]/.test(password)) score += 20;
  else feedback.push("Add special characters");

  return { score, feedback };
};

const handle2FAMockInput = (
  e: React.ChangeEvent<HTMLInputElement>,
  index: number,
  code: string,
  setCode: (code: string) => void
) => {
  const value = e.target.value;
  if (/^[0-9]$/.test(value)) {
    const newCode = code.split("");
    newCode[index] = value;
    setCode(newCode.join(""));
    if (index < 5) {
      const nextInput = e.target.parentElement?.children[
        index + 1
      ] as HTMLInputElement;
      if (nextInput) nextInput.focus();
    }
  }
};

const handle2FAMockPaste = (
  e: React.ClipboardEvent<HTMLInputElement>,
  setCode: (code: string) => void
) => {
  const paste = e.clipboardData.getData("text").replace(/\D/g, "");
  if (paste.length === 6) {
    setCode(paste.slice(0, 6));
    setTimeout(() => {
      const parent = e.target.parentElement;
      if (parent) {
        const lastInput = parent.children[5] as HTMLInputElement;
        if (lastInput) lastInput.focus();
      }
    }, 0);
    e.preventDefault();
  }
};

const initialFormData: FormData = {
  name: "",
  email: "",
  password: "",
  confirmPassword: "",
  twoFactorCode: "",
  rememberMe: false,
  enable2FA: false,
  resetToken: "",
};

const testimonials = [
  {
    name: "Sarah Chen",
    role: "CTO at TechCorp",
    content:
      "This platform transformed our workflow. The security features are enterprise-grade.",
    avatar: "https://i.pravatar.cc/60?img=4",
    rating: 5,
  },
  {
    name: "Marcus Johnson",
    role: "Founder at StartupXYZ",
    content: "Incredible user experience. Setup took minutes, not hours.",
    avatar: "https://i.pravatar.cc/60?img=5",
    rating: 5,
  },
  {
    name: "Elena Rodriguez",
    role: "Product Manager",
    content:
      "The best authentication system we've implemented. Highly recommended.",
    avatar: "https://i.pravatar.cc/60?img=6",
    rating: 5,
  },
];

// Main authentication component
export default function App(): JSX.Element {
  const [resetTimer, setResetTimer] = useState<number>(0);
  const [mode, setMode] = useState<"login" | "register" | "forgot" | "reset">(
    "login"
  );
  const [formData, setFormData] = useState<FormData>(initialFormData);
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [showConfirmPassword, setShowConfirmPassword] =
    useState<boolean>(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState<boolean>(false);
  const [successMessage, setSuccessMessage] = useState<string>("");
  const [show2FAInput, setShow2FAInput] = useState<boolean>(false);
  const [passwordStrength, setPasswordStrength] = useState<PasswordStrength>({
    score: 0,
    feedback: [],
  });
  const [user, setUser] = useState<User | null>(null);
  const [mock2FACode, setMock2FACode] = useState<string>("");
  const [currentTestimonial, setCurrentTestimonial] = useState<number>(0);
  const [resetToken, setResetToken] = useState<string>("");

  useEffect(() => {
    if (mode !== "reset") {
      setResetTimer(0);
      setSuccessMessage("");
    }
  }, [mode]);

  useEffect(() => {
    if (resetTimer > 0) {
      const timer = setTimeout(() => {
        setResetTimer((prev) => prev - 1);
      }, 1000);
      return () => clearTimeout(timer);
    }

    if (resetTimer === 0 && mode === "reset" && !resetToken) {
      setFormData((prev) => ({
        ...prev,
        password: "",
        confirmPassword: "",
      }));
      setMode("login");
      setSuccessMessage("");
    }
  }, [resetTimer, mode, resetToken]);

  useEffect(() => {
    // Check for saved user in localStorage to maintain login state
    const savedUser = localStorage.getItem("user");
    if (savedUser) {
      try {
        setUser(JSON.parse(savedUser));
      } catch {
        localStorage.removeItem("user");
      }
    }

    // Check for reset token in URL (simulated)
    const urlParams = new URLSearchParams(window.location.search);
    const token = urlParams.get("token");
    if (token?.startsWith("reset_")) {
      // Only set reset mode if token is valid
      setResetToken(token);
      setFormData((prev) => ({ ...prev, resetToken: token }));
      setMode("reset");
    } else {
      setMode("login"); // Ensure we start in login mode
    }
  }, []);

  useEffect(() => {
    if (formData.password) {
      setPasswordStrength(calculatePasswordStrength(formData.password));
    }
  }, [formData.password]);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTestimonial((prev) => (prev + 1) % testimonials.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const handleInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const { name, value, type, checked } = e.target;
      setFormData((prev) => ({
        ...prev,
        [name]: type === "checkbox" ? checked : value,
      }));
      setErrors((prev) => ({ ...prev, [name]: "" }));
    },
    []
  );
  const validateForm = useCallback((): boolean => {
    const newErrors: Record<string, string> = {};

    if (mode === "register" && !formData.name.trim()) {
      newErrors.name = "Name is required";
    }

    if (mode !== "reset" && !formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (mode !== "reset" && !/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Invalid email address";
    }

    if (mode !== "forgot" && !formData.password) {
      newErrors.password = "Password is required";
    } else if ((mode === "register" || mode === "reset") && formData.password) {
      // Enforce all password requirements for registration and reset
      const passwordErrors: string[] = [];

      if (formData.password.length < 8) {
        passwordErrors.push("At least 8 characters");
      }
      if (!/[a-z]/.test(formData.password)) {
        passwordErrors.push("Add lowercase letters");
      }
      if (!/[A-Z]/.test(formData.password)) {
        passwordErrors.push("Add uppercase letters");
      }
      if (!/\d/.test(formData.password)) {
        passwordErrors.push("Add numbers");
      }
      if (!/[^A-Za-z0-9]/.test(formData.password)) {
        passwordErrors.push("Add special characters");
      }

      if (passwordErrors.length > 0) {
        newErrors.password = `Password requirements: ${passwordErrors.join(
          ", "
        )}`;
      }
    }

    if (
      (mode === "register" || mode === "reset") &&
      formData.password !== formData.confirmPassword
    ) {
      newErrors.confirmPassword = "Passwords do not match";
    }

    if (show2FAInput && !formData.twoFactorCode) {
      newErrors.twoFactorCode = "2FA code is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, [mode, formData, show2FAInput]);

  const handleSubmit = useCallback(
    async (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      if (!validateForm()) return;

      setLoading(true);
      setSuccessMessage("");

      try {
        switch (mode) {
          case "login": {
            const loginResult = await mockApi.login(
              formData.email,
              formData.password,
              show2FAInput ? formData.twoFactorCode : undefined
            );

            if (loginResult.user.requires2FA && !show2FAInput) {
              setShow2FAInput(true);
              setLoading(false);
              return;
            }

            localStorage.setItem("token", loginResult.token);
            localStorage.setItem("user", JSON.stringify(loginResult.user));
            setUser(loginResult.user);
            setSuccessMessage("Welcome back! Login successful.");
            break;
          }
          case "register": {
            const registerResult = await mockApi.register(
              formData.name,
              formData.email,
              formData.password,
              formData.enable2FA
            );
            localStorage.setItem("token", registerResult.token);
            localStorage.setItem("user", JSON.stringify(registerResult.user));
            setUser(registerResult.user);
            setSuccessMessage("Account created successfully! Welcome aboard.");
            setFormData(initialFormData);
            setMock2FACode("");
            break;
          }
          case "forgot": {
            const resetResult = await mockApi.sendResetEmail(formData.email);
            setResetToken(resetResult.resetToken);
            setSuccessMessage(
              "Password reset email sent! Click the link below to reset your password."
            );
            console.log("Mock reset token:", resetResult.resetToken);
            break;
          }
          case "reset": {
            const resetPasswordResult = await mockApi.resetPassword(
              formData.resetToken || resetToken,
              formData.password
            );
            setSuccessMessage(
              "Password reset successful! You can now login with your new password."
            );
            setResetTimer(3);
            setTimeout(() => {
              setMode("login");
              setFormData({
                ...initialFormData,
                email: resetPasswordResult.email,
              }); // Keep email filled
              setResetToken("");
            }, 3000);
            break;
          }
        }
      } catch (error: any) {
        setErrors({ general: error.message });
      } finally {
        setLoading(false);
      }
    },
    [mode, formData, show2FAInput, validateForm, resetToken]
  );

  const handleSocialLogin = useCallback(async (provider: string) => {
    setLoading(true);
    try {
      const result = await mockApi.socialLogin(provider);
      localStorage.setItem("token", result.token);
      localStorage.setItem("user", JSON.stringify(result.user));
      setUser(result.user);
      setSuccessMessage(`Welcome! Successfully logged in with ${provider}.`);
    } catch (error: any) {
      setErrors({ general: error.message });
    } finally {
      setLoading(false);
    }
  }, []);

  const handleLogout = useCallback(() => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null);
    setFormData(initialFormData);
    setMode("login");
    setSuccessMessage("");
    setShow2FAInput(false);
    setMock2FACode("");
    setResetToken("");
  }, []);

  const handle2FAInput = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>, index: number) => {
      const value = e.target.value;
      if (/^[0-9]$/.test(value)) {
        const newCode = formData.twoFactorCode.split("");
        newCode[index] = value;
        const updatedCode = newCode.join("");
        setFormData((prev) => ({ ...prev, twoFactorCode: updatedCode }));

        if (index < 5) {
          const nextInput = e.target.parentElement?.children[
            index + 1
          ] as HTMLInputElement;
          nextInput?.focus();
        }
      }
    },
    [formData.twoFactorCode]
  );

  const handle2FAKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLInputElement>, index: number) => {
      if (
        e.key === "Backspace" &&
        !formData.twoFactorCode[index] &&
        index > 0
      ) {
        const prevInput = e.target.parentElement?.children[
          index - 1
        ] as HTMLInputElement;
        prevInput?.focus();
      }
    },
    [formData.twoFactorCode]
  );

  const handleResetLinkClick = useCallback(() => {
    if (resetToken) {
      setMode("reset");
      setFormData((prev) => ({ ...prev, resetToken }));
    }
  }, [resetToken]);

  const modeConfig = useMemo(
    () => ({
      login: {
        title: "Welcome Back",
        subtitle: "Sign in to your account to continue",
        buttonText: "Sign In",
        switchText: "Don't have an account?",
        switchAction: "Create one",
      },
      register: {
        title: "Create Account",
        subtitle: "Join thousands of satisfied users",
        buttonText: "Create Account",
        switchText: "Already have an account?",
        switchAction: "Sign in",
      },
      forgot: {
        title: "Reset Password",
        subtitle: "Enter your email to receive reset instructions",
        buttonText: "Send Reset Email",
        switchText: "Remember your password?",
        switchAction: "Back to login",
      },
      reset: {
        title: "New Password",
        subtitle: "Enter your new password below",
        buttonText: "Reset Password",
        switchText: "Back to",
        switchAction: "login",
      },
    }),
    []
  );
  const currentConfig = modeConfig[mode];
  // Authenticated User Dashboard - Shows when user is successfully logged in
  if (user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-600 via-purple-600 to-indigo-700 relative overflow-hidden">
        {/* Background Overlay - Adds depth with layered gradients */}
        <div className="absolute inset-0 bg-gradient-to-br from-purple-500/30 via-blue-500/25 to-indigo-600/20 opacity-60"></div>

        {/* Dashboard Content Container - Positioned above background */}
        <div className="relative z-10 min-h-screen flex flex-col">
          {/* Navigation Header - Top bar with logo and logout */}
          <header className="p-4 sm:p-6 lg:p-8">
            <nav
              className="flex items-center justify-between"
              aria-label="Main navigation"
            >
              {/* Brand Logo and Name */}
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-gradient-to-br from-cyan-400 to-violet-500 rounded-xl flex items-center justify-center shadow-lg">
                  <span className="text-white font-bold text-lg">S</span>
                </div>
                <span className="text-white font-semibold text-xl">
                  SaaS Platform
                </span>
              </div>

              {/* Logout Button */}
              <button
                onClick={handleLogout}
                className="px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded-lg font-medium transition-all duration-200 backdrop-blur-sm border border-white/20 hover:border-white/30"
                aria-label="Sign out of your account"
              >
                Logout
              </button>
            </nav>
          </header>

          {/* Main Dashboard Content Area */}
          <div className="flex-1 flex items-center justify-center p-4 sm:p-6 lg:p-8">
            <div className="max-w-4xl w-full">
              {/* User Welcome Section - Profile info and greeting */}
              <div className="text-center mb-6">
                {/* User Avatar with Status Indicator */}
                <div className="relative inline-block mb-6">
                  <img
                    src={user.avatar}
                    alt={`${user.name}'s profile picture`}
                    className="w-24 h-24 rounded-full border-4 border-white/20 shadow-2xl"
                  />
                  {/* Online Status Badge */}
                  <div className="absolute -bottom-2 text-green-200 -right-2 w-8 h-8 bg-emerald-500/80 rounded-full border-2 border-emerald-200 flex items-center justify-center">
                    <Icons.Check />
                  </div>
                </div>

                {/* Welcome Message and User Info */}
                <h1 className="text-4xl sm:text-5xl font-bold text-white mb-4">
                  Welcome back, {user.name.split(" ")[0]}!
                </h1>
                <p className="text-xl text-white/70 mb-2">
                  You're successfully logged in
                </p>
                <p className="text-white/50">{user.email}</p>

                {/* 2FA Status Badge - Only shown if user has 2FA enabled */}
                {user.has2FA && (
                  <div className="mt-4 inline-flex items-center px-3 py-1 bg-green-500/20 text-green-300/80 rounded-full text-sm">
                    <Icons.Shield />
                    <span className="ml-1">2FA Enabled</span>
                  </div>
                )}
              </div>

              {/* Dashboard Status Cards - Security and Plan information */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                {/* Security Status Card */}
                <div className="bg-white/10 backdrop-blur-xl rounded-2xl p-6 border border-white/20 hover:bg-white/15 transition-all duration-300 group cursor-pointer transform hover:scale-[1.02] hover:rotate-1 hover:shadow-2xl">
                  {/* Card Header - Icon and Status */}
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-12 h-12 bg-cyan-400/90 rounded-lg text-cyan-50 flex items-center justify-center group-hover:scale-110 transition-transform">
                      <Icons.Shield />
                    </div>
                    <span className="text-emerald-300 text-2xl font-bold">
                      ACTIVE
                    </span>
                  </div>
                  {/* Card Content */}
                  <h3 className="text-white font-semibold text-lg mb-2">
                    Security Status
                  </h3>
                  <p className="text-white/60 text-sm">
                    Your account is fully secured with enterprise-grade
                    protection.
                  </p>
                </div>

                {/* Plan Status Card */}
                <div className="bg-white/10 backdrop-blur-xl rounded-2xl p-6 border border-white/20 hover:bg-white/15 transition-all duration-300 group cursor-pointer transform hover:scale-[1.02] hover:-rotate-1 hover:shadow-2xl">
                  {/* Card Header - Icon and Plan */}
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-12 h-12 bg-violet-400/90 text-violet-50 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform">
                      <Icons.Zap />
                    </div>
                    <span className="text-violet-300 text-2xl font-bold">
                      PRO
                    </span>
                  </div>
                  {/* Card Content */}
                  <h3 className="text-white font-semibold text-lg mb-2">
                    Plan Status
                  </h3>
                  <p className="text-white/60 text-sm">
                    Enjoy unlimited access to all premium features.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-600 via-purple-600 to-indigo-700 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-purple-500/30 via-blue-500/25 to-indigo-600/20 opacity-60"></div>

      <div className="relative z-10 min-h-screen flex flex-col lg:flex-row">
        {" "}
        <section className="hidden lg:flex lg:w-1/2 xl:w-3/5 items-center justify-center p-8 xl:p-12">
          {/* Marketing Content Container */}
          <div className="max-w-2xl">
            {/* Brand Header Section */}
            <header className="mb-12">
              {/* Brand Logo and Name */}
              <div className="flex items-center space-x-3 mb-8">
                <div className="w-12 h-12 bg-gradient-to-br from-cyan-400 to-violet-500 rounded-xl flex items-center justify-center shadow-lg">
                  <span className="text-white font-bold text-xl">S</span>
                </div>
                <span className="text-white font-semibold text-2xl">
                  SaaS Platform
                </span>
              </div>
              {/* Main Headline */}
              <h1 className="text-5xl xl:text-6xl font-bold text-white mb-6 leading-tight">
                The Future of
                <span className="bg-gradient-to-r from-cyan-300 to-violet-400 bg-clip-text text-transparent">
                  {" "}
                  Cloud Solutions
                </span>
              </h1>
              {/* Subtitle */}
              <p className="text-xl text-white/70 mb-8 leading-relaxed">
                Join over 50,000+ businesses that trust our platform for their
                mission-critical operations.
              </p>
            </header>{" "}
            <div className="space-y-8 mb-12 text-white">
              {[
                {
                  icon: Icons.Shield,
                  title: "Enterprise Security",
                  desc: "Bank-level encryption with SOC 2 compliance",
                },
                {
                  icon: Icons.Zap,
                  title: "Lightning Fast",
                  desc: "99.9% uptime with global CDN infrastructure",
                },
                {
                  icon: Icons.Heart,
                  title: "24/7 Support",
                  desc: "Expert support team available around the clock",
                },
              ].map((feature, index) => (
                <div key={index} className="flex items-start space-x-4 group">
                  <div className="w-12 h-12 bg-white/10 backdrop-blur-sm rounded-xl flex items-center justify-center flex-shrink-0 group-hover:bg-white/20 transition-all duration-300">
                    <feature.icon />
                  </div>
                  <div>
                    <h3 className="text-white font-semibold text-lg mb-1">
                      {feature.title}
                    </h3>
                    <p className="text-white/60">{feature.desc}</p>
                  </div>
                </div>
              ))}
            </div>{" "}
            {/* Testimonials Section - Customer feedback carousel */}
            <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/10">
              {/* Testimonial Header with Navigation Dots */}
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-white font-semibold">What our users say</h3>
                {/* Pagination Dots */}
                <div className="flex space-x-1">
                  {testimonials.map((_, index) => (
                    <button
                      key={index}
                      onClick={() => setCurrentTestimonial(index)}
                      className={`w-2 h-2 rounded-full transition-all duration-300 ${
                        index === currentTestimonial
                          ? "bg-cyan-400 w-6"
                          : "bg-white/30"
                      }`}
                      aria-label={`View testimonial ${index + 1}`}
                    />
                  ))}
                </div>
              </div>{" "}
              {/* Current Testimonial Content */}
              <div className="transition-all duration-500">
                {/* Testimonial Author Info and Rating */}
                <div className="flex items-center space-x-3 mb-3">
                  {/* Author Avatar */}
                  <img
                    src={testimonials[currentTestimonial].avatar}
                    alt={testimonials[currentTestimonial].name}
                    className="w-10 h-10 rounded-full border-2 border-white/20"
                  />
                  {/* Author Details */}
                  <div>
                    <p className="text-white font-medium text-sm">
                      {testimonials[currentTestimonial].name}
                    </p>
                    <p className="text-white/60 text-xs">
                      {testimonials[currentTestimonial].role}
                    </p>
                  </div>
                  {/* Star Rating */}
                  <div className="flex space-x-1 ml-auto text-yellow-400">
                    {[...Array(testimonials[currentTestimonial].rating)].map(
                      (_, i) => (
                        <Icons.Star key={i} />
                      )
                    )}
                  </div>
                </div>
                {/* Testimonial Quote */}
                <p className="text-white/80 text-sm italic">
                  "{testimonials[currentTestimonial].content}"
                </p>
              </div>
            </div>
          </div>
        </section>{" "}
        {/* Right Panel - Authentication Form */}
        <section className="w-full lg:w-1/2 xl:w-2/5 flex items-center justify-center p-4 sm:p-6 lg:p-8">
          {/* Form Container */}
          <div className="w-full max-w-md">
            {/* Mobile Brand Header (hidden on desktop) */}
            <div className="lg:hidden mb-8 text-center">
              <div className="flex items-center justify-center space-x-3 mb-4">
                <div className="w-10 h-10 bg-gradient-to-br from-cyan-400 to-violet-500 rounded-xl flex items-center justify-center">
                  <span className="text-white font-bold">S</span>
                </div>
                <span className="text-white font-semibold text-xl">
                  SaaS Platform
                </span>
              </div>
            </div>

            {/* Main Form Card */}
            <div className="bg-white/10 backdrop-blur-xl rounded-2xl p-6 sm:p-8 shadow-2xl border border-white/20">
              {/* Form Header */}
              <header className="text-center mb-8">
                <h2 className="text-3xl font-bold text-white mb-2">
                  {currentConfig.title}
                </h2>
                <p className="text-white/70">{currentConfig.subtitle}</p>
              </header>{" "}
              {/* Success Message Alert */}
              {successMessage && (
                <div className="mb-6 p-4 bg-green-500/20 backdrop-blur-sm border border-green-500/30 rounded-xl">
                  <div className="text-green-300 text-sm flex items-center space-x-2">
                    <Icons.Check />
                    <span>{successMessage}</span>
                  </div>

                  {/* Reset link (only in forgot mode) */}
                  {mode === "forgot" && resetToken && (
                    <button
                      onClick={handleResetLinkClick}
                      className="mt-3 w-full py-2 px-4 bg-green-600/70 hover:bg-green-500 text-white rounded-lg font-medium transition-all duration-200 flex items-center justify-center space-x-2"
                    >
                      <Icons.Key />
                      <span>Reset Password Now</span>
                    </button>
                  )}

                  {/* Redirect timer message (only in reset mode) */}
                  {mode === "reset" && resetToken && resetTimer > 0 && (
                    <p className="mt-3 text-sm text-green-200 flex justify-between items-center">
                      <span>Redirecting to login in {resetTimer} sec...</span>
                      <span
                        onClick={() => setResetTimer(0)}
                        className="underline cursor-pointer hover:text-green-100 text-green-200"
                      >
                        Skip
                      </span>
                    </p>
                  )}
                </div>
              )}
              {/* Error Message Alert */}
              {errors.general && (
                <div className="mb-6 p-4 bg-red-500/20 backdrop-blur-sm border border-red-500/30 rounded-xl">
                  <p className="text-red-300 text-sm flex items-center space-x-2">
                    <Icons.Alert />
                    <span>{errors.general}</span>
                  </p>
                </div>
              )}{" "}
              {/* Social Login Buttons (only for login/register) */}
              {(mode === "login" || mode === "register") && (
                <>
                  {/* Social Login Button Group */}
                  <div className="space-y-3 mb-6">
                    {/* Zoodle Social Login */}
                    <button
                      onClick={() => handleSocialLogin("Zoodle")}
                      disabled={loading}
                      className="w-full flex items-center justify-center space-x-3 py-3 px-4 bg-white hover:bg-gray-50 text-gray-900 rounded-xl font-medium transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                      aria-label="Continue with Zoodle"
                    >
                      <Icons.Globe />
                      <span>Continue with Zoodle</span>
                    </button>

                    {/* TrickRub Social Login */}
                    <button
                      onClick={() => handleSocialLogin("TrickRub")}
                      disabled={loading}
                      className="w-full flex items-center justify-center space-x-3 py-3 px-4 bg-gray-900 hover:bg-gray-800 text-white rounded-xl font-medium transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                      aria-label="Continue with TrickRub"
                    >
                      <Icons.Code />
                      <span>Continue with TrickRub</span>
                    </button>
                  </div>

                  {/* Divider */}
                  <div className="my-6 flex items-center">
                    <div className="flex-grow border-t border-white/20"></div>
                    <span className="mx-4 flex-shrink-0 text-sm text-white/60">
                      Or continue with email
                    </span>
                    <div className="flex-grow border-t border-white/20"></div>
                  </div>
                </>
              )}{" "}
              {/* Main Authentication Form */}
              <form onSubmit={handleSubmit} className="space-y-5" noValidate>
                {/* Name Input Field (register only) */}
                {mode === "register" && (
                  <div className="space-y-2">
                    <label
                      htmlFor="name"
                      className="block text-white/80 text-sm font-medium"
                    >
                      Full Name
                    </label>
                    <div className="relative">
                      {/* User Icon */}
                      <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/40">
                        <Icons.User />
                      </span>
                      {/* Name Input */}
                      <input
                        id="name"
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        className="w-full pl-11 pr-4 py-3 bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl text-white placeholder-white/40 focus:outline-none focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/20 transition-all duration-200"
                        placeholder="John Doe"
                        autoComplete="name"
                        aria-describedby={
                          errors.name ? "name-error" : undefined
                        }
                      />
                    </div>
                    {/* Name Error Message */}
                    {errors.name && (
                      <p
                        id="name-error"
                        className="text-red-300 text-sm flex items-center space-x-1"
                      >
                        <Icons.Alert />
                        <span>{errors.name}</span>
                      </p>
                    )}
                  </div>
                )}{" "}
                {/* Email Input Field (all modes except reset) */}
                {mode !== "reset" && (
                  <div className="space-y-2">
                    <label
                      htmlFor="email"
                      className="block text-white/80 text-sm font-medium"
                    >
                      Email Address
                    </label>
                    <div className="relative">
                      {/* Email Icon */}
                      <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/40">
                        <Icons.Mail />
                      </span>
                      {/* Email Input */}
                      <input
                        id="email"
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        className="w-full pl-11 pr-4 py-3 bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl text-white placeholder-white/40 focus:outline-none focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/20 transition-all duration-200"
                        placeholder="you@example.com"
                        autoComplete="email"
                        aria-describedby={
                          errors.email ? "email-error" : undefined
                        }
                      />
                    </div>
                    {/* Email Error Message */}
                    {errors.email && (
                      <p
                        id="email-error"
                        className="text-red-300 text-sm flex items-center space-x-1"
                      >
                        <Icons.Alert />
                        <span>{errors.email}</span>
                      </p>
                    )}
                  </div>
                )}{" "}
                {/* Password Input Field (all modes except forgot) */}
                {mode !== "forgot" && (
                  <div className="space-y-2">
                    <label
                      htmlFor="password"
                      className="block text-white/80 text-sm font-medium"
                    >
                      Password
                    </label>
                    <div className="relative">
                      {/* Lock Icon */}
                      <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/40">
                        <Icons.Lock />
                      </span>
                      {/* Password Input with Toggle Visibility */}
                      <input
                        id="password"
                        type={showPassword ? "text" : "password"}
                        name="password"
                        value={formData.password}
                        onChange={handleInputChange}
                        className="w-full pl-11 pr-11 py-3 bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl text-white placeholder-white/40 focus:outline-none focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/20 transition-all duration-200"
                        placeholder="••••••••"
                        autoComplete={
                          mode === "register"
                            ? "new-password"
                            : "current-password"
                        }
                        aria-describedby={
                          errors.password ? "password-error" : undefined
                        }
                      />
                      {/* Show/Hide Password Toggle Button */}
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-white/40 hover:text-white/60 transition-colors p-1"
                        aria-label={
                          showPassword ? "Hide password" : "Show password"
                        }
                      >
                        {showPassword ? <Icons.EyeOff /> : <Icons.Eye />}
                      </button>
                    </div>
                    {/* Password Error Message */}
                    {errors.password && (
                      <p
                        id="password-error"
                        className="text-red-300 text-sm flex items-center space-x-1"
                      >
                        <Icons.Alert />
                        <span>{errors.password}</span>
                      </p>
                    )}{" "}
                    {/* Password Strength Indicator (register/reset modes only) */}
                    {(mode === "register" || mode === "reset") &&
                      formData.password && (
                        <div className="mt-3">
                          {/* Strength Progress Bar */}
                          <div className="flex space-x-1 mb-2">
                            {[...Array(5)].map((_, i) => (
                              <div
                                key={i}
                                className={`h-1.5 flex-1 rounded-full transition-all duration-300 ${
                                  i < passwordStrength.score / 20
                                    ? passwordStrength.score >= 80
                                      ? "bg-green-400"
                                      : passwordStrength.score >= 60
                                      ? "bg-yellow-400"
                                      : "bg-red-400"
                                    : "bg-white/20"
                                }`}
                              />
                            ))}
                          </div>
                          {/* Strength Feedback List */}
                          {passwordStrength.feedback.length > 0 && (
                            <ul className="text-xs text-white/60 space-y-1">
                              {passwordStrength.feedback.map((item, i) => (
                                <li
                                  key={i}
                                  className="flex items-center space-x-1"
                                >
                                  <Icons.X />
                                  <span>{item}</span>
                                </li>
                              ))}
                            </ul>
                          )}
                        </div>
                      )}
                  </div>
                )}
                {(mode === "register" || mode === "reset") && (
                  <div className="space-y-2">
                    <label
                      htmlFor="confirmPassword"
                      className="block text-white/80 text-sm font-medium"
                    >
                      Confirm Password
                    </label>
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/40">
                        <Icons.Lock />
                      </span>{" "}
                      <input
                        id="confirmPassword"
                        type={showConfirmPassword ? "text" : "password"}
                        name="confirmPassword"
                        value={formData.confirmPassword}
                        onChange={handleInputChange}
                        className="w-full pl-11 pr-11 py-3 bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl text-white placeholder-white/40 focus:outline-none focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/20 transition-all duration-200"
                        placeholder="••••••••"
                        autoComplete="new-password"
                        aria-describedby={
                          errors.confirmPassword
                            ? "confirm-password-error"
                            : undefined
                        }
                      />
                      <button
                        type="button"
                        onClick={() =>
                          setShowConfirmPassword(!showConfirmPassword)
                        }
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-white/40 hover:text-white/60 transition-colors p-1"
                        aria-label={
                          showConfirmPassword
                            ? "Hide confirm password"
                            : "Show confirm password"
                        }
                      >
                        {showConfirmPassword ? <Icons.EyeOff /> : <Icons.Eye />}
                      </button>
                    </div>
                    {errors.confirmPassword && (
                      <p
                        id="confirm-password-error"
                        className="text-red-300 text-sm flex items-center space-x-1"
                      >
                        <Icons.Alert />
                        <span>{errors.confirmPassword}</span>
                      </p>
                    )}
                  </div>
                )}
                {show2FAInput && (
                  <div className="space-y-3">
                    <label className="block text-white/80 text-sm font-medium">
                      Two-Factor Authentication Code
                    </label>
                    <div className="flex space-x-2 justify-center">
                      {[...Array(6)].map((_, index) => (
                        <input
                          key={index}
                          type="text"
                          maxLength={1}
                          pattern="[0-9]"
                          inputMode="numeric"
                          className="w-12 h-12 text-center text-xl font-semibold bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl text-white placeholder-white/40 focus:outline-none focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/20 transition-all duration-200"
                          onChange={(e) => handle2FAInput(e, index)}
                          onKeyDown={(e) => handle2FAKeyDown(e, index)}
                          value={formData.twoFactorCode[index] || ""}
                          aria-label={`2FA digit ${index + 1}`}
                        />
                      ))}
                    </div>
                    <p className="text-white/60 text-sm text-center">
                      Enter the 6-digit code from your authenticator app
                    </p>
                    {errors.twoFactorCode && (
                      <p className="text-red-300 text-sm flex items-center justify-center space-x-1">
                        <Icons.Alert />
                        <span>{errors.twoFactorCode}</span>
                      </p>
                    )}
                  </div>
                )}
                {mode === "register" && (
                  <>
                    <label className="flex items-center">
                      {" "}
                      <input
                        type="checkbox"
                        name="enable2FA"
                        checked={formData.enable2FA}
                        onChange={handleInputChange}
                        className="w-4 h-4 rounded border-white/20 bg-white/10 text-cyan-500 focus:ring-cyan-500 focus:ring-offset-0"
                      />
                      <span className="ml-2 text-white/70 text-sm">
                        Enable two-factor authentication
                      </span>
                    </label>
                    {formData.enable2FA && (
                      <div className="mt-4 p-4 bg-white/10 border border-white/20 rounded-lg">
                        <div className="flex flex-col items-center">
                          {" "}
                          <div className="w-24 h-24 bg-gradient-to-br from-cyan-400 to-violet-500 rounded-lg flex items-center justify-center mb-3">
                            <span className="text-white/80 text-xs">
                              QR CODE
                            </span>
                          </div>
                          <p className="text-white/70 text-sm mb-2 text-center">
                            Scan this QR code with your authenticator app and
                            enter the 6-digit code below.
                          </p>
                          <div className="flex space-x-2 mb-2">
                            {[...Array(6)].map((_, index) => (
                              <input
                                key={index}
                                type="text"
                                maxLength={1}
                                pattern="[0-9]"
                                inputMode="numeric"
                                className="w-10 h-10 text-center text-lg font-semibold bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/40 focus:outline-none focus:border-white/40 transition-colors"
                                value={mock2FACode[index] || ""}
                                onChange={(e) =>
                                  handle2FAMockInput(
                                    e,
                                    index,
                                    mock2FACode,
                                    setMock2FACode
                                  )
                                }
                                onPaste={(e) =>
                                  handle2FAMockPaste(e, setMock2FACode)
                                }
                                onKeyDown={(e) => {
                                  if (
                                    e.key === "Backspace" ||
                                    e.key === "Delete"
                                  ) {
                                    if (mock2FACode[index]) {
                                      e.preventDefault();
                                      const newCode = mock2FACode.split("");
                                      newCode[index] = "";
                                      setMock2FACode(newCode.join(""));
                                    } else if (
                                      e.key === "Backspace" &&
                                      index > 0
                                    ) {
                                      const prevInput = e.target.parentElement
                                        ?.children[
                                        index - 1
                                      ] as HTMLInputElement;
                                      if (prevInput) prevInput.focus();
                                    } else if (
                                      e.key === "Delete" &&
                                      index < 5
                                    ) {
                                      const nextInput = e.target.parentElement
                                        ?.children[
                                        index + 1
                                      ] as HTMLInputElement;
                                      if (nextInput) nextInput.focus();
                                    }
                                  }
                                }}
                              />
                            ))}
                          </div>
                          <span className="text-xs text-white/50">
                            (This is a mock 2FA setup. No backend integration.)
                          </span>
                        </div>
                      </div>
                    )}
                  </>
                )}
                {mode === "login" && (
                  <div className="flex items-center justify-between">
                    <label className="flex items-center cursor-pointer">
                      {" "}
                      <input
                        type="checkbox"
                        name="rememberMe"
                        checked={formData.rememberMe}
                        onChange={handleInputChange}
                        className="w-4 h-4 rounded border-white/20 bg-white/10 text-cyan-500 focus:ring-cyan-500 focus:ring-offset-0"
                      />
                      <span className="ml-2 text-white/70 text-sm">
                        Remember me
                      </span>
                    </label>{" "}
                    <button
                      type="button"
                      onClick={() => setMode("forgot")}
                      className="text-cyan-300 hover:text-cyan-200 text-sm font-medium transition-colors"
                    >
                      Forgot password?
                    </button>
                  </div>
                )}{" "}
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3 px-4 bg-gradient-to-r from-cyan-500 to-violet-600 hover:from-cyan-600 hover:to-violet-700 text-white font-semibold rounded-xl transition-all duration-200 transform hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none shadow-lg hover:shadow-xl"
                >
                  {loading ? (
                    <span className="flex items-center justify-center space-x-2">
                      <svg
                        className="animate-spin h-5 w-5 text-white"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        ></circle>
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        ></path>
                      </svg>
                      <span>Processing...</span>
                    </span>
                  ) : (
                    <span className="flex items-center justify-center space-x-2">
                      <span>{currentConfig.buttonText}</span>
                      <Icons.ArrowRight />
                    </span>
                  )}
                </button>
              </form>
              <div className="mt-6 text-center">
                <p className="text-white/70">
                  {currentConfig.switchText}{" "}
                  <button
                    onClick={() => {
                      const newMode =
                        mode === "login"
                          ? "register"
                          : mode === "register"
                          ? "login"
                          : "login";
                      setMode(newMode);
                      setErrors({});
                      setMock2FACode("");
                      setShow2FAInput(false);
                    }}
                    className="text-cyan-300 hover:text-cyan-200 font-medium transition-colors"
                  >
                    {currentConfig.switchAction}
                  </button>
                </p>
              </div>
              {mode === "login" && (
                <div className="mt-6 p-4 bg-white/5 backdrop-blur-sm rounded-xl border border-white/10">
                  <p className="text-white/60 text-xs text-center">
                    <strong>Demo credentials:</strong> demo@example.com /
                    Demo123!
                    {show2FAInput && " (2FA Code: 123456)"}
                  </p>
                </div>
              )}
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
