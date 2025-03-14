// Подключаем модуль `fs`, стандартную библиотеку Node.js для работы с файловой системой
const fs = require('fs');

// Импортируем функцию `getLogFilePath` из модуля `pathUtils`, которая возвращает путь к файлу для записи логов
const { getLogFilePath } = require('./pathUtils');

// Импортируем функции для работы с лог-буфером из модуля `logBufferUtils`
const {
  getLogBuffer, // Функция возвращает текущее содержимое буфера логов (в виде массива строк)
  isLogBufferEmpty, // Функция проверяет, пуст ли буфер логов, и возвращает true/false
  resetLogBuffer, // Функция очищает (сбрасывает) буфер логов
} = require('./logBufferUtils');

/**
 * Функция для записи логов из буфера в файл.
 * Если буфер логов пуст, функция завершает выполнение.
 * Логи записываются с окончанием строки и добавляются (append) в указанный файл.
 */
const writeLogsToFile = () => {
  console.log('Writing logs to file...'); // Сообщение, которое поможет отладить процесс записи

  // Проверяем, пуст ли буфер логов
  // Если пустой, выходим из функции, так как нечего записывать
  if (isLogBufferEmpty()) return;

  // Получаем путь к файлу, куда будут записываться логи
  const logFilePath = getLogFilePath();

  // Собираем содержимое буфера логов:
  // - `getLogBuffer()` возвращает массив строк
  // - `.join('\n')` объединяет их в одну строку, разделяя каждую строку символом новой строки
  // - Добавляем '\n' в конце, чтобы последняя строка тоже завершалась символом новой строки
  const logsToWrite = getLogBuffer().join('\n') + '\n';

  // Используем метод `fs.appendFile` для добавления логов в файл
  // Этот метод записывает данные в конец файла (не перезаписывает его содержимое)
  fs.appendFile(logFilePath, logsToWrite, (err) => {
    // Проверяем наличие ошибок
    if (err) {
      // Если возникла ошибка, выводим сообщение об ошибке в консоль
      console.error('Error writing logs to file:', err.message);
    } else {
      // Если запись успешна, выводим сообщение
      console.log('Logs written successfully!');
      // После успешной записи сбрасываем содержимое лог-буфера
      resetLogBuffer();
    }
  });
};

// Экспортируем функцию `writeLogsToFile` для использования в других модулях
module.exports = { writeLogsToFile };
