// Background service worker cho extension

chrome.runtime.onInstalled.addListener(() => {
  console.log('Google Form Auto Answer Extension đã được cài đặt!');
});

// Lắng nghe các message từ content script hoặc popup
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  // Có thể xử lý các logic background ở đây nếu cần
  return true;
});
