/**
 * @description 获取路由参数，可以添加、删除当前路由参数
 */
import { useLocation, useNavigate } from 'react-router-dom';
import { useMemo, useCallback } from 'react';

interface RouteParams {
  [key: string]: string | string[] | undefined;
}

interface UseRouteReturn {
  /** 当前路由参数 */
  params: RouteParams;
  /** 获取指定参数的值 */
  getParam: (key: string) => string | string[] | undefined;
  /** 设置路由参数（会替换当前所有参数） */
  setParams: (newParams: Record<string, string | string[] | null>, clear?: boolean) => void;
  /** 添加或更新单个参数 */
  setParam: (key: string, value: string | string[] | null, clear?: boolean) => void;
  /** 删除指定参数 */
  removeParam: (key: string) => void;
  /** 清空所有参数 */
  clearParams: () => void;
}

/**
 * 将URL查询字符串转换为参数对象
 */
const parseSearchParams = (search: string): RouteParams => {
  const params: RouteParams = {};
  const searchParams = new URLSearchParams(search);

  for (const [key, value] of searchParams.entries()) {
    if (params[key]) {
      // 如果已经存在，转换为数组
      if (Array.isArray(params[key])) {
        (params[key] as string[]).push(value);
      } else {
        params[key] = [params[key] as string, value];
      }
    } else {
      params[key] = value;
    }
  }

  return params;
};

/**
 * 将参数对象转换为URL查询字符串
 */
const stringifyParams = (params: RouteParams): string => {
  const searchParams = new URLSearchParams();

  Object.entries(params).forEach(([key, value]) => {
    if (value === null || value === undefined) {
      return;
    }

    if (Array.isArray(value)) {
      value.forEach((v) => {
        if (v !== null && v !== undefined) {
          searchParams.append(key, v);
        }
      });
    } else {
      searchParams.set(key, value);
    }
  });

  const searchString = searchParams.toString();
  return searchString ? `?${searchString}` : '';
};

/**
 * 合并参数对象，处理null值（表示删除）
 */
const mergeParams = (
  currentParams: RouteParams,
  newParams: Record<string, string | string[] | null>
): RouteParams => {
  const merged = { ...currentParams };

  Object.entries(newParams).forEach(([key, value]) => {
    if (value === null) {
      delete merged[key];
    } else {
      merged[key] = value;
    }
  });

  return merged;
};

/**
 * Hook for managing route parameters
 * @returns Route parameters management utilities
 */
export const useRoute = (): UseRouteReturn => {
  const location = useLocation();
  const navigate = useNavigate();

  // 解析当前路由参数
  const params = useMemo(() => {
    return parseSearchParams(location.search);
  }, [location.search]);

  /**
   * 获取指定参数的值
   */
  const getParam = useCallback(
    (key: string): string | string[] | undefined => {
      return params[key];
    },
    [params]
  );

  /**
   * 设置路由参数（会替换当前所有参数）
   */
  const setParams = useCallback(
    (newParams: Record<string, string | string[] | null>, clear?: boolean) => {
      const mergedParams = mergeParams(clear ? {} : params, newParams);
      const searchString = stringifyParams(mergedParams);

      navigate(
        {
          pathname: location.pathname,
          search: searchString,
        },
        {
          replace: true,
        }
      );
    },
    [location.pathname, navigate]
  );

  /**
   * 添加或更新单个参数
   */
  const setParam = useCallback(
    (key: string, value: string | string[] | null, clear?: boolean) => {
      const newParams = { [key]: value };
      const mergedParams = mergeParams(clear ? {} : params, newParams);
      const searchString = stringifyParams(mergedParams);

      navigate(
        {
          pathname: location.pathname,
          search: searchString,
        },
        {
          replace: true,
        }
      );
    },
    [location.pathname, navigate, params]
  );

  /**
   * 删除指定参数
   */
  const removeParam = useCallback(
    (key: string) => {
      // 创建新的参数对象，删除指定键
      const newParams = { ...params };
      delete newParams[key];
      const searchString = stringifyParams(newParams);

      navigate(
        {
          pathname: location.pathname,
          search: searchString,
        },
        {
          replace: true,
        }
      );
    },
    [location.pathname, navigate, params]
  );

  /**
   * 清空所有参数
   */
  const clearParams = useCallback(() => {
    navigate(
      {
        pathname: location.pathname,
        search: '',
      },
      {
        replace: true,
      }
    );
  }, [location.pathname, navigate]);

  return {
    params,
    getParam,
    setParams,
    setParam,
    removeParam,
    clearParams,
  };
};
