/**
 * Token存储策略类型
 */
export type StorageStrategy = 'localStorage' | 'cookie' | 'memory';

/**
 * Token存储配置
 */
export interface TokenStorageConfig {
  strategy: StorageStrategy;
  cookieOptions?: {
    domain?: string;
    path?: string;
    secure?: boolean;
    sameSite?: 'strict' | 'lax' | 'none';
    httpOnly?: boolean;
  };
  encryptionKey?: string;
}

/**
 * Token数据接口
 */
export interface TokenData {
  accessToken: string;
  refreshToken?: string;
  expiresAt: number;
  userId: string;
  email: string;
  role: string;
}

/**
 * 内存存储（用于SSR或安全要求高的场景）
 */
const memoryStorage: { [key: string]: string } = {};

/**
 * Token存储管理类
 */
export class TokenStorage {
  private strategy: StorageStrategy;
  private cookieOptions: TokenStorageConfig['cookieOptions'];
  private encryptionKey?: string;

  constructor(config: TokenStorageConfig) {
    this.strategy = config.strategy;
    this.cookieOptions = config.cookieOptions;
    this.encryptionKey = config.encryptionKey;
  }

  /**
   * 存储Token
   */
  setToken(tokenData: TokenData): void {
    const serializedData = JSON.stringify(tokenData);
    const dataToStore = this.encryptionKey
      ? this.encrypt(serializedData)
      : serializedData;

    switch (this.strategy) {
      case 'localStorage':
        this.setLocalStorage('auth-token', dataToStore);
        break;
      case 'cookie':
        this.setCookie('auth-token', dataToStore, tokenData.expiresAt);
        break;
      case 'memory':
        memoryStorage['auth-token'] = dataToStore;
        break;
    }
  }

  /**
   * 获取Token
   */
  getToken(): TokenData | null {
    let data: string | null = null;

    switch (this.strategy) {
      case 'localStorage':
        data = this.getLocalStorage('auth-token');
        break;
      case 'cookie':
        data = this.getCookie('auth-token');
        break;
      case 'memory':
        data = memoryStorage['auth-token'] || null;
        break;
    }

    if (!data) return null;

    try {
      const decryptedData = this.encryptionKey ? this.decrypt(data) : data;

      const tokenData: TokenData = JSON.parse(decryptedData);

      // 检查Token是否过期
      if (tokenData.expiresAt < Date.now()) {
        this.removeToken();
        return null;
      }

      return tokenData;
    } catch (error) {
      console.error('Failed to parse token data:', error);
      this.removeToken();
      return null;
    }
  }

  /**
   * 移除Token
   */
  removeToken(): void {
    switch (this.strategy) {
      case 'localStorage':
        this.removeLocalStorage('auth-token');
        break;
      case 'cookie':
        this.removeCookie('auth-token');
        break;
      case 'memory':
        delete memoryStorage['auth-token'];
        break;
    }
  }

  /**
   * 检查Token是否存在且有效
   */
  hasValidToken(): boolean {
    const token = this.getToken();
    return token !== null;
  }

  /**
   * 获取访问令牌
   */
  getAccessToken(): string | null {
    const tokenData = this.getToken();
    return tokenData?.accessToken || null;
  }

  /**
   * 获取刷新令牌
   */
  getRefreshToken(): string | null {
    const tokenData = this.getToken();
    return tokenData?.refreshToken || null;
  }

  /**
   * 更新访问令牌
   */
  updateAccessToken(accessToken: string, expiresAt: number): void {
    const currentData = this.getToken();
    if (currentData) {
      this.setToken({
        ...currentData,
        accessToken,
        expiresAt,
      });
    }
  }

  /**
   * localStorage操作
   */
  private setLocalStorage(key: string, value: string): void {
    if (typeof window !== 'undefined') {
      try {
        localStorage.setItem(key, value);
      } catch (error) {
        console.error('Failed to set localStorage:', error);
      }
    }
  }

  private getLocalStorage(key: string): string | null {
    if (typeof window !== 'undefined') {
      try {
        return localStorage.getItem(key);
      } catch (error) {
        console.error('Failed to get localStorage:', error);
        return null;
      }
    }
    return null;
  }

  private removeLocalStorage(key: string): void {
    if (typeof window !== 'undefined') {
      try {
        localStorage.removeItem(key);
      } catch (error) {
        console.error('Failed to remove localStorage:', error);
      }
    }
  }

  /**
   * Cookie操作
   */
  private setCookie(name: string, value: string, expiresAt: number): void {
    if (typeof document !== 'undefined') {
      const expires = new Date(expiresAt).toUTCString();
      const options = this.cookieOptions || {};

      let cookieString = `${name}=${encodeURIComponent(value)}; expires=${expires}`;

      if (options.domain) cookieString += `; domain=${options.domain}`;
      if (options.path) cookieString += `; path=${options.path}`;
      if (options.secure) cookieString += '; secure';
      if (options.sameSite) cookieString += `; samesite=${options.sameSite}`;
      if (options.httpOnly) cookieString += '; httponly';

      document.cookie = cookieString;
    }
  }

  private getCookie(name: string): string | null {
    if (typeof document !== 'undefined') {
      const nameEQ = name + '=';
      const ca = document.cookie.split(';');

      for (let i = 0; i < ca.length; i++) {
        let c = ca[i];
        while (c.charAt(0) === ' ') c = c.substring(1, c.length);
        if (c.indexOf(nameEQ) === 0) {
          return decodeURIComponent(c.substring(nameEQ.length, c.length));
        }
      }
    }
    return null;
  }

  private removeCookie(name: string): void {
    if (typeof document !== 'undefined') {
      const options = this.cookieOptions || {};
      let cookieString = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC`;

      if (options.domain) cookieString += `; domain=${options.domain}`;
      if (options.path) cookieString += `; path=${options.path}`;

      document.cookie = cookieString;
    }
  }

  /**
   * 简单的加密/解密（实际应用中应使用更安全的加密方法）
   */
  private encrypt(data: string): string {
    if (!this.encryptionKey) return data;

    // 这里使用简单的Base64编码作为示例
    // 实际应用中应使用AES等安全的加密算法
    return btoa(data);
  }

  private decrypt(encryptedData: string): string {
    if (!this.encryptionKey) return encryptedData;

    try {
      return atob(encryptedData);
    } catch (error) {
      console.error('Failed to decrypt data:', error);
      throw error;
    }
  }
}

/**
 * 默认Token存储实例
 */
export const defaultTokenStorage = new TokenStorage({
  strategy: 'localStorage',
  cookieOptions: {
    path: '/',
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
  },
});

/**
 * 安全Token存储实例（使用Cookie）
 */
export const secureTokenStorage = new TokenStorage({
  strategy: 'cookie',
  cookieOptions: {
    path: '/',
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    httpOnly: false, // 设为true会更安全，但需要服务端配合
  },
});

/**
 * 内存Token存储实例（用于SSR）
 */
export const memoryTokenStorage = new TokenStorage({
  strategy: 'memory',
});

export default TokenStorage;
