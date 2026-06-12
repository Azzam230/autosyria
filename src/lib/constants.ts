export const BRANDS = [
  'كيا',
  'هيونداي',
  'تويوتا',
  'نيسان',
  'ميتسوبيشي',
  'شيفروليه',
  'بي إم دبليو',
  'مرسيدس',
  'أودي',
  'فولكس فاجن',
  'رينو',
  'بيجو',
  'سوزوكي',
  'هوندا',
  'مازدا',
] as const

export const GOVERNORATES = [
  'دمشق',
  'حلب',
  'حمص',
  'اللاذقية',
  'طرطوس',
  'حماة',
  'دير الزور',
  'الرقة',
  'الحسكة',
  'إدلب',
  'درعا',
  'السويداء',
  'القنيطرة',
  'ريف دمشق',
] as const

export const WHATSAPP_NUMBER = process.env.NEXT_PUBLIC_ADMIN_WHATSAPP || '96393XXXXXX'
export const SITE_NAME = 'Auto Syria'
export const SITE_DESCRIPTION = 'سوق السيارات الأول في سوريا - بيع وشراء السيارات'
export const ITEMS_PER_PAGE = 12
