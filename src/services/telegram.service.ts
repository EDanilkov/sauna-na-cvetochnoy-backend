import axios from 'axios';
import { config } from '../config/config';

interface BookingData {
  date: string;
  time: string;
  duration: string;
  guests: string;
  name: string;
  phone: string;
}

export class TelegramService {
  private readonly botToken: string;
  private readonly chatId: string;
  private readonly apiUrl: string;

  constructor() {
    this.botToken = config.telegramBotToken;
    this.chatId = config.telegramChatId;
    this.apiUrl = `https://api.telegram.org/bot${this.botToken}`;
    
    // Отладочная информация
    console.log('Telegram Service: Инициализация');
    console.log('Telegram Service: Bot Token:', this.botToken ? '✓ Установлен' : '✗ Не установлен');
    console.log('Telegram Service: Chat ID:', this.chatId ? '✓ Установлен' : '✗ Не установлен');
    console.log('Telegram Service: API URL:', this.apiUrl);
  }

  private formatMessage(data: BookingData): string {
    const date = new Date(data.date).toLocaleDateString('ru-RU', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });

    return `📅 Новое бронирование:\n\n` +
           `Дата: ${date}\n` +
           `Время: ${data.time}\n` +
           `Длительность: ${data.duration} часа\n` +
           `Гостей: ${data.guests}\n\n` +
           `Имя: ${data.name}\n` +
           `Телефон: ${data.phone}`;
  }

  async sendBookingNotification(data: BookingData): Promise<void> {
    try {
      const message = this.formatMessage(data);
      console.log('Telegram Service: Подготовка сообщения:', message);
      
      console.log('Telegram Service: Отправка запроса к Telegram API');
      const response = await axios.post(`${this.apiUrl}/sendMessage`, {
        chat_id: this.chatId,
        text: message,
        parse_mode: 'HTML'
      });
      
      console.log('Telegram Service: Ответ от Telegram API:', response.data);
    } catch (error) {
      console.error('Telegram Service: Ошибка при отправке сообщения:', error);
      if (axios.isAxiosError(error)) {
        console.error('Telegram Service: Детали ошибки:', {
          status: error.response?.status,
          data: error.response?.data,
          message: error.message,
          url: error.config?.url
        });
      }
      throw new Error('Failed to send booking notification');
    }
  }
} 