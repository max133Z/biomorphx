"use client";

import { useEffect } from 'react';

export default function ExternalResources() {
  useEffect(() => {
    // Загружаем Font Awesome
    const fontAwesomeLink = document.createElement('link');
    fontAwesomeLink.rel = 'stylesheet';
    fontAwesomeLink.href = 'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css';
    document.head.appendChild(fontAwesomeLink);

    // Загружаем Google Fonts preconnect
    const preconnectGoogle = document.createElement('link');
    preconnectGoogle.rel = 'preconnect';
    preconnectGoogle.href = 'https://fonts.googleapis.com';
    document.head.appendChild(preconnectGoogle);

    const preconnectGstatic = document.createElement('link');
    preconnectGstatic.rel = 'preconnect';
    preconnectGstatic.href = 'https://fonts.gstatic.com';
    preconnectGstatic.crossOrigin = '';
    document.head.appendChild(preconnectGstatic);

    // Загружаем Montserrat Alternates
    const montserratLink = document.createElement('link');
    montserratLink.rel = 'stylesheet';
    montserratLink.href = 'https://fonts.googleapis.com/css2?family=Montserrat+Alternates:ital,wght@0,100;0,200;0,300;0,400;0,500;0,600;0,700;0,800;0,900;1,100;1,200;1,300;1,400;1,500;1,600;1,700;1,800;1,900&display=swap';
    document.head.appendChild(montserratLink);

    return () => {
      // Очистка при размонтировании
      // Проверяем, что элемент существует и является дочерним элементом перед удалением
      if (fontAwesomeLink && fontAwesomeLink.parentNode === document.head) {
        document.head.removeChild(fontAwesomeLink);
      }
      if (preconnectGoogle && preconnectGoogle.parentNode === document.head) {
        document.head.removeChild(preconnectGoogle);
      }
      if (preconnectGstatic && preconnectGstatic.parentNode === document.head) {
        document.head.removeChild(preconnectGstatic);
      }
      if (montserratLink && montserratLink.parentNode === document.head) {
        document.head.removeChild(montserratLink);
      }
    };
  }, []);

  return null;
}
