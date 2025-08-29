"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

// Импорты стилей админ панели
import "../../styles/admin/admin-base.css";
import "../../styles/admin/admin-dashboard.css";
import "../../styles/admin/admin-forms.css";

export default function AdminLogin() {
  const [credentials, setCredentials] = useState({
    username: "",
    password: ""
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      // Простая проверка (в реальном проекте нужно использовать NextAuth.js)
      if (credentials.username === "admin" && credentials.password === "admin123") {
        // Сохраняем токен в localStorage
        localStorage.setItem("adminToken", "admin-token-123");
        router.push("/admin/dashboard");
      } else {
        setError("Неверные учетные данные");
      }
    } catch (err) {
      setError("Ошибка входа");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="admin-login-container">
      <div className="admin-login-card">
        <div className="admin-login-header">
          <h1>BioMorphX</h1>
          <h2>Админ-панель</h2>
        </div>
        
        <form onSubmit={handleSubmit} className="admin-login-form">
          {error && <div className="error-message">{error}</div>}
          
          <div className="form-group">
            <label htmlFor="username">Имя пользователя</label>
            <input
              type="text"
              id="username"
              value={credentials.username}
              onChange={(e) => setCredentials({...credentials, username: e.target.value})}
              required
              placeholder="Введите имя пользователя"
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="password">Пароль</label>
            <input
              type="password"
              id="password"
              value={credentials.password}
              onChange={(e) => setCredentials({...credentials, password: e.target.value})}
              required
              placeholder="Введите пароль"
            />
          </div>
          
          <button 
            type="submit" 
            className="admin-login-btn"
            disabled={isLoading}
          >
            {isLoading ? "Вход..." : "Войти"}
          </button>
        </form>
        
        <div className="admin-login-footer">
          <p>Тестовые данные: admin / admin123</p>
        </div>
      </div>
    </div>
  );
}


