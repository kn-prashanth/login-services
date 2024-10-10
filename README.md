Here are all the endpoints for **login service** API along with the request details and formats:

---

### **Register New User**
- **URL**: `https://login-services2.vercel.app/api/auth/register`
- **Method**: `POST`
- **Body**:
  ```json
  {
    "username": "prashanth",
    "email": "prashi8129lsdf@gmail.com",
    "password": "Password123"
  }
  ```
- **Authentication**: None

---

### **Login Without 2FA**
- **URL**: `https://login-services2.vercel.app/api/auth/login`
- **Method**: `POST`
- **Body**:
  ```json
  {
    "email": "prashi8129lsdf@gmail.com",
    "password": "Password123"
  }
  ```
- **Authentication**: None

---

### **Enable 2FA**
- **URL**: `https://login-services2.vercel.app/api/auth/enable-2fa`
- **Method**: `POST`
- **Headers**: `Authorization: Bearer <JWT_TOKEN>` (Token received after login)
- **Body**: None (user’s 2FA will be enabled and a QR code or secret will be sent)
- **Authentication**: JWT Token (user must be logged in)

---

### **Verify 2FA**
- **URL**: `https://login-services2.vercel.app/api/auth/verify-2fa`
- **Method**: `POST`
- **Body**:
  ```json
  {
    "token": "<2FA_TOKEN>"
  }
  ```
- **Authentication**: None (This is to verify the 2FA token)

---

### **Login with 2FA**
- **URL**: `https://login-services2.vercel.app/api/auth/login-2fa`
- **Method**: `POST`
- **Body**:
  ```json
  {
    "email": "prashi8129lsdf@gmail.com",
    "password": "Password123",
    "token": "<2FA_TOKEN>"
  }
  ```
- **Authentication**: None (but the correct 2FA token must be provided)

---
