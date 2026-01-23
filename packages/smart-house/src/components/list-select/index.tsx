/**
 * @description: 列表选择器，可以传入Select的所有 props 用 options 或 request 作为数据源，当传入request时，自动使用request的返回值作为 options，并在5s内缓存结果，多个相同request的select合并请求，支持滚动分页加载更多数据
 */
import { Select, SelectProps, Spin } from 'antd';
import React, { useEffect, useState, useRef } from 'react';
import { request } from 'src/request/request';

interface ListSelectProps extends SelectProps {
  /** 请求的地址，要求接口为 Get 接口
   * 请求入参为 Page & { search?: string }
   * 出参为 Promise<{ data: SelectProps['options'][]; total: number }>
   */
  request?: string;
  filterKey?: string;
  /** 每次加载的数据量，默认20 */
  pageSize?: number;
  /** 是否启用滚动分页，默认true */
  enableScrollPagination?: boolean;
}

// 缓存管理器
const cacheManager = new Map<
  string,
  {
    data: NonNullable<SelectProps['options']>;
    timestamp: number;
    loading: boolean;
    total: number;
    currentPage: number;
    promise?: Promise<any>;
  }
>();

const CACHE_DURATION = 5000; // N秒缓存

export const ListSelect: React.FC<ListSelectProps> = (props) => {
  const {
    request: requestUrl,
    options: staticOptions,
    pageSize = 20,
    enableScrollPagination = true,
    filterKey = 'search',
    ...selectProps
  } = props;
  const [loading, setLoading] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [dynamicOptions, setDynamicOptions] = useState<NonNullable<SelectProps['options']>>([]);
  const [hasMore, setHasMore] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [total, setTotal] = useState(0);
  const searchRef = useRef<string>('');
  const currentRequestRef = useRef<string>('');
  const selectRef = useRef<any>(null);

  // 加载数据函数
  const loadData = async (page = 1, search?: string, isLoadMore = false) => {
    if (!requestUrl) return;

    const cacheKey = `${requestUrl}?search=${search || ''}&page=${page}&pageSize=${pageSize}`;
    currentRequestRef.current = cacheKey;

    // 检查缓存
    const cached = cacheManager.get(cacheKey);
    if (cached && Date.now() - cached.timestamp < CACHE_DURATION) {
      if (cached.loading && cached.promise) {
        // 等待正在进行的请求
        try {
          await cached.promise;
          const updatedCache = cacheManager.get(cacheKey);
          if (updatedCache && !updatedCache.loading) {
            if (isLoadMore) {
              setDynamicOptions((prev) => [...prev, ...(updatedCache.data || [])]);
            } else {
              setDynamicOptions(updatedCache.data || []);
            }
            setTotal(updatedCache.total);
            setHasMore(updatedCache.data.length < updatedCache.total);
          }
        } catch (error) {
          console.error('Request failed:', error);
        }
      } else if (!cached.loading) {
        // 使用缓存数据
        if (isLoadMore) {
          setDynamicOptions((prev) => [...prev, ...(cached.data || [])]);
        } else {
          setDynamicOptions(cached.data || []);
        }
        setTotal(cached.total);
        setHasMore(cached.data.length < cached.total);
      }
      return;
    }

    // 设置缓存为加载中
    cacheManager.set(cacheKey, {
      data: [],
      timestamp: Date.now(),
      loading: true,
      total: 0,
      currentPage: page,
    });

    if (isLoadMore) {
      setLoadingMore(true);
    } else {
      setLoading(true);
    }

    try {
      const requestPromise = request.get(requestUrl, {
        params: {
          current: page,
          pageSize,
          [filterKey]: search || '',
        },
      });

      // 保存promise到缓存
      const currentCache = cacheManager.get(cacheKey);
      if (currentCache) {
        currentCache.promise = requestPromise;
      }

      const response: any = await requestPromise;
      const data = response?.data || [];
      const totalCount = response?.total || 0;

      // 更新缓存
      cacheManager.set(cacheKey, {
        data,
        timestamp: Date.now(),
        loading: false,
        total: totalCount,
        currentPage: page,
      });

      // 只有当前请求仍然有效时才更新状态
      if (currentRequestRef.current === cacheKey) {
        if (isLoadMore) {
          setDynamicOptions((prev) => [...prev, ...data]);
        } else {
          setDynamicOptions(data);
          setCurrentPage(1);
        }
        setTotal(totalCount);
        setHasMore(data.length === pageSize && data.length < totalCount);
        setCurrentPage(page);
      }
    } catch (error) {
      console.error('Failed to load options:', error);
      // 清除错误的缓存
      cacheManager.delete(cacheKey);
    } finally {
      if (currentRequestRef.current === cacheKey) {
        if (isLoadMore) {
          setLoadingMore(false);
        } else {
          setLoading(false);
        }
      }
    }
  };

  // 加载更多数据
  const loadMoreData = () => {
    if (!loadingMore && hasMore && requestUrl) {
      loadData(currentPage + 1, searchRef.current, true);
    }
  };

  // 滚动事件处理
  const handlePopupScroll = (e: React.UIEvent<HTMLDivElement>) => {
    if (!enableScrollPagination || !hasMore || loadingMore) return;

    const { scrollTop, scrollHeight, clientHeight } = e.currentTarget;
    const scrollBottom = scrollHeight - scrollTop - clientHeight;

    // 当滚动到底部50px内时加载更多
    if (scrollBottom <= 50) {
      loadMoreData();
    }
  };

  // 搜索处理函数
  const handleSearch = (value: string) => {
    searchRef.current = value;
    if (requestUrl) {
      loadData(1, value);
    }
  };

  // 下拉框打开时重置分页状态
  const handleDropdownVisibleChange = (open: boolean) => {
    if (open && requestUrl && !staticOptions) {
      // 重置为第一页
      setCurrentPage(1);
      setHasMore(true);
      loadData(1, searchRef.current);
    }
  };

  // 初始加载
  useEffect(() => {
    if (requestUrl && !staticOptions) {
      loadData(1);
    }
  }, [requestUrl]);

  // 防抖搜索
  useEffect(() => {
    if (!requestUrl) return;

    const timer = setTimeout(() => {
      loadData(1, searchRef.current);
    }, 300);

    return () => clearTimeout(timer);
  }, [searchRef.current, requestUrl]);

  // 使用静态options或动态options
  const finalOptions = staticOptions || dynamicOptions;

  // 渲染下拉菜单底部内容
  const renderDropdownFooter = () => {
    if (!enableScrollPagination || !requestUrl) return null;

    if (loadingMore) {
      return (
        <div style={{ padding: '8px', textAlign: 'center' }}>
          <Spin size="small" /> 加载中...
        </div>
      );
    }

    if (hasMore) {
      return <div style={{ padding: '8px', textAlign: 'center', color: '#999' }}>滚动加载更多</div>;
    }

    if (dynamicOptions.length > 0) {
      return (
        <div style={{ padding: '8px', textAlign: 'center', color: '#999' }}>
          已加载全部数据 ({total} 条)
        </div>
      );
    }

    return null;
  };

  return (
    <Select
      {...selectProps}
      ref={selectRef}
      options={finalOptions}
      loading={loading}
      showSearch={true}
      filterOption={false}
      onSearch={handleSearch}
      onPopupScroll={handlePopupScroll}
      onDropdownVisibleChange={handleDropdownVisibleChange}
      dropdownRender={(menu) => (
        <>
          {menu}
          {renderDropdownFooter()}
        </>
      )}
      notFoundContent={loading ? <Spin size="small" /> : null}
    />
  );
};

export default ListSelect;
