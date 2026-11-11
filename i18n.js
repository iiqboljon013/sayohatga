/* sayohatga — tillar: o'zbekcha (asosiy), русский, English.
   Ilova matni o'zbekcha yoziladi; bu fayl ekrandagi matnni tanlangan tilga o'giradi.
   Foydalanuvchi yozgan matn (e'lon nomi, izohlar) o'zgarmaydi. */
(function () {
  const KEY = 'sayohatga-lang';
  const pick = () => {
    try { const s = localStorage.getItem(KEY); if (s === 'uz' || s === 'ru' || s === 'en') return s; } catch (_) {}
    return 'uz';
  };
  let lang = pick();

  const MONTHS = {
    uz: ['yanvar', 'fevral', 'mart', 'aprel', 'may', 'iyun', 'iyul', 'avgust', 'sentabr', 'oktabr', 'noyabr', 'dekabr'],
    ru: ['января', 'февраля', 'марта', 'апреля', 'мая', 'июня', 'июля', 'августа', 'сентября', 'октября', 'ноября', 'декабря'],
    en: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']
  };
  const CUR = { uz: "so'm", ru: 'сум', en: 'UZS' };

  /* "uz": ["ru", "en"] */
  const D = {
    // splash, auth
    "O'tkazib yuborish →": ['Пропустить →', 'Skip →'],
    "Ro'yxatdan o'tish": ['Регистрация', 'Sign up'],
    "Tasdiqlash kodi Telegram'dagi @sayohatga_uz_bot orqali bepul yuboriladi.": ['Код подтверждения бесплатно придёт через @sayohatga_uz_bot в Telegram.', 'Your confirmation code is sent free via @sayohatga_uz_bot on Telegram.'],
    'Ism': ['Имя', 'First name'],
    'Familiya': ['Фамилия', 'Last name'],
    'Telefon raqam': ['Номер телефона', 'Phone number'],
    'Kod yuborish': ['Получить код', 'Get code'],
    'Kodni kiriting': ['Введите код', 'Enter the code'],
    "Telegram'da kodni olish": ['Получить код в Telegram', 'Get the code in Telegram'],
    'Tasdiqlash kodi': ['Код подтверждения', 'Confirmation code'],
    'Tasdiqlash': ['Подтвердить', 'Confirm'],
    "← Raqamni o'zgartirish": ['← Изменить номер', '← Change number'],
    'Botni qayta ochish': ['Открыть бота снова', 'Open the bot again'],
    '4 xonali kodni kiriting.': ['Введите 4-значный код.', 'Enter the 4-digit code.'],
    "Avval Telegram botdan kod oling. Botga shu raqam bilan ro'yxatdan o'tgan Telegram akkauntidan kiring.": ['Сначала получите код в Telegram-боте. Войдите в бота с аккаунта Telegram, привязанного к этому номеру.', 'First get a code from the Telegram bot. Open the bot from the Telegram account linked to this number.'],
    'Kod muddati tugadi. Botdan yangi kod oling.': ['Срок действия кода истёк. Получите новый код в боте.', 'The code has expired. Get a new one from the bot.'],
    "Kod ko'p marta noto'g'ri kiritildi. Botdan yangi kod oling.": ['Код введён неверно слишком много раз. Получите новый код в боте.', 'Too many wrong attempts. Get a new code from the bot.'],
    "Telefon raqam yoki kod noto'g'ri.": ['Неверный номер или код.', 'Wrong phone number or code.'],
    "Kirib bo'lmadi. Birozdan keyin qayta urinib ko'ring.": ['Не удалось войти. Попробуйте чуть позже.', "Couldn't sign in. Please try again shortly."],
    "Server bilan bog'lanib bo'lmadi. Qayta urinib ko'ring.": ['Не удалось связаться с сервером. Попробуйте ещё раз.', "Couldn't reach the server. Please try again."],
    "Server bilan bog'lanib bo'lmadi": ['Не удалось связаться с сервером', "Couldn't reach the server"],
    "Internet aloqasi yo'q.": ['Нет подключения к интернету.', 'No internet connection.'],
    "Internet aloqasi yo'q": ['Нет подключения к интернету', 'No internet connection'],
    "Xatolik yuz berdi. Qaytadan urinib ko'ring.": ['Произошла ошибка. Попробуйте ещё раз.', 'Something went wrong. Please try again.'],
    // top, home
    'Bildirishnomalar': ['Уведомления', 'Notifications'],
    'Qayerga borasiz': ['Куда поедете', 'Where to'],
    'Qayerga borasiz?': ['Куда поедете?', 'Where to?'],
    'Qidirish': ['Искать', 'Search'],
    'Sayohatlar': ['Поездки', 'Trips'],
    'Hammasi': ['Все', 'All'],
    'Oson': ['Лёгкий', 'Easy'],
    "O'rtacha": ['Средний', 'Moderate'],
    'Qiyin': ['Сложный', 'Hard'],
    "Ko'rinish": ['Вид', 'View'],
    "Ro'yxat": ['Список', 'List'],
    'Xarita': ['Карта', 'Map'],
    'Lavhalar': ['Моменты', 'Moments'],
    '+ Rasm joylash': ['+ Добавить фото', '+ Add photo'],
    "Hali e'lon yo'q. Birinchi sayohatni pastdagi «+» tugmasi orqali joylang.": ['Объявлений пока нет. Разместите первую поездку кнопкой «+» внизу.', 'No trips yet. Post the first one with the «+» button below.'],
    "Bunday sayohat topilmadi. Boshqa joy nomini yozib ko'ring.": ['Такой поездки не нашлось. Попробуйте другое место.', 'No trips found. Try another place name.'],
    "Hali lavha yo'q. Sayohatingizdan birinchi rasmni joylang.": ['Пока пусто. Поделитесь первым фото из поездки.', 'Nothing here yet. Share the first photo from your trip.'],
    'Yuklanmoqda…': ['Загрузка…', 'Loading…'],
    'KETISH': ['ОТЪЕЗД', 'DEPART'],
    'QAYTISH': ['ВОЗВРАТ', 'RETURN'],
    'Joylar': ['Места', 'Seats'],
    'Gid': ['Гид', 'Guide'],
    'Gid:': ['Гид:', 'Guide:'],
    "Sizning e'loningiz": ['Ваше объявление', 'Your listing'],
    'Band qilish': ['Забронировать', 'Book'],
    'Band qilindi ✓': ['Забронировано ✓', 'Booked ✓'],
    '1 kishi': ['1 чел.', '1 person'],
    'Yoqdi': ['Нравится', 'Like'],
    'Izohlar': ['Комментарии', 'Comments'],
    'Ulashish': ['Поделиться', 'Share'],
    "Rasmni o'chirish": ['Удалить фото', 'Delete photo'],
    'Xarita yuklanmoqda…': ['Карта загружается…', 'Loading map…'],
    'Xarita yuklanmadi. Internetni tekshiring.': ['Карта не загрузилась. Проверьте интернет.', "The map didn't load. Check your connection."],
    'Ochish': ['Открыть', 'Open'],
    // rentals
    'Ijara': ['Аренда', 'Rent'],
    'Jihozlar': ['Снаряжение', 'Gear'],
    'ijarasi': ['в аренду', 'for rent'],
    '+ Ijaraga berish': ['+ Сдать в аренду', '+ Rent out'],
    "Narxlar bir kun uchun. Jihozni bosib, batafsil ko'ring.": ['Цены за один день. Нажмите на вещь, чтобы узнать подробнее.', 'Prices are per day. Tap an item for details.'],
    'Sizning jihozingiz': ['Ваша вещь', 'Your item'],
    "Hali jihoz yo'q. «+» → Ijara orqali birinchi bo'lib joylang.": ['Снаряжения пока нет. Разместите первым через «+» → Аренда.', 'No gear yet. Be the first via «+» → Rent.'],
    'Ijaradan olib tashlandi': ['Убрано из аренды', 'Removed from rentals'],
    // booked
    'Bandlarim': ['Мои брони', 'My bookings'],
    'Hali hech narsa band qilinmagan.': ['Пока ничего не забронировано.', 'Nothing booked yet.'],
    'Band qilindi': ['Забронировано', 'Booked'],
    "To'langan": ['Оплачено', 'Paid'],
    'Gidingiz': ['Ваш гид', 'Your guide'],
    'Bekor qilish': ['Отменить', 'Cancel'],
    'Ijaraga olingan jihozlar': ['Арендованное снаряжение', 'Rented gear'],
    'Jami, bir kun uchun': ['Итого за один день', 'Total per day'],
    'Band qilishni bekor qilasizmi?': ['Отменить бронь?', 'Cancel this booking?'],
    "Siz gidning ro'yxatidan o'chirilasiz.": ['Вы будете удалены из списка гида.', "You'll be removed from the guide's list."],
    'Band bekor qilindi': ['Бронь отменена', 'Booking cancelled'],
    // profile
    'Profil': ['Профиль', 'Profile'],
    "Profil rasmini o'zgartirish": ['Изменить фото профиля', 'Change profile photo'],
    "Mening e'lonlarim": ['Мои объявления', 'My listings'],
    'Ijaraga berganlarim': ['Сдаю в аренду', 'My rentals'],
    '+ Jihoz': ['+ Вещь', '+ Item'],
    'Lavhalarim': ['Мои моменты', 'My moments'],
    "Hali e'lon joylamadingiz.": ['Вы ещё не размещали объявлений.', "You haven't posted any trips yet."],
    'Hali jihoz joylamadingiz.': ['Вы ещё не размещали снаряжение.', "You haven't listed any gear yet."],
    'Hali rasm joylamadingiz.': ['Вы ещё не добавляли фото.', "You haven't shared any photos yet."],
    'Rasm joylash': ['Добавить фото', 'Add photo'],
    'Til': ['Язык', 'Language'],
    "O'zbekcha · Русский · English": ['Русский · O\'zbekcha · English', "English · O'zbekcha · Русский"],
    'Xavfsizlik va yordam': ['Безопасность и помощь', 'Safety & help'],
    'Favqulodda holatda: 112': ['В экстренной ситуации: 112', 'Emergency: 112'],
    "Favqulodda holatda 112 raqamiga qo'ng'iroq qiling": ['В экстренной ситуации звоните 112', 'In an emergency, call 112'],
    'Chiqish': ['Выйти', 'Log out'],
    'Akkauntdan chiqish': ['Выйти из аккаунта', 'Sign out of your account'],
    'Akkauntdan chiqasizmi?': ['Выйти из аккаунта?', 'Log out?'],
    'Qayta kirish uchun Telegram botdan yangi kod olasiz.': ['Чтобы войти снова, получите новый код в Telegram-боте.', "To sign in again, you'll get a new code from the Telegram bot."],
    'Profil rasmi yangilandi': ['Фото профиля обновлено', 'Profile photo updated'],
    "Hozircha yangi bildirishnoma yo'q": ['Новых уведомлений нет', 'No new notifications'],
    // menu sheet
    'Asosiy menyu': ['Главное меню', 'Main menu'],
    "Qo'shish": ['Добавить', 'Add'],
    "Nima qo'shamiz?": ['Что добавим?', 'What would you like to add?'],
    'Sayohatingizdan rasm ulashing': ['Поделитесь фото из поездки', 'Share a photo from your trip'],
    "E'lon joylash": ['Разместить поездку', 'Post a trip'],
    'Sayohat, sana, narx, guruh': ['Поездка, дата, цена, группа', 'Trip, date, price, group'],
    'Jihozingizni ijaraga bering': ['Сдайте снаряжение в аренду', 'Rent out your gear'],
    'Yopish': ['Закрыть', 'Close'],
    // post compose
    'Rasm yoki video joylash': ['Добавить фото или видео', 'Add a photo or video'],
    'Rasm yoki video tanlang': ['Выберите фото или видео', 'Choose a photo or video'],
    'Telefon galereyasidan · video 50 MB gacha': ['Из галереи телефона · видео до 50 МБ', 'From your phone gallery · video up to 50 MB'],
    'Tanlangan rasm': ['Выбранное фото', 'Selected photo'],
    'Qayerda olingan': ['Где снято', 'Where was it taken'],
    'Izoh': ['Подпись', 'Caption'],
    'Joylash': ['Опубликовать', 'Publish'],
    'Avval rasm yoki video tanlang.': ['Сначала выберите фото или видео.', 'Choose a photo or video first.'],
    'Rasm yoki video tanlang.': ['Выберите фото или видео.', 'Choose a photo or video.'],
    'Video 50 MB dan katta. Qisqaroq video tanlang.': ['Видео больше 50 МБ. Выберите видео покороче.', 'The video is over 50 MB. Choose a shorter one.'],
    'Video yuklanmoqda…': ['Видео загружается…', 'Uploading video…'],
    'Rasm joylandi': ['Опубликовано', 'Posted'],
    'Rasm fayl tanlang': ['Выберите файл изображения', 'Choose an image file'],
    "Rasmni ochib bo'lmadi": ['Не удалось открыть фото', "Couldn't open the photo"],
    "Rasmni o'chirasizmi?": ['Удалить публикацию?', 'Delete this post?'],
    "Uni qayta tiklab bo'lmaydi.": ['Восстановить её будет нельзя.', "This can't be undone."],
    "Rasm o'chirildi": ['Удалено', 'Deleted'],
    // new trip form
    "Yulduzchali maydonlar majburiy.": ['Поля со звёздочкой обязательны.', 'Fields marked * are required.'],
    'Sayohat': ['Поездка', 'Trip'],
    'Sayohat nomi *': ['Название поездки *', 'Trip name *'],
    'Joy (viloyat, tuman) *': ['Место (область, район) *', 'Location (region, district) *'],
    'Tavsif *': ['Описание *', 'Description *'],
    'Tavsif': ['Описание', 'Description'],
    'Xaritadagi joyi': ['Место на карте', 'Location on the map'],
    'Manzil yoki joy nomi': ['Адрес или название места', 'Address or place name'],
    'Topish': ['Найти', 'Find'],
    "Joy nomini yozsangiz, xaritadan o'zimiz topib belgilaymiz. Noto'g'ri bo'lsa, xaritani bosib yoki nuqtani surib to'g'rilang.": ['Напишите название места — мы сами найдём его на карте. Если неточно, нажмите на карту или перетащите метку.', "Type the place name and we'll find it on the map. If it's off, tap the map or drag the pin."],
    'Manzil aniqlanmoqda…': ['Определяем адрес…', 'Finding the address…'],
    'Nuqta belgilandi': ['Точка отмечена', 'Pin placed'],
    'Avval joy nomini yozing.': ['Сначала напишите название места.', 'Type a place name first.'],
    'Xaritadan qidirilmoqda…': ['Ищем на карте…', 'Searching the map…'],
    "Xaritadan topilmadi. Xaritani bosib, joyni o'zingiz belgilang.": ['Не нашли на карте. Нажмите на карту и отметьте место сами.', "Couldn't find it. Tap the map to place the pin yourself."],
    'Ketish va qaytish': ['Отъезд и возвращение', 'Departure and return'],
    'Ketish sanasi *': ['Дата отъезда *', 'Departure date *'],
    'Ketish vaqti *': ['Время отъезда *', 'Departure time *'],
    'Qaytish sanasi *': ['Дата возвращения *', 'Return date *'],
    'Qaytish vaqti *': ['Время возвращения *', 'Return time *'],
    'Sanani tanlang': ['Выберите дату', 'Pick a date'],
    "Yig'ilish joyi *": ['Место сбора *', 'Meeting point *'],
    'Qiyinlik *': ['Сложность *', 'Difficulty *'],
    'Nimalar kerak': ['Что взять с собой', 'What to bring'],
    'Vergul bilan ajrating.': ['Через запятую.', 'Separate with commas.'],
    'Narx va guruh': ['Цена и группа', 'Price and group'],
    "Narx, 1 kishi (so'm) *": ['Цена за 1 чел. (сум) *', 'Price per person (UZS) *'],
    'Necha kishi oladi *': ['Сколько человек *', 'Group size *'],
    'Rasmlar (10 tagacha)': ['Фото (до 10)', 'Photos (up to 10)'],
    'Pul tushadigan karta': ['Карта для оплаты', 'Payout card'],
    'Karta raqami *': ['Номер карты *', 'Card number *'],
    "Faqat oxirgi 4 raqami ko'rinadi.": ['Видны только последние 4 цифры.', 'Only the last 4 digits are shown.'],
    'Karta egasi *': ['Владелец карты *', 'Cardholder *'],
    "E'lonni joylash": ['Разместить объявление', 'Post listing'],
    'Joylanmoqda…': ['Публикуем…', 'Posting…'],
    'Kuting…': ['Подождите…', 'Please wait…'],
    "Karta raqami 16 ta raqam bo'lishi kerak.": ['Номер карты должен содержать 16 цифр.', 'The card number must have 16 digits.'],
    "Qaytish vaqti ketishdan keyin bo'lishi kerak.": ['Время возвращения должно быть позже отъезда.', 'Return must be after departure.'],
    "Narx kamida 1 000 so'm bo'lsin.": ['Цена — не меньше 1 000 сум.', 'The price must be at least 1,000 UZS.'],
    "Guruh 1–60 kishi bo'lishi mumkin.": ['В группе может быть от 1 до 60 человек.', 'A group can be 1–60 people.'],
    "E'lon joylandi": ['Объявление опубликовано', 'Listing posted'],
    'Rasmlar yuklanmoqda…': ['Загружаем фото…', 'Uploading photos…'],
    "Rasm qo'shildi": ['Фото добавлено', 'Photo added'],
    '10 tagacha rasm joylash mumkin': ['Можно добавить до 10 фото', 'You can add up to 10 photos'],
    'Asosiy': ['Главное', 'Cover'],
    // rental form
    'Ijaraga berish': ['Сдать в аренду', 'Rent out'],
    "Rasm qo'ymasangiz, sayohatga logotipi ko'rinadi.": ['Без фото будет показан логотип sayohatga.', 'Without a photo, the sayohatga logo is shown.'],
    'Jihoz nomi *': ['Название вещи *', 'Item name *'],
    "Narx, kuniga (so'm) *": ['Цена в день (сум) *', 'Price per day (UZS) *'],
    'Qayerdan olinadi *': ['Где забрать *', 'Pickup location *'],
    'Jihoz joylandi': ['Снаряжение размещено', 'Item listed'],
    // detail
    'Orqaga': ['Назад', 'Back'],
    '1 kishi uchun': ['за 1 человека', 'per person'],
    "Bu bo'limni faqat siz ko'rasiz": ['Этот блок видите только вы', 'Only you can see this section'],
    "Faqat siz ko'rasiz": ['Видите только вы', 'Only you can see this'],
    'kishi band qildi': ['чел. забронировали', 'people booked'],
    'jami summa': ['общая сумма', 'total amount'],
    'Pul tushadigan karta:': ['Карта для оплаты:', 'Payout card:'],
    'Rasmlar': ['Фото', 'Photos'],
    "Band qilganlar ro'yxati": ['Список забронировавших', 'Booking list'],
    'Hali hech kim band qilmagan.': ['Пока никто не забронировал.', 'No bookings yet.'],
    "E'lonni o'chirish": ['Удалить объявление', 'Delete listing'],
    "E'lonni o'chirasizmi?": ['Удалить объявление?', 'Delete this listing?'],
    "E'lon va band qilganlar ro'yxati butunlay o'chadi.": ['Объявление и список броней будут удалены навсегда.', 'The listing and its booking list will be deleted for good.'],
    "E'lon o'chirildi": ['Объявление удалено', 'Listing deleted'],
    'Ketish': ['Отъезд', 'Departure'],
    'Qaytish': ['Возвращение', 'Return'],
    "Yig'ilish joyi": ['Место сбора', 'Meeting point'],
    'Qiyinlik': ['Сложность', 'Difficulty'],
    'Band qilingan': ['Забронировано', 'Booked'],
    'Joylashuv': ['Местоположение', 'Location'],
    'Yandex xarita': ['Яндекс Карты', 'Yandex Maps'],
    'Izoh yozish': ['Написать комментарий', 'Write a comment'],
    'Barcha izohlar': ['Все комментарии', 'All comments'],
    "Hali izoh yo'q. Birinchi bo'lib yozing.": ['Комментариев пока нет. Будьте первым.', 'No comments yet. Be the first.'],
    'Izoh yozing…': ['Напишите комментарий…', 'Write a comment…'],
    'Yuborish': ['Отправить', 'Send'],
    "Izohni o'chirish": ['Удалить комментарий', 'Delete comment'],
    'bir kun uchun': ['за один день', 'per day'],
    'Qayerdan olinadi': ['Где забрать', 'Pickup'],
    'Narx': ['Цена', 'Price'],
    'Egasi': ['Владелец', 'Owner'],
    'Siz': ['Вы', 'You'],
    'Ijaraga beruvchi': ['Арендодатель', 'Owner'],
    'Ijaraga olish': ['Взять в аренду', 'Rent'],
    'Ijaraga olindi ✓': ['Арендовано ✓', 'Rented ✓'],
    '· olib tashlash': ['· убрать', '· remove'],
    "· ko'rish": ['· смотреть', '· view'],
    'Joy band qilish': ['Забронировать место', 'Book a seat'],
    'Joylar tugagan': ['Мест нет', 'Sold out'],
    'Necha kishi': ['Сколько человек', 'How many people'],
    'Bir kishi kamaytirish': ['Уменьшить на одного', 'One fewer'],
    "Bir kishi qo'shish": ['Добавить одного', 'One more'],
    'Kamida 1 kishi': ['Минимум 1 человек', 'At least 1 person'],
    "Jihozni o'chirasizmi?": ['Удалить вещь?', 'Delete this item?'],
    "E'lon butunlay o'chadi.": ['Объявление будет удалено навсегда.', 'The listing will be deleted for good.'],
    "Jihoz o'chirildi": ['Вещь удалена', 'Item deleted'],
    "Bu e'lon topilmadi yoki o'chirilgan": ['Объявление не найдено или удалено', 'This listing was not found or was deleted'],
    'Bu rasm topilmadi': ['Публикация не найдена', 'This post was not found'],
    // pay
    "To'lov": ['Оплата', 'Payment'],
    "To'lov turini tanlang": ['Выберите способ оплаты', 'Choose a payment method'],
    "To'lov turini tanlang.": ['Выберите способ оплаты.', 'Choose a payment method.'],
    "To'lov turi": ['Способ оплаты', 'Payment method'],
    "To'lash": ['Оплатить', 'Pay'],
    "Sinov rejimi: haqiqiy pul yechilmaydi.": ['Тестовый режим: деньги не списываются.', 'Test mode: no real money is charged.'],
    "To'lov qabul qilindi": ['Бронь принята', 'Booking received'],
    'Jami': ['Итого', 'Total'],
    'Band qilinmoqda…': ['Бронируем…', 'Booking…'],
    "Bo'sh joy yetarli emas": ['Недостаточно свободных мест', 'Not enough free seats'],
    "Bu sayohatda bo'sh joy qolmagan": ['В этой поездке нет свободных мест', 'This trip is fully booked'],
    // share
    'Havola': ['Ссылка', 'Link'],
    'Nusxalash': ['Копировать', 'Copy'],
    'Havola nusxalandi': ['Ссылка скопирована', 'Link copied'],
    'Havolani belgilab, nusxalang': ['Выделите ссылку и скопируйте', 'Select the link and copy it'],
    // misc
    "O'chirish": ['Удалить', 'Delete'],
    'Tilni tanlang': ['Выберите язык', 'Choose a language'],
    'Tekshirilmoqda…': ['Проверяем…', 'Checking…'],
    'hozirgina': ['только что', 'just now']
  };

  /* placeholders: translated only inside input hints, never in user text */
  const PH = {
    "Katta Chimyon cho'qqisi": ['Вершина Большой Чимган', 'Greater Chimgan peak'],
    "Toshkent viloyati, Bo'stonliq": ['Ташкентская обл., Бостанлык', 'Tashkent region, Bostanliq'],
    "Katta Chimyon, Bo'stonliq": ['Большой Чимган, Бостанлык', 'Greater Chimgan, Bostanliq'],
    'Palatka, 3 kishilik': ['Палатка, трёхместная', 'Tent, 3-person'],
    'Chorsu metro': ['Метро Чорсу', 'Chorsu metro'],
    'Suv, issiq kiyim, fonar': ['Вода, тёплая одежда, фонарик', 'Water, warm clothes, flashlight'],
    'ISM FAMILIYA': ['ИМЯ ФАМИЛИЯ', 'FULL NAME'],
    'Tepaga 4 soatda chiqdik!': ['Поднялись на вершину за 4 часа!', 'Made it to the top in 4 hours!'],
    "Holati, o'lchami, nimalar bilan beriladi": ['Состояние, размер, что входит в комплект', "Condition, size, what's included"],
    "Yo'l qanday, nimani ko'ramiz, kimlar uchun mos": ['Какой маршрут, что увидим, кому подойдёт', 'What the route is like, what we\'ll see, who it suits']
  };

  const w = (s, i) => (D[s] ? D[s][i] : s);
  const num = (n, i, ru1, ru2, ru5, en1, enN) => {
    n = +n;
    if (i === 1) return n === 1 ? en1 : enN;
    const a = n % 10, b = n % 100;
    return a === 1 && b !== 11 ? ru1 : a >= 2 && a <= 4 && (b < 12 || b > 14) ? ru2 : ru5;
  };
  /* sentences built from pieces */
  const P = [
    [/^(\d+) kishi$/, (m, i) => i ? `${m[1]} ${num(m[1], 1, '', '', '', 'person', 'people')}` : `${m[1]} чел.`],
    [/^(\d+) TA$/, (m, i) => i ? `${m[1]} ITEMS` : `${m[1]} ШТ.`],
    [/^(\d+) ta rasm$/, (m, i) => i ? `${m[1]} ${num(m[1], 1, '', '', '', 'photo', 'photos')}` : `${m[1]} фото`],
    [/^(\d+) kishi · (\d+) ta joy bo'sh$/, (m, i) => i ? `${m[1]} booked · ${m[2]} seats left` : `${m[1]} чел. · свободно мест: ${m[2]}`],
    [/^(\d+) \/ (\d+) kishi band qildi · (.+)$/, (m, i) => i ? `${m[1]} / ${m[2]} booked · ${m[3]}` : `${m[1]} / ${m[2]} чел. забронировали · ${m[3]}`],
    [/^(.+) \/ kun( · .+)?$/, (m, i) => `${m[1]} / ${i ? 'day' : 'день'}${m[2] || ''}`],
    [/^· (.+) \/ kun$/, (m, i) => `· ${m[1]} / ${i ? 'day' : 'день'}`],
    [/^(Band qilindi|To'langan) · (\d+) kishi · (.+)$/, (m, i) => `${w(m[1], i)} · ${i ? m[2] + ' ' + num(m[2], 1, '', '', '', 'person', 'people') : m[2] + ' чел.'} · ${m[3]}`],
    [/^(\d+) kishi × (.+)$/, (m, i) => `${m[1]} ${i ? num(m[1], 1, '', '', '', 'person', 'people') : 'чел.'} × ${m[2]}`],
    [/^Band qilish · (.+)$/, (m, i) => `${i ? 'Book' : 'Забронировать'} · ${m[1]}`],
    [/^Izohlar \((\d+)\)$/, (m, i) => `${i ? 'Comments' : 'Комментарии'} (${m[1]})`],
    [/^(\d+) daqiqa oldin$/, (m, i) => i ? `${m[1]} min ago` : `${m[1]} мин назад`],
    [/^(\d+) soat oldin$/, (m, i) => i ? `${m[1]} h ago` : `${m[1]} ч назад`],
    [/^(\d+) kun oldin$/, (m, i) => i ? `${m[1]} ${num(m[1], 1, '', '', '', 'day', 'days')} ago` : `${m[1]} ${num(m[1], 0, 'день', 'дня', 'дней')} назад`],
    [/^(.+) · hozirgina$/, (m, i) => `${m[1]} · ${w('hozirgina', i)}`],
    [/^(.+) — batafsil$/, (m, i) => `${m[1]} — ${i ? 'details' : 'подробнее'}`],
    [/^(.+) — ijaraga olish$/, (m, i) => `${m[1]} — ${i ? 'rent' : 'взять в аренду'}`],
    [/^(.+) — olib tashlash$/, (m, i) => `${m[1]} — ${i ? 'remove' : 'убрать'}`],
    [/^(.+) xaritada$/, (m, i) => `${m[1]} ${i ? 'on the map' : 'на карте'}`],
    [/^(.+) ijaraga olindi — Bandlarim bo'limida$/, (m, i) => i ? `${m[1]} rented — see My bookings` : `${m[1]} — арендовано, см. «Мои брони»`],
    [/^(\d+)-rasm$/, (m, i) => i ? `Photo ${m[1]}` : `Фото ${m[1]}`],
    [/^(\d+)-rasmni o'chirish$/, (m, i) => i ? `Delete photo ${m[1]}` : `Удалить фото ${m[1]}`],
    [/^(.+) — (\d+)-rasm$/, (m, i) => `${m[1]} — ${i ? 'photo' : 'фото'} ${m[2]}`],
    [/^\+ ?(\d+) \/ 10$/, m => m[0]],
    [/^To'ldiring: (.+)\.$/, (m, i) => (i ? 'Please fill in: ' : 'Заполните: ') + m[1].split(', ').map(x => w(x, i)).join(', ') + '.'],
    [/^Iltimos, (.+) kiriting\.$/, (m, i) => (i ? 'Please enter ' : 'Пожалуйста, введите ') + m[1].split(', ').map(x => w(x, i)).join(', ') + '.'],
    [/^(\+998 [\d ]+) uchun kodni Telegram botimizdan oling: .+$/, (m, i) => i
      ? `Get the code for ${m[1]} from our Telegram bot: open it, tap Start, then send this number with the «Share my number» button.`
      : `Код для ${m[1]} получите в нашем Telegram-боте: откройте бота, нажмите Start и отправьте этот номер кнопкой «Поделиться номером».`],
    [/^Kod noto'g'ri\. Yana (\d+) ta urinish qoldi\.$/, (m, i) => i ? `Wrong code. ${m[1]} attempts left.` : `Неверный код. Осталось попыток: ${m[1]}.`],
    [/^Xush kelibsiz, (.+)!$/, (m, i) => i ? `Welcome, ${m[1]}!` : `Добро пожаловать, ${m[1]}!`],
    [/^Faqat (\d+) ta bo'sh joy bor$/, (m, i) => i ? `Only ${m[1]} seats left` : `Свободно только ${m[1]} мест`],
    [/^Faqat yana (\d+) ta rasm qo'shish mumkin$/, (m, i) => i ? `You can add only ${m[1]} more photos` : `Можно добавить ещё только ${m[1]} фото`],
    [/^(\d+) kishilik joy band qilindi\..+$/, (m, i) => i
      ? `${m[1]} ${num(m[1], 1, '', '', '', 'seat', 'seats')} booked. You're now on the guide's list. Once payment systems are connected, you'll pay right here.`
      : `Забронировано мест: ${m[1]}. Вы в списке гида. Когда подключим платёжные системы, оплата будет прямо здесь.`]
  ];
  /* field names inside the "To'ldiring:" / "Iltimos, ... kiriting" messages */
  Object.assign(D, {
    'sayohat nomi': ['название поездки', 'trip name'], 'joy': ['место', 'location'], 'tavsif': ['описание', 'description'],
    'ketish sanasi': ['дату отъезда', 'departure date'], 'ketish vaqti': ['время отъезда', 'departure time'],
    'qaytish sanasi': ['дату возвращения', 'return date'], 'qaytish vaqti': ['время возвращения', 'return time'],
    "yig'ilish joyi": ['место сбора', 'meeting point'], 'narx': ['цену', 'price'], 'necha kishi': ['размер группы', 'group size'],
    'karta egasi': ['владельца карты', 'cardholder'], 'jihoz nomi': ['название вещи', 'item name'], 'qayerdan olinishi': ['где забрать', 'pickup location'],
    'ismingizni': ['имя', 'your first name'], 'familiyangizni': ['фамилию', 'your last name'], '9 xonali telefon raqamingizni': ['9-значный номер телефона', 'your 9-digit phone number']
  });

  function tr(s, ph) {
    if (lang === 'uz' || s == null) return s;
    const k = String(s).trim(); if (!k) return s;
    const i = lang === 'ru' ? 0 : 1;
    let r = ph && PH[k] ? PH[k][i] : D[k] ? D[k][i] : null;
    if (r == null) for (const [re, fn] of P) { const m = k.match(re); if (m) { r = fn(m, i); break; } }
    return r == null ? s : String(s).replace(k, r);
  }

  /* ---- translate the page as it changes ---- */
  const ATTRS = ['placeholder', 'aria-label', 'alt', 'title'];
  const attrMem = new WeakMap();
  const skip = el => !el || el.closest('script,style,[data-notr],.leaflet-control-attribution');
  function doText(n) {
    if (skip(n.parentElement)) return;
    if (n.__t === undefined || n.data !== n.__t) n.__o = n.data;
    const out = tr(n.__o);
    if (out !== n.data) n.data = out;
    n.__t = n.data;
  }
  function doAttrs(el) {
    if (skip(el)) return;
    let mem = attrMem.get(el); if (!mem) { mem = {}; attrMem.set(el, mem); }
    for (const a of ATTRS) {
      const v = el.getAttribute(a); if (v == null) continue;
      const m = mem[a];
      if (!m || v !== m.t) mem[a] = {o:v};
      const out = tr(mem[a].o, a === 'placeholder');
      if (out !== v) el.setAttribute(a, out);
      mem[a].t = el.getAttribute(a);
    }
  }
  function walk(root) {
    if (root.nodeType === 3) { doText(root); return; }
    if (root.nodeType !== 1) return;
    doAttrs(root);
    const it = document.createTreeWalker(root, NodeFilter.SHOW_TEXT | NodeFilter.SHOW_ELEMENT);
    let n; while ((n = it.nextNode())) { if (n.nodeType === 3) doText(n); else doAttrs(n); }
  }
  let busy = false;
  const mo = new MutationObserver(list => {
    if (busy) return; busy = true;
    try {
      for (const m of list) {
        if (m.type === 'characterData') doText(m.target);
        else if (m.type === 'attributes') doAttrs(m.target);
        else m.addedNodes.forEach(walk);
      }
    } finally { mo.takeRecords(); busy = false; }
  });
  function applyAll() {
    document.documentElement.lang = lang;
    busy = true; try { walk(document.body); } finally { mo.takeRecords(); busy = false; }
  }
  function start() {
    applyAll();
    mo.observe(document.body, {childList:true, subtree:true, characterData:true, attributes:true, attributeFilter:ATTRS});
  }
  if (document.body) start(); else document.addEventListener('DOMContentLoaded', start);

  window.I18N = {
    get lang() { return lang; },
    months: () => MONTHS[lang],
    cur: () => CUR[lang],
    ago: (n, u) => u === 'now' ? tr('hozirgina') : tr(n + ({m:' daqiqa oldin', h:' soat oldin', d:' kun oldin'})[u]),
    t: tr,
    set(l) { if (!MONTHS[l]) return; lang = l; try { localStorage.setItem(KEY, l); } catch (_) {} applyAll(); }
  };
})();
