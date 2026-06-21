// constants/holidays.js
//
// NSE/BSE Trading Hours: 9:15 AM to 3:30 PM IST, Mon–Fri
// Source: NSE India official holiday list 2025
// Update this list each year from: https://www.nseindia.com

export const NSE_HOLIDAYS_2025 = [
  '2025-01-26', // Republic Day
  '2025-02-26', // Mahashivratri
  '2025-03-14', // Holi
  '2025-03-31', // Id-Ul-Fitr (Ramzan Eid)
  '2025-04-10', // Shri Ram Navami
  '2025-04-14', // Dr.Baba Saheb Ambedkar Jayanti
  '2025-04-18', // Good Friday
  '2025-05-01', // Maharashtra Day
  '2025-08-15', // Independence Day
  '2025-10-02', // Mahatma Gandhi Jayanti
  '2025-10-24', // Dussehra (Vijaya Dashami)
  '2025-11-05', // Diwali Laxmi Pujan
  '2025-11-14', // Gurunanak Jayanti
  '2025-12-25', // Christmas
]

export const isMarketHoliday = (dateStr) =>
  NSE_HOLIDAYS_2025.includes(dateStr)

// Returns true if NSE market is currently open
export const isMarketOpen = () => {
  const now = new Date()

  // Convert to IST (UTC+5:30)
  const istOffset = 5.5 * 60 * 60 * 1000
  const ist = new Date(now.getTime() + istOffset)

  const day  = ist.getUTCDay()    // 0=Sun, 6=Sat
  const hour = ist.getUTCHours()
  const min  = ist.getUTCMinutes()

  // Weekend check
  if (day === 0 || day === 6) return false

  // Holiday check
  const dateStr = ist.toISOString().split('T')[0]
  if (isMarketHoliday(dateStr)) return false

  // Market hours: 9:15 AM to 3:30 PM IST
  const totalMins = hour * 60 + min
  return totalMins >= 555 && totalMins <= 930  // 9*60+15=555, 15*60+30=930
}

// Returns next trading day message
export const getMarketStatus = () => {
  if (isMarketOpen()) return { open: true, message: 'Market Open' }
  const now = new Date()
  const day = now.getDay()
  if (day === 5) return { open: false, message: 'Opens Monday 9:15 AM' }
  if (day === 6) return { open: false, message: 'Opens Monday 9:15 AM' }
  return { open: false, message: 'Opens 9:15 AM IST' }
}