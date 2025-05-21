import { Request, Response } from 'express';
import { TelegramService } from '../services/telegram.service';

const telegramService = new TelegramService();

export const createBooking = async (req: Request, res: Response): Promise<void> => {
  console.log('Backend: Получен запрос на бронирование');
  console.log('Backend: Headers:', req.headers);
  console.log('Backend: Тело запроса:', JSON.stringify(req.body, null, 2));

  try {
    const bookingData = req.body;

    // Валидация данных
    const requiredFields = ['date', 'time', 'duration', 'guests', 'name', 'phone'];
    const missingFields = requiredFields.filter(field => !bookingData[field]);

    if (missingFields.length > 0) {
      console.log('Backend: Отсутствуют обязательные поля:', missingFields);
      res.status(400).json({
        error: 'Missing required fields',
        fields: missingFields
      });
      return;
    }

    // Проверка формата данных
    console.log('Backend: Проверка формата данных:');
    console.log('- Дата:', bookingData.date);
    console.log('- Время:', bookingData.time);
    console.log('- Длительность:', bookingData.duration);
    console.log('- Гости:', bookingData.guests);
    console.log('- Имя:', bookingData.name);
    console.log('- Телефон:', bookingData.phone);

    console.log('Backend: Отправка уведомления в Telegram');
    // Отправка уведомления в Telegram
    await telegramService.sendBookingNotification(bookingData);
    console.log('Backend: Уведомление успешно отправлено в Telegram');

    res.status(200).json({
      message: 'Booking notification sent successfully'
    });
  } catch (error) {
    console.error('Backend: Ошибка при обработке бронирования:', error);
    if (error instanceof Error) {
      console.error('Backend: Сообщение об ошибке:', error.message);
      console.error('Backend: Стек ошибки:', error.stack);
    }
    res.status(500).json({
      error: 'Failed to process booking'
    });
  }
}; 