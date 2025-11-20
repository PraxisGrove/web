import { z } from 'zod';
import { UseFormReturn } from 'react-hook-form';

/**
 * 验证工具函数和 Hook
 * 提供验证相关的实用工具
 */

// 验证结果类型
export interface ValidationResult<T = any> {
  success: boolean;
  data?: T;
  errors?: Record<string, string[]>;
  message?: string;
}

// 字段验证结果类型
export interface FieldValidationResult {
  isValid: boolean;
  error?: string;
}

/**
 * 验证工具类
 */
export class ValidationUtils {
  /**
   * 验证单个值
   */
  static validateValue<T>(
    schema: z.ZodSchema<T>,
    value: unknown
  ): ValidationResult<T> {
    try {
      const data = schema.parse(value);
      return {
        success: true,
        data,
      };
    } catch (error) {
      if (error instanceof z.ZodError) {
        return {
          success: false,
          errors: this.formatZodErrors(error),
          message: '验证失败',
        };
      }
      return {
        success: false,
        message: '未知验证错误',
      };
    }
  }

  /**
   * 异步验证单个值
   */
  static async validateValueAsync<T>(
    schema: z.ZodSchema<T>,
    value: unknown
  ): Promise<ValidationResult<T>> {
    try {
      const data = await schema.parseAsync(value);
      return {
        success: true,
        data,
      };
    } catch (error) {
      if (error instanceof z.ZodError) {
        return {
          success: false,
          errors: this.formatZodErrors(error),
          message: '验证失败',
        };
      }
      return {
        success: false,
        message: '未知验证错误',
      };
    }
  }

  /**
   * 验证表单数据
   */
  static validateForm<T>(
    schema: z.ZodSchema<T>,
    data: unknown
  ): ValidationResult<T> {
    return this.validateValue(schema, data);
  }

  /**
   * 验证单个字段
   */
  static validateField<T>(
    schema: z.ZodSchema<T>,
    value: unknown
  ): FieldValidationResult {
    try {
      schema.parse(value);
      return { isValid: true };
    } catch (error) {
      if (error instanceof z.ZodError) {
        const firstError = error.errors[0];
        return {
          isValid: false,
          error: firstError?.message || '验证失败',
        };
      }
      return {
        isValid: false,
        error: '未知验证错误',
      };
    }
  }

  /**
   * 格式化 Zod 错误信息
   */
  static formatZodErrors(error: z.ZodError): Record<string, string[]> {
    const errors: Record<string, string[]> = {};

    error.errors.forEach((err) => {
      const path = err.path.join('.');
      if (!errors[path]) {
        errors[path] = [];
      }
      errors[path].push(err.message);
    });

    return errors;
  }

  /**
   * 获取第一个错误信息
   */
  static getFirstError(errors: Record<string, string[]>): string | undefined {
    const firstKey = Object.keys(errors)[0];
    return firstKey ? errors[firstKey][0] : undefined;
  }

  /**
   * 检查是否有错误
   */
  static hasErrors(errors: Record<string, string[]>): boolean {
    return Object.keys(errors).length > 0;
  }

  /**
   * 清理空值
   */
  static cleanEmptyValues<T extends Record<string, any>>(data: T): Partial<T> {
    const cleaned: Partial<T> = {};

    Object.entries(data).forEach(([key, value]) => {
      if (value !== null && value !== undefined && value !== '') {
        cleaned[key as keyof T] = value;
      }
    });

    return cleaned;
  }

  /**
   * 深度清理空值
   */
  static deepCleanEmptyValues<T>(data: T): T {
    if (Array.isArray(data)) {
      return data
        .map((item) => this.deepCleanEmptyValues(item))
        .filter((item) => item !== null && item !== undefined) as T;
    }

    if (data && typeof data === 'object') {
      const cleaned: any = {};
      Object.entries(data).forEach(([key, value]) => {
        const cleanedValue = this.deepCleanEmptyValues(value);
        if (
          cleanedValue !== null &&
          cleanedValue !== undefined &&
          cleanedValue !== ''
        ) {
          cleaned[key] = cleanedValue;
        }
      });
      return cleaned;
    }

    return data;
  }

  /**
   * 转换表单数据类型
   */
  static transformFormData<T>(
    data: Record<string, any>,
    transformers: Record<string, (value: any) => any> = {}
  ): T {
    const transformed: any = { ...data };

    Object.entries(transformers).forEach(([key, transformer]) => {
      if (key in transformed) {
        transformed[key] = transformer(transformed[key]);
      }
    });

    return transformed;
  }

  /**
   * 创建条件验证架构
   */
  static createConditionalSchema<T extends z.ZodRawShape>(
    baseSchema: z.ZodObject<T>,
    conditions: Array<{
      condition: (data: any) => boolean;
      schema: z.ZodObject<any>;
    }>
  ): z.ZodEffects<z.ZodObject<T>> {
    return baseSchema.superRefine((data, ctx) => {
      conditions.forEach(({ condition, schema }) => {
        if (condition(data)) {
          const result = schema.safeParse(data);
          if (!result.success) {
            result.error.errors.forEach((error) => {
              ctx.addIssue({
                code: z.ZodIssueCode.custom,
                path: error.path,
                message: error.message,
              });
            });
          }
        }
      });
    });
  }

  /**
   * 创建异步验证架构
   */
  static createAsyncSchema<T extends z.ZodRawShape>(
    baseSchema: z.ZodObject<T>,
    asyncValidators: Array<{
      field: keyof T;
      validator: (value: any) => Promise<boolean>;
      message: string;
    }>
  ): z.ZodEffects<
    z.ZodObject<T>,
    z.infer<z.ZodObject<T>>,
    z.infer<z.ZodObject<T>>
  > {
    return baseSchema.superRefine(async (data, ctx) => {
      const promises = asyncValidators.map(
        async ({ field, validator, message }) => {
          const value = data[field];
          const isValid = await validator(value);
          if (!isValid) {
            ctx.addIssue({
              code: z.ZodIssueCode.custom,
              path: [field as string],
              message,
            });
          }
        }
      );

      await Promise.all(promises);
    });
  }
}

/**
 * 表单验证 Hook
 */
export function useFormValidation<T extends Record<string, any>>(
  schema: z.ZodSchema<T>,
  form: UseFormReturn<T>
) {
  /**
   * 验证单个字段
   */
  const validateField = (
    fieldName: keyof T,
    value: any
  ): FieldValidationResult => {
    try {
      // 获取字段的验证架构
      const fieldSchema = (schema as any).shape[fieldName];
      if (!fieldSchema) {
        return { isValid: true };
      }

      fieldSchema.parse(value);
      return { isValid: true };
    } catch (error) {
      if (error instanceof z.ZodError) {
        return {
          isValid: false,
          error: error.errors[0]?.message || '验证失败',
        };
      }
      return {
        isValid: false,
        error: '未知验证错误',
      };
    }
  };

  /**
   * 验证所有字段
   */
  const validateAllFields = (): ValidationResult<T> => {
    const formData = form.getValues();
    return ValidationUtils.validateForm(schema, formData);
  };

  /**
   * 异步验证所有字段
   */
  const validateAllFieldsAsync = async (): Promise<ValidationResult<T>> => {
    const formData = form.getValues();
    return ValidationUtils.validateValueAsync(schema, formData);
  };

  /**
   * 设置字段错误
   */
  const setFieldError = (fieldName: keyof T, message: string) => {
    form.setError(fieldName as any, {
      type: 'manual',
      message,
    });
  };

  /**
   * 清除字段错误
   */
  const clearFieldError = (fieldName: keyof T) => {
    form.clearErrors(fieldName as any);
  };

  /**
   * 清除所有错误
   */
  const clearAllErrors = () => {
    form.clearErrors();
  };

  /**
   * 获取字段错误
   */
  const getFieldError = (fieldName: keyof T): string | undefined => {
    const error = form.formState.errors[fieldName];
    return error?.message as string | undefined;
  };

  /**
   * 检查字段是否有错误
   */
  const hasFieldError = (fieldName: keyof T): boolean => {
    return !!form.formState.errors[fieldName];
  };

  /**
   * 检查表单是否有错误
   */
  const hasErrors = (): boolean => {
    return Object.keys(form.formState.errors).length > 0;
  };

  return {
    validateField,
    validateAllFields,
    validateAllFieldsAsync,
    setFieldError,
    clearFieldError,
    clearAllErrors,
    getFieldError,
    hasFieldError,
    hasErrors,
  };
}

/**
 * 实时验证 Hook
 */
export function useRealtimeValidation<T extends Record<string, any>>(
  schema: z.ZodSchema<T>,
  form: UseFormReturn<T>,
  options: {
    debounceMs?: number;
    validateOnChange?: boolean;
    validateOnBlur?: boolean;
  } = {}
) {
  const { debounceMs = 300, validateOnChange = true } = options;

  const { validateField } = useFormValidation(schema, form);

  // 防抖验证函数
  const debouncedValidate = React.useCallback(() => {
    return debounce((fieldName: keyof T, value: any) => {
      const result = validateField(fieldName, value);
      if (!result.isValid && result.error) {
        form.setError(fieldName as any, {
          type: 'validation',
          message: result.error,
        });
      } else {
        form.clearErrors(fieldName as any);
      }
    }, debounceMs);
  }, [validateField, form, debounceMs]);

  // 获取防抖函数实例
  const debouncedValidateInstance = React.useMemo(
    () => debouncedValidate(),
    [debouncedValidate]
  );

  // 监听字段变化
  React.useEffect(() => {
    if (!validateOnChange) return;

    const subscription = form.watch((value, { name }) => {
      if (name && value[name] !== undefined) {
        debouncedValidateInstance(name as keyof T, value[name]);
      }
    });

    return () => subscription.unsubscribe();
  }, [form, debouncedValidateInstance, validateOnChange]);

  return {
    validateField: debouncedValidateInstance,
  };
}

/**
 * 防抖函数
 */
function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout;
  return (...args: Parameters<T>) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
}

// React 导入
import React from 'react';
