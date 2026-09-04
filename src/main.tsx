import { StrictMode } from 'react'
import { hydrateRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router'
import './index.css'
import App from './App.tsx'

// `hydrateRoot` chứ không phải `createRoot`: HTML đã được prerender sẵn nội dung (Giai đoạn B
// của project-brain/10-ke-hoach-seo.md). Dùng `createRoot` sẽ vứt bỏ HTML đó rồi vẽ lại từ đầu,
// mất hết lợi ích prerender và có thể gây nháy màn hình.
hydrateRoot(
  document.getElementById('root')!,
  <StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </StrictMode>,
)
