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
    this.botToken = config.telegram.botToken;
    this.chatId = config.telegram.chatId;
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

  async sendMessage(message: string): Promise<void> {
    try {
      await axios.post(`${this.apiUrl}/sendMessage`, {
        chat_id: this.chatId,
        text: message,
        parse_mode: 'HTML'
      });
    } catch (error) {
      console.error('Error sending Telegram message:', error);
      throw error;
    }
  }

  async sendBookingNotification(bookingData: any): Promise<void> {
    const message = `
<b>🎉 Новое бронирование!</b>

📅 Дата: ${bookingData.date}
⏰ Время: ${bookingData.time}
⏱ Длительность: ${bookingData.duration} часа
👥 Количество гостей: ${bookingData.guests}

👤 Имя: ${bookingData.name}
📱 Телефон: ${bookingData.phone}
    `;

    await this.sendMessage(message);
  }
} 