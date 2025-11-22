/**
 * 用户角色类型
 */
export type UserRole = 'user' | 'admin';

/**
 * 权限类型
 */
export type Permission =
  // 用户权限
  | 'user:profile:read'
  | 'user:profile:update'
  | 'user:progress:view'

  // 管理员权限
  | 'admin:users:create'
  | 'admin:users:read'
  | 'admin:users:update'
  | 'admin:users:delete'
  | 'admin:students:view'
  | 'admin:system:config'
  | 'admin:analytics:view'
  | 'admin:roles:manage';

/**
 * 角色权限映射
 */
export const ROLE_PERMISSIONS: Record<UserRole, Permission[]> = {
  user: [
    'user:profile:read',
    'user:profile:update',
    'user:progress:view',
  ],
  admin: [
    // 继承用户权限
    'user:profile:read',
    'user:profile:update',
    'user:progress:view',
    // 管理员权限
    'admin:users:create',
    'admin:users:read',
    'admin:users:update',
    'admin:users:delete',
    'admin:students:view',
    'admin:system:config',
    'admin:analytics:view',
    'admin:roles:manage',
  ],
};

/**
 * 权限检查类
 */
export class PermissionChecker {
  private userRole: UserRole;
  private permissions: Permission[];

  constructor(userRole: UserRole) {
    this.userRole = userRole;
    this.permissions = ROLE_PERMISSIONS[userRole] || [];
  }

  /**
   * 检查是否具有指定权限
   */
  hasPermission(permission: Permission): boolean {
    return this.permissions.includes(permission);
  }

  /**
   * 检查是否具有任意一个权限
   */
  hasAnyPermission(permissions: Permission[]): boolean {
    return permissions.some((permission) => this.hasPermission(permission));
  }

  /**
   * 检查是否具有所有权限
   */
  hasAllPermissions(permissions: Permission[]): boolean {
    return permissions.every((permission) => this.hasPermission(permission));
  }

  /**
   * 检查是否具有指定角色
   */
  hasRole(role: UserRole): boolean {
    return this.userRole === role;
  }

  /**
   * 检查是否具有任意一个角色
   */
  hasAnyRole(roles: UserRole[]): boolean {
    return roles.includes(this.userRole);
  }

  /**
   * 检查是否可以访问资源
   */
  canAccess(requiredPermissions: Permission | Permission[]): boolean {
    const permissions = Array.isArray(requiredPermissions)
      ? requiredPermissions
      : [requiredPermissions];

    return this.hasAnyPermission(permissions);
  }

  /**
   * 获取用户角色
   */
  getRole(): UserRole {
    return this.userRole;
  }

  /**
   * 获取用户权限列表
   */
  getPermissions(): Permission[] {
    return [...this.permissions];
  }

  /**
   * 检查是否为管理员
   */
  isAdmin(): boolean {
    return this.userRole === 'admin';
  }

  /**
   * 检查是否为普通用户
   */
  isUser(): boolean {
    return this.userRole === 'user';
  }

  /**
   * 检查是否为特权用户（管理员）
   */
  isPrivileged(): boolean {
    return this.isAdmin();
  }
}

/**
 * 权限工具函数
 */
export const PermissionUtils = {
  /**
   * 创建权限检查器
   */
  createChecker(userRole: UserRole): PermissionChecker {
    return new PermissionChecker(userRole);
  },

  /**
   * 检查角色是否具有权限
   */
  roleHasPermission(role: UserRole, permission: Permission): boolean {
    const permissions = ROLE_PERMISSIONS[role] || [];
    return permissions.includes(permission);
  },

  /**
   * 获取角色的所有权限
   */
  getRolePermissions(role: UserRole): Permission[] {
    return ROLE_PERMISSIONS[role] || [];
  },

  /**
   * 比较角色权限级别
   */
  compareRoles(role1: UserRole, role2: UserRole): number {
    const roleOrder: Record<UserRole, number> = {
      user: 1,
      admin: 2,
    };

    return roleOrder[role1] - roleOrder[role2];
  },

  /**
   * 检查角色是否高于或等于指定角色
   */
  roleIsAtLeast(userRole: UserRole, requiredRole: UserRole): boolean {
    return this.compareRoles(userRole, requiredRole) >= 0;
  },

  /**
   * 获取所有可用角色
   */
  getAllRoles(): UserRole[] {
    return ['user', 'admin'];
  },

  /**
   * 获取所有可用权限
   */
  getAllPermissions(): Permission[] {
    const allPermissions = new Set<Permission>();
    Object.values(ROLE_PERMISSIONS).forEach((permissions) => {
      permissions.forEach((permission) => allPermissions.add(permission));
    });
    return Array.from(allPermissions);
  },

  /**
   * 验证权限字符串格式
   */
  isValidPermission(permission: string): permission is Permission {
    return this.getAllPermissions().includes(permission as Permission);
  },

  /**
   * 验证角色字符串格式
   */
  isValidRole(role: string): role is UserRole {
    return this.getAllRoles().includes(role as UserRole);
  },
};

/**
 * 权限装饰器工厂
 */
export function requirePermission() {
  return function (
    target: any,
    propertyKey: string,
    descriptor: PropertyDescriptor
  ) {
    const originalMethod = descriptor.value;

    descriptor.value = function (...args: any[]) {
      // 这里应该从上下文中获取用户权限
      // 实际实现中需要根据具体的认证系统来获取用户信息
      console.warn('Permission check not implemented for decorator');
      return originalMethod.apply(this, args);
    };

    return descriptor;
  };
}

/**
 * 权限常量
 */
export const PERMISSIONS = {
  USER: {
    PROFILE_READ: 'user:profile:read' as const,
    PROFILE_UPDATE: 'user:profile:update' as const,
    PROGRESS_VIEW: 'user:progress:view' as const,
  },
  ADMIN: {
    USERS_CREATE: 'admin:users:create' as const,
    USERS_READ: 'admin:users:read' as const,
    USERS_UPDATE: 'admin:users:update' as const,
    USERS_DELETE: 'admin:users:delete' as const,
    STUDENTS_VIEW: 'admin:students:view' as const,
    SYSTEM_CONFIG: 'admin:system:config' as const,
    ANALYTICS_VIEW: 'admin:analytics:view' as const,
    ROLES_MANAGE: 'admin:roles:manage' as const,
  },
} as const;

export default PermissionChecker;
