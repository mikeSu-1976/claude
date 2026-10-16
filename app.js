'use strict';

// ==================== 撞期檢查（純邏輯，不讀寫 localStorage） ====================
// 以一般 script 載入，函式為全域函式，供 index.html 與 test.html 使用。

function isActive(b) {
  return !b.cancelled;
}

function coversHour(b, hour) {
  return hour >= b.startHour && hour < b.startHour + b.duration;
}

/**
 * 撞期檢查：同會議室、同日期、同小時是否已有未取消的預約（也檢查本批彼此之間）。
 * existingBookings 為目前所有預約（含已取消），newBookings 為準備新增的預約。
 * 回傳衝突清單 [{ date, hours }]，沒有衝突時為空陣列。
 */
function findConflicts(existingBookings, newBookings) {
  const occupied = existingBookings.filter(isActive);
  const conflicts = [];
  for (const b of newBookings) {
    const hours = [];
    for (let h = b.startHour; h < b.startHour + b.duration; h++) {
      if (occupied.some(o => o.roomId === b.roomId && o.date === b.date && coversHour(o, h))) {
        hours.push(h);
      }
    }
    if (hours.length > 0) conflicts.push({ date: b.date, hours });
    occupied.push(b);
  }
  return conflicts;
}
